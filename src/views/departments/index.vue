<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col>
            <span>科技股份公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <el-col>
                <!-- 下拉菜单 element -->
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <!-- 下拉菜单 -->
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 列表 -->
        <el-tree :data="depts" :props="defaultProps">
          <el-row slot-scope="{data}" type="flex">
            <!-- 部门 -->
            <el-col>
              <span>{{data.name}}</span>
            </el-col>
            <!-- 操作 -->
            <!-- <el-col :span="4">
              <span>{{data.manager}}</span>
            </el-col> -->

          </el-row>
        </el-tree>
      </el-card>

      <!-- <p>123</p> -->

    </div>
  </div>
</template>

<script>
import { getDepartments } from "@/api/departments";
// import { tranListToTreeData } from "@/utils/index";
export default {
  data() {
    return {
      loading: false,
      depts: [],
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  created() {
    this.getDepartmentsData();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    // 拿数据
    async getDepartmentsData() {
      let { depts } = await getDepartments();
      this.depts = depts;
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
  /* justify-content: space-between; */
}
</style>
