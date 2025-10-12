# 剪贴板历史管理器 - 配置说明

## 📖 概述

本插件支持通过 `src/config.ts` 文件进行灵活配置，所有 UI 相关的高度、间距等样式都通过配置文件管理，无需修改 CSS 代码。

## 🎨 UI 配置详解

### 虚拟滚动配置

```typescript
// 文本/文件项高度（像素）
virtualScrollItemHeight: 70,

// 图片项高度（像素）
virtualScrollImageItemHeight: 240,

// 项间隔（像素）
virtualScrollItemGap: 8,

// 容器上下边距（像素）
virtualScrollContainerPadding: 8,

// 缓冲项数量
virtualScrollBufferSize: 5,
```

**说明：**

- `virtualScrollItemHeight`：文本和文件类型列表项的高度
- `virtualScrollImageItemHeight`：图片类型列表项的高度（包含图片预览区和信息栏）
- `virtualScrollItemGap`：列表项之间的间隔
- `virtualScrollContainerPadding`：列表容器顶部和底部的内边距
- `virtualScrollBufferSize`：虚拟滚动的缓冲区大小，值越大滚动越流畅但占用内存越多

### 图片项配置

```typescript
imageItem: {
  // 图片预览区域高度（像素）
  previewHeight: 180,
  // 图片信息栏高度（像素）
  infoBarHeight: 50,
},
```

**说明：**

- `previewHeight`：图片预览区域的固定高度
- `infoBarHeight`：图片信息栏（显示时间和操作按钮）的高度

**重要提示：**

- `virtualScrollImageItemHeight` 应该等于 `previewHeight + infoBarHeight + 10px`（10px 为余量）
- 例如：180 + 50 + 10 = 240

### 列表项样式配置

```typescript
listItemStyle: {
  // 文本/文件项内边距（像素）
  padding: 8,
  // 边框圆角（像素）
  borderRadius: 8,
},
```

**说明：**

- `padding`：列表项的内边距，值越小内容越紧凑
- `borderRadius`：列表项的圆角大小

## 🔧 如何调整 UI 紧凑度

### 方案一：减少内边距（推荐）

```typescript
listItemStyle: {
  padding: 6,  // 从 8 改为 6，更紧凑
  borderRadius: 6,
},
```

### 方案二：减少列表项高度

```typescript
// 文本项更紧凑
virtualScrollItemHeight: 60,  // 从 70 改为 60

// 图片项更紧凑
virtualScrollImageItemHeight: 220,  // 从 240 改为 220
imageItem: {
  previewHeight: 160,  // 从 180 改为 160
  infoBarHeight: 50,
},
```

### 方案三：减少间隔

```typescript
// 项间隔更小
virtualScrollItemGap: 4,  // 从 8 改为 4

// 容器边距更小
virtualScrollContainerPadding: 4,  // 从 8 改为 4
```

## 📊 配置示例

### 极致紧凑模式

```typescript
// 最紧凑的配置，适合显示更多内容
virtualScrollItemHeight: 60,
virtualScrollImageItemHeight: 200,
virtualScrollItemGap: 4,
virtualScrollContainerPadding: 4,

imageItem: {
  previewHeight: 150,
  infoBarHeight: 45,
},

listItemStyle: {
  padding: 6,
  borderRadius: 6,
},
```

### 标准模式（默认）

```typescript
// 平衡显示内容和视觉舒适度
virtualScrollItemHeight: 70,
virtualScrollImageItemHeight: 240,
virtualScrollItemGap: 8,
virtualScrollContainerPadding: 8,

imageItem: {
  previewHeight: 180,
  infoBarHeight: 50,
},

listItemStyle: {
  padding: 8,
  borderRadius: 8,
},
```

### 宽松模式

```typescript
// 更宽松的布局，适合大屏幕
virtualScrollItemHeight: 90,
virtualScrollImageItemHeight: 280,
virtualScrollItemGap: 12,
virtualScrollContainerPadding: 12,

imageItem: {
  previewHeight: 220,
  infoBarHeight: 55,
},

listItemStyle: {
  padding: 12,
  borderRadius: 10,
},
```

## ⚙️ 其他配置

### 性能配置

```typescript
// 搜索防抖延迟（毫秒）
searchDebounceDelay: 300,

// 是否启用懒加载
enableLazyLoad: true,
```

### 缩略图配置

```typescript
// 缩略图尺寸
thumbnailMaxWidth: 200,
thumbnailMaxHeight: 200,

// 缩略图质量
thumbnailQuality: 0.8,
```

### 数据管理配置

```typescript
// 最大存储记录数
maxRecords: 1000,

// 数据过期时间（天）
dataExpirationDays: 30,
```

## 💡 配置技巧

1. **修改配置后需要刷新**：修改 `config.ts` 后，需要刷新应用才能看到效果

2. **保持高度一致性**：确保图片项高度 = 预览区高度 + 信息栏高度 + 10px 余量

3. **性能考虑**：

   - 项高度越小，虚拟滚动需要渲染的项越多，性能消耗越大
   - `bufferSize` 越大，滚动越流畅但内存占用越高

4. **视觉平衡**：
   - 间隔太小会显得拥挤
   - 间隔太大会减少可见内容
   - 建议 `itemGap` 保持在 4-12px 之间

## 🔍 故障排查

### 问题：修改配置后没有生效

**解决方案：**

1. 确保修改的是 `src/config.ts` 文件
2. 刷新应用或重启插件
3. 检查浏览器控制台是否有错误

### 问题：图片项显示不完整

**解决方案：**

1. 检查 `virtualScrollImageItemHeight` 是否足够大
2. 确保计算公式：`virtualScrollImageItemHeight >= previewHeight + infoBarHeight + 10`
3. 增加 `virtualScrollImageItemHeight` 的值

### 问题：列表滚动不流畅

**解决方案：**

1. 增加 `bufferSize` 的值（如从 5 改为 8）
2. 减少 `maxRecords` 限制记录数量
3. 启用 `enableLazyLoad` 懒加载

## 📝 配置验证

在 `config.ts` 中，你可以添加验证逻辑确保配置的合理性：

```typescript
// 验证图片项高度配置
const { previewHeight, infoBarHeight } = ClipboardConfig.imageItem;
const minImageItemHeight = previewHeight + infoBarHeight + 10;

if (ClipboardConfig.virtualScrollImageItemHeight < minImageItemHeight) {
  console.warn(
    `警告：virtualScrollImageItemHeight (${ClipboardConfig.virtualScrollImageItemHeight}) 小于最小值 (${minImageItemHeight})`
  );
}
```

## 🎯 推荐配置

根据不同使用场景，我们推荐以下配置：

| 场景         | itemHeight | imageItemHeight | itemGap | padding |
| ------------ | ---------- | --------------- | ------- | ------- |
| 紧凑办公     | 60         | 200             | 4       | 6       |
| **标准使用** | **70**     | **240**         | **8**   | **8**   |
| 宽松浏览     | 90         | 280             | 12      | 12      |
| 演示展示     | 100        | 320             | 16      | 14      |

---

💡 **提示**：修改配置时建议先备份原始配置，以便随时恢复默认设置。
