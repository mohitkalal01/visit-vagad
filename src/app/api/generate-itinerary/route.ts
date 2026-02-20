import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { destination, trip_type, duration, interests } = body;

        if (!destination || !duration) {
            return NextResponse.json({ error: 'destination and duration are required' }, { status: 400 });
        }

        const landmarksInfo = `
Key landmarks and experiences in Vagad (Banswara & Dungarpur, Rajasthan):
- Tripura Sundari Temple (Banswara): 1008 CE Shakti temple on a hillock, one of 108 Shakti Peethas — spectacular sunrise views
- Mangarh Dham (Banswara): Historic site of tribal Bhil freedom fighters, forested hilltop memorial
- Mahi Dam & Mahi Island Boating: Scenic reservoir, boat rides on green islands within the backwaters
- Chacha Kota Backwaters (Dungarpur): Serene backwaters via Maahi River tributaries, hilly terrain
- Juna Mahal (Dungarpur): 13th-century heritage palace with intricate stone carvings and fresco paintings
- Kagdi Pick-Up Weir (Banswara): Picturesque picnic spot with stepped stone weir across a river
- Beneshwar Dham (District border): Sacred Triveni confluence of Mahi, Som & Jakham rivers, mega tribal fair
- Phoolwari Ki Nal (Dungarpur): Biodiversity zone with waterfalls, wildlife and indigenous forests
- Bhil tribal craft workshops: Warli painting, bamboo craft, terracotta, stone carving, tribal textiles
    `.trim();

        const prompt = `You are a travel expert for the Vagad region (Banswara & Dungarpur districts, Rajasthan, India).

Create a detailed ${duration}-day travel itinerary for a tourist visiting ${destination} interested in ${trip_type} tourism.
Their specific interests are: ${(interests ?? []).join(', ') || 'general sightseeing'}.

${landmarksInfo}

Return a JSON object strictly in this format (no markdown, just raw JSON):
{
  "title": "string — catchy itinerary title",
  "summary": "string — 2-sentence trip overview",
  "days": [
    {
      "day": 1,
      "theme": "string — day theme",
      "activities": [
        {
          "time": "string (e.g. '7:00 AM')",
          "name": "string — activity name",
          "description": "string — 1-2 sentence description",
          "type": "string — one of: temple, nature, craft, food, adventure, heritage",
          "location": "string — specific place name",
          "duration": "string (e.g. '2 hours')"
        }
      ],
      "meals": { "breakfast": "string", "lunch": "string", "dinner": "string" },
      "stay_suggestion": "string — type of accommodation suggestion",
      "tips": "string — one local tip for this day"
    }
  ],
  "packing_tips": ["string"],
  "best_time_to_visit": "string",
  "estimated_budget_per_person": "string"
}`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Strip markdown code blocks if present
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const itinerary = JSON.parse(cleaned);

        return NextResponse.json({ itinerary }, { status: 200 });
    } catch (err) {
        console.error('[generate-itinerary]', err);
        return NextResponse.json(
            { error: 'Failed to generate itinerary. Check your GEMINI_API_KEY.' },
            { status: 500 }
        );
    }
}
