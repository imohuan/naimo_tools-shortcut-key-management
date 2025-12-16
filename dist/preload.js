"use strict";
const electron = require("electron");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const crypto__namespace = /* @__PURE__ */ _interopNamespaceDefault(crypto);
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const ClipboardConfig = {
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
  databaseName: "clipboard_history",
  // 图片存储文件夹名称（相对于 userData 目录）
  imagesFolderName: "clipboard_images",
  // 最大存储记录数
  // 超过此数量后会自动删除最旧的记录
  // 设置为 0 表示不限制
  maxRecords: 1e3,
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
  thumbnailFormat: "png",
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
  supportedImageFormats: ["png", "jpg", "jpeg", "gif", "bmp", "webp"],
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
  virtualScrollItemGap: 6,
  // 虚拟滚动 - 容器上下边距（像素）
  virtualScrollContainerPadding: 12,
  // 图片项配置
  imageItem: {
    // 图片预览区域高度（像素）
    previewHeight: 180,
    // 图片信息栏高度（像素）
    infoBarHeight: 50
  },
  // 列表项样式配置
  listItemStyle: {
    // 文本/文件项内边距（像素）
    padding: 8,
    // 边框圆角（像素）
    borderRadius: 8
  },
  // 列表显示配置
  list: {
    // 文本预览最大长度（字符）
    textPreviewMaxLength: 100,
    // 是否显示时间戳
    showTimestamp: true,
    // 时间格式
    // 可选值：'relative' (相对时间，如"3分钟前") | 'absolute' (绝对时间，如"2023-10-12 14:30")
    timeFormat: "absolute"
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
    minZoomScale: 0.5
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
  filePrefix: "clipboard",
  // 时间戳格式
  // 格式说明：YYYY-年, MM-月, DD-日, HH-时, mm-分, ss-秒
  timestampFormat: "YYYYMMDD_HHmmss",
  /**
   * ==================== 隐私与安全配置 ====================
   */
  // 是否启用数据加密
  // 注意：启用后会影响性能
  enableEncryption: false,
  // 应用黑名单
  // 这些应用的剪贴板内容不会被监听
  // 示例：['chrome.exe', 'firefox.exe']
  appBlacklist: [],
  // 敏感词过滤
  // 包含这些关键词的内容不会被保存
  // 示例：['password', '密码', 'secret']
  sensitiveKeywords: [],
  /**
   * ==================== 调试配置 ====================
   */
  // 是否启用调试模式
  debugMode: false,
  // 是否在控制台打印日志
  enableConsoleLog: true,
  // 日志级别
  // 可选值：'debug' | 'info' | 'warn' | 'error'
  logLevel: "info"
};
class FileManager {
  imagesDir = "";
  initialized = false;
  /**
   * 初始化文件管理器
   */
  async init() {
    if (this.initialized) return;
    try {
      const userDataPath = await naimo.system.getPath("userData");
      this.imagesDir = path__namespace.join(userDataPath, ClipboardConfig.imagesFolderName);
      if (!fs__namespace.existsSync(this.imagesDir)) {
        fs__namespace.mkdirSync(this.imagesDir, { recursive: true });
      }
      this.initialized = true;
      console.log("文件管理器初始化成功:", this.imagesDir);
    } catch (error) {
      console.error("文件管理器初始化失败:", error);
      throw error;
    }
  }
  /**
   * 生成时间戳文件名
   */
  generateTimestamp() {
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}_${hour}${minute}${second}`;
  }
  /**
   * 保存图片并生成缩略图
   */
  async saveImageWithThumbnail(base64Data, prefix) {
    await this.init();
    const timestamp = this.generateTimestamp();
    const originalName = `${prefix}_image_${timestamp}.png`;
    const thumbnailName = `${prefix}_thumb_${timestamp}.png`;
    const originalPath = path__namespace.join(this.imagesDir, originalName);
    const thumbnailPath = path__namespace.join(this.imagesDir, thumbnailName);
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");
    const hash = crypto__namespace.createHash("md5").update(buffer).digest("hex");
    await fs__namespace.promises.writeFile(originalPath, buffer);
    const { thumbnail, thumbnailWidth, thumbnailHeight, originalWidth, originalHeight } = await this.generateThumbnail(buffer);
    await fs__namespace.promises.writeFile(thumbnailPath, thumbnail);
    return {
      originalPath,
      thumbnailPath,
      hash,
      metadata: {
        width: originalWidth,
        height: originalHeight,
        thumbnailWidth,
        thumbnailHeight
      }
    };
  }
  /**
   * 生成缩略图
   */
  async generateThumbnail(imageBuffer) {
    const originalWidth = 1920;
    const originalHeight = 1080;
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
    return {
      thumbnail: imageBuffer,
      thumbnailWidth,
      thumbnailHeight,
      originalWidth,
      originalHeight
    };
  }
  /**
   * 读取图片文件为 base64
   */
  async readImageAsBase64(filePath) {
    try {
      const buffer = await fs__namespace.promises.readFile(filePath);
      return `data:image/png;base64,${buffer.toString("base64")}`;
    } catch (error) {
      console.error("读取图片失败:", error);
      throw error;
    }
  }
  /**
   * 删除文件
   */
  async deleteFile(filePath) {
    try {
      if (fs__namespace.existsSync(filePath)) {
        await fs__namespace.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("删除文件失败:", error);
      return false;
    }
  }
  /**
   * 获取图片目录路径
   */
  getImagesDirectory() {
    return this.imagesDir;
  }
}
class JsonlStorageManager {
  filePath = "";
  initialized = false;
  /**
   * 初始化存储文件路径
   */
  async init() {
    if (this.initialized) return;
    const userDataPath = await naimo.system.getPath("userData");
    this.filePath = path__namespace.join(userDataPath, "db", "clipboard_history.jsonl");
    if (!fs__namespace.existsSync(this.filePath)) {
      fs__namespace.writeFileSync(this.filePath, "", "utf8");
    }
    this.initialized = true;
  }
  /**
   * 追加一条记录到 JSONL 文件
   * 只写入必要字段，便于手动查看和处理
   */
  async appendRecord(record) {
    await this.init();
    const minimal = {
      _id: record._id,
      type: record.type,
      content: record.content,
      preview: record.preview,
      thumbnail: record.thumbnail,
      originalPath: record.originalPath,
      hash: record.hash,
      timestamp: record.timestamp
    };
    const line = JSON.stringify(minimal) + "\n";
    await fs__namespace.promises.appendFile(this.filePath, line, "utf8");
  }
  /**
   * 读取所有记录
   */
  async readAllRecords() {
    await this.init();
    try {
      const content = await fs__namespace.promises.readFile(this.filePath, "utf8");
      if (!content.trim()) return [];
      const lines = content.split("\n").filter((line) => line.trim().length > 0);
      const records = [];
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          const record = {
            _id: data._id || data.hash,
            type: data.type,
            content: data.content,
            preview: data.preview,
            thumbnail: data.thumbnail,
            originalPath: data.originalPath,
            hash: data.hash,
            timestamp: data.timestamp ?? Date.now()
          };
          records.push(record);
        } catch (e) {
          console.error("解析 JSONL 行失败，已跳过:", e);
        }
      }
      return records;
    } catch (error) {
      console.error("读取 JSONL 文件失败:", error);
      return [];
    }
  }
  /**
   * 根据 _id 删除记录（重写整个 JSONL 文件）
   */
  async deleteById(id) {
    await this.init();
    try {
      const content = await fs__namespace.promises.readFile(this.filePath, "utf8");
      const lines = content.split("\n").filter((line) => line.trim().length > 0);
      let changed = false;
      const keptLines = [];
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data._id === id) {
            changed = true;
            continue;
          }
          keptLines.push(JSON.stringify(data));
        } catch {
          keptLines.push(line);
        }
      }
      if (changed) {
        const newContent = keptLines.length ? keptLines.join("\n") + "\n" : "";
        await fs__namespace.promises.writeFile(this.filePath, newContent, "utf8");
      }
      return changed;
    } catch (error) {
      console.error("删除 JSONL 记录失败:", error);
      return false;
    }
  }
  /**
   * 清空所有记录
   */
  async clearAll() {
    await this.init();
    try {
      await fs__namespace.promises.writeFile(this.filePath, "", "utf8");
      return true;
    } catch (error) {
      console.error("清空 JSONL 文件失败:", error);
      return false;
    }
  }
}
class DatabaseManager {
  // 不再使用 naimo.db，而是使用 JSONL 文件来存储记录
  storage = new JsonlStorageManager();
  /**
   * 保存记录
   */
  async saveRecord(record) {
    try {
      await this.storage.appendRecord(record);
      return {
        ok: true,
        id: record._id
      };
    } catch (error) {
      console.error("保存记录失败:", error);
      return {
        ok: false,
        error: error.message
      };
    }
  }
  /**
   * 获取单条记录
   */
  async getRecord(id) {
    try {
      const all = await this.storage.readAllRecords();
      const found = all.find((item) => item._id === id) || null;
      return found;
    } catch (error) {
      console.error("获取记录失败:", error);
      return null;
    }
  }
  /**
   * 查询记录
   */
  async queryRecords(options = {}) {
    try {
      const allRecords = await this.storage.readAllRecords();
      const {
        type,
        category,
        limit = 100,
        offset = 0,
        sortBy = "timestamp",
        order = "desc"
      } = options;
      let filtered = allRecords;
      if (type) {
        filtered = filtered.filter((doc) => doc.type === type);
      }
      if (category) {
        filtered = filtered.filter((doc) => doc.category === category);
      }
      filtered.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (order === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      return filtered.slice(offset, offset + limit);
    } catch (error) {
      console.error("查询记录失败:", error);
      return [];
    }
  }
  /**
   * 搜索记录
   */
  async searchRecords(keyword) {
    try {
      if (!keyword.trim()) {
        return await this.queryRecords({ limit: 100 });
      }
      const allRecords = await this.storage.readAllRecords();
      const filtered = allRecords.filter((doc) => {
        const record = doc;
        return record.content?.toLowerCase().includes(keyword.toLowerCase()) || record.preview?.toLowerCase().includes(keyword.toLowerCase()) || record.tags?.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase()));
      });
      return filtered;
    } catch (error) {
      console.error("搜索记录失败:", error);
      return [];
    }
  }
  /**
   * 删除记录
   */
  async deleteRecord(id) {
    try {
      return await this.storage.deleteById(id);
    } catch (error) {
      console.error("删除记录失败:", error);
      return false;
    }
  }
  /**
   * 清空所有记录
   */
  async clearAll() {
    try {
      const allRecords = await this.storage.readAllRecords();
      await Promise.all(
        allRecords.map(async (record) => {
          if (record.type !== "image") return;
          const tasks = [];
          if (record.originalPath) {
            tasks.push(fileManager.deleteFile(record.originalPath));
          }
          if (record.thumbnail) {
            tasks.push(fileManager.deleteFile(record.thumbnail));
          }
          if (tasks.length) {
            await Promise.all(tasks);
          }
        })
      );
      const cleared = await this.storage.clearAll();
      return cleared;
    } catch (error) {
      console.error("清空记录失败:", error);
      return false;
    }
  }
  /**
   * 检查是否存在重复内容
   */
  async checkDuplicate(hash) {
    try {
      const allRecords = await this.storage.readAllRecords();
      const exists = allRecords.some((doc) => {
        const record = doc;
        return record.hash === hash;
      });
      return exists;
    } catch (error) {
      console.error("检查重复失败:", error);
      return false;
    }
  }
  /**
   * 根据 hash 查找并删除旧记录
   */
  async findAndDeleteByHash(hash) {
    try {
      const allRecords = await this.storage.readAllRecords();
      const oldRecord = allRecords.find((record) => record.hash === hash);
      if (oldRecord) {
        await this.storage.deleteById(oldRecord._id);
        console.log("已删除旧记录:", oldRecord._id);
        return oldRecord;
      }
      return null;
    } catch (error) {
      console.error("查找并删除记录失败:", error);
      return null;
    }
  }
}
const fileManager = new FileManager();
const dbManager = new DatabaseManager();
class TextHandler {
  async handle(text) {
    try {
      const hash = crypto__namespace.createHash("md5").update(text).digest("hex");
      if (ClipboardConfig.enableDeduplication) {
        const isDuplicate = await dbManager.checkDuplicate(hash);
        if (isDuplicate) {
          console.log("文本重复，删除旧记录并创建新记录");
          await dbManager.findAndDeleteByHash(hash);
        }
      }
      const preview = text.length > ClipboardConfig.list.textPreviewMaxLength ? text.substring(0, ClipboardConfig.list.textPreviewMaxLength) + "..." : text;
      const record = {
        _id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "text",
        content: text,
        preview,
        hash,
        timestamp: Date.now()
      };
      return record;
    } catch (error) {
      console.error("文本处理失败:", error);
      return null;
    }
  }
}
class ImageHandler {
  async handle(imageData) {
    try {
      const {
        originalPath,
        thumbnailPath,
        hash,
        metadata
      } = await fileManager.saveImageWithThumbnail(
        imageData,
        ClipboardConfig.filePrefix
      );
      if (ClipboardConfig.enableDeduplication) {
        const isDuplicate = await dbManager.checkDuplicate(hash);
        if (isDuplicate) {
          console.log("图片重复，删除旧记录及文件并创建新记录");
          const oldRecord = await dbManager.findAndDeleteByHash(hash);
          if (oldRecord && oldRecord.type === "image") {
            if (oldRecord.originalPath) {
              await fileManager.deleteFile(oldRecord.originalPath);
            }
            if (oldRecord.thumbnail) {
              await fileManager.deleteFile(oldRecord.thumbnail);
            }
          }
        }
      }
      const record = {
        _id: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "image",
        content: originalPath,
        preview: `图片 (${metadata.width}x${metadata.height})`,
        thumbnail: thumbnailPath,
        originalPath,
        hash,
        timestamp: Date.now(),
        metadata
      };
      return record;
    } catch (error) {
      console.error("图片处理失败:", error);
      return null;
    }
  }
}
class ClipboardWatcher {
  lastTextHash = "";
  lastImageHash = "";
  isMonitoring = false;
  intervalId = null;
  textHandler = new TextHandler();
  imageHandler = new ImageHandler();
  /**
   * 开始监听
   */
  async start() {
    if (this.isMonitoring) {
      console.log("监听已在运行");
      return;
    }
    this.isMonitoring = true;
    console.log("开始监听剪贴板...");
    await fileManager.init();
    this.intervalId = setInterval(
      () => this.checkClipboard(),
      ClipboardConfig.pollingInterval
    );
  }
  /**
   * 停止监听
   */
  async stop() {
    if (!this.isMonitoring) {
      console.log("监听未在运行");
      return;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
    console.log("停止监听剪贴板");
  }
  /**
   * 获取监听状态
   */
  async isRunning() {
    return this.isMonitoring;
  }
  /**
   * 重置内部状态（用于清空历史后重新开始计数）
   */
  resetHistory() {
    this.lastTextHash = "";
    this.lastImageHash = "";
  }
  /**
   * 检查剪贴板变化
   */
  async checkClipboard() {
    try {
      const hasText = await naimo.clipboard.hasText();
      if (hasText) {
        const text = await naimo.clipboard.readText();
        if (text) {
          const textHash = crypto__namespace.createHash("md5").update(text).digest("hex");
          if (textHash !== this.lastTextHash) {
            this.lastTextHash = textHash;
            await this.handleTextChange(text);
          }
        }
      }
      const hasImage = await naimo.clipboard.hasImage();
      if (hasImage) {
        const imageData = await naimo.clipboard.readImage();
        if (imageData) {
          const imageHash = crypto__namespace.createHash("md5").update(imageData).digest("hex");
          if (imageHash !== this.lastImageHash) {
            this.lastImageHash = imageHash;
            await this.handleImageChange(imageData);
          }
        }
      }
    } catch (error) {
      console.error("检查剪贴板失败:", error);
    }
  }
  /**
   * 处理文本变化
   */
  async handleTextChange(text) {
    try {
      console.log("检测到文本变化");
      if (ClipboardConfig.sensitiveKeywords.length > 0) {
        const hasSensitive = ClipboardConfig.sensitiveKeywords.some(
          (keyword) => text.toLowerCase().includes(keyword.toLowerCase())
        );
        if (hasSensitive) {
          console.log("包含敏感词,跳过保存");
          return;
        }
      }
      const record = await this.textHandler.handle(text);
      if (record) {
        await dbManager.saveRecord(record);
        console.log("文本已保存");
        this.notifyUI();
      }
    } catch (error) {
      console.error("处理文本变化失败:", error);
    }
  }
  /**
   * 处理图片变化
   */
  async handleImageChange(imageData) {
    try {
      console.log("检测到图片变化");
      const record = await this.imageHandler.handle(imageData);
      if (record) {
        await dbManager.saveRecord(record);
        console.log("图片已保存");
        this.notifyUI();
      }
    } catch (error) {
      console.error("处理图片变化失败:", error);
    }
  }
  /**
   * 通知 UI 更新
   */
  notifyUI() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("clipboard-updated"));
    }
  }
}
const clipboardWatcher = new ClipboardWatcher();
const clipboardHistoryAPI = {
  // ==================== 监听控制 ====================
  startMonitoring: async () => {
    await clipboardWatcher.start();
  },
  stopMonitoring: async () => {
    await clipboardWatcher.stop();
  },
  isMonitoring: async () => {
    return await clipboardWatcher.isRunning();
  },
  // ==================== 数据查询 ====================
  queryRecords: async (options) => {
    return await dbManager.queryRecords(options);
  },
  searchRecords: async (keyword) => {
    return await dbManager.searchRecords(keyword);
  },
  getRecord: async (id) => {
    return await dbManager.getRecord(id);
  },
  // ==================== 数据操作 ====================
  addRecord: async (record) => {
    return await dbManager.saveRecord(record);
  },
  addRecords: async (records) => {
    const results = [];
    for (const record of records) {
      const res = await dbManager.saveRecord(record);
      results.push(res);
    }
    return results;
  },
  deleteRecord: async (id) => {
    try {
      const record = await dbManager.getRecord(id);
      if (!record) return false;
      const deleted = await dbManager.deleteRecord(id);
      if (!deleted) return false;
      if (record.type === "image") {
        if (record.originalPath) {
          await fileManager.deleteFile(record.originalPath);
        }
        if (record.thumbnail) {
          await fileManager.deleteFile(record.thumbnail);
        }
      }
      return true;
    } catch (error) {
      console.error("删除记录失败:", error);
      return false;
    }
  },
  clearAll: async () => {
    try {
      console.log("开始执行清空操作...");
      console.log("开始清空数据库记录及相关文件");
      const dbCleared = await dbManager.clearAll();
      console.log("数据库清空结果:", dbCleared);
      console.log("开始清空系统剪贴板");
      const clipboardCleared = await naimo.clipboard.clear();
      console.log("系统剪贴板清空结果:", clipboardCleared);
      console.log("开始重置剪贴板监听器历史状态");
      clipboardWatcher.resetHistory();
      console.log("剪贴板监听器历史状态已重置");
      const result = dbCleared && clipboardCleared;
      console.log("清空操作最终结果:", result);
      return result;
    } catch (error) {
      console.error("清空失败:", error);
      return false;
    }
  },
  // ==================== 图片操作 ====================
  getFullImage: async (originalPath) => {
    try {
      const base64Data = await naimo.system.getLocalImage(originalPath);
      return `data:image/png;base64,${base64Data}`;
    } catch (error) {
      console.error("获取图片失败:", error);
      throw error;
    }
  },
  getThumbnail: async (thumbnailPath) => {
    try {
      const base64Data = await naimo.system.getLocalImage(thumbnailPath);
      return `data:image/png;base64,${base64Data}`;
    } catch (error) {
      console.error("获取缩略图失败:", error);
      throw error;
    }
  },
  copyFullImage: async (originalPath) => {
    try {
      const base64Data = await naimo.system.getLocalImage(originalPath);
      await naimo.clipboard.writeImage(`data:image/png;base64,${base64Data}`);
      return true;
    } catch (error) {
      console.error("复制图片失败:", error);
      return false;
    }
  },
  copyText: async (text) => {
    try {
      await naimo.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("复制文本失败:", error);
      return false;
    }
  },
  // ==================== 去重检查 ====================
  checkDuplicate: async (hash) => {
    return await dbManager.checkDuplicate(hash);
  },
  // ==================== 配置相关 ====================
  getConfig: async () => {
    return ClipboardConfig;
  }
};
electron.contextBridge.exposeInMainWorld("clipboardAPI", clipboardHistoryAPI);
const handlers = {
  clipboard: {
    onEnter: async (params) => {
      console.log("剪贴板历史管理器启动");
      if (ClipboardConfig.autoStartMonitoring) {
        await clipboardWatcher.start();
      }
      if (typeof window !== "undefined" && window.naimo) {
        window.naimo.log.info("剪贴板历史管理器已加载", { params });
      }
    }
  }
};
if (typeof module !== "undefined" && module.exports) {
  module.exports = handlers;
}
window.addEventListener("DOMContentLoaded", () => {
  console.log("剪贴板历史管理器 Preload 已初始化");
});
