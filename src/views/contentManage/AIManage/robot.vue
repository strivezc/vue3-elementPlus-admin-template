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
          <el-form-item label="分类名称">
            <el-input v-model="formData.accountName" placeholder="分类名称" class="input" />
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
        <el-table-column align="center" label="ID" prop="createTime"></el-table-column>
        <el-table-column align="center" label="名称" prop="createTime"></el-table-column>
        <el-table-column align="center" label="分类" prop="createTime"></el-table-column>
        <el-table-column align="center" label="简介" prop="createTime"></el-table-column>
        <el-table-column align="center" label="封面图" prop="createTime"></el-table-column>
        <el-table-column align="center" label="热门" prop="createTime"></el-table-column>
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
    <el-dialog title="新增" draggable v-model="showDialog" :before-close="close" width="600px">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="名称:" prop="accountName">
          <el-input v-model="form.accountName" placeholder="名称" class="input form-input" />
        </el-form-item>
        <el-form-item label="分类:">
          <el-select class="form-select" v-model="form.topic" placeholder="请选择">
            <el-option label="全部" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介:" prop="reply">
          <el-input
            class="form-textarea"
            v-model="form.reply"
            placeholder="最多输入500个字符"
            type="textarea"
            maxlength="500"
            :autosize="{ minRows: 4, maxRows: 6 }"
            show-word-limit
          />
        </el-form-item>
        <el-form-item prop="barrierImg" label="封面图">
          <div class="flex-column">
            <el-upload
              ref="barrierImg"
              :http-request="uploadImg"
              action=""
              :show-file-list="false"
              accept=".jpg, .jpeg, .png, .gif, .bmp"
            >
              <el-button type="warning" :loading="loading">点击上传</el-button>
              <template #tip>
                <span class="remarks ml15">注：建议尺寸：750*750px</span>
              </template>
            </el-upload>
            <img :src="form.barrierImg" v-if="form.barrierImg" class="cover" />
          </div>
        </el-form-item>
        <el-form-item label="设为热门:">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提示文案:" prop="reply">
          <el-input
            class="form-textarea"
            v-model="form.reply"
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

<script setup name="Robot">
import { list } from '@/api'

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
  loading: false,
  showDialog: false,
  form: {
    accountName: ''
  },
  formRules: {
    accountName: [{ required: true, message: '请输入', trigger: 'blur' }]
  }
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
  loading
} = toRefs(state)

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
function add() {
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
    const { data, totalCount } = await list(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.cover {
  margin-top: 15px;
  min-width: 150px;
  min-height: 150px;
  max-width: 200px;
  max-height: 200px;
}

.remarks {
  color: #ff574e;
  font-size: 14px;
}
</style>
