/**
 * 毫秒級時間戳類型
 * 表示自 Unix epoch (1970-01-01T00:00:00.000Z) 以來的毫秒數
 */
export type TimestampInMillisecond = number;

/**
 * 時間戳工具函數
 */
export class TimestampUtils {
  /**
   * 獲取當前時間的毫秒時間戳
   */
  static now(): TimestampInMillisecond {
    return Date.now();
  }

  /**
   * 將 Date 對象轉換為毫秒時間戳
   */
  static fromDate(date: Date): TimestampInMillisecond {
    return date.getTime();
  }

  /**
   * 將毫秒時間戳轉換為 Date 對象
   */
  static toDate(timestamp: TimestampInMillisecond): Date {
    return new Date(timestamp);
  }

  /**
   * 將毫秒時間戳轉換為 ISO 字符串
   */
  static toISOString(timestamp: TimestampInMillisecond): string {
    return new Date(timestamp).toISOString();
  }

  /**
   * 將 ISO 字符串轉換為毫秒時間戳
   */
  static fromISOString(isoString: string): TimestampInMillisecond {
    return new Date(isoString).getTime();
  }
}
