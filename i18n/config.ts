export const defaultLocale = "zh";
export const locales = ["zh", "en", "ja", "ko"];

// Simple translations map for demonstration purposes
// In a real app, you'd likely use a more robust solution like next-intl or react-i18next
export const translations = {
  zh: {
    systemAdmin: "系统管理",
    lightMode: "浅色模式",
    darkMode: "深色模式",
    systemDefault: "系统默认",
    toggleTheme: "切换主题",
    toggleLanguage: "切换语言",
    github: "GitHub 仓库",
    admin: "系统管理",
    modelManagement: "模型管理",
    sceneManagement: "场景管理",
    modelDescription: "管理 AI 模型配置，包括模型名称、提供商和状态等",
    sceneDescription: "管理场景配置，包括场景名称、描述和状态等",
    providersManagement: "提供商管理",
    providersDescription: "管理 AI 服务提供商，包括密钥和配置",
    login: "登录",
    logout: "登出",
    logoutError: "登出失败",
    addModel: "添加模型",
    editModel: "编辑模型",
    deleteModel: "删除模型",
    deleteConfirm: "确认删除",
    deleteMessage: "此操作无法撤销。您确定要删除这个项目吗？",
    cancel: "取消",
    confirm: "确认",
    error: "错误",
    success: "成功",
    save: "保存",
    name: "名称",
    description: "描述",
    status: "状态",
    enabled: "启用",
    disabled: "禁用",
    actions: "操作",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    lastUpdated: "最后更新",
    privacyIntro: "欢迎使用 LinguaLens。我们尊重您的隐私并致力于保护您分享的任何信息。本隐私政策说明了我们如何处理您的数据。",
    privacyCollection: "LinguaLens 不会收集、存储或处理任何个人信息或翻译数据。所有翻译都是使用第三方 AI 服务或本地浏览器功能实时进行的，不会在我们的服务器上保留任何输入或输出。",
    privacyCookies: "我们不会在应用程序中使用 cookie、跟踪像素或任何其他跟踪技术。您的使用保持私密和临时性。",
    privacyThirdParty: "我们集成了 AI 翻译服务（如 Google Gemini、Llama、Qwen、Mistral）来执行翻译。除了即时的翻译响应外，我们不会保留发送给或从这些服务接收的任何数据。",
    privacyContact: "如果您对本隐私政策有任何疑问或疑虑，请通过以下方式联系我们：",
    termsAcceptance: "通过访问或使用 LinguaLens(\"服务\")，您同意受这些服务条款的约束。如果您不同意这些条款的任何部分，则不得使用本服务。",
    termsDescription: "LinguaLens 是一个免费的开源翻译助手，采用 MIT 许可证。它提供中文和其他语言之间的双向翻译，适应各种上下文和场景。",
    termsLicense: "本服务的源代码在 MIT 许可证下可用。您可以根据 MIT 条款自由使用、复制、修改、合并、发布、分发和再许可该软件。MIT 许可证的副本可以在 LICENSE 文件中找到。",
    termsWarranty: "本服务按\"原样\"提供，不提供任何形式的明示或暗示保证。作者和贡献者不承担任何保证，包括但不限于适销性和特定用途的适用性。",
    termsLiability: "在任何情况下，作者或贡献者均不对因使用本服务而产生的任何间接、偶然、特殊或后果性损害负责。",
    termsPrivacy: "有关我们如何处理个人信息的详细信息，请参阅我们的隐私政策。",
    termsChanges: "我们可能会不时更新这些服务条款。任何更改都将发布在此页面上，并附上修订后的\"最后更新\"日期。",
    termsContact: "如果您对这些条款有任何疑问，请通过以下方式联系我们：",
    // Footer translations
    footerTagline: "AI 翻译助手，支持多场景风格切换",
    footerFeatures: "功能",
    footerTranslation: "翻译",
    footerSceneModes: "场景模式",
    footerSupport: "支持",
    footerFAQ: "常见问题",
    footerContactMe: "联系我",
    footerAbout: "关于",
    footerCopyright: "© 2025 LinguaLens. 保留所有权利。",
    // Chat demo translations
    loading: "加载中...",
    selectModel: "选择模型",
    inputPlaceholder: "输入想要翻译的内容...",
  },
  en: {
    systemAdmin: "System Admin",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    systemDefault: "System Default",
    toggleTheme: "Toggle Theme",
    toggleLanguage: "Toggle Language",
    github: "GitHub Repository",
    admin: "System Administration",
    modelManagement: "Model Management",
    sceneManagement: "Scene Management",
    modelDescription:
      "Manage AI model configurations, including model names, providers, and status",
    sceneDescription:
      "Manage scene configurations, including scene names, descriptions, and status",
    providersManagement: "Provider Management",
    providersDescription:
      "Manage AI service providers, including keys and configurations",
    login: "Login",
    logout: "Logout",
    logoutError: "Logout failed",
    addModel: "Add Model",
    editModel: "Edit Model",
    deleteModel: "Delete Model",
    deleteConfirm: "Confirm Deletion",
    deleteMessage:
      "This action cannot be undone. Are you sure you want to delete this item?",
    cancel: "Cancel",
    confirm: "Confirm",
    error: "Error",
    success: "Success",
    save: "Save",
    name: "Name",
    description: "Description",
    status: "Status",
    enabled: "Enabled",
    disabled: "Disabled",
    actions: "Actions",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    lastUpdated: "Last updated",
    privacyIntro: "Welcome to LinguaLens. We respect your privacy and are committed to protecting any information you share. This Privacy Policy explains how we handle your data.",
    privacyCollection: "LinguaLens does not collect, store, or process any personal information or translation data. All translations are performed in real-time using third-party AI services or local browser capabilities, and no input or output is retained on our servers.",
    privacyCookies: "We do not use cookies, tracking pixels, or any other tracking technologies within this application. Your use remains private and ephemeral.",
    privacyThirdParty: "We integrate with AI translation services (e.g., Google Gemini, Llama, Qwen, Mistral) to perform translations. We do not retain any data sent to or received from these services beyond the immediate translation response.",
    privacyContact: "If you have any questions or concerns about this Privacy Policy, please contact us at:",
    termsAcceptance: "By accessing or using LinguaLens (\"the Service\"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Service.",
    termsDescription: "LinguaLens is a free, open-source translation assistant licensed under the MIT License. It provides bidirectional translation between Chinese and other languages, adapting to various contexts and scenarios.",
    termsLicense: "The Service's source code is available under the MIT License. You are free to use, copy, modify, merge, publish, distribute, and sublicense the software in accordance with the MIT terms. A copy of the MIT License can be found in the LICENSE file.",
    termsWarranty: "The Service is provided \"as is\", without warranty of any kind, express or implied. The authors and contributors disclaim all warranties, including but not limited to merchantability and fitness for a particular purpose.",
    termsLiability: "In no event shall the authors or contributors be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of the Service.",
    termsPrivacy: "Please refer to our Privacy Policy for details on how we handle personal information.",
    termsChanges: "We may update these Terms of Service from time to time. Any changes will be posted on this page with a revised \"Last updated\" date.",
    termsContact: "If you have any questions about these Terms, please contact us at:",
    // Footer translations
    footerTagline: "AI translation assistant with multi-scenario style switching",
    footerFeatures: "Features",
    footerTranslation: "Translation",
    footerSceneModes: "Scene Modes",
    footerSupport: "Support",
    footerFAQ: "FAQ",
    footerContactMe: "Contact Me",
    footerAbout: "About",
    footerCopyright: "© 2025 LinguaLens. All rights reserved.",
    // Chat demo translations
    loading: "Loading...",
    selectModel: "Select Model",
    inputPlaceholder: "Enter content to translate...",
  },
  ja: {
    systemAdmin: "システム管理",
    lightMode: "ライトモード",
    darkMode: "ダークモード",
    systemDefault: "システムデフォルト",
    toggleTheme: "テーマを切り替える",
    toggleLanguage: "言語を切り替える",
    github: "GitHubリポジトリ",
    admin: "システム管理",
    modelManagement: "モデル管理",
    sceneManagement: "シーン管理",
    modelDescription:
      "AIモデル構成を管理します（モデル名、プロバイダー、ステータスなど）",
    sceneDescription:
      "シーン構成を管理します（シーン名、説明、ステータスなど）",
    providersManagement: "プロバイダー管理",
    providersDescription:
      "AIサービスプロバイダーを管理します（キーと設定を含む）",
    login: "ログイン",
    logout: "ログアウト",
    logoutError: "ログアウトに失敗しました",
    addModel: "モデルを追加",
    editModel: "モデルを編集",
    deleteModel: "モデルを削除",
    deleteConfirm: "削除の確認",
    deleteMessage:
      "このアクションは元に戻せません。このアイテムを削除してもよろしいですか？",
    cancel: "キャンセル",
    confirm: "確認",
    error: "エラー",
    success: "成功",
    save: "保存",
    name: "名前",
    description: "説明",
    status: "ステータス",
    enabled: "有効",
    disabled: "無効",
    actions: "アクション",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
    lastUpdated: "最終更新日",
    privacyIntro: "LinguaLensへようこそ。私たちはあなたのプライバシーを尊重し、共有していただいた情報を保護することに努めています。このプライバシーポリシーでは、データの取り扱い方法について説明しています。",
    privacyCollection: "LinguaLensは個人情報や翻訳データを収集、保存、処理することはありません。すべての翻訳は、サードパーティのAIサービスまたはローカルブラウザ機能を使用してリアルタイムで行われ、入力や出力はサーバーに保持されません。",
    privacyCookies: "このアプリケーション内では、Cookie、トラッキングピクセル、その他のトラッキング技術を使用していません。あなたの使用は私的かつ一時的なものです。",
    privacyThirdParty: "翻訳を実行するために、AI翻訳サービス（Google Gemini、Llama、Qwen、Mistralなど）と統合しています。即時の翻訳応答を超えて、これらのサービスとの間で送受信されたデータは保持しません。",
    privacyContact: "このプライバシーポリシーについてご質問やご懸念がある場合は、以下までご連絡ください：",
    termsAcceptance: "LinguaLens（「サービス」）にアクセスまたは使用することにより、あなたはこれらの利用規約に拘束されることに同意します。これらの規約のいずれかの部分に同意しない場合、サービスを使用することはできません。",
    termsDescription: "LinguaLensはMITライセンスの下で提供される無料のオープンソース翻訳アシスタントです。中国語と他の言語の間の双方向翻訳を提供し、様々なコンテキストやシナリオに適応します。",
    termsLicense: "サービスのソースコードはMITライセンスの下で利用可能です。MITの条件に従って、ソフトウェアを自由に使用、コピー、修正、マージ、公開、配布、再ライセンスすることができます。MITライセンスのコピーはLICENSEファイルにあります。",
    termsWarranty: "サービスは「現状のまま」提供され、明示または黙示のいかなる保証もありません。作者と貢献者は、商品性や特定目的への適合性を含むがこれに限定されないすべての保証を否認します。",
    termsLiability: "いかなる場合でも、作者または貢献者は、サービスの使用に関連して生じる間接的、偶発的、特別、または結果的な損害について責任を負いません。",
    termsPrivacy: "個人情報の取り扱いに関する詳細は、プライバシーポリシーを参照してください。",
    termsChanges: "これらの利用規約は随時更新される場合があります。変更はこのページに掲載され、改訂された「最終更新日」が付記されます。",
    termsContact: "これらの規約についてご質問がある場合は、以下までご連絡ください：",
    // Footer translations
    footerTagline: "マルチシナリオスタイル切り替え対応のAI翻訳アシスタント",
    footerFeatures: "機能",
    footerTranslation: "翻訳",
    footerSceneModes: "シーンモード",
    footerSupport: "サポート",
    footerFAQ: "よくある質問",
    footerContactMe: "お問い合わせ",
    footerAbout: "について",
    footerCopyright: "© 2025 LinguaLens. 全著作権所有。",
    // Chat demo translations
    loading: "読み込み中...",
    selectModel: "モデルを選択",
    inputPlaceholder: "翻訳したい内容を入力してください...",
  },
  ko: {
    systemAdmin: "시스템 관리",
    lightMode: "라이트 모드",
    darkMode: "다크 모드",
    systemDefault: "시스템 기본값",
    toggleTheme: "테마 전환",
    toggleLanguage: "언어 전환",
    github: "GitHub 저장소",
    admin: "시스템 관리",
    modelManagement: "모델 관리",
    sceneManagement: "장면 관리",
    modelDescription: "AI 모델 구성 관리 (모델 이름, 공급자 및 상태 포함)",
    sceneDescription: "장면 구성 관리 (장면 이름, 설명 및 상태 포함)",
    providersManagement: "공급자 관리",
    providersDescription: "AI 서비스 공급자 관리 (키 및 구성 포함)",
    login: "로그인",
    logout: "로그아웃",
    logoutError: "로그아웃 실패",
    addModel: "모델 추가",
    editModel: "모델 편집",
    deleteModel: "모델 삭제",
    deleteConfirm: "삭제 확인",
    deleteMessage: "이 작업은 취소할 수 없습니다. 이 항목을 삭제하시겠습니까?",
    cancel: "취소",
    confirm: "확인",
    error: "오류",
    success: "성공",
    save: "저장",
    name: "이름",
    description: "설명",
    status: "상태",
    enabled: "활성화됨",
    disabled: "비활성화됨",
    actions: "작업",
    privacyPolicy: "개인정보 처리방침",
    termsOfService: "서비스 이용약관",
    lastUpdated: "최종 업데이트",
    privacyIntro: "LinguaLens에 오신 것을 환영합니다. 우리는 귀하의 개인정보를 존중하며 공유하신 모든 정보를 보호하기 위해 최선을 다하고 있습니다. 이 개인정보 처리방침은 귀하의 데이터를 어떻게 처리하는지 설명합니다.",
    privacyCollection: "LinguaLens는 개인정보나 번역 데이터를 수집, 저장 또는 처리하지 않습니다. 모든 번역은 타사 AI 서비스 또는 로컬 브라우저 기능을 사용하여 실시간으로 수행되며, 입력이나 출력은 서버에 보관되지 않습니다.",
    privacyCookies: "이 애플리케이션 내에서는 쿠키, 추적 픽셀 또는 기타 추적 기술을 사용하지 않습니다. 귀하의 사용은 비공개이며 일시적입니다.",
    privacyThirdParty: "번역을 수행하기 위해 AI 번역 서비스(예: Google Gemini, Llama, Qwen, Mistral)와 통합되어 있습니다. 즉각적인 번역 응답을 넘어 이러한 서비스와 주고받은 데이터는 보관하지 않습니다.",
    privacyContact: "이 개인정보 처리방침에 대한 질문이나 우려사항이 있으시면 다음으로 연락해 주세요:",
    termsAcceptance: "LinguaLens(\"서비스\")에 접속하거나 사용함으로써 귀하는 이 서비스 이용약관에 동의하게 됩니다. 이 약관의 일부에 동의하지 않는 경우 서비스를 사용할 수 없습니다.",
    termsDescription: "LinguaLens는 MIT 라이선스 하에 제공되는 무료 오픈소스 번역 도우미입니다. 중국어와 다른 언어 간의 양방향 번역을 제공하며 다양한 맥락과 시나리오에 적응합니다.",
    termsLicense: "서비스의 소스 코드는 MIT 라이선스 하에 제공됩니다. MIT 조건에 따라 소프트웨어를 자유롭게 사용, 복사, 수정, 병합, 게시, 배포 및 재라이선스할 수 있습니다. MIT 라이선스 사본은 LICENSE 파일에서 찾을 수 있습니다.",
    termsWarranty: "서비스는 \"있는 그대로\" 제공되며, 명시적 또는 묵시적인 어떠한 보증도 제공하지 않습니다. 작성자와 기여자는 상품성 및 특정 목적에의 적합성을 포함하되 이에 국한되지 않는 모든 보증을 부인합니다.",
    termsLiability: "어떤 경우에도 작성자 또는 기여자는 서비스 사용과 관련하여 발생하는 간접적, 우발적, 특별 또는 결과적 손해에 대해 책임을 지지 않습니다.",
    termsPrivacy: "개인정보 처리 방법에 대한 자세한 내용은 개인정보 처리방침을 참조하세요.",
    termsChanges: "이 서비스 이용약관은 수시로 업데이트될 수 있습니다. 변경사항은 이 페이지에 게시되며 수정된 \"최종 업데이트\" 날짜가 표시됩니다.",
    termsContact: "이 약관에 대한 질문이 있으시면 다음으로 연락해 주세요:",
    // Footer translations
    footerTagline: "다중 시나리오 스타일 전환을 지원하는 AI 번역 도우미",
    footerFeatures: "기능",
    footerTranslation: "번역",
    footerSceneModes: "시나리오 모드",
    footerSupport: "지원",
    footerFAQ: "자주 묻는 질문",
    footerContactMe: "문의하기",
    footerAbout: "정보",
    footerCopyright: "© 2025 LinguaLens. 모든 권리 보유.",
    // Chat demo translations
    loading: "로딩 중...",
    selectModel: "모델 선택",
    inputPlaceholder: "번역할 내용을 입력하세요...",
  },
};

// Helper to get translation for a key in a specific locale
export function getTranslation(locale: string, key: string): string {
  // Check if the locale exists in our translations
  if (!translations[locale as keyof typeof translations]) {
    locale = defaultLocale;
  }

  // Get the translation for the key or fallback to English or the key itself
  const translation =
    translations[locale as keyof typeof translations]?.[
      key as keyof (typeof translations)[typeof defaultLocale]
    ];

  if (translation) return translation;

  // Try English as fallback if not the current locale
  if (locale !== "en") {
    const enTranslation =
      translations.en?.[key as keyof (typeof translations)["en"]];
    if (enTranslation) return enTranslation;
  }

  // Return the key as a last resort
  return key;
}

// Get current locale from pathname
export function getLocaleFromPathname(pathname: string): string {
  const locale = pathname.split("/")[1];
  return locales.includes(locale) ? locale : defaultLocale;
}

// Get user's preferred locale from localStorage or browser settings
export function getUserPreferredLocale(): string {
  if (typeof window === "undefined") return defaultLocale;

  // Check localStorage first
  const storedLocale = localStorage.getItem("preferred-locale");
  if (storedLocale && locales.includes(storedLocale)) {
    return storedLocale;
  }

  // Then check browser language settings
  const browserLang = navigator.language.split("-")[0];
  if (locales.includes(browserLang)) {
    return browserLang;
  }

  return defaultLocale;
}

// Save user's locale preference to localStorage
export function saveLocalePreference(locale: string): void {
  if (typeof window !== "undefined" && locales.includes(locale)) {
    localStorage.setItem("preferred-locale", locale);
  }
}

// Format a date according to the locale
export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    date
  );
}

// Format a number according to the locale
export function formatNumber(
  number: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

// Format a relative time according to the locale (e.g. "2 hours ago")
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string
): string {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return formatter.format(value, unit);
}
