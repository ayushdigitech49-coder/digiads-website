import type { BlogPost } from '../types';
import { fetchApi } from './api';
import { getStoredBlogPosts } from '../utils/blogStore';

export const blogService = {
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      return await fetchApi<BlogPost[]>('/blogs');
    } catch {
      return getStoredBlogPosts();
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      return await fetchApi<BlogPost>(`/blogs/${slug}`);
    } catch {
      const posts = getStoredBlogPosts();
      return posts.find((p) => p.slug === slug || p.id === slug);
    }
  }
};

