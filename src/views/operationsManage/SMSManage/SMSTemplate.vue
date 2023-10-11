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
        <el-input v-model="formData.typeName" placeholder="类型名称" class="input" />
      </el-form-item>
      <el-form-item label="通道">
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
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="">全部</el-radio>
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList" v-permission="'3410'"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="短信类型" prop="typeName"></el-table-column>
        <el-table-column align="center" label="模板内容" prop="content"></el-table-column>
        <el-table-column align="center" label="通道" prop="channelName"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="primary"
                v-permission="'3413'"
                plain
                size="small"
                @click="openDialog(row, 1)"
                >切换通道</el-button
              >
              <el-button
                type="primary"
                v-permission="'3412'"
                plain
                size="small"
                @click="openDialog(row, 2)"
                >编辑内容</el-button
              >
              <el-button
                type="primary"
                v-permission="'3414'"
                plain
                size="small"
                @click="openDialog(row, 4)"
                >限制次数</el-button
              >
              <el-button
                type="primary"
                v-permission="'3415'"
                plain
                size="small"
                @click="openDialog(row, 3)"
                >发送短信</el-button
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

    <el-dialog
      :title="title"
      draggable
      v-model="showDialog"
      :before-close="close"
      :width="type === 2 || type === 3 ? '520px' : '400px'"
    >
      <el-form :model="form" :rules="formRules" ref="ruleFormRef">
        <el-form-item label="通道:" v-if="type === 1" prop="channelId">
          <el-select class="form-select" clearable v-model="form.channelId" placeholder="请选择">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容:" prop="content" v-else-if="type === 2">
          <el-input
            class="form-textarea"
            v-model="form.content"
            placeholder="更新内容"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
        <template v-else-if="type === 3">
          <el-form-item label="手机:" prop="phone">
            <el-input v-model="form.phone" placeholder="手机号" class="form-input" />
          </el-form-item>
          <el-form-item label="内容:" prop="content">
            <el-input
              class="form-textarea"
              v-model="form.content"
              placeholder="短信内容"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="通道:" prop="channelId">
            <el-select class="form-select" clearable v-model="form.channelId" placeholder="请选择">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="限制次数:" v-else-if="type === 4" prop="num">
          <el-input
            v-model="form.num"
            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
            placeholder="限制次数"
            class="form-input"
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

<script setup name="SMSTemplate">
import { validPhone } from '@/utils/validate'

const { proxy } = getCurrentInstance()

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号!'))
  } else if (!validPhone(value)) {
    callback(new Error('手机号码格式不正确!'))
  } else {
    callback()
  }
}
const state = reactive({
  formData: {
    channelId: '',
    status: '',
    typeName: ''
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
    channelId: '',
    content: '',
    num: '',
    phone: ''
  },
  formRules: {
    channelId: [{ required: true, message: '请选择通道！', trigger: 'change' }],
    content: [{ required: true, message: '请输入内容！', trigger: 'blur' }],
    num: [{ required: true, message: '请输入限制次数！', trigger: 'blur' }],
    phone: [{ required: true, validator: validatePhone, trigger: 'blur' }]
  },
  type: 1,
  channelList: []
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
  type,
  channelList
} = toRefs(state)
const title = computed(() => {
  const titleObj = {
    1: '切换通道',
    2: '编辑内容',
    3: '发送短信',
    4: '限制次数'
  }
  return titleObj[type.value]
})

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
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
    const { data, totalCount } = await proxy.$http.operation.contentList(params)
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

function openDialog(row, dialogType) {
  type.value = dialogType
  form.value.id = row.id
  form.value.content = row.content
  showDialog.value = true
}

const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      switch (type.value) {
        case 1:
          await proxy.$http.operation.updateContentChannel({
            id: form.value.id,
            channelId: form.value.channelId
          })
          break
        case 2:
          await proxy.$http.operation.updateContent({
            id: form.value.id,
            content: form.value.content
          })
          break
        case 3:
          await proxy.$http.operation.sendMsg({
            id: form.value.id,
            content: form.value.content,
            channelId: form.value.channelId,
            phone: form.value.phone
          })
          break
        case 4:
          await proxy.$http.operation.updateLimitNum(form.value.id, form.value.num)
          break
        default:
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    } else {
      console.log('error submit!', fields)
    }
  })
}

getChannelList()
</script>

<style scoped lang="scss"></style>
