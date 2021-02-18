<template>
  <div class="contentEdit">
    <div class="contentEdit-top">
      <div class="contentEdit-top__one">
        <img src="./image/iconPre.png" alt/>
        <span>邮件内容</span>
      </div>
      <div class="contentEdit-top__two">
        <span class="font" style="marginright: 15px">标题</span>
        <el-input
          placeholder="请输入标题"
          v-model="mailForm.subject"
          clearable
          style="width: 65%"
        ></el-input>
      </div>
      <div class="contentEdit-top__two">
        <span class="font" style="marginright: 15px">邮件模板</span>
        <el-select
          v-model="mailForm.templateId"
          class="select"
          style="width: 65%"
          placeholder="请选择邮件模板"
        >
          <el-option
            v-for="item in mailTemplateList"
            :key="item.template.id"
            :label="item.template.title"
            :value="item.template.id"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="richTextEdit">
      <editor
        v-model="mailForm.content"
        ref="editor"
      ></editor>
      <div class="uploadFile">
        <el-upload
          class="upload-demo"
          :action="action"
          :multiple="true"
          :limit="3"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="handleBefore"
          :on-exceed="handleExceed"
          :file-list="filesList"
        >
          <img src="./image/uploadFile.png" alt/>
          <el-button
            size="small"
            type="text"
            style="fontsize: 14px; color: #4f86c5"
          >上传附件
          </el-button
          >
          <span style="color: #8a8a8a; margin-left: 10px"
          >(10M以下)</span
          >
        </el-upload>
        <!-- <img src="./image/uploadFile.png" alt />
        <span>上传附件</span>
        <span style="color:#8a8a8a;margin-left:10px;">(10M以下)</span>-->
        <div class="innerHtml">
          <el-select
            v-model="selectInsert"
            placeholder="请选择"
            size="mini"
            style="marginright: 20px"
          >
            <el-option
              v-for="item in insertList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            @click="insertHtml"
            size="mini"
            style="backgroundcolor: #f1f3f6"
          >插入
          </el-button
          >
        </div>
      </div>
    </div>
    <div class="submitMail">
      <el-button
        size="small"
        icon="el-icon-document"
        style="
                    color: #4f86c5;
                    fontsize: 14px;
                    border: 1px solid #4f86c5;
                "
        @click="dialogTableVisible = true"
      >预览
      </el-button>
      <div>
        <el-button
          v-if="!timedSend"
          @click="timedSend = true"
          size="small"
          icon="el-icon-circle-plus-outline"
          style="fontSize: 14px; marginRight: 15px; color: black"
          type="text"
        >定时发送
        </el-button>
        <el-button
          v-if="timedSend"
          @click="timedSend = false"
          size="small"
          icon="el-icon-success"
          style="fontSize: 14px; marginRight: 15px; color: black"
          type="text"
        >定时发送
        </el-button>
        <el-date-picker
          v-if="timedSend"
          v-model="mailForm.sendTime"
          type="datetime"
          placeholder="选择日期时间"
          style="marginRight: 15px"
        ></el-date-picker>
        <!-- <el-tooltip class="item" effect="dark" :content="information" placement="top-end" @mouseover.native="ifCanSend">
          <el-button
            @click="sendMail"
            size="small"
            style="color:#fff;backgroundColor: #428bca;fontSize:14px;"
          >发送</el-button>
        </el-tooltip>-->
        <el-button
          @click="sendMail"
          size="small"
          style="
                        color: #fff;
                        backgroundColor: #428bca;
                        fontSize: 14px;
                    "
        >发送
        </el-button>
      </div>
    </div>
    <!-- 预览模板 -->
    <el-dialog
      :visible.sync="dialogTableVisible"
      width="40%"
      append-to-body
    >
      <div slot="title" style="color: #394263; fontsize: 24px">预览</div>
      <div class="mailContent">
        <p>
          发送自:
          <span>{{ senderName }}</span>
        </p>
        <!-- <p>
          回复到:
          <span>孙悟空@花果山水帘洞.com</span>
        </p>-->
      </div>
      <div v-html="mailForm.content" class="mailContentShow"></div>
    </el-dialog>
  </div>
</template>

<script>
import {requestBaseUrl} from "../../../../../js/config/serviceConfig";
import editor from "../../../../util/editor/Editor";

export default {
  name: "contentEdit",
  props: ["senderName", "receivers", 'isAllMember'],
  components: {editor},
  data() {
    return {
      mailForm: {
        subject: "",
        content: "",
        sendTime: "",
        sendType: 1,
        templateId: "",
      },
      mailTemplateList: null,
      timedSend: false,
      filesList: [], //上传文件的地址
      action: requestBaseUrl + "/api/common/anon/uploadFile",
      dialogTableVisible: false,
      editor: null,
      selectInsert: "",
      insertList: [], //插入字段的列表
    };
  },
  watch: {
    timedSend(val) {
      if (val) {
        this.mailForm.sendType = 2;
      } else {
        this.mailForm.sendTime = "";
        this.mailForm.sendType = 1;
      }
    },
    "mailForm.templateId"(val) {
      this.mailTemplateList.forEach((item) => {
        if (item.template.id === val) {
          this.mailForm.subject = item.template.subject;
          this.$refs.editor.copyContent = item.template.content;
          let fileArr = JSON.parse(item.template.attachPaths)
          if (fileArr && fileArr.length) {
            this.filesList = fileArr
          } else {
            this.filesList = []
          }

        }
      });
    },
  },
  methods: {
    handleRemove(file, fileList) {
      this.filesList.forEach((item, index) => {
        if (item.url === file.response.data) {
          this.filesList.splice(index, 1);
        }
      });
    },
    handleSuccess(response, file, fileList) {
      var arr = file.name.split(".");
      var name = arr[0];
      for (var i = 1; i < arr.length - 1; i++) {
        name = name + "." + arr[i];
      }
      var obj = {
        name,
        url: file.response.data,
      };
      this.filesList.push(obj);
    },
    handleBefore(file) {
      //检测上传文件的大小
      var size = 10 * 1024 * 1024;
      // var size = 10 * 1024;
      if (file.size > size) {
        this.$message({
          message: "上传文件大小不得大于10M",
          type: "warning",
        });
        return false;
      } else {
        return true;
      }
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "同时上传文件个数不得超过3个",
        type: "warning",
      });
    },
    //发送邮件
    sendMail() {
      if (!this.senderName) {
        this.$message({
          message: "请先设置邮箱名称",
          type: "warning",
        });
        return;
      }

      if (this.receivers.length === 0 && !this.isAllMember) {
        this.$message({
          message: "请先选择邮件接收人",
          type: "warning",
        });
        return;
      }

      if (!this.mailForm.subject) {
        this.$message({
          message: "请先设置邮件主题",
          type: "warning",
        });
        return;
      }
      if (!this.mailForm.content) {
        this.$message({
          message: "请先编辑邮件内容",
          type: "warning",
        });
        return;
      }
      if (this.mailForm.sendType === 2 && !this.mailForm.sendTime) {
        this.$message({
          message: "请选择定时发送的时间",
          type: "warning",
        });
        return;
      }
      let params = {
        attachPaths: JSON.stringify(this.filesList),
        content: this.mailForm.content,
        receivers: this.receivers,
        sendTime: this.mailForm.sendTime,
        sendType: this.mailForm.sendType,
        senderName: this.senderName,
        subject: this.mailForm.subject,
        isAllMember: this.isAllMember
      }
      this.$request
        .post("/api/admin/emailTelPhone/sendEmail", params)
        .then(() => {
          this.$notify({
            title: "成功",
            message: "邮件发送成功",
            type: "success",
          });
        });
    },
    //插入字段
    insertHtml() {
      if (!this.editor) {
        this.editor = this.$refs.editor.ue;
      }
      for (let item of this.insertList) {
        if (item.id === this.selectInsert) {
          let temp = `&nbsp;<span style="background-color: #eff2f7;padding: 2px 5px;height: 23px;" contenteditable="false">[#${item.name}#]</span>&nbsp;`;
          this.editor.execCommand("insertHtml", temp);
        }
      }

      // var span = `&nbsp;<span style="background-color: #eff2f7;padding: 2px 5px;height: 23px;" contenteditable="false">[#${this.selectInsert}#]</span>&nbsp;`;
      // this.editor.execCommand("insertHtml", span);
      // for (let item of this.fieldList) {
      //   if (item.id === id) {
      //     // this.editor.execCommand('insertHtml',`<span class="field" x-id="${item.code}">{{${item.name}}}</span>`);
      //     this.editor.execCommand("insertHtml", `{{${插入}}}`);
      //   }
      // }
    },
    getMailTemplateList() {
      this.$request
        .get("/admin/communication/template/getTemplate", {
          params: {
            objectType: 0,
            templateType: 0,
          },
        })
        .then((res) => {
          if (res.success) {
            this.mailTemplateList = res.data;
          }
        });
    },
    getInsertList() {
      let list = [];
      this.$request
        .get("/api/common/associator/getFieldsInfo")
        .then((res) => {
          if (res.success) {
            list = res.data;
            for (let i = 0; i < list.length; i++) {
              if (list[i].topicType === 9) {
                list.splice(i, 1);
              }
            }
            this.insertList = list.filter((item) => {
              return [0, 1, 2].includes(item.groupId);
            });
          }
        });
    },
  },
  mounted() {
    this.getMailTemplateList();
    this.getInsertList();
  },
};
</script>

<style lang="less" scoped>
.contentEdit {
  padding: 20px;
}

.contentEdit {
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.05), 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  //   width: 100%;
  height: 100%;
  min-height: 760px;
}

.contentEdit-top {
  .contentEdit-top__one {
    padding-bottom: 20px;
    display: flex;
    align-items: center;

    img {
      width: 14px;
      height: 18px;
      margin-right: 4px;
    }

    span {
      font-size: 16px;
      color: #323232;
      line-height: 18px;
      height: 18px;
    }
  }

  .contentEdit-top__two {
    padding: 0 40px 20px 20px;
    display: flex;
    align-items: center;

    span {
      min-width: 60px;
      margin-right: 15px;
      font-size: 14px;
      color: #686868;
      line-height: 2.5;
    }

    .font {
      text-align-last: justify;
      text-align: justify;
      text-justify: distribute-all-lines; //兼容ie浏览器
    }
  }
}

.richTextEdit {
  // width: 100%;
  padding: 0 0 20px 95px;
  width: calc(65% - 38.5px);

  .uploadFile {
    margin-top: 20px;
    // width: 25%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    cursor: pointer;

    img {
      width: 14px;
      height: 14px;
      margin-right: 5px;
    }

    .innerHtml {
      margin-top: 7px;
      margin-left: 80px;
    }
  }
}

.submitMail {
  padding: 0 0 0 95px;
  display: flex;
  justify-content: space-between;
}

.mailContent {
  p {
    font-size: 16px;
    color: #323232;
    margin-right: 10px;
    margin-bottom: 10px;

    span {
      font-size: 16px;
      color: #686868;
    }
  }
}

.mailContentShow {
  height: 400px;
  overflow-y: auto;
  word-break: break-word;
  background-color: #f8f8f8;
  color: #686868;
  border-radius: 4px;
  padding: 10px 20px;

  ul,
  ol {
    padding-left: 40px;
    list-style-position: outside;
  }
}

.insertCss {
  height: 23px;
  padding: 2px 5px;
  background-color: #eff2f7;
  cursor: default;
  border: 1px solid #ccd5e4;
  font-size: 12px;
  border-radius: 3px;
  margin: 0px 5px;
}
</style>
