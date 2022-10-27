<template>
  <div>
    <el-upload list-type="picture-card"
               action="#"
               :file-list="FileList"
               :http-request="uploadData"
               :on-preview="handlePreview"
               :before-upload="verifyImg"
               :on-remove="handleRemove"
               :class="{ disabled: uploadsNum }">
      <i
         class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片"
               :visible.sync="showDialog">
      <img :src="imgUrl"
           style="width: 100%"
           alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
export default {
  props: {
    limit: {
      default: 1,
      type: Number,
    },
  },
  data() {
    return {
      showDialog: false,
      imgUrl: "",
      FileList: [
        {
          url: "https://img0.baidu.com/it/u=2371305810,3587591415&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281",
        },
      ],
    };
  },
  methods: {
    // 上传前校验 后缀名/大小
    verifyImg(file) {
      let types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      return true;
    },
    // 图片预览
    handlePreview(file) {
      this.imgUrl = file.url; // 预览框赋值
      this.showDialog = true; // 弹框
    },
    // 图片删除
    handleRemove(file) {
      this.FileList = this.FileList.filter((el) => el.uid != file.uid);
    },
    // cos 上传
    uploadData(params) {
      const cos = new COS({
        SecretId: "AKIDoStAC6vgJrMiv4BEBFKVgseIySvRxXJ0",
        SecretKey: "jeYPECnWVUO5Yqwson1HsOyeMyb6T4kJ",
      });
      if (params.file) {
        // console.log(params.file.name);
        cos.putObject(
          {
            Bucket: "ihrm-test-1312676635",
            Region: "ap-nanjing",
            Key: params.file.name,
            Body: params.file,
            StorageClass: "STANDARD",
          },
          function (err, data) {
            console.log(err || data);
          }
        );
      }
    },
  },
  computed: {
    uploadsNum() {
      return this.FileList.length === 1;
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>