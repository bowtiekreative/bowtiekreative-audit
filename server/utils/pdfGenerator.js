import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFGenerator {
  static calculateScores(auditData) {
    let websiteScore = 0;
    let socialScore = 0;
    let marketingScore = 0;
    let automationScore = 0;

    // Website scoring (0-100)
    if (auditData.has_website) websiteScore += 40;
    if (auditData.has_seo) websiteScore += 30;
    if (auditData.has_analytics) websiteScore += 30;

    // Social media scoring (0-100)
    if (auditData.has_social_media) socialScore += 50;
    const platforms = auditData.social_media_platforms?.length || 0;
    socialScore += Math.min(platforms * 10, 50);

    // Marketing scoring (0-100)
    if (auditData.has_email_marketing) marketingScore += 35;
    if (auditData.has_paid_ads) marketingScore += 35;
    if (auditData.has_crm) marketingScore += 30;

    // Automation scoring (0-100)
    if (auditData.has_automation) automationScore += 50;
    if (auditData.has_email_marketing) automationScore += 25;
    if (auditData.has_crm) automationScore += 25;

    const overallScore = Math.round(
      (websiteScore + socialScore + marketingScore + automationScore) / 4
    );

    return {
      website_score: websiteScore,
      social_score: socialScore,
      marketing_score: marketingScore,
      automation_score: automationScore,
      overall_score: overallScore
    };
  }

  static getScoreLevel(score) {
    if (score >= 80) return { level: 'Excellent', color: '#10b981' };
    if (score >= 60) return { level: 'Good', color: '#3b82f6' };
    if (score >= 40) return { level: 'Fair', color: '#f59e0b' };
    return { level: 'Needs Improvement', color: '#ef4444' };
  }

  static getRecommendations(auditData, scores) {
    const recommendations = [];

    // Website recommendations
    if (scores.website_score < 70) {
      if (!auditData.has_website) {
        recommendations.push({
          category: 'Website',
          priority: 'High',
          title: 'Establish Professional Web Presence',
          description: 'Create a modern, mobile-responsive website that showcases your brand and converts visitors into customers.'
        });
      }
      if (!auditData.has_seo) {
        recommendations.push({
          category: 'SEO',
          priority: 'High',
          title: 'Implement SEO Strategy',
          description: 'Optimize your website for search engines to increase organic traffic and visibility.'
        });
      }
      if (!auditData.has_analytics) {
        recommendations.push({
          category: 'Analytics',
          priority: 'Medium',
          title: 'Set Up Analytics Tracking',
          description: 'Install Google Analytics or similar tools to track visitor behavior and make data-driven decisions.'
        });
      }
    }

    // Social media recommendations
    if (scores.social_score < 70) {
      recommendations.push({
        category: 'Social Media',
        priority: 'High',
        title: 'Expand Social Media Presence',
        description: 'Develop a consistent social media strategy across platforms where your target audience is active.'
      });
    }

    // Marketing recommendations
    if (scores.marketing_score < 70) {
      if (!auditData.has_email_marketing) {
        recommendations.push({
          category: 'Email Marketing',
          priority: 'High',
          title: 'Launch Email Marketing Campaigns',
          description: 'Build an email list and create nurture campaigns to stay connected with your audience.'
        });
      }
      if (!auditData.has_crm) {
        recommendations.push({
          category: 'CRM',
          priority: 'Medium',
          title: 'Implement CRM System',
          description: 'Use a CRM to manage customer relationships, track leads, and improve sales processes.'
        });
      }
    }

    // Automation recommendations
    if (scores.automation_score < 70) {
      recommendations.push({
        category: 'Automation',
        priority: 'High',
        title: 'Automate Marketing Processes',
        description: 'Implement marketing automation to save time, nurture leads, and increase efficiency.'
      });
    }

    return recommendations;
  }

  static async generateReport(auditData, scores) {
    return new Promise((resolve, reject) => {
      try {
        const fileName = `audit-${auditData.id}-${Date.now()}.pdf`;
        const pdfPath = path.join(__dirname, '../../public/pdfs', fileName);
        
        // Ensure directory exists
        const dir = path.dirname(pdfPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const stream = fs.createWriteStream(pdfPath);

        doc.pipe(stream);

        // Header with gradient effect (simulated)
        doc.rect(0, 0, doc.page.width, 150).fill('#667eea');
        
        // Logo placeholder and title
        doc.fontSize(28).fillColor('#ffffff')
           .text('DIGITAL MARKETING AUDIT', 50, 50, { align: 'center' });
        
        doc.fontSize(14).fillColor('#ffffff')
           .text('Comprehensive Analysis & Recommendations', 50, 90, { align: 'center' });

        doc.fontSize(10).fillColor('#ffffff')
           .text(`Generated: ${new Date().toLocaleDateString()}`, 50, 115, { align: 'center' });

        // Business Information Section
        doc.moveDown(8);
        doc.fontSize(18).fillColor('#333333')
           .text('Business Information', { underline: true });
        
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#666666')
           .text(`Business Name: ${auditData.business_name}`)
           .text(`Contact: ${auditData.contact_name}`)
           .text(`Email: ${auditData.email}`)
           .text(`Industry: ${auditData.industry || 'Not specified'}`)
           .text(`Location: ${auditData.location || 'Not specified'}`);

        // Overall Score Section
        doc.moveDown(2);
        doc.fontSize(18).fillColor('#333333')
           .text('Overall Digital Health Score', { underline: true });
        
        doc.moveDown(0.5);
        const overallLevel = this.getScoreLevel(scores.overall_score);
        doc.fontSize(40).fillColor(overallLevel.color)
           .text(`${scores.overall_score}/100`, { align: 'center' });
        
        doc.fontSize(16).fillColor(overallLevel.color)
           .text(overallLevel.level, { align: 'center' });

        // Detailed Scores
        doc.addPage();
        doc.fontSize(18).fillColor('#333333')
           .text('Detailed Score Breakdown', { underline: true });

        doc.moveDown(1);

        const scoreCategories = [
          { name: 'Website & Digital Presence', score: scores.website_score },
          { name: 'Social Media', score: scores.social_score },
          { name: 'Marketing Strategy', score: scores.marketing_score },
          { name: 'Automation & Technology', score: scores.automation_score }
        ];

        scoreCategories.forEach(category => {
          const level = this.getScoreLevel(category.score);
          
          doc.fontSize(12).fillColor('#333333')
             .text(category.name, { continued: true })
             .fillColor(level.color)
             .text(` - ${category.score}/100`, { align: 'right' });
          
          // Progress bar
          const barWidth = 400;
          const barHeight = 10;
          const filledWidth = (category.score / 100) * barWidth;
          
          const currentY = doc.y;
          doc.rect(doc.page.margins.left, currentY + 5, barWidth, barHeight)
             .fillAndStroke('#e5e7eb', '#d1d5db');
          
          doc.rect(doc.page.margins.left, currentY + 5, filledWidth, barHeight)
             .fill(level.color);
          
          doc.moveDown(1.5);
        });

        // Current Digital Presence
        doc.addPage();
        doc.fontSize(18).fillColor('#333333')
           .text('Current Digital Presence', { underline: true });

        doc.moveDown(1);
        doc.fontSize(11).fillColor('#666666');

        const capabilities = [
          { label: 'Website', has: auditData.has_website },
          { label: 'Social Media', has: auditData.has_social_media },
          { label: 'Email Marketing', has: auditData.has_email_marketing },
          { label: 'SEO', has: auditData.has_seo },
          { label: 'Paid Advertising', has: auditData.has_paid_ads },
          { label: 'Analytics', has: auditData.has_analytics },
          { label: 'CRM System', has: auditData.has_crm },
          { label: 'Marketing Automation', has: auditData.has_automation }
        ];

        capabilities.forEach(cap => {
          const icon = cap.has ? '✓' : '✗';
          const color = cap.has ? '#10b981' : '#ef4444';
          doc.fillColor(color).text(icon, { continued: true })
             .fillColor('#666666').text(` ${cap.label}`);
          doc.moveDown(0.3);
        });

        // Recommendations
        doc.addPage();
        doc.fontSize(18).fillColor('#333333')
           .text('Recommended Actions', { underline: true });

        doc.moveDown(1);

        const recommendations = this.getRecommendations(auditData, scores);
        
        recommendations.forEach((rec, index) => {
          const priorityColor = 
            rec.priority === 'High' ? '#ef4444' : 
            rec.priority === 'Medium' ? '#f59e0b' : '#3b82f6';

          doc.fontSize(12).fillColor('#333333')
             .text(`${index + 1}. ${rec.title}`, { underline: true });
          
          doc.fontSize(9).fillColor(priorityColor)
             .text(`Priority: ${rec.priority} | Category: ${rec.category}`);
          
          doc.fontSize(10).fillColor('#666666')
             .text(rec.description, { align: 'justify' });
          
          doc.moveDown(1);
        });

        // Next Steps
        doc.addPage();
        doc.fontSize(18).fillColor('#333333')
           .text('Next Steps', { underline: true });

        doc.moveDown(1);
        doc.fontSize(11).fillColor('#666666')
           .text('1. Review this report carefully and identify your top priorities')
           .moveDown(0.5)
           .text('2. Book a strategy call to discuss implementation plans')
           .moveDown(0.5)
           .text('3. Start with quick wins that can deliver immediate results')
           .moveDown(0.5)
           .text('4. Develop a 90-day action plan for major improvements')
           .moveDown(0.5)
           .text('5. Set up tracking and analytics to measure progress');

        doc.moveDown(2);
        doc.fontSize(14).fillColor('#667eea')
           .text('Ready to take action?', { align: 'center' })
           .moveDown(0.5)
           .fontSize(11).fillColor('#666666')
           .text('Book a Strategy Call: https://bookme.name/digitalstemcell/lite/schedule-a-consultation-appointment-1', { align: 'center' });

        // Footer
        doc.moveDown(3);
        doc.fontSize(9).fillColor('#999999')
           .text('© 2024 Bowtie Kreative. All rights reserved.', { align: 'center' })
           .text('https://audit.bowtiekreative.com', { align: 'center' });

        doc.end();

        stream.on('finish', () => {
          resolve({ fileName, pdfPath });
        });

        stream.on('error', reject);

      } catch (error) {
        reject(error);
      }
    });
  }
}

export default PDFGenerator;
