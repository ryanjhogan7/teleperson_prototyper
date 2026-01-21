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
      model: 'sonar-pro',
      messages: [
        {
          role: 'system',
          content: 'You are a JSON data extraction assistant. You MUST respond ONLY with valid JSON. Never include explanations, markdown formatting, or any text outside the JSON object.'
        },
        {
          role: 'user',
          content: `Research the company at this URL: ${url}

Based on your research, generate a JSON object with the following structure. The "langfusePrompt" field should contain a complete customer service chatbot system prompt.

CRITICAL: Respond ONLY with the JSON object below. No markdown, no explanations, no code blocks - just raw JSON:

{
  "companyName": "The company's official name",
  "industry": "The industry/sector they operate in",
  "services": "A brief 1-2 sentence description of what they do",
  "targetCustomers": "Who their customers are (e.g., 'small businesses', 'enterprise companies', 'consumers')",
  "commonQuestions": ["Question 1 customers typically ask", "Question 2", "Question 3", "Question 4", "Question 5"],
  "brandTone": "professional",
  "primaryColor": "#4F46E5",
  "langfusePrompt": "## Identity\\n\\nYou are a world-class customer and client management AI agent for [COMPANY NAME], a [INDUSTRY] company that [WHAT THEY DO].\\n\\n[COMPANY NAME] was created because [INFER THEIR MISSION]. Your mission is to help prospects and customers understand [THEIR PRODUCTS/SERVICES] and guide them toward the right solution.\\n\\n## Core Function\\n\\nYour main objectives are to:\\n1. **Clarify what [COMPANY] offers** - Explain their products/services clearly\\n2. **Diagnose visitor intent** - Identify if they're a prospect, existing customer, or need support\\n3. **Answer common questions** - Address FAQs about [THEIR INDUSTRY]\\n4. **Guide next steps** - Help them take action (demo, purchase, contact sales, etc.)\\n5. **Maintain natural conversation** - Ask one question at a time, be helpful and professional\\n\\n## Identity and Boundaries\\n\\n1. You are a **Professional Customer Support Agent**—calm, helpful, and knowledgeable\\n2. Keep responses **short and clear**, avoiding jargon unless the user is technical\\n3. Use **guided questions** to understand what they need\\n4. Maintain a **[BRAND TONE]** tone\\n5. Never invent pricing, policies, or claims—stick to what's publicly known\\n\\n## Information Gathering\\n\\nAsk about:\\n- What brought them to [COMPANY NAME] today\\n- What problem they're trying to solve\\n- Their timeline and budget (if relevant)\\n- Their role/company size (for B2B)\\n\\n## Common Questions to Handle\\n\\n[LIST 5-10 INDUSTRY-SPECIFIC FAQs AND HOW TO ANSWER THEM based on research]\\n\\n## Objection Handling\\n\\n[LIST 3-5 COMMON OBJECTIONS AND RESPONSES based on industry]\\n\\n## Escalation\\n\\nEscalate to a human when:\\n- Complex technical questions beyond public knowledge\\n- Pricing negotiations or custom deals\\n- Complaints or issues requiring human judgment"
}

Fill in all placeholders with actual information from your research. For brandTone, choose one of: "professional", "casual", or "friendly". For primaryColor, suggest a hex color that matches their brand.`
        }
      ],
      temperature: 0.3
    })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Perplexity API error: ${error}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;

  // Try to extract JSON from the response
  let jsonContent = content.trim();

  // Remove markdown code blocks if present
  if (jsonContent.includes('```')) {
    const jsonMatch = jsonContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }
  }

  // Try to find JSON object if wrapped in other text
  if (!jsonContent.startsWith('{')) {
    const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
    }
  }

  try {
    const parsed = JSON.parse(jsonContent);

    // Validate required fields
    if (!parsed.companyName || !parsed.industry || !parsed.langfusePrompt) {
      throw new Error('Missing required fields in response');
    }

    return parsed;
  } catch (parseError) {
    console.error('Failed to parse Perplexity response:', jsonContent.substring(0, 200));
    throw new Error(`Failed to parse Perplexity response: ${parseError}. Response preview: ${jsonContent.substring(0, 100)}...`);
  }
}
