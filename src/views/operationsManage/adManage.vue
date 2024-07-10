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
          <el-form-item label="位置">
            <el-select class="select" clearable v-model="formData.type" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="移动端首页顶部广告位" :value="0" />
              <el-option label="小程序首页顶部广告位" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="广告标题">
            <el-input v-model="formData.title" placeholder="广告标题" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="是否过期">
            <el-radio-group v-model="formData.invalid">
              <el-radio label="">不限</el-radio>
              <el-radio :label="0">未过期</el-radio>
              <el-radio :label="1">已过期</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList" v-permission="'3200'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'3200'">清空选项</el-button>
            <el-button type="success" @click="add" v-permission="'3202'">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="位置">
          <template #default="{ row }">
            <span v-if="row.type === 0">移动端首页顶部广告位</span>
            <span v-if="row.type === 1">小程序首页顶部广告位</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题" prop="title"></el-table-column>
        <el-table-column align="center" label="目标链接" prop="linkUrl"></el-table-column>
        <el-table-column align="center" label="链接类型">
          <template #default="{ row }">
            <span v-if="row.linkType === 1">普通链接</span>
            <span v-if="row.linkType === 2">小程序路径</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="广告图">
          <template #default="{ row }">
            <div class="img">
              <ImagePreview :src="row.imgUrl" fit="fill" custom-img-class="img"></ImagePreview>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="失效时间" prop="failTime"></el-table-column>
        <el-table-column align="center" label="点击量" prop="clickNum"></el-table-column>
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
                plain
                size="small"
                v-permission="'3204'"
                v-if="row.status === 0"
                @click="updateStatus(row.id, 1)"
                >下架
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'3204'"
                v-else
                @click="updateStatus(row.id, 0)"
                >上架
              </el-button>
              <el-button type="primary" plain size="small" @click="edit(row)" v-permission="'3203'"
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
      :title="isEdit ? '编辑广告' : '新增广告'"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="550px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="广告位置:" prop="type">
          <el-select
            class="form-select"
            clearable
            :disabled="isEdit"
            v-model="form.type"
            placeholder="请选择"
            @change="chooseType"
          >
            <el-option label="移动端首页顶部广告位" :value="0" />
            <el-option label="小程序首页顶部广告位" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告标题:" prop="title">
          <el-input
            v-model="form.title"
            placeholder="广告标题"
            maxlength="50"
            show-word-limit
            class="input form-input"
          />
        </el-form-item>
        <el-form-item label="链接类型:" prop="linkType">
          <el-select
            class="form-select"
            clearable
            v-model="form.linkType"
            placeholder="请选择"
          >
            <el-option label="普通链接" :value="1" v-if="form.type === 0" />
            <el-option label="小程序路径" :value="2" v-if="form.type === 1" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标链接:" prop="linkUrl">
          <el-input
            v-model="form.linkUrl"
            placeholder="目标链接"
            maxlength="300"
            show-word-limit
            class="input form-input"
          />
        </el-form-item>
        <el-form-item label="过期时间:" prop="failTime">
          <el-date-picker
            v-model="form.failTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            class="form-date"
            placeholder="选择日期"
            :disabledDate="disabledDate"
          />
        </el-form-item>
        <el-form-item prop="imgUrl" label="广告图片">
          <div class="flex-column">
            <el-upload
                ref="barrierImg"
                :http-request="uploadImg"
                action=""
                :show-file-list="false"
                accept=".jpg, .jpeg, .png"
            >
              <el-button type="warning" :loading="loading">点击上传</el-button>
              <template #tip>
                <span class="remarks ml15">注：建议尺寸：{{suggestImgSize[form.type] || suggestImgSize[0]}}</span>
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

<script setup name="AdManage">
const suggestImgSize = ['686px * 304px']
const { proxy } = getCurrentInstance()
const http = /^(http|https):\/\/[^ "]+$/
const valiHttp = (rule, value, callback) => {
  if (value && form.value.type === 0 && !http.test(value)){
    callback(new Error('请输入带http或https的网址!'))
  } else {
    callback()
  }
}
const state = reactive({
  formData: {
    invalid: '',
    status: '',
    title: '',
    type: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  disabledDate(date) {
    return date.getTime() < new Date().getTime() - 8.64e7
  },
  loading: false,
  showDialog: false,
  form: {
    failTime: '',
    id: '',
    imgUrl: '',
    linkUrl: '',
    title: '',
    type: '',
    linkType: ''
  },
  formRules: {
    imgUrl: [{ required: true, message: '请上传图片！', trigger: 'blur' }],
    title: [{ required: true, message: '请输入标题！', trigger: 'blur' }],
    linkUrl: [{ required: false, trigger: 'blur', validator: valiHttp }],
    type: [{ required: true, message: '请选择广告位置！', trigger: 'change' }],
    linkType: [{ required: true, message: '请选择链接类型！', trigger: 'change' }]
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
  disabledDate,
  isEdit
} = toRefs(state)

function add() {
  isEdit.value = false
  showDialog.value = true
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
  form.value.id = ''
}

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    invalid: '',
    status: '',
    title: '',
    type: ''
  }
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
    const { data, totalCount } = await proxy.$http.operation.queryAdManageList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要上架吗？' : '确定要下架吗？').then(async () => {
    await proxy.$http.operation.updateWebAdvStatus({ id, status })
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}
const submit = async () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      await proxy.$http.operation.addAdv(form.value)
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
function chooseType() {
  form.value.linkType = ''
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
search()
</script>

<style scoped lang="scss">
.cover {
  margin-top: 15px;
  min-width: 150px;
  max-width: 300px;
}

.remarks {
  color: #ff574e;
  font-size: 14px;
}

:deep(.img img){
  max-width: 260px;
  max-height: 85px;
}
</style>
