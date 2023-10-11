<template>
  <div class="app-container">
    <el-form label-width="100px" ref="ruleForm" :model="form">
      <!--      <el-form-item label="邮箱：">-->
      <!--        <div>{{ form.email }}</div>-->
      <!--      </el-form-item>-->
      <el-form-item label="用户名：">
        <div>{{ form.userName }}</div>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-model="form.realName"></el-input>
      </el-form-item>
      <el-form-item label="用户角色：">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item in roleInfoList" :label="item.id" :key="item.id">{{
            item.roleName
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'EditUser',
  data() {
    return {
      form: {
        // email: '',
        realName: '',
        userId: null,
        userName: ''
      },
      checkList: [],
      roleInfoList: [],
      params: {
        userId: 0,
        roleId: '',
        realName: ''
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await this.$http.user.toEditAdminUser(this.$route.query.id)
        this.form = data
        this.roleInfoList = this.form.roleInfo
        this.roleInfoList.forEach((item) => {
          if (item.checked == 0) {
            this.checkList.push(item.id)
          }
        })
      } catch (e) {
        console.log(e, 'error')
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$modal.confirm('确定提交用户信息吗？').then(async () => {
            this.submit()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submit() {
      const { userId, realName } = this.form
      this.params.userId = userId
      this.params.realName = realName
      this.params.roleId = this.checkList.join(',')
      try {
        await this.$http.user.editAdminUserSubmit(this.params)
        this.$modal.msgSuccess('修改成功!')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
:deep(.el-input) {
  width: 240px;
}
</style>
