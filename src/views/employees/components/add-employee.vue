<template>
  <el-dialog title="新增员工" :visible="isShow">
    <!-- 表单 -->
    <el-form :model="formData" :rules="rules" label-width="120px" ref="addEmployee">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in employees.hireType" :key="item.id" :value="item.value" :label="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartmentsData" />
        <!-- 树形控件 -->
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" :props="{label:'name'}" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer 插槽 -->
    <template #footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments"; // 获取部门接口
import { tranListToTreeData } from "@/utils/index"; // 数据转换树形结构程序
import { addEmployee } from "@/api/employees"; // 新增接口
import employees from "@/api/constant/employees";
export default {
  data() {
    return {
        employees,
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 校验规则
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 获取部门数据转换树形结构
    async getDepartmentsData() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      // depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, "");
      this.loading = false;
    },

    // 点击部门项 事件
    selectNode(node) {
      this.formData.departmentName = node.name;
      this.showTree = false;
    },

    // 表单确定提交
    async btnOk() {
      try {
        await this.$refs.addEmployee.validate(); // 校验整个表单
        await addEmployee(this.formData); // 调用新增接口 提交数据
        // console.log(this.$parent); 可以调用父组件上的实例
        this.$parent.showDialog = false; // 关闭弹框
        this.$message.success('新增成功');
      } catch (error) {
        console.log(error);
        this.$message.warning(error);
      }
    },
    // 重置整个表单
    btnCancel() {
      // 重置原来的数据
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
      this.$refs.addEmployee.resetFields(); // 重置校验结果
      this.$parent.showDialog = false ; // 关闭弹框
    },
  },
};
</script>

<style>
</style>