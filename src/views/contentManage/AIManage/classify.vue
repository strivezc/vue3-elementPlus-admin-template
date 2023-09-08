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
          <el-form-item label="分类id">
            <el-input v-model="formData.id" placeholder="分类id" class="input"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
            <el-button type="success" @click="add">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="名称" prop="typeName"></el-table-column>
        <el-table-column align="center" label="排序" prop="sortIndex"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button type="danger" plain size="small" v-if="row.status === 0" @click="updateStatus(row.id, 1)">下架
              </el-button>
              <el-button type="primary" plain size="small" v-else @click="updateStatus(row.id, 0)">上架</el-button>
              <el-button type="primary" plain size="small" @click="edit(row)">编辑</el-button>
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
    <el-dialog :title="isEdit?'编辑':'新增'" draggable v-model="showDialog" :before-close="close" width="450px">
      <el-form
          :model="form"
          :rules="formRules"
          ref="ruleFormRef"
          label-position="right"
          label-width="70px"
      >
        <el-form-item label="名称:" prop="typeName">
          <el-input v-model="form.typeName" placeholder="名称" class="input form-input"/>
        </el-form-item>
        <el-form-item label="排序:" prop="sortIndex">
          <el-input
              v-model="form.sortIndex"
              type="number"
              oninput="if(value>99)value=99;if(value.length>2)value=value.slice(0,2);if(value<1)value=''"
              placeholder="排序"
              class="input form-input"
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

<script setup name="Classify">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    status:'',
    id:'',
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
    sortIndex: '',
    typeName: ''
  },
  formRules: {
    typeName: [{ required: true, message: '请输入分类名称!', trigger: 'blur' }],
    sortIndex: [{ required: true, message: '请输入分类名称!', trigger: 'blur' }]
  },
  isEdit: false
})
const isEdit = ref(false)
const form = ref({
  id: '',
  sortIndex: '',
  typeName: ''
})
const validateSortIndex = (rule, value, callback) => {
  if (isEdit.value && !value) {
    callback(new Error('请输入排序!'))
  } else {
    callback()
  }
}
const formRules = ref({
  typeName: [{ required: true, message: '请输入分类名称!', trigger: 'blur' }],
  sortIndex: [{ required: true, validator: validateSortIndex, trigger: 'blur' }]
})

const ruleFormRef = ref()
const { formData, tableDataLoading, tableData, total, listQuery, showDialog } =
  toRefs(state)

const submit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (isEdit.value) {
        await proxy.$http.content.updateAiType(form.value)
      } else {
        await proxy.$http.content.addAiType(form.value)
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function add() {
  isEdit.value = false
  showDialog.value = true
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
    const { data, totalCount } = await proxy.$http.content.queryAiType(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}

function edit(row) {
  isEdit.value = true
  form.value.id = row.id
  form.value.sortIndex = row.sortIndex
  form.value.typeName = row.typeName
  showDialog.value = true
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要上架吗？' : '确定要下架吗？').then(async () => {
    await proxy.$http.content.updateAiTypeStatus({id, status})
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}
</script>

<style scoped lang="scss"></style>
