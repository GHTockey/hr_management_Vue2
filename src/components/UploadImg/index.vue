<template>
  <div>
    <el-upload list-type="picture-card" action="#" :file-list="FileList" :http-request="uploadData" :on-preview="handlePreview" :on-change="changeFile" :before-upload="verifyImg" :on-remove="handleRemove" :class="{ disabled: uploadsNum }">
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
    <!-- 进度条 -->
    <el-progress v-if="showPropress" :percentage="percentage">
    </el-progress>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "",
  SecretKey: "",
});
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
        // {
        //   url: "https://img0.baidu.com/it/u=2371305810,3587591415&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281",
        // },
      ],
      currentFileUid: "",
      // 进度
      percentage: 0,
      showPropress: false,
    };
  },
  methods: {
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    changeFile(file, FileList) {
      // this.FileList -> 本地数据组   FileList -> 上传到页面的文件对象实例
      // 将本地上传的文件对象实例里的项存到本地数据组中
      this.FileList = FileList.map((item) => item);
    },
    // 上传前校验 后缀名/大小
    verifyImg(file) {
      // console.log(file);
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
      // 最后确定上传这个文件，将文件 uid 存下用于上传云端后返回的数据标识作比较
      this.currentFileUid = file.uid;
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
      if (params.file) {
        // console.log(params.file.name);
        this.showPropress = true; // 显示进度条
        cos.putObject(
          {
            Bucket: "ihrm-test-1312676635",
            Region: "ap-nanjing",
            Key: params.file.name, // 文件名
            Body: params.file, // 整个文件对象
            StorageClass: "STANDARD", // 上传模式 默认
            // 上传进度
            onProgress: (params) => {
              this.percentage = params.percent * 100;
              if (this.percentage === 100) {
                this.showPropress = false;
                setTimeout(() => {
                  this.percentage = 0;
                }, 2000);
              }
            },
          },
          (err, data) => {
            // 上传成功
            if (data.statusCode === 200) {
              // console.log(data);
              this.FileList = this.FileList.map((el) => {
                // 确定上传的项 赋予云端返回的URL和一个键为true
                if (el.uid === this.currentFileUid) {
                  return { url: `http://${data.Location}`, upload: true };
                }
                return el;
              });
            }
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
