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
            <el-select
              class="select"
              v-model="formData.id"
              clearable
              placeholder="请选择"
              @change="changeSubject"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="item in subjectDownList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="分类">
            <el-select class="select" clearable v-model="formData.typeId" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option
                v-for="item in typeDownList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList" v-permission="'2100'"
              >查询</el-button
            >
            <el-button type="success" @click="addTopic" v-permission="'2102'">新增专题</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="专题名称" prop="subjectName"></el-table-column>
        <el-table-column align="center" label="分类名称" prop="typeName"></el-table-column>
        <el-table-column align="center" label="排序" prop="sortIndex"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
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
                v-permission="'2106'"
                plain
                size="small"
                v-if="row.status === 0"
                @click="updateStatus(row.id, 1)"
                >下架
              </el-button>
              <el-button
                type="primary"
                v-permission="'2106'"
                plain
                size="small"
                v-else
                @click="updateStatus(row.id, 0)"
                >上架</el-button
              >
              <el-button
                type="primary"
                plain
                size="small"
                v-if="!row.parentId"
                v-permission="'2103'"
                @click="editSubject(row)"
                >编辑</el-button
              >
              <el-button
                type="primary"
                plain
                size="small"
                v-if="!row.parentId"
                v-permission="'2104'"
                @click="addType(row)"
                >新增分类</el-button
              >
              <el-button
                v-if="row.parentId"
                type="primary"
                plain
                size="small"
                v-permission="'2105'"
                @click="editType(row)"
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
      :title="isEditType ? '编辑分类' : '新增分类'"
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
        label-width="90px"
      >
        <el-form-item label="所属专题">
          <el-select class="form-select" v-model="form.parentId" placeholder="请选择">
            <el-option
              disabled
              v-for="item in subjectDownList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称:" prop="typeName">
          <el-input
            v-model="form.typeName"
            maxlength="20"
            placeholder="分类名称"
            class="input form-input"
          />
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
                <span class="remarks ml15">注：建议尺寸：140px*140px</span>
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

    <el-dialog
      :title="isEditSubject ? '编辑专题' : '新增专题'"
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
        <el-form-item label="专题名称:" prop="subjectName">
          <el-input
            v-model="formTopic.subjectName"
            placeholder="专题名称"
            maxlength="10"
            class="input form-input"
          />
        </el-form-item>
        <el-form-item label="排序:" prop="sortIndex">
          <el-input
            v-model="formTopic.sortIndex"
            type="number"
            oninput="if(value>99999)value=99999;if(value.length>5)value=value.slice(0,5);if(value<1)value=''"
            placeholder="排序"
            class="input form-input"
          />
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

const isEditSubject = ref(false)
const isEditType = ref(false)

const validateSortIndex = (rule, value, callback) => {
  if (isEditSubject.value && !value) {
    callback(new Error('请输入排序!'))
  } else {
    callback()
  }
}
const validateTypeSortIndex = (rule, value, callback) => {
  if (isEditType.value && !value) {
    callback(new Error('请输入排序!'))
  } else {
    callback()
  }
}
const state = reactive({
  formData: {
    id: '',
    typeId: ''
  },
  tableDataLoading: false,
  subjectDownList: [],
  typeDownList: [],
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  loading: false,
  showDialog: false,
  form: {
    id: '',
    imgUrl: '',
    parentId: '',
    sortIndex: '',
    typeName: ''
  },
  formRules: {
    imgUrl: [{ required: true, message: '请上传封面图！', trigger: 'blur' }],
    typeName: [{ required: true, message: '请输入分类名称！', trigger: 'blur' }],
    parentId: [{ required: true, message: '请选择所属专题！', trigger: 'blur' }],
    sortIndex: [{ required: true, validator: validateTypeSortIndex, trigger: 'blur' }]
  },

  showDialogTopic: false,
  formTopic: {
    id: '',
    subjectName: '',
    sortIndex: ''
  },
  formRulesTopic: {
    subjectName: [{ required: true, message: '请输入专题名称！', trigger: 'blur' }],
    sortIndex: [{ required: true, validator: validateSortIndex, trigger: 'blur' }]
  }
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
  subjectDownList,
  typeDownList
} = toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function closeTopic() {
  showDialogTopic.value = false
  topicFormRef.value.resetFields()
}
function addTopic() {
  isEditSubject.value = false
  showDialogTopic.value = true
}

function addType(row) {
  isEditType.value = false
  showDialog.value = true
  form.value.parentId = row.id
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
    const { data, totalCount } = await proxy.$http.operation.queryInfo(params)
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
    const { data } = await uploadFile(formData)
    form.value.imgUrl = data.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
const submitTopic = async () => {
  await topicFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (isEditSubject.value) {
        await proxy.$http.operation.updateSubject(formTopic.value)
      } else {
        await proxy.$http.operation.addSubject(formTopic.value)
        getSubjectDownList()
      }
      proxy.$modal.msgSuccess('操作成功!')
      closeTopic()
      getList()
    } else {
      console.log('error submit!', fields)
    }
  })
}
const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (isEditType.value) {
        await proxy.$http.operation.updateSubjectType(form.value)
      } else {
        await proxy.$http.operation.addSubjectType(form.value)
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    } else {
      console.log('error submit!', fields)
    }
  })
}
const getSubjectDownList = async () => {
  try {
    const { data } = await proxy.$http.operation.querySubjectDownList()
    subjectDownList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
const getTypeDownList = async () => {
  try {
    const { data } = await proxy.$http.operation.queryTypeDownList(formData.value.id)
    typeDownList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}

function changeSubject(val) {
  formData.value.typeId = ''
  if (val) {
    getTypeDownList()
  }
}

const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要上架吗？' : '确定要下架吗？').then(async () => {
    await proxy.$http.operation.updateInfoStatus({ id, status })
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}

function editSubject(row) {
  isEditSubject.value = true
  showDialogTopic.value = true
  nextTick(() => {
    Object.keys(formTopic.value).forEach((key) => {
      formTopic.value[key] = row[key]
    })
  })
}
function editType(row) {
  isEditType.value = true
  showDialog.value = true
  nextTick(() => {
    Object.keys(form.value).forEach((key) => {
      form.value[key] = row[key]
    })
  })
}

getSubjectDownList()
</script>

<style scoped lang="scss">
.cover {
  margin-top: 15px;
  min-width: 140px;
  max-width: 280px;
}

.remarks {
  color: #ff574e;
  font-size: 14px;
}
</style>
