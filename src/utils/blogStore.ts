import { blogPosts as defaultBlogPosts } from '../data/blogData';
import type { BlogPost } from '../types';

const STORAGE_KEY = 'sumit_digitech_blog_posts';
const EVENT_NAME = 'sumit_digitech_blog_updated';

export const getStoredBlogPosts = (): BlogPost[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasSeed = parsed.some((p: BlogPost) => p.id === defaultBlogPosts[0].id || p.slug === defaultBlogPosts[0].slug);
        if (!hasSeed) {
          const merged = [defaultBlogPosts[0], ...parsed];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading blog posts from localStorage', e);
  }
  return defaultBlogPosts;
};

export const saveStoredBlogPosts = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: posts }));
  } catch (e) {
    console.error('Error saving blog posts to localStorage', e);
  }
};

export const subscribeBlogUpdates = (callback: (posts: BlogPost[]) => void) => {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<BlogPost[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredBlogPosts());
    }
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
};
