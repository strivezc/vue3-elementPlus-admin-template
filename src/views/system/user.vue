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
          <el-form-item label="用户">
            <el-input v-model="formData.userName" placeholder="邮箱/用户名/姓名" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="角色:">
            <el-select class="select" clearable v-model="formData.roleId" placeholder="请选择">
              <el-option label="全部" :value="-1"></el-option>
              <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态:">
            <el-radio-group v-model="formData.status">
              <el-radio :label="-1">不限</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="多用户同时查询权限:">
            <el-checkbox v-model="formData.validation" :true-label="1" :false-label="0"
              >全部开启</el-checkbox
            >
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="success" @click="refreshCache">刷新缓存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="编号" prop="createTime"></el-table-column>
        <el-table-column align="center" label="用户名" prop="createTime"></el-table-column>
        <el-table-column align="center" label="姓名" prop="createTime"></el-table-column>
        <el-table-column align="center" label="邮箱" prop="createTime"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="角色" prop="createTime"></el-table-column>
        <el-table-column align="center" label="多用户同时查询权限">
          <template #default="{ row }">
            {{ row.vip == 0 ? '其他' : '全部开启' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status == 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button type="primary" size="small" class="btn" @click="deleteItem(row)" plain>
                {{ row.status == 1 ? '恢复' : '删除' }}
              </el-button>
              <el-button type="primary" size="small" class="btn" @click="edit(row.userId)" plain
                >编辑
              </el-button>
              <el-button
                type="primary"
                size="small"
                class="btn"
                @click="openLimit(row.userId, 1)"
                plain
                >多用户同时查询权限
              </el-button>
              <el-button
                type="primary"
                class="btn"
                size="small"
                @click="openLimit(row.userId, 2)"
                plain
                >手机号码查询可见权限
              </el-button>
              <el-button
                type="primary"
                class="btn"
                size="small"
                @click="openLimit(row.userId, 3)"
                plain
                >手机号码导出可见权限
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
  </div>
</template>

<script setup name="User">
const { proxy } = getCurrentInstance()

const state = reactive({
  roleOptions: [],
  formData: {
    userName: '',
    roleId: -1,
    validation: 0,
    status: 0
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  deleteParams: {
    userId: 0,
    status: 1,
    remark: ''
  }
})
const { formData, tableDataLoading, tableData, total, listQuery, roleOptions, deleteParams } =
  toRefs(state)

const getAllRoleList = async () => {
  try {
    const { data } = await proxy.$http.user.getAllRole()
    roleOptions.value = data || []
  } catch (e) {
    console.log(e, 'error')
  }
}
const deleteRole = async (params) => {
  try {
    await proxy.$http.user.updateAdminUserStatus(params)
    getList()
  } catch (e) {
    console.log(e)
  }
}

function deleteItem(row) {
  const { userId, status } = row
  let text = ''
  let sendStatus = null
  if (status == 0) {
    deleteParams.value.remark = ''
    deleteParams.value.userId = userId
    ElMessageBox.prompt('确定要删除该角色', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      cancelButtonClass: 'btn-custom-cancel',
      autofocus: false,
      inputValidator: (value) => {
        if (value ?? '' === '') {
          return true
        }
        return !(value.length > 200)
      },
      inputErrorMessage: '最多输入200字符!'
    }).then(({ value }) => {
      deleteParams.value.remark = value
      deleteRole(deleteParams.value)
    })
  } else if (status == 1) {
    sendStatus = 0
    text = '确定要恢复该角色？'
    proxy.$modal.confirm(text).then(async () => {
      const params = { userId, status: sendStatus, remark: '' }
      deleteRole(params)
    })
  }
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
    const { data, totalCount } = await proxy.$http.user.adminUserManage(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const refreshCache = async () => {
  try {
    await proxy.$http.user.flushDataPermissionCache()
    proxy.$modal.msgSuccess('操作成功!')
  } catch (e) {
    console.log(e, 'error')
  }
}

function openLimit(id, type) {
  this.$router.push({ name: 'UserLimit', query: { id, type } })
}

function edit(id) {
  this.$router.push({ name: 'EditUser', query: { id } })
}

getAllRoleList()
</script>

<style scoped lang="scss"></style>
