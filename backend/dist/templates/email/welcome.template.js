"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeTemplate = void 0;
const welcomeTemplate = (name) => `
<div style="text-align: center;">
  <h1>Selamat Datang di House of Hope!</h1>
  <p>Hai ${name},</p>
  <p>Terima kasih telah bergabung dengan House of Hope. Akun Anda telah berhasil dibuat.</p>
  
  <div style="margin: 30px 0;">
    <p>Anda sekarang dapat:</p>
    <ul style="list-style: none; padding: 0;">
      <li>✓ Mengakses dashboard admin</li>
      <li>✓ Mengelola data</li>
      <li>✓ Dan fitur lainnya</li>
    </ul>
  </div>

  <a href="${process.env.FRONTEND_URL}/login" class="button" style="color: white;">
    Masuk ke Dashboard
  </a>
  
  <p style="margin-top: 30px; font-size: 14px; color: #666;">
    Jika Anda memiliki pertanyaan, silakan hubungi tim support kami.
  </p>
</div>
`;
exports.welcomeTemplate = welcomeTemplate;
