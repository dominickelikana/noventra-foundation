import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lazy Google Gen AI initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// ----------------- NOVENTRA SYSTEM KNOWLEDGE PROMPT -----------------
const NOVENTRA_SYSTEM_PROMPT = `
You are the official AI Assistant for "NOVENTRA CHARITY FOUNDATION" (Taasisi ya Noventra Charity Foundation).
Organization Overview:
- Name: Noventra Charity Foundation
- Type: Non-governmental (NGO), Non-political, Non-profit, Community-focused charity foundation.
- Founded: 14 July 2025 in Tanzania (HQ in Dar es Salaam, operating nationwide across Dodoma, Morogoro, Tanga, Kilimanjaro, Arusha, Mwanza, Mbeya, and Rufiji).
- Tagline: "Restoring Hope. Transforming Lives." / "Kurejesha Matumaini. Kubadilisha Maisha."
- Welcome Message: "Welcome to Noventra Foundation, a non-governmental, non-political, non-profit organization restoring hope and transforming lives of vulnerable groups through education, healthcare, economic empowerment, environmental conservation, and humanitarian emergency relief."
- Vision: "To become a leading organization in restoring hope, strengthening community well-being, and creating lasting positive change."
- Mission: "To provide humanitarian assistance, education, healthcare, economic empowerment, and community development through innovation, partnership, and responsible use of resources."
- 6 Core Objectives:
  1. Kusaidia watoto yatima na walio katika mazingira magumu (Support orphan & vulnerable children).
  2. Kutoa misaada ya afya na elimu (Provide healthcare & education support).
  3. Kuwezesha vijana na wanawake kiuchumi (Economic empowerment for women & youth).
  4. Kulinda mazingira na upandaji miti (Environmental conservation & tree planting).
  5. Kutoa misaada wakati wa majanga na dharura (Disaster & emergency relief).
  6. Kushirikiana na taasisi za ndani na kimataifa (Partnering locally and internationally).

Official Payment & Donation Channels in Tanzania:
- M-Pesa: 0754 889 900 (Lipa Namba: 5678901 - Noventra Charity Foundation)
- Tigo Pesa: 0714 889 900 (Lipa Namba: 6789012 - Noventra Foundation)
- Airtel Money: 0784 889 900 (Lipa Namba: 7890123)
- HaloPesa: 0624 889 900
- Bank Accounts: CRDB Bank (A/C: 0150889900100 - TZS) & NMB Bank (A/C: 2011008899002 - USD).
- Physical in-kind donations: Food, clothes, school books, medical supplies accepted at Dar es Salaam HQ (Bagamoyo Road, Victoria Area) or regional collection hubs.

Volunteering:
- Open to anyone passionate about making a difference. Opportunities exist in Education/Tutoring, Healthcare outreach, Tree Planting, IT/Media, Event Management, and Emergency Relief.

Instructions:
- Answer warmly, respectfully, accurately, and empathetically.
- Respond in the language the user speaks (English or Swahili).
- If you do not know a specific piece of information or if the user asks for confidential internal records, clearly and politely say that the information is unavailable and encourage them to contact info@noventrafoundation.org or call +255 754 889 900.
`;

// ----------------- API ROUTES -----------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    organization: 'Noventra Charity Foundation',
    founded: '14 July 2025',
    timestamp: new Date().toISOString()
  });
});

// AI Chat for Public Visitors
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, language } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful offline response if API key is not yet set
      const fallback = language === 'sw'
        ? 'Karibu Noventra Charity Foundation! Unaweza kuchangia kupitia M-Pesa (Lipa Namba: 5678901), kujiunga kama mjitoleaji kwenye fomu yetu ya mtandaoni, au kuwasiliana nasi kupitia info@noventrafoundation.org au simu +255 754 889 900.'
        : 'Welcome to Noventra Charity Foundation! You can support our projects via M-Pesa (Lipa No: 5678901), CRDB Bank, apply to be a volunteer through our volunteer portal, or contact us directly at info@noventrafoundation.org / +255 754 889 900.';
      return res.json({ success: true, reply: fallback });
    }

    // Build context
    let formattedHistory = '';
    if (Array.isArray(history) && history.length > 0) {
      formattedHistory = history.slice(-6).map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
    }

    const promptText = `${NOVENTRA_SYSTEM_PROMPT}

Conversation History:
${formattedHistory}

User Query: ${message}
Current preferred language context: ${language === 'sw' ? 'Swahili' : 'English'}

Provide a helpful, precise, inspiring response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
    });

    const reply = response.text || (language === 'sw' ? 'Asante kwa kuwasiliana na Noventra Foundation.' : 'Thank you for reaching out to Noventra Charity Foundation.');

    res.json({ success: true, reply });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process AI chat query',
      reply: req.body?.language === 'sw' 
        ? 'Samahani, kumetokea hitilafu ya mtandao. Tafadhali wasiliana nasi kwa info@noventrafoundation.org.' 
        : 'Sorry, an error occurred while connecting to the assistant. Please reach out to info@noventrafoundation.org.' 
    });
  }
});

// Admin AI Copilot (Article generator, Translation, Volunteer Summarizer, Report Generator)
app.post('/api/ai/admin-copilot', async (req, res) => {
  try {
    const { action, payload, language } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({ success: false, error: 'Gemini API is not configured in environment' });
    }

    let prompt = '';

    if (action === 'generate_news') {
      prompt = `You are a professional NGO communications specialist for Noventra Charity Foundation.
Generate a compelling, inspiring news release/article about: "${payload.topic}".
Location: ${payload.location || 'Tanzania'}
Language: ${language === 'sw' ? 'Swahili' : 'English'}
Output format as a JSON with keys: "title", "summary", "content", "tags" (array of 3-4 strings).
Return ONLY pure JSON without markdown codeblocks.`;
    } else if (action === 'summarize_volunteer') {
      prompt = `Summarize this volunteer application for the Volunteer Manager at Noventra Foundation:
Applicant Name: ${payload.fullName}
Profession: ${payload.occupation}
Skills: ${payload.skills?.join(', ')}
Areas of Interest: ${payload.areasOfInterest?.join(', ')}
Motivation: ${payload.motivation}
Provide a brief 3-sentence evaluation highlighting their strengths, suitable project placements, and recommended action.`;
    } else if (action === 'translate') {
      prompt = `Translate the following text between English and Swahili with high diplomatic and NGO clarity:
Text: "${payload.text}"
Target Language: ${payload.targetLang === 'sw' ? 'Swahili (Kiswahili Sanifu)' : 'English'}
Return ONLY the translated text.`;
    } else if (action === 'generate_campaign') {
      prompt = `Draft a high-impact fundraising campaign description for Noventra Charity Foundation.
Project Category: ${payload.category}
Target Audience: Individual donors & corporate CSR partners in Tanzania & global diaspora.
Goal: Raising funds for ${payload.targetGoal || 'vulnerable community support'}.
Provide an engaging title, 3 key value bullet points, and an urgent call to action in ${language === 'sw' ? 'Swahili' : 'English'}.`;
    } else {
      prompt = `Assist with this administrative task for Noventra Charity Foundation: ${JSON.stringify(payload)}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    res.json({ success: true, result: response.text });
  } catch (err: any) {
    console.error('Admin AI error:', err);
    res.status(500).json({ success: false, error: 'Admin AI processing failed' });
  }
});

// Donation Verification / Webhook Simulation Endpoint
app.post('/api/donations/verify', async (req, res) => {
  try {
    const { reference, provider, amount, donorPhone } = req.body;
    // Validate simulated Tanzania Mobile Money / Bank response
    const isValid = reference && reference.length >= 6;
    res.json({
      success: true,
      verified: isValid,
      transactionId: reference || `TXN-${Date.now()}`,
      status: isValid ? 'completed' : 'failed',
      provider: provider || 'mpesa',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Verification error' });
  }
});

// ----------------- VITE & STATIC SERVING -----------------

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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Noventra Charity Foundation server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
