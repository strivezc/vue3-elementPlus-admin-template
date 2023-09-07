<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const { locale, size } = reactive({
  locale: zhCn,
  size: 'default'
})
</script>
