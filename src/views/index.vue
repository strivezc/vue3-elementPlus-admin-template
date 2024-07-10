<template>
  <div class="app-container home">
    <el-button class="mb_20" type="primary" @click="refresh" v-permission="'8000'">刷新</el-button>
    <el-row v-permission="'8000'">
      <el-col :sm="24" :md="12" :lg="16" :xl="16">
        <div class="home-data">
          <div class="home-title">数据概况</div>
          <div class="home-card">
            <el-card shadow="never">
              {{ dataInfo.userCount || 0 }}
              <p>注册用户数</p>
              <el-popover
                :width="250"
                placement="right">
                <template #reference>
                  <el-icon class="info"><InfoFilled /></el-icon>
                </template>
                <span>
                  截止当前时间，平台所有注册用户数量；
                </span>
              </el-popover>
            </el-card>
            <el-card shadow="never">
              {{ dataInfo.companyCount || 0 }}
              <p>入驻客户总数</p>
              <el-popover
                :width="250"
                placement="right">
                <template #reference>
                  <el-icon class="info"><InfoFilled /></el-icon>
                </template>
                <span>
                  截止当前时间，已入驻平台的所有客户数量；
                </span>
              </el-popover>
            </el-card>
            <el-card shadow="never">
              {{ dataInfo.taskSumCount || 0 }}
              <p>累计任务数</p>
              <el-popover
                :width="250"
                placement="right">
                <template #reference>
                  <el-icon class="info"><InfoFilled /></el-icon>
                </template>
                <span>
                  截止当前时间，累计发布的任务总数，包含上架中和已下架的任务；
                </span>
              </el-popover>
            </el-card>
            <el-card shadow="never">
              {{ dataInfo.putAwaySumCount || 0 }}
              <p>上架中任务数</p>
              <el-popover
                :width="250"
                placement="right">
                <template #reference>
                  <el-icon class="info"><InfoFilled /></el-icon>
                </template>
                <span>
                  截止当前时间，正在上架中的任务数量；
                </span>
              </el-popover>
            </el-card>
            <el-card shadow="never">
              {{ dataInfo.totalAmountSum || 0 }}
              <p>充值总额（元）</p>
              <el-popover
                :width="250"
                placement="right">
                <template #reference>
                  <el-icon class="info"><InfoFilled /></el-icon>
                </template>
                <span>
                  截止当前时间，平台所有充值订单总额（包括平台充值及客户自主充值）；
                </span>
              </el-popover>
            </el-card>
            <el-card shadow="never">
              {{ dataInfo.bonusSum || 0 }}
              <p>已打赏总额（元）</p>
              <el-popover
                :width="250"
                placement="right">
                <template #reference>
                  <el-icon class="info"><InfoFilled /></el-icon>
                </template>
                <span>
                  截止当前时间，已成交打赏给用户的总金额；
                </span>
              </el-popover>
            </el-card>
            <el-card shadow="never">
              {{ dataInfo.successCount || 0 }}
              <p>成交接单总数</p>
              <el-popover
                :width="250"
                placement="right">
                <template #reference>
                  <el-icon class="info"><InfoFilled /></el-icon>
                </template>
                <span>
                  截止当前时间，所有已验证合格的接单总数；
                </span>
              </el-popover>
            </el-card>
            <el-card shadow="never">
              {{ dataInfo.averageSucPer || 0 }}%
              <p>平均达成率</p>
              <el-popover
                :width="250"
                placement="right">
                <template #reference>
                  <el-icon class="info"><InfoFilled /></el-icon>
                </template>
                <span>
                  截止当前时间，所有任务达成率均值（达成率=已成交的接单数/任务发放数量）；
                </span>
              </el-popover>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :lg="8" :xl="8" v-permission="'2102'">
        <div class="home-data home-data1">
          <div class="home-title">任务审核<i>{{ total }}</i></div>
          <ul class="auditlist">
            <li v-for="(item, i) in auditList" :key="i">
              <div>
                <p class="danhang" :title="item.taskTitle">{{item.taskTitle}}</p>
                提交时间：{{item.submitTime}}
              </div>
              <el-button type="primary" plain size="small" @click="audit(item)">审核</el-button>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
const { proxy } = getCurrentInstance()
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const state = reactive({
  dataInfo: {},
  total: '',
  auditList: []
})
const { dataInfo, total, auditList } = toRefs(state)
const getList = async () => {
  try {
    const { data } = await proxy.$http.index.getAdminTaskStatistics({})
    if (data) {
      dataInfo.value = data
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
const getList1 = async () => {
  try {
    const { data, totalCount } = await proxy.$http.index.getTaskWaitAudit({})
    if (data) {
      auditList.value = data
      total.value = totalCount
    }
  } catch (e) {
    console.log(e, 'error')
  }
}

function audit(item) {
  proxy.$router.push('/taskManage/task?taskStatus=2')
}
if (userStore.menuList.includes('8000')) {
  getList()
  getList1()
}
function refresh() {
  getList()
  getList1()
}
</script>

<style scoped lang="scss">
.home-title{
  font-size: 16px;
  color: #606266;
  font-weight: 600;
  margin-bottom: 10px;
  i{
    border-radius: 50px;
    border: 1px solid #ff5a5a;
    font-style: normal;
    font-size: 10px;
    margin-left: 5px;
    vertical-align: text-top;
    padding: 2px;
    color: #ff5a5a;
  }
}
.home-card{
  display: flex;
  flex-wrap: wrap;
}
.el-card{
  width: 24%;
  font-size: 24px;
  text-align: center;
  font-weight: 600;
  margin: 0 .5% 20px;
  position: relative;
  p{
    font-weight: 400;
    color: #666;
    margin: 0;
    margin-top: 10px;
    font-size: 14px;
  }
  .info{
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: #666;
    cursor: pointer;
  }
}
.el-radio-group{
  margin-left: 20px;
}
.auditlist{
  list-style: none;
  margin: 0;
  padding: 0px 10px;
  border: 1px solid #ccc;
  height: 540px;
  overflow-y: scroll;
  li{
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div{
      font-size: 12px;
      color: #666;
      p{
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #000;
      }
    }
  }
  li+li{
    border-top: 1px solid #ccc;
  }
}
.home-data1{
  padding-left: 20px;
}
.mb_20{
  margin-bottom: 20px;
}
</style>
