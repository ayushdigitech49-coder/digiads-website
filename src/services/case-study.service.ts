import { caseStudiesData } from '../data/caseStudiesData';
import type { CaseStudy } from '../types';
import { fetchApi } from './api';

export const caseStudyService = {
  async getAllCaseStudies(): Promise<CaseStudy[]> {
    try {
      return await fetchApi<CaseStudy[]>('/case-studies');
    } catch {
      return caseStudiesData;
    }
  },

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    try {
      return await fetchApi<CaseStudy>(`/case-studies/${slug}`);
    } catch {
      return caseStudiesData.find((cs) => cs.slug === slug || cs.id === slug);
    }
  }
};
