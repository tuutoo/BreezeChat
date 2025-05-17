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
    name: "单词解释",
    name_en: "Word Explanation",
    description: "For simple, memorable explanations and practical example sentences of a word or phrase, in both English and Chinese.",
    prompt: `
If the input is in Chinese:
- Output the following in order, each on a separate line:
  1. Two common English words or phrases, separated by a comma.
  2. A simple English explanation, using easy and practical language.
  3. Two example sentences, each on a new line, numbered "1." and "2.", using each English word or phrase in a natural, practical sentence.

If the input is in English or another language:
- Output the following in order, each on a separate line:
  1. Two common Chinese translations, separated by a comma.
  2. A simple English explanation, using easy and practical language.
  3. Two example sentences, each on a new line, numbered "1." and "2.", using the input word and a common English synonym or phrase in natural, practical sentences.

Do not include any headings, labels, or extra comments. Output only the content, each part on a new line.
`.trim()
  },
  {
    name: "技术文档",
    name_en: "Technical Documentation",
    description: "For translating developer-oriented technical documentation or API references. Maintain a professional and accurate tone, ensure consistent terminology, and present information in a clear, structured way for developers.",
    prompt: "Translate as developer technical documentation or API documentation. Use clear, concise, and professional language. Accurately translate technical terms and code-related content. Maintain logical structure and formatting suitable for developer reference. Avoid unnecessary explanation or embellishment."
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
    description: "For translating meeting minutes with a clear and structured format. Focus on key points, summaries, decisions, and action items for clarity and easy reference.",
    prompt: "Translate as formal meeting minutes. Use clear headings and a structured format. Summarize key points, record decisions, and list action items for follow-up."
  },
  {
    name: "演示文稿",
    name_en: "Presentation Slides",
    description: "For translating content intended for presentation slides. Focus on clarity, brevity, and impactful messaging. Suitable for slide headings, bullet points, and concise summaries.",
    prompt: "Translate for presentation slides. Use clear and concise language, short bullet points, and impactful statements that are easy to read on slides."
  }
];

