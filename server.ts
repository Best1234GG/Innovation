import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  const ai = new GoogleGenAI();

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Campus Parking AI endpoint (Smart Parking Assistant)
  app.post('/api/parking-ai', async (req, res) => {
    try {
      const { question, currentSlot, userLocation } = req.body;
      const prompt = `คุณคือ AI ผู้ช่วยอัจฉริยะประจำระบบที่จอดรถในมหาวิทยาลัย (University Smart Parking Assistant)
ผู้ใช้งานถามว่า: "${question || 'แนะนำที่จอดรถว่างใกล้ที่สุด'}"
ข้อมูลปัจจุบัน: ช่องจอด ${currentSlot || 'A12'}, ตำแหน่ง: ${userLocation || 'ลานจอดรถอาคารเรียนรวม'}

กรุณาตอบเป็นภาษาไทยอย่างสุภาพ กระชับ เป็นมิตร และให้ข้อมูลที่เป็นประโยชน์สูงสุด เช่น คำแนะนำทิศทางเดินไปยังตึกเรียน จุดชาร์จ EV ความปลอดภัย หรือการติดต่อศูนย์ รปภ. มหาวิทยาลัย`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        answer: response.text || 'ขออภัย ไม่สามารถดึงข้อมูลได้ในขณะนี้',
      });
    } catch (error: any) {
      console.error('Parking AI error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Diet Generator Endpoint (Preserved)
  app.post('/api/generate-diet', async (req, res) => {
    try {
      const { ingredients, goal, mealType, extraNotes } = req.body;
      if (!ingredients || typeof ingredients !== 'string' || !ingredients.trim()) {
        return res.status(400).json({ error: 'กรุณาระบุวัตถุดิบที่มีในตู้เย็น' });
      }

      const prompt = `คุณคือโภชนากรและเชฟมืออาชีพที่เชี่ยวชาญการออกแบบเมนูอาหารเพื่อสุขภาพและการลดน้ำหนัก
วัตถุดิบ: "${ingredients.trim()}"
เป้าหมาย: "${goal || 'ลดน้ำหนัก'}"
มื้ออาหาร: "${mealType || 'อาหารเย็น'}"
หมายเหตุ: "${extraNotes || 'ไม่มี'}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              menuName: { type: 'STRING' },
              menuNameEn: { type: 'STRING' },
              totalCalories: { type: 'INTEGER' },
              caloriesUnit: { type: 'STRING' },
              description: { type: 'STRING' },
              cookingTimeMinutes: { type: 'INTEGER' },
              difficulty: { type: 'STRING' },
              ingredientsUsed: { type: 'ARRAY', items: { type: 'STRING' } },
              cookingSteps: { type: 'ARRAY', items: { type: 'STRING' } },
              nutritionFacts: {
                type: 'OBJECT',
                properties: {
                  protein: { type: 'STRING' },
                  carbs: { type: 'STRING' },
                  fat: { type: 'STRING' },
                  fiber: { type: 'STRING' },
                },
                required: ['protein', 'carbs', 'fat'],
              },
              dietitianTips: { type: 'STRING' },
            },
            required: [
              'menuName',
              'totalCalories',
              'description',
              'cookingTimeMinutes',
              'difficulty',
              'ingredientsUsed',
              'cookingSteps',
              'nutritionFacts',
              'dietitianTips',
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) throw new Error('No response');
      res.json({ success: true, data: JSON.parse(responseText) });
    } catch (error: any) {
      console.error('Error generating diet:', error);
      res.status(500).json({ success: false, error: error?.message || 'Error' });
    }
  });

  // Attach Vite middlewares in dev mode, or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
