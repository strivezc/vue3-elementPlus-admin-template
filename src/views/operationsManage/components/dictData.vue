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
        <el-button type="success" @click="addInfo">新增明细</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="字典所属" prop="parentName"></el-table-column>
        <el-table-column align="center" label="标签" prop="dataName"></el-table-column>
        <el-table-column align="center" label="键值" prop="dataValue"></el-table-column>
        <el-table-column align="center" label="排序" prop="dataSort"></el-table-column>
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
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="isEdit ? '编辑字典数据' : '新增字典数据'"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="580px"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-width="103px"
        label-position="right"
      >
        <el-form-item label="父级字典类型:">
          <el-input v-model="state.dictType" disabled placeholder="字典类型" class="form-input" />
        </el-form-item>
        <el-form-item label="详情名称:" prop="dataName">
          <el-input
            v-model="form.dataName"
            maxlength="10"
            placeholder="字典详情名称"
            class="form-input"
          />
        </el-form-item>
        <el-form-item label="数据键值:" prop="dataValue">
          <el-input
            v-model="form.dataValue"
            maxlength="10"
            placeholder="数据键值"
            class="form-input"
          />
        </el-form-item>
        <el-form-item label="排序:" prop="dataSort">
          <el-input
            v-model="form.dataSort"
            type="number"
            oninput="if(value>99999)value=99999;if(value.length>5)value=value.slice(0,5);if(value<1)value=''"
            placeholder="排序"
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

<script setup name="DictData">
const { proxy } = getCurrentInstance()

const state = reactive({
  dictType: '',
  tableDataLoading: false,
  tableData: [],
  total: 0,
  showDialog: false,
  form: {
    dataId: '',
    dataInfoId: '',
    dataName: '',
    dataSort: '',
    dataValue: '',
    remark: '',
    extendType: '',
    extendText: '',
    status: 0
  },
  formRules: {
    dataName: [{ required: true, message: '请输入字典详情名称！', trigger: 'blur' }],
    dataValue: [{ required: true, message: '请输入数据键值！', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态！', trigger: 'change' }]
  },
  isEdit: false
})
const { tableDataLoading, tableData, total, form, formRules, showDialog, isEdit } = toRefs(state)
const ruleFormRef = ref()

const getList = async () => {
  tableDataLoading.value = true
  try {
    const { data, totalCount } = await proxy.$http.operation.dataInfoList(state.form.dataId)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

const submit = async () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      try {
        let params = {
          // dataId: '',
          // dataInfoId: '',
          dataName: form.value.dataName,
          dataSort: form.value.dataSort,
          dataValue: form.value.dataValue,
          remark: form.value.remark,
          extendType: form.value.extendType,
          extendText: form.value.extendText,
          status: form.value.status
        }
        if (isEdit.value) {
          params.dataInfoId = form.value.dataInfoId
          await proxy.$http.operation.editInfo(params)
        } else {
          params.dataId = form.value.dataId
          await proxy.$http.operation.addInfo(params)
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
function addInfo() {
  isEdit.value = false
  showDialog.value = true
}
function edit(row) {
  isEdit.value = true
  Object.keys(form.value).forEach(key => {
    form.value[key] = row[key]
  })
  form.value.dataInfoId = row.id
  showDialog.value = true
}

state.form.dataId = proxy.$route.params.id
state.dictType = proxy.$route.query.dictType
getList()
</script>

<style scoped lang="scss"></style>
