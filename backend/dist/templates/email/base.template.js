"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTemplate = void 0;
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .logo {
      max-width: 150px;
      margin-bottom: 15px;
    }
    .content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      padding: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://your-domain.com/logo.png" alt="House of Hope" class="logo">
    <h2>House of Hope</h2>
  </div>
  <div class="content">
    ${content}
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} House of Hope. All rights reserved.</p>
    <p>Jika Anda tidak meminta email ini, silakan abaikan.</p>
  </div>
</body>
</html>
`;
exports.baseTemplate = baseTemplate;
