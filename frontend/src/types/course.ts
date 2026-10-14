import type { BadgeVariant } from "../components/common/Badge";

export interface Course {
  id: string;
  image?: string;
  title: string;
  category: string;
  imageUrl?: string | null;
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
