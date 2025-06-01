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
  /** 愿望的当前状态
   * pending - 待开始
   * in-progress - 进行中
   * completed - 已完成
   */
  status: string//;'pending' | 'in-progress' | 'completed';
  /** 愿望的进展情况（可选） */
  progress?: {
    /** 当前已完成的进度 */
    current: string;
    /** 下一步计划 */
    next?: string;
  };
  /** 创建时间 */
  createdAt: Date | string;
  /** 最后更新时间 */
  updatedAt: Date | string;
}
