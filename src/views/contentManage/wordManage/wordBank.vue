<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-form-item label="单词">
        <el-input v-model="formData.text" placeholder="单词" class="input" />
      </el-form-item>
      <el-form-item label="状态">
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
        <el-table-column align="center" label="单词" prop="text"></el-table-column>
        <el-table-column align="center" label="英音" prop="ukSounds"></el-table-column>
        <el-table-column align="center" label="美音" prop="usSounds"></el-table-column>
        <el-table-column align="center" label="释义" prop="paraphrase"></el-table-column>
        <el-table-column align="center" label="音频" prop="audioUrl" width="302px">
          <template #default="{ row }">
            <audio :src="row.audioUrl" controls="controls" style="width: 276px">
              Your browser does not support the audio element.
            </audio>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单词搭配">
          <template #default="{ row }">
            <el-button type="primary" plain size="small" @click="watchWordGroup(row.id, 1)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="例句">
          <template #default="{ row }">
            <el-button type="primary" plain size="small" @click="watchWordGroup(row.id, 2)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '删除' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="danger"
                plain
                size="small"
                v-if="row.status === 0"
                @click="updateStatus(row.id, 1)"
                >删除
              </el-button>
              <el-button type="primary" plain size="small" v-else @click="updateStatus(row.id, 0)"
                >启用</el-button
              >
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
    <el-dialog title="编辑" draggable v-model="showDialog" :before-close="close" width="400px">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="60px"
      >
        <el-form-item label="单词:" prop="text">
          <el-input v-model="form.text" placeholder="单词" class="input form-input" />
        </el-form-item>
        <el-form-item label="英音:" prop="ukSounds">
          <el-input v-model="form.ukSounds" placeholder="英音" class="input form-input" />
        </el-form-item>
        <el-form-item label="美音:" prop="usSounds">
          <el-input v-model="form.usSounds" placeholder="美音" class="input form-input" />
        </el-form-item>
        <el-form-item label="释义:" prop="paraphrase">
          <el-input v-model="form.paraphrase" placeholder="释义" class="input form-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :title="formWordGroup.type === 2 ? '例句' : '单词搭配'"
      draggable
      v-model="showWordGroup"
      :before-close="closeWordGroup"
      width="600px"
    >
      <el-form
        :model="formWordGroup"
        :rules="formRulesWordGroup"
        ref="ruleFormWordGroup"
        label-position="right"
        label-width="80px"
      >
        <div class="sentence-item" v-for="(item, index) in formWordGroup.expandList" :key="index">
          <el-form-item label="原文:" v-if="formWordGroup.type === 2">
            <el-input
              class="form-textarea"
              v-model="item.cnText"
              placeholder="原文"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="英文词组:" v-else>
            <div class="flex-c">
              <el-input v-model="item.enText" placeholder="英文词组" class="form-input" />
            </div>
          </el-form-item>
          <div class="flex-c">
            <el-form-item label="翻译:" v-if="formWordGroup.type === 2">
              <el-input
                class="form-textarea"
                v-model="item.enText"
                placeholder="翻译"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="中文:" v-else>
              <el-input v-model="item.cnText" placeholder="中文" class="form-input" />
            </el-form-item>

            <template v-if="index === formWordGroup.expandList.length - 1">
              <el-icon
                class="icon"
                @click="removeSentenceItem(index)"
                v-if="formWordGroup.expandList.length !== 1"
              >
                <Remove />
              </el-icon>
              <el-icon class="icon" @click="addSentenceItem(index)">
                <CirclePlus />
              </el-icon>
            </template>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeWordGroup">取消</el-button>
          <el-button type="primary" @click="submitWordGroup">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="WordBank">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    status: '',
    text: ''
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
    paraphrase: '',
    text: '',
    ukSounds: '',
    usSounds: ''
  },
  formRules: {
    paraphrase: [{ required: true, message: '请输入释义！', trigger: 'blur' }],
    text: [{ required: true, message: '请输入单词！', trigger: 'blur' }],
    ukSounds: [{ required: true, message: '请输入英音！', trigger: 'blur' }],
    usSounds: [{ required: true, message: '请输入美音！', trigger: 'blur' }]
  },
  showWordGroup: false,
  formWordGroup: {
    expandList: [
      {
        cnText: '',
        enText: '',
        id: '',
        status: ''
      }
    ],
    id: '',
    type: ''
  },
  formRulesWordGroup: {}
})
const ruleFormRef = ref()
const ruleFormWordGroup = ref()
const {
  formData,
  tableDataLoading,
  tableData,
  total,
  listQuery,
  form,
  formRules,
  showDialog,
  showWordGroup,
  formWordGroup,
  formRulesWordGroup
} = toRefs(state)

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}

function closeWordGroup() {
  formWordGroup.value = {
    expandList: [
      {
        cnText: '',
        enText: '',
        id: '',
        status: ''
      }
    ],
    id: '',
    type: ''
  }
  showWordGroup.value = false
  ruleFormWordGroup.value.resetFields()
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
    const { data, totalCount } = await proxy.$http.content.wordList(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要启用吗？' : '确定要删除吗？').then(async () => {
    await proxy.$http.content.updateWordStatus(id)
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}

function edit(row) {
  Object.keys(form.value).forEach(key => {
    form.value[key] = row[key]
  })
  showDialog.value = true
}

const submit = async () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      await proxy.$http.content.wordEditSubmit(form.value)
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}
const submitWordGroup = async () => {
  console.log(formWordGroup.value, 'formWordGroup.value')
  ruleFormWordGroup.value.validate(async valid => {
    if (valid) {
      await proxy.$http.content.addExpand(formWordGroup.value)
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}

const watchWordGroup = async (id, type) => {
  formWordGroup.value.id = id
  formWordGroup.value.type = type
  try {
    const { data } = await proxy.$http.content.wordView({ id, type })
    if (data && data.length > 0) {
      formWordGroup.value.expandList = data
    }
    showWordGroup.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}

function removeSentenceItem(index) {
  formWordGroup.value.expandList.splice(index, 1)
}

function addSentenceItem(index) {
  // if (formWordGroup.value.expandList.length >= 4) return
  formWordGroup.value.expandList.push({
    cnText: '',
    enText: '',
    id: '',
    status: ''
  })
}
</script>

<style scoped lang="scss">
.sentence-item {
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 15px;

  .flex-c {
    display: flex;
    align-items: center;

    .icon {
      font-size: 24px;
      margin-bottom: 18px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
