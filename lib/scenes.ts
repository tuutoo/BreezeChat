// lib/scenes.ts
export interface Scene {
  /** Scene name in Chinese */
  name: string;
  /** Scene name in English */
  name_en: string;
  /** Scene description */
  description: string;
  /** Generation prompt */
  prompt: string;
}

export const SCENES: Scene[] = [
  {
    name: "日常沟通",
    name_en: "Daily Communication",
    description: "Casual, friendly exchanges between colleagues or friends, using common vocabulary and simple grammar.",
    prompt: "Translate as daily casual conversation, using common vocabulary, simple grammar, and a friendly tone."
  },
  {
    name: "邮件",
    name_en: "Email",
    description: "For professional business email communication.",
    prompt: "Translate as a formal business email, including greeting and closing. Use a polite and professional tone."
  },
  {
    name: "Teams对话",
    name_en: "Teams Chat",
    description: "For friendly and efficient workplace chat between colleagues.",
    prompt: "Translate as a Teams chat message between colleagues. Use a friendly, polite, and direct style—clear and natural, like talking to a coworker you know well. Avoid overly formal or excessive pleasantries."
  },
  {
    name: "新闻资讯",
    name_en: "News Article",
    description: "For translating news reports or informational articles. Maintain objectivity, neutrality, and accuracy. Follow journalistic writing conventions and ensure all information is conveyed clearly and faithfully.",
    prompt: "Translate as a news article. Use clear, objective, and neutral language, preserving structure and facts."
  },
  {
    name: "社交媒体帖子",
    name_en: "Social Media Post (X/Reddit)",
    description: "For engaging posts on X (Twitter) or Reddit.",
    prompt: "Translate as a social media post for X or Reddit. Use concise, engaging language with appropriate hashtags, emojis, and formatting."
  },
  {
    name: "技术支持",
    name_en: "Technical Support",
    description: "For technical support communication or instructions, mainly for Salesforce, JavaScript, .NET, and SAP.",
    prompt: "Translate as technical support guidance, mainly related to Salesforce, JavaScript, .NET, or SAP. Be clear, concise, and solution-focused."
  },
  {
    name: "会议邀请",
    name_en: "Meeting Invitation",
    description: "For formal meeting invitation messages.",
    prompt: "Translate as a formal meeting invitation, including greeting, purpose, date, time, venue, agenda, participants, and closing."
  },
  {
    name: "讨论需求",
    name_en: "Requirement Discussion",
    description: "For discussions about requirements or gathering user needs, mainly for Salesforce, JavaScript, .NET, and SAP.",
    prompt: "Translate as a requirements discussion, mainly related to Salesforce, JavaScript, .NET, or SAP. Be detailed and encourage clarification or more information."
  },
  {
    name: "会议纪要",
    name_en: "Meeting Minutes",
    description: "For structured and concise meeting minutes.",
    prompt: "Translate as formal meeting minutes with headings, summary, decisions, and action items."
  },
  {
  name: "单词解释",
  name_en: "Word Explanation",
  description: "For explaining the meaning, pronunciation, and common usage of a word in both English and Chinese.",
  prompt: `
If the input is in Chinese:
- Output the following sections in order:
  1. English Translation:
  2. English Definition:
  3. Pronunciation (IPA):
  4. Example Sentences:
     - Example 1:
     - Example 2:

If the input is in English:
- Output the following sections in order:
  1. Chinese Meaning:
  2. English Definition:
  3. Pronunciation (IPA):
  4. Example Sentences:
     - Example 1:
     - Example 2:

Do not include the original input or any additional explanations. Only output the structured explanation and examples as shown above.
`.trim()
},
  {
    name: "学习笔记",
    name_en: "Study Notes",
    description: "For summaries and personal study notes.",
    prompt: "Translate as study notes or a summary. Use clear, structured language with bullet points or headings if needed."
  },
  {
    name: "演示文稿",
    name_en: "Presentation Slides",
    description: "For content used in presentation slides.",
    prompt: "Translate for presentation slides. Use clear, concise bullet points or short impactful statements."
  },
];

