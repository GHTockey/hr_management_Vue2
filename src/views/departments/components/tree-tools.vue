<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="delDepartmentsHandle">
            <!-- 内容 -->
            <span
              >操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>

      <!-- 右侧内容 -->
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  // props: ['treeNode']
  props: {
    treeNode: {
      type: Object,
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 删除部门程序
    delDepartmentsHandle(type) {
      // console.log(type);
      if (type === "add") {
        // 添加子部门的操作
        this.$emit("addDepts", this.treeNode);
      } else if (type === "edit") {
        //  编辑部门的操作
        this.$emit('editDepts',this.treeNode)
      } else {
        //  删除操作
        this.$confirm("确定？")
          .then((res) => {
            delDepartments(this.treeNode.id); // 调用删除接口
            this.$emit("delDeprt");
          })
          .catch((err) => {
            this.$message(err);
          });
      }
    },
  },
};
</script>

<style>
</style>