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
          <el-form-item label="客户/品牌名称" prop="keyword">
            <el-input
              v-model="formData.keyword"
              placeholder="请输入名称"
              name="userInfo"
              class="input"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="状态" prop="accountStatus">
            <el-select class="select" clearable v-model="formData.accountStatus" placeholder="请选择">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="正常" :value="0"></el-option>
              <el-option label="封禁" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="search" v-permission="'1000'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'1000'">清空选项</el-button>
            <el-button type="success" @click="add" v-permission="'1002'">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="客户全称" prop="companyName"></el-table-column>
        <el-table-column align="center" label="品牌名称" prop="brandName"></el-table-column>
        <el-table-column align="center" label="超管账号" prop="superManageAccount"></el-table-column>
        <el-table-column align="center" label="余额(元)" prop="balance"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.accountStatus === 0 ? '正常' : '封禁' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="对接人">
          <template #default="{ row }">
           {{row.contactPerson}} ({{ row.phone }})
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
                v-permission="'1000'"
                @click="detail(row.id)">
                详情
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'1003'"
                @click="edit(row.id)">
                编辑
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'1005'"
                @click="resetPSW(row)">
                重置密码
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'1004'"
                @click="task(row)">
                {{row.taskReviewStatus === 1 ? '开启' : '关闭'}}任务审查
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
    <el-drawer v-model="drawer" title="客户详情" :close-on-click-modal="false" :close-on-press-escape="false" size="50%">
      <el-form
        :model="drawerDetail"
        :inline="true"
        label-position="left"
        label-width="100px"
      >
      <div class="form-title">基础信息</div>
      <el-form-item label="品牌LOGO">
        <img :src="drawerDetail.brandLogo" class="avatar" />
      </el-form-item>
      <el-form-item label="客户名称">
        {{drawerDetail.companyName}}
      </el-form-item>
      <el-form-item label="品牌名称">
        {{drawerDetail.brandName}}
      </el-form-item>
      <div class="form-title">账号信息</div>
      <el-form-item label="超管账号">
        {{drawerDetail.superManageAccount}}
      </el-form-item>
      <div class="form-title">监管信息 <span v-if="drawerDetail.certifiedStatus === 0">人工确认企业已认证</span></div>
      <el-form-item label="统一信用代码">
        {{drawerDetail.unifiedCreditCode}}
      </el-form-item>
      <el-form-item label="ICP备案号">
        {{drawerDetail.icpNum}}
      </el-form-item>
      <el-form-item label="公安网备">
        {{drawerDetail.pubSecNetBackup}}
      </el-form-item>
      <div class="form-title">对接信息</div>
      <el-form-item label="对接人">
        {{drawerDetail.contactPerson}}
      </el-form-item>
      <el-form-item label="联系方式">
        {{drawerDetail.phone}}
      </el-form-item>
    </el-form>
    </el-drawer>
  </div>
</template>

<script setup name="Customer">

const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    accountStatus: '',
    keyword: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  msg: '',
  taskStatus: '',
  drawer: false,
  drawerDetail: {}
})

const { formData, tableDataLoading, tableData, total, listQuery, msg, taskStatus, drawer, drawerDetail } = toRefs(state)

function search() {
  listQuery.value.currPage = 1
  getList()
}
function clear() {
  formData.value = {
    accountStatus: '',
    keyword: ''
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
    const { data, totalCount } = await proxy.$http.user.queryCompanyInfoList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}

function resetPSW(row) {
  proxy.$modal.confirm('您确定要重置密码吗？', '提示').then(async () => {
    await proxy.$http.user.resetPassword({id: row.id, superManageAccount: row.superManageAccount})
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}

function task(row) {
  if (row.taskReviewStatus === 1) {
    msg.value = '您确定要开启该客户的任务审查吗？'
    taskStatus.value = 0
  } else {
    msg.value = '您确定要关闭该客户的任务审查吗？'
    taskStatus.value = 1
  }
  proxy.$modal.confirm(msg.value, '提示').then(async () => {
    await proxy.$http.user.setTaskReviewStatus({id: row.id, taskReviewStatus: taskStatus.value})
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}

function add() {
  proxy.$router.push('/userManage/addcustomer')
}

function edit(id) {
  proxy.$router.push('/userManage/editcustomer/' + id)
}

const detail = async (id) => {
  try {
    const { data } = await proxy.$http.user.queryCompanyDetail(id)
    if (data) {
      drawerDetail.value = data
    }
    drawer.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}
search()
</script>

<style scoped lang="scss">
.el-drawer .el-form{
  display: flex;
  flex-direction: column;
}
.form-title{
  font-size: 16px;
  color: #606266;
  font-weight: 600;
  margin-bottom: 10px;
  span{
    margin-left: 30px;
  }
}
.avatar{
  width: 100px;
}
</style>
