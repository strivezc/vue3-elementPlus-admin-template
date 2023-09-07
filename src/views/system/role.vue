<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-form-item label="描述">
        <el-input v-model="formData.roleName" placeholder="描述" class="input" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.status">
          <el-radio :label="-1">不限</el-radio>
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
        <el-button type="success" @click="add">添加角色</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="角色描述" prop="roleName"></el-table-column>
        <el-table-column align="center" label="包含用户" prop="userName"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status == 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="primary"
                plain
                @click="deleteItem(row.roleId, row.status)"
                size="small"
              >
                {{ row.status == 1 ? '恢复' : '删除' }}
              </el-button>
              <el-button type="primary" plain size="small" @click="setLimit(row.roleId)"
                >设置权限</el-button
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
    <el-dialog title="添加角色" draggable v-model="showDialog" :before-close="close" width="500px">
      <el-form :model="form" :rules="formRules" ref="ruleFormRef">
        <el-form-item label="角色描述:" prop="roleName">
          <el-input v-model="form.roleName" placeholder="角色描述" class="form-input" />
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

<script setup name="Role">
const router = useRouter()
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    status: -1,
    roleName: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showDialog: false,
  form: {
    roleName: ''
  },
  formRules: {
    roleName: [{ required: true, message: '请输入角色描述!', trigger: 'blur' }]
  }
})
const ruleFormRef = ref()
const { formData, tableDataLoading, tableData, total, listQuery, form, formRules, showDialog } =
  toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}
function add() {
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
    const { data, totalCount } = await proxy.$http.user.roleManage(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}

const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await proxy.$http.user.addRole(form.value.roleName)
        close()
        proxy.$modal.msgSuccess('新增成功!')
      } catch (e) {
        console.log(e, 'error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

function deleteItem(roleId, status) {
  let text = ''
  let sendStatus = null
  if (status == 0) {
    sendStatus = 1
    text = '确定要删除该角色？'
  } else if (status == 1) {
    sendStatus = 0
    text = '确定要恢复该角色？'
  }
  proxy.$modal.confirm(text).then(async () => {
    try {
      const params = { roleId, status: sendStatus }
      await proxy.$http.user.updateRoleStatus(params)
      getList()
    } catch (e) {
      console.log(e, 'error')
    }
  })
}
function setLimit(roleId) {
  router.push({ path: '/system/roleLimit', query: { roleId } })
}
</script>

<style scoped lang="scss"></style>
