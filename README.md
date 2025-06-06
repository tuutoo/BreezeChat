# **LinguaLens - Multilingual AI Intelligent Conversation Assistant**

**LinguaLens** is an advanced multilingual AI conversation assistant that supports both free chat and scenario-based configuration modes. Through flexible themes, scenes, and additional prompt configurations, it provides users with personalized AI conversation experiences. Supporting Chinese, English, Japanese, and Korean interface languages, it's suitable for various work scenarios including translation, technical support, meeting communication, and more.

![](/public/screen.png)

## **🌟 Core Features**

### **💬 Dual-Mode Conversation System**
- **Free Chat Mode**: Open AI conversations without configuration constraints
- **Scenario-Based Configuration Mode**: Professional conversations based on themes, scenes, and additional prompts

### **🌍 Multilingual Support**
- **Interface Languages**: Supports Chinese, English, Japanese, and Korean interface languages
- **AI Conversations**: Supports intelligent conversations and translations in multiple languages

### **⚙️ Flexible Configuration System**
- **Theme Configuration**: Set basic conversation instructions and styles
- **Scene Management**: Professional configurations for specific work scenarios
- **Additional Prompts**: Add extra instructions by category (Language, Tone, Style, Domain)
- **Conversation History Management**: Optional retention of current conversation history

### **💾 Data Persistence**
- **Database Storage**: All configurations saved in PostgreSQL database
- **Configuration Management**: Support for CRUD operations on models, themes, scenes, and additional prompts

### **🔐 User Authentication**
- **Login Protection**: Simple password protection for admin interface
- **Session Management**: Support for login/logout functionality

### **🎨 User Experience**
- **Theme Switching**: Support for light/dark theme switching
- **Real-time Prompt Display**: Visual display of currently active system prompts
- **Responsive Design**: Adapts to various device screens

## **🏗️ Technical Architecture**

- **Frontend Framework**: Next.js 15 (App Router) + TypeScript
- **UI Component Library**: Shadcn/UI + Tailwind CSS
- **Internationalization**: next-intl (Chinese, Japanese, English, Korean)
- **Database**: PostgreSQL + Prisma ORM
- **AI Integration**: Supports multiple AI providers
  - Google Gemini
  - OpenAI GPT
  - Groq (Llama)
  - Mistral AI
- **State Management**: React Hooks + localStorage
- **Deployment**: Docker + Docker Compose

## **🚀 Quick Start**

### **1. Clone the Project**

```bash
git clone https://github.com/neozhu/lingualens.git
cd lingualens
```

### **2. Install Dependencies**

```bash
pnpm install
# Or use npm
npm install
```

### **3. Configure Environment Variables**

Create a `.env.local` file, refer to the `sample.env` template:

```bash
# Environment Configuration
NODE_ENV=development
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Admin Configuration
ADMIN_PASSWORD=your_admin_password

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/lingualens?schema=public

# AI API Keys
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

### **4. Initialize Database**

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma db push

# (Optional) Seed example data
pnpm prisma db seed
```

### **5. Start Development Server**

```bash
pnpm dev
```

Visit `http://localhost:3000` to start using the application.

## **🐳 Docker Deployment**

### **Using Docker Compose**

```yaml
version: '3.8'

services:
  lingualens:
    image: lingualens:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ADMIN_PASSWORD=your_admin_password
      - DATABASE_URL=postgresql://postgres:password@db:5432/lingualens?schema=public
      - GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
      - GROQ_API_KEY=your_groq_api_key
      - OPENAI_API_KEY=your_openai_api_key
      - MISTRAL_API_KEY=your_mistral_api_key
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=lingualens
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Start the services:

```bash
docker-compose up -d
```

## **📖 User Guide**

### **Admin Functions**
1. **Login**: Use the configured admin password to log in
2. **Model Management**: Configure AI models and their providers
3. **Theme Management**: Set basic conversation instructions
4. **Scene Management**: Create specific work scenario configurations
5. **Additional Prompt Management**: Manage extra instructions by category

### **User Functions**
1. **Choose Mode**:
   - Configuration Mode: Select themes, scenes, and additional prompts
   - Free Mode: Start conversations directly
2. **Conversation Settings**:
   - Select AI model
   - Set whether to retain conversation history
   - Switch interface language
3. **Real-time Prompt Viewing**: Expand to view the complete system prompts currently in effect

## **🌐 Supported Scenarios**

- **Daily Communication**: Casual, friendly exchanges between colleagues or friends
- **Email Communication**: Professional business email communication
- **Technical Documentation**: Developer technical documentation or API reference translation
- **Technical Support**: System technical support communication
- **Meeting Invitations**: Formal meeting invitation messages
- **News Articles**: News reports or informational article translation
- **Word Explanations**: Simple explanations of words or phrases
- **Social Media**: Engaging posts for X (Twitter) or Reddit
- **Requirement Discussions**: Discussions about project requirements

## **🤝 Contributing**

We welcome community contributions! If you want to improve this project:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## **📄 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **🙏 Acknowledgments**

- Thanks to **Vercel AI SDK** for providing AI service integration
- Thanks to **Shadcn/UI** for providing excellent UI components
- Thanks to the **Next.js** team for providing a powerful framework
- Thanks to all AI providers for their excellent services

---

**🌟 If this project helps you, please give it a Star!**


