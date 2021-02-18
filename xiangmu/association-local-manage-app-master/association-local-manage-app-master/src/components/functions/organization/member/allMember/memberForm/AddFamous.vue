<template>
  <div>
    <div class="fieldbox">
      <h5>校友照片</h5>
      <div class="alumniPhoto">
        <el-upload
          :action="action"
          list-type="picture-card"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </div>
    <div class="fieldbox">
      <h5>校友资讯网址</h5>
      <div class="alumniUrl">
        <el-input
          v-if="urlList"
          placeholder="请补全网址（只需输入网址的后半部分）"
          v-model="urlList.url"
          style="width:500px;marginBottom:15px;"
        >
          <template slot="prepend">
            <el-select style="width:220px;" size="small" v-model="urlList.type" placeholder="请选择">
              <el-option
                v-for="item in urlOptions"
                :key="item.type"
                :label="item.url"
                :value="item.type"
              ></el-option>
            </el-select>
          </template>
        </el-input>
      </div>
    </div>
    <div style="display:flex;justifyContent:flex-end;alignItems:center;">
      <el-button type="primary" @click="sureAdd">添加</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { requestBaseUrl } from "@/js/config/serviceConfig";
export default {
  name: "addFamous",
  props: ["userId"],
  data() {
    return {
      action: requestBaseUrl + "/api/common/anon/uploadFile", //图片上传地址
      fileList: [],
      urlList: {
        url: "",
        type: 1
      },
      urlOptions: [{ url: "https://baike.baidu.com/", type: 1 }]
    };
  },
  methods: {
    handleSuccess(res, file, fileList) {
      this.fileList.push({
        url: res.data
      });
    },
    handleRemove(file, fileList) {
      this.fileList.forEach((item, index) => {
        if (item.url == file.url) {
          this.fileList.splice(index, 1);
        }
      });
    },
    sureAdd() {
      var addForm = {};
      //图片处理
      var arr = [];
      this.fileList.forEach(item => {
        arr.push(item.url);
      });
      addForm.images = JSON.stringify(arr);
      //网址处理
      var arr1 = [];
      var newObj = {};
      if (!this.urlList.url) {
        addForm.urlList = [];
      } else {
        this.urlOptions.forEach(item => {
          newObj[item.type] = item.url;
        });
        arr1.push({
          url: newObj[this.urlList.type] + this.urlList.url,
          type: this.urlList.type
        });
        addForm.urlList = arr1;
      }
      addForm.memberId = this.userId;
      this.$request
        .post("/api/admin/reptile/becomeFamousMember", addForm)
        .then(res => {
          if (res.success) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$emit("close");
            this.$emit("refresh");
          }
        });
    }
  }
};
</script>

<style scoped lang="less">
.fieldbox {
  padding-left: 5px;
  //   margin-bottom: 20px;
  //   border-bottom: 1px dashed #e6e6e6;
  font-size: 14px;
  padding-bottom: 20px;
  h5 {
    color: #222222;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      color: #3fa1b6;
      padding: 0;
      margin-right: 21px;
    }
  }
}
.alumniPhoto {
  padding: 25px 40px;
  display: flex;
}
.alumniUrl {
  padding: 25px 40px;
}
</style>