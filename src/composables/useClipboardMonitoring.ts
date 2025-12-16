import { onMounted, ref } from 'vue';

export function useClipboardMonitoring() {
  const isMonitoring = ref(false);

  async function refreshMonitoringStatus(): Promise<void> {
    try {
      isMonitoring.value = await clipboardAPI.isMonitoring();
    } catch (error) {
      console.error('获取监听状态失败:', error);
    }
  }

  async function toggleMonitoring(): Promise<void> {
    try {
      const running = await clipboardAPI.isMonitoring();
      if (running) {
        await clipboardAPI.stopMonitoring();
      } else {
        await clipboardAPI.startMonitoring();
      }
      await refreshMonitoringStatus();
    } catch (error) {
      console.error('切换监听状态失败:', error);
    }
  }

  async function initAutoStart(): Promise<void> {
    const config = await clipboardAPI.getConfig();
    if (config.autoStartMonitoring) {
      const running = await clipboardAPI.isMonitoring();
      if (!running) {
        await clipboardAPI.startMonitoring();
      }
    }
    await refreshMonitoringStatus();
  }

  onMounted(() => {
    void initAutoStart();
  });

  return {
    isMonitoring,
    refreshMonitoringStatus,
    toggleMonitoring,
  };
}


