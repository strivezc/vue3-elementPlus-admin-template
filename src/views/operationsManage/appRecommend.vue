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
          <el-form-item label="平台">
            <el-radio-group v-model="formData.platformType">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">ios</el-radio>
              <el-radio :label="1">android</el-radio>
            </el-radio-group>
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
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList" v-permission="'3700'"
            >查询</el-button
            >
            <el-button type="success" @click="add" v-permission="'3702'">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="id" prop="id"></el-table-column>
        <el-table-column align="center" label="点击数" prop="clickNum"></el-table-column>
        <el-table-column align="center" label="平台">
          <template #default="{ row }">
            {{ row.platformType === 1 ? '安卓' : 'ios' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="图片" width="180px">
          <template #default="{ row }">
            <div class="img">
              <ImagePreview :src="row.imgUrl"></ImagePreview>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="简介" prop="introduce"></el-table-column>
        <el-table-column align="center" label="下载链接" prop="linkUrl"></el-table-column>
        <el-table-column align="center" label="排序" prop="sortIndex"></el-table-column>
        <el-table-column align="center" label="标题" prop="title"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '下架' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                  type="danger"
                  v-permission="'3704'"
                  plain
                  size="small"
                  v-if="row.status === 0"
                  @click="updateStatus(row.id, 1)"
              >下架
              </el-button>
              <el-button
                  type="primary"
                  v-permission="'3704'"
                  plain
                  size="small"
                  v-else
                  @click="updateStatus(row.id, 0)"
              >上架
              </el-button>
              <el-button type="primary" plain size="small" @click="edit(row)" v-permission="'3703'"
              >编辑</el-button
              >
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
        width="600px"
        top="8vh"
    >
      <el-form
          :model="form"
          :rules="formRules"
          label-position="right"
          label-width="90px"
          ref="ruleFormRef"
      >
        <el-form-item label="平台:" prop="platformType">
          <el-radio-group v-model="form.platformType" :disabled="isEdit">
            <el-radio :label="1">安卓</el-radio>
            <el-radio :label="0">ios</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="简介:" prop="introduce">
          <el-input
              class="form-textarea"
              v-model="form.introduce"
              maxlength="50"
              placeholder="简介"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              show-word-limit
          />
        </el-form-item>
        <el-form-item label="下载地址:" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="下载地址" class="form-input" />
        </el-form-item>
        <el-form-item label="标题:" prop="title">
          <el-input v-model="form.title"  maxlength="20" show-word-limit placeholder="标题" class="form-input" />
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
        <el-form-item prop="imgUrl" label="图片">
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
              <span class="remarks ml15">注：建议尺寸：120px*120px</span>
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

<script setup name="AppRecommend">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    platformType: '',
    status: '',
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
  isEdit: false
})
const {
  formData,
  tableDataLoading,
  tableData,
  total,
  listQuery,
  showDialog,
  loading,
  isEdit,
} = toRefs(state)

const form = ref({
  id: '',
  imgUrl: '',
  introduce: '',
  linkUrl: '',
  platformType: '',
  sortIndex: '',
  title: '',
})
const validateSortIndex = (rule, value, callback) => {
  if (isEdit.value && !value) {
    callback(new Error('请输入排序!'))
  } else {
    callback()
  }
}
const formRules = ref({
  imgUrl: [{ required: true, trigger: 'change', message: '请上传图片!' }],
  introduce: [{ required: true, trigger: 'blur', message: '请输入简介!' }],
  linkUrl: [{ required: true, trigger: 'blur', message: '请输入下载链接!' }],
  platformType: [{ required: true, trigger: 'change ', message: '请选择平台类型!' }],
  sortIndex: [{ required: true, trigger: 'blur', validator: validateSortIndex, }],
  title: [{ required: true, trigger: 'blur', message: '请输入标题!' }]
})
const ruleFormRef = ref()

function add() {
  showDialog.value = true
  isEdit.value = false
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
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
    const { data, totalCount } = await proxy.$http.operation.queryAppRecommend(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const submit = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        await proxy.$http.operation.updateAppRecommend(form.value)
      } else {
        await proxy.$http.operation.addAppRecommend(form.value)
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要上架吗？' : '确定要下架吗？').then(async () => {
    await proxy.$http.operation.updateAppRecommendStatus({id, status})
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}

function edit(row) {
  isEdit.value = true
  showDialog.value = true
  nextTick(() => {
    Object.keys(form.value).forEach((key) => {
      form.value[key] = row[key]
    })
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
    const { data } = await proxy.$http.common.uploadFile(formData)
    form.value.imgUrl = data.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
  .img {
    max-width: 260px;
    max-height: 85px;
  }
  .cover {
    margin-top: 15px;
    min-width: 100px;
    max-width: 200px;
  }
</style>
