# **LinguaLens Translation Assistant**

**LinguaLens** is an intelligent translation assistant that supports bidirectional translation between Chinese and other languages. It adapts to different contexts and scenarios such as email, online meetings, technical support, and more. The tool intelligently selects the tone, formality, and style of the translation based on the chosen scene, ensuring accurate and contextually appropriate translations.

![](/public/screen.png)

## **Features**

* **Bidirectional Translation**: Automatically translates Chinese to English and any non-Chinese language (e.g., English, French, German) to Chinese.
* **Scene-based Context**: Tailors translations based on the context of specific work-related scenarios like online meetings, emails, Teams chats, and technical support.
* **Multilingual Support**: Currently supports translations between Chinese and several other languages, including English, French, German, etc.
* **Customizable User Interface**: Easily switch between different scenes for translations, ensuring the tone and style fit the specific use case.
* **User-Friendly Design**: Built with **Next.js** and **ShadCN UI**, making the interface simple and intuitive.

## **Tech Stack**

* **Frontend**: Next.js 14 (App Router)
* **UI Components**: Shadcn/UI
* **State Management**: Zustand (for lightweight state management and history tracking)
* **AI Translation Service**: Powered by **Google Gemini** or any other AI model, providing accurate translations based on the context and input language.
* **Backend**: API integration with AI services for streaming responses up to 30 seconds.
* **CSS**: Tailwind CSS for styling
* **Language Detection**: Automatically detects the language of input text and translates it to the appropriate target language.

## **How It Works**

1. **Language Detection**: The AI detects the language of the input text. If the input is in **Chinese**, it translates it into **English**. If the input is in any other language (e.g., **English**, **French**, **German**), it translates it into **Chinese**.
2. **Scene Selection**: Users can select the translation scene (e.g., **Email**, **Online Meeting**, **Technical Support**). The AI adjusts the tone and formality of the translation based on the selected scene.
3. **Real-Time Translation**: The translation process takes place in real-time, providing instant feedback for quick and accurate translations.

## **Scenes**

The translation process adapts based on the following scenes:

* **Online Meetings**: Translations are formal, concise, and professional.
* **Emails**: Tone is polite, formal, and well-structured.
* **Teams Conversations**: Translations are professional but friendly.
* **Technical Support**: Translations are clear, concise, and focused on providing helpful solutions.
* **Requirement Discussions**: Translations are detailed and thorough.

## **Getting Started**

To run **LinguaLens** locally, follow these steps:

### **1. Clone the repository**

```bash
git clone https://github.com/yourusername/lingualens.git
cd lingualens
```

### **2. Install dependencies**

Use `pnpm` or `npm` to install the project dependencies.

```bash
pnpm install
# Or if you're using npm:
npm install
```

### **3. Set up environment variables**

Create a `.env.local` file in the root directory and add your environment-specific variables, such as API keys for the AI translation service.

```bash
NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=your_google_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **4. Run the project**

After setting up the environment variables, you can start the development server:

```bash
pnpm dev
# Or if you're using npm:
npm run dev
```

Visit `http://localhost:3000` in your browser to access the app.

## **Usage**

1. **Select a Scene**: Choose the context for the translation (e.g., **Online Meeting**, **Email**).
2. **Input Text**: Type or paste the text you want to translate in either **Chinese** or another language.
3. **Receive Translation**: The AI will process the translation and output the result in the target language (English for Chinese input, or Chinese for other language inputs).

## **Contributing**

We welcome contributions to **LinguaLens**! If you’d like to improve the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear explanation of the changes.

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **Acknowledgments**

* Thanks to the **AI SDK** for providing the AI services used in the project.
* Inspired by **Shadcn/UI** for building responsive and customizable UI components.
* Special thanks to the **Google Gemini** team for their AI-powered translation capabilities.


