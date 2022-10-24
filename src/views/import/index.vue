<template>
  <UploadExcel :onSuccess="success" />
</template>

<script>
import { importEmployee } from "@/api/employees";
import UploadExcel from "@/components/UploadExcel";
import { formatDate } from "@/utils";
export default {
  components: {
    UploadExcel,
  },
  data() {
    return {};
  },
  methods: {
    async success({ header, results }) {
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };
      const arr = [];
      results.forEach((item) => {
        const userInfo = {};
        Object.keys(item).forEach((key) => {
          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            userInfo[userRelations[key]] = new Date(
              formatDate(item[key], "/")
            );
            return;
          }
          userInfo[userRelations[key]] = item[key];
        });
        arr.push(userInfo);
      });
      await importEmployee(arr); // 调用导入接口
      this.$router.back();
    },
  },
};
</script>

<style>
</style>