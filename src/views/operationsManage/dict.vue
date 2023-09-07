<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
        <el-button type="success" @click="addDict">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="编号" prop="id"></el-table-column>
        <el-table-column align="center" label="字典名称" prop="dataName"></el-table-column>
        <el-table-column align="center" label="字典类型" prop="dataType"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="备注" prop="remark"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button type="primary" plain size="small" @click="edit(row)">编辑</el-button>
              <el-button type="primary" plain size="small" @click="infoList(row.id, row.dataType)"
                >列表</el-button
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
      :title="isEdit ? '编辑字典类型' : '新增字典类型'"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="560px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-width="85px"
        label-position="right"
      >
        <el-form-item label="字典名称:" prop="dataName">
          <el-input
            v-model="form.dataName"
            maxlength="10"
            placeholder="字典名称"
            class="form-input"
          />
        </el-form-item>
        <el-form-item label="字典类型:" prop="dataType">
          <el-input
            v-model="form.dataType"
            maxlength="20"
            placeholder="字典类型"
            class="form-input"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            class="form-textarea"
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
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

<script setup name="Dict">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {},
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
    dataName: '',
    dataType: '',
    remark: '',
    status: 0
  },
  formRules: {
    dataName: [{ required: true, message: '请输入字典名称！', trigger: 'blur' }],
    dataType: [{ required: true, message: '请输入字典类型！', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态！', trigger: 'change' }]
  },
  isEdit: false
})
const {
  formData,
  tableDataLoading,
  tableData,
  total,
  listQuery,
  form,
  formRules,
  showDialog,
  isEdit
} = toRefs(state)
const ruleFormRef = ref()
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
    const { data, totalCount } = await proxy.$http.operation.dictList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}

function addDict() {
  isEdit.value = false
  showDialog.value = true
}

function edit(row) {
  isEdit.value = true
  Object.keys(form.value).forEach(key => {
    form.value[key] = row[key]
  })
  showDialog.value = true
}
function infoList(id, dataType) {
  proxy.$router.push(`/operationsManage/dictData/${id}?dictType=${dataType}`)
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

const submit = async () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      try {
        if (isEdit.value) {
          await proxy.$http.operation.dictEdit(form.value)
        } else {
          await proxy.$http.operation.dictaAdd(form.value)
        }
        proxy.$modal.msgSuccess('操作成功!')
        close()
        getList()
      } catch (e) {
        console.log(e, 'error')
      }
    }
  })
}
</script>

<style scoped lang="scss"></style>
