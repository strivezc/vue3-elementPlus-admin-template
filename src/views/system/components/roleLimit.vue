<template>
  <div class="app-container">
    <div class="btn-wrap">
      <el-button type="primary" @click="expandAll(true)">展开全部</el-button>
      <el-button type="primary" @click="expandAll(false)">折叠全部</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <div class="tree-wrap">
      <tree :nodes="nodes" :setting="setting" @onCreated="handleCreated"></tree>
    </div>
  </div>
</template>
<script>
import tree from 'vue-giant-tree-3'
export default {
  name: 'RoleLimit',
  components: { tree },
  data() {
    return {
      nodes: [],
      roleId: this.$route.query.roleId,
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
          showIcon: false
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
        const { data } = await this.$http.user.toRolePermission(this.roleId)
        this.nodes = data || []
      } catch (e) {
        console.log(e, 'e')
      }
    },
    handleCreated(ztreeObj) {
      this.ztreeObj = ztreeObj
    },
    expandAll(bool) {
      this.ztreeObj.expandAll(bool)
    },
    submit() {
      let checkNodes = this.ztreeObj.getCheckedNodes(true)
      let ids = []
      checkNodes.forEach((item) => {
        if (item.checked == true) {
          ids.push(item.rid)
        }
      })
      const permissionIds = ids.join(',')
      let params = {
        roleId: this.roleId,
        permissionIds
      }
      this.dataSubmit(params)
    },
    async dataSubmit(params) {
      try {
        await this.$http.user.updateRolePermission(params)
        this.$modal.alert('提交成功!', '提示').then(() => {
          this.$router.push('/system/role')
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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

.ztree {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

.ztree {
  :deep(li) {
    width: 14%;
  }
}
</style>
