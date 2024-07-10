<template>
  <div class="app-container">
    <el-form
      :model="form"
      :rules="formRules"
      ref="ruleFormRef"
      label-position="right"
      label-width="90px"
    >
      <el-form-item label="所属专题" prop="subjectId">
        <el-select class="form-select" v-model="form.subjectId" placeholder="请选择">
          <el-option
            v-for="item in subjectDownList"
            :key="item.id"
            :label="item.dataName"
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
            accept=".jpg, .jpeg, .png"
          >
            <el-button type="warning" :loading="loading">点击上传</el-button>
            <template #tip>
              <span class="remarks ml15">上传比例建议：1:1</span>
            </template>
          </el-upload>
          <img :src="form.imgUrl" v-if="form.imgUrl" class="cover" />
        </div>
      </el-form-item>
      <el-form-item prop="videoUrl" label="视频">
        <div class="flex-column video-con">
          <el-upload
            ref="videoUrl"
            :http-request="uploadVideos"
            action=""
            :show-file-list="false"
            accept=".mp4"
          >
            <el-button type="warning" :loading="loading1">点击上传</el-button>
            <template #tip>
              <span class="remarks ml15">支持视频mp4格式，最大200M</span>
            </template>
          </el-upload>
          <video
          :src="form.videoUrl" v-if="form.videoUrl" class="cover" 
            controls="controls"
            controlsList="nodownload"
          ></video>
          <el-icon class="close" v-if="form.videoUrl" @click="close"><CircleClose /></el-icon>
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

<script setup name="EditArticle">
import { uploadFile, uploadVideo } from '@/api/common'

const { proxy } = getCurrentInstance()

const subjectDownList = ref([])
const loading = ref(false)
const loading1 = ref(false)
const form = ref({
  id: '',
  imgUrl: '',
  videoUrl: '',
  content: '',
  sortIndex: '',
  title: '',
  subjectId: ''
})
const formRules = ref({
  content: [{ required: true, trigger: 'blur', message: '请填写内容!' }],
  imgUrl: [{ required: true, trigger: 'blur', message: '请上传封面图!' }],
  title: [{ required: true, trigger: 'blur', message: '请填写标题!' }],
  subjectId: [{ required: true, trigger: 'change', message: '请选择专题!' }],
  sortIndex: [{ required: true, trigger: 'change', message: '请输入排序!' }]
})
const ruleFormRef = ref()

const getDetails = async () => {
  try {
    const { data } = await proxy.$http.operation.queryOneInfoContent(form.value.id)
    nextTick(() => {
      Object.keys(form.value).forEach((key) => {
        form.value[key] = data[key]
      })
      form.value.subjectId = Number(data.subjectId)
    })
  } catch (e) {
    console.log(e, 'error')
  }
}
const submit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      await proxy.$http.operation.updateInfoContent(form.value)
      proxy.$modal.msgSuccess('编辑成功!')
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
    const { data } = await uploadFile(formData)
    form.value.imgUrl = data.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
const uploadVideos = async (file) => {
  if (file.file.type !== 'video/mp4') {
    proxy.$modal.msgError('只允许上传mp4文件')
    return false
  }
  if (file.file.size / 1024 / 1024 > 200) {
    proxy.$modal.msgError('文件大小不能超过200MB')
    return false
  }
  loading1.value = true
  let formData = new FormData()
  formData.append('file', file.file)
  try {
    const { data } = await uploadVideo(formData)
    form.value.videoUrl = data.fileUrl
    loading1.value = false
  } catch (e) {
    loading1.value = false
  }
}
function close() {
  form.value.videoUrl = ''
}
const getSubjectDownList = async () => {
  try {
    const { data } = await proxy.$http.operation.querySubjectDownList()
    subjectDownList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
form.value.id = proxy.$route.params.id
getSubjectDownList()
getDetails()
</script>

<style scoped lang="scss">
.cover {
  margin-top: 15px;
  min-width: 300px;
  max-width: 500px;
}

.remarks {
  color: #ff574e;
  font-size: 14px;
}
.video-con{
  position: relative;
}
.close{
  color: #ff574e;
  position: absolute;
  right: -20px;
  top: 30px;
  font-size: 20px;
  cursor: pointer;
}
</style>
