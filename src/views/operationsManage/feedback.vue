<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-form-item label="问题分类">
        <el-select class="select" clearable v-model="formData.typeId" placeholder="请选择">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in feedbackTypes"
            :key="item.id"
            :label="item.dataName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList" v-permission="'3100'"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="所属分类">
          <template #default="{ row }">
            {{formatType(row.typeId)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="提交人" prop="createUser"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="结果">
          <template #default="{ row }">
            <span v-if="row.replyResult === 1">已采纳</span>
            <span v-else-if="row.replyResult === 2">处理中</span>
            <span v-else-if="row.replyResult === 3">延期处理</span>
            <span v-else-if="row.replyResult === 4">暂不处理</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              plain
              size="small"
              @click="reply(row.id)"
              v-permission="'3102'"
              >回复</el-button
            >
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
    <el-dialog title="查看内容" draggable v-model="showDialog" :before-close="close" width="520px">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-width="50px"
        label-position="right"
      >
        <el-form-item label="内容">
          <el-input
            class="form-textarea"
            v-model="content"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
            readonly
          />
        </el-form-item>
        <el-form-item prop="replyResult" label="回复">
          <el-select class="form-select" clearable v-model="form.replyResult" placeholder="请选择">
            <el-option label="已采纳" :value="1" />
            <el-option label="处理中" :value="2" />
            <el-option label="延期处理" :value="3" />
            <el-option label="暂不处理" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item prop="replyText">
          <el-input
            class="form-textarea"
            v-model="form.replyText"
            placeholder="最多输入500个字符"
            type="textarea"
            maxlength="500"
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

<script setup name="Feedback">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    typeId: ''
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
    id: '',
    replyResult: '',
    replyText: ''
  },
  formRules: {
    replyResult: [{ required: true, message: '请选择处理结果！', trigger: 'change' }]
  },
  content: '',
  feedbackTypes: []
})
const ruleFormRef = ref()
const {
  formData,
  tableDataLoading,
  tableData,
  total,
  listQuery,
  form,
  formRules,
  showDialog,
  feedbackTypes,
  content
} = toRefs(state)

function formatType(val) {
  let str = ''
  if (feedbackTypes.value && feedbackTypes.value.length > 0) {
    str = feedbackTypes.value.find(item => {
      return item.id === Number(val)
    })['dataName']
  }
  return str
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}
const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await proxy.$http.operation.handleFeedback(form.value)
        proxy.$modal.msgSuccess('操作成功!')
        close()
      } catch (e) {
        console.log(e, 'error')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const reply = async (id) => {
  try {
    form.value.id = id
    const { data } = await proxy.$http.operation.queryFeedbackContent(id)
    form.value.replyResult = data.replyResult
    form.value.replyText = data.replyText
    content.value = data.content
    showDialog.value = true
  } catch (e) {
    console.log(e, 'error')
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
    const { data, totalCount } = await proxy.$http.operation.queryFeedback(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const getFeedbackTypes = async () => {
  try {
    const { data } = await proxy.$http.operation.feedbackTypes()
    feedbackTypes.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
getFeedbackTypes()
</script>

<style scoped lang="scss"></style>
