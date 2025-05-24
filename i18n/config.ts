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
