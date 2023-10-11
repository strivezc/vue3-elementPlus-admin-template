<template>
  <div>
    <el-button type="primary" plain size="small" @click="queryUserPhone">查看</el-button>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: [Number, String],
      default: null
    },
    permissionValue: {
      type: String,
      default: null
    }
  },
  methods: {
    async queryUserPhone() {
      try {
        const { data } = await this.$http.user.queryUserPhone(this.userId, this.permissionValue)
        if (data) {
          this.$modal.alert(data)
        }
      } catch (e) {
        console.log(e, 'error')
      }
    }
  }
}
</script>

<style scoped>
:deep(.el-button) {
  min-width: 55px;
}
</style>
