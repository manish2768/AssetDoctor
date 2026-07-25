export function renderWelcomeEmailHTML(userName: string = 'User'): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AssetDoctor - Welcome Email</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 20px; margin: 0; }
    .email-container { max-width: 500px; margin: 0 auto; background: #161e2e; border-radius: 16px; padding: 30px; border: 1px solid #1f293d; text-align: center; }
    .logo { font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 20px; }
    .greeting { font-size: 22px; margin-bottom: 10px; }
    .message { color: #9ca3af; font-size: 15px; line-height: 1.6; margin-bottom: 25px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="logo">🛡️ AssetDoctor</div>
    <div class="greeting">नमस्ते ${userName}! 😊</div>
    <p class="message">
      AssetDoctor में आपका स्वागत है! अब आपको बिल, वॉरंटी कार्ड या ज़रूरी दस्तावेज़ खोने का डर खत्म। आपका अकाउंट पूरी तरह एक्टिव हो चुका है।
    </p>
    <a href="https://assetdoctor.in/dashboard" class="cta-button">अपना पहला डॉक्यूमेंट स्कैन करें 📸</a>
    <div class="footer">
      टीम AssetDoctor | 100% Secure &amp; Encrypted Asset Vault
    </div>
  </div>
</body>
</html>`;
}

export default {
  renderWelcomeEmailHTML
};
