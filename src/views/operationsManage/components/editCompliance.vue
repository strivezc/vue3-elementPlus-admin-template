<template>
  <div class="app-container">
    <el-form
      :model="form"
      :rules="formRules"
      ref="ruleFormRef"
      label-position="right"
      label-width="120px"
    >
      <el-form-item label="资讯类型:">
        <el-input v-model="title" readonly class="input form-input" />
      </el-form-item>
      <div class="ml-120">
        <el-tabs v-model="activeName" type="card" @tab-change="handleClick">
          <el-tab-pane label="web" name="0"></el-tab-pane>
          <el-tab-pane label="小程序" name="1"></el-tab-pane>
        </el-tabs>
        <div class="text">
          <span>更新人： {{ updateUser }}</span> <span>更新时间：{{ subjectId }}</span>
        </div>
      </div>
      <el-form-item label="资讯正文:" prop="content">
        <editor v-model="form.content" style="width: 85%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="EditCompliance">
import { queryAgreementOne, updateAgreement } from '@/api/operation'

const resourceType = {
  1: '免责声明',
  2: '用户协议',
  3: '隐私协议',
  4: '儿童隐私协议',
  5: '接单规则',
  6: '提现规则',
  7: '等级解锁攻略',
  8: '发布悬赏须知'
}
const { proxy } = getCurrentInstance()

const state = reactive({
  form: {
    content: '',
    type: '',
    platformType: 0
  },
  formRules: {
    content: [{ required: true, message: '请输入正文', trigger: 'blur' }]
  },
  title: '',
  activeName: '0',
  updateUser: '',
  subjectId: '',
  oldContent: ''
})

const ruleFormRef = ref()

const { form, formRules, title, activeName, updateUser, subjectId, oldContent } = toRefs(state)

const getDetail = async () => {
  try {
    const { data } = await queryAgreementOne({
      type: form.value.type,
      platformType: form.value.platformType
    })
    subjectId.value = data.updateTime
    updateUser.value = data.updateUser
    form.value.content = data.content
    oldContent.value = data.content
  } catch (e) {
    console.log(e, 'error')
  }
}
const handleClick = async (val) => {
  activeName.value = val
  if ((!form.value.content && !oldContent.value) || form.value.content == oldContent.value) {
    form.value.platformType = activeName.value
    await getDetail()
  } else {
    proxy.$modal
      .confirm('是否保存当前更改内容？')
      .then(async () => {
        try {
          await submit()
        } catch (e) {
          console.log(e, 'error')
        }
      })
      .catch(async () => {
        form.value.platformType = activeName.value
        await getDetail()
      })
  }
}
const submit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateAgreement(form.value)
        form.value.platformType = activeName.value
        proxy.$modal.msgSuccess('操作成功!')
        await getDetail()
      } catch (e) {
        console.log(e, 'error')
      }
    }
  })
}
form.value.type = proxy.$route.params.id
title.value = resourceType[form.value.type]
getDetail()
</script>

<style scoped lang="scss">
.ml-120 {
  margin-left: 120px;
}

.text {
  padding: 15px 0;

  span {
    padding-right: 20px;
  }
}
</style>
