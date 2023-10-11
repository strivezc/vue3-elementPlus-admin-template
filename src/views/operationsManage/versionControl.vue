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
            <el-radio-group v-model="formData.type">
              <el-radio label="">全部</el-radio>
              <el-radio :label="1">安卓</el-radio>
              <el-radio :label="2">ios</el-radio>
            </el-radio-group>
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
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="版本号">
            <el-input v-model="formData.versionNo" placeholder="版本号" class="input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList" v-permission="'3300'"
          >查询</el-button
        >
        <el-button type="success" @click="add" v-permission="'3302'">新增</el-button>
        <el-button type="warning" @click="queryAppVersionNumber" v-permission="'3305'">app审核状态管理</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="平台">
          <template #default="{ row }">
            {{ row.type === 1 ? '安卓' : 'ios' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="版本号" prop="versionNo"></el-table-column>
        <el-table-column align="center" label="强制更新">
          <template #default="{ row }">
            {{ row.forceUpdate === 1 ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新内容" prop="text"></el-table-column>
        <el-table-column align="center" label="创建人" prop="createUser"></el-table-column>
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
                v-permission="'3304'"
                plain
                size="small"
                v-if="row.status === 0"
                @click="updateStatus(row.id, 1)"
                >下架
              </el-button>
              <el-button
                type="primary"
                v-permission="'3304'"
                plain
                size="small"
                v-else
                @click="updateStatus(row.id, 0)"
                >上架
              </el-button>
              <el-button type="primary" plain size="small" @click="edit(row)" v-permission="'3303'"
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
      :title="isEdit ? '编辑版本信息' : '新增版本信息'"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="650px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        label-position="right"
        label-width="90px"
        ref="ruleFormRef"
      >
        <el-form-item label="平台:" prop="type">
          <el-radio-group v-model="form.type" :disabled="isEdit" @change="changeType">
            <el-radio :label="1">安卓</el-radio>
            <el-radio :label="2">ios</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="版本号:" prop="versionNo" :disabled="isEdit">
          <el-input v-model="form.versionNo" placeholder="版本号" class="form-input" />
        </el-form-item>
        <el-form-item label="更新内容:" prop="text">
          <el-input
            class="form-textarea"
            v-model="form.text"
            placeholder="更新内容"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="下载地址:" prop="downloadUrl">
          <el-input v-model="form.downloadUrl" placeholder="下载地址" class="form-input" />
        </el-form-item>
        <el-form-item label="更新版本范围:" label-width="115px" prop="beginNo">
          <el-select class="small-select" clearable v-model="form.beginNo" placeholder="请选择">
            <el-option
              v-for="item in versionList"
              :key="item.innerVersion"
              :label="item.versionNo"
              :value="item.innerVersion"
            />
          </el-select>
          <span class="date-line">-</span>
          <el-select class="small-select" clearable v-model="form.endNo" placeholder="请选择">
            <el-option
              v-for="item in versionList"
              :key="item.innerVersion"
              :label="item.versionNo"
              :value="item.innerVersion"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="强制升级:" prop="forceUpdate">
          <el-radio-group v-model="form.forceUpdate">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="0">是</el-radio>
          </el-radio-group>
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
        title="app审核状态"
        draggable
        v-model="showStatus"
        :before-close="closeStatus"
        width="500px"
    >
      <el-form
          :model="formStatus"
          :rules="formStatusRules"
          label-width="115px"
          label-position="right"
          ref="remFormStatus"
      >
        <el-form-item label="平台类型:" prop="type">
          <el-radio-group v-model="formStatus.type" @change="queryAppVersionNumber">
            <el-radio :label="0">ios</el-radio>
            <el-radio :label="1">Android</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="版本号:" prop="versionNum">
          <el-input v-model="formStatus.versionNum" placeholder="版本号" class="input form-input"/>
        </el-form-item>
        <el-form-item label="设置审核状态:" prop="status">
          <el-radio-group v-model="formStatus.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">审核</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeStatus">取消</el-button>
          <el-button type="primary" @click="submitStatus">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="VersionControl">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    status: 0,
    type: '',
    versionNo: ''
  },
  tableDataLoading: false,
  tableData: [],
  versionList: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showStatus: false,
  showDialog: false,
  isEdit: false
})
const form = ref({
  id: '',
  versionNo: '',
  type: 1,
  text: '',
  forceUpdate: '',
  beginNo: '',
  endNo: '',
  downloadUrl: ''
})
const validateBeginNo = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择开始版本号!'))
  } else if (!form.value.endNo) {
    callback(new Error('请选择结束版本号!'))
  } else {
    callback()
  }
}
const formRules = ref({
  versionNo: [{ required: true, trigger: 'blur', message: '请输入版本号!' }],
  type: [{ required: true, trigger: 'change', message: '请选择平台类型!' }],
  text: [{ required: true, trigger: 'blur', message: '请输入更新内容!' }],
  downloadUrl: [{ required: true, trigger: 'blur', message: '请输入下载地址!' }],
  forceUpdate: [{ required: true, trigger: 'change', message: '请选择是否强制更新!' }]
  // beginNo: [{ required: true, trigger: 'change', validator: validateBeginNo }]
})
const formStatus = ref({
  status: 1,
  type: 0,
  versionNum: ''
})
const validateVersionNum = (rule, value, callback) => {
  const reg =/^\d{1,2}\.\d{1,2}\.\d{1,2}$/
  if (!value) {
    callback(new Error('请输入版本号!'))
  } else if (!reg.test(value)) {
    callback(new Error('格式不正确,x.x.x的形式,x最多两位数!'))
  } else {
    callback()
  }
}
const formStatusRules = ref({
  versionNum: [{ required: true, trigger: 'blur',validator: validateVersionNum }],
  status: [{ required: true, trigger: 'change', message: '请选择审核状态!' }],
  type: [{ required: true, trigger: 'change', message: '请选择平台类型!' }],
})
const remFormStatus = ref()
const ruleFormRef = ref()
const {
  formData,
  tableDataLoading,
  tableData,
  total,
  listQuery,
  showDialog,
  showStatus,
  isEdit,
  versionList
} = toRefs(state)

function add() {
  showDialog.value = true
  isEdit.value = false
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function closeStatus() {
  showStatus.value = false
  remFormStatus.value.resetFields()
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
    const { data, totalCount } = await proxy.$http.operation.versionList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}

const queryAppVersionNumber=async ()=>{
  try {
    const {data} =await proxy.$http.operation.queryVersionReview(formStatus.value.type)
    if (data) {
      showStatus.value = true
      nextTick(()=>{
        formStatus.value.versionNum=data.versionNum
        formStatus.value.status=data.status
      })
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
const submit = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        await proxy.$http.operation.editVersion(form.value)
      } else {
        await proxy.$http.operation.addVersion(form.value)
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
const submitStatus = async () => {
  remFormStatus.value.validate(async (valid) => {
    if (valid) {
      await proxy.$http.operation.versionReview(formStatus.value)
      proxy.$modal.msgSuccess('操作成功!')
      closeStatus()
      getList()
    }
  })
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要上架吗？' : '确定要下架吗？').then(async () => {
    await proxy.$http.operation.updateStatus(id)
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

const getVersionList = async () => {
  try {
    const { data } = await proxy.$http.operation.queryVersion(form.value.type)
    state.versionList = data
  } catch (e) {
    console.log(e, 'error')
  }
}

function changeType(type) {
  form.value.beginNo = ''
  form.value.endNo = ''
  getVersionList()
}

getVersionList()
</script>

<style scoped lang="scss">
  .red {
    color: #ff574e;
  }

  .text {
    margin: 0 0 0 68px;
    line-height: 20px;
  }
  .el-text{
    cursor: pointer;
    margin-left: 15px;
  }
</style>
