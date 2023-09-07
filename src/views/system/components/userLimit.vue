<template>
  <div class="app-container">
    <div class="btn-wrap">
      <el-button type="primary" @click="expandAll(true)">展开全部</el-button>
      <el-button type="primary" @click="expandAll(false)">折叠全部</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <p class="tips" v-for="item in tipsList" :key="item.type">
      <span v-if="item.type == type">{{ item.tips }}</span>
    </p>
    <div class="tree-wrap">
      <tree :nodes="nodes" :setting="setting" @onCreated="handleCreated"></tree>
    </div>
  </div>
</template>
<script>
import tree from 'vue-giant-tree-3'
const tipsList = [
  { type: 1, tips: '[多用户同时查询权限：没有勾选的地方，要求输入学生信息或者老师信息才能查询]' },
  { type: 2, tips: '[手机号码查询可见权限：勾选的地方会出现"查看"按钮，点击后可查看完整的手机号]' },
  { type: 3, tips: '[手机号码导出可见权限：没有勾选的地方，要求导出学生信息时手机号码隐藏]' }
]
export default {
  name: 'UserLimit',
  components: { tree },
  data() {
    return {
      tipsList,
      nodes: [],
      userId: this.$route.query.id,
      type: this.$route.query.type,
      ztreeObj: null,
      setting: {
        showIndex: 0,
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pid'
          }
        },
        view: {
          showIcon: false,
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const { data } = await this.$http.user.dataPermissionEdit(this.userId, this.type)
        this.nodes = data || []
      } catch (e) {}
    },
    handleCreated(ztreeObj) {
      this.ztreeObj = ztreeObj
    },
    expandAll(bool) {
      this.ztreeObj.expandAll(bool)
    },
    submit() {
      var checkNodes = this.ztreeObj.getCheckedNodes(true)
      let ids = []
      checkNodes.forEach(item => {
        if (item.checked == true) {
          ids.push(item.rid)
        }
      })
      const permissionId = ids.join(',')
      let params = {
        userId: this.userId,
        permissionId,
        type: this.type
      }
      this.dataSubmit(params)
    },
    async dataSubmit(params) {
      try {
        await this.$http.user.dataPermissionSubmit(params)
        this.$modal.alert('权限修改成功!', '提示').then(() => {
          this.$router.push('/system/user')
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.btn-wrap {
  margin-bottom: 20px;
}

.ztree {
  :deep(span.button.checkbox_true_part:after) {
    left: 1px;
  }
}

.ztree {
  :deep(span.button.checkbox_true_part_focus::after) {
    left: 1px;
  }
}

.tips {
  font-size: 14px;
  color: red;
}
</style>
