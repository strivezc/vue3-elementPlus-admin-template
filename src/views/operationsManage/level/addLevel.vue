<template>
  <div class="app-container">
    <el-form
      :model="form"
      :rules="formRules"
      ref="ruleFormRef"
      label-position="top"
      label-width="90px"
    >
      <div class="form-title">基础信息</div>
      <el-form-item label="等级名称" prop="gradeName">
        <el-input v-model="form.gradeName" maxlength="10" placeholder="请输入等级名称，最多10个字符" class="input form-input" />
      </el-form-item>
      <el-form-item label="所需经验值" prop="gradeIntegral">
        <el-input v-model="form.gradeIntegral" maxlength="10" placeholder="请输入1~999999的正整数" class="input form-input" />
      </el-form-item>
      <el-form-item label="等级说明" prop="gradeExplain">
        <el-input
            class="form-textarea"
            v-model="form.gradeExplain"
            placeholder="请输入等级说明"
            type="textarea"
            maxlength="200"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
      <el-form-item prop="gradeGrayFontColour" label="未点亮样式" class="level-img">
        <div class="flex-column">
          <el-upload
            ref="gradeGrayBackground"
            :http-request="(params) => uploadImg(params, 'gradeGrayBackground', 'loading')"
            action=""
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
          >
            <el-button type="warning" :loading="loadForm.loading">上传背景图</el-button>
            <template #tip>
              <span class="remarks ml15">注：样式图尺寸：670x250 矩形</span>
            </template>
          </el-upload>
          <img :src="form.gradeGrayBackground" v-if="form.gradeGrayBackground" class="cover" />
        </div>
        <div class="flex-column">
          <el-upload
            ref="gradeGrayLogo"
            :http-request="(params) => uploadImg(params, 'gradeGrayLogo', 'loading1')"
            action=""
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
          >
            <el-button type="warning" :loading="loadForm.loading1">上传徽章</el-button>
            <template #tip>
              <span class="remarks ml15">注：样式图尺寸：240 x 240px</span>
            </template>
          </el-upload>
          <img :src="form.gradeGrayLogo" v-if="form.gradeGrayLogo" class="cover" />
        </div>
        <div class="level-color">
          <span>字体颜色</span><el-input v-model="form.gradeGrayFontColour" maxlength="7" placeholder="请输入HEX颜色值，如#FFFFFF" class="input form-input" />
        </div>
      </el-form-item>
      <el-form-item prop="gradeFontColour" label="点亮样式" class="level-img">
        <div class="flex-column">
          <el-upload
            ref="gradeBackground"
            :http-request="(params) => uploadImg(params, 'gradeBackground', 'loading2')"
            action=""
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
          >
            <el-button type="warning" :loading="loadForm.loading2">上传背景图</el-button>
            <template #tip>
              <span class="remarks ml15">注：样式图尺寸：670x250 矩形</span>
            </template>
          </el-upload>
          <img :src="form.gradeBackground" v-if="form.gradeBackground" class="cover" />
        </div>
        <div class="flex-column">
          <el-upload
            ref="gradeLogo"
            :http-request="(params) => uploadImg(params, 'gradeLogo', 'loading3')"
            action=""
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
          >
            <el-button type="warning" :loading="loadForm.loading3">上传徽章</el-button>
            <template #tip>
              <span class="remarks ml15">注：样式图尺寸：240 x 240px</span>
            </template>
          </el-upload>
          <img :src="form.gradeLogo" v-if="form.gradeLogo" class="cover" />
        </div>
        <div class="level-color">
          <span>字体颜色</span><el-input v-model="form.gradeFontColour" maxlength="7" placeholder="请输入HEX颜色值，如#FFFFFF" class="input form-input" />
        </div>
      </el-form-item>
      <el-form-item label="等级状态" prop="gradeStatus">
        <el-radio-group v-model="form.gradeStatus">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="AddLevel">
import { uploadFile } from '@/api/common'

const { proxy } = getCurrentInstance()
const loadForm = ref({
  loading: false,
  loading1: false,
  loading2: false,
  loading3: false
})
const form = ref({
  gradeGrayBackground: '',
  gradeGrayLogo: '',
  gradeBackground: '',
  gradeLogo: '',
  gradeIntegral: '',
  gradeFontColour: '',
  gradeGrayFontColour: '',
  gradeName: '',
  gradeExplain: '',
  gradeStatus: 1
})
const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
const valiHex = (rule, value, callback) => {
  if (!form.value.gradeGrayBackground) {
    callback(new Error('请上传背景图!'))
  } else if (!form.value.gradeGrayLogo) {
    callback(new Error('请上传徽章!'))
  } else if (!value) {
    callback(new Error('请输入HEX颜色值!'))
  } else if (!hex.test(value)) {
    callback(new Error('请输入正确的HEX颜色值!'))
  } else {
    callback()
  }
}
const valiHex1 = (rule, value, callback) => {
  if (!form.value.gradeBackground) {
    callback(new Error('请上传背景图!'))
  } else if (!form.value.gradeLogo) {
    callback(new Error('请上传徽章!'))
  } else if (!value) {
    callback(new Error('请输入HEX颜色值!'))
  } else if (!hex.test(value)) {
    callback(new Error('请输入正确的HEX颜色值!'))
  } else {
    callback()
  }
}
const num = /^(?![0]+$)[1-9]\d{0,5}$/
const valiNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入所需经验值!'))
  } else if (!num.test(value)) {
    callback(new Error(' 请输入1-999999的正整数!'))
  } else {
    callback()
  }
}
const formRules = ref({
  gradeName: [{ required: true, trigger: 'blur', message: '请输入等级名称!' }],
  gradeIntegral: [{ required: true, trigger: 'blur', validator: valiNum }],
  gradeExplain: [{ required: true, trigger: 'blur', message: '请输入等级说明!' }],
  gradeGrayFontColour: [{ required: true, trigger: 'blur', validator: valiHex }],
  gradeFontColour: [{ required: true, trigger: 'blur', validator: valiHex1 }],
  gradeStatus: [{ required: true, trigger: 'change', message: '请选择等级状态!' }]
})
const ruleFormRef = ref()

const submit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      await proxy.$http.operation.addOrUpGrade(form.value)
      const link = '/operationsManage/level?refresh=' + Date.now()
      proxy.$modal.setTimeBox('等级创建成功!', 2 , link)
    }
  })
}
const uploadImg = async (file, name, load) => {
  if (file.file.size / 1024 / 1024 > 10) {
    proxy.$modal.msgError('文件大小不能超过10MB')
    return false
  }
  loadForm.value[load] = true
  let formData = new FormData()
  formData.append('file', file.file)
  try {
    const { data } = await uploadFile(formData)
    form.value[name] = data.fileUrl
    loadForm.value[load] = false
  } catch (e) {
    loadForm.value[load] = false
  }
}
</script>

<style scoped lang="scss">
.cover {
  margin-top: 15px;
  // min-width: 300px;
  width: fit-content;
  max-width: 500px;
}

.remarks {
  color: #ff574e;
  font-size: 14px;
}
.form-title{
  font-size: 16px;
  color: #606266;
  font-weight: 600;
  margin-bottom: 10px;
}
.level-img{
  :deep(.el-form-item__content) {
    display: block;
  }
  .flex-column{
    margin-bottom: 10px;
  }
  .level-color{
    span{
      margin-right: 10px;
      color: #666;
    }
  }
}
</style>
