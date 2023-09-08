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
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="用户编号" prop="userId">
            <el-input
              v-model="formData.userId"
              placeholder="用户编号"
              autocomplete="on"
              name="userInfo"
              class="input"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="formData.beginDate"
              value-format="yyyy-MM-dd"
              type="date"
              class="date"
              placeholder="选择日期"
            />
            <span class="date-line">-</span>
            <el-date-picker
              v-model="formData.endDate"
              value-format="yyyy-MM-dd"
              type="date"
              class="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="手机号码"
              autocomplete="on"
              name="phone"
              class="input"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="用户编号" prop="id"></el-table-column>
        <el-table-column align="center" label="用户名" prop="userName"></el-table-column>
        <el-table-column align="center" label="注册时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="手机号码" prop="hidePhone"></el-table-column>
        <el-table-column align="center" label="年龄" prop="age"></el-table-column>
        <el-table-column align="center" label="职业/年级" prop="gradeName"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button type="primary" plain size="small" @click="AIUseSet(row)"
                >AI使用设置</el-button
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
      title="AI使用设置"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="630px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="类型:" prop="type">
          <el-radio-group v-model="form.type" @change="changeType">
            <el-radio :label="1">无限制</el-radio>
            <el-radio :label="2">按次计算</el-radio>
            <el-radio :label="3">按tokens计算</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用量:" prop="useNum">
          <el-input
            v-model="form.useNum"
            type="number"
            oninput="if(value>999999)value=999999;if(value.length>6)value=value.slice(0,6);if(value<1)value=''"
            :disabled="form.type === 1"
            placeholder="用量"
            class="input form-input"
          />
          <span class="remarks ml15">注：次数或者tokens</span>
        </el-form-item>
        <el-form-item label="有效期:" prop="validDate">
          <el-date-picker
            :disabled="form.type === 1 || form.type === 2"
            v-model="form.validDate"
            value-format="yyyy-MM-dd"
            type="date"
            class="form-date"
            placeholder="选择日期"
          />
          <span class="remarks ml15">注：按tokens计算时可选填，不填写不过期</span>
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

<script setup name="Student">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    beginDate: '',
    endDate: '',
    phone: '',
    userId: ''
  },
  tableDataLoading: false,
  tableData: [{}],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showDialog: false
})
const form = ref({
  type: '',
  userId: '',
  useNum: '',
  validDate: ''
})
const validateUseNum = (rule, value, callback) => {
  if (!value && (form.value.type === 2 || form.value.type === 3)) {
    callback(new Error('请输入用量!'))
  } else {
    callback()
  }
}
const formRules = ref({
  type: [{ required: true, message: '请选择状态！', trigger: 'change' }],
  useNum: [{ required: true, validator: validateUseNum, trigger: 'change' }]
})

const ruleFormRef = ref()
const { formData, tableDataLoading, tableData, total, listQuery, showDialog } = toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

const AIUseSet = async (row) => {
  form.value.userId = row.id
  try {
    const { data } = proxy.$http.user.userList(params)
    form.value.type = data.type
    form.value.useNum = data.useNum
    form.value.validDate = data.validDate
    showDialog.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}

function search() {
  listQuery.value.currPage = 1
  getList()
}

function changeType(val) {
  if (val === 1) {
    form.value.useNum = ''
    form.value.validDate = ''
  } else if (val === 2) {
    form.value.validDate = ''
  }
}
const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value
    }
    const { data, totalCount } = await proxy.$http.user.userList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const submit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      await proxy.$http.user.addRobotConfig(form.value)
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
</script>

<style scoped lang="scss">
.student {
}
</style>
