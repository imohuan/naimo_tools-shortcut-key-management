<template>
  <div class="relative overflow-hidden" :style="mergedStyle">
    <img
      ref="imgRef"
      :src="displaySrc"
      :alt="item.filename"
      class="w-full h-full block"
      :class="imgClass"
      @load="handleLoad"
      @error="handleError"
    />
    <div
      v-if="status !== 'success'"
      class="absolute inset-0 flex items-center justify-center bg-black/5 text-gray-400"
    >
      <svg
        v-if="status === 'loading'"
        xmlns="http://www.w3.org/2000/svg"
        class="w-1/2 h-auto animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="9" class="opacity-20" />
        <path d="M21 12a9 9 0 0 0-9-9" />
      </svg>
      <svg
        v-else-if="status === 'waiting'"
        xmlns="http://www.w3.org/2000/svg"
        class="w-1/2 h-auto"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="9" class="opacity-20" />
        <path d="M12 7v5l3 3" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="w-1/2 h-auto"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="9" class="opacity-20" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const transparentPlaceholder =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

type ImageItem = { url: string; path: string; filename: string };
type ExtendedImageItem = ImageItem & { key: string; index: number };

const props = defineProps<{
  item: ExtendedImageItem;
  filePath?: string;
  imgStyle?: Record<string, string>;
  imgClass?: string;
  initialSrc?: string;
  waitingSrc?: string;
  loadingSrc?: string;
  errorSrc?: string;
  getScrollContainer?: () => HTMLElement | null;
}>();

const emit = defineEmits<{
  (e: "loaded", event: Event): void;
  (e: "error", event: Event): void;
  (e: "visible", payload: { item: ExtendedImageItem }): void;
}>();

const imgRef = ref<HTMLImageElement | null>(null);
const triggered = ref(false);
const currentSrc = ref(props.initialSrc || "");
const cacheKey = computed(() => props.filePath || props.item.path || props.item.url);
const lastLoadedKey = ref<string | null>(null);
const rootTarget = computed(() => props.getScrollContainer?.() || undefined);
const status = ref<"waiting" | "loading" | "success" | "error">("waiting");
const mergedStyle = computed(() => {
  const base: Record<string, string> = {
    width: "100%",
    display: "block",
  };
  if (status.value !== "success") {
    base.aspectRatio = "1 / 1";
  }
  return props.imgStyle ? { ...base, ...props.imgStyle } : base;
});

const displaySrc = computed(() => {
  if (status.value === "success") {
    return currentSrc.value || transparentPlaceholder;
  }
  // 非成功态时不再使用外部占位图，统一为透明底，交由外层 SVG 提示
  return transparentPlaceholder;
});

const loadWhenVisible = async () => {
  const nextKey = cacheKey.value;
  if (!nextKey) return;
  if (status.value === "loading") return;
  if (lastLoadedKey.value === nextKey && status.value === "success") {
    return;
  }

  const itemWithPath: ImageItem = {
    ...props.item,
    path: props.filePath || props.item.path,
  };
  console.debug("[LazyFileImage] 开始加载", {
    key: props.item.key,
    path: itemWithPath.path,
    url: props.item.url,
  });
  status.value = "loading";
  try {
    const realSrc = await ensureImageLoaded(itemWithPath);
    currentSrc.value = realSrc || props.item.url;
    console.debug("[LazyFileImage] 加载成功", {
      key: props.item.key,
      src: currentSrc.value,
    });
    lastLoadedKey.value = nextKey;
    status.value = "success";
  } catch (error) {
    console.warn("[LazyFileImage] 加载失败", {
      key: props.item.key,
      path: itemWithPath.path,
      url: props.item.url,
      error,
    });
    status.value = "error";
    emit("error", (error as any) as Event);
  }
};

useIntersectionObserver(
  imgRef,
  ([entry]) => {
    if (entry.isIntersecting && !triggered.value) {
      triggered.value = true;
      emit("visible", { item: props.item });
      loadWhenVisible();
    }
  },
  {
    root: rootTarget.value,
    rootMargin: "800px 0px 800px 0px",
    threshold: 0.01,
  }
);

onMounted(() => {
  if (!currentSrc.value && props.initialSrc) {
    currentSrc.value = props.initialSrc;
    status.value = "success";
  }
  // 若初始已有缓存 src，但未触发可见性，仍需保证后续能加载
  if (!props.initialSrc && cacheKey.value && !triggered.value && imgRef.value) {
    // 如果初始就在视口内，立即加载
    const rect = imgRef.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewportHeight && rect.bottom > 0) {
      triggered.value = true;
      loadWhenVisible();
    }
  }
});

watch(
  () => props.filePath,
  () => {
    if (triggered.value) {
      loadWhenVisible();
    }
  }
);

const handleLoad = (e: Event) => {
  if (status.value !== "error") {
    status.value = "success";
  }
  emit("loaded", e);
};

const handleError = (e: Event) => {
  status.value = "error";
  emit("error", e);
};

async function ensureImageLoaded(item: ImageItem): Promise<string> {
  await loadImageAsync(item);
  return currentSrc.value || item.url;
}

async function loadImageAsync(item: ImageItem) {
  let filePath = item.path;
  if (!filePath && item.url.startsWith("file://")) {
    filePath = decodeURIComponent(item.url.replace(/^file:\/\/\//, ""));
  }

  if (!filePath) {
    currentSrc.value = item.url;
    return;
  }

  try {
    if (window.naimo?.system?.getLocalImage) {
      const base64 = await window.naimo.system.getLocalImage(filePath);
      const mime = `image/${getImageType(filePath)}`;
      const blob = base64ToBlob(base64, mime);
      const objectUrl = URL.createObjectURL(blob);
      currentSrc.value = objectUrl;
    } else {
      currentSrc.value = item.url;
    }
  } catch (error) {
    console.error(`加载图片失败: ${filePath}`, error);
    currentSrc.value = item.url;
  }
}

function getImageType(filePath: string): string {
  const ext = filePath.toLowerCase().split(".").pop() || "jpg";
  const typeMap: Record<string, string> = {
    jpg: "jpeg",
    jpeg: "jpeg",
    png: "png",
    gif: "gif",
    webp: "webp",
    bmp: "bmp",
  };
  return typeMap[ext] || "jpeg";
}

function base64ToBlob(base64: string, mime: string) {
  const byteString = atob(base64);
  const len = byteString.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = byteString.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}
</script>
