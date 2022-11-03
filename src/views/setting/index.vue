<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="btnDelRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination :current-page="page.page" :page-size="page.pagesize" :total="page.total" layout="prev, pager, next" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <!-- tab 2 -->
          <el-tab-pane label="公司信息">
            <!-- 提示信息 -->
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon :closable="false" />
            <!-- tab 2 表单 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹框组件 -->
      <el-dialog :title="roleForm.id ? '编辑角色' : '新增角色'" :visible="showDialog" @close="btnCancel">
        <el-form label-width="120px" :rules="rules" ref="roleForm" :model="roleForm">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 分配权限弹框 -->
      <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
        <!-- 权限是一颗树 -->
        <!-- 将数据绑定到组件上 -->
        <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
        <!-- id作为唯一标识 -->
        <el-tree ref="permTree" v-model="selectCheck" :data="permData" :props="defaultProps" :show-checkbox="true" :check-strictly="true" :default-expand-all="true" :default-checked-keys="selectCheck" node-key="id" />
        <!-- 确定 取消 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
            <el-button size="small" @click="btnPermCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleList, // 获取角色列表
  getCompanyInfo, // 获取公司信息
  deleteRole, // 删除角色
  getRoleDetail, // 获取角色详情
  updateRole, // 修改角色
  addRole, // 新增角色
  assignPerm, // 给角色分配权限
} from "@/api/setting";
import { getPermissionList } from "@/api/permisson";
import { tranListToTreeData } from "@/utils/index";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [], // 角色数据列表
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0, // 记录总数
      },
      formData: [], // 公司详情 表单数据
      showDialog: false, // 是否弹框
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: null,
        description: null,
      },
      rules: {
        // 校验规则
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        description: [{ required: true, message: "此项必填", trigger: "blur" }],
      },
      // 分配权限
      showPermDialog: false,
      defaultProps: {
        label: "name",
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null, // 用来记录分配角色的id
    };
  },

  methods: {
    // 获取角色列表
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage; // 将当前页码赋值给当前的最新页码
      this.getRoleList();
    },
    // 获取公司详情
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
    },
    // 删除角色
    async btnDelRole(id) {
      try {
        await this.$confirm("确定删除?");
        // 上方执行完后为 true 后执行下方代码
        await deleteRole(id); // 调用删除接口
        this.$message.success("删除成功"); // 提示信息
        this.getRoleList(); // 重新获取数据渲染
      } catch (error) {
        this.$message.warning(error);
      }
    },
    // 编辑角色弹框
    async editRole(id) {
      this.roleForm = await getRoleDetail(id); // 获取数据
      this.showDialog = true; // 打开弹框
    },
    // 框体确认
    async btnOk() {
      try {
        await this.$refs.roleForm.validate(); // 对整个表单进行校验

        if (this.roleForm.id) {
          // 有 id 表示编辑
          await updateRole(this.roleForm); // 提交编辑接口
        } else {
          // 新增
          await addRole(this.roleForm);
        }

        await this.getRoleList(); // 重新获取数据渲染
        this.$message.success("操作成功");
        this.btnCancel(); // 关闭框体
      } catch (error) {
        console.log("表单有错误：", error);
      }
    },
    // 关闭弹框
    btnCancel() {
      this.showDialog = false; // 关闭弹框
      this.$refs.roleForm.resetFields(); // 重置表单
      // 重置数据
      this.roleForm = {
        name: "",
        description: "",
      };
    },
    // 点击分配权限按钮
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(),'0');
      this.roleId = id; // 存下当前 id
      let {permIds} = await getRoleDetail(id); // 根据 id 去获取当前的相关权限
      this.selectCheck = permIds; // 赋值到本地数据
      this.showPermDialog = true; // 打开弹框
    },





    btnPermCancel() {
      this.permData = []; // 重置数据
      this.showPermDialog = false; // 关闭弹框
    },
    async btnPermOK(){
      // console.log(this.$refs.permTree.getCheckedKeys());
      await assignPerm({permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId});
      this.$message.success('操作成功');
      this.showPermDialog = false;
      this.selectCheck = [];
    },
  },

  created() {
    this.getRoleList(); // 获取角色列表
    this.getCompanyInfo();
  },

  computed: {
    ...mapGetters(["companyId"]),
  },
};
</script>

<style>
</style>
