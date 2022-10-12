<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeNode :treeNode="company" :isRoot="true" />

        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <TreeNode slot-scope="{ data }" :treeNode="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeNode from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils/index";
export default {
  data() {
    return {
      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人" },
      defaultProps: {
        label: "name", // 表示 从这个属性显示内容
      },
    };
  },
  components: {
    TreeNode,
  },
  created() {
    this.getDepartmentsData();
  },
  methods: {
    async getDepartmentsData() {
      let res = await getDepartments();
      // console.log(res);
      this.company = { name: res.companyName, manager: "负责人" };
      // this.departs = res.depts; // 需要将其转化成树形结构
      this.departs = tranListToTreeData(res.depts, ""); // 需要将其转化成树形结构
      console.log(this.departs);
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
