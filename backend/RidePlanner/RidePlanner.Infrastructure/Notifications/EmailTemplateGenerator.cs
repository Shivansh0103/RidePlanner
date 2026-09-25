using System.Net;

namespace RidePlanner.Infrastructure.Notifications;

public static class EmailTemplateGenerator
{
    public static string GeneratePasswordResetHtml(string resetUrl)
    {
        var encodedUrl = WebUtility.HtmlEncode(resetUrl);

        return $$"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your RidePlanner password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f1f5f9;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .card {
      max-width: 520px;
      margin: 0 auto;
      background-color: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 36px 32px;
      box-sizing: border-box;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #6366f1;
      background-color: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 6px;
      margin-bottom: 20px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 16px 0;
      letter-spacing: -0.5px;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 20px 0;
    }
    .cta-container {
      text-align: center;
      margin: 28px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #6366f1;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      padding: 13px 28px;
      border-radius: 8px;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    }
    .fallback-box {
      background-color: #0b0f19;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 14px;
      margin: 24px 0 0 0;
      word-break: break-all;
      font-size: 12px;
      line-height: 1.5;
      color: #64748b;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }
    .fallback-link {
      color: #818cf8;
      text-decoration: underline;
    }
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #1f2937;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .notice {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="badge">RIDEPLANNER // EXPEDITIONS</div>
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password for your RidePlanner account. Click the button below to establish a new password.</p>
      
      <div class="cta-container">
        <a href="{{encodedUrl}}" class="cta-button" target="_blank" rel="noopener noreferrer">Reset Your Password</a>
      </div>

      <p class="notice">This security link will automatically expire in <strong>2 hours</strong>. If you did not request this password reset, no action is needed and your account remains completely secure.</p>

      <div class="fallback-box">
        If the button above does not work, copy and paste this link into your browser:<br>
        <a href="{{encodedUrl}}" class="fallback-link" target="_blank" rel="noopener noreferrer">{{encodedUrl}}</a>
      </div>

      <div class="footer">
        &copy; {{DateTime.UtcNow.Year}} RidePlanner &bull; Real-time Multi-Stop Motorcycle Expedition Cockpit
      </div>
    </div>
  </div>
</body>
</html>
""";
    }
}
