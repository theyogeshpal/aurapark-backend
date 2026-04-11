const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendParkingApprovalEmail = async ({ toEmail, ownerName, parkingName, loginEmail, loginPassword, adminPanelUrl }) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parking Approved - AuraPark</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

  <div style="max-width:600px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:36px 40px;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:8px;">🅿</div>
      <h1 style="color:white;margin:0;font-size:1.8rem;font-weight:800;letter-spacing:-0.5px;">AuraPark</h1>
      <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:0.85rem;">Parking Management Platform</p>
    </div>

    <!-- Success Banner -->
    <div style="background:linear-gradient(135deg,#10b981,#059669);padding:24px 40px;text-align:center;">
      <div style="font-size:2rem;margin-bottom:8px;">✅</div>
      <h2 style="color:white;margin:0;font-size:1.3rem;font-weight:700;">Your Parking Has Been Approved!</h2>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:0.9rem;">Congratulations! You are now live on AuraPark.</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">

      <p style="color:#1e293b;font-size:1rem;margin:0 0 8px;">Hello, <strong>${ownerName}</strong> 👋</p>
      <p style="color:#64748b;font-size:0.92rem;line-height:1.7;margin:0 0 28px;">
        We're excited to inform you that your parking spot <strong style="color:#0f172a;">"${parkingName}"</strong> has been verified and approved by our team. Your parking is now live and visible to customers on AuraPark!
      </p>

      <!-- Parking Info -->
      <div style="background:#f8fafc;border-radius:14px;padding:20px 24px;margin-bottom:28px;border:1px solid #f1f5f9;">
        <h3 style="color:#0f172a;font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">📍 Parking Details</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#94a3b8;font-size:0.82rem;font-weight:600;padding:6px 0;width:40%;">Parking Name</td>
            <td style="color:#1e293b;font-size:0.88rem;font-weight:700;padding:6px 0;">${parkingName}</td>
          </tr>
          <tr>
            <td style="color:#94a3b8;font-size:0.82rem;font-weight:600;padding:6px 0;">Owner</td>
            <td style="color:#1e293b;font-size:0.88rem;padding:6px 0;">${ownerName}</td>
          </tr>
          <tr>
            <td style="color:#94a3b8;font-size:0.82rem;font-weight:600;padding:6px 0;">Status</td>
            <td style="padding:6px 0;"><span style="background:#dcfce7;color:#166534;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">✓ Verified & Live</span></td>
          </tr>
        </table>
      </div>

      <!-- Login Credentials -->
      <div style="background:linear-gradient(135deg,#eff6ff,#f0fdf4);border-radius:14px;padding:20px 24px;margin-bottom:28px;border:1.5px solid #bfdbfe;">
        <h3 style="color:#1d4ed8;font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">🔐 Your Admin Login Credentials</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#64748b;font-size:0.82rem;font-weight:600;padding:8px 0;width:40%;">Email</td>
            <td style="font-family:monospace;font-size:0.9rem;font-weight:700;color:#1e293b;padding:8px 0;">${loginEmail}</td>
          </tr>
          <tr>
            <td style="color:#64748b;font-size:0.82rem;font-weight:600;padding:8px 0;">Password</td>
            <td style="font-family:monospace;font-size:0.9rem;font-weight:700;color:#1e293b;padding:8px 0;">${loginPassword}</td>
          </tr>
        </table>
        <p style="color:#ef4444;font-size:0.78rem;margin:12px 0 0;"><strong>⚠️ Important:</strong> Please change your password after first login for security.</p>
      </div>

      <!-- CTA Buttons -->
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${adminPanelUrl}" style="display:inline-block;background:linear-gradient(135deg,#0d6efd,#0a58ca);color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:0.95rem;margin:6px;">
          🚀 Open Admin Panel
        </a>
        <a href="${adminPanelUrl}" style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:0.95rem;margin:6px;">
          📲 Download App
        </a>
      </div>

      <!-- Steps -->
      <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:14px;padding:20px 24px;margin-bottom:28px;">
        <h3 style="color:#92400e;font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;">💡 Getting Started</h3>
        <ol style="color:#78350f;font-size:0.85rem;line-height:1.9;margin:0;padding-left:20px;">
          <li>Open the Admin Panel using the button above</li>
          <li>Login with the credentials provided</li>
          <li>Change your password immediately</li>
          <li>Set up your UPI ID for payments in Manage Parking</li>
          <li>Start managing walk-in and online bookings!</li>
        </ol>
      </div>

      <p style="color:#64748b;font-size:0.85rem;line-height:1.7;margin:0;">
        If you have any questions or need help, feel free to contact our support team. We're here to help you succeed!
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
      <p style="color:#94a3b8;font-size:0.78rem;margin:0 0 6px;">© 2026 AuraPark. All rights reserved.</p>
      <p style="color:#94a3b8;font-size:0.75rem;margin:0;">This email was sent to <strong>${toEmail}</strong> because your parking was approved.</p>
    </div>

  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"AuraPark" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎉 Your Parking "${parkingName}" is Approved! - AuraPark`,
    html,
  });
};

module.exports = { sendParkingApprovalEmail };
