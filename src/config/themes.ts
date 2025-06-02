// 主题类型定义
export type ThemeName = 'google' | 'microsoft' | 'ubuntu';

// 主题配置接口
export interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    gradientStart: string;
    gradientEnd: string;
    pattern: string;
  };
}

// 主题配置
export const themes: Record<ThemeName, Theme> = {
  google: {
    name: 'google',
    label: 'Google 缤纷',
    colors: {
      primary: '#4285f4',      // Google Blue
      secondary: '#34a853',    // Google Green
      accent: '#fbbc05',       // Google Yellow
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.92))',
      surface: 'rgba(255, 255, 255, 0.8)',
      text: '#202124',         // Google Gray 900
      textSecondary: 'rgba(32, 33, 36, 0.85)',
      border: 'rgba(218, 220, 224, 0.5)',
      success: '#34a853',      // Google Green
      warning: '#fbbc05',      // Google Yellow
      error: '#ea4335',        // Google Red
      gradientStart: 'rgba(255, 255, 255, 0.95)',
      gradientEnd: 'rgba(248, 249, 250, 0.92)',
      pattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg stroke=\'%234285f4\' stroke-width=\'2\' stroke-opacity=\'0.1\'%3E%3Ccircle cx=\'25\' cy=\'25\' r=\'12\'/%3E%3Ccircle cx=\'75\' cy=\'75\' r=\'12\' stroke=\'%23ea4335\'/%3E%3Ccircle cx=\'75\' cy=\'25\' r=\'12\' stroke=\'%23fbbc05\'/%3E%3Ccircle cx=\'25\' cy=\'75\' r=\'12\' stroke=\'%2334a853\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
    }
  },
  microsoft: {
    name: 'microsoft',
    label: 'Microsoft 炫彩',
    colors: {
      primary: '#0078d4',      // Microsoft Blue
      secondary: '#50e6ff',    // Microsoft Light Blue
      accent: '#2b88d8',       // Microsoft Accent Blue
      background: 'linear-gradient(120deg, rgba(241, 246, 251, 0.95), rgba(236, 244, 252, 0.92))',
      surface: 'rgba(255, 255, 255, 0.85)',
      text: '#323130',         // Microsoft Gray
      textSecondary: 'rgba(50, 49, 48, 0.85)',
      border: 'rgba(0, 120, 212, 0.1)',
      success: '#107c10',      // Microsoft Green
      warning: '#ffaa44',      // Microsoft Orange
      error: '#d83b01',        // Microsoft Red
      gradientStart: 'rgba(241, 246, 251, 0.95)',
      gradientEnd: 'rgba(236, 244, 252, 0.92)',
      pattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\'%3E%3Crect width=\'28\' height=\'28\' x=\'2\' y=\'2\' fill=\'%23f25022\' fill-opacity=\'0.05\'/%3E%3Crect width=\'28\' height=\'28\' x=\'30\' y=\'2\' fill=\'%2300a4ef\' fill-opacity=\'0.05\'/%3E%3Crect width=\'28\' height=\'28\' x=\'2\' y=\'30\' fill=\'%237fba00\' fill-opacity=\'0.05\'/%3E%3Crect width=\'28\' height=\'28\' x=\'30\' y=\'30\' fill=\'%23ffb900\' fill-opacity=\'0.05\'/%3E%3C/g%3E%3C/svg%3E")'
    }
  },
  ubuntu: {
    name: 'ubuntu',
    label: 'Ubuntu 活力橙',
    colors: {
      primary: '#e95420',      // Ubuntu Orange
      secondary: '#ff8936',    // Light Orange
      accent: '#772953',       // Ubuntu Purple
      background: 'linear-gradient(150deg, rgba(255, 246, 241, 0.95), rgba(255, 251, 248, 0.92))',
      surface: 'rgba(255, 255, 255, 0.8)',
      text: '#111111',         // Ubuntu Black
      textSecondary: 'rgba(17, 17, 17, 0.85)',
      border: 'rgba(233, 84, 32, 0.12)',
      success: '#0e8420',      // Ubuntu Green
      warning: '#f99b11',      // Ubuntu Yellow
      error: '#c7162b',        // Ubuntu Red
      gradientStart: 'rgba(255, 246, 241, 0.95)',
      gradientEnd: 'rgba(255, 251, 248, 0.92)',
      pattern: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'16\' stroke=\'%23e95420\' stroke-width=\'2\' stroke-opacity=\'0.05\'/%3E%3Ccircle cx=\'12\' cy=\'40\' r=\'8\' stroke=\'%23772953\' stroke-width=\'2\' stroke-opacity=\'0.05\'/%3E%3Ccircle cx=\'68\' cy=\'40\' r=\'8\' stroke=\'%230e8420\' stroke-width=\'2\' stroke-opacity=\'0.05\'/%3E%3C/g%3E%3C/svg%3E")'
    }
  }
};
