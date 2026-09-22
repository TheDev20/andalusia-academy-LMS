export interface Course {
  id: string | number;
  title: string;
  category: string;
  badge?: string;
  badgeVariant?: 'bronze' | 'gold' | 'glass' | 'emerald' | 'subtle';
  duration: string;
  format?: string;
  intake: string;
  rating?: number;
  reviewsCount?: number;
  level?: string;
  summary: string;
}
