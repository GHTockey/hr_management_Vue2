<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="forms" label-width="120px" style="margin-left: 120px; margin-top:30px" v-loading="loading" :rules="rules" :model="userInfo">
              <el-form-item label="姓名:" prop="username">
                <el-input style="width:300px" v-model="userInfo.username" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input style="width:300px" type="password" v-model="userInfo.password2" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserInfo">
                  更新
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="UserComponent" />
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import JobInfo from "../components/job-info.vue";
import UserComponent from "../components/user-info.vue";
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
export default {
  data() {
    return {
      JobInfo,
      UserComponent,
      loading: false, // loading 开关
      userId: this.$route.params.id,
      userInfo: {
        username: "",
        password2: "",
      },
      password2: "",
      // 校验规则配置
      rules: {
        username: [{ required: true, message: "此项必填", trigger: "blur" }],
        password2: [
          { required: true, message: "此项必填", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserDetailByIdData();
  },

  methods: {
    async getUserDetailByIdData() {
      this.loading = true;
      this.userInfo = await getUserDetailById(this.userId);
      this.loading = false;
    },
    // 更新按钮
    async updateUserInfo() {
      try {
        await this.$refs.forms.validate(); // 校验
        this.loading = true;
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2,
        });
        this.$message.success("操作成功");
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.$message.warning(error);
      }
    },
  },
};
</script>

<style>
</style>