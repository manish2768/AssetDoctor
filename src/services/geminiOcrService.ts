import { GoogleGenAI } from '@google/genai';

export interface DocumentOCRItem {
  itemName: string;
  price: number;
  brand: string;
  category: string;
  serialOrImei: string;
  warrantyMonths: number;
}

export interface DocumentOCRResult {
  merchantName: string;
  purchaseDate: string;
  gstin: string;
  totalAmount: number;
  items: DocumentOCRItem[];
}

export async function processDocumentOCR(base64Image: string): Promise<DocumentOCRResult> {
  try {
    const apiKey = 
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      '';

    // If client-side API Key is absent, attempt server endpoint /api/scan-receipt
    if (!apiKey) {
      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image, mimeType: 'image/jpeg' }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        return {
          merchantName: resData.data.vendor || 'Merchant',
          purchaseDate: resData.data.purchaseDate || new Date().toISOString().split('T')[0],
          gstin: resData.data.gstin || '',
          totalAmount: resData.data.totalAmount || 0,
          items: (resData.data.items || []).map((it: any) => ({
            itemName: it.itemName || 'Invoice Asset',
            price: Number(it.price) || 0,
            brand: it.brand || 'Generic',
            category: it.category || 'Gadgets',
            serialOrImei: it.serialNumber || it.serialOrImei || '',
            warrantyMonths: Number(it.warrantyMonths) || 12,
          })),
        };
      }

      // NO HARDCODED MOCK FALLBACK: Throw clear error
      throw new Error(resData.error || 'Failed to scan bill. Please check Gemini API Key or connection.');
    }

    // Initialize Gemini AI Client using @google/genai
    const aiClient = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert OCR AI. Analyze the attached bill/policy/invoice image carefully.
      Extract and return ONLY a strict JSON object with this exact schema:
      {
        "merchantName": "Store/Company Name",
        "purchaseDate": "YYYY-MM-DD",
        "gstin": "GST Number if available",
        "totalAmount": 0.00,
        "items": [
          {
            "itemName": "Product/Policy Name",
            "price": 0.00,
            "brand": "Brand",
            "category": "Electronics or Vehicles or Appliances or Gadgets or Home or Other",
            "serialOrImei": "Serial/Frame/Engine/IMEI Number if present",
            "warrantyMonths": 12
          }
        ]
      }
    `;

    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: 'image/jpeg',
                },
              },
            ],
          },
        ],
      });
    } catch (modelError: any) {
      console.error('Gemini OCR Model Error (gemini-1.5-flash failed):', modelError);
      throw new Error(`Failed to scan bill. Gemini AI Vision error: ${modelError?.message || 'Model call failed'}`);
    }

    const responseText = response.text || '';
    
    // Clean JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]) as DocumentOCRResult;
      if (parsedData && parsedData.items && parsedData.items.length > 0) {
        return parsedData;
      }
    }
    throw new Error('Failed to scan bill. Could not parse structured invoice data from Gemini.');
  } catch (error: any) {
    console.error('Gemini OCR Error:', error);
    throw error; // Re-throw error so UI presents explicit Alert without fake fallback data
  }
}

export const processDocumentWithGemini = processDocumentOCR;

export default {
  processDocumentOCR,
  processDocumentWithGemini,
};
