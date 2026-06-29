/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  ClipboardList, 
  Database, 
  LogOut, 
  Mail, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  ArrowLeft, 
  MoveUp, 
  MoveDown, 
  Globe, 
  Check, 
  AlertTriangle, 
  PlayCircle,
  Eye,
  FileCode,
  ShieldCheck,
  Send,
  Sparkles,
  Upload,
  Image,
  Menu,
  MessageSquare,
  Tag,
  ArrowRightLeft,
  RefreshCw,
  CheckCircle,
  UserX,
  UserCheck,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { 
  User, 
  Post, 
  Form, 
  FormSubmission, 
  SMTPConfig, 
  AnalyticsEvent, 
  SystemLog, 
  UserRole,
  VisualBlock,
  BlockType,
  SiteSettings
} from './types';
import GoPixelLogo from './components/GoPixelLogo';

export default function App() {
  // Session / Auth States
  const [token, setToken] = useState<string | null>(localStorage.getItem('cms_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Sign Up / Registration States
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpCaptchaChallenge, setSignUpCaptchaChallenge] = useState<{ id: string; question: string } | null>(null);
  const [signUpCaptchaAnswer, setSignUpCaptchaAnswer] = useState('');

  // Active View Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'forms' | 'submissions' | 'smtp' | 'logs' | 'users' | 'profile' | 'customizer' | 'media' | 'menus' | 'comments' | 'redirects'>('dashboard');

  // Core CMS Data States
  const [posts, setPosts] = useState<Post[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [redirectRules, setRedirectRules] = useState<any[]>([]);

  // Visual Post Editor State
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form Editor State
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newFormEmail, setNewFormEmail] = useState('');
  const [newFormSuccess, setNewFormSuccess] = useState('');
  const [newFormFields, setNewFormFields] = useState<Array<{ label: string; type: 'text' | 'email' | 'textarea' | 'checkbox'; required: boolean }>>([
    { label: 'Your Name', type: 'text', required: true }
  ]);

  // SMTP Settings Input States
  const [smtpInputs, setSmtpInputs] = useState({
    host: '',
    port: 2525,
    secure: false,
    user: '',
    pass: '',
    fromName: '',
    fromEmail: '',
    enabled: false
  });
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Manual User Account Provisioning State
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('author');

  // Installation States
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);

  // New Installation Wizard Form States
  const [installWebsiteType, setInstallWebsiteType] = useState<'blog' | 'news' | 'agency' | 'portfolio' | 'business'>('blog');
  const [installSiteName, setInstallSiteName] = useState('My Web Platform');
  const [installSiteTagline, setInstallSiteTagline] = useState('WordPress Simplicity. Static HTML Speed.');
  const [installDomainName, setInstallDomainName] = useState('localhost');
  const [installTimezone, setInstallTimezone] = useState('UTC');
  const [installAdminUsername, setInstallAdminUsername] = useState('admin');
  const [installAdminFullName, setInstallAdminFullName] = useState('Administrator');
  const [installAdminEmail, setInstallAdminEmail] = useState('admin@yourdomain.com');
  const [installAdminPassword, setInstallAdminPassword] = useState('');
  const [installLoading, setInstallLoading] = useState(false);
  const [installError, setInstallError] = useState('');

  // Advanced Categories & Redirect Form States
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newRedirectSource, setNewRedirectSource] = useState('');
  const [newRedirectDestination, setNewRedirectDestination] = useState('');
  const [newRedirectCode, setNewRedirectCode] = useState<number>(301);

  // Site Customizer & Visual Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'GoPixel CMS',
    siteTagline: 'WordPress Simplicity. Static HTML Speed.',
    siteDescription: 'This system compiles elegant visual block structures into pure semantic HTML with instant server-side page responses, metadata, dynamic sitemaps, and custom forms routing.',
    accentColor: '#0F766E',
    logoLetter: 'G',
    frontPageArticlesCount: 6,
    frontPageColumnsCount: 3,
    seoKeywords: 'GoPixel, CMS, Server-Side Rendering, Visual Builder, SEO, Static HTML'
  });
  const [customizerInputs, setCustomizerInputs] = useState<SiteSettings>({
    siteName: '',
    siteTagline: '',
    siteDescription: '',
    accentColor: '#0F766E',
    logoLetter: 'G',
    frontPageArticlesCount: 6,
    frontPageColumnsCount: 3,
    seoKeywords: ''
  });

  const loadSignUpCaptcha = async () => {
    try {
      const res = await fetch('/api/captcha/challenge');
      const data = await res.json();
      setSignUpCaptchaChallenge({ id: data.challengeId, question: data.question });
      setSignUpCaptchaAnswer('');
    } catch (err) {
      console.error('Failed to load signup captcha challenge', err);
    }
  };

  useEffect(() => {
    if (isSignUpMode && siteSettings?.captchaEnabled && siteSettings?.captchaMode === 'built_in_math') {
      loadSignUpCaptcha();
    }
  }, [isSignUpMode, siteSettings]);

  // Status message states (toasts)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Setup Wizard States
  const [setupWebsiteType, setSetupWebsiteType] = useState<string>('blog');
  const [setupSiteName, setSetupSiteName] = useState<string>('My Creative Blog');
  const [setupSiteTagline, setSetupSiteTagline] = useState<string>('Insights, thoughts, and lessons learned.');
  const [isSubmittingSetup, setIsSubmittingSetup] = useState<boolean>(false);

  // Media Library States
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);

  // Custom Navigation Menus & Socials States
  const [headerMenu, setHeaderMenu] = useState<{ label: string; url: string }[]>([]);
  const [footerMenu, setFooterMenu] = useState<{ label: string; url: string }[]>([]);
  const [businessSocials, setBusinessSocials] = useState({
    twitter: '',
    linkedin: '',
    github: '',
    facebook: '',
    instagram: '',
    youtube: ''
  });

  const fetchMediaFiles = () => {
    setLoadingMedia(true);
    fetch('/api/media', { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMediaFiles(data);
        } else if (data && Array.isArray(data.media)) {
          setMediaFiles(data.media);
        }
        setLoadingMedia(false);
      })
      .catch(err => {
        console.error('Error loading media assets', err);
        setLoadingMedia(false);
      });
  };

  useEffect(() => {
    if (activeTab === 'media' && currentUser) {
      fetchMediaFiles();
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    if (siteSettings) {
      setHeaderMenu(siteSettings.headerMenu || [
        { label: 'Home', url: '/' },
        { label: 'Sitemap', url: '/sitemap.xml' }
      ]);
      setFooterMenu(siteSettings.footerMenu || [
        { label: 'Home', url: '/' },
        { label: 'Sitemap', url: '/sitemap.xml' }
      ]);
      setBusinessSocials(siteSettings.businessSocials || {
        twitter: '',
        linkedin: '',
        github: '',
        facebook: '',
        instagram: '',
        youtube: ''
      });
    }
  }, [siteSettings]);

  // Profile Personal Socials State & Handler
  const [profileSocials, setProfileSocials] = useState({
    twitter: '',
    linkedin: '',
    github: '',
    facebook: ''
  });

  useEffect(() => {
    if (currentUser && currentUser.socials) {
      setProfileSocials({
        twitter: currentUser.socials.twitter || '',
        linkedin: currentUser.socials.linkedin || '',
        github: currentUser.socials.github || '',
        facebook: currentUser.socials.facebook || ''
      });
    }
  }, [currentUser]);

  const saveProfileSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/profile/socials', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileSocials)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update socials');
      showToast('success', 'Personal social media links updated!');
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          socials: profileSocials
        });
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Helpers
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Load site settings on mount (Publicly available)
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.siteSettings) {
          setSiteSettings(data.siteSettings);
          setCustomizerInputs(data.siteSettings);
        }
        if (data.hasUsers !== undefined) setHasUsers(data.hasUsers);
        if (data.setupCompleted !== undefined) setSetupCompleted(data.setupCompleted);
      })
      .catch(err => console.error('Error fetching site settings on startup', err));
  }, []);

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // 1. Fetch current logged-in user profile
  useEffect(() => {
    if (token) {
      localStorage.setItem('cms_token', token);
      fetch('/api/auth/me', { headers: getHeaders() })
        .then(res => {
          if (!res.ok) throw new Error('Session invalid');
          return res.json();
        })
        .then(data => {
          setCurrentUser(data.user);
        })
        .catch(() => {
          handleLogout();
        });
    } else {
      localStorage.removeItem('cms_token');
      setCurrentUser(null);
    }
  }, [token]);

  // 2. Fetch CMS Data once logged in
  useEffect(() => {
    if (currentUser) {
      loadAllCmsData();
    }
  }, [currentUser, activeTab]);

  const loadAllCmsData = async () => {
    const headers = getHeaders();
    try {
      // Load Site Settings
      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      if (settingsData.siteSettings) {
        setSiteSettings(settingsData.siteSettings);
        setCustomizerInputs(settingsData.siteSettings);
      }

      // Load Posts
      const postsRes = await fetch('/api/posts?all=true', { headers });
      const postsData = await postsRes.json();
      setPosts(postsData.posts || []);

      // Load Forms
      const formsRes = await fetch('/api/forms', { headers });
      const formsData = await formsRes.json();
      setForms(formsData.forms || []);

      // Load Submissions
      const subRes = await fetch('/api/submissions', { headers });
      const subData = await subRes.json();
      setSubmissions(subData.submissions || []);

      // Load Analytics
      const analyticsRes = await fetch('/api/analytics', { headers });
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      // Load SMTP for admin
      if (currentUser.role === 'admin') {
        const smtpRes = await fetch('/api/smtp', { headers });
        const smtpData = await smtpRes.json();
        if (smtpData.smtpConfig) {
          setSmtpConfig(smtpData.smtpConfig);
          setSmtpInputs({
            host: smtpData.smtpConfig.host || '',
            port: smtpData.smtpConfig.port || 2525,
            secure: smtpData.smtpConfig.secure || false,
            user: smtpData.smtpConfig.user || '',
            pass: smtpData.smtpConfig.pass || '',
            fromName: smtpData.smtpConfig.fromName || '',
            fromEmail: smtpData.smtpConfig.fromEmail || '',
            enabled: smtpData.smtpConfig.enabled || false
          });
        }

        // Load System logs
        const logsRes = await fetch('/api/logs', { headers });
        const logsData = await logsRes.json();
        setSystemLogs(logsData.logs || []);

        // Load Users
        const usersRes = await fetch('/api/users', { headers });
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // Load Categories (Public)
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      setCategories(catData.categories || []);

      // Load Comments (Admin and Editor only)
      if (currentUser.role === 'admin' || currentUser.role === 'editor') {
        const commRes = await fetch('/api/comments/moderation', { headers });
        const commData = await commRes.json();
        setComments(commData.comments || []);
      } else {
        setComments([]);
      }

      // Load Redirect Rules (Admin only)
      if (currentUser.role === 'admin') {
        const redRes = await fetch('/api/redirects', { headers });
        const redData = await redRes.json();
        setRedirectRules(redData.redirects || []);
      } else {
        setRedirectRules([]);
      }
    } catch (e) {
      console.error('Failed loading CMS data', e);
    }
  };

  const handleInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    setInstallError('');
    setInstallLoading(true);

    if (!installSiteName.trim() || !installDomainName.trim() || !installAdminUsername.trim() || !installAdminFullName.trim() || !installAdminEmail.trim() || !installAdminPassword.trim()) {
      setInstallError('All fields marked as mandatory are required.');
      setInstallLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/setup/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteType: installWebsiteType,
          siteName: installSiteName,
          siteTagline: installSiteTagline,
          domainName: installDomainName,
          timezone: installTimezone,
          adminUsername: installAdminUsername,
          adminFullName: installAdminFullName,
          adminEmail: installAdminEmail,
          adminPassword: installAdminPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete initial installation.');
      
      showToast('success', 'CMS Installed successfully! Welcome aboard, Superadmin!');
      setToken(data.token);
      setCurrentUser(data.user);
      setSiteSettings(data.siteSettings);
      setCustomizerInputs(data.siteSettings);
      setSetupCompleted(true);
      setHasUsers(true);
    } catch (err: any) {
      setInstallError(err.message);
    } finally {
      setInstallLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
    })
      .then(res => {
        if (!res.ok) return res.json().then(d => { throw new Error(d.error || 'Login failed') });
        return res.json();
      })
      .then(data => {
        setToken(data.token);
        setLoginLoading(false);
      })
      .catch(err => {
        setLoginError(err.message);
        setLoginLoading(false);
      });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpSuccess('');
    setSignUpLoading(true);

    if (!signUpFullName.trim() || !signUpUsername.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setSignUpError('All fields are required.');
      setSignUpLoading(false);
      return;
    }

    try {
      const payload: any = {
        fullName: signUpFullName,
        username: signUpUsername.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword
      };

      if (siteSettings?.captchaEnabled) {
        if (siteSettings?.captchaMode === 'built_in_math') {
          payload.captchaChallengeId = signUpCaptchaChallenge?.id;
          payload.captchaAnswer = signUpCaptchaAnswer;
        } else {
          const turnstileToken = (window as any).turnstile?.getResponse?.() || '';
          const recToken = (window as any).grecaptcha?.getResponse?.() || '';
          const hToken = (window as any).hcaptcha?.getResponse?.() || '';
          payload.captchaToken = turnstileToken || recToken || hToken || '';
        }
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setSignUpSuccess(data.message || 'Account created successfully! You can now sign in.');
      setSignUpFullName('');
      setSignUpUsername('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpCaptchaAnswer('');
      
      setTimeout(() => {
        setIsSignUpMode(false);
        setLoginUsername(signUpUsername);
        setSignUpSuccess('');
      }, 3000);
    } catch (err: any) {
      setSignUpError(err.message);
      if (siteSettings?.captchaEnabled && siteSettings?.captchaMode === 'built_in_math') {
        loadSignUpCaptcha();
      }
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('cms_token');
  };

  // -------------------------------------------------------------------------
  // Visual Builder Actions
  // -------------------------------------------------------------------------
  const initNewPost = () => {
    setEditingPost({
      id: '',
      title: 'Untitled Dynamic Article',
      slug: 'untitled-article-' + Math.floor(Math.random() * 1000),
      mode: 'visual',
      content: [
        {
          id: 'b-' + Date.now() + '-1',
          type: 'heading',
          settings: { text: 'Heading of the Dynamic Article', level: 1, align: 'center', color: '#111827' }
        },
        {
          id: 'b-' + Date.now() + '-2',
          type: 'paragraph',
          settings: { text: 'Write some engaging paragraph details here...', align: 'center', color: '#4B5563' }
        }
      ],
      rawHtml: '',
      published: false,
      authorId: currentUser?.id || 'unknown',
      authorName: currentUser?.fullName || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seoTitle: 'Untitled Dynamic Article',
      seoDescription: 'Read our dynamic post built on the HTML Visual Builder workspace.',
      seoKeywords: 'cms, article, dynamic content',
      schemaType: 'Article',
      schemaData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Untitled Dynamic Article",
        "description": "Read our dynamic post built on the HTML Visual Builder workspace."
      }, null, 2)
    });
    setIsCreatingPost(true);
  };

  const savePost = async () => {
    if (!editingPost) return;
    if (!editingPost.title.trim()) {
      showToast('error', 'Post Title is required.');
      return;
    }
    if (!editingPost.slug.trim()) {
      showToast('error', 'URL Slug is required.');
      return;
    }

    setIsSavingPost(true);
    const headers = getHeaders();
    const isNew = isCreatingPost;
    const url = isNew ? '/api/posts' : `/api/posts/${editingPost.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(editingPost)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed saving post');

      showToast('success', `Post "${editingPost.title}" saved successfully!`);
      setEditingPost(null);
      setIsCreatingPost(false);
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setIsSavingPost(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this post? This is irreversible.')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Deletion failed');
      showToast('success', 'Post removed successfully.');
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete');
    }
  };

  // Block Editing utilities
  const updateBlockSettings = (blockId: string, updatedSettings: any) => {
    if (!editingPost) return;
    const newContent = editingPost.content.map(b => {
      if (b.id === blockId) {
        return { ...b, settings: { ...b.settings, ...updatedSettings } };
      }
      return b;
    });
    setEditingPost({ ...editingPost, content: newContent });
  };

  const addBlock = (type: BlockType) => {
    if (!editingPost) return;
    const initialSettings: Record<BlockType, any> = {
      heading: { text: 'Heading Title Text', level: 2, align: 'left', color: '#1F2937' },
      paragraph: { text: 'Write standard readable paragraph details...', align: 'left', color: '#4B5563' },
      html: { html: '<div class="p-6 bg-slate-50 border border-slate-100 rounded-xl">Custom HTML elements</div>' },
      image: { imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80', imageAlt: 'Captioned asset image' },
      button: { text: 'Interactive CTA', buttonUrl: 'https://google.com', align: 'left', color: '#0F766E' },
      quote: { text: 'A notable expert citation quote...', color: '#0F766E' },
      divider: {},
      form: { formId: forms[0]?.id || '' },
      'social-embed': { embedType: 'youtube', embedUrl: '' },
      'pdf-block': { pdfUrl: '', pdfTitle: '' },
      'rich-text': { html: '<p class="text-slate-700">Paste your styled content here (visual copy-paste is fully supported). You can also type directly.</p>' }
    };

    const newBlock: VisualBlock = {
      id: 'b-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type,
      settings: initialSettings[type] || {}
    };

    setEditingPost({
      ...editingPost,
      content: [...editingPost.content, newBlock]
    });
  };

  const handleImageUpload = async (blockId: string, file: File) => {
    if (!file) return;
    
    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Only image files are supported.');
      return;
    }
    
    setUploadingBlockId(blockId);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload image file.');
      }
      
      const data = await res.json();
      updateBlockSettings(blockId, { imageUrl: data.url });
      showToast('success', 'Image uploaded successfully!');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err.message || 'Image upload failed.');
      showToast('error', err.message || 'Failed to upload image.');
    } finally {
      setUploadingBlockId(null);
    }
  };

  const removeBlock = (blockId: string) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      content: editingPost.content.filter(b => b.id !== blockId)
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!editingPost) return;
    const blocks = [...editingPost.content];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;

    // Swap
    const temp = blocks[index];
    blocks[index] = blocks[targetIdx];
    blocks[targetIdx] = temp;

    setEditingPost({
      ...editingPost,
      content: blocks
    });
  };

  // -------------------------------------------------------------------------
  // Form Creator Actions
  // -------------------------------------------------------------------------
  const saveForm = async () => {
    if (!newFormName.trim()) {
      showToast('error', 'Form name is required');
      return;
    }
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name: newFormName,
          emailTo: newFormEmail || 'admin@auracms.local',
          successMessage: newFormSuccess || 'Submitted successfully!',
          fields: newFormFields
        })
      });
      if (!res.ok) throw new Error('Form creation failed');
      showToast('success', `Dynamic form "${newFormName}" established!`);
      setIsCreatingForm(false);
      setNewFormName('');
      setNewFormEmail('');
      setNewFormSuccess('');
      setNewFormFields([{ label: 'Your Name', type: 'text', required: true }]);
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form definition? Embedded forms on pages will break.')) return;
    try {
      const res = await fetch(`/api/forms/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Delete form failed');
      showToast('success', 'Form schema deleted.');
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // -------------------------------------------------------------------------
  // SMTP Actions
  // -------------------------------------------------------------------------
  const saveSmtpSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/smtp', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(smtpInputs)
      });
      if (!res.ok) throw new Error('Failed updating settings');
      showToast('success', 'Custom SMTP host details updated.');
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const testSmtpConnection = async () => {
    setSmtpTesting(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch('/api/smtp/test', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(smtpInputs)
      });
      const data = await res.json();
      if (!res.ok) {
        setSmtpTestResult({ success: false, message: data.error || 'SMTP Connection Failed' });
      } else {
        setSmtpTestResult({ success: true, message: data.message });
      }
    } catch (err: any) {
      setSmtpTestResult({ success: false, message: err.message || 'SMTP timeout error' });
    } finally {
      setSmtpTesting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Site Customizer Actions
  // -------------------------------------------------------------------------
  const saveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customizerInputs.siteName.trim()) {
      showToast('error', 'Site name is required');
      return;
    }
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(customizerInputs)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed updating site settings');
      showToast('success', 'Site branding and layout settings updated!');
      setSiteSettings(data.siteSettings);
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const saveMenusAndSocials = async () => {
    try {
      const payload = {
        ...siteSettings,
        headerMenu,
        footerMenu,
        businessSocials
      };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save menus and social settings');
      showToast('success', 'Navigation menus and business social channels updated!');
      setSiteSettings(data.siteSettings);
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleSetupWizardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupSiteName.trim()) {
      showToast('error', 'Site Name is required');
      return;
    }
    setIsSubmittingSetup(true);
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          websiteType: setupWebsiteType,
          siteName: setupSiteName,
          siteTagline: setupSiteTagline
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Setup failed');
      showToast('success', `Website type "${setupWebsiteType}" generated with prebuilt layouts!`);
      
      // Update local states
      if (data.siteSettings) {
        setSiteSettings(data.siteSettings);
        setCustomizerInputs(data.siteSettings);
      }
      
      // Force reload posts to show the beautiful pre-populated templates
      const postsRes = await fetch('/api/posts', { headers: getHeaders() });
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
      
      // Jump to dashboard
      setActiveTab('dashboard');
    } catch (err: any) {
      showToast('error', err.message || 'Setup initialization error');
    } finally {
      setIsSubmittingSetup(false);
    }
  };

  // -------------------------------------------------------------------------
  // RBAC Role Editing
  // -------------------------------------------------------------------------
  const changeUserRole = async (userId: string, role: UserRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to update role');
      showToast('success', 'User role updated successfully.');
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const changeUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to update status');
      showToast('success', `User status successfully updated to ${status.toUpperCase()}.`);
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const createUser = async (payload: any) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      showToast('success', `User account ${payload.username} has been manually provisioned.`);
      loadAllCmsData();
      return true;
    } catch (err: any) {
      showToast('error', err.message);
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      showToast('success', 'User account permanently purged from workspace.');
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Categories Handlers
  const addCategory = async (name: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ category: name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');
      showToast('success', `Category "${name}" added successfully.`);
      loadAllCmsData();
      return true;
    } catch (err: any) {
      showToast('error', err.message);
      return false;
    }
  };

  const deleteCategory = async (name: string) => {
    if (!confirm(`Delete category "${name}"? This will unassign any posts belonging to it.`)) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ category: name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');
      showToast('success', `Category "${name}" deleted.`);
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Redirect Rules Handlers
  const addRedirectRule = async (sourcePath: string, targetPath: string, code: number) => {
    try {
      const res = await fetch('/api/redirects', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ source: sourcePath, destination: targetPath, statusCode: code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save redirect rule');
      showToast('success', `Redirect rule from ${sourcePath} created.`);
      loadAllCmsData();
      return true;
    } catch (err: any) {
      showToast('error', err.message);
      return false;
    }
  };

  const deleteRedirectRule = async (id: string, source: string) => {
    if (!confirm(`Remove redirect rule for ${source}?`)) return;
    try {
      const res = await fetch(`/api/redirects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete redirect rule');
      showToast('success', 'Redirect rule deleted.');
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Comments Moderation Handlers
  const approveComment = async (id: string) => {
    try {
      const res = await fetch(`/api/comments/${id}/approve`, {
        method: 'PUT',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve comment');
      showToast('success', 'Comment approved and made visible on article page.');
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Permanently purge this user comment?')) return;
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete comment');
      showToast('success', 'Comment deleted.');
      loadAllCmsData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Clear system audit logs
  const clearSystemLogs = async () => {
    if (!confirm('Clear all audit logs from the datastore?')) return;
    try {
      const res = await fetch('/api/logs', { method: 'DELETE', headers: getHeaders() });
      if (res.ok) {
        showToast('success', 'Audit trail cleared.');
        loadAllCmsData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Clear submissions history
  const clearSubmissions = async () => {
    if (!confirm('Clear all recorded form lead entries?')) return;
    try {
      const res = await fetch('/api/submissions', { method: 'DELETE', headers: getHeaders() });
      if (res.ok) {
        showToast('success', 'Submission entries deleted.');
        loadAllCmsData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------------------
  // Rendering Gateway
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // Rendering Gateway
  // -------------------------------------------------------------------------
  if (setupCompleted === false || hasUsers === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 selection:bg-teal-700 selection:text-white">
        
        {/* Toast Alert banner */}
        {toast && (
          <div className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-2xl shadow-lg border text-sm flex items-center space-x-2 transition-all duration-300 animate-slide-in ${
            toast.type === 'success' 
              ? 'bg-teal-900/90 border-teal-700 text-teal-100' 
              : 'bg-rose-900/90 border-rose-700 text-rose-100'
          }`}>
            {toast.type === 'success' ? <Check className="h-4 w-4 text-teal-400" /> : <AlertTriangle className="h-4 w-4 text-rose-400" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        <div className="sm:mx-auto sm:w-full sm:max-w-4xl bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual Guide */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-teal-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div>
              <div className="h-10 w-10 bg-teal-500 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg shadow-teal-500/20 mb-8">
                GP
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">First-Time Install</span>
              <h2 className="text-2xl font-extrabold tracking-tight mt-2 leading-tight">Install GoPixel CMS</h2>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                Welcome to your self-hosted CMS environment. Let's configure your platform's host parameters and set up your permanent Superadmin credentials.
              </p>
            </div>

            <div className="mt-8">
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-400 space-y-3">
                <div className="flex items-center space-x-2 text-teal-400 font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Architecture Standard:</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-4">
                  <li>Full SSR compilation pipeline</li>
                  <li>No pre-seeded credentials</li>
                  <li>Permanent Superadmin protection</li>
                  <li>Automatic visual grid generation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Configuration Form */}
          <div className="lg:col-span-8 p-8 sm:p-10">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Settings className="h-5 w-5 text-teal-400" />
              <span>Initial Installation Wizard</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Configure your deployment settings and create the primary administrator account.</p>

            {installError && (
              <div className="mt-4 p-3.5 bg-rose-950/50 border border-rose-800 rounded-2xl text-xs text-rose-300 flex items-start space-x-2.5">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{installError}</span>
              </div>
            )}

            <form onSubmit={handleInstall} className="mt-6 space-y-6">
              
              {/* SECTION 1: SITE BRANDING & ROUTING */}
              <div className="space-y-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-400">1. Site Branding & Hosting Routing</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Website Type (Site Schema)</label>
                    <select
                      value={installWebsiteType}
                      onChange={(e) => setInstallWebsiteType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition"
                    >
                      <option value="blog">Blog / Writing Log</option>
                      <option value="news">News / Editorial Portal</option>
                      <option value="agency">Agency / Studio Bureau</option>
                      <option value="portfolio">Personal Portfolio Showroom</option>
                      <option value="business">Local Business / Company Home</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Site Title / Name</label>
                    <input
                      type="text"
                      required
                      value={installSiteName}
                      onChange={(e) => setInstallSiteName(e.target.value)}
                      placeholder="e.g. My Brand Site"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition placeholder-slate-600 animate-none shadow-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Registered Domain Name</label>
                    <input
                      type="text"
                      required
                      value={installDomainName}
                      onChange={(e) => setInstallDomainName(e.target.value)}
                      placeholder="e.g. yourdomain.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition placeholder-slate-600 animate-none shadow-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">System Timezone</label>
                    <select
                      value={installTimezone}
                      onChange={(e) => setInstallTimezone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition"
                    >
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="America/New_York">Eastern Time (EST/EDT)</option>
                      <option value="America/Chicago">Central Time (CST/CDT)</option>
                      <option value="America/Denver">Mountain Time (MST/MDT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                      <option value="Europe/London">London (GMT/BST)</option>
                      <option value="Europe/Paris">Paris (CET/CEST)</option>
                      <option value="Asia/Kolkata">Kolkata (IST)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Asia/Singapore">Singapore (SGT)</option>
                      <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Dynamic Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={installSiteTagline}
                    onChange={(e) => setInstallSiteTagline(e.target.value)}
                    placeholder="e.g. Modern static-speed content publishing"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition placeholder-slate-600 animate-none shadow-none"
                  />
                </div>
              </div>

              {/* SECTION 2: SUPERADMIN SETUP */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-400">2. Configure Superadmin Credentials</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Superadmin Full Name</label>
                    <input
                      type="text"
                      required
                      value={installAdminFullName}
                      onChange={(e) => setInstallAdminFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition placeholder-slate-600 animate-none shadow-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Login Username</label>
                    <input
                      type="text"
                      required
                      value={installAdminUsername}
                      onChange={(e) => setInstallAdminUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="e.g. superadmin"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition placeholder-slate-600 animate-none shadow-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact Email Address</label>
                    <input
                      type="email"
                      required
                      value={installAdminEmail}
                      onChange={(e) => setInstallAdminEmail(e.target.value)}
                      placeholder="e.g. admin@domain.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition placeholder-slate-600 animate-none shadow-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Secure Password</label>
                    <input
                      type="password"
                      required
                      value={installAdminPassword}
                      onChange={(e) => setInstallAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-medium transition placeholder-slate-600 animate-none shadow-none"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION SUBMIT */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={installLoading}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-teal-600/10 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {installLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Installing CMS Environment...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Initialize & Launch CMS Platform</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-teal-100 selection:text-teal-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-slate-900 py-6 px-4 rounded-3xl border border-slate-800 shadow-xl mb-6">
          <GoPixelLogo size="md" />
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 border border-slate-200/60 rounded-3xl shadow-sm sm:px-10">
            {!isSignUpMode ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Username
                  </label>
                  <div className="mt-1.5">
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="e.g. admin"
                      className="appearance-none block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-800 bg-[#FAFAFA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <div className="mt-1.5">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="e.g. admin123"
                      className="appearance-none block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-800 bg-[#FAFAFA]"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center space-x-2 text-xs text-rose-600 animate-pulse">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
                  >
                    {loginLoading ? 'Authenticating...' : 'Sign In'}
                  </button>
                </div>

                {siteSettings?.allowPublicSignup && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUpMode(true);
                        setSignUpError('');
                        setSignUpSuccess('');
                      }}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
                    >
                      Don't have an account? Register as author
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="text-center mb-2">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Create Author Account</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Self-Registration Gate</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="appearance-none block w-full px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-800 bg-[#FAFAFA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      placeholder="e.g. janedoe"
                      className="appearance-none block w-full px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-800 bg-[#FAFAFA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="appearance-none block w-full px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-800 bg-[#FAFAFA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      className="appearance-none block w-full px-3.5 py-2 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-800 bg-[#FAFAFA]"
                    />
                  </div>
                </div>

                {siteSettings?.captchaEnabled && (
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Security Verification</span>
                    {siteSettings.captchaMode === 'built_in_math' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                          {signUpCaptchaChallenge ? signUpCaptchaChallenge.question : 'Generating math puzzle...'}
                        </span>
                        <input
                          type="number"
                          required
                          value={signUpCaptchaAnswer}
                          onChange={(e) => setSignUpCaptchaAnswer(e.target.value)}
                          placeholder="Ans"
                          className="w-16 px-2 py-2 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-800 bg-white"
                        />
                        <button
                          type="button"
                          onClick={loadSignUpCaptcha}
                          className="p-2 text-slate-400 hover:text-teal-600 rounded-xl bg-white border border-slate-200 transition"
                          title="Refresh verification challenge"
                        >
                          <RefreshCw className="h-3 w-3 animate-spin-slow" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-[9px] text-slate-500 italic leading-snug">
                        External CAPTCHA ({siteSettings.captchaProvider}) validation enabled.
                      </div>
                    )}
                  </div>
                )}

                {signUpError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center space-x-2 text-xs text-rose-600">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                {signUpSuccess && (
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-center space-x-2 text-xs text-teal-700">
                    <CheckCircle className="h-4 w-4 shrink-0 animate-bounce" />
                    <span>{signUpSuccess}</span>
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={signUpLoading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150"
                  >
                    {signUpLoading ? 'Registering Account...' : 'Register Account'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUpMode(false);
                      setSignUpError('');
                      setSignUpSuccess('');
                    }}
                    className="w-full flex justify-center py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition duration-150"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* No preseeded accounts box */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Toast Alert banner */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-2xl shadow-lg border text-sm flex items-center space-x-2 transition-all duration-300 animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-teal-50 border-teal-100 text-teal-800' 
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {toast.type === 'success' ? <Check className="h-4 w-4 text-teal-600" /> : <AlertTriangle className="h-4 w-4 text-rose-600" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* First-Launch Guided Website Type Setup Wizard Overlay */}
      {(!siteSettings.setupCompleted || !siteSettings.websiteType) && currentUser && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-fade-in my-auto">
            
            {/* Left Brand Column */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-teal-500 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg shadow-teal-500/20 mb-8">
                  {setupSiteName ? setupSiteName.charAt(0).toUpperCase() : 'G'}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">First Launch Setup Wizard</span>
                <h2 className="text-2xl font-extrabold tracking-tight mt-2 leading-tight">Welcome to GoPixel CMS</h2>
                <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                  Let's configure your fast, visual-block-builder powered web platform. Select your business type, and we will initialize editable custom schemas, layouts, starter pages, and contact configurations automatically.
                </p>
              </div>

              <div className="pt-8 md:pt-0">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] text-slate-400 leading-normal space-y-1.5">
                  <div className="flex items-center space-x-2 text-teal-400 font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Selected Template Features:</span>
                  </div>
                  {setupWebsiteType === 'blog' && <p>• Fully responsive visual blog articles with beautiful inline quotes, category tags, read-time estimator, and sharing tools.</p>}
                  {setupWebsiteType === 'news' && <p>• Daily news columns structure, hot trending tags list, and dynamic sitemaps for lightning-fast search indexing.</p>}
                  {setupWebsiteType === 'agency' && <p>• Stunning service cards, project supplementary galleries, visual layouts, and contact lead submission forms.</p>}
                  {setupWebsiteType === 'portfolio' && <p>• Designer-first showcases, custom profile socials linking, file download capabilities, and dark/light accents.</p>}
                  {setupWebsiteType === 'business' && <p>• Corporate landing blocks, structured services schemas, newsletter registration form, and dynamic business maps routing.</p>}
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <form onSubmit={handleSetupWizardSubmit} className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">1. Select Your Website Style</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Your template starter content will recompile automatically to fit your choice.</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-3">
                    {[
                      { id: 'blog', label: 'Blog', emoji: '✍️' },
                      { id: 'news', label: 'News', emoji: '📰' },
                      { id: 'agency', label: 'Agency', emoji: '🏢' },
                      { id: 'portfolio', label: 'Portfolio', emoji: '🎨' },
                      { id: 'business', label: 'Business', emoji: '💼' }
                    ].map(type => {
                      const active = setupWebsiteType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setSetupWebsiteType(type.id);
                            if (type.id === 'blog') {
                              setSetupSiteName('Creative Insights');
                              setSetupSiteTagline('Thoughts on visual arts, modern design, and building web technologies.');
                            } else if (type.id === 'news') {
                              setSetupSiteName('The Daily Gazette');
                              setSetupSiteTagline('Up-to-the-minute global reports, local headlines, and breaking columns.');
                            } else if (type.id === 'agency') {
                              setSetupSiteName('Apex Media Lab');
                              setSetupSiteTagline('Crafting high-performance digital brand blueprints and responsive experiences.');
                            } else if (type.id === 'portfolio') {
                              setSetupSiteName('Alex Carter Studios');
                              setSetupSiteTagline('Independent designer showcasing bespoke product architectures and software.');
                            } else if (type.id === 'business') {
                              setSetupSiteName('Apex Consulting');
                              setSetupSiteTagline('Enterprise infrastructure auditing, process automation, and scalable growth.');
                            }
                          }}
                          className={`flex flex-col items-center justify-center p-3.5 border rounded-2xl transition-all ${
                            active 
                              ? 'bg-teal-50/50 border-teal-500 text-teal-900 ring-2 ring-teal-500/10' 
                              : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200/60 text-slate-600'
                          }`}
                        >
                          <span className="text-lg mb-1">{type.emoji}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">2. Define Branding Identity</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Website Name / Brand Title</label>
                    <input
                      type="text"
                      required
                      value={setupSiteName}
                      onChange={(e) => setSetupSiteName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                      placeholder="e.g. Pixel Press"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Slogan / Slogan Tagline</label>
                    <input
                      type="text"
                      required
                      value={setupSiteTagline}
                      onChange={(e) => setSetupSiteTagline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                      placeholder="e.g. Insights for visual craftspersons."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 leading-snug">
                  <Sparkles className="text-amber-500 h-3.5 w-3.5 shrink-0" />
                  <span>Generating this will preseed database, forms, structure, and 3 mock visual-blocks pages.</span>
                </span>
                
                <button
                  type="submit"
                  disabled={isSubmittingSetup}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-500/80 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal-600/15 shrink-0"
                >
                  {isSubmittingSetup ? 'Re-compiling...' : 'Bootstrap & Launch'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Main Left Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 md:min-h-screen text-slate-300 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800">
          <GoPixelLogo size="sm" className="!scale-95 !my-0" />
        </div>

        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => { setActiveTab('dashboard'); setEditingPost(null); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'dashboard' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setActiveTab('posts'); setEditingPost(null); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'posts' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span>Visual Builder</span>
          </button>

          <button
            onClick={() => { setActiveTab('forms'); setEditingPost(null); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'forms' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span>Dynamic Forms</span>
          </button>

          <button
            onClick={() => { setActiveTab('submissions'); setEditingPost(null); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'submissions' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ClipboardList className="h-4 w-4 shrink-0" />
            <span>Form Submissions</span>
          </button>

          <button
            onClick={() => { setActiveTab('profile'); setEditingPost(null); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'profile' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Author Profile</span>
          </button>

          <button
            onClick={() => { setActiveTab('media'); setEditingPost(null); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'media' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Image className="h-4 w-4 shrink-0" />
            <span>Media Gallery</span>
          </button>

          {(currentUser?.role === 'admin' || currentUser?.role === 'editor') && (
            <>
              <button
                onClick={() => { setActiveTab('customizer'); setEditingPost(null); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'customizer' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>Frontend Customizer</span>
              </button>

              <button
                onClick={() => { setActiveTab('menus'); setEditingPost(null); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'menus' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Menu className="h-4 w-4 shrink-0" />
                <span>Menus & Socials</span>
              </button>

              <button
                onClick={() => { setActiveTab('comments'); setEditingPost(null); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'comments' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>Public Comments</span>
              </button>

              <button
                onClick={() => { setActiveTab('redirects'); setEditingPost(null); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'redirects' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ArrowRightLeft className="h-4 w-4 shrink-0" />
                <span>SEO Redirect Rules</span>
              </button>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <div className="pt-4 pb-1">
                <span className="px-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Administration</span>
              </div>

              <button
                onClick={() => { setActiveTab('smtp'); setEditingPost(null); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'smtp' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Send className="h-4 w-4 shrink-0" />
                <span>SMTP Routing</span>
              </button>

              <button
                onClick={() => { setActiveTab('users'); setEditingPost(null); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'users' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4 shrink-0" />
                <span>RBAC Security</span>
              </button>

              <button
                onClick={() => { setActiveTab('logs'); setEditingPost(null); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'logs' ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Database className="h-4 w-4 shrink-0" />
                <span>System Logs</span>
              </button>
            </>
          )}
        </nav>

        {/* User Badge / Logout Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col space-y-2">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-slate-700">
              {currentUser?.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-white leading-tight">{currentUser?.fullName}</span>
              <span className="inline-block text-[9px] font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full mt-1 border border-teal-900/30">
                {currentUser?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold text-slate-400 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-grow flex flex-col overflow-x-hidden min-h-screen">
        
        {/* Top Sticky Header */}
        <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-slate-800 capitalize tracking-tight">{activeTab} CMS Console</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-100 rounded-xl transition"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Launch Site SSR</span>
            </a>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-500">Live Server Status: <span className="inline-block h-2 w-2 rounded-full bg-teal-500 ml-1"></span></span>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-6 md:p-8 flex-grow">
          
          {/* -----------------------------------------------------------------
              DASHBOARD VIEW
             ----------------------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Project Progress Report Banner */}
              <div id="project-progress-banner" className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/30 rounded-3xl p-6 md:p-8 text-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-0 h-40 w-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="space-y-2 max-w-2xl relative z-10">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    <span>Github README Asset Generator Ready</span>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight">GoPixel Platform Progress &amp; Feature Inventory</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Download a dynamically compiled, visual-quality PDF containing the entire platform feature checklist, key architectural components, and live active database metrics. Perfect for checking into your GitHub repository or listing inside your repository README.
                  </p>
                </div>
                <div className="shrink-0 relative z-10">
                  <a
                    href="/api/progress-pdf"
                    download="GoPixel_CMS_Project_Progress.pdf"
                    className="inline-flex items-center space-x-2 px-5 py-3 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-2xl text-xs font-bold transition shadow-lg shadow-teal-900/20 hover:scale-[1.02]"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download Progress PDF Report</span>
                  </a>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Page Views</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{analytics?.totalPageViews || 'Loading...'}</h3>
                  </div>
                  <div className="h-11 w-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                    <Globe className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Unique Visitors</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{analytics?.uniqueSessions || 'Loading...'}</h3>
                  </div>
                  <div className="h-11 w-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Form Submission Leads</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{analytics?.totalSubmissions ?? 'Loading...'}</h3>
                  </div>
                  <div className="h-11 w-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Form Conversion</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                      {analytics ? `${((analytics.totalSubmissions / (analytics.totalPageViews || 1)) * 100).toFixed(1)}%` : 'Loading...'}
                    </h3>
                  </div>
                  <div className="h-11 w-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Chart & Core tables split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Area Analytics Graph */}
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-bold text-slate-900">Weekly Traffic Analytics</h3>
                      <p className="text-xs text-slate-400">Server-side traffic tracking comparing overall pageviews against absolute unique visitors.</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-500">Last 7 Days</span>
                  </div>
                  <div className="h-72 w-full pt-4">
                    {analytics?.dailyStats ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0F766E" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorUniques" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                          <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                          <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="views" name="Page Views" stroke="#0F766E" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                          <Area type="monotone" dataKey="uniques" name="Unique Visitors" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorUniques)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">Loading traffic graphs...</div>
                    )}
                  </div>
                </div>

                {/* Submissions by Form distribution */}
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                  <h3 className="text-md font-bold text-slate-900">Form Conversion Volumes</h3>
                  <p className="text-xs text-slate-400">Distribution of leads submitted across your built dynamic form system schemas.</p>
                  
                  <div className="h-56 w-full pt-4">
                    {analytics?.submissionsByForm ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.submissionsByForm} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                          <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} precision={0} />
                          <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }} />
                          <Bar dataKey="count" name="Leads" fill="#E11D48" radius={[4, 4, 0, 0]} barSize={28} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400">Loading distribution metrics...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Referrers & Pages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Visited Pages table */}
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Top Visited Pages</h3>
                    <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">Most Popular</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead>
                        <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Page / URI Path</th>
                          <th className="pb-3 text-right font-semibold">Hits Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {analytics?.topPages?.map((p: any, idx: number) => (
                          <tr key={idx}>
                            <td className="py-3 text-slate-700 font-semibold flex items-center space-x-2">
                              <span className="text-slate-300 font-mono text-[10px]">#{idx+1}</span>
                              <code className="bg-slate-50 px-2 py-1 rounded-md text-slate-600 border border-slate-100/50">{p.page}</code>
                            </td>
                            <td className="py-3 text-right font-bold text-slate-900">{p.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Referrers */}
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Traffic Referring Domains</h3>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">Referrals</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead>
                        <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Referrer Source</th>
                          <th className="pb-3 text-right font-semibold">Hits Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {analytics?.topReferrers?.map((r: any, idx: number) => (
                          <tr key={idx}>
                            <td className="py-3 text-slate-700 font-semibold truncate max-w-xs">{r.referrer}</td>
                            <td className="py-3 text-right font-bold text-slate-900">{r.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              VISUAL BUILDER / ARTICLES WORKSPACE
             ----------------------------------------------------------------- */}
          {activeTab === 'posts' && !editingPost && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div>
                  <h2 className="text-md font-bold text-slate-900">Articles & Content Management</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Visually construct elegant pages, configure schema metadata structures, and publish with optimized SEO.</p>
                </div>
                {currentUser?.role !== 'viewer' && (
                  <button
                    onClick={initNewPost}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition duration-150"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Visual Page</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(p => (
                  <div key={p.id} className="bg-white border border-slate-200/50 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] p-6 flex flex-col justify-between hover:border-slate-300 transition duration-150">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                          p.published 
                            ? 'bg-teal-50 text-teal-700 border-teal-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">By {p.authorName}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-800 mt-4 line-clamp-1">{p.title}</h3>
                      <p className="text-slate-400 text-xs mt-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md inline-block font-mono">/p/{p.slug}</p>
                      <p className="text-slate-500 text-xs mt-3 line-clamp-2">{p.seoDescription || 'No description provided.'}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={`/p/${p.slug}`}
                        target="_blank"
                        className="text-slate-400 hover:text-teal-600 transition p-1.5 hover:bg-slate-50 rounded-xl"
                        title="View Live SSR Page"
                      >
                        <Eye className="h-4 w-4" />
                      </a>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => { setEditingPost(p); setIsCreatingPost(false); }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        {(currentUser?.role === 'admin' || currentUser?.role === 'editor' || p.authorId === currentUser?.id) && (
                          <button
                            onClick={() => deletePost(p.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                            title="Delete Article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              ACTIVE VISUAL ARTICLE BUILDER INTERFACE
             ----------------------------------------------------------------- */}
          {editingPost && (
            <div className="space-y-6">
              {/* Top Builder Control Header */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setEditingPost(null)}
                    className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Front-End Article Composer</span>
                    <h2 className="text-md font-bold text-slate-900 mt-0.5">{isCreatingPost ? 'New Dynamic Page' : `Designing: "${editingPost.title}"`}</h2>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={editingPost.published}
                      onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <button
                    onClick={savePost}
                    disabled={isSavingPost}
                    className="flex items-center space-x-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition duration-150 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSavingPost ? 'Saving...' : 'Save Draft'}</span>
                  </button>
                </div>
              </div>

              {/* Split Workspace Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* 1. Left Controls and Settings Panel */}
                <div className="xl:col-span-5 space-y-6">
                  
                  {/* Basic Metadata card */}
                  <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Page Metadata & URL Routing</h3>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400">Post Title</label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value, seoTitle: e.target.value })}
                        className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="e.g. My SEO optimized post"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400">URL Slug Path</label>
                      <div className="flex mt-1">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-400 text-xs font-mono">/p/</span>
                        <input
                          type="text"
                          value={editingPost.slug}
                          onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition font-mono"
                          placeholder="url-path-slug"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400">Category Tag (SEO Schema Taxon)</label>
                      <select
                        value={editingPost.category || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value || undefined })}
                        className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      >
                        <option value="">Uncategorized</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold uppercase text-slate-400">Editor Mode</label>
                      <div className="flex space-x-2 mt-1.5">
                        <button
                          onClick={() => setEditingPost({ ...editingPost, mode: 'visual' })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                            editingPost.mode === 'visual' 
                              ? 'bg-teal-50 text-teal-700 border-teal-100 font-bold' 
                              : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          Visual Layout Blocks
                        </button>
                        <button
                          onClick={() => setEditingPost({ ...editingPost, mode: 'html' })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                            editingPost.mode === 'html' 
                              ? 'bg-teal-50 text-teal-700 border-teal-100 font-bold' 
                              : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          Custom Raw HTML
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Blog, News & Magazine Portal Features */}
                  <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Editorial Portal Features</h3>
                      <span className="text-[10px] bg-teal-50 text-teal-700 font-extrabold px-2 py-0.5 rounded border border-teal-100">Blog / Magazine</span>
                    </div>

                    {/* 1. Featured Image Upload & Meta */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase text-slate-400">Featured Cover Image</label>
                      
                      {editingPost.featuredImage && (
                        <div className="relative group rounded-2xl overflow-hidden border border-slate-100 max-h-[180px] bg-slate-50">
                          <img src={editingPost.featuredImage} alt="Featured" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setEditingPost({ ...editingPost, featuredImage: undefined, featuredImageTitle: '', featuredImageAlt: '', featuredImageDescription: '' })}
                              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-rose-700 transition"
                            >
                              Remove Featured Image
                            </button>
                          </div>
                        </div>
                      )}

                      {!editingPost.featuredImage && (
                        <div className="border border-dashed border-slate-200/80 rounded-2xl p-4 text-center hover:bg-slate-50/50 transition relative group cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('image', file);
                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData
                                });
                                if (!res.ok) throw new Error('Upload failed.');
                                const data = await res.json();
                                setEditingPost({
                                  ...editingPost,
                                  featuredImage: data.url,
                                  featuredImageTitle: file.name.split('.')[0],
                                  featuredImageAlt: file.name.split('.')[0]
                                });
                                showToast('success', 'Featured image uploaded!');
                              } catch (err: any) {
                                showToast('error', err.message || 'Failed to upload featured image.');
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-1.5">
                            <div className="mx-auto h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                              <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">Upload WebP or Image</p>
                              <p className="text-[10px] text-slate-400">Click or drag cover photo</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Manual Image Metadata Entry */}
                      {editingPost.featuredImage && (
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-2.5">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Image SEO Attributes</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] font-semibold text-slate-400 uppercase">Title</label>
                              <input
                                type="text"
                                value={editingPost.featuredImageTitle || ''}
                                onChange={(e) => setEditingPost({ ...editingPost, featuredImageTitle: e.target.value })}
                                placeholder="SEO Title"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-semibold text-slate-400 uppercase">Alt text</label>
                              <input
                                type="text"
                                value={editingPost.featuredImageAlt || ''}
                                onChange={(e) => setEditingPost({ ...editingPost, featuredImageAlt: e.target.value })}
                                placeholder="Alt Caption"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400 uppercase block">Short Caption / Description</label>
                            <input
                              type="text"
                              value={editingPost.featuredImageDescription || ''}
                              onChange={(e) => setEditingPost({ ...editingPost, featuredImageDescription: e.target.value })}
                              placeholder="Describe the image..."
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Article Tagging System */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold uppercase text-slate-400">Article Tags</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          id="tag-input"
                          placeholder="e.g. Technology, Food, Travel"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                const currentTags = editingPost.tags || [];
                                if (!currentTags.includes(val)) {
                                  setEditingPost({ ...editingPost, tags: [...currentTags, val] });
                                }
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('tag-input') as HTMLInputElement;
                            const val = input?.value.trim();
                            if (val) {
                              const currentTags = editingPost.tags || [];
                              if (!currentTags.includes(val)) {
                                setEditingPost({ ...editingPost, tags: [...currentTags, val] });
                              }
                              input.value = '';
                            }
                          }}
                          className="px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                      
                      {editingPost.tags && editingPost.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {editingPost.tags.map(t => (
                            <span key={t} className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                              <span>#{t}</span>
                              <button
                                type="button"
                                onClick={() => setEditingPost({ ...editingPost, tags: editingPost.tags?.filter(tag => tag !== t) })}
                                className="text-teal-400 hover:text-teal-700 text-[10px] font-bold"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">No tags associated with this page.</p>
                      )}
                    </div>

                    {/* 3. Supplementary Attached Gallery (Image Upload & URL Attachments) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase text-slate-400">Supplementary Gallery</label>
                        <span className="text-[9px] text-slate-400 font-bold">({editingPost.attachedImages?.length || 0} attached)</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {editingPost.attachedImages?.map((img, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                            <img src={img} alt={`Attached ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => setEditingPost({ ...editingPost, attachedImages: editingPost.attachedImages?.filter((_, i) => i !== idx) })}
                              className="absolute top-1 right-1 bg-rose-600 text-white rounded-full h-4 w-4 flex items-center justify-center hover:bg-rose-700 text-[10px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition"
                            >
                              &times;
                            </button>
                          </div>
                        ))}

                        <div className="border border-dashed border-slate-200 hover:bg-slate-50 transition rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length === 0) return;
                              const uploadedUrls: string[] = [];
                              for (const file of files) {
                                const formData = new FormData();
                                formData.append('image', file as any);
                                try {
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    uploadedUrls.push(data.url);
                                  }
                                } catch (err) {}
                              }
                              if (uploadedUrls.length > 0) {
                                setEditingPost({
                                  ...editingPost,
                                  attachedImages: [...(editingPost.attachedImages || []), ...uploadedUrls]
                                });
                                showToast('success', `Attached ${uploadedUrls.length} image(s)!`);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <span className="text-slate-400 text-sm font-bold">+</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase mt-1">Upload</span>
                        </div>
                      </div>

                      {/* Add Image URL directly */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          id="gallery-url-input"
                          placeholder="Or paste image URL asset"
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                setEditingPost({ ...editingPost, attachedImages: [...(editingPost.attachedImages || []), val] });
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('gallery-url-input') as HTMLInputElement;
                            const val = input?.value.trim();
                            if (val) {
                              setEditingPost({ ...editingPost, attachedImages: [...(editingPost.attachedImages || []), val] });
                              input.value = '';
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg animate-fade-in"
                        >
                          Link
                        </button>
                      </div>
                    </div>

                    {/* 4. Supplementary Attached PDF */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-bold uppercase text-slate-400">Attach Supplement PDF Report</label>
                      
                      {editingPost.attachedPdfUrl && (
                        <div className="bg-rose-50 border border-rose-100/50 p-2.5 rounded-xl flex items-center justify-between">
                          <div className="flex items-center space-x-2 truncate">
                            <span className="bg-rose-600 text-white font-black text-[9px] p-1 rounded">PDF</span>
                            <span className="text-xs text-rose-800 font-bold truncate max-w-[150px]">{editingPost.attachedPdfName || 'Supplementary Document'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingPost({ ...editingPost, attachedPdfUrl: undefined, attachedPdfName: undefined })}
                            className="text-rose-500 hover:text-rose-800 text-xs font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {!editingPost.attachedPdfUrl && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="relative">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('image', file as any); // Multer expects field name 'image'
                                try {
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });
                                  if (!res.ok) throw new Error('Upload failed.');
                                  const data = await res.json();
                                  setEditingPost({
                                    ...editingPost,
                                    attachedPdfUrl: data.url,
                                    attachedPdfName: file.name
                                  });
                                  showToast('success', 'Supplementary PDF file attached!');
                                } catch (err: any) {
                                  showToast('error', err.message || 'Failed to attach PDF.');
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="border border-dashed border-slate-200 rounded-xl p-2 text-center hover:bg-slate-50 transition cursor-pointer">
                              <span className="text-xs text-slate-500 font-bold">📄 Upload PDF</span>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Or paste PDF URL link"
                            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                            onChange={(e) => setEditingPost({ ...editingPost, attachedPdfUrl: e.target.value, attachedPdfName: 'Supplementary PDF File' })}
                          />
                        </div>
                      )}

                      {editingPost.attachedPdfUrl && (
                        <div>
                          <label className="text-[9px] font-semibold text-slate-400 uppercase">PDF Download Caption</label>
                          <input
                            type="text"
                            value={editingPost.attachedPdfName || ''}
                            onChange={(e) => setEditingPost({ ...editingPost, attachedPdfName: e.target.value })}
                            placeholder="e.g. FY26 Q4 Audit Supplement"
                            className="mt-1 w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visual Drag & Drop Builder Control Toolbox */}
                  {editingPost.mode === 'visual' ? (
                    <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Visual Elements Toolbox</h3>
                        <span className="text-[10px] text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full font-bold">Add Blocks</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => addBlock('heading')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-teal-100 text-teal-700 text-xs font-black flex items-center justify-center rounded">H</span>
                          <span>Heading Section</span>
                        </button>

                        <button
                          onClick={() => addBlock('paragraph')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-indigo-100 text-indigo-700 font-serif text-xs flex items-center justify-center rounded">P</span>
                          <span>Paragraph Text</span>
                        </button>

                        <button
                          onClick={() => addBlock('image')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-rose-100 text-rose-700 text-xs flex items-center justify-center rounded">IMG</span>
                          <span>Responsive Image</span>
                        </button>

                        <button
                          onClick={() => addBlock('button')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-amber-100 text-amber-700 text-xs flex items-center justify-center rounded">BTN</span>
                          <span>Action CTA Button</span>
                        </button>

                        <button
                          onClick={() => addBlock('quote')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-violet-100 text-violet-700 text-xs flex items-center justify-center rounded">“”</span>
                          <span>Inspirational Quote</span>
                        </button>

                        <button
                          onClick={() => addBlock('form')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-rose-100 text-rose-700 text-xs flex items-center justify-center rounded">FRM</span>
                          <span>Contact Lead Form</span>
                        </button>

                        <button
                          onClick={() => addBlock('html')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-slate-200 text-slate-700 text-xs flex items-center justify-center rounded">HTML</span>
                          <span>Injected Raw HTML</span>
                        </button>

                        <button
                          onClick={() => addBlock('social-embed')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-cyan-100 text-cyan-700 text-xs flex items-center justify-center rounded">VID</span>
                          <span>Social Video Embed</span>
                        </button>

                        <button
                          onClick={() => addBlock('pdf-block')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-red-100 text-red-700 text-xs flex items-center justify-center rounded">PDF</span>
                          <span>PDF Document Block</span>
                        </button>

                        <button
                          onClick={() => addBlock('rich-text')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-teal-100 text-teal-700 text-xs flex items-center justify-center rounded font-bold">RXT</span>
                          <span>Visual Rich Text (Paste)</span>
                        </button>

                        <button
                          onClick={() => addBlock('divider')}
                          className="flex items-center space-x-2 p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-left text-xs font-bold text-slate-700 transition"
                        >
                          <span className="h-6 w-6 bg-slate-200 text-slate-700 text-xs flex items-center justify-center rounded">—</span>
                          <span>Visual Separator</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Raw Custom HTML Workspace</h3>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-400">Content Mark-Up (Tailwind Supported)</label>
                        <textarea
                          rows={12}
                          value={editingPost.rawHtml || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, rawHtml: e.target.value })}
                          className="mt-1 w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-teal-400 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition leading-relaxed"
                          placeholder="<div class='bg-teal-50 p-6 rounded-3xl'>...</div>"
                        />
                      </div>
                    </div>
                  )}

                  {/* SEO Meta Configuration card */}
                  <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Search Engine Optimization (SEO)</h3>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400">SEO Custom Meta Title</label>
                      <input
                        type="text"
                        value={editingPost.seoTitle || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, seoTitle: e.target.value })}
                        className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="Search engine meta title"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400">SEO Meta Description</label>
                      <textarea
                        rows={3}
                        value={editingPost.seoDescription || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, seoDescription: e.target.value })}
                        className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="Write a highly competitive short page description for SEO snippets"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400">SEO Keywords</label>
                      <input
                        type="text"
                        value={editingPost.seoKeywords || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, seoKeywords: e.target.value })}
                        className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="comma, separated, key, terms"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase text-slate-400">Schema.org JSON-LD Structured Data</label>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">Structured SEO</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase">Schema Type</label>
                          <select
                            value={editingPost.schemaType || 'Article'}
                            onChange={(e) => setEditingPost({ ...editingPost, schemaType: e.target.value as any })}
                            className="mt-1 w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                          >
                            <option value="Article">Article</option>
                            <option value="BlogPosting">BlogPosting</option>
                            <option value="FAQPage">FAQPage</option>
                            <option value="WebPage">WebPage</option>
                            <option value="Event">Event</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase">Custom Structured Metadata String (JSON-LD)</label>
                        <textarea
                          rows={4}
                          value={editingPost.schemaData || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, schemaData: e.target.value })}
                          className="mt-1 w-full p-2 bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px] rounded-xl focus:outline-none"
                          placeholder='{ "@context": "https://schema.org", ... }'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Right Interactive Canvas Area */}
                <div className="xl:col-span-7 space-y-6">
                  
                  {/* Visual Content Block List */}
                  {editingPost.mode === 'visual' ? (
                    <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-5">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Interactive Layout Blocks List</h3>
                      
                      {editingPost.content.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-slate-400">
                          Your visual layout has no blocks yet. Click an element on the left toolbox to add!
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {editingPost.content.map((block, idx) => (
                            <div key={block.id} className="border border-slate-200/80 bg-slate-50/50 p-4 rounded-2xl relative group hover:border-teal-500/50 transition duration-150">
                              
                              {/* Element Control bar */}
                              <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition duration-150 z-20">
                                <button
                                  onClick={() => moveBlock(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30"
                                >
                                  <MoveUp className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => moveBlock(idx, 'down')}
                                  disabled={idx === editingPost.content.length - 1}
                                  className="p-1 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30"
                                >
                                  <MoveDown className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => removeBlock(block.id)}
                                  className="p-1 bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-md"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-teal-600 mb-3">
                                <span>{block.type} Element</span>
                              </div>

                              {/* Settings Forms tailored specifically for each block type */}
                              {block.type === 'heading' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="md:col-span-2">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Heading content text</label>
                                    <input
                                      type="text"
                                      value={block.settings.text || ''}
                                      onChange={(e) => updateBlockSettings(block.id, { text: e.target.value })}
                                      className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Heading Level</label>
                                    <select
                                      value={block.settings.level || 2}
                                      onChange={(e) => updateBlockSettings(block.id, { level: parseInt(e.target.value, 10) })}
                                      className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                                    >
                                      <option value="1">H1 - Banner Heading</option>
                                      <option value="2">H2 - Core Title</option>
                                      <option value="3">H3 - Sub Heading</option>
                                      <option value="4">H4 - Block Label</option>
                                    </select>
                                  </div>
                                </div>
                              )}

                              {block.type === 'paragraph' && (
                                <div className="space-y-2 text-left">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Paragraph Content (Supports Rich-Text & Styled Copy-Paste)</label>
                                    <span className="text-[9px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 font-semibold uppercase tracking-wider">Rich Text</span>
                                  </div>
                                  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner focus-within:ring-1 focus-within:ring-teal-500 transition">
                                    {/* Rich Text Toolbar for Paragraphs */}
                                    <div className="bg-slate-50 border-b border-slate-100 px-3 py-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('bold', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded font-bold text-slate-700"
                                        title="Bold"
                                      >
                                        B
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('italic', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded italic text-slate-700"
                                        title="Italic"
                                      >
                                        I
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('underline', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded underline text-slate-700"
                                        title="Underline"
                                      >
                                        U
                                      </button>
                                      <span className="text-slate-300">|</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const hLvl = prompt('Enter heading tag (h1, h2, h3, h4) or p for normal text:', 'h2');
                                          if (hLvl) {
                                            document.execCommand('formatBlock', false, hLvl.toLowerCase());
                                          }
                                        }}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded font-semibold text-slate-700 text-[10px]"
                                        title="Format Heading"
                                      >
                                        Heading
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const url = prompt('Enter the link URL:');
                                          if (url) document.execCommand('createLink', false, url);
                                        }}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded text-blue-600 font-medium"
                                        title="Insert Link"
                                      >
                                        Link
                                      </button>
                                      <span className="text-slate-300">|</span>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('insertUnorderedList', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded font-medium text-slate-700"
                                        title="Bullet List"
                                      >
                                        • List
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('insertOrderedList', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded font-medium text-slate-700"
                                        title="Numbered List"
                                      >
                                        1. List
                                      </button>
                                      <span className="text-slate-300">|</span>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('removeFormat', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded text-rose-500 font-semibold"
                                        title="Clear Formatting"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                    <div
                                      contentEditable
                                      className="p-3.5 min-h-[120px] focus:outline-none text-xs text-slate-800 leading-relaxed max-h-[300px] overflow-y-auto"
                                      dangerouslySetInnerHTML={{ __html: block.settings.text || '' }}
                                      onBlur={(e) => {
                                        updateBlockSettings(block.id, { text: e.currentTarget.innerHTML });
                                      }}
                                    />
                                  </div>
                                  <p className="text-[10px] text-slate-400">Pasted styled content (images, tables, rich colors, custom styling, headings) from Microsoft Word, Google Docs, or web pages will persist exactly as copied.</p>
                                </div>
                              )}

                              {block.type === 'image' && (
                                <div className="space-y-4">
                                  {/* Upload Zone & Asset URL */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* WebP Upload Area */}
                                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center relative hover:bg-slate-100/50 transition group min-h-[100px]">
                                      <input
                                        type="file"
                                        accept="image/webp, image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleImageUpload(block.id, file);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      />
                                      <div className="flex flex-col items-center space-y-1">
                                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 group-hover:text-teal-600 group-hover:border-teal-100 transition">
                                          {uploadingBlockId === block.id ? (
                                            <div className="h-5 w-5 border-2 border-teal-500 border-t-transparent animate-spin rounded-full" />
                                          ) : (
                                            <Upload className="h-5 w-5" />
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-[11px] font-bold text-slate-700">Upload Image File</p>
                                          <p className="text-[9px] text-slate-400 mt-0.5">Drag-and-drop or click • WebP highly supported</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Asset URL View & Preview */}
                                    <div className="flex flex-col justify-between space-y-2">
                                      <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Image URL Asset Link</label>
                                        <input
                                          type="text"
                                          value={block.settings.imageUrl || ''}
                                          onChange={(e) => updateBlockSettings(block.id, { imageUrl: e.target.value })}
                                          placeholder="https://images.unsplash.com/..."
                                          className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                        />
                                      </div>
                                      {block.settings.imageUrl && (
                                        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-100 rounded-lg p-1.5">
                                          <img src={block.settings.imageUrl} alt="Thumbnail" className="h-8 w-8 object-cover rounded-md border border-slate-200" referrerPolicy="no-referrer" />
                                          <div className="overflow-hidden">
                                            <p className="text-[9px] font-bold text-slate-500 uppercase">Active Asset</p>
                                            <p className="text-[10px] text-slate-700 truncate max-w-[150px]">{block.settings.imageUrl}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Metadata Fields: Title, Alt, Description */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Title Tag</label>
                                      <input
                                        type="text"
                                        value={block.settings.imageTitle || ''}
                                        onChange={(e) => updateBlockSettings(block.id, { imageTitle: e.target.value })}
                                        placeholder="SEO Title Attribute (e.g. Workspace Analytics)"
                                        className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accessibility Image Alt Caption</label>
                                      <input
                                        type="text"
                                        value={block.settings.imageAlt || ''}
                                        onChange={(e) => updateBlockSettings(block.id, { imageAlt: e.target.value })}
                                        placeholder="Screen reader alt description text"
                                        className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Image Description / Caption</label>
                                    <textarea
                                      rows={2}
                                      value={block.settings.imageDescription || ''}
                                      onChange={(e) => updateBlockSettings(block.id, { imageDescription: e.target.value })}
                                      placeholder="Write an elegant description to render underneath the image element..."
                                      className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                    />
                                  </div>
                                </div>
                              )}

                              {block.type === 'button' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Button Label Text</label>
                                    <input
                                      type="text"
                                      value={block.settings.text || ''}
                                      onChange={(e) => updateBlockSettings(block.id, { text: e.target.value })}
                                      className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Destination URL Endpoint</label>
                                    <input
                                      type="text"
                                      value={block.settings.buttonUrl || ''}
                                      onChange={(e) => updateBlockSettings(block.id, { buttonUrl: e.target.value })}
                                      className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                                    />
                                  </div>
                                </div>
                              )}

                              {block.type === 'quote' && (
                                <div>
                                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Expert Quote Text Quote</label>
                                  <input
                                    type="text"
                                    value={block.settings.text || ''}
                                    onChange={(e) => updateBlockSettings(block.id, { text: e.target.value })}
                                    className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                                  />
                                </div>
                              )}

                              {block.type === 'form' && (
                                <div>
                                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Link Custom Form Scheme</label>
                                  <select
                                    value={block.settings.formId || ''}
                                    onChange={(e) => updateBlockSettings(block.id, { formId: e.target.value })}
                                    className="mt-1 w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                                  >
                                    <option value="">-- Choose Dynamic Form Definition --</option>
                                    {forms.map(f => (
                                      <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {block.type === 'html' && (
                                <div>
                                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Custom HTML Block Markup Code</label>
                                  <textarea
                                    rows={4}
                                    value={block.settings.html || ''}
                                    onChange={(e) => updateBlockSettings(block.id, { html: e.target.value })}
                                    className="mt-1 w-full px-2 py-1 bg-slate-900 text-teal-400 font-mono text-[10px] rounded-lg"
                                  />
                                </div>
                              )}

                              {block.type === 'social-embed' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Video/Social Provider</label>
                                    <select
                                      value={block.settings.embedType || 'youtube'}
                                      onChange={(e) => updateBlockSettings(block.id, { embedType: e.target.value as any })}
                                      className="mt-1 w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
                                    >
                                      <option value="youtube">YouTube Video</option>
                                      <option value="twitter">X / Twitter Post</option>
                                      <option value="instagram">Instagram Embed</option>
                                      <option value="tiktok">TikTok Embed</option>
                                      <option value="custom">Custom Video Link</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Post URL / Share URL</label>
                                    <input
                                      type="text"
                                      value={block.settings.embedUrl || ''}
                                      onChange={(e) => updateBlockSettings(block.id, { embedUrl: e.target.value })}
                                      placeholder="https://www.youtube.com/watch?v=..."
                                      className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-teal-500"
                                    />
                                  </div>
                                </div>
                              )}

                              {block.type === 'pdf-block' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">PDF Attachment File</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <input
                                        type="text"
                                        value={block.settings.pdfUrl || ''}
                                        onChange={(e) => updateBlockSettings(block.id, { pdfUrl: e.target.value })}
                                        placeholder="Paste file link or upload"
                                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
                                      />
                                      <div className="relative">
                                        <input
                                          type="file"
                                          accept="application/pdf"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append('image', file as any); // multer expects field name 'image'
                                            try {
                                              const res = await fetch('/api/upload', {
                                                method: 'POST',
                                                body: formData
                                              });
                                              if (!res.ok) throw new Error('Failed to upload PDF.');
                                              const data = await res.json();
                                              updateBlockSettings(block.id, { pdfUrl: data.url, pdfTitle: file.name });
                                              showToast('success', 'PDF file attached successfully!');
                                            } catch (err: any) {
                                              showToast('error', err.message || 'Failed to upload PDF.');
                                            }
                                          }}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] rounded-lg tracking-wider uppercase whitespace-nowrap">Upload</button>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">PDF Download Label Title</label>
                                    <input
                                      type="text"
                                      value={block.settings.pdfTitle || ''}
                                      onChange={(e) => updateBlockSettings(block.id, { pdfTitle: e.target.value })}
                                      placeholder="e.g. Q3 Publication Supplement"
                                      className="mt-1 w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
                                    />
                                  </div>
                                </div>
                              )}

                              {block.type === 'rich-text' && (
                                <div className="space-y-2 text-left">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Interactive Rich-Text Editor (Copy & Paste Styled Content)</label>
                                    <span className="text-[9px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 font-semibold uppercase tracking-wider">Live</span>
                                  </div>
                                  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner">
                                    {/* Small Toolbar for Quick Actions */}
                                    <div className="bg-slate-50 border-b border-slate-100 px-3 py-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('bold', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded font-bold text-slate-700"
                                        title="Bold"
                                      >
                                        B
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('italic', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded italic text-slate-700"
                                        title="Italic"
                                      >
                                        I
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('underline', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded underline text-slate-700"
                                        title="Underline"
                                      >
                                        U
                                      </button>
                                      <span className="text-slate-300">|</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const url = prompt('Enter the link URL:');
                                          if (url) document.execCommand('createLink', false, url);
                                        }}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded text-blue-600 font-medium"
                                        title="Insert Link"
                                      >
                                        Link
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const url = prompt('Enter Image URL:');
                                          if (url) document.execCommand('insertImage', false, url);
                                        }}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded text-teal-600 font-semibold"
                                        title="Insert Image by URL"
                                      >
                                        Image
                                      </button>
                                      <span className="text-slate-300">|</span>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('insertUnorderedList', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded font-medium text-slate-700"
                                        title="Bullet List"
                                      >
                                        • List
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('insertOrderedList', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded font-medium text-slate-700"
                                        title="Numbered List"
                                      >
                                        1. List
                                      </button>
                                      <span className="text-slate-300">|</span>
                                      <button
                                        type="button"
                                        onClick={() => document.execCommand('removeFormat', false)}
                                        className="px-2 py-0.5 hover:bg-slate-200 rounded text-rose-500 font-semibold"
                                        title="Clear Formatting"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                    <div
                                      contentEditable
                                      className="p-4 min-h-[160px] focus:outline-none text-xs text-slate-800 leading-relaxed max-h-[350px] overflow-y-auto"
                                      dangerouslySetInnerHTML={{ __html: block.settings.html || '' }}
                                      onBlur={(e) => {
                                        updateBlockSettings(block.id, { html: e.target.innerHTML });
                                      }}
                                    />
                                  </div>
                                  <p className="text-[10px] text-slate-400">Pasted styled content (images, tables, rich colors, custom styling) from Microsoft Word, Google Docs, or web resources will persist exactly as copied.</p>
                                </div>
                              )}

                              {/* Stylings togglers (Colors, aligning) */}
                              {block.type !== 'divider' && block.type !== 'html' && block.type !== 'rich-text' && (
                                <div className="mt-3 pt-3 border-t border-slate-200/50 flex flex-wrap gap-4 text-[10px] text-slate-400">
                                  <div className="flex items-center space-x-1.5">
                                    <span>Align:</span>
                                    <button onClick={() => updateBlockSettings(block.id, { align: 'left' })} className={`px-1.5 py-0.5 rounded ${block.settings.align === 'left' ? 'bg-slate-200 font-bold text-slate-800' : ''}`}>Left</button>
                                    <button onClick={() => updateBlockSettings(block.id, { align: 'center' })} className={`px-1.5 py-0.5 rounded ${block.settings.align === 'center' ? 'bg-slate-200 font-bold text-slate-800' : ''}`}>Center</button>
                                    <button onClick={() => updateBlockSettings(block.id, { align: 'right' })} className={`px-1.5 py-0.5 rounded ${block.settings.align === 'right' ? 'bg-slate-200 font-bold text-slate-800' : ''}`}>Right</button>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span>Accent Color:</span>
                                    <input 
                                      type="color" 
                                      value={block.settings.color || '#000000'} 
                                      onChange={(e) => updateBlockSettings(block.id, { color: e.target.value })}
                                      className="w-4 h-4 rounded border-0 cursor-pointer p-0"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Dynamic Layout Visual Output</h3>
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">Static Code Preview</span>
                      </div>
                      <div className="bg-slate-900 text-teal-400 p-6 rounded-2xl min-h-[300px] overflow-auto font-mono text-xs leading-relaxed">
                        {editingPost.rawHtml || '<!-- Write or preview custom static HTML layout code output -->'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              DYNAMIC FORMS CREATOR MODULE
             ----------------------------------------------------------------- */}
          {activeTab === 'forms' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-md font-bold text-slate-900">Dynamic Multi-Field Form Systems</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Build fully dynamic lead capture form structures and capture form submissions securely in real-time.</p>
                </div>
                {!isCreatingForm && (
                  <button
                    onClick={() => setIsCreatingForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Dynamic Form</span>
                  </button>
                )}
              </div>

              {isCreatingForm && (
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-6 max-w-3xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">New Form Scheme Setup</h3>
                    <button onClick={() => setIsCreatingForm(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400">Form Name</label>
                      <input
                        type="text"
                        value={newFormName}
                        onChange={(e) => setNewFormName(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        placeholder="e.g. Free Consultation Quote"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400">SMTP Notification Forwarding Destination (Email)</label>
                      <input
                        type="email"
                        value={newFormEmail}
                        onChange={(e) => setNewFormEmail(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        placeholder="leads@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400">On-Submit Success Feed-Back Message</label>
                    <input
                      type="text"
                      value={newFormSuccess}
                      onChange={(e) => setNewFormSuccess(e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      placeholder="Thank you for getting in touch with us!"
                    />
                  </div>

                  {/* Fields list builder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Form Fields Config</span>
                      <button
                        onClick={() => setNewFormFields([...newFormFields, { label: 'New Field', type: 'text', required: false }])}
                        className="flex items-center space-x-1 text-xs text-teal-600 font-bold"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Field</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {newFormFields.map((f, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
                          <div className="flex-grow">
                            <input
                              type="text"
                              value={f.label}
                              onChange={(e) => {
                                const copy = [...newFormFields];
                                copy[idx].label = e.target.value;
                                setNewFormFields(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                              placeholder="Field Label (e.g. Phone Number)"
                            />
                          </div>
                          <div>
                            <select
                              value={f.type}
                              onChange={(e) => {
                                const copy = [...newFormFields];
                                copy[idx].type = e.target.value as any;
                                setNewFormFields(copy);
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
                            >
                              <option value="text">Single Line Text</option>
                              <option value="email">Email input</option>
                              <option value="textarea">Paragraph message Textarea</option>
                              <option value="checkbox">Toggle checkbox</option>
                            </select>
                          </div>
                          <label className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              checked={f.required}
                              onChange={(e) => {
                                const copy = [...newFormFields];
                                copy[idx].required = e.target.checked;
                                setNewFormFields(copy);
                              }}
                              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span>Required</span>
                          </label>
                          <button
                            onClick={() => setNewFormFields(newFormFields.filter((_, i) => i !== idx))}
                            className="p-1 text-rose-500 hover:bg-white rounded border border-transparent hover:border-slate-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={saveForm}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm"
                    >
                      Establish Form Scheme
                    </button>
                  </div>
                </div>
              )}

              {/* Form definition cards list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map(f => (
                  <div key={f.id} className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between hover:border-slate-300 transition duration-150">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 leading-snug">{f.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md inline-block">Embedded Block Form ID: {f.id}</p>
                      
                      <div className="mt-4 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Form Fields List:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {f.fields.map((field, idx) => (
                            <span key={field.id || idx} className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg font-semibold">
                              {field.label} ({field.type})
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/40">
                        <p><strong className="text-slate-700">Deliver notifications to:</strong> {f.emailTo}</p>
                        <p><strong className="text-slate-700">Success note:</strong> {f.successMessage}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => deleteForm(f.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Form Definition</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              FORM SUBMISSIONS LIST VIEW
             ----------------------------------------------------------------- */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-md font-bold text-slate-900">Lead captures / Form Entries History</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Secure history of captured form responses and SMTP forwarding attempts.</p>
                </div>
                {submissions.length > 0 && currentUser?.role === 'admin' && (
                  <button
                    onClick={clearSubmissions}
                    className="flex items-center space-x-2 px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Submissions History</span>
                  </button>
                )}
              </div>

              {submissions.length === 0 ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-12 text-center text-slate-400">
                  No form lead entries captured in the CMS yet. Embedded forms will capture leads here!
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map(sub => (
                    <div key={sub.id} className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4 hover:border-slate-300 transition duration-150">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-3 gap-2">
                        <div>
                          <span className="text-xs font-extrabold text-slate-400 uppercase">Submision Entry on form:</span>
                          <h3 className="text-sm font-bold text-slate-800">{sub.formName}</h3>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                          <span>ID: {sub.id}</span>
                          <span>•</span>
                          <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full border font-bold uppercase ${
                            sub.status === 'sent' 
                              ? 'bg-teal-50 text-teal-700 border-teal-100' 
                              : sub.status === 'failed'
                              ? 'bg-rose-50 text-rose-700 border-rose-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted Lead Fields:</span>
                          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                            {Object.entries(sub.data).map(([key, value]) => (
                              <p key={key} className="text-slate-700 font-medium">
                                <strong className="text-slate-900 font-bold">{key}:</strong> {value === true ? 'Yes / Checked' : value === false ? 'No' : String(value)}
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SMTP Delivery Trace Logs:</span>
                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl font-mono text-[10px] text-teal-400/80 leading-relaxed overflow-auto max-h-[120px]">
                            {sub.smtpLog || 'No trace recorded.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              SMTP ROUTING SETTINGS VIEW (ADMIN ONLY)
             ----------------------------------------------------------------- */}
          {activeTab === 'smtp' && currentUser?.role === 'admin' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <h2 className="text-md font-bold text-slate-900">Custom SMTP Server Routing</h2>
                <p className="text-xs text-slate-400 mt-0.5">Integrate transactional email senders (Mailtrap, SendGrid, Amazon SES) with customized SMTP configurations to forward form submission entries instantly.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SMTP Input Configuration */}
                <form onSubmit={saveSmtpSettings} className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SMTP Server Properties</h3>
                    <label className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smtpInputs.enabled}
                        onChange={(e) => setSmtpInputs({ ...smtpInputs, enabled: e.target.checked })}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span>Enable Routing</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase text-slate-400">SMTP Host / Endpoint</label>
                      <input
                        type="text"
                        required
                        value={smtpInputs.host}
                        onChange={(e) => setSmtpInputs({ ...smtpInputs, host: e.target.value })}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="e.g. smtp.mailtrap.io"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400">Port Number</label>
                      <input
                        type="number"
                        required
                        value={smtpInputs.port}
                        onChange={(e) => setSmtpInputs({ ...smtpInputs, port: parseInt(e.target.value, 10) })}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="2525"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400">SMTP Authentication User</label>
                      <input
                        type="text"
                        value={smtpInputs.user}
                        onChange={(e) => setSmtpInputs({ ...smtpInputs, user: e.target.value })}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                        placeholder="SMTP username / API key"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400">SMTP Authentication Secret Password</label>
                      <input
                        type="password"
                        value={smtpInputs.pass}
                        onChange={(e) => setSmtpInputs({ ...smtpInputs, pass: e.target.value })}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                        placeholder="SMTP password"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400">Sender Display Name (From Name)</label>
                      <input
                        type="text"
                        value={smtpInputs.fromName}
                        onChange={(e) => setSmtpInputs({ ...smtpInputs, fromName: e.target.value })}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="GoPixel CMS Lead Tracker"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400">Sender Email Address (From Email)</label>
                      <input
                        type="email"
                        value={smtpInputs.fromEmail}
                        onChange={(e) => setSmtpInputs({ ...smtpInputs, fromEmail: e.target.value })}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        placeholder="cms@company.com"
                      />
                    </div>
                  </div>

                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      id="smtp-secure"
                      checked={smtpInputs.secure}
                      onChange={(e) => setSmtpInputs({ ...smtpInputs, secure: e.target.checked })}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <label htmlFor="smtp-secure" className="ml-2 block text-xs text-slate-600 font-semibold cursor-pointer">
                      Use SSL/TLS Security protocol (Force Secure connection)
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={testSmtpConnection}
                      disabled={smtpTesting}
                      className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl transition duration-150 disabled:opacity-50"
                    >
                      <PlayCircle className="h-4 w-4 text-teal-600 animate-pulse" />
                      <span>{smtpTesting ? 'Testing Link...' : 'Test Connection'}</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>

                {/* Live SMTP Debugger logs panel */}
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] lg:col-span-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Email Transmission Tester</h3>
                  <p className="text-xs text-slate-400">Validate host credentials, routing limits and TLS handshake connectivity reports immediately.</p>
                  
                  {smtpTestResult ? (
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                      smtpTestResult.success 
                        ? 'bg-teal-50 border-teal-100 text-teal-800' 
                        : 'bg-rose-50 border-rose-100 text-rose-800'
                    }`}>
                      <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-[10px]">
                        {smtpTestResult.success ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        <span>{smtpTestResult.success ? 'SMTP Verification Succeeded' : 'SMTP Link Refused'}</span>
                      </div>
                      <p className="font-mono bg-white/60 p-2.5 rounded-lg border border-slate-100">{smtpTestResult.message}</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/40 p-8 text-center rounded-2xl text-slate-400 text-xs">
                      Click "Test Connection" to trigger verification. Connection outcomes and diagnostic details will render here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              RBAC USER SECURITY WORKSPACE (ADMIN ONLY)
             ----------------------------------------------------------------- */}
          {activeTab === 'users' && currentUser?.role === 'admin' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-md font-bold text-slate-900">Role-Based Access Control (RBAC) Security</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Define multi-user workflow boundaries by upgrading or degrading administrative privileges safely.</p>
                </div>
              </div>

              {/* Manual User Creation Form */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center space-x-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Manually Provision New User Account</span>
                </h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newUserFullName || !newUserUsername || !newUserEmail || !newUserPassword) {
                      showToast('error', 'Please fill in all user details.');
                      return;
                    }
                    const success = await createUser({
                      fullName: newUserFullName,
                      username: newUserUsername,
                      email: newUserEmail,
                      password: newUserPassword,
                      role: newUserRole
                    });
                    if (success) {
                      setNewUserFullName('');
                      setNewUserUsername('');
                      setNewUserEmail('');
                      setNewUserPassword('');
                      setNewUserRole('author');
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
                >
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUserFullName}
                      onChange={(e) => setNewUserFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Username</label>
                    <input
                      type="text"
                      required
                      value={newUserUsername}
                      onChange={(e) => setNewUserUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="e.g. johndoe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Password</label>
                    <input
                      type="password"
                      required
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                    />
                  </div>
                  <div className="space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="author">Author</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-slate-200/50 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100 text-xs">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User Details</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Role &amp; Authority</th>
                      <th className="px-6 py-4 font-semibold">Account Status</th>
                      <th className="px-6 py-4 text-right font-semibold">Security &amp; Moderation Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-slate-900 flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase text-[10px]">
                            {u.fullName.substring(0,2)}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800">{u.fullName}</span>
                            <span className="block font-mono text-[10px] text-slate-400">@{u.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          {u.id === 'superadmin' ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 border-amber-200 text-amber-700 font-black shadow-sm animate-pulse">
                              Superadmin
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 border-indigo-100 text-indigo-700">
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {u.status === 'suspended' ? (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider bg-rose-50 border-rose-100 text-rose-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                              <span>Suspended</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 border-emerald-100 text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>Active</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end space-x-3">
                          <div className="flex items-center space-x-2">
                            {/* Role Select */}
                            <select
                              disabled={u.id === currentUser.id || u.id === 'superadmin'}
                              value={u.role}
                              onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-teal-500 focus:outline-none disabled:opacity-50"
                              title={u.id === 'superadmin' ? "The Superadmin account role cannot be modified." : u.id === currentUser.id ? "Cannot modify your own administrative role." : "Change user access role"}
                            >
                              <option value="admin">Admin</option>
                              <option value="editor">Editor</option>
                              <option value="author">Author</option>
                              <option value="viewer">Viewer</option>
                            </select>

                            {/* Status Change Control */}
                            {u.id !== currentUser.id && u.id !== 'superadmin' && (
                              <button
                                onClick={() => changeUserStatus(u.id, u.status === 'suspended' ? 'active' : 'suspended')}
                                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                                  u.status === 'suspended'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                }`}
                                title={u.status === 'suspended' ? 'Activate / Unblock User' : 'Suspend / Block User'}
                              >
                                {u.status === 'suspended' ? (
                                  <>
                                    <UserCheck className="h-3.5 w-3.5 shrink-0" />
                                    <span>Unsuspend</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="h-3.5 w-3.5 shrink-0" />
                                    <span>Suspend</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          
                          <button
                            disabled={u.id === currentUser.id || u.id === 'superadmin'}
                            onClick={() => deleteUser(u.id)}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition"
                            title={u.id === 'superadmin' ? "The Superadmin account cannot be deleted or removed." : u.id === currentUser.id ? "Cannot delete your own session account" : "Delete user account"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              SYSTEM AUDIT LOGS MODULE (ADMIN ONLY)
             ----------------------------------------------------------------- */}
          {activeTab === 'logs' && currentUser?.role === 'admin' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-md font-bold text-slate-900">System Trace Log & Security Audit Trails</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Direct telemetry tracking access attempts, database writes, and authorization requests.</p>
                </div>
                {systemLogs.length > 0 && (
                  <button
                    onClick={clearSystemLogs}
                    className="flex items-center space-x-2 px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Audit Telemetry</span>
                  </button>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-lg overflow-hidden">
                <div className="overflow-y-auto max-h-[500px] divide-y divide-slate-900/60 font-mono text-[10px] text-slate-300 space-y-2.5 leading-relaxed">
                  {systemLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No system events logged in audit trails.
                    </div>
                  ) : (
                    systemLogs.map(log => (
                      <div key={log.id} className="py-2 flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                        <span className="text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <div className="flex-grow">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mr-2 ${
                            log.level === 'error' 
                              ? 'bg-rose-950 text-rose-400' 
                              : log.level === 'security'
                              ? 'bg-indigo-950 text-indigo-400 border border-indigo-900'
                              : log.level === 'warn'
                              ? 'bg-amber-950 text-amber-400'
                              : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {log.level}
                          </span>
                          <span className="text-slate-200">{log.message}</span>
                          {log.context && <span className="text-teal-400 text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 ml-2">[{log.context}]</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl animate-fade-in">
              <div className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex items-center space-x-5 pb-6 border-b border-slate-100">
                  <div className="h-16 w-16 rounded-full bg-slate-900 border-2 border-teal-500 flex items-center justify-center font-bold text-white text-2xl shadow-md">
                    {currentUser?.fullName?.substring(0, 2).toUpperCase() || 'US'}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.fullName}</h2>
                    <p className="text-xs text-slate-400">Personal Author & CMS Credentials</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Email Address</span>
                    <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{currentUser?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Username handle</span>
                    <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">@{currentUser?.username}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Assigned RBAC Role</span>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{currentUser?.role}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Valid session</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Account Status</span>
                    <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Active Verified Author</span>
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Role Capabilities Matrix</h3>
                  <div className="text-[11px] text-slate-500 space-y-1.5 leading-relaxed">
                    {currentUser?.role === 'admin' && (
                      <p>🛡️ <span className="font-bold text-slate-800">Administrator capabilities:</span> You have full master privileges. You can publish, modify, and delete pages/visual posts, configure third-party SMTP and form routings, execute server-level overrides, and verify security/RBAC logs.</p>
                    )}
                    {currentUser?.role === 'editor' && (
                      <p>📝 <span className="font-bold text-slate-800">Editor capabilities:</span> You can publish, modify, and delete pages/visual posts. You also have visibility into submissions and analytics, but cannot change RBAC parameters, SMTP routings, or wipe raw event logs.</p>
                    )}
                    {currentUser?.role === 'author' && (
                      <p>✍️ <span className="font-bold text-slate-800">Author capabilities:</span> You can create, edit, and publish your own visual pages and blog posts. You cannot view system audit trails, modify other users' roles, or configure third-party routing.</p>
                    )}
                  </div>
                </div>

                <form onSubmit={saveProfileSocials} className="pt-6 border-t border-slate-100 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">My Personal Social Media Links</h3>
                    <p className="text-[10px] text-slate-400">Add URLs to your public social platforms. These can be displayed dynamically alongside your author cards.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Twitter / X URL</label>
                      <input
                        type="url"
                        value={profileSocials.twitter}
                        onChange={(e) => setProfileSocials({ ...profileSocials, twitter: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium transition"
                        placeholder="https://twitter.com/myusername"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={profileSocials.linkedin}
                        onChange={(e) => setProfileSocials({ ...profileSocials, linkedin: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium transition"
                        placeholder="https://linkedin.com/in/myusername"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={profileSocials.github}
                        onChange={(e) => setProfileSocials({ ...profileSocials, github: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium transition"
                        placeholder="https://github.com/myusername"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={profileSocials.facebook}
                        onChange={(e) => setProfileSocials({ ...profileSocials, facebook: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium transition"
                        placeholder="https://facebook.com/myusername"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                    >
                      Save Social Links
                    </button>
                  </div>
                </form>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-rose-600/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Confirm Profile Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customizer' && (currentUser?.role === 'admin' || currentUser?.role === 'editor') && (
            <div className="space-y-6 max-w-4xl animate-fade-in">
              <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Global Website Frontend Customizer</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Edit visual elements of the public-facing platform, including dynamic headers, logo monograms, hero copies, and color highlights.</p>
                  </div>
                  <a 
                    href="/" 
                    target="_blank" 
                    className="flex items-center space-x-1 px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-semibold hover:border-slate-300 transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Live Preview</span>
                  </a>
                </div>

                <form onSubmit={saveSiteSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
                  {/* Form Settings Inputs */}
                  <div className="lg:col-span-7 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Site Title / Platform Name</label>
                      <input
                        type="text"
                        required
                        value={customizerInputs.siteName}
                        onChange={(e) => setCustomizerInputs({ ...customizerInputs, siteName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                        placeholder="e.g. GoPixel CMS"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Dynamic Banner Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={customizerInputs.siteTagline}
                        onChange={(e) => setCustomizerInputs({ ...customizerInputs, siteTagline: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                        placeholder="e.g. WordPress Simplicity. Static HTML Speed."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Site Hero Summary Description</label>
                      <textarea
                        rows={4}
                        value={customizerInputs.siteDescription}
                        onChange={(e) => setCustomizerInputs({ ...customizerInputs, siteDescription: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition leading-relaxed resize-none"
                        placeholder="e.g. This system compiles elegant visual block structures into pure semantic HTML..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Accent Theme Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={customizerInputs.accentColor}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, accentColor: e.target.value })}
                            className="h-9 w-10 border border-slate-200 rounded-lg cursor-pointer bg-white"
                          />
                          <input
                            type="text"
                            value={customizerInputs.accentColor}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, accentColor: e.target.value })}
                            className="flex-grow bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono transition"
                            placeholder="#0F766E"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Logo Monogram Letter (Max 2 Alphabets)</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={customizerInputs.logoLetter || ''}
                          onChange={(e) => setCustomizerInputs({ ...customizerInputs, logoLetter: e.target.value.substring(0, 2).toUpperCase() })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2 text-xs text-slate-800 font-black text-center uppercase tracking-widest transition"
                          placeholder="GP"
                        />
                      </div>
                    </div>

                    {/* Frontend Logo / Brand Settings */}
                    <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600/90">Site Deployment & Host Settings</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Registered Domain Name</label>
                          <input
                            type="text"
                            required
                            value={customizerInputs.domainName || ''}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, domainName: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                            placeholder="e.g. yourdomain.com"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">System Timezone</label>
                          <select
                            value={customizerInputs.timezone || 'UTC'}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, timezone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                          >
                            <option value="UTC">UTC (GMT+0)</option>
                            <option value="America/New_York">Eastern Time (EST/EDT)</option>
                            <option value="America/Chicago">Central Time (CST/CDT)</option>
                            <option value="America/Denver">Mountain Time (MST/MDT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                            <option value="Europe/London">London (GMT/BST)</option>
                            <option value="Europe/Paris">Paris (CET/CEST)</option>
                            <option value="Asia/Kolkata">Kolkata (IST)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Asia/Singapore">Singapore (SGT)</option>
                            <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600/90">Brand Logo & Website Type Settings</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Website Type (Site Schema)</label>
                          <select
                            value={customizerInputs.websiteType || 'blog'}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, websiteType: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                          >
                            <option value="blog">Blog / Writing Log</option>
                            <option value="news">News / Editorial Portal</option>
                            <option value="agency">Agency / Studio Bureau</option>
                            <option value="portfolio">Personal Portfolio Showroom</option>
                            <option value="business">Local Business / Company Home</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Show Monogram Badge</label>
                          <select
                            value={customizerInputs.showMonogram === false ? 'false' : 'true'}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, showMonogram: e.target.value === 'true' })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                          >
                            <option value="true">Yes, Show Monogram</option>
                            <option value="false">No, Disable Monogram</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Fallback Brand Emoji / Icon</label>
                          <input
                            type="text"
                            value={customizerInputs.logoIcon || ''}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, logoIcon: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                            placeholder="e.g. 🚀, 💻, or 🎨"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Logo Display Mode</label>
                          <select
                            value={customizerInputs.logoMode || 'both'}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, logoMode: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                          >
                            <option value="both">Show Both (Logo & Site Name)</option>
                            <option value="logo_only">Show Logo Only</option>
                            <option value="text_only">Show Text Only</option>
                          </select>
                        </div>
                      </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Upload Custom Logo Image</label>
                          {customizerInputs.logoImage ? (
                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-between">
                              <img src={customizerInputs.logoImage} alt="Logo Preview" className="h-8 max-w-[120px] object-contain" referrerPolicy="no-referrer" />
                              <button
                                type="button"
                                onClick={() => setCustomizerInputs({ ...customizerInputs, logoImage: '' })}
                                className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition"
                              >
                                Clear
                              </button>
                            </div>
                          ) : (
                            <div className="border border-dashed border-slate-200 rounded-xl p-2.5 text-center hover:bg-slate-50 transition relative cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const formData = new FormData();
                                  formData.append('image', file);
                                  try {
                                    const uploadRes = await fetch('/api/upload', {
                                      method: 'POST',
                                      headers: {
                                        'Authorization': `Bearer ${token}`
                                      },
                                      body: formData
                                    });
                                    if (uploadRes.ok) {
                                      const data = await uploadRes.json();
                                      setCustomizerInputs({ ...customizerInputs, logoImage: data.url });
                                      showToast('success', 'Logo uploaded successfully!');
                                    } else {
                                      const data = await uploadRes.json();
                                      showToast('error', data.error || 'Upload failed');
                                    }
                                  } catch (err) {
                                    showToast('error', 'Upload failed');
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <p className="text-[10px] text-slate-500 font-bold">Click to upload logo image</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Setup Re-initialization Section */}
                      <div className="border-t border-slate-100 pt-5 mt-2 space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-4 w-4 text-amber-500 shrink-0" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Re-populate Template Articles & Colors</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Want to fully change your platform layout? Re-run the background content generator to pre-populate starter blog posts, news grids, agency services, bio elements, or business menus matching <span className="font-semibold text-teal-600">"{customizerInputs.websiteType || 'blog'}"</span>.
                        </p>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to re-run starter content generation? This will overwrite your current preseeded database posts and configure header/footer menus and default color highlights recommended for a ${customizerInputs.websiteType?.toUpperCase() || 'BLOG'} platform. Your custom settings will remain.`)) {
                              try {
                                const res = await fetch('/api/setup', {
                                  method: 'POST',
                                  headers: getHeaders(),
                                  body: JSON.stringify({
                                    websiteType: customizerInputs.websiteType || 'blog',
                                    siteName: customizerInputs.siteName || 'GoPixel CMS',
                                    siteTagline: customizerInputs.siteTagline || 'WordPress Simplicity. Static HTML Speed.'
                                  })
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || 'Setup re-run failed');
                                showToast('success', `Site successfully pre-populated for a ${customizerInputs.websiteType?.toUpperCase()}!`);
                                
                                // Reload CMS data
                                setSiteSettings(data.siteSettings);
                                setCustomizerInputs(data.siteSettings);
                                loadAllCmsData();
                                
                                // Go to dashboard
                                setActiveTab('dashboard');
                              } catch (err: any) {
                                showToast('error', err.message || 'Failed to re-initialize site');
                              }
                            }
                          }}
                          className="inline-flex items-center space-x-2 px-3.5 py-2 border border-amber-200 hover:border-amber-300 text-amber-800 bg-white hover:bg-amber-50 rounded-xl text-[11px] font-bold transition shadow-sm"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Generate {(customizerInputs.websiteType || 'blog').toUpperCase()} Starter Grid</span>
                        </button>
                      </div>

                    {/* Dynamic Frontend Article Settings */}
                    <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600/90">Frontend Listing Settings</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Articles to show on Front Page</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={customizerInputs.frontPageArticlesCount ?? 6}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, frontPageArticlesCount: parseInt(e.target.value, 10) || 6 })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Articles Grid Columns (1 - 4)</label>
                          <select
                            value={customizerInputs.frontPageColumnsCount ?? 3}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, frontPageColumnsCount: parseInt(e.target.value, 10) || 3 })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                          >
                            <option value={1}>1 Column List</option>
                            <option value={2}>2 Columns Grid</option>
                            <option value={3}>3 Columns Grid</option>
                            <option value={4}>4 Columns Grid</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Homepage SEO Keywords (Comma Separated)</label>
                        <input
                          type="text"
                          value={customizerInputs.seoKeywords || ''}
                          onChange={(e) => setCustomizerInputs({ ...customizerInputs, seoKeywords: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                          placeholder="e.g. cms, visual builder, sitemap, seo, lightning fast"
                        />
                      </div>
                    </div>

                    {/* SEO, Performance & Analytics Section */}
                    <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600/90">SEO, Performance & Google Analytics</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Google Analytics Tracking ID (GTAG)</label>
                          <input
                            type="text"
                            value={customizerInputs.googleAnalyticsId || ''}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, googleAnalyticsId: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono transition"
                            placeholder="e.g. G-XXXXXXX"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Google Search Console Verification Key</label>
                          <input
                            type="text"
                            value={customizerInputs.googleSearchConsoleVerification || ''}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, googleSearchConsoleVerification: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono transition"
                            placeholder="e.g. google-site-verification..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Enable Lazy Image Loading (Performance)</label>
                        <select
                          value={customizerInputs.enableLazyLoading === false ? 'false' : 'true'}
                          onChange={(e) => setCustomizerInputs({ ...customizerInputs, enableLazyLoading: e.target.value === 'true' })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                        >
                          <option value="true">Enabled (Deferred offscreen assets for maximum load speed)</option>
                          <option value="false">Disabled (Load all cover assets instantly)</option>
                        </select>
                      </div>
                    </div>

                    {/* Local SEO / Business Schema Section */}
                    <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600/90">Local SEO / Business Schema</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Business Mailing Address</label>
                          <input
                            type="text"
                            value={customizerInputs.businessAddress || ''}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, businessAddress: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                            placeholder="e.g. 1600 Amphitheatre Pkwy, Mountain View, CA"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Business Phone Number</label>
                          <input
                            type="text"
                            value={customizerInputs.businessPhone || ''}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, businessPhone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium transition"
                            placeholder="e.g. +1 (650) 253-0000"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Geo Location Latitude</label>
                          <input
                            type="text"
                            value={customizerInputs.businessGeoLatitude || ''}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, businessGeoLatitude: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono transition"
                            placeholder="e.g. 37.4220"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Geo Location Longitude</label>
                          <input
                            type="text"
                            value={customizerInputs.businessGeoLongitude || ''}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, businessGeoLongitude: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono transition"
                            placeholder="e.g. -122.0841"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Custom Header & Body Injections */}
                    <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600/90">Custom Header & Body Code Insertion</h4>
                      
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Header Injection (e.g. Ad Codes, Meta Tags)</label>
                        <textarea
                          rows={4}
                          value={customizerInputs.headerCustomCode || ''}
                          onChange={(e) => setCustomizerInputs({ ...customizerInputs, headerCustomCode: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono transition resize-none"
                          placeholder="e.g. <script src='https://pagead2.googlesyndication.com...'></script>"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Body Injection (e.g. Support Chat Widgets, Analytics Footer)</label>
                        <textarea
                          rows={4}
                          value={customizerInputs.bodyCustomCode || ''}
                          onChange={(e) => setCustomizerInputs({ ...customizerInputs, bodyCustomCode: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono transition resize-none"
                          placeholder="e.g. <!-- chat widget HTML -->"
                        />
                      </div>
                    </div>

                    {/* Security, CAPTCHA & Public Signup Section */}
                    <div className="border-t border-slate-100 pt-6 mt-2 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600/90">Security, CAPTCHA & Public Signup</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Public Sign Up (Self-Registration)</label>
                          <select
                            value={customizerInputs.allowPublicSignup === false ? 'false' : 'true'}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, allowPublicSignup: e.target.value === 'true' })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                          >
                            <option value="true">Allowed (Visitors can sign up as Authors)</option>
                            <option value="false">Disabled (Private CMS - Admin provisioning only)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Enable Anti-Spam CAPTCHA</label>
                          <select
                            value={customizerInputs.captchaEnabled === true ? 'true' : 'false'}
                            onChange={(e) => setCustomizerInputs({ ...customizerInputs, captchaEnabled: e.target.value === 'true' })}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                          >
                            <option value="false">Disabled (Standard security & checkboxes)</option>
                            <option value="true">Enabled (Require validation for Comments and Signup)</option>
                          </select>
                        </div>
                      </div>

                      {customizerInputs.captchaEnabled && (
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">CAPTCHA Mode & Provider</label>
                            <select
                              value={customizerInputs.captchaMode === 'external' ? (customizerInputs.captchaProvider || 'google_recaptcha') : 'built_in_math'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'built_in_math') {
                                  setCustomizerInputs({
                                    ...customizerInputs,
                                    captchaMode: 'built_in_math'
                                  });
                                } else {
                                  setCustomizerInputs({
                                    ...customizerInputs,
                                    captchaMode: 'external',
                                    captchaProvider: val as any
                                  });
                                }
                              }}
                              className="w-full bg-white border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold transition"
                            >
                              <option value="built_in_math">Built-In Interactive Math Challenge (Instant Setup, No Keys Required)</option>
                              <option value="google_recaptcha">Google reCAPTCHA v2 (External API Keys Required)</option>
                              <option value="cloudflare_turnstile">Cloudflare Turnstile (External API Keys Required)</option>
                              <option value="hcaptcha">hCaptcha (External API Keys Required)</option>
                            </select>
                          </div>

                          {customizerInputs.captchaMode === 'external' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">CAPTCHA Site Key (Public)</label>
                                <input
                                  type="text"
                                  value={customizerInputs.captchaSiteKey || ''}
                                  onChange={(e) => setCustomizerInputs({ ...customizerInputs, captchaSiteKey: e.target.value })}
                                  className="w-full bg-white border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono transition"
                                  placeholder="Site key provided by CAPTCHA dashboard"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">CAPTCHA Secret Key (Private)</label>
                                <input
                                  type="password"
                                  value={customizerInputs.captchaSecretKey || ''}
                                  onChange={(e) => setCustomizerInputs({ ...customizerInputs, captchaSecretKey: e.target.value })}
                                  className="w-full bg-white border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono transition"
                                  placeholder="Secret/private key (masked if configured)"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-teal-600/10"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Customizations</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-time Interactive Mock Preview */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between space-y-6">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-4">Live Preview Mockup</span>
                      
                      {/* Simulated Page Header */}
                      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {(customizerInputs.logoMode === 'both' || customizerInputs.logoMode === 'logo_only' || !customizerInputs.logoMode) && (
                            customizerInputs.logoImage ? (
                              <img src={customizerInputs.logoImage} alt="Simulated Logo" className="h-7 w-auto max-w-[80px] object-contain rounded-md" referrerPolicy="no-referrer" />
                            ) : (
                              customizerInputs.showMonogram !== false ? (
                                <div 
                                  className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm transition-all duration-300"
                                  style={{ backgroundColor: customizerInputs.accentColor || '#0F766E' }}
                                >
                                  {customizerInputs.logoIcon || customizerInputs.logoLetter || 'G'}
                                </div>
                              ) : customizerInputs.logoIcon ? (
                                <div className="text-lg flex items-center justify-center h-7 w-7">
                                  {customizerInputs.logoIcon}
                                </div>
                              ) : null
                            )
                          )}
                          {(customizerInputs.logoMode === 'both' || customizerInputs.logoMode === 'text_only' || !customizerInputs.logoMode) && (
                            <span className="text-xs font-bold text-slate-800 transition-all duration-300">{customizerInputs.siteName || 'GoPixel CMS'}</span>
                          )}
                        </div>
                        <div className="h-3 w-10 bg-slate-100 rounded-full"></div>
                      </div>

                      {/* Simulated Hero */}
                      <div className="mt-6 text-center space-y-2 px-2">
                        <h3 className="text-sm font-extrabold text-slate-900 leading-tight transition-all duration-300">
                          {customizerInputs.siteName || 'GoPixel CMS'}<br />
                          <span className="text-[10px] font-medium italic transition-all duration-300" style={{ color: customizerInputs.accentColor }}>
                            {customizerInputs.siteTagline || 'WordPress Simplicity.'}
                          </span>
                        </h3>
                        <p className="text-[10px] text-slate-400 line-clamp-3 transition-all duration-300 leading-relaxed">
                          {customizerInputs.siteDescription || 'Visual block system.'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl flex items-start space-x-2 text-[10px] text-amber-800 leading-normal">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>Saving these configurations instantly recompiles and re-themes your static SSR index landing and article view templates on the backend.</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Media/Gallery Library Tab */}
          {activeTab === 'media' && currentUser && (
            <div className="space-y-6 max-w-5xl animate-fade-in">
              <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-sm">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Media & Asset Library</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Upload, manage, and retrieve static assets for your visual visual-block pages.</p>
                  </div>
                  
                  {/* Quick Upload Button */}
                  <div className="relative inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl px-5 py-2.5 transition duration-150 ease-in-out cursor-pointer shadow-md shadow-teal-600/10">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                          showToast('success', 'Uploading asset to server...');
                          const uploadRes = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                          });
                          if (uploadRes.ok) {
                            showToast('success', 'Asset uploaded successfully!');
                            fetchMediaFiles();
                          } else {
                            const data = await uploadRes.json();
                            showToast('error', data.error || 'Upload failed');
                          }
                        } catch (err) {
                          showToast('error', 'Upload failed');
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload New Image</span>
                    </span>
                  </div>
                </div>

                {/* Media grid */}
                {loadingMedia ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Syncing assets datastore...</span>
                  </div>
                ) : mediaFiles.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-8 my-6">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                      <Image className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No assets in gallery yet</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Upload brand logos, background covers, or product photography to copy their visual path routes.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-5 pt-6">
                    {mediaFiles.map((media) => (
                      <div 
                        key={media.filename}
                        onClick={() => setSelectedMedia(media)}
                        className="group bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden cursor-pointer hover:border-teal-400 hover:shadow-md transition duration-200 flex flex-col"
                      >
                        <div className="aspect-square w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                          <img src={media.url} alt={media.filename} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-3 bg-white flex-grow flex flex-col justify-between">
                          <p className="text-[11px] font-bold text-slate-700 truncate" title={media.filename}>{media.filename}</p>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-1">{media.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Detailed Selected Media Modal Overlay */}
          {selectedMedia && (
            <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
              <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                
                {/* Image display */}
                <div className="aspect-video bg-slate-900 flex items-center justify-center border-b border-slate-100 p-2 relative">
                  <img src={selectedMedia.url} alt={selectedMedia.filename} className="max-h-full max-w-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => setSelectedMedia(null)}
                    className="absolute top-4 right-4 h-8 w-8 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center text-lg transition"
                  >
                    &times;
                  </button>
                </div>

                {/* Details list */}
                <div className="p-6 md:p-8 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">File Name</span>
                    <p className="text-xs font-bold text-slate-800 break-all bg-slate-50 p-2.5 rounded-xl border border-slate-100">{selectedMedia.filename}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">File Size</span>
                      <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{selectedMedia.size}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Created At</span>
                      <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{new Date(selectedMedia.mtime).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resolved Path URL</span>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={selectedMedia.url} 
                        className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 font-mono focus:outline-none" 
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedMedia.url);
                          showToast('success', 'Asset path copied to clipboard!');
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shrink-0"
                      >
                        Copy Path
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={async () => {
                        if (!confirm(`Permanently wipe asset "${selectedMedia.filename}"?`)) return;
                        try {
                          const res = await fetch(`/api/media/${encodeURIComponent(selectedMedia.filename)}`, {
                            method: 'DELETE',
                            headers: getHeaders()
                          });
                          if (res.ok) {
                            showToast('success', 'Asset successfully deleted.');
                            setSelectedMedia(null);
                            fetchMediaFiles();
                          } else {
                            const data = await res.json();
                            showToast('error', data.error || 'Failed to delete asset');
                          }
                        } catch (err) {
                          showToast('error', 'Network error deleting asset');
                        }
                      }}
                      className="flex items-center space-x-1 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Asset</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="px-5 py-2 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold transition"
                    >
                      Close Overlay
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Menus & Socials Tab */}
          {activeTab === 'menus' && (currentUser?.role === 'admin' || currentUser?.role === 'editor') && (
            <div className="space-y-6 max-w-5xl animate-fade-in">
              <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-sm">
                
                {/* Header block */}
                <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Custom Navigation Menus & Business Socials</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Set customized menus for website header and footer navs, and sync external corporate social channels.</p>
                  </div>
                  
                  <button
                    onClick={saveMenusAndSocials}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-teal-600/10"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Nav & Socials</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left columns (Nav Menus Builder) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Header menu item list */}
                    <div className="border border-slate-200/60 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Header Custom Menu</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">These visual links appear inside the sticky top header of all SSR templates.</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const label = prompt('Enter link label (e.g. Services):');
                            if (!label) return;
                            const url = prompt('Enter link relative URL (e.g. /p/services):', '/p/');
                            if (!url) return;
                            setHeaderMenu([...headerMenu, { label, url }]);
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 rounded-lg text-[10px] font-bold transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Item</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {headerMenu.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic text-center py-4">No header links configured. Falls back to original sitemap reference.</p>
                        ) : (
                          headerMenu.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <div className="flex items-center space-x-2.5">
                                <span className="h-5 w-5 rounded-md bg-slate-200/60 text-slate-500 flex items-center justify-center text-[10px] font-bold font-mono">{idx + 1}</span>
                                <div className="truncate">
                                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                                  <span className="text-[10px] font-mono text-slate-400 ml-2">{item.url}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const copy = [...headerMenu];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx - 1];
                                    copy[idx - 1] = temp;
                                    setHeaderMenu(copy);
                                  }}
                                  className="h-7 w-7 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded-lg flex items-center justify-center hover:bg-slate-200/50 transition"
                                >
                                  <MoveUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === headerMenu.length - 1}
                                  onClick={() => {
                                    const copy = [...headerMenu];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx + 1];
                                    copy[idx + 1] = temp;
                                    setHeaderMenu(copy);
                                  }}
                                  className="h-7 w-7 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded-lg flex items-center justify-center hover:bg-slate-200/50 transition"
                                >
                                  <MoveDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!confirm(`Delete header menu link "${item.label}"?`)) return;
                                    setHeaderMenu(headerMenu.filter((_, i) => i !== idx));
                                  }}
                                  className="h-7 w-7 text-rose-500 hover:text-rose-700 rounded-lg flex items-center justify-center hover:bg-rose-50 transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Footer menu item list */}
                    <div className="border border-slate-200/60 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Footer Custom Menu</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">These navigation links sit inside the bottom dark footer of all compiled pages.</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const label = prompt('Enter link label (e.g. Terms of Service):');
                            if (!label) return;
                            const url = prompt('Enter link relative URL (e.g. /p/terms):', '/p/');
                            if (!url) return;
                            setFooterMenu([...footerMenu, { label, url }]);
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 rounded-lg text-[10px] font-bold transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Item</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {footerMenu.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic text-center py-4">No footer links configured. Falls back to basic sitemap link.</p>
                        ) : (
                          footerMenu.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <div className="flex items-center space-x-2.5">
                                <span className="h-5 w-5 rounded-md bg-slate-200/60 text-slate-500 flex items-center justify-center text-[10px] font-bold font-mono">{idx + 1}</span>
                                <div className="truncate">
                                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                                  <span className="text-[10px] font-mono text-slate-400 ml-2">{item.url}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const copy = [...footerMenu];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx - 1];
                                    copy[idx - 1] = temp;
                                    setFooterMenu(copy);
                                  }}
                                  className="h-7 w-7 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded-lg flex items-center justify-center hover:bg-slate-200/50 transition"
                                >
                                  <MoveUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === footerMenu.length - 1}
                                  onClick={() => {
                                    const copy = [...footerMenu];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx + 1];
                                    copy[idx + 1] = temp;
                                    setFooterMenu(copy);
                                  }}
                                  className="h-7 w-7 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded-lg flex items-center justify-center hover:bg-slate-200/50 transition"
                                >
                                  <MoveDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!confirm(`Delete footer menu link "${item.label}"?`)) return;
                                    setFooterMenu(footerMenu.filter((_, i) => i !== idx));
                                  }}
                                  className="h-7 w-7 text-rose-500 hover:text-rose-700 rounded-lg flex items-center justify-center hover:bg-rose-50 transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right columns (Business Social Links fields) */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="border border-slate-200/60 rounded-2xl p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Corporate Social Channels</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Add business profiles. They are automatically hyperlinked as icons inside the dark footer block.</p>
                      </div>

                      <div className="space-y-3.5">
                        {[
                          { id: 'twitter', label: 'Twitter / X Profile Link', placeholder: 'https://twitter.com/mybrand' },
                          { id: 'linkedin', label: 'LinkedIn Company / Personal', placeholder: 'https://linkedin.com/in/mybrand' },
                          { id: 'github', label: 'GitHub Repos / Profile', placeholder: 'https://github.com/mybrand' },
                          { id: 'facebook', label: 'Facebook Page URL', placeholder: 'https://facebook.com/mybrand' },
                          { id: 'instagram', label: 'Instagram Handle Link', placeholder: 'https://instagram.com/mybrand' },
                          { id: 'youtube', label: 'YouTube Official Channel', placeholder: 'https://youtube.com/@mybrand' }
                        ].map((field) => (
                          <div key={field.id}>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">{field.label}</label>
                            <input
                              type="url"
                              value={businessSocials[field.id as keyof typeof businessSocials] || ''}
                              onChange={(e) => setBusinessSocials({ ...businessSocials, [field.id]: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium transition"
                              placeholder={field.placeholder}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Submit bar */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={saveMenusAndSocials}
                    className="flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal-600/15"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Public Comments Moderation Tab */}
          {activeTab === 'comments' && (currentUser?.role === 'admin' || currentUser?.role === 'editor') && (
            <div className="space-y-6 max-w-5xl animate-fade-in">
              <div className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-sm">
                <div className="pb-6 border-b border-slate-100 mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Public Comments Moderation Workspace</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Approve, moderate, or purge reader remarks on published articles to protect site integrity.</p>
                </div>

                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-medium">No comments submitted yet. Remarks appear here upon reader submission.</p>
                    </div>
                  ) : (
                    <div className="border border-slate-200/60 rounded-2xl overflow-hidden divide-y divide-slate-100">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition">
                          <div className="space-y-1.5 max-w-2xl">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-800">{comment.authorName}</span>
                              <span className="text-[10px] text-slate-400 font-medium">({comment.authorEmail})</span>
                              <span className="text-[9px] font-mono text-slate-300">•</span>
                              <span className="text-[10px] font-mono text-slate-400">on <a href={`/p/${comment.postSlug}`} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">/p/{comment.postSlug}</a></span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium bg-slate-50 border border-slate-100 p-3 rounded-xl italic">
                              "{comment.content}"
                            </p>
                            <div className="flex items-center space-x-2.5">
                              <span className="text-[9px] font-mono text-slate-400">
                                {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {comment.approved ? (
                                <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-teal-50 border border-teal-100 text-teal-700">Approved</span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-amber-50 border border-amber-100 text-amber-700">Pending Review</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {!comment.approved && (
                              <button
                                onClick={() => approveComment(comment.id)}
                                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition shadow-sm"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                              title="Delete comment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SEO Redirects & Categories Tab */}
          {activeTab === 'redirects' && (currentUser?.role === 'admin' || currentUser?.role === 'editor') && (
            <div className="space-y-6 max-w-5xl animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Columns - Redirect Rules */}
                <div className="lg:col-span-7 bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">SEO Redirect & Migration Rules</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Define 301 Permanent or 302 Temporary paths to handle legacy URLs and prevent 404 search penalties.</p>
                  </div>

                  {/* Add redirect rule form */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newRedirectSource || !newRedirectDestination) {
                        showToast('error', 'Please define source and destination paths.');
                        return;
                      }
                      const success = await addRedirectRule(newRedirectSource, newRedirectDestination, newRedirectCode);
                      if (success) {
                        setNewRedirectSource('');
                        setNewRedirectDestination('');
                        setNewRedirectCode(301);
                      }
                    }}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3"
                  >
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 flex items-center gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Redirection Interceptor</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Legacy / Source URL Path</label>
                        <input
                          type="text"
                          required
                          value={newRedirectSource}
                          onChange={(e) => setNewRedirectSource(e.target.value.trim())}
                          placeholder="e.g. /old-blog-path"
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Target / Destination URL Path</label>
                        <input
                          type="text"
                          required
                          value={newRedirectDestination}
                          onChange={(e) => setNewRedirectDestination(e.target.value.trim())}
                          placeholder="e.g. /p/new-seo-slug"
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Status Code:</label>
                        <select
                          value={newRedirectCode}
                          onChange={(e) => setNewRedirectCode(parseInt(e.target.value, 10))}
                          className="bg-white border border-slate-200 text-xs px-2 py-1 rounded-lg focus:ring-1 focus:ring-teal-500 text-slate-700"
                        >
                          <option value={301}>301 (Permanent Redirect)</option>
                          <option value={302}>302 (Temporary Redirect)</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Add Rule
                      </button>
                    </div>
                  </form>

                  {/* Active redirects table */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active SEO Redirections</h3>
                    {redirectRules.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic py-4 text-center border border-dashed border-slate-100 rounded-xl bg-slate-50/50">No redirect rules currently active.</p>
                    ) : (
                      <div className="border border-slate-200/60 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                        {redirectRules.map((rule) => (
                          <div key={rule.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition font-mono text-[10.5px]">
                            <div className="flex items-center space-x-1.5 truncate">
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[9px]">{rule.statusCode}</span>
                              <span className="text-rose-600 font-semibold truncate">{rule.source}</span>
                              <span className="text-slate-300">→</span>
                              <span className="text-teal-600 font-semibold truncate">{rule.destination}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteRedirectRule(rule.id, rule.source)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition ml-3"
                              title="Delete rule"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Columns - Categories Manager */}
                <div className="lg:col-span-5 bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Article Category System</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Create custom category taxonomies to classify articles dynamically and apply automatic schema types.</p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newCategoryName.trim()) {
                        showToast('error', 'Please enter a category name.');
                        return;
                      }
                      const success = await addCategory(newCategoryName.trim());
                      if (success) {
                        setNewCategoryName('');
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      required
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Case Studies"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shrink-0 shadow-sm"
                    >
                      Add
                    </button>
                  </form>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Taxonomies</h3>
                    {categories.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic py-4 text-center border border-dashed border-slate-100 rounded-xl bg-slate-50/50">No custom categories established yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <div key={cat} className="flex items-center space-x-1 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-xs text-teal-800 font-bold transition">
                            <span>{cat}</span>
                            <button
                              type="button"
                              onClick={() => deleteCategory(cat)}
                              className="text-teal-400 hover:text-rose-600 font-extrabold focus:outline-none ml-1 text-[10px]"
                              title={`Delete ${cat}`}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
