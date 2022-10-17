<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeNode :treeNode="company" :isRoot="true" @addDepts="addDepts" />

        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <TreeNode
            ref="addDept"
            slot-scope="{ data }"
            :treeNode="data"
            @delDeprt="getDepartmentsData"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
      <AddDept
        :showDialog.sync="showDialog"
        :treeNode="node"
        @addDepts="getDepartmentsData"
      />
    </div>
  </div>
</template>

<script>
import TreeNode from "./components/tree-tools.vue";
import AddDept from "./components/dialog.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils/index";
export default {
  data() {
    return {
      departs: [],
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人" },
      defaultProps: {
        label: "name", // 表示 从这个属性显示内容
      },
      showDialog: false,
      node: null,
    };
  },
  components: {
    TreeNode,
    AddDept,
  },
  created() {
    this.getDepartmentsData();
  },
  methods: {
    async getDepartmentsData() {
      let res = await getDepartments();
      // console.log(res);
      this.company = { name: res.companyName, manager: "负责人", id: "" };
      // this.departs = res.depts; // 需要将其转化成树形结构⬇️
      this.departs = tranListToTreeData(res.depts, ""); // 需要将其转化成树形结构
      // console.log(this.departs);
    },
    // 显示对话框
    addDepts(treeNode) {
      // console.log(treeNode);
      this.showDialog = true;
      this.node = treeNode;
    },

    // 编辑弹框
    editDepts(data) {
      // 首先打开弹层
      this.showDialog = true;
      this.node = data; // 赋值操作的节点

      console.log( this.$refs.addDept);
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
