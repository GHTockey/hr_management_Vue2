<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 具名插槽 -->
        <template #before>
          <span>共{{page.total}}条记录</span>
        </template>
        <template #after>
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportEmp">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 新增表单组件 -->
      <AddEmployee :isShow="showDialog" />
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable type="index" />
          <el-table-column label="头像" sortable>
            <template slot-scope="{row}">
              <img :src="row.staffPhoto" @click="openQrCode(row.staffPhoto)" v-isImgErr="require('@/assets/common/bigUserHeader.png')" alt="头像" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px">
            </template>
          </el-table-column>
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="工号" sortable prop="workNumber" />
          <el-table-column label="聘用形式" sortable :formatter="formatEmployment" prop="formOfEmployment" />
          <el-table-column label="部门" sortable prop="departmentName" />
          <el-table-column label="入职时间" sortable prop="timeOfEntry">
            <template slot-scope="obj">
              {{obj.row.timeOfEntry | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable prop="enableState" />
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page="page.page" :total="page.total" @current-change="changePage" />
        </el-row>
      </el-card>
      <!-- 二维码 弹框 -->
      <el-dialog title="二维码" :visible.sync="dialogVisible" width="30%">
        <el-row type="flex" justify="center">
        <canvas ref="qrCodeCanvas" />
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import AddEmployee from "./components/add-employee.vue";
import { formatDate } from "@/filters";
import Qrcode from "qrcode";
export default {
  // 注册组件
  components: { AddEmployee },
  data() {
    return {
      list: null, // 列表数据
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0, // 总数
      },
      loading: false,
      showDialog: false, // 新增框体是否显示
      dialogVisible: false, // 二维码框
    };
  },

  // 创建完成钩子
  created() {
    this.getEmployeeListData();
  },

  // 函数定义
  methods: {
    openQrCode(url) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        Qrcode.toCanvas(this.$refs.qrCodeCanvas, url)
      })
    },
    // 分页
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeListData();
    },
    // 获取数据驱动页面
    async getEmployeeListData() {
      try {
        this.loading = true; // 开启 loading 效果
        const { rows, total } = await getEmployeeList(this.page); // 发送请求获取数据
        this.page.total = total; // 总页数
        this.list = rows; // 数据列表
        this.loading = false; // 关闭 loading 效果
      } catch (error) {
        console.log(error);
      }
    },
    // 员工列表中的数据进行格式化
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1 所对应的值
      // EmployeeEnum 不用再 data 中定义, 导入直接使用
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm("确定删除?"); // 弹框是否确定
        await delEmployee(id); // 提交删除请求
        this.getEmployeeListData(); // 重新获取数据渲染
        this.$message.success("操作成功"); // 提示信息
      } catch (error) {
        console.log(error);
      }
    },

    // 导出员工 xlsx #############################################
    exportEmp() {
      //  做操作
      // 表头对应关系
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      // 懒加载
      import("@/vendor/Export2Excel").then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.formatJson(headers, rows);
        // 复杂表头配置
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: "员工信息表",
          autoWidth: true,
          bookType: "xlsx",
          // 复杂表头选项
          multiHeader,
          merges,
        });
        // 获取所有的数据

        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            return formatDate(item[headers[key]]); // 返回格式化之前的时间
          } else if (headers[key] === "formOfEmployment") {
            var en = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return en ? en.value : "未知";
          }
          return item[headers[key]];
        }); // => ["张三", "13811"，"2018","1", "2018", "10002"]
      });
      // return data
      // return rows.map(item => {
      //   // item是对象  => 转化成只有值的数组 => 数组值的顺序依赖headers  {username: '张三'  }
      //   // Object.keys(headers)  => ["姓名", "手机号",...]
      //   return Object.keys(headers).map(key => {
      //     return item[headers[key]]
      //   }) // /  得到 ['张三'，’129‘，’dd‘,'dd']
      // })
    },
  },
};
</script>

<style>
</style>
