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
          <el-form-item label="用户编号" prop="accountName">
            <el-input
              v-model="formData.accountName"
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
              v-model="formData.date1"
              value-format="yyyy-MM-dd"
              type="date"
              class="date"
              placeholder="选择日期"
            />
            <span class="date-line">-</span>
            <el-date-picker
              v-model="formData.date2"
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
          <el-form-item label="账号状态">
            <el-select class="select" v-model="formData.accountStatus" placeholder="请选择">
              <el-option label="全部" value="" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="用户编号" prop="createTime"></el-table-column>
        <el-table-column align="center" label="用户名" prop="createTime"></el-table-column>
        <el-table-column align="center" label="手机号码" prop="createTime"></el-table-column>
        <el-table-column align="center" label="年龄" prop="createTime"></el-table-column>
        <el-table-column align="center" label="职业/年级" prop="createTime"></el-table-column>
        <el-table-column align="center" label="状态" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作" prop="createTime"></el-table-column>
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

<script setup name="Student">
import { list } from '@/api'

const { proxy } = getCurrentInstance()

const data = reactive({
  formData: {},
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10,
  },
})

const { formData, tableDataLoading, tableData, total, listQuery } = toRefs(data)

function search() {
  listQuery.value.currPage = 0
  getList()
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value,
    }
    const { resultData, totalCount } = await list(params)
    tableData.value = resultData
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.student {
}
</style>
