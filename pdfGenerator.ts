import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface DatabaseState {
  users: any[];
  posts: any[];
  forms: any[];
  submissions: any[];
  redirects?: any[];
  categories?: any[];
  comments?: any[];
  logs: any[];
  siteSettings: any;
}

export function generateProgressPDF(db: DatabaseState, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'LETTER', margin: 50, bufferPages: true });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Styling constants
      const primaryColor = '#0F172A'; // Slate 900 (deep charcoal)
      const secondaryColor = '#334155'; // Slate 700
      const accentColor = '#0F766E'; // Teal 700 (corporate accent)
      const lightGrey = '#E2E8F0'; // Slate 200 (dividers)
      const textGrey = '#64748B'; // Slate 500 (body descriptions)
      const bgSlate = '#F8FAFC'; // Slate 50 (cards)

      // =========================================================================
      // PAGE 1: TITLE & CORE CAPABILITIES
      // =========================================================================

      // Header Brand Track
      doc.fillColor(accentColor).fontSize(9).font('Helvetica-Bold').text('PROJECT PROGRESS & FEATURE INVENTORY', 50, 50);
      doc.fillColor(primaryColor).fontSize(26).font('Helvetica-Bold').text('GoPixel CMS & SSR Visual Engine', 50, 65);
      doc.fontSize(11).font('Helvetica-Oblique').fillColor(textGrey).text('A high-performance visual-grid compiler and crawl-optimized CMS platform.', 50, 95);

      // Decorative Primary Line
      doc.moveTo(50, 115).lineTo(562, 115).strokeColor(accentColor).lineWidth(2).stroke();

      // Report Metadata
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.fontSize(8.5).font('Helvetica').fillColor(textGrey);
      doc.text(`Compiled: ${dateStr}`, 50, 125);
      doc.text(`System Environment: Production Ready`, 180, 125);
      doc.text(`Core Version: v1.2.0 (Stable)`, 380, 125);

      // Executive Summary Banner Box
      doc.rect(50, 145, 512, 85).fill(bgSlate).stroke(lightGrey);
      doc.fillColor(accentColor).fontSize(10).font('Helvetica-Bold').text('EXECUTIVE SUMMARY', 65, 160);
      doc.fillColor(secondaryColor).fontSize(9).font('Helvetica').text(
        'GoPixel is an advanced full-stack visual-grid content management system built to solve core search engine crawl speeds and schema-alignment challenges. It pre-compiles structured database nodes and visual block layout configurations into raw, semantically clean, static HTML, combining WordPress-style simplicity with sub-300ms loading speeds. The system features dynamic Google Schema injections, integrated forms capture, redirect pipelines, self-registration gates, secure CAPTCHA triggers, and system audits.',
        65, 175, { width: 482, align: 'justify', lineGap: 3.5 }
      );

      // Section Header: Core Platform Capabilities
      doc.fillColor(primaryColor).fontSize(13).font('Helvetica-Bold').text('CORE PLATFORM CAPABILITIES', 50, 255);
      doc.moveTo(50, 272).lineTo(562, 272).strokeColor(lightGrey).lineWidth(1).stroke();

      const features = [
        {
          title: 'SSR Visual Page Compiler',
          desc: 'Compiles custom layout grids and visual elements into raw, semantic HTML. Renders highly responsive multi-column modules (1 to 4 columns) optimized for browser loading speeds.'
        },
        {
          title: 'Dynamic Google Schema Injections (SEO)',
          desc: 'Automatically reads the active website type and injects matching JSON-LD schemas (BlogPosting, NewsArticle, Person/ProfilePage, LocalBusiness, ProfessionalService) to satisfy search crawler requirements.'
        },
        {
          title: 'Built-in & Google reCAPTCHA Security Gates',
          desc: 'Protects critical access points with math-puzzle challenges and reCAPTCHA integrations, screening author registrations and article comments from malicious spam bots.'
        },
        {
          title: 'Core Redirects & URL Mapping Engine',
          desc: 'Handles SEO-friendly 301 (Permanent) and 302 (Temporary) redirects directly on the backend to preserve search ranking credits during site migrations.'
        },
        {
          title: 'Forms Engine & Submissions Pipeline',
          desc: 'Configures forms dynamically and gathers visitor submissions, contact inquiries, and leads into a secure dashboard-backed tracking system.'
        },
        {
          title: 'Structured Auditing & Logs Tracking',
          desc: 'Records system changes, setup events, security challenges, and settings updates in a database-backed logger with filterable severity levels.'
        }
      ];

      let y = 285;
      features.forEach((feat) => {
        doc.fillColor(accentColor).fontSize(9.5).font('Helvetica-Bold').text(`• ${feat.title}`, 50, y);
        doc.fillColor(textGrey).fontSize(8.5).font('Helvetica').text(feat.desc, 62, y + 13, { width: 490, lineGap: 2 });
        y += 42;
      });

      // =========================================================================
      // PAGE 2: STATS, CHECKLIST, AND SECURITY PROGRESS
      // =========================================================================
      doc.addPage();

      // Page Title
      doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('LIVE SYSTEM METRICS & VERIFICATION', 50, 50);
      doc.moveTo(50, 67).lineTo(562, 67).strokeColor(lightGrey).lineWidth(1).stroke();

      // Database stats calculation
      const usersCount = db.users ? db.users.length : 0;
      const postsCount = db.posts ? db.posts.length : 0;
      const formsCount = db.forms ? db.forms.length : 0;
      const submissionsCount = db.submissions ? db.submissions.length : 0;
      const redirectsCount = db.redirects ? db.redirects.length : 0;
      const categoriesCount = db.categories ? db.categories.length : 0;
      const commentsCount = db.comments ? db.comments.length : 0;
      const logsCount = db.logs ? db.logs.length : 0;

      const stats = [
        { label: 'Active Users & Authors', val: usersCount, icon: '👤' },
        { label: 'Published Posts & Cases', val: postsCount, icon: '📝' },
        { label: 'Custom Forms Configured', val: formsCount, icon: '📋' },
        { label: 'Inquiries Captured', val: submissionsCount, icon: '📥' },
        { label: 'URL Redirect Rules Active', val: redirectsCount, icon: '🔗' },
        { label: 'Active Categories', val: categoriesCount, icon: '🏷️' },
        { label: 'Moderated Comments', val: commentsCount, icon: '💬' },
        { label: 'Recorded Audits & Logs', val: logsCount, icon: '⚙%' }
      ];

      let gridY = 82;
      stats.forEach((stat, idx) => {
        const col = idx % 2;
        const xPos = col === 0 ? 50 : 310;
        const yPos = gridY + Math.floor(idx / 2) * 55;

        doc.rect(xPos, yPos, 240, 44).fill(bgSlate).stroke(lightGrey);
        doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text(`${stat.val}`, xPos + 15, yPos + 9);
        doc.fillColor(secondaryColor).fontSize(8.5).font('Helvetica-Bold').text(`${stat.icon === '⚙%' ? '⚙️' : stat.icon} ${stat.label}`, xPos + 15, yPos + 26);
      });

      // Section Header: Project Checklist
      let checklistY = gridY + 4 * 55 + 20;
      doc.fillColor(primaryColor).fontSize(13).font('Helvetica-Bold').text('PROJECT IMPLEMENTATION CHECKLIST', 50, checklistY);
      doc.moveTo(50, checklistY + 17).lineTo(562, checklistY + 17).strokeColor(lightGrey).lineWidth(1).stroke();

      const checklist = [
        { item: 'First-Launch Guided Website Type Setup Wizard Overlay', status: 'Completed' },
        { item: 'Multiple Website Type Schemas (Blog, News, Agency, Portfolio, Business)', status: 'Completed' },
        { item: 'Interactive Multi-column Layout Visual Block Engine', status: 'Completed' },
        { item: 'Self-Registration Gates with Math Puzzle CAPTCHA Solutions', status: 'Completed' },
        { item: 'Header/Footer Menus & Business Social Media Customizers', status: 'Completed' },
        { item: 'Dynamic Forms Constructor & Captured Lead Management', status: 'Completed' },
        { item: 'Full SEO 301/302 Redirect Maps & Dynamic Sitemap Compilation', status: 'Completed' },
        { item: 'Structured Security Settings & Database Auditing Feeds', status: 'Completed' }
      ];

      let checkY = checklistY + 30;
      checklist.forEach((check) => {
        doc.fillColor('#0D9488').fontSize(9).font('Helvetica-Bold').text('[✓]', 50, checkY);
        doc.fillColor(primaryColor).fontSize(8.5).font('Helvetica').text(check.item, 75, checkY);
        doc.fillColor('#0F766E').fontSize(8).font('Helvetica-Bold').text(check.status, 480, checkY, { align: 'right', width: 80 });
        checkY += 22;
      });

      // =========================================================================
      // FOOTER INJECTION ON ALL BUFFERED PAGES
      // =========================================================================
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.moveTo(50, 740).lineTo(562, 740).strokeColor(lightGrey).lineWidth(0.5).stroke();
        doc.fillColor(textGrey).fontSize(7.5).font('Helvetica');
        doc.text('GoPixel CMS & SSR Visual Compiler - System Specification Report', 50, 748);
        doc.text(`Page ${i + 1} of ${range.count}`, 500, 748, { align: 'right', width: 62 });
      }

      doc.end();
      stream.on('finish', () => resolve());
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
