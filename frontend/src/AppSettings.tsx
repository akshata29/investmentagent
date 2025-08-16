
const SpokenLanguageOptions = () => {
  const options = [
    { key: 'en-US', text: 'English (USA)' },
    { key: 'en-GB', text: 'English (UK)' },
    { key: 'es-ES', text: 'Spanish (Spain)' },
    { key: 'es-MX', text: 'Spanish (Mexico)' },
    { key: 'fr-CA', text: 'French (Canada)' },
    { key: 'fr-FR', text: 'French (France)' },
    { key: 'it-IT', text: 'Italian (Italy)' },
    { key: 'ja-JP', text: 'Japanese (Japan)' },
    { key: 'da-DK', text: 'Danish (Denmark)' },
    { key: 'wuu-CN', text: 'Chinese (Wu, Simplified)' },
    { key: 'hi-IN', text: 'Hindi (India)' },
    { key: 'gu-IN', text: 'Gujarati (India)' },
    { key: 'te-IN', text: 'Telugu (India)' },
    { key: 'de-DE', text: 'German (Germany)' },
    { key: 'el-GR', text: 'Greek (Greece)' },
    { key: 'ar-EG', text: 'Arabic (Egypt)' },
    { key: 'el-GR', text: 'Greek (Greece)' },
    { key: 'ar-IL', text: 'Arabic (Israel)' },
    { key: 'ar-SA', text: 'Arabic (Saudi Arabia)' },
    { key: 'cs-CZ', text: 'Czech (Czechia)' },
    { key: 'ko-KR', text: 'Korean (Korea)' },
    { key: 'nl-NL', text: 'Dutch (Netherlands)' },
    { key: 'pt-BR', text: 'Portuguese (Brazil)' },
    { key: 'pt-PT', text: 'Portuguese (Portugal)' },
    { key: 'sv-SE', text: 'Swedish (Sweden)' },
    { key: 'he-IL', text: 'Hebrew (Israel)' },
    { key: 'th-TH', text: 'Thai (Thailand)' },
    { key: 'ta-IN', text: 'Tamil (India)' },
    { key: 'mr-IN', text: 'Marathi (India)' },
    { key: 'vi-VN', text: 'Vietnamese (Vietnam)' },
    { key: 'pl-PL', text: 'Polish (Poland)' },
    { key: 'sw-KE', text: 'Swahili (Kenya)' },
  ];

  return options;
};

export const ScenarioOptions = () => {
  const scenarios = [
    { key: 'ins-auto', text: 'Insurance (Auto-Claim)' },
    { key: 'ins-life', text: 'Insurance (Life-Quote)' },
    { key: 'bank-newac', text: 'Bank (New Account)' },
    { key: 'capmt-wealthmgt', text: 'Capital Markets (Wealth Mgt)' },
    { key: 'health', text: 'Healthcare' },
    { key: 'retail', text: 'Retail' },
    { key: 'travel', text: 'Travel' } 
  ];

  return scenarios;
};

export const LayoutOptions = () => {
  const layouts = [
    { key: 'original', text: '📜 Original Layout (Vertical Scroll)' },
    { key: 'dashboard', text: '📐 Dashboard Grid (Recommended)' },
    { key: 'command', text: '🎯 Command Center (Trading Floor)' },
    { key: 'spotlight', text: '🔍 Spotlight Focus (Context-Aware)' },
    { key: 'contextual', text: '🧠 Contextual Flow (Smart Adaptive)' },
    { key: 'pods', text: '🌊 Floating Pods (Customizable)' },
    { key: 'tablet', text: '📱 Tablet View (Tab-Based)' },
    { key: 'sidebar', text: '📋 Sidebar Navigation (Workflow)' },
    { key: 'floating', text: '🪟 Floating Panels (Power User)' }
  ];

  return layouts;
};

export default SpokenLanguageOptions;

