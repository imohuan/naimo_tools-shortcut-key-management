<template>
  <div
    ref="rootEl"
    class="mx-1.5 gap-2 bg-white border border-slate-200 rounded-lg transition-all duration-200 group box-border p-2 relative"
    :class="item.type === 'image' ? 'h-[260px] flex-col' : 'items-start'"
  >
    <!-- 图片类型 -->
    <template v-if="item.type === 'image'">
      <div
        class="w-full h-[180px] flex items-center justify-center bg-slate-50 overflow-hidden cursor-pointer rounded-md flex-shrink-0"
        @click.stop="emit('preview-image', item)"
      >
        <LazyFileImage
          v-if="item.originalPath || item.content"
          :item="lazyImageItem"
          :file-path="item.originalPath || ''"
          :img-class="'max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]'"
          :img-style="{ height: '100%', width: '100%' }"
        />
        <template v-else>
          <img
            v-if="item.thumbnail"
            class="max-w-full max-h-full object-contain"
            :alt="'图片预览'"
            :src="thumbnailMap.get(item.thumbnail) || ''"
          />
          <div v-else class="flex flex-col items-center text-slate-400 text-sm">
            <svg class="w-8 h-8 mb-1">
              <use href="#icon-image"></use>
            </svg>
            <span>暂无预览</span>
          </div>
        </template>
      </div>
      <div
        class="flex items-center justify-between border-t border-slate-100 bg-white px-2 py-[10px] rounded-md h-[50px] flex-shrink-0"
      >
        <span class="item-time flex items-center gap-1 text-xs text-slate-500">
          <svg class="time-icon w-3.5 h-3.5">
            <use href="#icon-time"></use>
          </svg>
          <span>{{ formatTime(item.timestamp) }}</span>
        </span>
        <div class="item-actions flex items-center gap-2 opacity-100">
          <button
            class="item-action-btn copy w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-200"
            title="复制"
            @click.stop="emit('copy', item)"
          >
            <svg class="w-4 h-4 text-slate-600">
              <use href="#icon-copy"></use>
            </svg>
          </button>
          <button
            class="item-action-btn delete w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 transition-colors duration-200"
            title="删除"
            @click.stop="emit('delete', item._id)"
          >
            <svg class="w-4 h-4 text-rose-500">
              <use href="#icon-delete"></use>
            </svg>
          </button>
        </div>
      </div>
    </template>

    <!-- 文本 / 文件类型 -->
    <template v-else>
      <div
        class="item-content flex-1 min-w-0 flex flex-col justify-center gap-1.5 px-3 py-2"
      >
        <div
          class="item-preview text-sm text-slate-800 leading-relaxed line-clamp-[8] overflow-hidden"
        >
          <!-- {{ item.preview }} -->
          {{ item.content }}
        </div>
        <div class="flex items-center justify-between">
          <div class="item-meta flex items-center gap-3 text-xs text-slate-400 pt-0.5">
            <span
              class="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {{ item.type === "file" ? "文件" : "文本" }}
            </span>
            <span class="item-time flex items-center gap-1 text-slate-500">
              <svg class="time-icon w-3.5 h-3.5">
                <use href="#icon-time"></use>
              </svg>
              <span>{{ formatTime(item.timestamp) }}</span>
            </span>
          </div>

          <div>
            <span class="font-mono text-gray-400 text-xs">
              length: {{ item.content.length }}</span
            >
          </div>
        </div>
      </div>
      <div
        class="absolute right-0 top-0 mt-2 item-actions flex items-center gap-2 opacity-0 group-hover:opacity-100 pr-3 transition-opacity duration-200"
      >
        <button
          class="item-action-btn copy w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-200"
          title="复制"
          @click.stop="emit('copy', item)"
        >
          <svg class="w-4 h-4 text-slate-600">
            <use href="#icon-copy"></use>
          </svg>
        </button>
        <button
          class="item-action-btn delete w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 transition-colors duration-200"
          title="删除"
          @click.stop="emit('delete', item._id)"
        >
          <svg class="w-4 h-4 text-rose-500">
            <use href="#icon-delete"></use>
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUpdated, ref } from "vue";
import LazyFileImage from "./LazyFileImage.vue";

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

// LazyFileImage 期望的最小字段
interface MinimalLazyImageItem {
  key: string;
  index: number;
  path: string;
  url: string;
  filename: string;
}

const props = defineProps<{
  item: ClipboardRecord;
  thumbnailMap: Map<string, string>;
}>();

const emit = defineEmits<{
  (e: "copy", record: ClipboardRecord): void;
  (e: "delete", id: string): void;
  (e: "preview-image", record: ClipboardRecord): void;
  (e: "height-change", payload: { id: string; height: number }): void;
}>();

const rootEl = ref<HTMLDivElement | null>(null);

const lazyImageItem = computed<MinimalLazyImageItem>(() => {
  const path: string = props.item.originalPath ?? "";
  const url: string = props.item.content ?? "";
  const filename = extractFileName(path, url, props.item.preview || "image");
  return {
    key: props.item._id,
    index: 0,
    path,
    url,
    filename,
  };
});

const reportHeight = () => {
  if (!rootEl.value) return;
  const height = rootEl.value.scrollHeight || rootEl.value.offsetHeight;
  emit("height-change", { id: props.item._id, height });
};

onMounted(() => {
  nextTick(reportHeight);
});

onUpdated(() => {
  nextTick(reportHeight);
});

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function extractFileName(path: string, url: string, fallback: string): string {
  const pick = (input: string) => {
    if (!input) return "";
    const parts = input.split(/[\\/]/);
    const last = parts[parts.length - 1];
    return last || "";
  };
  const nameFromPath = pick(path);
  if (nameFromPath) return nameFromPath;
  const nameFromUrl = pick(url);
  if (nameFromUrl) return nameFromUrl;
  return fallback;
}
</script>
