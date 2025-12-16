<template>
  <div class="flex-1 relative overflow-hidden bg-slate-50">
    <div
      v-bind="containerProps"
      class="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-white transition-colors duration-200"
    >
      <div v-bind="wrapperProps" class="py-[7px]">
        <ClipboardListItem
          v-for="virtualItem in list"
          :key="virtualItem.data._id"
          :item="virtualItem.data"
          :thumbnail-map="thumbnailMap"
          :style="{
            marginBottom:
              virtualItem.index < props.items.length - 1 ? `${itemGap}px` : '0',
          }"
          @copy="emit('copy', $event)"
          @delete="emit('delete', $event)"
          @preview-image="emit('preview-image', $event)"
          @height-change="onItemHeightChange"
        />
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import { useVirtualList } from "@vueuse/core";
import { ClipboardConfig } from "../config";
import ClipboardListItem from "./ClipboardListItem.vue";

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

const props = defineProps<{
  items: ClipboardRecord[];
}>();

const emit = defineEmits<{
  (e: "copy", record: ClipboardRecord): void;
  (e: "delete", id: string): void;
  (e: "preview-image", record: ClipboardRecord): void;
}>();

const itemHeight = ClipboardConfig.virtualScrollItemHeight;
const imageItemHeight = ClipboardConfig.virtualScrollImageItemHeight;
const itemGap = ClipboardConfig.virtualScrollItemGap;
const bufferSize = ClipboardConfig.virtualScrollBufferSize;

const thumbnailMap = new Map<string, string>();
const itemHeights = ref<Map<string, number>>(new Map());

function onItemHeightChange(payload: { id: string; height: number }) {
  const map = new Map(itemHeights.value);
  map.set(payload.id, payload.height);
  itemHeights.value = map;
}

function getItemHeight(record: ClipboardRecord): number {
  const measured = itemHeights.value.get(record._id);
  if (measured) return measured;
  return record.type === "image" ? imageItemHeight : itemHeight;
}

// 使用函数形式的 itemHeight 来支持动态高度
// useVirtualList 会根据索引调用这个函数来获取每个项目的高度
// 注意：这里返回的高度需要包含 itemGap（除了最后一个item），用于 useVirtualList 的可见性计算
const getItemHeightByIndex = (index: number): number => {
  const items = props.items;
  if (!items || index < 0 || index >= items.length) {
    return itemHeight + itemGap + 6;
  }
  const item = items[index];
  if (!item) return itemHeight + itemGap + 6;
  // 高度包含 gap（除了最后一个item），这样 useVirtualList 可以正确计算可见区域
  const height = getItemHeight(item);
  return index < items.length - 1 ? height + itemGap + 6 : height;
};

const { list, containerProps, wrapperProps } = useVirtualList(toRef(props, "items"), {
  itemHeight: getItemHeightByIndex,
  overscan: bufferSize,
});
</script>
