const nodemailer = require('nodemailer');

const DOMAIN = 'https://lucasdesignerweb.com.br';
const MAX_BODY_SIZE = 10000;
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now - val.start > RATE_LIMIT_WINDOW) rateLimitMap.delete(key);
  }
}, RATE_LIMIT_WINDOW);

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c]).trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const SERVICES = {
  site: 'Site Institucional',
  loja: 'Loja Virtual',
  landing: 'Landing Page',
  sistema: 'Sistema Web',
  app: 'Aplicativo Mobile',
  consultoria: 'Consultoria Digital',
  outro: 'Projeto Personalizado'
};

function getClientEmailText(name, service) {
  const serviceName = SERVICES[service] || 'projeto personalizado';
  return `Olá, ${name}!

Recebemos sua mensagem e já estamos analisando seu interesse em ${serviceName}.

Em até 24 horas entraremos em contato com um orçamento personalizado.

Enquanto isso, você pode falar diretamente comigo pelo WhatsApp:
https://wa.me/5591981504951?text=Olá, enviei um formulário pelo site e quero saber sobre ${encodeURIComponent(serviceName)}

Lucas Designer Web
Marabá, PA
https://lucasdesignerweb.com.br`;
}

function getClientEmailHTML(name, service) {
  const serviceName = SERVICES[service] || 'projeto personalizado';
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
      <tr>
        <td style="background:#3b82f6;padding:20px 24px">
          <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600">Lucas Designer Web</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px">
          <p style="margin:0 0 12px;color:#333;font-size:15px">Olá, ${sanitize(name)}!</p>
          <p style="margin:0 0 12px;color:#333;font-size:15px">Recebemos sua mensagem sobre <strong>${sanitize(serviceName)}</strong> e entraremos em contato em até 24 horas com um orçamento personalizado.</p>
          <p style="margin:0 0 12px;color:#333;font-size:15px">Se preferir, fale diretamente comigo pelo WhatsApp:</p>
          <p style="margin:0 0 20px">
            <a href="https://wa.me/5591981504951?text=Olá, enviei um formulário pelo site e quero saber sobre ${encodeURIComponent(serviceName)}" style="color:#25d366;font-size:15px;font-weight:600;text-decoration:none">(91) 98150-4951</a>
          </p>
          <p style="margin:20px 0 0;color:#666;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px">Lucas Designer Web — lucasdesignerweb.com.br</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function getOwnerEmailText(data) {
  const serviceName = SERVICES[data.service] || 'Não especificado';
  return `Nova mensagem no site

Nome: ${data.name}
Email: ${data.email}
WhatsApp: ${data.phone || 'Não informado'}
Serviço: ${serviceName}

Mensagem:
${data.message}`;
}

function getOwnerEmailHTML(data) {
  const serviceName = SERVICES[data.service] || 'Não especificado';
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
      <tr>
        <td style="background:#3b82f6;padding:20px 24px">
          <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600">Nova mensagem no site</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px">
          <p style="margin:0 0 8px;color:#333;font-size:14px"><strong>Nome:</strong> ${sanitize(data.name)}</p>
          <p style="margin:0 0 8px;color:#333;font-size:14px"><strong>Email:</strong> ${sanitize(data.email)}</p>
          <p style="margin:0 0 8px;color:#333;font-size:14px"><strong>WhatsApp:</strong> ${sanitize(data.phone) || 'Não informado'}</p>
          <p style="margin:0 0 8px;color:#333;font-size:14px"><strong>Serviço:</strong> ${sanitize(serviceName)}</p>
          <p style="margin:16px 0 4px;color:#333;font-size:14px"><strong>Mensagem:</strong></p>
          <p style="margin:0;color:#333;font-size:14px;background:#f8fafc;padding:12px;border-radius:4px;border-left:3px solid #3b82f6">${sanitize(data.message)}</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  const allowedOrigins = [DOMAIN, 'https://www.lucasdesignerweb.com.br'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : DOMAIN;

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > MAX_BODY_SIZE) {
    return res.status(413).json({ error: 'Payload too large' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
  } else {
    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Muitas requisições. Tente novamente em 1 minuto.' });
    }
  }

  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios' });
  }

  if (typeof name !== 'string' || name.length > 200) {
    return res.status(400).json({ error: 'Nome inválido' });
  }
  if (typeof email !== 'string' || email.length > 254 || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (typeof message !== 'string' || message.length > 5000) {
    return res.status(400).json({ error: 'Mensagem muito longa (máx. 5000 caracteres)' });
  }
  if (phone && (typeof phone !== 'string' || phone.length > 20)) {
    return res.status(400).json({ error: 'Telefone inválido' });
  }

  const serviceName = SERVICES[service] || 'Contato';

  try {
    await transporter.sendMail({
      from: `"Lucas Designer Web" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Nova mensagem de ${name} — ${serviceName}`,
      text: getOwnerEmailText({ name, email, phone, service, message }),
      html: getOwnerEmailHTML({ name, email, phone, service, message }),
      headers: {
        'X-Mailer': 'Lucas Designer Web Contact Form',
        'X-Auto-Response-Suppress': 'All',
        'Precedence': 'transactional'
      }
    });

    await transporter.sendMail({
      from: `"Lucas Designer Web" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Recebemos sua mensagem — Lucas Designer Web`,
      text: getClientEmailText(name, service),
      html: getClientEmailHTML(name, service),
      headers: {
        'X-Mailer': 'Lucas Designer Web Contact Form',
        'X-Auto-Response-Suppress': 'All',
        'Precedence': 'transactional',
        'List-Unsubscribe': `<mailto:${process.env.GMAIL_USER}?subject=Cancelar%20inscricao>`
      }
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Erro ao enviar email' });
  }
};
