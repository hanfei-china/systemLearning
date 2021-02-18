<template>
  <el-dialog
    :visible="visible"
    append-to-body
    @update:visible="$emit('update:visible')"
    :title="title"
    :close-on-click-modal="false"
    class="ybimportdialog"
    width="700px"
    v-loading="loading"
  >
    <div class="cont">
      <el-steps :active="active" finish-status="success" align-center class="stepbox">
        <el-step title="选择文件"></el-step>
        <el-step title="导入数据"></el-step>
        <el-step title="导入完成"></el-step>
      </el-steps>
      <div class="section section1" v-show="active==0">
        <div class="tips">
          <p>提示：</p>
          <p>
            1.请
            <a class="downloadTemplate" :href="templateUrl" target="_blank">点击下载模板</a>后并填好内容，再导入数据；
          </p>
          <p>2.按模板中的格式编辑好数据（切勿增减调整列，以免引起数据混乱）；</p>
          <p>3.选择编辑好的文件，点击上传；</p>
        </div>
        <div class="uploadbox">
          <template v-if="file">{{file.name}}</template>
          <template v-else>未选择任何文件</template>
          <div class="uploadbtn" @click="handleClick">
            <div class="el-upload el-upload--text">
              <span>选择文件</span>
              <input
                type="file"
                ref="fileinput"
                name="excel"
                accept=".xls, .xlsx"
                class="el-upload__input"
                @change="handleChange"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="section section2" v-show="active==3">
        <div class="successbox" v-if="allOk">
          <i class="el-icon-success"></i>
          <div class="warningbox">
            <h5>导入成功</h5>
            <p>共导入{{successCount}}条数据</p>
          </div>
        </div>
        <div class="failbox" v-else>
          <div class="rows successrows">
            <i class="el-icon-success"></i>
            <p>
              有
              <span>{{successCount}}</span>条数据导入成功
            </p>
          </div>
          <div v-if="repeatObj">
            <div class="rows" v-if="repeatObj.repeatNum>0">
              <i class="el-icon-warning"></i>
              <p>
                有
                <span>{{repeatObj.repeatNum}}</span>条重复数据
              </p>
              <el-button
                type="warning"
                size="mini"
                :disabled="singleCoverClick"
                @click="confirmImport('cover','single')"
              >覆盖</el-button>
              <el-button
                type="warning"
                size="mini"
                :disabled="singleAddClick"
                @click="confirmImport('add','single')"
              >新增</el-button>
              <el-button type="warning" size="mini" @click="downloadExcel('single')">下载</el-button>
            </div>

            <div class="rows" v-if="repeatObj.repeatMultiNum>0">
              <i class="el-icon-warning"></i>
              <p>
                有
                <span>{{repeatObj.repeatMultiNum}}</span>条多次重复数据
              </p>
              <el-button
                type="warning"
                size="mini"
                :disabled="multipleAddClick"
                @click="confirmImport('add','multiple')"
              >新增</el-button>
              <el-button type="warning" size="mini" @click="downloadExcel">下载</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <slot name="footer">
        <div style="text-align: right">
          <el-button size="mini" @click="closeDialog" v-show="active==0">取消</el-button>
          <el-button size="mini" @click="startImport" type="primary" v-show="active==0">开始导入</el-button>
          <el-button size="mini" @click="closeDialog" type="primary" v-show="active==3">完成</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>
<script>
import { requestBaseUrl } from "@/js/config/serviceConfig.js";
import axios from "axios";
export default {
  name: "importFile",
  props: {
    visible: Boolean,
    title: String
  },
  data() {
    return {
      active: 0,
      requestBaseUrl: requestBaseUrl,
      file: null,
      allOk: false,
      errorMessages: [],
      repeatMessages: [],
      repeatObj: null,
      successCount: 0,
      templateUrl: requestBaseUrl + "/api/admin/member/poi/excel/template",
      loading: false,
      multipleAddClick: false,
      singleAddClick: false,
      singleCoverClick: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.active = 0;
        this.multipleAddClick = false;
        this.singleAddClick = false;
        this.singleCoverClick = false;
        this.$nextTick(() => {
          this.$refs.fileinput.value = null;
        });
        this.file = null;
        if (this.title == "校友档案导入") {
          this.templateUrl =
            this.requestBaseUrl + "/api/admin/member/archive/excel/template";
        } else if (this.title == "项目导入") {
          this.templateUrl =
            this.requestBaseUrl + "/fund/project/excelTemplate";
        } else if (this.title == "受助人导入") {
          this.templateUrl =
            this.requestBaseUrl +
            "/scholarship/detailImportTemplate?fileName=受助人导入模板";
        } else if (this.title == "受助人_学生导入") {
          this.templateUrl =
            this.requestBaseUrl +
            "/aid/student/importTemplate?fileName=受助人_学生导入模板";
        } else if (this.title == "受助人_教师导入") {
          this.templateUrl =
            this.requestBaseUrl +
            "/aid/teacher/importTemplate?fileName=受助人_教师导入模板";
        } else if (this.title == "捐赠物品清单导入") {
          this.templateUrl =
            this.requestBaseUrl +
            "/fund/inventory/detailImportTemplate?fileName=捐赠物品清单导入模板";
        } else if (this.title == "分会导入") {
          this.templateUrl =
            this.requestBaseUrl +
            "/api/admin/branch/excel/template?fileName=分会导入模板";
        }
      }
    }
  },
  methods: {
    downloadExcel(type) {
      if (type == "single") {
        window.open(this.repeatObj.repeatMemberExcelUrl);
      } else {
        window.open(this.repeatObj.repeatMultiMemberExcelUrl);
      }
    },
    confirmImport(action, type) {
      var actionName = "覆盖";
      var url =
        "/api/admin/member/poi/excel/import/" +
        action +
        "?excelUrl=" +
        this.repeatObj.repeatMultiMemberExcelUrl;
      if (action == "add") {
        actionName = "新增";
      }
      if (type == "single") {
        url =
          "/api/admin/member/poi/excel/import/" +
          action +
          "?excelUrl=" +
          this.repeatObj.repeatMemberExcelUrl;
      }
      this.$confirm("确认" + actionName + "数据吗？").then(confirm => {
        this.$request.post(url).then(response => {
          if (response.success) {
            if (action == "add") {
              if (type == "single") {
                this.singleAddClick = true;
              } else {
                this.multipleAddClick = true;
              }
            } else {
              this.singleCoverClick = true;
            }
            this.$message.success(actionName + "成功");
            this.$emit("queryTable");
          }
        });
      });
    },
    startImport() {
      if (!this.file) {
        this.$message.warning("请先选择文件");
        return;
      }
      this.loading = true;
      let formData = new FormData();
      formData.append("excel", this.file);
      var url = requestBaseUrl + "/api/admin/member/poi/excel/import";
      if (this.title == "校友档案导入") {
        url = requestBaseUrl + "/api/admin/member/archive/excel/import";
      }
      if (this.title == "分会导入") {
        url = requestBaseUrl + "/api/admin/branch/excelImportBranch";
      }
      axios({
        method: "post",
        url: url,
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then(res => {
          this.$nextTick(()=>{ this.loading = false; })
          this.active = 3;
          if (res.data.success) {
            if (this.title == "校友档案导入") {
              this.successCount = res.data.data;
              this.allOk = true;
            }
            if (this.title == "分会导入") {
              this.successCount = res.data.data.data;
              this.allOk = true;
            }else {
              this.successCount = res.data.data.successNum;
              if (
                res.data.data.repeatMultiNum == 0 &&
                res.data.data.repeatNum == 0
              ) {
                this.allOk = true;
              } else {
                this.allOk = false;
                this.repeatObj = res.data.data;
              }
            }
          }
          if (this.successCount > 0) {
            this.$emit("queryTable");
          }
        })
        .catch(err => {
          this.$message.error("导入失败");
        });
    },
    handleChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      let postFiles = Array.prototype.slice.call(files);
      this.file = postFiles[0];
    },
    handleClick() {
      this.$refs.fileinput.click();
    },
    beforeAvatarUpload(file) {
      if (file.size > 1024 * 1024 * 10) {
        this.$message.warning("上传文件必须小于10M");
        return false;
      }
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file);
      this.file = file;
    },
    closeDialog() {
      this.file = null;
      this.$emit("update:visible", false);
      if (this.title==='分会导入') {
          this.$emit('queryTable');
      }
    }
  }
};
</script>

<style lang="less">
.ybimportdialog {
  .el-dialog {
    border: 1px solid #e4e4e4;
    border-radius: 5px;
    margin-top: 11vh !important;
  }
  .el-dialog__title {
    font-size: 16px;
  }
  .el-dialog__headerbtn {
    font-size: 18px;
    top: 13px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #e4e4e4;
    padding: 10px 20px;
  }
  .el-dialog__body {
    border-bottom: 1px solid #e4e4e4;
  }
  .el-dialog__footer {
    padding: 10px 20px;
  }
  .el-step__title {
    font-size: 13px;
    line-height: 24px;
  }
  .is-process {
    color: #409eff;
    .el-step__icon {
      border-color: #409eff;
    }
  }
  .cont {
    overflow: hidden;
    .stepbox {
      width: 800px;
      margin-left: -71px;
      margin-top: 30px;
    }
    .section {
      margin-top: 30px;
      margin-bottom: 50px;
    }
    .section2 {
      margin-bottom: 30px;
    }
    .tips {
      margin-left: 50px;
      p {
        margin: 0;
        line-height: 30px;
        .downloadTemplate {
          color: #409eff;
        }
      }
    }
    .uploadbox {
      margin-top: 20px;
      margin-left: 50px;
      font-size: 12px;
      line-height: 34px;
      border: 1px solid #9eabba;
      background: #f8fbfe;
      border-radius: 3px;
      overflow: hidden;
      position: relative;
      padding-left: 20px;
      width: 500px;
      box-sizing: border-box;
      .uploadbtn {
        position: absolute;
        right: 0;
        top: 0;
        /deep/ .el-upload {
          padding: 0 15px;
          background: white;
          border-left: 1px solid #9eabba;
        }
      }
    }
  }
}
.successbox {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 50px;
    color: #6abd3d;
  }
  .warningbox {
    margin-left: 15px;
    h5 {
      margin: 0;
      font-size: 30px;
      font-weight: normal;
      color: #063e6f;
    }
    p {
      font-size: 14px;
      margin: 0;
    }
  }
}
.failbox {
  margin-left: 30px;
  .rows {
    margin-top: 10px;
    display: flex;
    align-items: center;
    i {
      font-size: 20px;
      color: #ff9966;
    }
    p {
      margin: 0 10px;
      line-height: 28px;
      span {
        color: #ff9966;
        margin: 0 3px;
      }
    }
  }
  .listbox {
    margin-left: 30px;
    margin-top: 10px;
    max-height: 96px;
    overflow: auto;
    li {
      color: #ff9966;
      line-height: 24px;
    }
  }
  .successrows {
    i {
      color: #6abd3d;
    }
    p {
      span {
        color: #6abd3d;
      }
    }
  }
}
</style>
