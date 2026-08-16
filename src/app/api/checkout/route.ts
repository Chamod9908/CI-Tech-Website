import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { OrderStatus, PaymentStatus, DeliveryMethod, PaymentMethod, InventoryAction } from '@prisma/client';

interface SelectedOptionPayload {
  option: string;
  value: string;
  priceAdjustment: number;
}

interface CartItemPayload {
  productId: string;
  name: string;
  quantity: number;
  specialInstructions?: string | null;
  selectedOptions?: SelectedOptionPayload[];
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      district,
      deliveryMethod,
      paymentMethod,
      cartItems, // Array of cart items from context
      couponCode,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !district || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Missing required shipping or cart details' }, { status: 400 });
    }

    // 1. Resolve Delivery Fee from Zone database
    const zone = await prisma.deliveryZone.findFirst({
      where: { name: district, isActive: true },
    }) || await prisma.deliveryZone.findFirst({
      where: { name: 'Other Districts' },
    });

    const deliveryFee = deliveryMethod === DeliveryMethod.STORE_PICKUP ? 0 : Number(zone?.deliveryFee || 600);

    // 2. Fetch products and check stock / calculate pricing
    let subtotal = 0;
    const itemsToCreate: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
      specialInstructions?: string | null;
      options: { optionName: string; optionValue: string; priceAdjustment: number }[];
    }[] = [];
    
    const stockUpdates: { productId: string; qty: number; name: string }[] = [];

    const typedCartItems = cartItems as CartItemPayload[];

    for (const item of typedCartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product "${item.name}" is no longer available.` }, { status: 400 });
      }

      // Verify stock
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for "${item.name}". Only ${product.stock} left.` }, { status: 400 });
      }

      // Calculate options price adjustment
      let unitPrice = Number(product.salePrice || product.price);
      const chosenOptions = item.selectedOptions || [];
      chosenOptions.forEach((o) => {
        unitPrice += Number(o.priceAdjustment || 0);
      });

      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      itemsToCreate.push({
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        specialInstructions: item.specialInstructions,
        options: chosenOptions.map((o) => ({
          optionName: o.option,
          optionValue: o.value,
          priceAdjustment: Number(o.priceAdjustment || 0),
        })),
      });

      // Prepare stock update refs
      stockUpdates.push({
        productId: product.id,
        qty: item.quantity,
        name: product.name,
      });
    }

    // 3. Process Coupons
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const start = coupon.startDate ? new Date(coupon.startDate) : null;
        const end = coupon.endDate ? new Date(coupon.endDate) : null;

        const isStarted = !start || now >= start;
        const isNotExpired = !end || now <= end;
        const underLimit = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;

        if (isStarted && isNotExpired && underLimit) {
          if (coupon.type === 'PERCENTAGE') {
            discount = subtotal * (Number(coupon.value) / 100);
          } else {
            discount = Math.min(Number(coupon.value), subtotal);
          }
        }
      }
    }

    const grandTotal = subtotal - discount + deliveryFee;

    // 4. Submit Order inside atomic transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find default system administrator for fallback audit records
      const systemAdmin = await tx.user.findFirst({ where: { role: 'ADMIN' } });
      const changedByUserId = session?.userId || systemAdmin?.id || '';

      // Create Customer profile if authenticated but not registered
      let customerId: string | null = null;
      if (session) {
        let customer = await tx.customer.findFirst({
          where: { userId: session.userId },
        });

        if (!customer) {
          customer = await tx.customer.create({
            data: {
              userId: session.userId,
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
            },
          });
        }
        customerId = customer.id;
      }

      // Generate order number: CL-YYYYMMDD-XXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const count = await tx.order.count();
      const orderNumber = `CL-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          subtotal,
          discount,
          deliveryFee,
          grandTotal,
          paymentMethod: paymentMethod as PaymentMethod,
          paymentStatus: paymentMethod === 'ONLINE' ? PaymentStatus.PAID : PaymentStatus.PENDING,
          status: OrderStatus.NEW_ORDER,
          deliveryMethod: deliveryMethod as DeliveryMethod,
          items: {
            create: itemsToCreate.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.subtotal,
              specialInstructions: item.specialInstructions,
              options: {
                create: item.options.map((opt) => ({
                  optionName: opt.optionName,
                  optionValue: opt.optionValue,
                  priceAdjustment: opt.priceAdjustment,
                })),
              },
            })),
          },
          statusHistory: {
            create: [{
              status: OrderStatus.NEW_ORDER,
              notes: 'Order placed successfully by customer.',
              changedByUserId: changedByUserId || '',
            }],
          },
        },
      });

      // Update stocks and write inventory logs
      for (const update of stockUpdates) {
        const prod = await tx.product.update({
          where: { id: update.productId },
          data: {
            stock: { decrement: update.qty },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            productId: update.productId,
            action: InventoryAction.STOCK_OUT,
            quantity: -update.qty,
            previousStock: prod.stock + update.qty,
            newStock: prod.stock,
            userId: changedByUserId || '',
            reason: `Stock decremented for Order ${orderNumber}`,
          },
        });
      }

      // Increment coupon usage if applied
      if (couponCode && discount > 0) {
        await tx.coupon.update({
          where: { code: couponCode },
          data: {
            usageCount: { increment: 1 },
          },
        });
      }

      return newOrder;
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to place your order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
