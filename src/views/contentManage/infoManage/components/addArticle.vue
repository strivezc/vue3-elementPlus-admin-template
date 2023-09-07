<template>
  <div class="app-container">
    <el-form
      :model="form"
      :rules="formRules"
      ref="ruleFormRef"
      label-position="right"
      label-width="90px"
    >
      <el-form-item label="所属分类" prop="typeId">
        <el-select class="form-select" v-model="form.typeId" placeholder="请选择">
          <el-option
            v-for="item in allTypeDownList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标题:" prop="title">
        <el-input v-model="form.title" maxlength="50" placeholder="排序" class="input form-input" />
      </el-form-item>
      <el-form-item prop="imgUrl" label="封面图">
        <div class="flex-column">
          <el-upload
            ref="imgUrl"
            :http-request="uploadImg"
            action=""
            :show-file-list="false"
            accept=".jpg, .jpeg, .png, .gif, .bmp"
          >
            <el-button type="warning" :loading="loading">点击上传</el-button>
            <!--            <span slot="tip" class="remarks ml15">注：建议尺寸：750*750px</span>-->
          </el-upload>
          <img :src="form.imgUrl" v-if="form.imgUrl" class="cover" />
        </div>
      </el-form-item>
      <el-form-item label="排序:" prop="sortIndex">
        <el-input
          v-model="form.sortIndex"
          type="number"
          oninput="if(value>99999)value=99999;if(value.length>5)value=value.slice(0,5);if(value<1)value=''"
          placeholder="排序"
          class="input form-input"
        />
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
import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const { proxy } = getCurrentInstance()

const allTypeDownList = ref([])
const loading = ref(false)
const form = ref({
  imgUrl: '',
  content: '',
  sortIndex: '',
  title: '',
  typeId: ''
})
const formRules = ref({
  content: [{ required: true, trigger: 'blur', message: '请填写内容!' }],
  imgUrl: [{ required: true, trigger: 'blur', message: '请上传封面图!' }],
  title: [{ required: true, trigger: 'blur', message: '请填写标题!' }],
  typeId: [{ required: true, trigger: 'change', message: '请选择分类!' }]
})
const ruleFormRef = ref()

const submit = async () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      await proxy.$http.content.addInfoContent(form.value)
      proxy.$modal.alert('新增成功!', '提示').then(() => {
        tagsViewStore.delView(proxy.$route).then(() => {
          proxy.$router.push('/contentManage/infoManage/articleManage')
        })
      })
    }
  })
}
const uploadImg = async file => {
  if (file.file.size / 1024 / 1024 > 10) {
    proxy.$modal.msgError('文件大小不能超过10MB')
    return false
  }
  loading.value = true
  let formData = new FormData()
  formData.append('file', file.file)
  try {
    const { data } = await uploadFile(formData)
    form.value.imgUrl = data.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
const getAllTypeDownList = async () => {
  try {
    const { data } = await proxy.$http.content.queryAllTypeDownList()
    allTypeDownList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
getAllTypeDownList()
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
