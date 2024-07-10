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
          <el-form-item label="手机号码">
            <el-input v-model="formData.phone" placeholder="手机号码" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="发送时间">
            <el-date-picker
              v-model="formData.beginTime"
              value-format="YYYY-MM-DD"
              type="date"
              class="date"
              placeholder="开始日期"
            />
            <span class="date-line">-</span>
            <el-date-picker
              v-model="formData.endTime"
              value-format="YYYY-MM-DD"
              type="date"
              class="date"
              placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="短信模板类型">
            <el-select class="select" clearable v-model="formData.contentId" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option
                v-for="item in smsTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="通道类型">
            <el-select class="select" clearable v-model="formData.channelId" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">成功</el-radio>
              <el-radio :label="1">失败</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="search" v-permission="'4020'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'4020'">清空选项</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="手机号码" prop="phone"></el-table-column>
        <el-table-column align="center" label="短信内容" prop="content"></el-table-column>
        <el-table-column align="center" label="通道类型" prop="channelName"></el-table-column>
        <!--        <el-table-column align="center" label="短信类型" prop="createTime"></el-table-column>-->
        <el-table-column align="center" label="发送时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作人" prop="createUser"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '失败' }}
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

<script setup name="SMSRecord">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    beginTime: '',
    endTime: '',
    channelId: '',
    contentId: '',
    phone: '',
    status: ''
  },
  tableDataLoading: false,
  channelList: [],
  smsTypeList: [],
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  }
})
const { formData, tableDataLoading, tableData, total, listQuery, channelList, smsTypeList } =
  toRefs(state)

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    beginTime: '',
    endTime: '',
    channelId: '',
    contentId: '',
    phone: '',
    status: ''
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
    const { data, totalCount } = await proxy.$http.operation.smsRecord(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const getChannelList = async () => {
  try {
    const { data } = await proxy.$http.operation.queryChannel()
    channelList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
const getSmsTypeList = async () => {
  try {
    const { data } = await proxy.$http.operation.smsType()
    smsTypeList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
getChannelList()
getSmsTypeList()
search()
</script>

<style scoped lang="scss"></style>
