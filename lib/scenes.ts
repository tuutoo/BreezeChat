// lib/scenes.ts
export interface Scene {
  /** 中文场景名称 */
  name: string;
  /** 英文场景名称 */
  name_en: string;
  /** 场景描述 */
  description: string;
  /** 生成提示 */
  prompt: string;
}

export const SCENES: Scene[]  = [
  {
    name: "日常沟通",
    name_en: "Daily Communication",
    description: "This is for a friendly, polite, and concise conversation context.",
    prompt: "You are participating in a daily communication. Your responses should be friendly, polite, and concise. Translate the following text."
  },
  {
    name: "邮件",
    name_en: "Email",
    description: "This is for a professional email context, where the tone should be polite and formal.",
    prompt: "You are a professional assistant drafting an email. Your responses should be polite, formal, and well-structured. Translate the following text."
  },
  {
    name: "Teams对话",
    name_en: "Teams Chat",
    description: "This is for a Teams conversation context, where the tone should be professional but friendly.",
    prompt: "You are participating in a Teams conversation. Your responses should be professional but friendly. Translate the following text."
  },
  {
    name: "寻求支持",
    name_en: "Support Request",
    description: "This is for technical support requests, where you should provide clear and helpful solutions.",
    prompt: "You are providing technical support. Your responses should be clear, concise, and helpful. Translate the following text."
  },
  {
    name: "讨论需求",
    name_en: "Requirement Discussion",
    description: "This is for discussing user requirements, where you need to gather detailed information.",
    prompt: "You are discussing user requirements. Your responses should be detailed and thorough. Translate the following text."
  },
  {
    name: "团队协作",
    name_en: "Team Collaboration",
    description: "This is for team collaboration, where you should maintain a supportive and motivating tone.",
    prompt: "You are collaborating with your team. Your responses should be supportive, motivating, and foster collaboration. Translate the following text."
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
    description: "This is for taking meeting notes, where the information should be summarized concisely.",
    prompt: "You are summarizing a meeting. Your responses should be concise, clear, and to the point, summarizing key discussions and actions. Translate the following text."
  },
  {
    name: "会议邀请",
    name_en: "Meeting Invitation",
    description: "This is for sending meeting invitations, where you should be clear, formal, and include necessary details.",
    prompt: "You are sending a meeting invitation. Your responses should be formal, clear, and include all necessary details. Translate the following text."
  },
  {
    name: "活动策划",
    name_en: "Event Planning",
    description: "This is for planning events, where creativity and attention to detail are essential.",
    prompt: "You are planning an event. Your responses should be creative, well-structured, and include all necessary details. Translate the following text."
  }
  ];
  

  