<template>
  <el-dialog :title="isEdit" :visible="showDialog" @close="close">
    <el-form label-width="120px" :rules="rules" :model="fromData" ref="deptForm">
      <el-form-item label="部门名称" prop="name">
        <el-input style="width: 80%" placeholder="1-50个字符" v-model="fromData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input style="width: 80%" placeholder="1-50个字符" v-model="fromData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select style="width: 80%" placeholder="请选择" v-model="fromData.manager" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项 这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input style="width: 80%" placeholder="1-300 个字符" type="textarea" :rows="3" v-model="fromData.introduce" />
      </el-form-item>
    </el-form>
    <!-- el-dialog 有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为 24 -->
      <el-col>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template> 

<script>
import {
  getDepartments,
  getEmployeeSimple,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    // 检查部门名称
    var checkNameIsRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      // console.log(this.treeNode);
      // console.log(value);
      // console.log(depts);
      const isRepeat = depts
        .filter((item) => item.pid === this.treeNode.id)
        .some((item) => item.name === value);
      // console.log(isRepeat);
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback();
    };
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments();
      // const isRepeat = depts.some((item) => item.code === value && value); // 这里加一个 value不为空 因为我们的部门有可能没有code
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false;
      if (this.fromData.id) {
        // 有id就是编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts
          .filter(
            (item) =>
              item.id !== this.fromData.id && item.pid === this.treeNode.pid
          )
          .some((item) => item.name === value);
      } else {
        // 没id就是新增模式
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback();
    };
    return {
      fromData: {
        name: "",
        code: null,
        manager: null,
        introduce: null,
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkNameIsRepeat },
        ],
        code: [
          { required: true, message: "此项必填", trigger: "blur" },
          { min: 1, max: 50, message: "要求1-50个字符" },
          { trigger: "blur", validator: checkCodeRepeat },
        ],
        manager: [{ required: true, message: "此项必填", trigger: "blur" }],
        introduce: [
          { required: true, message: "此项必填", trigger: "blur" },
          { min: 1, max: 300, message: "要求1-300个字符" },
        ],
      },
      peoples: [], // 接收获取的员工简单列表的数据
    };
  },
  methods: {
    btnOK() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          // 要分清楚现在是编辑还是新增
          if (this.fromData.id) {
            // 编辑模式  调用编辑接口
            await updateDepartments(this.fromData);
          } else {
            // 新增模式
            await addDepartments({ ...this.fromData, pid: this.treeNode.id }); // 调用新增接口 添加父部门的id
          }
          this.$emit("addDepts"); // 重新调用接口刷新数据
          this.$emit("update:showDialog", false); // 关闭弹窗
        }
      });
    },
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.fromData = await getDepartDetail(id);
    },
    close() {
      this.$emit("update:showDialog", false);
      // 重置表单
      this.$refs.deptForm.resetFields();
    },
  },
  computed: {
    isEdit() {
      return this.fromData.id ? "编辑部门" : "添加子部门";
    },
  },
};
</script>

<style>
</style>