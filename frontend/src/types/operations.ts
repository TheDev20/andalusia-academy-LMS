import type { PagedResult } from "./catalog";

export type { PagedResult };

export interface AdminUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  isActive: boolean;
  createdAt: string;
  roles: string[];
}

export interface AdminCourseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  publicationStatus: "Draft" | "Published" | "Archived";
  offeringCount: number;
}

export interface UpsertCourseRequest {
  title: string;
  slug: string;
  description: string;
  publicationStatus: "Draft" | "Published" | "Archived";
}

export interface OfferingInstructorDto {
  instructorId: string;
  name: string;
  email: string;
}

export type OfferingStatus = "Planned" | "Published" | "Closed" | "Cancelled";
export const OFFERING_STATUSES: OfferingStatus[] = ["Planned", "Published", "Closed", "Cancelled"];

export interface AdminOfferingDto {
  id: string;
  courseId: string;
  courseTitle: string;
  startsAt: string;
  endsAt: string;
  timeZoneId: string;
  price: number;
  currency: string;
  capacity: number;
  seatsTaken: number;
  status: OfferingStatus;
  instructors: OfferingInstructorDto[];
}

export interface UpsertOfferingRequest {
  courseId: string;
  startsAt: string;
  endsAt: string;
  timeZoneId: string;
  price: number;
  currency: string;
  capacity: number;
  status: OfferingStatus;
}

export interface AdminResourceDto {
  id: string;
  courseOfferingId: string;
  title: string;
  url?: string | null;
  required: boolean;
  sequence: number;
}

export interface UpsertResourceRequest {
  title: string;
  url?: string | null;
  required: boolean;
  sequence: number;
}

export interface AdminLocationDto {
  id: string;
  name: string;
  address?: string | null;
  meetingUrl?: string | null;
}

export interface UpsertLocationRequest {
  name: string;
  address?: string | null;
  meetingUrl?: string | null;
}

export type SessionStatus = "Scheduled" | "Completed" | "Cancelled";
export const SESSION_STATUSES: SessionStatus[] = ["Scheduled", "Completed", "Cancelled"];

export interface AdminSessionDto {
  id: string;
  courseOfferingId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: SessionStatus;
  locationId?: string | null;
  locationName?: string | null;
}

export interface UpsertSessionRequest {
  title: string;
  startsAt: string;
  endsAt: string;
  locationId?: string | null;
  status: SessionStatus;
}

export interface AdminOrderDto {
  id: string;
  applicationId: string;
  learnerId: string;
  learnerEmail: string;
  title: string;
  amountDue: number;
  currency: string;
  status: "PendingPayment" | "Paid" | "Cancelled";
  createdAt: string;
  attemptCount: number;
  paidAt?: string | null;
}

export interface CreateInstructorRequest {
  firstName: string;
  lastName: string;
  email: string;
  temporaryPassword: string;
  biography?: string | null;
}
