import { ref } from 'vue';

interface ClipboardRecord {
  _id: string;
  originalPath?: string;
}

export function useImagePreview(onChanged?: () => Promise<void> | void) {
  const previewVisible = ref(false);
  const previewImageSrc = ref('');
  const previewRecord = ref<ClipboardRecord | null>(null);

  async function showImagePreview(record: ClipboardRecord): Promise<void> {
    if (!record.originalPath) return;
    try {
      const dataUrl = await clipboardAPI.getFullImage(record.originalPath);
      previewImageSrc.value = dataUrl;
      previewRecord.value = record;
      previewVisible.value = true;
    } catch (error) {
      console.error('加载图片失败:', error);
    }
  }

  function hidePreview(): void {
    previewVisible.value = false;
    previewImageSrc.value = '';
    previewRecord.value = null;
  }

  async function copyPreviewImage(): Promise<void> {
    if (!previewRecord.value?.originalPath) return;
    try {
      await clipboardAPI.copyFullImage(previewRecord.value.originalPath);
      hidePreview();
    } catch (error) {
      console.error('复制图片失败:', error);
    }
  }

  async function deletePreviewImage(): Promise<void> {
    if (!previewRecord.value) return;
    try {
      const id = previewRecord.value._id;
      const success = await clipboardAPI.deleteRecord(id);
      if (success && onChanged) {
        await onChanged();
      }
    } catch (error) {
      console.error('删除图片失败:', error);
    } finally {
      hidePreview();
    }
  }

  return {
    previewVisible,
    previewImageSrc,
    previewRecord,
    showImagePreview,
    hidePreview,
    copyPreviewImage,
    deletePreviewImage,
  };
}


