/**
 * 剪贴板历史管理插件 - 配置文件
 * 
 * 说明：本文件包含插件运行时的所有可配置项
 * 修改配置后需要重启插件才能生效
 */

export const ClipboardConfig = {
  /**
   * ==================== 监听配置 ====================
   */

  // 剪贴板轮询间隔（毫秒）
  // 值越小监听越灵敏，但 CPU 占用越高
  // 推荐范围：300-1000ms
  pollingInterval: 500,

  // 是否在启动时自动开始监听
  autoStartMonitoring: true,

  // 是否启用智能去重
  // 开启后会通过 Hash 对比避免保存重复内容
  enableDeduplication: true,

  /**
   * ==================== 存储配置 ====================
   */

  // 数据库名称
  databaseName: 'clipboard_history',

  // 图片存储文件夹名称（相对于 userData 目录）
  imagesFolderName: 'clipboard_images',

  // 最大存储记录数
  // 超过此数量后会自动删除最旧的记录
  // 设置为 0 表示不限制
  maxRecords: 1000,

  // 是否自动清理过期数据
  autoCleanExpired: true,

  // 数据过期时间（天）
  // 超过此时间的记录会被自动清理
  // 设置为 0 表示永不过期
  dataExpirationDays: 30,

  /**
   * ==================== 缩略图配置 ====================
   */

  // 缩略图最大宽度（像素）
  // 缩略图会按原始宽高比缩放，保证宽度不超过此值
  thumbnailMaxWidth: 200,

  // 缩略图最大高度（像素）
  // 缩略图会按原始宽高比缩放，保证高度不超过此值
  thumbnailMaxHeight: 200,

  // 缩略图质量（0-1）
  // 值越大质量越高，但文件越大
  thumbnailQuality: 0.8,

  // 缩略图格式
  // 可选值：'png' | 'jpg' | 'webp'
  thumbnailFormat: 'png' as 'png' | 'jpg' | 'webp',

  // 是否保持宽高比
  // true: 按比例缩放，可能不会填满设定的宽高
  // false: 强制缩放到设定的宽高，可能会变形
  thumbnailKeepAspectRatio: true,

  /**
   * ==================== 图片处理配置 ====================
   */

  // 原始图片最大尺寸（像素）
  // 超过此尺寸的图片会被压缩
  // 设置为 0 表示不限制
  maxImageSize: 4096,

  // 支持的图片格式
  supportedImageFormats: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'],

  /**
   * ==================== UI 配置 ====================
   */

  // 虚拟滚动 - 文本/文件项高度（像素）
  // 计算：内容(~41px) + padding(16px) + 余量 = 80px
  virtualScrollItemHeight: 80,

  // 虚拟滚动 - 图片项高度（像素）
  // 必须等于 imageItem.previewHeight + imageItem.infoBarHeight
  virtualScrollImageItemHeight: 260,

  // 虚拟滚动 - 缓冲项数量
  // 在可见区域上下额外渲染的项数，减少滚动时的闪烁
  virtualScrollBufferSize: 5,

  // 虚拟滚动 - 项间隔（像素）
  virtualScrollItemGap: 12,

  // 虚拟滚动 - 容器上下边距（像素）
  virtualScrollContainerPadding: 12,

  // 图片项配置
  imageItem: {
    // 图片预览区域高度（像素）
    previewHeight: 180,
    // 图片信息栏高度（像素）
    infoBarHeight: 50,
  },

  // 列表项样式配置
  listItemStyle: {
    // 文本/文件项内边距（像素）
    padding: 8,
    // 边框圆角（像素）
    borderRadius: 8,
  },

  // 列表显示配置
  list: {
    // 文本预览最大长度（字符）
    textPreviewMaxLength: 100,

    // 是否显示时间戳
    showTimestamp: true,

    // 时间格式
    // 可选值：'relative' (相对时间，如"3分钟前") | 'absolute' (绝对时间，如"2023-10-12 14:30")
    timeFormat: 'absolute' as 'relative' | 'absolute',
  },

  // 图片预览弹窗配置
  imagePreview: {
    // 预览图片最大宽度（像素）
    maxWidth: 800,

    // 预览图片最大高度（像素）
    maxHeight: 600,

    // 是否允许缩放
    allowZoom: true,

    // 最大缩放比例
    maxZoomScale: 3,

    // 最小缩放比例
    minZoomScale: 0.5,
  },

  /**
   * ==================== 性能配置 ====================
   */

  // 搜索防抖延迟（毫秒）
  searchDebounceDelay: 300,

  // 滚动防抖延迟（毫秒）
  scrollDebounceDelay: 16,

  // 是否启用懒加载
  enableLazyLoad: true,

  // 图片懒加载阈值（像素）
  // 图片距离可视区域多少像素时开始加载
  lazyLoadThreshold: 200,

  /**
   * ==================== 文件命名配置 ====================
   */

  // 文件名前缀
  filePrefix: 'clipboard',

  // 时间戳格式
  // 格式说明：YYYY-年, MM-月, DD-日, HH-时, mm-分, ss-秒
  timestampFormat: 'YYYYMMDD_HHmmss',

  /**
   * ==================== 隐私与安全配置 ====================
   */

  // 是否启用数据加密
  // 注意：启用后会影响性能
  enableEncryption: false,

  // 应用黑名单
  // 这些应用的剪贴板内容不会被监听
  // 示例：['chrome.exe', 'firefox.exe']
  appBlacklist: [] as string[],

  // 敏感词过滤
  // 包含这些关键词的内容不会被保存
  // 示例：['password', '密码', 'secret']
  sensitiveKeywords: [] as string[],

  /**
   * ==================== 调试配置 ====================
   */

  // 是否启用调试模式
  debugMode: false,

  // 是否在控制台打印日志
  enableConsoleLog: true,

  // 日志级别
  // 可选值：'debug' | 'info' | 'warn' | 'error'
  logLevel: 'info' as 'debug' | 'info' | 'warn' | 'error',
};

/**
 * 配置类型定义
 */
export type ClipboardConfigType = typeof ClipboardConfig;

/**
 * 获取配置项
 * @param key 配置键名（支持点号分隔的嵌套键，如 'list.textPreviewMaxLength'）
 * @returns 配置值
 */
export function getConfig<K extends keyof ClipboardConfigType>(
  key: K
): ClipboardConfigType[K] {
  return ClipboardConfig[key];
}

/**
 * 设置配置项（运行时动态修改）
 * @param key 配置键名
 * @param value 配置值
 */
export function setConfig<K extends keyof ClipboardConfigType>(
  key: K,
  value: ClipboardConfigType[K]
): void {
  ClipboardConfig[key] = value;
}

/**
 * 重置所有配置为默认值
 */
export function resetConfig(): void {
  // 这里可以实现配置重置逻辑
  console.log('配置已重置为默认值');
}

