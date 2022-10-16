<template>
  <el-dialog title="添加部门" :visible="showDialog">
    <el-form label-width="120px" :rules="rules" :model="fromData">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="fromData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="fromData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          style="width: 80%"
          placeholder="请选择"
          v-model="fromData.manager"
        />
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="fromData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog 有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col>
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template> 

<script>
import { getDepartments } from "@/api/departments";
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
      console.log(this.treeNode);
      console.log(value);
      console.log(depts);
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
      console.log(666);
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments();
      const isRepeat = depts.some((item) => item.code === value && value); // 这里加一个 value不为空 因为我们的部门有可能没有code
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
    };
  },
};
</script>

<style>
</style>