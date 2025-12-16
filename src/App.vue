<template>
  <SvgSprite />

  <div
    class="w-full h-full bg-slate-100 text-slate-900 flex items-stretch justify-center"
  >
    <div class="flex flex-col w-full">
      <div
        class="flex flex-col flex-1 bg-white/95 border border-slate-200/80 shadow-[0_16px_60px_rgba(15,23,42,0.08)] overflow-hidden"
      >
        <!-- 工具栏 -->
        <div
          class="flex items-center gap-3 py-2 px-2 bg-white/95 backdrop-blur border-b border-slate-200 flex-shrink-0 flex-wrap md:flex-nowrap"
        >
          <!-- 搜索框 -->
          <div class="flex-1 max-w-[320px] overflow-hidden w-full md:w-auto">
            <div class="relative flex items-center w-full">
              <svg
                class="w-5 h-5 text-slate-400 flex-shrink-0 absolute left-3 pointer-events-none"
              >
                <use href="#icon-search"></use>
              </svg>
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索剪贴板内容..."
                class="w-full h-10 pl-10 pr-3 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500"
              />
            </div>
          </div>

          <!-- 分类筛选切换（类似对话 / Providers 的切换样式） -->
          <div class="flex justify-center">
            <div
              class="inline-flex items-center gap-1 p-[3px] rounded-md bg-slate-100 border border-slate-200"
            >
              <button
                v-for="btn in filterButtons"
                :key="btn.type"
                class="relative h-8 px-3 rounded-md text-[13px] cursor-pointer transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
                :class="
                  currentFilter === btn.type
                    ? 'bg-white text-indigo-600'
                    : 'bg-transparent text-slate-500 hover:text-slate-900'
                "
                @click="onFilterChange(btn.type)"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
                  :class="
                    currentFilter === btn.type ? 'text-indigo-500' : 'text-slate-400'
                  "
                >
                  <use :href="btn.icon"></use>
                </svg>
                <!-- 只有选中的标签才显示文字 -->
                <span v-if="currentFilter === btn.type" class="hidden sm:inline">
                  {{ btn.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-2 ml-auto">
            <button
              id="monitorToggle"
              class="h-9 px-4 rounded-xl text-[13px] cursor-pointer transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-[0.98]"
              :class="
                isMonitoring
                  ? 'bg-emerald-500 text-white border border-emerald-500 hover:bg-emerald-400'
                  : 'bg-indigo-500 text-white border border-indigo-500 hover:bg-indigo-400'
              "
              @click="toggleMonitoring"
            >
              <svg class="w-4 h-4 flex-shrink-0">
                <use :href="isMonitoring ? '#icon-monitoring' : '#icon-pause'"></use>
              </svg>
              <span>{{ isMonitoring ? "监听中" : "已暂停" }}</span>
            </button>
            <button
              id="clearAllBtn"
              class="h-9 px-4 border border-slate-200 rounded-xl bg-white text-[13px] cursor-pointer transition-all duration-200 flex items-center gap-1.5 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm hover:shadow-md active:scale-[0.98]"
              @click="handleClearAll"
            >
              <svg class="w-4 h-4 flex-shrink-0">
                <use href="#icon-clear"></use>
              </svg>
              <span>清空</span>
            </button>
          </div>
        </div>

        <!-- 统计信息 -->
        <div
          class="flex items-center gap-4 px-4 md:px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-[12px] text-slate-500 flex-shrink-0"
        >
          <span
            id="recordCount"
            class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
          >
            <span
              class="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]"
            ></span>
            <span class="font-medium text-slate-700">
              共 {{ filteredRecords.length }} 条记录
            </span>
          </span>
          <span id="filterInfo" class="flex items-center gap-1.5">
            {{ filterInfoText }}
          </span>
        </div>

        <!-- 列表 + 空状态 -->
        <ClipboardVirtualList
          class="flex-1"
          :items="filteredRecords"
          @copy="copyRecord"
          @delete="deleteRecord"
          @preview-image="showImagePreview"
        >
          <div
            v-if="filteredRecords.length === 0"
            class="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-500"
          >
            <div class="text-6xl mb-4 drop-shadow-[0_18px_25px_rgba(15,23,42,0.25)]">
              📋
            </div>
            <div class="text-lg font-medium text-slate-700 mb-2">暂无剪贴板记录</div>
            <div class="text-sm text-slate-400">复制内容后会自动显示在这里</div>
          </div>
        </ClipboardVirtualList>
      </div>
    </div>
  </div>

  <!-- 图片预览弹窗 -->
  <div
    v-if="previewVisible"
    id="imagePreviewModal"
    class="fixed inset-0 z-[1000] flex items-center justify-center"
  >
    <div
      class="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
      role="button"
      tabindex="-1"
      @click="hidePreview"
    ></div>
    <div
      class="relative w-[90%] max-w-[800px] max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] flex flex-col overflow-hidden"
    >
      <div
        class="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50/80"
      >
        <h3 class="text-lg font-semibold text-slate-900">图片预览</h3>
        <button
          class="w-8 h-8 border-0 bg-transparent cursor-pointer text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          id="closeModal"
          @click="hidePreview"
        >
          <svg class="w-6 h-6">
            <use href="#icon-close"></use>
          </svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-6 bg-white">
        <div
          class="flex items-center justify-center min-h-[300px] bg-slate-50 rounded-xl border border-slate-200"
        >
          <img
            id="previewImage"
            :src="previewImageSrc"
            alt="预览图片"
            class="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div
        class="flex gap-3 justify-end px-6 py-5 border-t border-slate-200 bg-slate-50/80"
      >
        <button
          id="copyImageBtn"
          class="h-10 px-5 border rounded-lg bg-indigo-500 text-white border-indigo-400 text-sm flex items-center gap-1.5 transition duration-200 hover:bg-indigo-400 hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm hover:shadow-md"
          @click="copyPreviewImage"
        >
          <svg class="w-4 h-4 flex-shrink-0">
            <use href="#icon-copy"></use>
          </svg>
          <span>复制图片</span>
        </button>
        <button
          id="deleteImageBtn"
          class="h-10 px-5 border rounded-lg bg-rose-500 text-white border-rose-400 text-sm flex items-center gap-1.5 transition duration-200 hover:bg-rose-400 hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm hover:shadow-md"
          @click="deletePreviewImage"
        >
          <svg class="w-4 h-4 flex-shrink-0">
            <use href="#icon-delete"></use>
          </svg>
          <span>删除</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 清空确认弹窗 -->
  <ConfirmDialog
    :visible="clearConfirmVisible"
    title="确认清空记录"
    message="确定要清空所有剪贴板记录吗？此操作不可恢复。"
    confirm-text="确定清空"
    cancel-text="取消"
    :loading="clearLoading"
    @confirm="handleClearConfirm"
    @cancel="handleClearCancel"
  />
</template>

<script setup lang="ts">
import SvgSprite from "./components/SvgSprite.vue";
import ClipboardVirtualList from "./components/ClipboardVirtualList.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";
import { useClipboardRecords } from "./composables/useClipboardRecords";
import { useClipboardMonitoring } from "./composables/useClipboardMonitoring";
import { useImagePreview } from "./composables/useImagePreview";
import { useEventListener } from "@vueuse/core";
import { onMounted, ref } from "vue";

interface ClipboardRecord {
  _id: string;
  _rev?: string;
  type: "text" | "image" | "file";
  content: string;
  preview: string;
  thumbnail?: string;
  originalPath?: string;
  hash: string;
  timestamp: number;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

const {
  filteredRecords,
  filterInfoText,
  currentFilter,
  searchKeyword,
  setFilter,
  loadRecords,
  clearAll,
  copyRecord,
  deleteRecord,
} = useClipboardRecords();

const { isMonitoring, toggleMonitoring } = useClipboardMonitoring();

const {
  previewVisible,
  previewImageSrc,
  showImagePreview,
  hidePreview,
  copyPreviewImage,
  deletePreviewImage,
} = useImagePreview(async () => {
  await loadRecords();
});

const filterButtons = [
  { type: "all", label: "全部", icon: "#icon-all" },
  { type: "text", label: "文本", icon: "#icon-text" },
  { type: "image", label: "图片", icon: "#icon-image" },
  { type: "file", label: "文件", icon: "#icon-file" },
] as const;

const clearConfirmVisible = ref(false);
const clearLoading = ref(false);

function onFilterChange(type: "all" | "text" | "image" | "file") {
  setFilter(type);
}

function handleClearAll() {
  if (!filteredRecords.value.length || clearLoading.value) return;
  clearConfirmVisible.value = true;
}

function handleClearCancel() {
  if (clearLoading.value) return;
  clearConfirmVisible.value = false;
}

async function handleClearConfirm() {
  if (clearLoading.value) return;
  clearLoading.value = true;
  try {
    await clearAll();
    clearConfirmVisible.value = false;
  } finally {
    clearLoading.value = false;
  }
}

// 生成随机文本（长度在 minLength 到 maxLength 之间）
function generateRandomText(minLength: number, maxLength: number): string {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789中文测试文本内容这是随机生成的数据用于测试剪贴板历史记录功能";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 简单的hash函数（用于生成唯一标识）
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// 添加1000条随机数据（使用最新 clipboardAPI JSONL 存储）
async function addRandomRecords() {
  try {
    const textPreviewMaxLength = 100;
    const records: ClipboardRecord[] = [];
    const baseTimestamp = Date.now();

    for (let i = 0; i < 1000; i++) {
      const text = generateRandomText(100, 1000);
      const hash = simpleHash(text);
      const preview =
        text.length > textPreviewMaxLength
          ? text.substring(0, textPreviewMaxLength) + "..."
          : text;

      const record: ClipboardRecord = {
        _id: `text_${baseTimestamp}_${Math.random().toString(36).substr(2, 9)}_${i}`,
        type: "text",
        content: text,
        preview,
        hash,
        timestamp: baseTimestamp - (1000 - i), // 倒序时间戳，最新的在前面
      };

      records.push(record);
    }

    // 通过最新的 clipboardAPI 写入 JSONL 文件
    if (typeof clipboardAPI !== "undefined" && clipboardAPI.addRecords) {
      await clipboardAPI.addRecords(records as any);
    } else if (typeof clipboardAPI !== "undefined" && clipboardAPI.addRecord) {
      for (const record of records) {
        await clipboardAPI.addRecord(record as any);
      }
    }

    // 刷新列表
    await loadRecords();
    console.log("已添加1000条随机记录");
  } catch (error) {
    console.error("添加随机记录失败:", error);
  }
}

// 监听 Ctrl+L 快捷键
useEventListener(window, "keydown", (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "l") {
    // 如果焦点在输入框中，不触发
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }
    e.preventDefault();
    void addRandomRecords();
  }
});

onMounted(async () => {
  await loadRecords();
});
</script>
