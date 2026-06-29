/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface UserSocials {
  twitter?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  status?: 'active' | 'suspended';
  socials?: UserSocials;
  avatar?: string;
  passwordHash?: string;
  salt?: string;
}

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'html'
  | 'image'
  | 'button'
  | 'quote'
  | 'divider'
  | 'form'
  | 'social-embed'
  | 'pdf-block'
  | 'rich-text';

export interface VisualBlock {
  id: string;
  type: BlockType;
  settings: {
    text?: string;
    level?: 1 | 2 | 3 | 4; // for heading
    html?: string; // for custom html
    imageUrl?: string;
    imageAlt?: string;
    imageTitle?: string;
    imageDescription?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    bgColor?: string;
    padding?: 'none' | 'small' | 'medium' | 'large';
    buttonUrl?: string;
    formId?: string; // for embedded form
    embedType?: 'youtube' | 'twitter' | 'instagram' | 'tiktok' | 'custom';
    embedUrl?: string;
    pdfUrl?: string;
    pdfTitle?: string;
  };
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: VisualBlock[]; // visual builder structured content
  rawHtml?: string; // fallback or custom raw HTML mode
  mode: 'visual' | 'html';
  published: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  
  // Blog/Magazine Fields
  featuredImage?: string;
  featuredImageTitle?: string;
  featuredImageAlt?: string;
  featuredImageDescription?: string;
  tags?: string[];
  category?: string;
  attachedImages?: string[];
  attachedPdfUrl?: string;
  attachedPdfName?: string;
  
  // SEO Fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  schemaType?: 'Article' | 'BlogPosting' | 'FAQPage' | 'WebPage' | 'Event';
  schemaData?: string; // Custom JSON string for JSON-LD properties
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'checkbox';
  required: boolean;
  placeholder?: string;
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
  emailTo: string;
  successMessage: string;
  createdAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, string | boolean>;
  status: 'pending' | 'sent' | 'failed';
  smtpLog?: string;
  submittedAt: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  enabled: boolean;
}

export interface AnalyticsEvent {
  id: string;
  path: string;
  referrer: string;
  ip: string;
  userAgent: string;
  sessionId: string;
  timestamp: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  message: string;
  context?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface BusinessSocials {
  twitter?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  accentColor: string;
  logoLetter: string;
  frontPageArticlesCount?: number;
  frontPageColumnsCount?: number;
  seoKeywords?: string;
  logoImage?: string;
  logoMode?: 'text_only' | 'logo_only' | 'both';
  websiteType?: 'blog' | 'news' | 'agency' | 'portfolio' | 'business';
  setupCompleted?: boolean;
  headerMenu?: MenuItem[];
  footerMenu?: MenuItem[];
  businessSocials?: BusinessSocials;
  
  // Advanced features
  showMonogram?: boolean;
  logoIcon?: string;
  headerCustomCode?: string;
  bodyCustomCode?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleVerification?: string;
  enableLazyLoading?: boolean;
  businessAddress?: string;
  businessPhone?: string;
  businessGeoLatitude?: string;
  businessGeoLongitude?: string;
  domainName?: string;
  timezone?: string;
  
  // Security & Captcha Protection Settings
  captchaEnabled?: boolean;
  captchaMode?: 'built_in_math' | 'external';
  captchaProvider?: 'google_recaptcha' | 'cloudflare_turnstile' | 'hcaptcha';
  captchaSiteKey?: string;
  captchaSecretKey?: string;
  allowPublicSignup?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface RedirectRule {
  id: string;
  source: string;
  destination: string;
  statusCode: number; // 301 or 302
  createdAt: string;
}
