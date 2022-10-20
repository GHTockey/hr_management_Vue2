<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 具名插槽 -->
        <template #before>
          <span>共{{page.total}}条记录</span>
        </template>
        <template #after>
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable type="index" />
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
              <el-button type="text" size="small">查看</el-button>
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
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
export default {
  data() {
    return {
      list: null, // 列表数据
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0, // 总数
      },
      loading: false,
    };
  },
  created() {
    this.getEmployeeListData();
  },
  methods: {
    // 分页
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeListData();
    },
    async getEmployeeListData() {
      this.loading = true;
      const { rows, total } = await getEmployeeList(this.page);
      this.page.total = total; // 总页数
      this.list = rows;
      this.loading = false;
    },
    // 员工列表中的数据进行格式化
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1 所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    // 删除员工
    async deleteEmployee(id){
      try {
        await this.$confirm('确定删除?');
        await delEmployee(id); // 提交删除请求
        this.getEmployeeListData(); // 重新获取数据渲染
        this.$message.success('操作成功'); // 提示信息

      } catch (error) {
        console.log(err);
      }
    }
  },
};
</script>

<style>
</style>
