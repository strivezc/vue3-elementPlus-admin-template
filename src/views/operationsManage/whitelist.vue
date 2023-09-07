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
          <el-form-item label="用户ID">
            <el-input v-model="formData.userId" placeholder="用户ID" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="功能">
            <el-select class="select" v-model="formData.typeId" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.dataName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
        <el-table-column align="center" label="用户ID" prop="userId"></el-table-column>
        <el-table-column align="center" label="功能名称" prop="typeName"></el-table-column>
        <el-table-column align="center" label="有效期" prop="validDate"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
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
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="420px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="用户ID:" prop="userId">
          <el-input
            v-model="form.userId"
            :disabled="isEdit"
            placeholder="用户ID"
            class="input form-input"
          />
        </el-form-item>
        <el-form-item label="功能:" prop="typeId">
          <el-select
            class="form-select"
            :disabled="isEdit"
            v-model="form.typeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.dataName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期:" prop="validDate">
          <el-date-picker
            v-model="form.validDate"
            value-format="yyyy-MM-dd"
            type="date"
            class="form-date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="状态:" v-if="isEdit" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
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

<script setup name="Whitelist">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    status: '',
    userId: '',
    typeId: ''
  },
  tableDataLoading: false,
  typeList: [],
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showDialog: false,
  form: {
    id: '',
    status: '',
    typeId: '',
    userId: '',
    validDate: ''
  },
  formRules: {
    status: [{ required: true, message: '请选择状态！', trigger: 'change' }],
    typeId: [{ required: true, message: '请选择功能！', trigger: 'change' }],
    userId: [{ required: true, message: '请输入用户ID！', trigger: 'blur' }]
    // validDate: [{ required: true, message: '请选择有效期！', trigger: 'change' }]
  },
  isEdit: false
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
  isEdit,
  typeList
} = toRefs(state)

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
    const { data, totalCount } = await proxy.$http.operation.whitelist(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}

function edit(row) {
  showDialog.value = true
  Object.keys(form.value).forEach(key => {
    form.value[key] = row[key]
  })
  showDialog.value = true
}

const submit = async () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      if (isEdit.value) {
        await proxy.$http.operation.editTestUser(form.value)
      } else {
        await proxy.$http.operation.addTestUser(form.value)
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
const getTypeList = async () => {
  try {
    const { data } = await proxy.$http.operation.typeList()
    typeList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
// getTypeList()
</script>

<style scoped lang="scss"></style>
