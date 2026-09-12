export type Language = 'en' | 'sw';

export type ProjectCategory = 
  | 'education' 
  | 'healthcare' 
  | 'orphans' 
  | 'women_youth' 
  | 'environment' 
  | 'emergency';

export type ProjectStatus = 'planned' | 'active' | 'completed' | 'archived';

export interface Project {
  id: string;
  title: string;
  titleSw: string;
  slug?: string;
  category: ProjectCategory;
  description: string;
  descriptionSw: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  targetAmount: number; // In TZS
  amountRaised: number; // In TZS
  currency: string;
  featuredImage: string;
  gallery: string[];
  beneficiariesCount: number;
  impactMetrics?: {
    label: string;
    labelSw: string;
    value: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export type DonationType = 'money' | 'food' | 'clothes' | 'school_supplies' | 'medical_supplies' | 'other';
export type PaymentMethod = 'mpesa' | 'airtel' | 'tigopesa' | 'halopesa' | 'bank_transfer' | 'card' | 'manual';
export type DonationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface Donation {
  id: string;
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  isAnonymous: boolean;
  donationType: DonationType;
  amount?: number; // In TZS or USD
  currency: 'TZS' | 'USD';
  projectId?: string;
  projectName?: string;
  paymentMethod?: PaymentMethod;
  transactionReference: string;
  status: DonationStatus;
  message?: string;
  physicalItemsDescription?: string;
  createdAt: string;
  completedAt?: string;
}

export type VolunteerStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
export type VolunteerArea = 
  | 'education' 
  | 'healthcare' 
  | 'environment' 
  | 'community_development' 
  | 'fundraising' 
  | 'it_tech' 
  | 'media' 
  | 'event_management' 
  | 'emergency_response' 
  | 'orphans'
  | 'women_youth'
  | 'other';

export interface VolunteerApplication {
  id: string;
  applicationCode: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location: string;
  occupation: string;
  skills: string[];
  areasOfInterest: VolunteerArea[];
  availability: 'weekdays' | 'weekends' | 'full_time' | 'flexible';
  previousExperience?: string;
  motivation: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  consentAgreed: boolean;
  status: VolunteerStatus;
  notes?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type NewsStatus = 'draft' | 'published' | 'archived';
export type NewsCategory = 'update' | 'event' | 'story' | 'press';

export interface NewsArticle {
  id: string;
  title: string;
  titleSw: string;
  slug?: string;
  content: string;
  contentSw: string;
  summary: string;
  summarySw: string;
  featuredImage: string;
  author: string;
  category: NewsCategory;
  eventDate?: string;
  location?: string;
  publishedDate: string;
  status: NewsStatus;
  gallery?: string[];
  tags: string[];
  createdAt: string;
}

export interface MediaItem {
  id: string;
  title: string;
  titleSw: string;
  description?: string;
  descriptionSw?: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  category: ProjectCategory | 'general' | 'events';
  projectId?: string;
  uploadedBy?: string;
  createdAt: string;
}

export type GalleryItem = MediaItem;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
  replyNotes?: string;
}

export interface SiteSettings {
  id: string;
  organizationName: string;
  taglineEn: string;
  taglineSw: string;
  foundedDate: string;
  phone: string;
  phoneAlt: string;
  email: string;
  address: string;
  city: string;
  country: string;
  googleMapsEmbedUrl: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  paymentAccounts: {
    mpesaNumber: string;
    mpesaName: string;
    tigopesaNumber: string;
    tigopesaName: string;
    airtelNumber: string;
    airtelName: string;
    halopesaNumber: string;
    halopesaName: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankBranch: string;
    swiftCode: string;
  };
  aiEnabled: boolean;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  performedBy?: string;
  action: string;
  resource?: string;
  entityType?: string;
  resourceId?: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'volunteer_manager' | 'finance_manager';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  photoURL?: string;
  lastLogin?: string;
}
