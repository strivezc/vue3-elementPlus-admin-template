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
          <el-form-item label="日期">
            <el-date-picker
              v-model="formData.date1"
              value-format="yyyy-MM-dd"
              type="date"
              class="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
            <el-button type="success" @click="add">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="日期" prop="createTime"></el-table-column>
        <el-table-column align="center" label="英文句子" prop="createTime"></el-table-column>
        <el-table-column align="center" label="中文翻译" prop="createTime"></el-table-column>
        <el-table-column align="center" label="作者" prop="createTime"></el-table-column>
        <el-table-column align="center" label="图片" prop="createTime"></el-table-column>
        <el-table-column align="center" label="状态" prop="createTime"></el-table-column>
        <el-table-column align="center" label="来源" prop="createTime"></el-table-column>
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

    <el-dialog title="新增" draggable v-model="showDialog" :before-close="close" width="680px">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="日期:">
          <el-date-picker
            v-model="form.date1"
            value-format="yyyy-MM-dd"
            type="date"
            class="form-date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="英文:" prop="reply">
          <el-input
            class="form-textarea"
            v-model="form.reply"
            placeholder="最多输入500个字符"
            type="textarea"
            maxlength="500"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="中文:" prop="reply">
          <el-input
            class="form-textarea"
            v-model="form.reply"
            placeholder="最多输入500个字符"
            type="textarea"
            maxlength="500"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="作者:" prop="accountName">
          <el-input v-model="form.accountName" placeholder="作者" class="input form-input" />
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
        <el-form-item label="默认点赞数:" prop="accountName2">
          <el-input v-model="form.accountName2" placeholder="默认点赞数" class="input form-input" />
        </el-form-item>
        <el-form-item label="默认分享数:" prop="accountName1">
          <el-input v-model="form.accountName1" placeholder="默认分享数" class="input form-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DailySentence">
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
    accountName: [{ required: true, message: '请输入作者名称', trigger: 'blur' }],
  },
})
const ruleFormRef = ref()

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

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function add() {
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
