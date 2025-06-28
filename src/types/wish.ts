/**
 * 愿望清单项目的类型定义
 */
export interface Wish {
  /** 愿望的唯一标识符 */
  id: number;
  /** 愿望的标题 */
  title: string;
  /** 愿望的详细描述 */
  description: string;
  /** 愿望的当前状态 */
  status: 'pending' | 'in-progress' | 'completed';
  /** 愿望的进展情况 */
  progress?: {
    /** 当前已完成的进度 */
    current: string;
    /** 下一步计划 */
    next: string;
    /** 进度百分比 */
    percentage: number;
  };
  /** 奖励系统相关 */
  rewards?: {
    /** 奖励点数 */
    points: number;
    /** 成就徽章 */
    badges: string[];
    /** 里程碑 */
    milestones: {
      /** 里程碑描述 */
      description: string;
      /** 达成时间 */
      achievedAt: string;
    }[];
  };
  /** 动力值（每次更新进度时都会增加） */
  motivation?: number;
  /** 连续更新天数 */
  streakDays?: number;
  /** 最后一次更新时间 */
  lastUpdated?: string;
  /** 创建时间 */
  createdAt: Date | string;
  /** 最后更新时间 */
  updatedAt: Date | string;
}
