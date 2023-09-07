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
              v-model="formData.shareDate"
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
        <el-table-column align="center" label="日期" prop="shareDate"></el-table-column>
        <el-table-column align="center" label="英文句子" prop="enText"></el-table-column>
        <el-table-column align="center" label="中文翻译" prop="cnText"></el-table-column>
        <el-table-column align="center" label="作者" prop="authorName"></el-table-column>
        <el-table-column align="center" label="图片">
          <template #default="{ row }">
            <div class="img">
              <ImagePreview :src="row.imgUrl"></ImagePreview>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="来源" prop="fromUser"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="danger"
                plain
                size="small"
                v-if="row.status === 0"
                @click="updateStatus(row.id, 1)"
                >删除
              </el-button>
              <el-button type="primary" plain size="small" v-else @click="updateStatus(row.id, 0)"
                >启用</el-button
              >
              <el-button type="primary" plain size="small" @click="edit(row)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.currPage"
        v-model:limit="listQuery.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="680px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="日期:" prop="shareDate">
          <el-date-picker
            v-model="form.shareDate"
            value-format="yyyy-MM-dd"
            type="date"
            class="form-date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="英文:" prop="enText">
          <el-input
            class="form-textarea"
            v-model="form.enText"
            placeholder="英文"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="中文:" prop="cnText">
          <el-input
            class="form-textarea"
            v-model="form.cnText"
            placeholder="中文"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="作者:" prop="authorName">
          <el-input v-model="form.authorName" placeholder="作者" class="input form-input" />
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
              <!--              <span slot="tip" class="remarks ml15">注：建议尺寸：750*750px</span>-->
            </el-upload>
            <img :src="form.imgUrl" v-if="form.imgUrl" class="cover" />
          </div>
        </el-form-item>
        <!--        <el-form-item label="默认点赞数:" prop="accountName2">-->
        <!--          <el-input v-model="form.accountName2" placeholder="默认点赞数" class="input form-input" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="默认分享数:" prop="accountName1">-->
        <!--          <el-input v-model="form.accountName1" placeholder="默认分享数" class="input form-input" />-->
        <!--        </el-form-item>-->
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
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    shareDate: '',
    status: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  loading: false,
  showDialog: false,
  form: {
    authorName: '',
    cnText: '',
    enText: '',
    imgUrl: '',
    shareDate: '',
    id: ''
  },
  formRules: {
    authorName: [{ required: true, message: '请输入作者名称！', trigger: 'blur' }],
    cnText: [{ required: true, message: '请输入中文！', trigger: 'blur' }],
    enText: [{ required: true, message: '请输入英文！', trigger: 'blur' }],
    shareDate: [{ required: true, message: '请选择日期！', trigger: 'blur' }],
    imgUrl: [{ required: true, message: '请上传封面图！', trigger: 'blur' }]
  },
  isEdit: false
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
  isEdit
} = toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function add() {
  isEdit.value = false
  showDialog.value = true
}

function search() {
  listQuery.value.currPage = 1
  getList()
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value
    }
    const { data, totalCount } = await proxy.$http.content.dailySentenceList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
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
    const { data } = await proxy.$http.common.uploadFile(formData)
    form.value.imgUrl = data.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
const submit = async () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      if (isEdit.value) {
        await proxy.$http.content.editSentence(form.value)
      } else {
        await proxy.$http.content.addSentence(form.value)
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要启用吗？' : '确定要删除吗？').then(async () => {
    await proxy.$http.content.updateSentenceStatus(id)
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}
function edit(row) {
  isEdit.value = true
  Object.keys(form.value).forEach(key => {
    form.value[key] = row[key]
  })
  showDialog.value = true
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
.img {
  max-width: 250px;
  max-height: 250px;
}
</style>
