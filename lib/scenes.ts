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

export const SCENES: Scene[]  = [
  {
    name: "日常沟通",
    name_en: "Daily Communication",
    description: "Casual, friendly exchanges between colleagues or friends, using common words and simple grammar.",
    prompt: "Translate the text in a casual, friendly tone using common words and simple grammar."
  },
  {
    name: "邮件",
    name_en: "Email",
    description: "Professional emails with a formal and polite tone, using common email greetings and closings (e.g., Hi …,” and “Best regards, [Your Name]”).",
    prompt: "Translate the text as a formal, well-structured email. Include a standard greeting at the top (e.g., “Hi …,”) and a closing at the end (e.g., “Best regards, [Your Name]”)."
  },
  {
    name: "Teams对话",
    name_en: "Teams Chat",
    description: "Casual chats with colleagues that are friendly, approachable, conversational, and clear without overly formal language.",
    prompt: "Translate the text in a friendly, approachable tone suitable for colleague chats—keep it clear and natural, not too formal."
  },
  {
    name: "技术支持",
    name_en: "Technical Support",
    description: "Technical support for Salesforce and SAP issues, providing clear, concise, and helpful solutions.",
    prompt: "Translate the text as technical support guidance for Salesforce or SAP—keep it clear, concise, and solution-focused."
  },
  {
    name: "会议邀请",
    name_en: "Meeting Invitation",
    description: "Convert input into a polished, formal meeting invitation that clearly presents the greeting, date, time, venue, agenda items, participants, and closing remarks.",
    prompt: "Rewrite and translate the following text into a formal meeting invitation. Structure it with a salutation, date, time, venue, agenda, list of attendees, and a closing remark—ensure it flows naturally and includes all key details."
  },
  {
    name: "讨论需求",
    name_en: "Requirement Discussion",
    description: "This is for discussing user requirements, where you need to gather detailed information.",
    prompt: "You are discussing user requirements. Your responses should be detailed and thorough. Translate the following text."
  },
  {
    name: "客户沟通",
    name_en: "Customer Communication",
    description: "This is for communicating with customers, where you should be polite, responsive, and empathetic.",
    prompt: "You are communicating with a customer. Your responses should be polite, empathetic, and responsive. Translate the following text."
  },
  {
    name: "会议纪要",
    name_en: "Meeting Minutes",
    description: "Convert input into structured, concise meeting minutes that highlight the summary, key decisions, and action items.",
    prompt: "Rewrite and translate the following text into meeting minutes format. Use clear headings for Summary, Decisions, and Action Items; present points succinctly and in logical order."
  }
  ];
  

  