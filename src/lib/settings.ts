import { prisma } from './db';

export async function getSiteSetting(key: string, defaultValue = ''): Promise<string> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });
    return setting?.value ?? defaultValue;
  } catch (error) {
    console.error(`Error loading setting ${key}:`, error);
    return defaultValue;
  }
}

export async function getAllSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    const config: Record<string, string> = {};
    settings.forEach((s) => {
      config[s.key] = s.value;
    });
    return config;
  } catch (error) {
    console.error('Error loading all settings:', error);
    return {};
  }
}
