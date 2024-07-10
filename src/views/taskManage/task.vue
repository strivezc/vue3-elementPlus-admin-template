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
          <el-form-item label="品牌名称" prop="brandName">
            <el-input
              v-model="formData.brandName"
              placeholder="请输入品牌名称"
              name="userInfo"
              class="input"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="任务/项目标题" prop="queryTitle">
            <el-input
              v-model="formData.queryTitle"
              placeholder="请输入任务或项目名称"
              name="userInfo"
              class="input"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="任务类型" prop="taskTypeId">
            <el-select class="select" filterable clearable v-model="formData.taskTypeId" placeholder="请选择">
              <el-option label="全部" :value="''"></el-option>
              <el-option v-for="(item, i) in taskTypeList" :label="item.typeName" :value="item.id" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="7" :xl="7">
          <el-form-item label="任务状态" prop="taskStatus">
            <el-select class="select" clearable v-model="formData.taskStatus" placeholder="请选择">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="上架中" :value="0"></el-option>
              <!-- <el-option label="草稿" :value="1"></el-option> -->
              <el-option label="审核中" :value="2"></el-option>
              <el-option label="已拒绝" :value="3"></el-option>
              <el-option label="已下架" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="10" :xl="10">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="formData.startTime"
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
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="search" v-permission="'2100'"
              >查询</el-button
            >
            <el-button @click="clear" v-permission="'2100'">清空选项</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="taskId"></el-table-column>
        <el-table-column align="center" label="品牌名称" prop="brandName"></el-table-column>
        <el-table-column align="center" label="任务标题">
          <template #default="{ row }">
            <span>{{ row.taskTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目名称" prop="itemName"></el-table-column>
        <el-table-column align="center" label="任务类型" prop="typeName"></el-table-column>
        <el-table-column align="center" label="任务状态">
          <template #default="{ row }">
            <span v-if="row.taskStatus === 0">上架中</span>
            <span v-if="row.taskStatus === 1">草稿</span>
            <span v-if="row.taskStatus === 2">审核中</span>
            <span v-if="row.taskStatus === 3">已拒绝</span>
            <span v-if="row.taskStatus === 4">已下架</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="任务赏金" prop="bonus"></el-table-column>
        <el-table-column align="center" label="任务数量" prop="initAmount"></el-table-column>
        <el-table-column align="center" label="成交量" prop="successCount"></el-table-column>
        <el-table-column align="center" label="达成率">
          <template #default="{ row }">
            <span>{{ Math.round(row.successCount / row.initAmount * 10000) / 100 }}%</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'2102'"
                v-if="row.taskStatus === 2"
                @click="audit(row)">
                审核
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'2100'"
                @click="detail(row)">
                详情
              </el-button>
              <el-button
                type="primary"
                plain
                size="small"
                v-permission="'2103'"
                v-if="row.taskStatus === 0"
                @click="recommend(row)">
                {{row.recommend === 1 ? '取消' : ''}}推荐
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
    <!-- 审核任务 -->
    <el-dialog
      title="审核任务"
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
        <el-form-item label="审核意见" prop="auditStatus">
          <el-radio-group v-model="form.auditStatus">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注" prop="remark">
          <el-input
            class="form-textarea"
            v-model="form.remark"
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
          <el-button type="primary" @click="submitAudit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 首页推荐展示时长 -->
    <el-dialog
      title="首页推荐展示时长"
      draggable
      v-model="showDialog1"
      :before-close="close1"
      width="500px"
    >
      <el-form
        :model="formTime"
        :rules="formRules1"
        ref="ruleFormRef1"
        label-position="top"
      >
        <el-form-item prop="recomTimeNum">
          <el-input
            class="form-time"
            placeholder="请输入正整数值"
            v-model="formTime.recomTimeNum"
          />
          <el-select class="w100" v-model="formTime.recomTimeUnit" placeholder="请选择">
            <el-option label="分钟" :value="0" />
            <el-option label="小时" :value="1" />
            <el-option label="天" :value="3" />
          </el-select>
          <p>支持设置展示时长，不填则表示不限制，直至任务下架</p>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close1">取消</el-button>
          <el-button type="primary" @click="submitRecommend">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer" title="任务详情" :close-on-click-modal="false" :close-on-press-escape="false" size="50%">
      <el-form
        :model="drawerDetail"
        :inline="true"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="任务状态：">
          <span v-if="drawerDetail.taskStatus === 0" class="green">上架中</span>
          <span v-if="drawerDetail.taskStatus === 1">草稿</span>
          <span v-if="drawerDetail.taskStatus === 2">审核中</span>
          <span v-if="drawerDetail.taskStatus === 3">已拒绝</span>
          <span v-if="drawerDetail.taskStatus === 4">已下架</span>
        </el-form-item>
        <el-form-item label="任务归属：">
          {{drawerDetail.brandName}}
        </el-form-item>
        <el-form-item label="任务类型：">
          {{drawerDetail.typeName}}
        </el-form-item>
        <el-form-item label="项目名称：">
          {{drawerDetail.itemName}}
        </el-form-item>
        <el-form-item label="任务标题：">
          {{drawerDetail.taskTitle}}
        </el-form-item>
        <el-form-item label="任务说明：">
          {{drawerDetail.taskExplain}}
        </el-form-item>
        <el-form-item label="做单次数：">
          <span v-if="drawerDetail.restrictType === 0">每人{{drawerDetail.restrictEryoneNum}}次</span>
          <span v-if="drawerDetail.restrictType === 1">每{{drawerDetail.restrictDayNum}}天一次</span>
        </el-form-item>
        <el-form-item label="做单限时：">
          {{drawerDetail.endTimeNum}}
          <span v-if="drawerDetail.endTimeUnit === 0">分钟</span>
          <span v-if="drawerDetail.endTimeUnit === 1">小时</span>
          <span v-if="drawerDetail.endTimeUnit === 2">天</span>
        </el-form-item>
        <el-form-item label="任务赏金：">
          ￥{{drawerDetail.bonus}}
        </el-form-item>
        <el-form-item label="任务数量：">
          {{drawerDetail.initAmount}}
        </el-form-item>
        <el-form-item label="创建人：">
          {{drawerDetail.createUser}}
        </el-form-item>
        <el-form-item label="创建时间：">
          {{drawerDetail.createTime}}
        </el-form-item>
        <el-form-item label="任务步骤：">
          <ul class="step">
            <li v-for="(item, i) in drawerDetail.processList" :key="i">
              <pre><div class="step-title"><span class="red">{{i+1}}.</span>{{item.explainInfo}}</div></pre>
              <div class="step-con">
                <div v-if="item.type === 0">{{item.content}}</div>
                <div v-if="item.type === 1 || item.type === 3 || item.type === 4">
                  <ImagePreview v-if="item.content" :src="item.content" fit="fill" custom-img-class="img"></ImagePreview>
                </div>
                <div class="step-con-info" v-if="item.type === 2">
                  {{item.content}}
                </div>
              </div>
            </li>
          </ul>
        </el-form-item>
        <div class="claim" v-if="drawerDetail.taskStatus === 0 || drawerDetail.taskStatus === 3 || drawerDetail.taskStatus === 4">
          <div class="form-line"></div>
          <div class="form-title">审核记录</div>
          <el-form-item label="审核意见：">
            <span v-if="drawerDetail.auditStatus === 0">通过</span>
            <span v-if="drawerDetail.auditStatus === 1">已拒绝</span>
          </el-form-item>
          <el-form-item label="审核备注：">
            {{drawerDetail.remark}}
          </el-form-item>
          <el-form-item label="审核人：">
            {{drawerDetail.auditor}}
          </el-form-item>
          <el-form-item label="审核时间：">
            {{drawerDetail.auditTime}}
          </el-form-item>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup name="Task">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    startTime: '',
    endTime: '',
    taskTypeId: '',
    queryTitle: '',
    taskStatus: '',
    brandName: ''
  },
  taskTypeList: [],
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showDialog: false,
  showDialog1: false,
  msg: '',
  drawer: false,
  drawerDetail: {},
  formTime: {
    recomTimeNum: '',
    recomTimeUnit: 0,
    taskId: ''
  }
})
const form = ref({
  auditStatus: '',
  taskId: '',
  remark: ''
})
const formRules = ref({
  auditStatus: [{ required: true, message: '请选择状态！', trigger: 'change' }],
  remark: [{ required: false, message: '请填写审核备注！', trigger: 'blur' }],
})
const num = /^[1-9]\d*$/
const validate = (rule, value, callback) => {
  console.log(value)
  if (value && !num.test(value)) {
    callback(new Error('请输入正整数值!'))
  } else {
    callback()
  }
}
const formRules1 = ref({
  recomTimeNum: [{ required: false, trigger: 'blur', validator: validate }],
})
const ruleFormRef = ref()
const ruleFormRef1 = ref()
const { formData, taskTypeList, tableDataLoading, tableData, total, listQuery, showDialog, showDialog1, msg, drawer, drawerDetail, formTime } = toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function close1() {
  showDialog1.value = false
  ruleFormRef1.value.resetFields()
  formTime.value.recomTimeUnit = 0
  formTime.value.taskId = ''
}

const audit = async (row) => {
  form.value.taskId = row.taskId
  try {
    showDialog.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}

const detail = async (row) => {
  try {
    const { data } = await proxy.$http.task.queryAdminTaskInfo({taskId: row.taskId})
    console.log(data, 'data')
    if (data) {
      drawerDetail.value = data
    }
    drawer.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}

function search() {
  listQuery.value.currPage = 1
  getList()
}

function clear() {
  formData.value = {
    startTime: '',
    endTime: '',
    taskTypeId: '',
    queryTitle: '',
    taskStatus: '',
    brandName: ''
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
    const { data, totalCount } = await proxy.$http.task.queryAdminTaskList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const submitAudit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (form.value.auditStatus === 1 && form.value.remark === '') {
        proxy.$modal.msgError('请填写审核备注！')
        return false
      }
      await proxy.$http.task.auditTask(form.value)
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
const submitRecommend = async () => {
  ruleFormRef1.value.validate(async (valid) => {
    if (valid) {
      await proxy.$http.task.upRecommendTask(formTime.value)
      proxy.$modal.msgSuccess('操作成功!')
      close1()
      getList()
    }
  })
}
function recommend(row) {
  if (row.recommend === 1) {
    msg.value = '您确定要取消推荐该任务吗？'
    proxy.$modal.confirm(msg.value, '提示').then(async () => {
      await proxy.$http.task.upRecommendTask({taskId: row.taskId})
      proxy.$modal.msgSuccess('操作成功!')
      getList()
    })
  } else {
    formTime.value.taskId = row.taskId
    showDialog1.value = true
  }
  
}
const getTaskTypeList = async () => {
  try {
    const { data } = await proxy.$http.task.userQueryTaskType()
    taskTypeList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
getTaskTypeList()
if (proxy.$route.query.taskStatus) {
  formData.value.taskStatus = Number(proxy.$route.query.taskStatus)
}
search()
</script>

<style scoped lang="scss">
.form-textarea{
  width: 100% !important;
}
.el-drawer .el-form{
  display: flex;
  flex-direction: column;
}
.form-line{
  width: 100%;
  height: 10px;
  background: #ddd;
  margin-bottom: 20px;
}
.form-title{
  font-size: 16px;
  color: #606266;
  font-weight: 600;
  margin-bottom: 10px;
}
.step{
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  pre{
    margin: 0;
    font-size: 16px;
  }
  li{
    width: 100%;
    position: relative;
    padding: 0 0 10px 30px;
  }
  li::before{
    content: "";
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ccc;
    position: absolute;
    left: 0px;
    top: 5px;
  }
  li::after{
    content: "";
    width: 2px;
    height: 100%;
    background: #ccc;
    display: block;
    position: absolute;
    left: 9px;
    top: 10px;
  }
  li:last-child:after{
    display: none;
  }
  .step-con-info{
    width: 100%;
    padding: 5px 10px;
    border: 1px solid #ccc;
  }
  :deep(.el-image){
    width: 300px;
  }
}
.form-time{
  width: 200px;
  margin-right: 10px;
}
.w100{
  width: 100px;
}
.red{
  color: #ff4949;
}
.green{
  color: #42b983;
}
.claim{
  display: grid;
}
</style>
