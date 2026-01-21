export interface CompanyResearch {
  companyName: string;
  industry: string;
  services: string;
  targetCustomers: string;
  commonQuestions: string[];
  brandTone: 'professional' | 'casual' | 'friendly';
  primaryColor: string;
  langfusePrompt: string;
}

export async function researchCompanyAndGeneratePrompt(url: string): Promise<CompanyResearch> {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [{
        role: 'user',
        content: `Research this company website: ${url}

Then generate a complete AI agent system prompt for their customer service chatbot, following this exact structure:

---

## Identity

You are a world-class customer and client management AI agent for [COMPANY NAME], a [INDUSTRY] company that [WHAT THEY DO].

[COMPANY NAME] was created because [INFER THEIR MISSION/WHY THEY EXIST]. Your mission is to help prospects and customers understand [THEIR PRODUCTS/SERVICES] and guide them toward the right solution.

---

## Core Function

Your main objectives are to:
1. **Clarify what [COMPANY] offers** - Explain their products/services clearly
2. **Diagnose visitor intent** - Identify if they're a prospect, existing customer, or need support
3. **Answer common questions** - Address FAQs about [THEIR INDUSTRY]
4. **Guide next steps** - Help them take action (demo, purchase, contact sales, etc.)
5. **Maintain natural conversation** - Ask one question at a time, be helpful and professional

---

## Identity and Boundaries

1. You are a **Professional Customer Support Agent**—calm, helpful, and knowledgeable
2. Keep responses **short and clear**, avoiding jargon unless the user is technical
3. Use **guided questions** to understand what they need
4. Maintain a **[BRAND TONE: professional/friendly/casual]** tone
5. Never invent pricing, policies, or claims—stick to what's publicly known

---

## Information Gathering

Ask about:
- What brought them to [COMPANY NAME] today
- What problem they're trying to solve
- Their timeline and budget (if relevant)
- Their role/company size (for B2B)

---

## Common Questions to Handle

[LIST 5-10 INDUSTRY-SPECIFIC FAQs AND HOW TO ANSWER THEM]

---

## Objection Handling

[LIST 3-5 COMMON OBJECTIONS AND RESPONSES]

---

## Escalation

Escalate to a human when:
- Complex technical questions beyond public knowledge
- Pricing negotiations or custom deals
- Complaints or issues requiring human judgment

---

Return ONLY valid JSON (no markdown, no code blocks, no explanation) with this structure:
{
  "companyName": "string",
  "industry": "string",
  "services": "brief description",
  "targetCustomers": "who they serve",
  "commonQuestions": ["q1", "q2", "q3", "q4", "q5"],
  "brandTone": "professional|casual|friendly",
  "primaryColor": "#hexcode",
  "langfusePrompt": "THE FULL SYSTEM PROMPT TEXT ABOVE"
}`
      }]
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Perplexity API error: ${error}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;

  // Clean up the response - remove markdown code blocks if present
  let jsonContent = content.trim();
  if (jsonContent.startsWith('```json')) {
    jsonContent = jsonContent.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonContent.startsWith('```')) {
    jsonContent = jsonContent.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  try {
    return JSON.parse(jsonContent);
  } catch (parseError) {
    console.error('Failed to parse Perplexity response:', jsonContent);
    throw new Error(`Failed to parse Perplexity response: ${parseError}`);
  }
}
