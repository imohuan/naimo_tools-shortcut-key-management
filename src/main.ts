/// <reference path="../typings/naimo.d.ts" />

import './style.css';
import svgIconsHtml from './svg-icons.html?raw';
import { ClipboardConfig } from './config';

// ==================== 类型定义 ====================

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

// ==================== 动态样式生成 ====================

/**
 * 根据配置动态生成 CSS 样式
 */
function injectDynamicStyles(): void {
  const config = ClipboardConfig;
  const { imageItem, listItemStyle, virtualScrollItemHeight, virtualScrollImageItemHeight } = config;

  const styleElement = document.createElement('style');
  styleElement.id = 'dynamic-clipboard-styles';
  styleElement.textContent = `
    /* 动态生成的样式 - 基于 config.ts 配置 */
    
    /* 文本/文件列表项 */
    .list-item {
      height: ${virtualScrollItemHeight}px !important;
      padding: ${listItemStyle.padding}px !important;
      border-radius: ${listItemStyle.borderRadius}px !important;
      box-sizing: border-box !important;
    }
    
    /* 图片列表项 */
    .list-item-image {
      height: ${virtualScrollImageItemHeight}px !important;
      box-sizing: border-box !important;
    }
    
    /* 图片预览区域 */
    .item-image-preview {
      height: ${imageItem.previewHeight}px !important;
      flex-shrink: 0 !important;
    }
    
    /* 图片信息栏 */
    .item-image-info {
      height: ${imageItem.infoBarHeight}px !important;
      padding: ${Math.floor(listItemStyle.padding * 1.25)}px ${listItemStyle.padding}px !important;
      flex-shrink: 0 !important;
      box-sizing: border-box !important;
    }
  `;

  document.head.appendChild(styleElement);
}

// ==================== 虚拟滚动列表类 ====================

// 图片缓存
const imageCache = new Map<string, string>();

class VirtualList {
  private wrapper: HTMLElement;
  private content: HTMLElement;
  private items: ClipboardRecord[] = [];
  private visibleItems: ClipboardRecord[] = [];
  private itemHeight: number = ClipboardConfig.virtualScrollItemHeight;
  private imageItemHeight: number = ClipboardConfig.virtualScrollImageItemHeight;
  private itemGap: number = ClipboardConfig.virtualScrollItemGap;
  private containerPadding: number = ClipboardConfig.virtualScrollContainerPadding;
  private visibleCount: number = 0;
  private startIndex: number = 0;
  private scrollTop: number = 0;
  private bufferSize: number = ClipboardConfig.virtualScrollBufferSize;

  constructor(_containerId: string) {
    this.wrapper = document.getElementById('listWrapper')!;
    this.content = document.getElementById('listContent')!;

    this.init();
  }

  private init(): void {
    // 计算可见数量
    this.calculateVisibleCount();

    // 监听滚动
    this.wrapper.addEventListener('scroll', this.handleScroll.bind(this));

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.calculateVisibleCount();
      this.render();
    });
  }

  private getItemHeight(record: ClipboardRecord): number {
    return record.type === 'image' ? this.imageItemHeight : this.itemHeight;
  }

  private getItemOffset(index: number): number {
    let offset = this.containerPadding; // 从顶部间距开始
    for (let i = 0; i < index; i++) {
      offset += this.getItemHeight(this.items[i]) + this.itemGap;
    }
    return offset;
  }

  private calculateVisibleCount(): void {
    const containerHeight = this.wrapper.clientHeight;
    this.visibleCount = Math.ceil(containerHeight / this.itemHeight) + this.bufferSize * 2;
  }

  private handleScroll(): void {
    this.scrollTop = this.wrapper.scrollTop;

    // 根据每项的实际位置计算 startIndex
    this.startIndex = 0;
    for (let i = 0; i < this.items.length; i++) {
      const itemTop = this.getItemOffset(i);
      const itemBottom = itemTop + this.getItemHeight(this.items[i]);

      // 找到第一个底部位置在可见区域内的项
      if (itemBottom >= this.scrollTop) {
        this.startIndex = i;
        break;
      }
    }

    this.render();
  }

  setData(items: ClipboardRecord[]): void {
    this.items = items;
    this.updateContainerHeight();
    this.render();
  }

  private updateContainerHeight(): void {
    let totalHeight = this.containerPadding; // 顶部间距

    for (let i = 0; i < this.items.length; i++) {
      totalHeight += this.getItemHeight(this.items[i]);
      if (i < this.items.length - 1) {
        totalHeight += this.itemGap; // 最后一项后面不加间隔
      }
    }

    totalHeight += this.containerPadding; // 底部间距
    this.content.style.height = `${totalHeight}px`;
  }

  private render(): void {
    // 计算可见范围
    const start = Math.max(0, this.startIndex - this.bufferSize);
    const end = Math.min(
      this.items.length,
      this.startIndex + this.visibleCount + this.bufferSize
    );

    this.visibleItems = this.items.slice(start, end);

    // 清空内容
    this.content.innerHTML = '';

    // 渲染可见项
    this.visibleItems.forEach((item, index) => {
      const actualIndex = start + index;
      const element = this.createItemElement(item, actualIndex);
      this.content.appendChild(element);
    });
  }

  private createItemElement(record: ClipboardRecord, index: number): HTMLElement {
    const div = document.createElement('div');
    div.className = `list-item ${record.type === 'image' ? 'list-item-image' : ''}`;
    const offset = this.getItemOffset(index);
    div.style.transform = `translateY(${offset}px)`;
    div.dataset.id = record._id;

    // 根据类型创建不同的布局
    if (record.type === 'image') {
      // 图片类型：整个显示图片预览
      const imagePreview = document.createElement('div');
      imagePreview.className = 'item-image-preview';

      if (record.thumbnail) {
        const img = document.createElement('img');
        img.alt = '图片预览';
        img.className = 'preview-image';

        // 检查缓存
        const cachedImage = imageCache.get(record.thumbnail);
        if (cachedImage) {
          img.src = cachedImage;
        } else {
          img.style.opacity = '0.3';

          clipboardAPI.getThumbnail(record.thumbnail).then((base64Data) => {
            imageCache.set(record.thumbnail!, base64Data);

            if (img.isConnected) {
              img.src = base64Data;
              img.style.opacity = '1';
            }
          }).catch((error) => {
            console.error('加载缩略图失败:', error);
            if (imagePreview.isConnected) {
              const iconWrapper = document.createElement('div');
              iconWrapper.className = 'image-load-error';
              iconWrapper.innerHTML = '<svg class="error-icon"><use href="#icon-image"></use></svg><span>图片加载失败</span>';
              imagePreview.innerHTML = '';
              imagePreview.appendChild(iconWrapper);
            }
          });
        }

        imagePreview.appendChild(img);

        // 点击图片打开预览
        imagePreview.addEventListener('click', (e) => {
          e.stopPropagation();
          app.showImagePreview(record);
        });
        imagePreview.style.cursor = 'pointer';
      }

      // 图片元信息（时间 + 操作按钮）
      const imageInfo = document.createElement('div');
      imageInfo.className = 'item-image-info';

      const timeSpan = document.createElement('span');
      timeSpan.className = 'item-time';
      timeSpan.innerHTML = `<svg class="time-icon"><use href="#icon-time"></use></svg><span>${this.formatTime(record.timestamp)}</span>`;

      const actions = document.createElement('div');
      actions.className = 'item-actions';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'item-action-btn copy';
      copyBtn.innerHTML = '<svg><use href="#icon-copy"></use></svg>';
      copyBtn.title = '复制';
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        app.copyRecord(record, copyBtn);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'item-action-btn delete';
      deleteBtn.innerHTML = '<svg><use href="#icon-delete"></use></svg>';
      deleteBtn.title = '删除';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        app.deleteRecord(record._id);
      });

      actions.appendChild(copyBtn);
      actions.appendChild(deleteBtn);

      imageInfo.appendChild(timeSpan);
      imageInfo.appendChild(actions);

      div.appendChild(imagePreview);
      div.appendChild(imageInfo);
    } else {
      // 文本和文件类型：原有布局但不显示图标
      const content = document.createElement('div');
      content.className = 'item-content';

      const preview = document.createElement('div');
      preview.className = 'item-preview';
      preview.textContent = record.preview;

      const meta = document.createElement('div');
      meta.className = 'item-meta';

      const timeSpan = document.createElement('span');
      timeSpan.className = 'item-time';
      timeSpan.innerHTML = `<svg class="time-icon"><use href="#icon-time"></use></svg><span>${this.formatTime(record.timestamp)}</span>`;

      meta.appendChild(timeSpan);

      content.appendChild(preview);
      content.appendChild(meta);

      // 操作按钮
      const actions = document.createElement('div');
      actions.className = 'item-actions';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'item-action-btn copy';
      copyBtn.innerHTML = '<svg><use href="#icon-copy"></use></svg>';
      copyBtn.title = '复制';
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        app.copyRecord(record, copyBtn);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'item-action-btn delete';
      deleteBtn.innerHTML = '<svg><use href="#icon-delete"></use></svg>';
      deleteBtn.title = '删除';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        app.deleteRecord(record._id);
      });

      actions.appendChild(copyBtn);
      actions.appendChild(deleteBtn);

      div.appendChild(content);
      div.appendChild(actions);
    }

    return div;
  }

  private formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}

// ==================== 图片预览弹窗类 ====================

class ImagePreviewModal {
  private modal: HTMLElement;
  private previewImage: HTMLImageElement;
  private currentRecord: ClipboardRecord | null = null;

  constructor() {
    this.modal = document.getElementById('imagePreviewModal')!;
    this.previewImage = document.getElementById('previewImage')! as HTMLImageElement;

    this.init();
  }

  private init(): void {
    // 关闭按钮
    document.getElementById('closeModal')!.addEventListener('click', () => {
      this.hide();
    });

    // 点击遮罩层关闭
    this.modal.querySelector('.modal-overlay')!.addEventListener('click', () => {
      this.hide();
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.hide();
      }
    });

    // 复制图片按钮
    document.getElementById('copyImageBtn')!.addEventListener('click', async (e) => {
      if (this.currentRecord && this.currentRecord.originalPath) {
        const btn = e.currentTarget as HTMLButtonElement;
        await app.copyFullImage(this.currentRecord.originalPath, btn);
        setTimeout(() => {
          this.hide();
        }, 1200);
      }
    });

    // 删除图片按钮
    document.getElementById('deleteImageBtn')!.addEventListener('click', async () => {
      if (this.currentRecord) {
        await app.deleteRecord(this.currentRecord._id);
        this.hide();
      }
    });
  }

  async show(record: ClipboardRecord): Promise<void> {
    this.currentRecord = record;

    if (record.originalPath) {
      try {
        // 先显示模态框
        this.modal.classList.add('show');

        // 检查缓存
        const cachedImage = imageCache.get(record.originalPath);
        if (cachedImage) {
          // 使用缓存的完整图片
          this.previewImage.src = cachedImage;
        } else {
          // 显示加载状态
          this.previewImage.style.opacity = '0.3';

          // 加载完整图片
          const imageData = await clipboardAPI.getFullImage(record.originalPath);

          // 保存到缓存
          imageCache.set(record.originalPath, imageData);

          this.previewImage.src = imageData;
          this.previewImage.style.opacity = '1';
        }
      } catch (error) {
        console.error('加载图片失败:', error);
        this.hide();
      }
    }
  }

  hide(): void {
    this.modal.classList.remove('show');
    this.currentRecord = null;
    this.previewImage.src = '';
  }
}

// ==================== 应用主类 ====================

class ClipboardHistoryApp {
  private virtualList: VirtualList;
  private imagePreview: ImagePreviewModal;
  private currentFilter: string = 'all';
  private currentSearchKeyword: string = '';
  private searchDebounceTimer: number | null = null;
  private allRecords: ClipboardRecord[] = [];

  constructor() {
    this.virtualList = new VirtualList('listContainer');
    this.imagePreview = new ImagePreviewModal();

    this.init();
  }

  private async init(): Promise<void> {
    console.log('剪贴板历史管理器初始化...');

    // 初始化 UI 事件
    this.initUIEvents();

    // 监听剪贴板更新事件
    window.addEventListener('clipboard-updated', () => {
      this.loadRecords();
    });

    // 加载初始数据
    await this.loadRecords();

    // 自动启动监听（根据配置）
    const config = await clipboardAPI.getConfig();
    if (config.autoStartMonitoring) {
      const isMonitoring = await clipboardAPI.isMonitoring();
      if (!isMonitoring) {
        console.log('自动启动剪贴板监听...');
        await clipboardAPI.startMonitoring();
      }
    }

    // 更新监听状态
    await this.updateMonitoringStatus();

    naimo.log.info('剪贴板历史管理器初始化完成');
  }

  private initUIEvents(): void {
    // 搜索框
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    searchInput.addEventListener('input', (e) => {
      const keyword = (e.target as HTMLInputElement).value;
      this.handleSearch(keyword);
    });

    // 分类筛选按钮
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const type = target.dataset.type!;

        // 更新按钮状态
        filterBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        // 更新筛选
        this.currentFilter = type;
        this.applyFilter();
      });
    });

    // 监听开关
    document.getElementById('monitorToggle')!.addEventListener('click', async () => {
      const isMonitoring = await clipboardAPI.isMonitoring();
      if (isMonitoring) {
        await clipboardAPI.stopMonitoring();
      } else {
        await clipboardAPI.startMonitoring();
      }
      await this.updateMonitoringStatus();
    });

    // 清空按钮
    document.getElementById('clearAllBtn')!.addEventListener('click', async () => {
      const confirmed = confirm('确定要清空所有剪贴板记录吗？此操作不可恢复！');
      if (confirmed) {
        await this.clearAll();
      }
    });
  }

  private handleSearch(keyword: string): void {
    this.currentSearchKeyword = keyword;

    // 防抖
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = window.setTimeout(async () => {
      if (keyword.trim()) {
        const results = await clipboardAPI.searchRecords(keyword);
        this.allRecords = results;
      } else {
        await this.loadRecords();
      }
      this.applyFilter();
    }, 300);
  }

  private applyFilter(): void {
    let filtered = this.allRecords;

    // 按类型筛选
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(record => record.type === this.currentFilter);
    }

    // 更新列表
    this.updateList(filtered);

    // 更新统计信息
    this.updateStats(filtered.length);
  }

  async loadRecords(): Promise<void> {
    try {
      const records = await clipboardAPI.queryRecords({
        limit: 1000,
        sortBy: 'timestamp',
        order: 'desc',
      });

      this.allRecords = records;
      this.applyFilter();
    } catch (error) {
      console.error('加载记录失败:', error);
    }
  }

  private updateList(records: ClipboardRecord[]): void {
    const emptyState = document.getElementById('emptyState')!;

    if (records.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }

    this.virtualList.setData(records);
  }

  private updateStats(count: number): void {
    const recordCount = document.getElementById('recordCount')!;
    const filterInfo = document.getElementById('filterInfo')!;

    recordCount.textContent = `共 ${count} 条记录`;

    let filterText = '显示全部';
    if (this.currentFilter === 'text') {
      filterText = '显示文本';
    } else if (this.currentFilter === 'image') {
      filterText = '显示图片';
    } else if (this.currentFilter === 'file') {
      filterText = '显示文件';
    }

    if (this.currentSearchKeyword) {
      filterText += ` · 搜索: ${this.currentSearchKeyword}`;
    }

    filterInfo.textContent = filterText;
  }

  private async updateMonitoringStatus(): Promise<void> {
    const btn = document.getElementById('monitorToggle')!;
    const isMonitoring = await clipboardAPI.isMonitoring();

    if (isMonitoring) {
      btn.classList.add('monitoring');
      btn.innerHTML = '<svg class="btn-icon"><use href="#icon-monitoring"></use></svg><span>监听中</span>';
    } else {
      btn.classList.remove('monitoring');
      btn.innerHTML = '<svg class="btn-icon"><use href="#icon-pause"></use></svg><span>已暂停</span>';
    }
  }

  async showImagePreview(record: ClipboardRecord): Promise<void> {
    await this.imagePreview.show(record);
  }

  async copyRecord(record: ClipboardRecord, buttonElement?: HTMLButtonElement): Promise<void> {
    // 保存原始状态
    let originalHTML = '';
    if (buttonElement) {
      originalHTML = buttonElement.innerHTML;
    }

    try {
      if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.classList.add('copying');
        buttonElement.innerHTML = '<svg><use href="#icon-check"></use></svg>';
      }

      if (record.type === 'text') {
        await clipboardAPI.copyText(record.content);
      } else if (record.type === 'image' && record.originalPath) {
        await clipboardAPI.copyFullImage(record.originalPath);
      }

      // 恢复按钮状态
      if (buttonElement) {
        setTimeout(() => {
          buttonElement.disabled = false;
          buttonElement.classList.remove('copying');
          buttonElement.innerHTML = originalHTML;
        }, 1000);
      }
    } catch (error) {
      console.error('复制失败:', error);
      // 恢复按钮状态
      if (buttonElement) {
        buttonElement.disabled = false;
        buttonElement.classList.remove('copying');
        buttonElement.innerHTML = originalHTML;
      }
    }
  }

  async copyFullImage(originalPath: string, buttonElement?: HTMLButtonElement): Promise<void> {
    // 保存原始状态
    let originalHTML = '';
    if (buttonElement) {
      originalHTML = buttonElement.innerHTML;
    }

    try {
      if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.classList.add('copying');
        buttonElement.innerHTML = '<svg class="btn-icon"><use href="#icon-check"></use></svg><span>已复制</span>';
      }

      await clipboardAPI.copyFullImage(originalPath);

      // 恢复按钮状态
      if (buttonElement) {
        setTimeout(() => {
          buttonElement.disabled = false;
          buttonElement.classList.remove('copying');
          buttonElement.innerHTML = originalHTML;
        }, 1000);
      }
    } catch (error) {
      console.error('复制图片失败:', error);
      // 恢复按钮状态
      if (buttonElement) {
        buttonElement.disabled = false;
        buttonElement.classList.remove('copying');
        buttonElement.innerHTML = originalHTML;
      }
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      // 先从缓存中移除相关图片
      const record = this.allRecords.find(r => r._id === id);
      if (record && record.type === 'image') {
        if (record.thumbnail) {
          imageCache.delete(record.thumbnail);
        }
        if (record.originalPath) {
          imageCache.delete(record.originalPath);
        }
      }

      const success = await clipboardAPI.deleteRecord(id);
      if (success) {
        await this.loadRecords();
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      const success = await clipboardAPI.clearAll();
      if (success) {
        // 清空图片缓存
        imageCache.clear();

        await this.loadRecords();
      }
    } catch (error) {
      console.error('清空失败:', error);
    }
  }
}

// ==================== 热重载 ====================

if (import.meta.hot) {
  // 监听 preload 文件变化事件
  import.meta.hot.on('preload-changed', async (data) => {
    console.log('📝 检测到 preload 变化:', data);
    console.log('🔨 正在触发 preload 构建...');
    try {
      const response = await fetch('/__preload_build');
      const result = await response.json();
      if (result.success) {
        console.log('✅ Preload 构建完成');
        await window.naimo.hot();
        console.log('🔄 Preload 热重载完成');
        location.reload();
      } else {
        console.error('❌ Preload 构建失败');
      }
    } catch (error) {
      console.error('❌ 触发 preload 构建失败:', error);
    }
  });
}

// ==================== 全局实例 ====================

let app: ClipboardHistoryApp;

// ==================== 入口 ====================

async function initApp(): Promise<void> {
  try {
    // 注入动态样式
    injectDynamicStyles();

    // 加载 SVG 图标
    const svgIconsContainer = document.getElementById('svg-icons');
    if (svgIconsContainer) {
      svgIconsContainer.innerHTML = svgIconsHtml;
    }

    app = new ClipboardHistoryApp();
  } catch (error) {
    console.error('应用初始化失败:', error);
    naimo.log.error('应用初始化失败', error);
  }
}

// 等待 DOM 加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}


window.addEventListener('keydown', (e) => {
  console.log(e.key);
  e.preventDefault();
  e.stopPropagation();
});
document.addEventListener('keydown', (e) => {
  console.log(e.key);
  e.preventDefault();
  e.stopPropagation();
});