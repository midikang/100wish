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
  status: 'pending' | 'in-progress' | 'completed';
  /** 愿望的进展情况（可选） */
  progress?: {
    /** 当前已完成的进度 */
    current: string;
    /** 未来的计划 */
    future: string;
  };
  /** 愿望创建的时间（ISO 格式的字符串） */
  createdAt: string;
  /** 愿望最后更新的时间（ISO 格式的字符串） */
  updatedAt: string;
}
