<template>
  <!-- 直接内联整个 SVG 图标库，保持与原来 svg-icons.html 一致 -->
  <div id="svg-icons" v-html="svgContent"></div>
</template>

<script setup lang="ts">
import svgIconsHtml from "../svg-icons.html?raw";

const svgContent = svgIconsHtml;
</script>
