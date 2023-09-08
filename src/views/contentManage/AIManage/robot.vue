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
            <el-select class="select" clearable v-model="formData.typeId" placeholder="请选择">
              <el-option label="全部" value=""/>
              <el-option
                  v-for="item in aiTypeDownList"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
              />
            </el-select>
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
          <el-form-item label="是否为热门推荐">
            <el-radio-group v-model="formData.flag">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
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
        <el-table-column align="center" label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="名称" prop="robotName"></el-table-column>
        <el-table-column align="center" label="分类" prop="typeName"></el-table-column>
        <el-table-column align="center" label="简介" prop="intro"></el-table-column>
        <el-table-column align="center" label="封面图">
          <template #default="{ row }">
            <div class="img">
              <ImagePreview :src="row.imgUrl"></ImagePreview>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="热门" prop="createTime">
          <template #default="{ row }">
            {{ row.status === 0 ? '是' : '否' }}
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
              <el-button type="danger" plain size="small" v-if="row.status === 0" @click="updateStatus(row.id, 1)">下架
              </el-button>
              <el-button type="primary" plain size="small" v-else @click="updateStatus(row.id, 0)">上架</el-button>
              <el-button type="primary" plain size="small" @click="edit(row.id)">编辑</el-button>
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
    <el-dialog :title="isEdit?'编辑':'新增'" draggable v-model="showDialog" :before-close="close" width="600px">
      <el-form
          :model="form"
          :rules="formRules"
          ref="ruleFormRef"
          label-position="right"
          label-width="90px"
      >
        <el-form-item label="名称:" prop="robotName">
          <el-input v-model="form.robotName" maxlength="30" placeholder="名称" class="input form-input"/>
        </el-form-item>
        <el-form-item label="分类:" prop="typeId">
          <el-select class="select" clearable v-model="form.typeId" placeholder="请选择">
            <el-option
                v-for="item in aiTypeDownList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="简介:" prop="intro">
          <el-input
              class="form-textarea"
              v-model="form.intro"
              placeholder="最多输入100个字符"
              type="textarea"
              maxlength="100"
              :autosize="{ minRows: 4, maxRows: 6 }"
              show-word-limit
          />
        </el-form-item>
        <el-form-item prop="imgUrl" label="封面图:">
          <div class="flex-column">
            <el-upload
                ref="imgUrl"
                :http-request="uploadImg"
                action=""
                :show-file-list="false"
                accept=".jpg, .jpeg, .png"
            >
              <el-button type="warning" :loading="loading">点击上传</el-button>
              <!--              <template #tip>-->
              <!--                <span class="remarks ml15">注：建议尺寸：750*750px</span>-->
              <!--              </template>-->
            </el-upload>
            <img :src="form.imgUrl" v-if="form.imgUrl" class="cover"/>
          </div>
        </el-form-item>
        <el-form-item label="设为热门:" prop="flag">
          <el-radio-group v-model="form.flag">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提示文案:">
          <div class="flex-column">
            <el-input v-for="(item,index) in form.contents" :key="index" v-model="form.contents[index]"
                      class="form-input mb18"/>
          </div>
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
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    flag: '',
    status: '',
    typeId: ''
  },
  tableDataLoading: false,
  tableData: [],
  aiTypeDownList: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  loading: false,
  showDialog: false,
  form: {
    contents: ['', '', ''],
    flag: 1,
    id: '',
    imgUrl: '',
    intro: '',
    robotName: '',
    typeId: ''
  },
  formRules: {
    typeId: [{ required: true, message: '请选择分类！', trigger: 'change' }],
    robotName: [{ required: true, message: '请输入名称！', trigger: 'blur' }],
    intro: [{ required: true, message: '请输入简介！', trigger: 'blur' }],
    imgUrl: [{ required: true, message: '请上传封面图！', trigger: 'blur' }],
    flag: [{ required: true, message: '请选择是否为热门推荐！', trigger: 'blur' }]
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
  aiTypeDownList,
  isEdit,
  loading
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
    const { data, totalCount } = await proxy.$http.content.queryRobot(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const getAiTypeDownList = async () => {
  try {
    const { data } = await proxy.$http.content.queryAiTypeDownList()
    aiTypeDownList.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
const uploadImg = async (file) => {
  if (file.file.size / 1024 / 1024 > 10) {
    proxy.$modal.msgError('文件大小不能超过10MB')
    return false
  }
  loading.value = true
  let formData = new FormData()
  formData.append('file', file.file)
  try {
    const { data } = await proxy.$http.common.uploadFile(formData)
    form.value.imgUrl = data.fileUrl
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要上架吗？' : '确定要下架吗？').then(async () => {
    await proxy.$http.content.updateRobotStatus({ id, status })
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}
const edit = async (id) => {
  try {
    const { data } = await proxy.$http.content.queryRobotOne(id)
    let contents = ['', '', '']
    let dataC = data && data.contents || []
    Object.keys(form.value).forEach(key => {
      form.value[key] = data[key]
    })
    for (let i = 0; i < contents.length; i++) {
      contents[i] = dataC[i] || ''
    }
    form.value.contents = contents
    isEdit.value = true
    showDialog.value = true
  } catch (e) {
    console.log(e, 'error')
  }
}
const submit = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const contents = form.value.contents.filter(item => {
        return (item ?? '') !== ''
      })
      let params = {
        contents,
        flag: form.value.flag,
        id: '',
        imgUrl: form.value.imgUrl,
        intro: form.value.intro,
        robotName: form.value.robotName,
        typeId: form.value.typeId
      }
      if (isEdit.value) {
        params.id = form.value.id
        await proxy.$http.content.updateRobot(params)
      } else {
        await proxy.$http.content.addRobot(params)
      }
      proxy.$modal.msgSuccess('操作成功!')
      close()
      getList()
    }
  })
}

getAiTypeDownList()
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

.img {
  max-width: 250px;
  max-height: 250px;
}
</style>
