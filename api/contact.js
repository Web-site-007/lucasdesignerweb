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

function getClientEmailHTML(name, service) {
  const serviceName = SERVICES[service] || 'projeto personalizado';
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:30px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:24px">Lucas Designer Web</h1>
        <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px">Designer / Desenvolvedor Web</p>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        <h2 style="color:#3b82f6;margin-top:0">Olá, ${sanitize(name)}! 👋</h2>
        <p>Recebemos sua mensagem e já estamos analisando seu interesse em <strong>${sanitize(serviceName)}</strong>.</p>
        <p>Em até <strong>24 horas</strong> entraremos em contato com um orçamento personalizado.</p>

        <div style="background:#f8fafc;padding:20px;border-radius:8px;margin:20px 0">
          <h3 style="margin-top:0;color:#3b82f6;font-size:16px">Nossos Serviços:</h3>
          <ul style="margin:0;padding-left:20px;line-height:2">
            <li><strong>Sites Institucionais</strong> — Sites profissionais para sua empresa</li>
            <li><strong>Lojas Virtuais</strong> — E-commerce completo com carrinho e pagamento</li>
            <li><strong>Landing Pages</strong> — Páginas de conversão para campanhas</li>
            <li><strong>Sistemas Web</strong> — Sistemas sob medida para seu negócio</li>
            <li><strong>Aplicativos Mobile</strong> — Apps para Android e iOS</li>
            <li><strong>Consultoria Digital</strong> — Estratégia e presença online</li>
          </ul>
        </div>

        <p>Enquanto isso, você pode falar diretamente comigo:</p>
        <a href="https://wa.me/5591981504951?text=Olá, enviei um formulário pelo site e quero saber sobre ${encodeURIComponent(serviceName)}" style="display:inline-block;padding:12px 24px;background:#25d366;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin:10px 0">Falar no WhatsApp</a>

        <p style="margin-top:24px;color:#666;font-size:13px">Lucas Designer Web — Marabá, PA</p>
      </div>
      <div style="text-align:center;padding:16px;color:#999;font-size:12px">
        © 2026 Lucas Designer Web. Todos os direitos reservados.
      </div>
    </div>
  `;
}

function getOwnerEmailHTML(data) {
  const serviceName = SERVICES[data.service] || 'Não especificado';
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#3b82f6;padding:20px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">Nova mensagem no site</h1>
      </div>
      <div style="background:#fff;padding:20px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        <p><strong>Nome:</strong> ${sanitize(data.name)}</p>
        <p><strong>Email:</strong> ${sanitize(data.email)}</p>
        <p><strong>WhatsApp:</strong> ${sanitize(data.phone) || 'Não informado'}</p>
        <p><strong>Serviço:</strong> ${sanitize(serviceName)}</p>
        <p><strong>Mensagem:</strong></p>
        <div style="background:#f8fafc;padding:12px;border-radius:6px;border-left:3px solid #3b82f6">${sanitize(data.message)}</div>
      </div>
    </div>
  `;
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

  try {
    await transporter.sendMail({
      from: `"Lucas Designer Web" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Nova mensagem de ${name} — ${SERVICES[service] || 'Contato'}`,
      html: getOwnerEmailHTML({ name, email, phone, service, message })
    });

    await transporter.sendMail({
      from: `"Lucas Designer Web" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Recebemos sua mensagem — Lucas Designer Web`,
      html: getClientEmailHTML(name, service)
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Erro ao enviar email' });
  }
};
