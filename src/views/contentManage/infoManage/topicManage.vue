<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-row>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="专题">
            <el-select class="select" v-model="formData.topic" placeholder="请选择">
              <el-option label="全部" value="" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="分类" prop="type">
            <el-select class="select" v-model="formData.type" placeholder="请选择">
              <el-option label="全部" value="" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
            <el-button type="success" @click="addTopic">新增专题</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="createTime"></el-table-column>
        <el-table-column align="center" label="专题名称" prop="createTime"></el-table-column>
        <el-table-column align="center" label="分类名称" prop="createTime"></el-table-column>
        <el-table-column align="center" label="排序" prop="createTime"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="状态" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作" prop="createTime"></el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.currPage"
        v-model:limit="listQuery.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog title="新增分类" draggable v-model="showDialog" :before-close="close" width="550px">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="所属专题">
          <el-select class="form-select" v-model="formData.topic" placeholder="请选择">
            <el-option label="全部" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称:" prop="accountName">
          <el-input v-model="form.accountName" placeholder="分类名称" class="input form-input" />
        </el-form-item>
        <el-form-item label="排序:" prop="accountName">
          <el-input v-model="form.accountName" placeholder="排序" class="input form-input" />
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="新增专题"
      draggable
      v-model="showDialogTopic"
      :before-close="closeTopic"
      width="450px"
    >
      <el-form
        :model="formTopic"
        :rules="formRulesTopic"
        ref="topicFormRef"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="专题名称:" prop="accountName">
          <el-input
            v-model="formTopic.accountName"
            placeholder="专题名称"
            class="input form-input"
          />
        </el-form-item>
        <el-form-item label="排序:" prop="accountName">
          <el-input v-model="formTopic.accountName" placeholder="排序" class="input form-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeTopic">取消</el-button>
          <el-button type="primary" @click="submitTopic">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TopicManage">
import { uploadFile } from '@/api/common'

const { proxy } = getCurrentInstance()

const data = reactive({
  formData: {},
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10,
  },
  loading: false,
  showDialog: false,
  form: {
    accountName: '',
  },
  formRules: {
    accountName: [{ required: true, message: '请输入', trigger: 'blur' }],
  },

  showDialogTopic: false,
  formTopic: {
    accountName: '',
  },
  formRulesTopic: {
    accountName: [{ required: true, message: '请输入', trigger: 'blur' }],
  },
})
const ruleFormRef = ref()
const topicFormRef = ref()

const {
  formData,
  tableDataLoading,
  tableData,
  total,
  listQuery,
  form,
  formRules,
  showDialog,
  loading,
  showDialogTopic,
  formTopic,
  formRulesTopic,
} = toRefs(data)

const submit = async () => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
const submitTopic = async () => {
  await topicFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function closeTopic() {
  showDialogTopic.value = false
  topicFormRef.value.resetFields()
}

function addTopic() {
  showDialog.value = true
}

function search() {
  listQuery.value.currPage = 0
  getList()
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value,
    }
    const { resultData, totalCount } = await list(params)
    tableData.value = resultData
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
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
