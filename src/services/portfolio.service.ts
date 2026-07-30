import { portfolioData } from '../data/portfolioData';
import type { PortfolioItem } from '../types';
import { fetchApi } from './api';

export const portfolioService = {
  async getPortfolio(): Promise<PortfolioItem[]> {
    try {
      return await fetchApi<PortfolioItem[]>('/portfolio');
    } catch {
      return portfolioData;
    }
  }
};
