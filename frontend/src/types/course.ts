import type { BadgeVariant } from "../components/common/Badge";

export interface Course {
  id: string;
  title: string;
  category: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  duration: string;
  format?: string;
  intake: string;
  rating?: number;
  reviewsCount?: number;
  level?: string;
  summary: string;
}
