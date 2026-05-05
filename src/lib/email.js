// lib/email.js - Simple version
import nodemailer from 'nodemailer';

export async function sendLoginNotification(details) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Missing Gmail credentials');
    return { success: false };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const currentTime = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const subject = details.success ? 
      '✅ Admin Login Success' : 
      '🚨 Failed Login Attempt';

    // Simple, clean email template
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: ${details.success ? '#28a745' : '#dc3545'}; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0;">${details.success ? '✅ Login Successful' : '🚨 Login Failed'}</h2>
          <p style="margin: 10px 0 0 0;">Admin Panel Access</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 5px 0;"><strong>Time:</strong> ${currentTime}</p>
          <p style="margin: 5px 0;"><strong>IP:</strong> ${details.ip || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${details.location || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Device:</strong> ${details.device || 'Unknown'}</p>
          <p style="margin: 5px 0;"><strong>Browser:</strong> ${details.browser || 'Unknown'}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          Admin Panel Security Alert
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Admin Alert" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject,
      html
    });

    console.log('✅ Login notification sent');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false };
  }
}

// Enhanced client details with more info
export function getClientDetails(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') || // Cloudflare
             'Unknown';
  
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  
  // Parse user agent for device and browser info
  const device = getDeviceInfo(userAgent);
  const browser = getBrowserInfo(userAgent);
  
  return { 
    ip, 
    userAgent, 
    device, 
    browser,
    location: 'Unknown' // You can integrate IP geolocation service here
  };
}

// Helper to extract device info from user agent
function getDeviceInfo(userAgent) {
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  if (userAgent.includes('Windows')) return 'Windows PC';
  if (userAgent.includes('Mac')) return 'Mac';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone')) return 'iPhone';
  if (userAgent.includes('iPad')) return 'iPad';
  return 'Unknown';
}

// Helper to extract browser info from user agent
function getBrowserInfo(userAgent) {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}