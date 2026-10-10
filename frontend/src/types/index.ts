export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';

export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'ONLINE_ASSESSMENT'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'TOP_CHOICE';

export type InterviewType =
  | 'PHONE_SCREEN'
  | 'TECHNICAL'
  | 'SYSTEM_DESIGN'
  | 'BEHAVIORAL'
  | 'HR'
  | 'FINAL_ROUND'
  | 'TAKE_HOME'
  | 'OTHER';

export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  targetRole?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Interview {
  id: string;
  userId: string;
  applicationId: string;
  interviewDate: string;
  interviewType: InterviewType;
  interviewRound: string;
  meetingLink?: string | null;
  location?: string | null;
  preparationNotes?: string | null;
  feedback?: string | null;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
  application?: {
    id: string;
    companyName: string;
    jobTitle: string;
    status?: ApplicationStatus;
    workMode?: WorkMode;
  };
}

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string | null;
  companyWebsite?: string | null;
  jobPostingUrl?: string | null;
  applicationDate?: string | null;
  applicationDeadline?: string | null;
  location?: string | null;
  workMode: WorkMode;
  employmentType?: string | null;
  salaryOrStipend?: string | null;
  status: ApplicationStatus;
  priority: Priority;
  recruiterName?: string | null;
  recruiterEmail?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  interviews?: Interview[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  applicationId?: string | null;
  actionType: string;
  description: string;
  metadata?: any;
  createdAt: string;
  application?: {
    id: string;
    companyName: string;
    jobTitle: string;
    status: ApplicationStatus;
  };
}

export interface DashboardMetrics {
  total: number;
  applied: number;
  wishlist: number;
  oa: number;
  interviews: number;
  offers: number;
  rejected: number;
  withdrawn: number;
  interviewConversionRate: number;
  offerConversionRate: number;
  interviewToOfferRate: number;
}

export interface MonthlyTrendItem {
  month: string;
  applications: number;
  interviews: number;
  offers: number;
}

export interface DashboardOverviewData {
  metrics: DashboardMetrics;
  statusDistribution: { status: ApplicationStatus; count: number }[];
  workModeDistribution: { mode: WorkMode; count: number }[];
  priorityDistribution: { priority: Priority; count: number }[];
  monthlyTrend: MonthlyTrendItem[];
  upcomingInterviews: Interview[];
  upcomingDeadlines: Application[];
  recentActivities: ActivityLog[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
