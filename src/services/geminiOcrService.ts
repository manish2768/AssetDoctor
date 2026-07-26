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
      (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      '';

    if (!apiKey) {
      // Fallback to server API endpoint /api/scan-receipt if client API key is not in browser bundle
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
            itemName: it.itemName || 'Invoice Item',
            price: Number(it.price) || 0,
            brand: it.brand || 'Generic',
            category: it.category || 'Gadgets',
            serialOrImei: it.serialNumber || it.serialOrImei || '',
            warrantyMonths: Number(it.warrantyMonths) || 12,
          })),
        };
      }
      throw new Error(resData.error || 'Gemini API Key Missing in Environment Variables');
    }

    const aiClient = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert OCR AI. Analyze the attached bill/policy/invoice image carefully.
      Extract and return ONLY a strict JSON object with this exact schema:
      {
        "merchantName": "Store/Company Name",
        "purchaseDate": "DD/MM/YYYY",
        "gstin": "GST Number if available",
        "totalAmount": 0.00,
        "items": [
          {
            "itemName": "Product/Policy Name",
            "price": 0.00,
            "brand": "Brand",
            "category": "Gadgets/Vehicle/Insurance/etc",
            "serialOrImei": "Serial/Frame/Engine Number if present",
            "warrantyMonths": 12
          }
        ]
      }
    `;

    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const response = await aiClient.models.generateContent({
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

    const responseText = response.text || '';
    
    // Clean JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as DocumentOCRResult;
    }
    throw new Error('Failed to parse AI OCR response from Gemini');
  } catch (error: any) {
    console.error('OCR Extraction Error:', error);
    throw error; // Alert user instead of showing hardcoded mock data
  }
}

export default {
  processDocumentOCR,
};
