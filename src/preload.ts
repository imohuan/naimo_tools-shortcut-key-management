/// <reference path="../typings/naimo.d.ts" />

import { contextBridge } from 'electron';
import { ClipboardConfig } from './config';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';


// ==================== 类型定义 ====================

/**
 * 剪贴板记录类型
 */
interface ClipboardRecord {
  _id: string;
  _rev?: string;
  type: 'text' | 'image' | 'file';
  content: string;
  preview: string;
  thumbnail?: string;
  originalPath?: string;
  hash: string;
  timestamp: number;
  category?: string;
  tags?: string[];
  metadata?: {
    size?: number;
    format?: string;
    width?: number;
    height?: number;
    [key: string]: any;
  };
}

/**
 * 查询选项
 */
interface QueryOptions {
  type?: 'text' | 'image' | 'file';
  category?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'type';
  order?: 'asc' | 'desc';
}

/**
 * 数据库操作结果
 */
interface DbResult {
  ok: boolean;
  id?: string;
  rev?: string;
  error?: string;
}

// ==================== 文件管理器 ====================

class FileManager {
  private imagesDir: string = '';
  private initialized: boolean = false;

  /**
   * 初始化文件管理器
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // 获取用户数据目录
      const userDataPath = await naimo.system.getPath('userData');
      this.imagesDir = path.join(userDataPath, ClipboardConfig.imagesFolderName);

      // 确保目录存在
      if (!fs.existsSync(this.imagesDir)) {
        fs.mkdirSync(this.imagesDir, { recursive: true });
      }

      this.initialized = true;
      console.log('文件管理器初始化成功:', this.imagesDir);
    } catch (error) {
      console.error('文件管理器初始化失败:', error);
      throw error;
    }
  }

  /**
   * 生成时间戳文件名
   */
  private generateTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hour}${minute}${second}`;
  }

  /**
   * 保存图片并生成缩略图
   */
  async saveImageWithThumbnail(
    base64Data: string,
    prefix: string
  ): Promise<{
    originalPath: string;
    thumbnailPath: string;
    hash: string;
    metadata: {
      width: number;
      height: number;
      thumbnailWidth: number;
      thumbnailHeight: number;
    };
  }> {
    await this.init();

    const timestamp = this.generateTimestamp();
    const originalName = `${prefix}_image_${timestamp}.png`;
    const thumbnailName = `${prefix}_thumb_${timestamp}.png`;

    const originalPath = path.join(this.imagesDir, originalName);
    const thumbnailPath = path.join(this.imagesDir, thumbnailName);

    // 解析 base64
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');

    // 计算 hash
    const hash = crypto.createHash('md5').update(buffer).digest('hex');

    // 保存原图
    await fs.promises.writeFile(originalPath, buffer);

    // 生成缩略图
    const { thumbnail, thumbnailWidth, thumbnailHeight, originalWidth, originalHeight } =
      await this.generateThumbnail(buffer);
    await fs.promises.writeFile(thumbnailPath, thumbnail);

    return {
      originalPath,
      thumbnailPath,
      hash,
      metadata: {
        width: originalWidth,
        height: originalHeight,
        thumbnailWidth,
        thumbnailHeight,
      },
    };
  }

  /**
   * 生成缩略图
   */
  private async generateThumbnail(
    imageBuffer: Buffer
  ): Promise<{
    thumbnail: Buffer;
    thumbnailWidth: number;
    thumbnailHeight: number;
    originalWidth: number;
    originalHeight: number;
  }> {
    // 使用 Canvas API 生成缩略图
    // 注意：在 Electron 环境中需要安装 canvas 包
    // 这里使用简化实现，实际应该使用 canvas

    // 简化版本：直接返回原图（实际项目中需要使用 canvas 或 sharp 库）
    const originalWidth = 1920; // 临时值
    const originalHeight = 1080; // 临时值

    const maxWidth = ClipboardConfig.thumbnailMaxWidth;
    const maxHeight = ClipboardConfig.thumbnailMaxHeight;

    let thumbnailWidth = originalWidth;
    let thumbnailHeight = originalHeight;

    if (ClipboardConfig.thumbnailKeepAspectRatio) {
      if (originalWidth > maxWidth || originalHeight > maxHeight) {
        const widthScale = maxWidth / originalWidth;
        const heightScale = maxHeight / originalHeight;
        const scale = Math.min(widthScale, heightScale);

        thumbnailWidth = Math.round(originalWidth * scale);
        thumbnailHeight = Math.round(originalHeight * scale);
      }
    } else {
      thumbnailWidth = Math.min(originalWidth, maxWidth);
      thumbnailHeight = Math.min(originalHeight, maxHeight);
    }

    // 简化实现：返回原图作为缩略图
    // TODO: 实际项目中需要使用 canvas 或 sharp 库进行图片缩放
    return {
      thumbnail: imageBuffer,
      thumbnailWidth,
      thumbnailHeight,
      originalWidth,
      originalHeight,
    };
  }

  /**
   * 读取图片文件为 base64
   */
  async readImageAsBase64(filePath: string): Promise<string> {
    try {
      const buffer = await fs.promises.readFile(filePath);
      return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (error) {
      console.error('读取图片失败:', error);
      throw error;
    }
  }

  /**
   * 删除文件
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('删除文件失败:', error);
      return false;
    }
  }

  /**
   * 获取图片目录路径
   */
  getImagesDirectory(): string {
    return this.imagesDir;
  }
}

// ==================== 数据库管理器 ====================

class DatabaseManager {
  private dbName: string = ClipboardConfig.databaseName;

  /**
   * 保存记录
   */
  async saveRecord(record: ClipboardRecord): Promise<DbResult> {
    try {
      const result = await naimo.db.put(record, this.dbName);
      return {
        ok: true,
        id: result.id,
        rev: result.rev,
      };
    } catch (error: any) {
      console.error('保存记录失败:', error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  /**
   * 获取单条记录
   */
  async getRecord(id: string): Promise<ClipboardRecord | null> {
    try {
      const result = await naimo.db.get(id, this.dbName);
      return result as ClipboardRecord;
    } catch (error) {
      console.error('获取记录失败:', error);
      return null;
    }
  }

  /**
   * 查询记录
   */
  async queryRecords(options: QueryOptions = {}): Promise<ClipboardRecord[]> {
    try {
      const {
        type,
        category,
        limit = 100,
        offset = 0,
        sortBy = 'timestamp',
        order = 'desc',
      } = options;

      // 获取所有记录
      const allDocs = await naimo.db.allDocs('', this.dbName);

      // 手动筛选和排序
      let filtered = allDocs as ClipboardRecord[];

      // 按类型筛选
      if (type) {
        filtered = filtered.filter(doc => doc.type === type);
      }

      // 按分类筛选
      if (category) {
        filtered = filtered.filter(doc => doc.category === category);
      }

      // 排序
      filtered.sort((a, b) => {
        const aValue = a[sortBy as keyof ClipboardRecord] as any;
        const bValue = b[sortBy as keyof ClipboardRecord] as any;

        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // 分页
      return filtered.slice(offset, offset + limit);
    } catch (error) {
      console.error('查询记录失败:', error);
      return [];
    }
  }

  /**
   * 搜索记录
   */
  async searchRecords(keyword: string): Promise<ClipboardRecord[]> {
    try {
      if (!keyword.trim()) {
        return await this.queryRecords({ limit: 100 });
      }

      const allRecords = await naimo.db.allDocs('', this.dbName);

      // 简单的关键词搜索
      const filtered = allRecords.filter((doc: any) => {
        const record = doc as ClipboardRecord;
        return (
          record.content?.toLowerCase().includes(keyword.toLowerCase()) ||
          record.preview?.toLowerCase().includes(keyword.toLowerCase()) ||
          record.tags?.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
        );
      });

      return filtered as ClipboardRecord[];
    } catch (error) {
      console.error('搜索记录失败:', error);
      return [];
    }
  }

  /**
   * 删除记录
   */
  async deleteRecord(id: string): Promise<boolean> {
    try {
      await naimo.db.remove(id, this.dbName);
      return true;
    } catch (error) {
      console.error('删除记录失败:', error);
      return false;
    }
  }

  /**
   * 清空所有记录
   */
  async clearAll(): Promise<boolean> {
    try {
      const allRecords = await naimo.db.allDocs('', this.dbName);
      for (const doc of allRecords as any[]) {
        const record = doc as ClipboardRecord;

        // 如果是图片，先删除对应的文件（原图 + 缩略图）
        if (record.type === 'image') {
          if (record.originalPath) {
            await fileManager.deleteFile(record.originalPath);
          }
          if (record.thumbnail) {
            await fileManager.deleteFile(record.thumbnail);
          }
        }

        // 兼容 _id / id 两种字段
        const id = (record as any)._id ?? (record as any).id;
        if (!id) {
          console.warn('清空记录时发现缺少 _id/id，已跳过该记录:', record);
          continue;
        }

        await naimo.db.remove(id, this.dbName);
      }

      return true;
    } catch (error) {
      console.error('清空记录失败:', error);
      return false;
    }
  }

  /**
   * 检查是否存在重复内容
   */
  async checkDuplicate(hash: string): Promise<boolean> {
    try {
      const allRecords = await naimo.db.allDocs('', this.dbName);
      const exists = allRecords.some((doc: any) => {
        const record = doc as ClipboardRecord;
        return record.hash === hash;
      });
      return exists;
    } catch (error) {
      console.error('检查重复失败:', error);
      return false;
    }
  }

  /**
   * 根据 hash 查找并删除旧记录
   */
  async findAndDeleteByHash(hash: string): Promise<ClipboardRecord | null> {
    try {
      const allRecords = await naimo.db.allDocs('', this.dbName);
      const oldRecord = allRecords.find((doc: any) => {
        const record = doc as ClipboardRecord;
        return record.hash === hash;
      }) as ClipboardRecord | undefined;

      if (oldRecord) {
        await naimo.db.remove(oldRecord._id, this.dbName);
        console.log('已删除旧记录:', oldRecord._id);
        return oldRecord;
      }

      return null;
    } catch (error) {
      console.error('查找并删除记录失败:', error);
      return null;
    }
  }
}

// ==================== 处理器系统 ====================

const fileManager = new FileManager();
const dbManager = new DatabaseManager();

/**
 * 文本处理器
 */
class TextHandler {
  async handle(text: string): Promise<ClipboardRecord | null> {
    try {
      // 计算 hash
      const hash = crypto.createHash('md5').update(text).digest('hex');

      // 检查去重
      if (ClipboardConfig.enableDeduplication) {
        const isDuplicate = await dbManager.checkDuplicate(hash);
        if (isDuplicate) {
          console.log('文本重复，删除旧记录并创建新记录');
          // 删除旧记录
          await dbManager.findAndDeleteByHash(hash);
        }
      }

      // 生成预览
      const preview = text.length > ClipboardConfig.list.textPreviewMaxLength
        ? text.substring(0, ClipboardConfig.list.textPreviewMaxLength) + '...'
        : text;

      // 创建记录
      const record: ClipboardRecord = {
        _id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: text,
        preview,
        hash,
        timestamp: Date.now(),
      };

      return record;
    } catch (error) {
      console.error('文本处理失败:', error);
      return null;
    }
  }
}

/**
 * 图片处理器
 */
class ImageHandler {
  async handle(imageData: string): Promise<ClipboardRecord | null> {
    try {
      // 保存图片并生成缩略图
      const {
        originalPath,
        thumbnailPath,
        hash,
        metadata,
      } = await fileManager.saveImageWithThumbnail(
        imageData,
        ClipboardConfig.filePrefix
      );

      // 检查去重
      if (ClipboardConfig.enableDeduplication) {
        const isDuplicate = await dbManager.checkDuplicate(hash);
        if (isDuplicate) {
          console.log('图片重复，删除旧记录及文件并创建新记录');
          // 查找并删除旧记录
          const oldRecord = await dbManager.findAndDeleteByHash(hash);

          // 删除旧图片文件
          if (oldRecord && oldRecord.type === 'image') {
            if (oldRecord.originalPath) {
              await fileManager.deleteFile(oldRecord.originalPath);
            }
            if (oldRecord.thumbnail) {
              await fileManager.deleteFile(oldRecord.thumbnail);
            }
          }
        }
      }

      // 创建记录
      const record: ClipboardRecord = {
        _id: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'image',
        content: originalPath,
        preview: `图片 (${metadata.width}x${metadata.height})`,
        thumbnail: thumbnailPath,
        originalPath: originalPath,
        hash,
        timestamp: Date.now(),
        metadata,
      };

      return record;
    } catch (error) {
      console.error('图片处理失败:', error);
      return null;
    }
  }
}

// ==================== 剪贴板监听器 ====================

class ClipboardWatcher {
  private lastTextHash: string = '';
  private lastImageHash: string = '';
  private isMonitoring: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private textHandler = new TextHandler();
  private imageHandler = new ImageHandler();

  /**
   * 开始监听
   */
  async start(): Promise<void> {
    if (this.isMonitoring) {
      console.log('监听已在运行');
      return;
    }

    this.isMonitoring = true;
    console.log('开始监听剪贴板...');

    // 初始化文件管理器
    await fileManager.init();

    // 启动定时检查
    this.intervalId = setInterval(
      () => this.checkClipboard(),
      ClipboardConfig.pollingInterval
    );
  }

  /**
   * 停止监听
   */
  async stop(): Promise<void> {
    if (!this.isMonitoring) {
      console.log('监听未在运行');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isMonitoring = false;
    console.log('停止监听剪贴板');
  }

  /**
   * 获取监听状态
   */
  async isRunning(): Promise<boolean> {
    return this.isMonitoring;
  }

  /**
   * 重置内部状态（用于清空历史后重新开始计数）
   */
  resetHistory(): void {
    this.lastTextHash = '';
    this.lastImageHash = '';
  }

  /**
   * 检查剪贴板变化
   */
  private async checkClipboard(): Promise<void> {
    try {
      // 检查文本
      const hasText = await naimo.clipboard.hasText();
      if (hasText) {
        const text = await naimo.clipboard.readText();
        if (text) {
          // 计算文本 hash 来检测变化
          const textHash = crypto
            .createHash('md5')
            .update(text)
            .digest('hex');

          if (textHash !== this.lastTextHash) {
            this.lastTextHash = textHash;
            await this.handleTextChange(text);
          }
        }
      }

      // 检查图片
      const hasImage = await naimo.clipboard.hasImage();
      if (hasImage) {
        const imageData = await naimo.clipboard.readImage();
        if (imageData) {
          // 计算图片 hash 来检测变化
          const imageHash = crypto
            .createHash('md5')
            .update(imageData)
            .digest('hex');

          if (imageHash !== this.lastImageHash) {
            this.lastImageHash = imageHash;
            await this.handleImageChange(imageData);
          }
        }
      }
    } catch (error) {
      console.error('检查剪贴板失败:', error);
    }
  }

  /**
   * 处理文本变化
   */
  private async handleTextChange(text: string): Promise<void> {
    try {
      console.log('检测到文本变化');

      // 检查敏感词
      if (ClipboardConfig.sensitiveKeywords.length > 0) {
        const hasSensitive = ClipboardConfig.sensitiveKeywords.some(keyword =>
          text.toLowerCase().includes(keyword.toLowerCase())
        );
        if (hasSensitive) {
          console.log('包含敏感词,跳过保存');
          return;
        }
      }

      const record = await this.textHandler.handle(text);
      if (record) {
        await dbManager.saveRecord(record);
        console.log('文本已保存');

        // 通知前端更新
        this.notifyUI();
      }
    } catch (error) {
      console.error('处理文本变化失败:', error);
    }
  }

  /**
   * 处理图片变化
   */
  private async handleImageChange(imageData: string): Promise<void> {
    try {
      console.log('检测到图片变化');

      const record = await this.imageHandler.handle(imageData);
      if (record) {
        await dbManager.saveRecord(record);
        console.log('图片已保存');

        // 通知前端更新
        this.notifyUI();
      }
    } catch (error) {
      console.error('处理图片变化失败:', error);
    }
  }

  /**
   * 通知 UI 更新
   */
  private notifyUI(): void {
    // 触发自定义事件通知前端
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('clipboard-updated'));
    }
  }
}

// ==================== 全局实例 ====================

const clipboardWatcher = new ClipboardWatcher();

// ==================== 暴露 API ====================

const clipboardHistoryAPI = {
  // ==================== 监听控制 ====================
  startMonitoring: async (): Promise<void> => {
    await clipboardWatcher.start();
  },

  stopMonitoring: async (): Promise<void> => {
    await clipboardWatcher.stop();
  },

  isMonitoring: async (): Promise<boolean> => {
    return await clipboardWatcher.isRunning();
  },

  // ==================== 数据查询 ====================
  queryRecords: async (options: QueryOptions): Promise<ClipboardRecord[]> => {
    return await dbManager.queryRecords(options);
  },

  searchRecords: async (keyword: string): Promise<ClipboardRecord[]> => {
    return await dbManager.searchRecords(keyword);
  },

  getRecord: async (id: string): Promise<ClipboardRecord | null> => {
    return await dbManager.getRecord(id);
  },

  // ==================== 数据操作 ====================
  deleteRecord: async (id: string): Promise<boolean> => {
    try {
      const record = await dbManager.getRecord(id);
      if (!record) return false;

      // 删除数据库记录
      const deleted = await dbManager.deleteRecord(id);
      if (!deleted) return false;

      // 删除文件
      if (record.type === 'image') {
        if (record.originalPath) {
          await fileManager.deleteFile(record.originalPath);
        }
        if (record.thumbnail) {
          await fileManager.deleteFile(record.thumbnail);
        }
      }

      return true;
    } catch (error) {
      console.error('删除记录失败:', error);
      return false;
    }
  },

  clearAll: async (): Promise<boolean> => {
    try {
      console.log('开始执行清空操作...');

      // 先清空数据库记录及相关文件
      console.log('开始清空数据库记录及相关文件');
      const dbCleared = await dbManager.clearAll();
      console.log('数据库清空结果:', dbCleared);

      // 再清空系统剪贴板，避免旧内容立刻再次被监听到
      console.log('开始清空系统剪贴板');
      const clipboardCleared = await naimo.clipboard.clear();
      console.log('系统剪贴板清空结果:', clipboardCleared);

      // 重置监听器内部状态
      console.log('开始重置剪贴板监听器历史状态');
      clipboardWatcher.resetHistory();
      console.log('剪贴板监听器历史状态已重置');

      const result = dbCleared && clipboardCleared;
      console.log('清空操作最终结果:', result);
      return result;
    } catch (error) {
      console.error('清空失败:', error);
      return false;
    }
  },

  // ==================== 图片操作 ====================
  getFullImage: async (originalPath: string): Promise<string> => {
    try {
      // 使用 naimo.system.getLocalImage 获取本地图片的 base64
      const base64Data = await naimo.system.getLocalImage(originalPath);
      // 添加 data URL 前缀
      return `data:image/png;base64,${base64Data}`;
    } catch (error) {
      console.error('获取图片失败:', error);
      throw error;
    }
  },

  getThumbnail: async (thumbnailPath: string): Promise<string> => {
    try {
      // 使用 naimo.system.getLocalImage 获取缩略图的 base64
      const base64Data = await naimo.system.getLocalImage(thumbnailPath);
      // 添加 data URL 前缀
      return `data:image/png;base64,${base64Data}`;
    } catch (error) {
      console.error('获取缩略图失败:', error);
      throw error;
    }
  },

  copyFullImage: async (originalPath: string): Promise<boolean> => {
    try {
      // 使用 naimo.system.getLocalImage 获取图片
      const base64Data = await naimo.system.getLocalImage(originalPath);
      // 复制到剪贴板时需要添加前缀
      await naimo.clipboard.writeImage(`data:image/png;base64,${base64Data}`);
      return true;
    } catch (error) {
      console.error('复制图片失败:', error);
      return false;
    }
  },

  copyText: async (text: string): Promise<boolean> => {
    try {
      await naimo.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('复制文本失败:', error);
      return false;
    }
  },

  // ==================== 去重检查 ====================
  checkDuplicate: async (hash: string): Promise<boolean> => {
    return await dbManager.checkDuplicate(hash);
  },

  // ==================== 配置相关 ====================
  getConfig: async (): Promise<typeof ClipboardConfig> => {
    return ClipboardConfig;
  },
};

contextBridge.exposeInMainWorld('clipboardAPI', clipboardHistoryAPI);

// ==================== 功能处理器导出 ====================

const handlers = {
  clipboard: {
    onEnter: async (params: any) => {
      console.log('剪贴板历史管理器启动');

      // 自动开始监听
      if (ClipboardConfig.autoStartMonitoring) {
        await clipboardWatcher.start();
      }

      // 发送日志
      if (typeof window !== 'undefined' && (window as any).naimo) {
        (window as any).naimo.log.info('剪贴板历史管理器已加载', { params });
      }
    },
  },
};

// 使用 CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = handlers;
}

// ==================== 初始化 ====================

window.addEventListener('DOMContentLoaded', () => {
  console.log('剪贴板历史管理器 Preload 已初始化');
});

// ==================== 类型扩展 ====================

declare global {
  const clipboardAPI: typeof clipboardHistoryAPI;
}
