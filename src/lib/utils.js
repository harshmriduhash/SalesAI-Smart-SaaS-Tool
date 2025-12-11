import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName, params = {}) {
  const paths = {
    dashboard: '/dashboard',
    leads: '/leads',
    leadDetail: '/leads/:id', 
    activities: '/activities',
    login: '/login',
    register: '/register',
  };

  let path = paths[pageName];

  if (!path) {
    console.warn(`Page path for '${pageName}' not found. Returning root path.`);
    return '/';
  }

  // Replace dynamic segments like :id
  for (const key in params) {
    path = path.replace(`:${key}`, params[key]);
  }
  
  // If the path still contains ':id' after replacing (e.g., leadDetail without an actual ID),
  // ensure it's still a valid base path or handle appropriately.
  // For now, if it's a detail page and no ID is provided, it's generally an error or a different view.
  // The current use case is 'leadDetail?id=...' so params will be an object { id: value }

  return path;
}