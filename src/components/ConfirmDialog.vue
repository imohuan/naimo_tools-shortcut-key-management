<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[1200] flex items-center justify-center">
      <div
        class="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
        role="button"
        tabindex="-1"
        @click="onCancel"
      ></div>
      <div
        class="relative w-[90%] max-w-[460px] bg-white border border-slate-200 rounded-2xl shadow-[0_22px_60px_rgba(15,23,42,0.22)] overflow-hidden"
      >
        <div class="px-6 py-5 border-b border-slate-100 flex items-start gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-semibold"
            aria-hidden="true"
          >
            !
          </div>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-slate-900">
              {{ titleText }}
            </h3>
            <p class="mt-1.5 text-sm text-slate-500 leading-relaxed">
              {{ messageText }}
            </p>
          </div>
          <button
            class="w-8 h-8 text-slate-400 hover:text-slate-900 transition-colors"
            type="button"
            aria-label="关闭"
            @click="onCancel"
          >
            <svg class="w-5 h-5">
              <use href="#icon-close"></use>
            </svg>
          </button>
        </div>
        <div class="px-6 py-4 bg-slate-50 flex justify-end gap-3">
          <button
            class="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:text-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
            :disabled="loading"
            @click="onCancel"
          >
            {{ cancelText }}
          </button>
          <button
            class="h-10 px-4 rounded-lg border border-rose-500 bg-rose-500 text-sm text-white transition-colors duration-200 hover:bg-rose-400 hover:border-rose-400 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center gap-2"
            type="button"
            :disabled="loading"
            @click="onConfirm"
          >
            <span
              v-if="loading"
              class="inline-block h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin"
            ></span>
            <span>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const titleText = computed(() => props.title ?? "确认操作");
const messageText = computed(() => props.message ?? "请确认是否继续执行该操作");
const confirmText = computed(() => props.confirmText ?? "确定");
const cancelText = computed(() => props.cancelText ?? "取消");

function onCancel() {
  if (props.loading) return;
  emit("cancel");
}

function onConfirm() {
  if (props.loading) return;
  emit("confirm");
}
</script>
