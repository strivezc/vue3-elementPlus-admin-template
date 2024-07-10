<template>
  <div class="app-container">
    <el-form
      ref="ruleFormRef"
      :model="form"
      :inline="true"
      :rules="formRules"
      label-position="top"
    >
      <div class="form-title">基础信息</div>
      <el-form-item prop="brandLogo" label="上传品牌LOGO">
        <div class="flex-column">
          <el-upload
              ref="barrierImg"
              :http-request="uploadImg"
              action=""
              :show-file-list="false"
              accept=".jpg, .jpeg, .png"
              class="avatar-uploader"
          >
            <img :src="form.brandLogo" v-if="form.brandLogo" class="avatar" />
            <el-icon class="avatar-uploader-icon" v-else><plus /></el-icon>
            <template #tip>
              <div class="remarks ml15">尺寸：100px * 100px<br/>大小不大于1M</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item prop="companyName" label="客户名称">
        <el-input
          v-model="form.companyName"
          placeholder="请输入公司全称，最多30个字符"
          maxlength="30"
          show-word-limit
          />
      </el-form-item>
      <el-form-item prop="brandName" label="品牌名称">
        <el-input
          v-model="form.brandName"
          placeholder="请输入品牌名称，最多10个字符"
          maxlength="10"
          show-word-limit
          />
      </el-form-item>
      <div class="form-title">账号信息</div>
      <el-form-item prop="superManageAccount" label="超管账号">
        <el-input
          v-model="form.superManageAccount"
          placeholder="请输入品牌方超级管理员账号，账号唯一"
          maxlength="20"
          show-word-limit
          :disabled="true"
          />
      </el-form-item>
      <div class="form-title">监管信息</div>
      <el-form-item>
        <template #label>
          <div class="form-label">
            <span>统一信用代码</span>
            <el-checkbox v-model="form.checked">人工确认企业已认证</el-checkbox>
          </div>
        </template>
        <el-input
          v-model="form.unifiedCreditCode"
          placeholder="请输入营业执照上的统一社会信用代码"
          maxlength="18"
          show-word-limit
          />
      </el-form-item>
      <el-form-item label="ICP备案号">
        <el-input
          v-model="form.icpNum"
          placeholder="若客户拥有独立域名，则此项必填，例如：粤ICP备2000001号"
          maxlength="20"
          show-word-limit
          />
      </el-form-item>
      <el-form-item label="公安网备">
        <el-input
          v-model="form.pubSecNetBackup"
          placeholder="若客户拥有独立域名，则此项必填，例如：粤公安网备2000001号"
          maxlength="20"
          show-word-limit
          />
      </el-form-item>
      <div class="form-title">对接信息</div>
      <el-form-item prop="contactPerson" label="对接人">
        <el-input
          v-model="form.contactPerson"
          placeholder="请输入对接人姓名"
          maxlength="20"
          show-word-limit
          />
      </el-form-item>
      <el-form-item prop="phone" label="联系方式">
        <el-input
          v-model="form.phone"
          placeholder="请输入对接人联系方式"
          maxlength="11"
          show-word-limit
          />
      </el-form-item>
      <el-form-item>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="EditCustomer">
import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const { proxy } = getCurrentInstance()
const mobile = /^(1[3456789]\d{9})$/
const tel = /^((0\d{2,3}-?\d{7,8})|(1[3456789]\d{9})|(400[016789]\d{6})|(400-[016789]\d{2}-\d{4}))$/
const account = /^[a-zA-Z0-9]+$/
const validate = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入对接人联系方式!'))
  } else if (!(mobile.test(value))) {
    callback(new Error('手机号格式错误，请检查!'))
  } else {
    callback()
  }
}
const valiaccount = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入品牌方超级管理员账号！'))
  } else if (!(account.test(value))) {
    callback(new Error('请输入字母和数字的组合！'))
  } else {
    callback()
  }
}
const state = reactive({
  form: {
    id: '',
    brandLogo: '',
    companyName: '',
    brandName: '',
    superManageAccount: '',
    checked: false,
    unifiedCreditCode: '',
    icpNum: '',
    pubSecNetBackup: '',
    contactPerson: '',
    phone: '',
    certifiedStatus: ''
  },
  formRules: {
    brandLogo: [{ required: true, message: '请上传图片！', trigger: 'blur' }],
    companyName: [{ required: true, message: '请输入公司全称！', trigger: 'blur' }],
    brandName: [{ required: true, message: '请输入品牌名称！', trigger: 'blur' }],
    superManageAccount: [{ required: true, trigger: 'blur', validator: valiaccount }],
    contactPerson: [{ required: true, message: '请输入对接人姓名！', trigger: 'blur' }],
    phone: [{ required: true, trigger: 'blur', validator: validate }],
  },
  loading: false,
})
const ruleFormRef = ref()
const {
  form,
  formRules,
  loading
} = toRefs(state)

const uploadImg = async (file) => {
  if (file.file.size / 1024 / 1024 > 1) {
    proxy.$modal.msgError('文件大小不能超过1MB')
    return false
  }
  loading.value = true
  let formData = new FormData()
  formData.append('file', file.file)
  try {
    const { data } = await proxy.$http.common.uploadFile(formData)
    form.value.brandLogo = data.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
function close() {
  proxy.$modal.confirm('退出后当前的数据将不会保存，您确定要退出么？', '提示').then(() => {
    tagsViewStore.delView(proxy.$route).then(() => {
      proxy.$router.push('/userManage/customer')
    })
  })
}
const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      form.value.certifiedStatus = form.value.checked ? 0 : 1
      try {
        await proxy.$http.user.updateCompanyInfo(form.value)
        const link = '/userManage/customer?refresh=' + Date.now()
        proxy.$modal.setTimeBox('客户创建成功!', 2 , link)
      } catch (e) {
        console.log(e, 'error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const getDetail = async () => {
  try {
    const { data } = await proxy.$http.user.queryCompanyDetail(proxy.$route.params.id)
    form.value = data
    form.value.checked = data.certifiedStatus === 0 ? true : false
  } catch (e) {
    console.log(e, 'error')
  }
}
getDetail()
</script>
<style scoped lang="scss">
.el-form{
  flex-direction: column;
  width: 500px;
}
:deep(.el-form-item__label){
  padding: 0;
}
.form-label{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form-title{
  font-size: 16px;
  color: #606266;
  font-weight: 600;
  margin-bottom: 10px;
}
.avatar-uploader {
  display: flex;
  align-items: flex-end;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: .2s;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: #409eff;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>