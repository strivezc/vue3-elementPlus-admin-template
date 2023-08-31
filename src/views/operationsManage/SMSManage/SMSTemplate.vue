<template>
  <div class="app-container">
    <el-form
        :inline="true"
        class="form-border"
        autocomplete="on"
        :model="formData"
        onsubmit="return false"
    >
      <el-form-item label="类型名称">
        <el-input v-model="formData.accountName" placeholder="类型名称" class="input"/>
      </el-form-item>
      <el-form-item label="通道">
        <el-select class="select" v-model="formData.type" placeholder="请选择">
          <el-option label="全部" value=""/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="">全部</el-radio>
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="createTime"></el-table-column>
        <el-table-column align="center" label="短信类型" prop="createTime"></el-table-column>
        <el-table-column align="center" label="模板内容" prop="createTime"></el-table-column>
        <el-table-column align="center" label="通道" prop="createTime"></el-table-column>
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

    <el-dialog :title="title" draggable v-model="showDialog" :before-close="close"
               :width="(type===2||type===3)?'520px':'400px'">
      <el-form :model="form" :rules="formRules" ref="ruleFormRef">
        <el-form-item label="通道:" v-if="type===1">
          <el-select class="form-select" v-model="form.topic" placeholder="请选择">
            <el-option label="全部" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="内容:" prop="reply" v-else-if="type===2">
          <el-input
              class="form-textarea"
              v-model="form.reply"
              placeholder="更新内容"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              show-word-limit
          />
        </el-form-item>
        <template v-else-if="type===3">
          <el-form-item label="手机:">
            <el-input v-model="form.accountName" placeholder="手机号" class="form-input"/>
          </el-form-item>
          <el-form-item label="内容:" prop="reply">
            <el-input
                class="form-textarea"
                v-model="form.reply"
                placeholder="更新内容"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
            />
          </el-form-item>
          <el-form-item label="通道:">
            <el-select class="form-select" v-model="form.topic" placeholder="请选择">
              <el-option label="全部" value=""/>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="限制次数:" v-else-if="type===4">
          <el-input v-model="form.accountName" placeholder="限制次数" class="form-input"/>
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

<script setup name="SMSTemplate">
import { list } from '@/api'

const { proxy } = getCurrentInstance()

const data = reactive({
  formData: {},
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showDialog: true,
  form: {
    accountName: ''
  },
  formRules: {
    accountName: [{ required: true, message: '请输入', trigger: 'blur' }]
  },
  type: 3
})
const ruleFormRef = ref()
const { formData, tableDataLoading, tableData, total, listQuery, form, formRules, showDialog, type } = toRefs(data)
const title = computed(() => {
  const titleObj = {
    1: '切换通道',
    2: '编辑内容',
    3: '发送短信',
    4: '限制次数'
  }
  return titleObj[type.value]
})

const submit = async () => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function search() {
  listQuery.value.currPage = 0
  getList()
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value
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

</style>
