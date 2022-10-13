<template>
  <el-dialog title="添加部门" :visible="showDialog">
    <el-form label-width="120px" :rules="rules">
      <el-form-item label="部门名称" prop="name" v-model="fromData.name">
        <el-input style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="encode">
        <el-input style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="responsiblePerson">
        <el-select style="width: 80%" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template> 

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fromData: {
        name: null,
        encode: null,
        responsiblePerson: null,
        introduce: null,
      },
      rules: {
        name: [
          { required: true, message: "名称必填" },
          { min: 1, max: 50, message: "字数在1-50之间" },
        ],
        encode: [],
        responsiblePerson: [],
        introduce: [],
      },
    };
  },
};
</script>

<style>
</style>