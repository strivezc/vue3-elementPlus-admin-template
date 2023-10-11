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
          <el-form-item label="词本名">
            <el-input v-model="formData.bookName" placeholder="词本名" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="分类">
            <el-select class="select" v-model="formData.typeId" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.dataName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList" v-permission="'2200'"
              >查询</el-button
            >
            <el-upload
              v-permission="'2202'"
              ref="uploadFile"
              :http-request="importBookList"
              action=""
              :show-file-list="false"
              accept=".xls,.xlsx"
              class="ml20"
            >
              <el-button type="warning" :loading="uploadLoading">单词本导入</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="词本" prop="bookName"></el-table-column>
        <el-table-column align="center" label="所属分类" prop="dataName"></el-table-column>
        <el-table-column align="center" label="简介" prop="intro"></el-table-column>
        <el-table-column align="center" label="封面图">
          <template #default="{ row }">
            <div class="img">
              <ImagePreview :src="row.imgUrl"></ImagePreview>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单词数" prop="wordNum"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="推荐">
          <template #default="{ row }">
            {{ row.recommend === 0 ? '推荐' : '不推荐' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="danger"
                v-permission="'2204'"
                plain
                size="small"
                v-if="row.status === 0"
                @click="updateStatus(row.id, 1)"
                >下架
              </el-button>
              <el-button
                type="primary"
                v-permission="'2204'"
                plain
                size="small"
                v-else
                @click="updateStatus(row.id, 0)"
                >上架
              </el-button>
              <el-button
                type="danger"
                v-permission="'2205'"
                plain
                size="small"
                v-if="row.recommend === 0"
                @click="updateRecommend(row.id, 1)"
              >
                取消推荐
              </el-button>
              <el-button
                  type="primary"
                  v-permission="'2205'"
                  plain
                  size="small"
                  v-else
                  @click="updateRecommend(row.id, 0)"
              >设为推荐
              </el-button>
              <el-button type="primary" plain size="small" @click="edit(row)" v-permission="'2203'"
              >编辑
              </el-button
              >
              <el-button type="primary" v-if="row.reviewStatus===1" plain size="small" v-permission="'2207'"
                         @click="createReview(row.id)"
              >复习题库
              </el-button
              >
              <!--              <el-button type="primary" plain size="small">查看单词</el-button>-->
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

    <el-dialog title="编辑" draggable v-model="showDialog" :before-close="close" width="580px">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="词本名:" prop="bookName">
          <el-input v-model="form.bookName" placeholder="词本名" class="input form-input" />
        </el-form-item>
        <el-form-item label="分类:" prop="typeId">
          <el-select class="form-select" v-model="form.typeId" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.dataName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="简介:" prop="intro">
          <el-input
            class="form-textarea"
            v-model="form.intro"
            placeholder="简介"
            type="textarea"
            maxlength="35"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
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
              <span class="remarks ml15">注：建议尺寸：132px*178px</span>
              </template>
            </el-upload>
            <img :src="form.imgUrl" v-if="form.imgUrl" class="cover" />
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
  </div>
</template>

<script setup name="Vocabulary">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    bookName: '',
    status: '',
    typeId: ''
  },
  tableDataLoading: false,
  tableData: [],
  typeList: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  loading: false,
  showDialog: false,
  form: {
    typeId: '',
    bookName: '',
    id: '',
    imgUrl: '',
    intro: ''
  },
  formRules: {
    accountName: [{ required: true, message: '请输入', trigger: 'blur' }]
  },
  uploadLoading: false
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
  typeList,
  uploadLoading
} = toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

const importBookList = async (file) => {
  if (file.file.size / 1024 / 1024 > 10) {
    proxy.$modal.msgError('文件大小不能超过10MB')
    return false
  }
  let formData = new FormData()
  formData.append('file', file.file)
  try {
    uploadLoading.value = true
    await proxy.$http.content.importBook(formData)
    proxy.$modal.msgSuccess('操作成功!')
    uploadLoading.value = false
  } catch (e) {
    uploadLoading.value = false
    console.log(e, 'error')
  }
}

function edit(row) {
  form.value.typeId = row.dataId
  showDialog.value = true
  nextTick(() => {
    Object.keys(form.value).forEach((key) => {
      form.value[key] = row[key]
    })
    form.value.typeId=row.dataId
  })
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
    const { data, totalCount } = await proxy.$http.content.bookList(params)
    tableData.value = data
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
    const { data } = await proxy.$http.common.uploadFile(formData)
    form.value.imgUrl = data.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要上架吗？' : '确定要下架吗？').then(async () => {
    await proxy.$http.content.updateBookStatus({ id, type: 1 })
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}
const updateRecommend = async (id, status) => {
  proxy.$modal
    .confirm(status === 0 ? '确定要设为推荐吗？' : '确定要取消推荐吗？')
    .then(async () => {
      await proxy.$http.content.updateRecommend({ id, type: 2 })
      proxy.$modal.msgSuccess('操作成功!')
      getList()
    })
}
const createReview = async (id) => {
  proxy.$modal
    .confirm('确定要生成单词复习题库吗？')
    .then(async () => {
      await proxy.$http.content.createReview({ bookId:id })
      proxy.$modal.msgSuccess('操作成功!')
      getList()
    })
}
const submit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      await proxy.$http.content.editSubmit(form.value)
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
const getTypeList = async () => {
  try {
    const { data } = await proxy.$http.content.typeList()
    typeList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
getTypeList()
</script>

<style scoped lang="scss">
.cover {
  margin-top: 15px;
  min-width: 150px;
  max-width: 200px;
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
