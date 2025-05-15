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
    description: "Casual, friendly exchanges between colleagues or friends, using common words and simple grammar.",
    prompt: "Your task is to translate the provided text. Maintain a casual and friendly tone. Use common vocabulary and straightforward grammar suitable for everyday, informal conversation. Avoid overly formal language or complex sentence structures."
  },
  {
    name: "邮件",
    name_en: "Email",
    description: "Professional emails with a formal and polite tone, using common email greetings and closings (e.g., Hi …,” and “Best regards, [Your Name]”).",
    prompt: "Your task is to translate the provided text and format it as a formal, well-structured email. ENSURE it includes an appropriate professional greeting (e.g., 'Dear [Name],' or 'Hi [Name],') at the beginning, and a standard professional closing (e.g., 'Best regards,', 'Sincerely,') followed by a placeholder like '[Sender's Name]' at the end, if the sender's name is not part of the input. Maintain a polite and professional tone throughout. The body of the email should be translated accurately and clearly."
  },
  {
    name: "Teams对话",
    name_en: "Teams Chat",
    description: "For translating casual conversations between colleagues in a Teams chat. Use a friendly, approachable, and conversational style. Keep the language clear, natural, and professional, while avoiding overly formal expressions.",
    prompt: "Your task is to translate the following text for use in a Teams chat between colleagues. Use a friendly, approachable, and conversational tone, as if you are speaking directly to a coworker. Ensure the language is clear, natural, and concise. Avoid overly formal wording, but maintain a sense of professionalism appropriate for a workplace setting."
  },
  {
    name: "新闻资讯",
    name_en: "News Article",
    description: "For translating news reports or informational articles. Maintain objectivity, neutrality, and accuracy. Follow journalistic writing conventions and ensure all information is conveyed clearly and faithfully.",
    prompt: "You are tasked with translating the following news article. Use clear, objective, and neutral language, faithfully representing all facts, events, and direct quotations. Ensure the translation is accurate, easy to understand, and preserves the structure of the original article, including the headline, lead, and body paragraphs. Avoid adding personal opinions or interpretations. Retain journalistic style and conventions throughout the translation."
  },
  {
    name: "技术支持",
    name_en: "Technical Support",
    description: "Technical support for Salesforce and SAP issues, providing clear, concise, and helpful solutions.",
    prompt: "Your task is to translate the provided text, framing it as technical support guidance, potentially related to systems like Salesforce or SAP. The translation MUST be clear, concise, and solution-focused. Use precise technical terminology where appropriate, but ensure the instructions are easy to understand for the end-user. Focus on providing actionable steps or helpful information."
  },
  {
    name: "会议邀请",
    name_en: "Meeting Invitation",
    description: "Convert input into a polished, formal meeting invitation that clearly presents the greeting, date, time, venue, agenda items, participants, and closing remarks.",
    prompt: "Your primary task is to RESTRUCTURE and then TRANSLATE the input text into a formal meeting invitation. The invitation MUST be well-organized and clearly present the following elements if the information is available or can be reasonably inferred:\n- Salutation (e.g., 'Dear Team,')\n- Purpose of the Meeting\n- Date\n- Time (including timezone if context suggests)\n- Venue (or Virtual Meeting Link/Details)\n- Agenda (preferably as bullet points or a numbered list)\n- Optional: Invited Attendees /cc list\n- Closing remark (e.g., 'We look forward to your participation.').\nENSURE the language is polite, professional, and all key details are clearly communicated. The output should be ONLY the translated and formatted meeting invitation."
  },
  {
    name: "讨论需求",
    name_en: "Requirement Discussion",
    description: "This is for discussing user requirements, where you need to gather detailed information.",
    prompt: "Context: You are acting as a business analyst or consultant in a user requirements discussion. Your task is to translate the provided text. The translation should be detailed, thorough, and framed in a way that encourages clarification or elicits more information about user needs. If the input is a question, the translation should reflect an inquisitive and probing tone. If it's a statement, translate it to be clear and comprehensive, potentially highlighting areas for further discussion."
  },
  {
    name: "客户沟通",
    name_en: "Customer Communication",
    description: "This is for communicating with customers, where you should be polite, responsive, and empathetic.",
    prompt: "Context: You are communicating with a customer (external). Your task is to translate the provided text. The translation MUST be exceptionally polite, responsive, and empathetic. Use language that builds rapport, shows understanding, and addresses customer concerns or inquiries constructively and professionally. AVOID jargon where possible or explain it clearly."
  },
  {
    name: "会议纪要",
    name_en: "Meeting Minutes",
    description: "Convert input into structured, concise meeting minutes that highlight the summary, key decisions, and action items.",
    prompt: "Your primary task is to RESTRUCTURE and then TRANSLATE the input text into formal meeting minutes. The minutes MUST be well-structured with clear headings. Essential sections to include (if information is available or can be inferred) are:\n- Meeting Title/Topic\n- Date & Time\n- Attendees\n- Apologies (if any)\n- Summary / Key Discussion Points\n- Decisions Made (if any)\n- Action Items (clearly list each action, who is responsible, and the due date if specified).\nPresent information under each heading concisely, using bullet points or numbered lists for readability. Ensure logical order and clarity. The output should be ONLY the translated and formatted meeting minutes."
  },
  {
    name: "社交媒体帖子",
    name_en: "Social Media Post (X/Reddit)",
    description: "For engaging content tailored to X (Twitter) for brevity and impact, or Reddit for community discussion. Focus on appropriate tone, conciseness or detail, and platform-specific conventions like hashtags and formatting.",
    prompt: `Your task is to translate the provided text for a social media context, specifically for X (formerly Twitter) or Reddit. Infer the most suitable platform based on the input's length, style, and content.
  
  General Guidelines:
  -   **Engagement & Naturalness:** The translation MUST be engaging, sound natural, and be culturally appropriate for the target language.
  -   **Hashtags & Keywords:**
      -   Translate descriptive hashtags (e.g., #goodmood -> #好心情).
      -   Keep global/brand hashtags (e.g., #AI, #Tech).
      -   Ensure translated content retains or introduces relevant keywords.
  -   **Emojis:** Retain or adapt emojis to convey the same sentiment.
  -   **Mentions & Links:** Keep @mentions and URLs as they are.
  
  Platform-Specific Adaptations:
  
  1.  **If input resembles X (Twitter) content (short, punchy, uses hashtags):**
      *   **Be EXTREMELY CONCISE and impactful.** Aim for brevity suitable for microblogging.
      *   Translate to be direct and easily digestible.
      *   Effectively use or translate hashtags.
  
  2.  **If input resembles Reddit content (longer, for discussion, question format, or a post title/body):**
      *   **Adopt a conversational tone** suitable for forum discussions.
      *   **Clarity for Discussion:** Ensure questions are clear; statements are easy to understand and respond to.
      *   **Titles:** If translating a post title, make it engaging and accurately reflect the content.
      *   **Formatting:** Preserve or adapt simple formatting like bullet points or line breaks if they aid readability in a discussion context.
  
  Based on your inference of the intended platform (X or Reddit) from the input, translate and adapt it accordingly. Your output MUST ONLY be the translated and adapted social media post.
  `
  },
  {
    name: "演示文稿",
    name_en: "Presentation Slides",
    description: "Content for presentation slides, often using bullet points, concise phrases, and aiming for clarity and impact.",
    prompt: "Your task is to translate the provided text for use in presentation slides. Focus on clarity, conciseness, and impact. If the input consists of phrases or points, translate them as such, suitable for bullet points or short, impactful statements on a slide. Maintain a professional and engaging tone."
  },
  {
    name: "正式报告/文档",
    name_en: "Formal Report/Document",
    description: "For translating official reports, research papers, proposals, or other formal documents requiring precision, objectivity, and a professional tone.",
    prompt: "Your task is to translate the text for a formal report or official document. Maintain a highly professional, objective, and precise tone. Ensure accuracy in terminology and use complete, well-structured sentences. Avoid colloquialisms and informal language. If the original text contains specific formatting like headings or numbered lists that are crucial for structure, try to preserve a similar structure in the translation."
  },
  {
    name: "市场营销文案",
    name_en: "Marketing Copy",
    description: "Persuasive and engaging content for advertisements, brochures, product descriptions, or website copy, aiming to attract and retain customers.",
    prompt: "Your task is to translate the marketing copy. The translation MUST be persuasive, engaging, and culturally relevant to the target language audience. Focus on conveying the intended message and emotional appeal, not just a literal translation. Use language that motivates action or creates a positive brand perception. Adapt slogans or taglines creatively to resonate in the target language."
  },
  {
    name: "法律文件",
    name_en: "Legal Document (Draft/Understanding Aid)",
    description: "For translating legal documents like contracts or terms of service. Emphasizes precision and formal legal terminology. Note: AI translation for legal docs is for understanding/drafting, not a substitute for professional legal translators.",
    prompt: "Your task is to translate the provided legal text. Maintain extreme precision and use formal legal terminology appropriate for the target language. This translation is for informational or drafting purposes and is not a substitute for certified human translation for binding legal use. Translate clauses and terms as accurately as possible, preserving the original meaning and intent. AVOID paraphrasing legal terms unless a direct equivalent is unavailable and an explanation is necessary (though you should aim for direct equivalents)."
  },
  {
    name: "学术论文",
    name_en: "Academic Paper",
    description: "For translating research papers, abstracts, or scholarly articles. Requires formal language, precise terminology, and an objective tone.",
    prompt: "Your task is to translate the academic text (e.g., research paper, abstract, scholarly article). Maintain a formal, objective tone and use precise academic terminology relevant to the subject matter. Ensure clarity in conveying complex ideas and research findings. Adhere to standard academic writing conventions in the target language."
  },
  {
    name: "学习笔记",
    name_en: "Study Notes",
    description: "For personal study notes, summaries of lectures or readings. Can be less formal but clarity and accurate representation of key information are important.",
    prompt: "Your task is to translate study notes or a summary of learning material. Focus on accurately conveying the key information, concepts, and definitions. Maintain the original structure if it involves bullet points, headings, or numbered lists. The tone can be slightly less formal than academic papers but MUST be clear and easy to understand for review purposes."
  }
];

