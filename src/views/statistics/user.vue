<template>
  <div class="app-container home">
    <div class="home-data">
      <el-form
        ref="ruleFormRef"
        :rules="formRules"
        :inline="true"
        class="form-border"
        autocomplete="on"
        :model="formData"
        onsubmit="return false"
      >
        <el-row>
          <el-col :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="formData.startTime"
                value-format="YYYY-MM-DD"
                type="date"
                class="date"
                placeholder="开始日期"
                @change="changeTime"
              />
              <span class="date-line">-</span>
              <el-date-picker
                v-model="formData.endTime"
                value-format="YYYY-MM-DD"
                type="date"
                class="date"
                placeholder="结束日期"
                @change="changeTime"
              />
              <el-radio-group v-model="formData.queryDays" @change="changeTime1">
                <el-radio-button :label="7">近7天</el-radio-button>
                <el-radio-button :label="30">近30天</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit" @click="search" v-permission="'9100'"
                >查询</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="home-card">
        <el-card shadow="never">
          {{ dataInfo.newUserCount || 0 }}
          <p>新增用户数</p>
          <el-popover
            :width="250"
            placement="right">
            <template #reference>
              <el-icon class="info"><InfoFilled /></el-icon>
            </template>
            <span>
              筛选时段内，新注册用户总数；
            </span>
          </el-popover>
        </el-card>
        <el-card shadow="never">
          {{ dataInfo.participateUserCount || 0 }}
          <p>参与任务用户数</p>
          <el-popover
            :width="250"
            placement="right">
            <template #reference>
              <el-icon class="info"><InfoFilled /></el-icon>
            </template>
            <span>
              筛选时段内，所有参与任务领取的用户数（只要有领取即视为参与）；
            </span>
          </el-popover>
        </el-card>
        <el-card shadow="never">
          {{ dataInfo.succeedUserCount || 0 }}
          <p>成交用户数</p>
          <el-popover
            :width="250"
            placement="right">
            <template #reference>
              <el-icon class="info"><InfoFilled /></el-icon>
            </template>
            <span>
              筛选时段内，所有成交1次以上的用户数；
            </span>
          </el-popover>
        </el-card>
        <el-card shadow="never">
          {{ dataInfo.participatePer || 0 }}%
          <p>任务参与度</p>
          <el-popover
            :width="300"
            placement="right">
            <template #reference>
              <el-icon class="info"><InfoFilled /></el-icon>
            </template>
            <span>
              筛选时段内，参与用户占总用户量的比率；
            </span>
          </el-popover>
        </el-card>
      </div>
      <div id="conversionCharts" style="height:400px"></div>
    </div>
  </div>
</template>

<script setup name="StatisticsUser">
const { proxy } = getCurrentInstance()
const state = reactive({
  formData: {
    startTime: '',
    endTime: '',
    queryDays: 7
  },
  dataInfo: {}
})
const { formData, dataInfo } = toRefs(state)
const valiTime = (rule, value, callback) => {
  if (!value && formData.value.queryDays === '') {
    callback(new Error('请选择开始日期!'))
  } else if ((value && formData.value.endTime) && (new Date(value).getTime() > new Date(formData.value.endTime).getTime())) {
    callback(new Error('开始日期不能大于结束日期!'))
  } else {
    callback()
  }
}
const formRules = ref({
  startTime: [{ required: true, trigger: 'change', validator: valiTime }]
})
const ruleFormRef = ref()
function search() {
  getList()
}
const getList = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        const { data } = await proxy.$http.index.getNewUserStatistics(formData.value)
        if (data) {
          let myChart = proxy.$echarts.init(document.getElementById('conversionCharts'))
          let timeData = []
          let userData = []
          let userData1 = []
          dataInfo.value = {
            newUserCount: data.newUserCount,
            participateUserCount: data.participateUserCount,
            succeedUserCount: data.succeedUserCount,
            participatePer: data.participatePer
          }
          data.curveList.forEach(ele => {
            timeData.push(ele.dateStr)
            userData.push(ele.countNum)
          })
          data.claimUserList.forEach(ele => {
            userData1.push(ele.countNum)
          })
          myChart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false
              }
            },
            legend: {
              data: ['新增用户数', '参与用户数']
            },
            toolbox: {
              feature: {
                // restore: {},
                saveAsImage: {
                  title: '保存'
                }
              }
            },
            xAxis: {
              type: 'category',
              data: timeData
            },
            yAxis: {
              name: '数量',
              type: 'value'
            },
            series: [{
              data: userData,
              type: 'line',
              name: '新增用户数',
              smooth: true
            }, {
              data: userData1,
              type: 'line',
              name: '参与用户数',
              smooth: true
            }]
          })
        }
      } catch (e) {
        console.log(e, 'error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
function changeTime() {
  if ((formData.value.startTime === '' || formData.value.startTime === null) && (formData.value.endTime === '' || formData.value.endTime === null)) {
    formData.value.queryDays = 7
  } else {
    formData.value.queryDays = ''
  }
}
function changeTime1() {
  formData.value.startTime = ''
  formData.value.endTime = ''
}
setTimeout(() => {
  search()
}, 0)
</script>

<style scoped lang="scss">
.home-card{
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
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
</style>
