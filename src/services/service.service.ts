import { servicesData } from '../data/servicesData';
import type { ServiceItem } from '../types';
import { adminService } from './admin.service';

export const serviceService = {
  async getAllServices(): Promise<ServiceItem[]> {
    try {
      const res = await adminService.getServices();
      if (res && res.success && Array.isArray(res.services) && res.services.length > 0) {
        localStorage.setItem('sumit_dynamic_services', JSON.stringify(res.services));
        return res.services;
      }
    } catch (e) {
      console.warn('[serviceService] Could not fetch services from backend, using fallback:', e);
    }

    const saved = localStorage.getItem('sumit_dynamic_services');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    return servicesData;
  },

  async getServiceBySlug(slug: string): Promise<ServiceItem | undefined> {
    const services = await this.getAllServices();
    return services.find((s) => s.slug === slug || s.id === slug);
  }
};
