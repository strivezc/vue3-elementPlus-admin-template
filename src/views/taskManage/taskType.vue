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
          <el-form-item label="类型名称" prop="typeName">
            <el-input
              v-model="formData.typeName"
              placeholder="请输入类型名称"
              name="userInfo"
              class="input"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="状态" prop="status">
            <el-select class="select" clearable v-model="formData.status" placeholder="请选择">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="启用" :value="0"></el-option>
              <el-option label="禁用" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="search" v-permission="'2000'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'2000'">清空选项</el-button>
            <el-button type="success" @click="add" v-permission="'2002'">新增类型</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="类型名称" prop="typeName"></el-table-column>
        <el-table-column align="center" label="赏金参考">
          <template #default="{ row }">
            <span>￥{{ row.bountySmall }}~￥{{ row.bountyBig }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型说明">
          <template #default="{ row }">
            <div class="duohang pointer" :title="row.typeExplain">{{ row.typeExplain }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template #default="{ row }">
            <el-input :disabled="!permisInput" v-model.number="row.sortIndex" placeholder="请输入数字" @change="changeIndex(row)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{row.status === 0 ? '启用' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改人/时间">
          <template #default="{ row }">
           {{row.updateUser}} ({{ row.updateTime }})
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'2003'"
                @click="edit(row)">
                编辑
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'2004'"
                @click="use(row)">
                {{row.status === 1 ? '启用' : '禁用'}}
              </el-button>
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
      :title="isEdit ? '编辑类型' : '添加类型'"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="500px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="top"
      >
      <el-form-item label="任务类型名称" prop="typeName">
          <el-input
            v-model="form.typeName"
            placeholder="请输入类型名称，10字以内"
            maxlength="10"
            show-word-limit
            class="input form-input"
          />
        </el-form-item>
        <el-form-item label="赏金参考范围" prop="bountySmall">
          <el-radio-group v-model="form.configType">
            <el-radio :label="1">
              手动配置：
              <el-input
                v-model="form.bountySmall"
                class="cash-input"
                oninput="value=value.replace(/\s+/g,'')"
              />
              <span class="cash-span">至</span>
              <el-input
                v-model="form.bountyBig"
                class="cash-input"
                oninput="value=value.replace(/\s+/g,'')"
              />
            </el-radio>
            <!-- <el-radio :label="2">系统统计：该类型平均赏金值  至  最高赏金值  （每周一更新）</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型说明" prop="typeExplain">
          <el-input
            class="form-textarea"
            v-model="form.typeExplain"
            type="textarea"
            maxlength="200"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
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

<script setup name="TaskType">
const { proxy } = getCurrentInstance()
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const state = reactive({
  permisInput: false,
  formData: {
    phone: '',
    typeName: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  msg: '',
  showDialog: false,
  isEdit: false,
  form: {
    configType: 1,
    id: '',
    typeName: '',
    typeExplain: '',
    bountySmall: '',
    bountyBig: ''
  }
})
const positive = /^(?:[1-9]\d{0,3}(?:\.\d{1,2})?|0\.(?:[1-9]\d?|0[1-9]\d?)\d?)$/
const validateNewPwd = (rule, value, callback) => {
  console.log(positive.test(form.value.bountySmall), form.value.bountySmall)
  if (!(form.value.bountySmall && form.value.bountyBig)) {
    callback(new Error('请输入赏金参考范围!'))
  } else if (!(positive.test(form.value.bountySmall) && positive.test(form.value.bountyBig))) {
    callback(new Error('请输入0.01-9999.99的数值，仅限两位小数!'))
  } else if (form.value.bountySmall * 1 >= form.value.bountyBig * 1) {
    callback(new Error('前边界值不可大于或等于后边界值!'))
  } else {
    callback()
  }
}
const formRules = ref({
  typeName: [{ required: true, message: '请输入类型名称！', trigger: 'blur' }],
  bountySmall: [{ required: true, trigger: 'blur', validator: validateNewPwd }],
  typeExplain: [{ required: true, message: '请填写类型说明！', trigger: 'blur' }],
})

const ruleFormRef = ref()
const { permisInput, formData, tableDataLoading, tableData, total, listQuery, msg, showDialog, isEdit, form } = toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
  form.value.id = ''
  form.value.bountyBig = ''
}

function add() {
  isEdit.value = false
  showDialog.value = true
}

const edit = (row) => {
  isEdit.value = true
  nextTick(() => {
    Object.keys(form.value).forEach((key) => {
      form.value[key] = row[key]
    })
  })
  showDialog.value = true
}

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    phone: '',
    typeName: ''
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
    const { data, totalCount } = await proxy.$http.task.queryTaskType(params)
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
      if (form.value.id) {
        await proxy.$http.task.updateTaskType(form.value)
      } else {
        await proxy.$http.task.addTaskType(form.value)
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
const changeIndex = async(row) => {
  const num3 = /^[0-9]\d*$/
  if (!num3.test(row.sortIndex)) {
    proxy.$modal.msgError('请填写大于等于0的排列顺序')
    row.sortIndex = ''
    return
  }
  await proxy.$http.task.updateTaskTypeSortIndex({id: row.id, sortIndex: row.sortIndex})
  proxy.$modal.msgSuccess('操作成功!')
  getList()
}
function use(row) {
  if (row.status) {
    msg.value = '您确定要启用该任务类型？'
  } else {
    msg.value = '您确定要禁用该任务类型？'
  }
  proxy.$modal.confirm(msg.value, '提示').then(async () => {
    await proxy.$http.task.updateTaskTypeStatus({id: row.id, status: row.status === 0 ? 1 : 0})
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}
permisInput.value = userStore.menuList.includes('2005')
search()
</script>

<style scoped lang="scss">
.form-input, .form-textarea{
  width: 100% !important;
}
.cash-input{
  width: 150px !important;
}
.cash-span{
  margin: 0 10px;
}
</style>
