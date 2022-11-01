<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <!-- checkbox 遍历前先绑定: roleIds, 选中的复选框项目会进入到此对象中  -->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    // userId: {
    //   type: String,
    //   default: null,
    // },
  },
  data() {
    return {
      list: [], // 角色列表数据
      roleIds: [], // 选中的复选框 来自 lable 绑定的值
      userId: null,
    };
  },
  created() {
    this.getRoleListData();
  },
  methods: {
    // 确定提交
    async btnOk() {
      // 此时 userId 已经在点击《角色》时获取角色信息的时候存下了, 不需要 props 传值!!!
      await assignRoles({ roleIds: this.roleIds, id: this.userId });
      this.$emit('update:showRoleDialog', false); // 关闭弹框
      this.$message.success('操作成功');
    },
    // 获取当前的角色
    async getUserDetailByIdData(id) {
      let { roleIds } = await getUserDetailById(id);
      this.roleIds = roleIds;
      this.userId = id; // 存下 id
    },
    // 关闭弹框
    btnCancel() {
      this.$emit("update:showRoleDialog", false);
    },
    // 获取角色数据
    async getRoleListData() {
      let { rows } = await getRoleList();
      this.list = rows;
    },
  },
};
</script>