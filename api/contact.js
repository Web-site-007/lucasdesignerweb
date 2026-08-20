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
  return `Olá ${name}, tudo bem?

Vi sua mensagem sobre ${serviceName} no site. Obrigado pelo contato!

Vou analisar e te respondo em até 24 horas com mais detalhes.

Qualquer coisa, pode me chamar no WhatsApp: (91) 98150-4951

Abraço,
Lucas`;
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
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
<h2 style="margin:0 0 16px;color:#333;font-size:16px">Nova mensagem no site</h2>
<p style="margin:0 0 6px;font-size:14px"><b>Nome:</b> ${sanitize(data.name)}</p>
<p style="margin:0 0 6px;font-size:14px"><b>Email:</b> ${sanitize(data.email)}</p>
<p style="margin:0 0 6px;font-size:14px"><b>WhatsApp:</b> ${sanitize(data.phone) || 'Não informado'}</p>
<p style="margin:0 0 6px;font-size:14px"><b>Serviço:</b> ${sanitize(serviceName)}</p>
<p style="margin:12px 0 4px;font-size:14px"><b>Mensagem:</b></p>
<p style="margin:0;font-size:14px;background:#f5f5f5;padding:12px;border-radius:4px">${sanitize(data.message)}</p>
</div>`;
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
      from: `"Site" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Novo contato: ${name} — ${serviceName}`,
      text: getOwnerEmailText({ name, email, phone, service, message }),
      html: getOwnerEmailHTML({ name, email, phone, service, message }),
      headers: {
        'X-Auto-Response-Suppress': 'All',
        'Precedence': 'notification',
        'Auto-Submitted': 'auto-generated'
      }
    });

    await transporter.sendMail({
      from: `"Lucas" <${process.env.GMAIL_USER}>`,
      to: email,
      replyTo: process.env.GMAIL_USER,
      subject: `Re: sua mensagem sobre ${serviceName}`,
      text: getClientEmailText(name, service),
      headers: {
        'X-Auto-Response-Suppress': 'All',
        'Precedence': 'notification',
        'Auto-Submitted': 'auto-generated'
      }
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Erro ao enviar email' });
  }
};
