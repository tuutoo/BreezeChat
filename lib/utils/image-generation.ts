/**
 * 检测用户消息是否是图片生成请求
 */
export function isImageGenerationRequest(message: string): boolean {
  const lowercaseMessage = message.toLowerCase()

  // 检查生成类关键词
  const generateKeywords = ['生成', '画', '绘制', '创建', '制作', 'draw', 'paint', 'create', 'generate', 'make', 'zeichnen', 'malen', 'dibujar', 'dessiner']
  const imageKeywords = ['图片', '图像', '照片', '画', 'image', 'picture', 'photo', 'drawing', 'painting', 'bild', 'imagen', 'foto']

  // 检查是否同时包含生成类关键词和图像类关键词
  const hasGenerateKeyword = generateKeywords.some(keyword => lowercaseMessage.includes(keyword))
  const hasImageKeyword = imageKeywords.some(keyword => lowercaseMessage.includes(keyword))

  // 或者检查一些特定的组合短语
  const specificPhrases = [
    '画一张', '画一个', '给我画', '帮我画', 'draw me', 'paint me', 'show me an image',
    'créer image', 'bild erstellen'
  ]
  const hasSpecificPhrase = specificPhrases.some(phrase => lowercaseMessage.includes(phrase))

  return (hasGenerateKeyword && hasImageKeyword) || hasSpecificPhrase
}

/**
 * 从用户消息中提取图片生成的提示词
 */
export function extractImagePrompt(message: string): string {
  // 移除常见的图片生成指令词，保留描述性内容
  const cleaningPatterns = [
    /^(请|帮我|给我|能否|可以)?(画|绘制|生成|创建|制作)(一张|一个|一幅)?(图片|图像|画|照片)?[：:：，,。.！!]?\s*/i,
    /^(draw|paint|create|generate|make)\s+(me\s+)?(an?\s+)?(image|picture|drawing|painting)\s+(of\s+)?/i,
    /^(could you|can you|please)\s+(draw|paint|create|generate|make)/i,
    /^(zeichnen|malen|erstellen)\s+(sie\s+)?(mir\s+)?(ein\s+)?bild/i,
    /^(créer|dessiner|faire)\s+(moi\s+)?(une?\s+)?(image|dessin)/i,
    /^(dibujar|crear|hacer)\s+(me\s+)?(una?\s+)?(imagen|dibujo)/i
  ]

  let cleanedPrompt = message.trim()

  // 应用清理模式
  for (const pattern of cleaningPatterns) {
    cleanedPrompt = cleanedPrompt.replace(pattern, '').trim()
  }

  // 如果清理后的提示词太短，使用原始消息
  if (cleanedPrompt.length < 10) {
    cleanedPrompt = message.trim()
  }

  return cleanedPrompt
}

/**
 * 生成图片的响应消息
 */
export function createImageGenerationResponse(imageUrl: string, prompt: string): string {
  return `I've generated an image based on your request: "${prompt}". You can download it or view it in full size by clicking on the image.`
}
