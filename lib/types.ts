export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
  };
}

export interface DashboardSummary {
  total_reports: number;
  pending_count: number;
  resolved_count: number;
  reports_this_week: number;
  reports_this_month: number;
}

export interface DashboardReport {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  created_at: string;
  categories: ReportCategoryInfo[];
  location?: ReportLocationInfo;
  impact?: string;
  timeline?: string;
  tag_type?: ReportTagType;
}

export interface ReportDetail extends DashboardReport {
  ticket_id: string;
  updated_at: string;
  verified_at?: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface ReportCategoryInfo {
  category_id: string;
  name: string;
  slug: string;
  severity: ReportSeverity;
  color?: string;
  icon?: string;
}

export interface ReportLocationInfo {
  raw_input: string;
  display_name?: string;
  lat?: number;
  lon?: number;
  province_id?: string;
  province_name?: string;
  regency_id?: string;
  regency_name?: string;
  city?: string;
  road?: string;
  state?: string;
}

export type ReportStatus = 
  | 'draft'
  | 'pending'
  | 'verified'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportTagType = 
  | 'report'
  | 'proposal'
  | 'complaint'
  | 'inquiry'
  | 'appreciation';

export interface CategoryReportSummary {
  id: string;
  name: string;
  slug: string;
  report_count: number;
  color?: string;
  description?: string;
  icon?: string;
}

export interface ProvinceReportSummary {
  id: string;
  name: string;
  code: string;
  report_count: number;
  lat?: number;
  lng?: number;
}

export interface RegencyReportSummary {
  id: string;
  province_id: string;
  name: string;
  code: string;
  report_count: number;
  lat?: number;
  lng?: number;
}

export interface TagReportSummary {
  tag_type: ReportTagType;
  label: string;
  report_count: number;
}

export interface Ticket {
  id: string;
  reference_number: string;
  adk_thread_id: string;
  platform: string;
  status: TicketStatus;
  confidence_score: number;
  completeness_score?: number;
  submitted_at: string;
  processed_at?: string;
  created_at: string;
}

export type TicketStatus = 
  | 'submitted'
  | 'processing'
  | 'completed'
  | 'failed';

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  parent_id?: string;
  color?: string;
  description?: string;
  icon?: string;
}

export interface RateLimitConfig {
  key: string;
  value: number;
  description?: string;
  updated_at: string;
}

export interface Province {
  id: string;
  code: string;
  name: string;
  lat?: number;
  lng?: number;
}

export interface Regency {
  id: string;
  code: string;
  name: string;
  provinceId: string;
  lat?: number;
  lng?: number;
}

export interface MapReportMarker {
  id: string;
  title: string;
  lat: number;
  lon: number;
  status: ReportStatus;
  created_at: string;
  category_slug?: string;
  category_color?: string;
}

export interface User {
  account_id: string;
  sub: string;
  roles: string[];
  session_uid?: string;
}
