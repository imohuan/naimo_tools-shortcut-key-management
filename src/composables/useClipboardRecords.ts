import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

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

type FilterType = "all" | "text" | "image" | "file";

export function useClipboardRecords() {
  const allRecords = ref<ClipboardRecord[]>([]);
  const currentFilter = ref<FilterType>("all");
  const searchKeyword = ref("");

  const filterInfoText = computed(() => {
    let text = "显示全部";
    if (currentFilter.value === "text") text = "显示文本";
    if (currentFilter.value === "image") text = "显示图片";
    if (currentFilter.value === "file") text = "显示文件";
    if (searchKeyword.value.trim()) {
      text += ` · 搜索: ${searchKeyword.value.trim()}`;
    }
    return text;
  });

  const filteredRecords = computed(() => {
    let list = allRecords.value;
    if (currentFilter.value !== "all") {
      list = list.filter((record) => record.type === currentFilter.value);
    }
    return list;
  });

  async function loadRecords(): Promise<void> {
    try {
      const records = await clipboardAPI.queryRecords({
        limit: 1000,
        sortBy: "timestamp",
        order: "desc",
      });
      allRecords.value = records;
    } catch (error) {
      console.error("加载记录失败:", error);
    }
  }

  const doSearch = useDebounceFn(async () => {
    const keyword = searchKeyword.value.trim();
    try {
      if (keyword) {
        const results = await clipboardAPI.searchRecords(keyword);
        allRecords.value = results;
      } else {
        await loadRecords();
      }
    } catch (error) {
      console.error("搜索失败:", error);
    }
  }, 300);

  watch(searchKeyword, () => {
    void doSearch();
  });

  function setFilter(type: FilterType): void {
    currentFilter.value = type;
  }

  async function clearAll(): Promise<void> {
    try {
      console.log('清空记录');
      const success = await clipboardAPI.clearAll();
      if (!success) {
        console.error("清空记录失败: clipboardAPI.clearAll 返回 false");
      }
      await loadRecords();
      console.log("清空成功", success);
    } catch (error) {
      console.error("清空失败:", error);
    }
  }

  async function copyRecord(record: ClipboardRecord): Promise<void> {
    try {
      if (record.type === "text") {
        await clipboardAPI.copyText(record.content);
      } else if (record.type === "image" && record.originalPath) {
        await clipboardAPI.copyFullImage(record.originalPath);
      }
    } catch (error) {
      console.error("复制失败:", error);
    }
  }

  async function deleteRecord(id: string): Promise<void> {
    try {
      const success = await clipboardAPI.deleteRecord(id);
      if (success) {
        await loadRecords();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  }

  const clipboardUpdatedHandler = () => {
    void loadRecords();
  };

  onMounted(() => {
    window.addEventListener("clipboard-updated", clipboardUpdatedHandler);
  });

  onUnmounted(() => {
    window.removeEventListener("clipboard-updated", clipboardUpdatedHandler);
  });

  return {
    allRecords,
    currentFilter,
    searchKeyword,
    filteredRecords,
    filterInfoText,
    setFilter,
    loadRecords,
    clearAll,
    copyRecord,
    deleteRecord,
  };
}
