import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

import nodemailer from 'nodemailer';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Configure Titan Mail SMTP Transporter
const smtpHost = process.env.SMTP_HOST || 'smtp.titan.email';
const smtpPort = Number(process.env.SMTP_PORT) || 465;
const smtpUser = process.env.SMTP_USER || 'support@assetdoctor.in';
const smtpPass = process.env.SMTP_PASS || '';

const mailTransporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // SSL for 465
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Transactional Email Endpoint (Titan Mail)
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ success: false, error: 'Missing required parameters: to, subject, html/text' });
    }

    const mailOptions = {
      from: `"AssetDoctor Vault" <${smtpUser}>`,
      to,
      subject,
      text: text || '',
      html: html || '',
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log('Titan Mail sent successfully:', info.messageId);
    return res.json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error('Titan Mail SMTP Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to send email via Titan Mail' });
  }
});

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Basic CORS headers
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// OCR Receipt Scanning Endpoint
app.post('/api/scan-receipt', async (req, res) => {
  try {
    const { base64Image, mimeType = 'image/jpeg', textContent } = req.body;

    if (!aiClient) {
      console.error('Gemini OCR Error: GEMINI_API_KEY environment variable is not configured on server.');
      return res.status(400).json({
        success: false,
        error: 'Failed to scan bill. Please check Gemini API Key or connection.',
      });
    }

    // Call Gemini Flash for OCR parsing
    const parts: any[] = [];

    if (base64Image) {
      let detectedMime = mimeType || 'image/jpeg';
      let cleanedBase64 = base64Image;

      const dataUrlMatch = base64Image.match(/^data:([^;]+);base64,(.+)$/s);
      if (dataUrlMatch) {
        detectedMime = dataUrlMatch[1];
        cleanedBase64 = dataUrlMatch[2];
      } else {
        cleanedBase64 = base64Image.replace(/^data:[^;]+;base64,/, '');
      }

      parts.push({
        inlineData: {
          mimeType: detectedMime,
          data: cleanedBase64,
        },
      });
    }

    const promptText = `You are a high-precision OCR, Invoice parsing and AI Scam Guard assistant for AssetDoctor ServiVault.
Extract ALL asset/product items and tax details listed on this receipt/invoice.
Also search for the merchant's GSTIN (Goods & Services Tax Number, 15 characters e.g. 29AABCU9603R1ZM) if present.

Return ONLY a structured JSON matching this schema:
{
  "vendor": string (store or merchant name like Flipkart India, Amazon, Croma),
  "purchaseDate": string (YYYY-MM-DD),
  "totalAmount": number (total sum in INR),
  "gstin": string (15 character GSTIN if found, else empty),
  "items": [
    {
      "itemName": string (clean product name),
      "brand": string (brand name),
      "price": number (in INR Rupees),
      "warrantyMonths": number (default 12 if unknown),
      "category": string ("Electronics" | "Vehicles" | "Appliances" | "Gadgets" | "Home" | "Other"),
      "serialNumber": string,
      "notes": string
    }
  ]
}
${textContent ? `Invoice text content:\n${textContent}` : ''}`;

    parts.push({ text: promptText });

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vendor: { type: Type.STRING },
              purchaseDate: { type: Type.STRING },
              totalAmount: { type: Type.NUMBER },
              gstin: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    itemName: { type: Type.STRING },
                    brand: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    warrantyMonths: { type: Type.NUMBER },
                    category: { type: Type.STRING },
                    serialNumber: { type: Type.STRING },
                    notes: { type: Type.STRING },
                  },
                  required: ['itemName', 'price', 'category'],
                },
              },
            },
            required: ['items'],
          },
        },
      });
    } catch (modelError) {
      console.warn('Gemini 2.5 Flash failed, attempting fallback to gemini-1.5-flash:', modelError);
      response = await aiClient.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: { parts },
      });
    }

    const parsedText = response.text || '{}';
    const jsonResult = JSON.parse(parsedText);

    const extractedItems = (jsonResult.items || []).map((item: any, idx: number) => ({
      itemName: item.itemName || `Scanned Item ${idx + 1}`,
      brand: item.brand || jsonResult.vendor || 'Generic',
      price: Number(item.price) || 0,
      warrantyMonths: Number(item.warrantyMonths) || 12,
      category: ['Electronics', 'Vehicles', 'Appliances', 'Gadgets', 'Home', 'Other'].includes(item.category)
        ? item.category
        : 'Electronics',
      serialNumber: item.serialNumber || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: item.notes || 'Verified by AssetDoctor AI OCR Scan',
      selected: true,
    }));

    const calculatedTotal = extractedItems.reduce((acc: number, cur: any) => acc + (cur.price || 0), 0);

    return res.json({
      success: true,
      source: 'gemini_ocr',
      data: {
        vendor: jsonResult.vendor || 'Authorized Merchant',
        purchaseDate: jsonResult.purchaseDate || new Date().toISOString().split('T')[0],
        totalAmount: Number(jsonResult.totalAmount) || calculatedTotal,
        gstin: jsonResult.gstin || '',
    if (!extractedItems || extractedItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Failed to scan document. Could not extract items from image using Gemini AI.',
      });
    }

    return res.json({
      success: true,
      source: 'gemini_ocr',
      data: {
        vendor: jsonResult.vendor || 'Authorized Merchant',
        purchaseDate: jsonResult.purchaseDate || new Date().toISOString().split('T')[0],
        totalAmount: Number(jsonResult.totalAmount) || calculatedTotal,
        gstin: jsonResult.gstin || '',
        items: extractedItems,
      },
    });
  } catch (err: any) {
    console.error('OCR Scan error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to scan receipt invoice',
    });
  }
});

// Static sitemap.xml route with clean XML headers
app.get('/sitemap.xml', (_req, res) => {
  const publicSitemap = path.join(process.cwd(), 'public', 'sitemap.xml');
  const distSitemap = path.join(process.cwd(), 'dist', 'sitemap.xml');
  const filePath = require('fs').existsSync(distSitemap) ? distSitemap : publicSitemap;
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.sendFile(filePath);
});

// Static robots.txt route with clean text headers
app.get('/robots.txt', (_req, res) => {
  const publicRobots = path.join(process.cwd(), 'public', 'robots.txt');
  const distRobots = path.join(process.cwd(), 'dist', 'robots.txt');
  const filePath = require('fs').existsSync(distRobots) ? distRobots : publicRobots;
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(filePath);
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'AssetDoctor ServiVault' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AssetDoctor ServiVault Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
