<template>
  <div class="app-container">
    <el-form
      :model="form"
      :rules="formRules"
      ref="ruleFormRef"
      label-position="right"
      label-width="90px"
    >
      <el-form-item label="所属专题" prop="topic">
        <el-select class="form-select" v-model="form.topic" placeholder="请选择">
          <el-option label="全部" value="" />
        </el-select>
      </el-form-item>
      <el-form-item prop="barrierImg" label="封面图">
        <div class="flex-column">
          <el-upload
            ref="barrierImg"
            :http-request="uploadImg"
            action=""
            :show-file-list="false"
            accept=".jpg, .jpeg, .png, .gif, .bmp"
          >
            <el-button type="warning" :loading="loading">点击上传</el-button>
            <span slot="tip" class="remarks ml15">注：建议尺寸：750*750px</span>
          </el-upload>
          <img :src="form.barrierImg" v-if="form.barrierImg" class="cover" />
        </div>
      </el-form-item>
      <el-form-item label="排序:" prop="accountName">
        <el-input v-model="form.accountName" placeholder="排序" class="input form-input" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <editor v-model="form.content" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="AddArticle">
import { uploadFile } from '@/api/common'

const { proxy } = getCurrentInstance()

const loading = ref(false)
const form = ref({
  topic: '',
  content: '',
})
const formRules = ref({
  topic: [{ required: true, trigger: 'change', message: '请选择所属专题!' }],
})
const ruleFormRef = ref()

const submit = async () => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
const uploadImg = async (file) => {
  if (file.file.size / 1024 / 1024 > 10) {
    proxy.$modal.msgError('文件大小不能超过10MB')
    return false
  }
  loading.value = true
  let formData = new FormData()
  formData.append('file', file.file)
  try {
    const { resultData } = await uploadFile(formData)
    form.value.barrierImg = resultData.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.cover {
  margin-top: 15px;
  min-width: 300px;
  min-height: 300px;
  max-width: 500px;
  max-height: 500px;
}

.remarks {
  color: #ff574e;
  font-size: 14px;
}
</style>
