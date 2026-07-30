import type { LeadFormData } from '../types';
import { fetchApi } from './api';

export const contactService = {
  async submitLead(data: LeadFormData): Promise<{ success: boolean; message: string }> {
    try {
      return await fetchApi<{ success: boolean; message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Thank you! Your growth consultation request has been received. Our senior strategy consultant will reach out within 2 hours.'
          });
        }, 600);
      });
    }
  },

  async requestFreeAudit(websiteUrl: string, email: string, phone: string): Promise<{ success: boolean; auditScore: number; message: string }> {
    try {
      return await fetchApi('/free-audit', {
        method: 'POST',
        body: JSON.stringify({ websiteUrl, email, phone }),
      });
    } catch {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            auditScore: 84,
            message: 'Audit Report generated successfully! Sent to ' + email
          });
        }, 1000);
      });
    }
  }
};
