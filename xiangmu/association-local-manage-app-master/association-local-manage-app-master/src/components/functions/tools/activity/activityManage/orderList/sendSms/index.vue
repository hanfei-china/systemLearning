<template>
  <div class="sendSms">
    <div class="sendSms-header">
      <div style="fontSize:16px;fontWeight:700;">发送短信</div>
      <el-button type="danger" icon="el-icon-circle-close" size="small" @click="$emit('close')">关闭</el-button>
    </div>
    <contact-person :activityId="activityId" :sendSmsList="sendSmsList" @getValidList="getValidList"></contact-person>
    <div class="smsInfo">
      <div class="smsInfo__top">
        <img src="./image/iconPre.png" alt />
        <span>短信内容</span>
      </div>
      <div class="smsInfo-container">
        <div class="smsInfo-container__show">
          <textarea rows="3" disabled="disabled" v-model="smsSend.templateContent"></textarea>
        </div>
        <div style="paddingLeft:20px;display:flex;justifyContent:flex-start;alignItems:center;">
          <span style="marginRight:15px;">短信模板</span>
          <el-select
            class="select"
            v-model="smsSend.templateCode"
            style="width:500px;"
            placeholder="请选择短信模板"
          >
            <el-option
              v-for="item in smsList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </div>
        <div style="display:flex;justifyContent:flex-end;marginTop:10px;">
          <el-button
            v-if="smsSend.sendType===1"
            @click="smsSend.sendType=2"
            size="small"
            icon="el-icon-circle-plus-outline"
            style="fontSize:14px;marginRight:15px;color:black;"
            type="text"
          >定时发送</el-button>
          <el-button
            v-if="smsSend.sendType===2"
            @click="smsSend.sendType=1"
            size="small"
            icon="el-icon-success"
            style="fontSize:14px;marginRight:15px;color:black;"
            type="text"
          >定时发送</el-button>
          <el-date-picker
            v-if="smsSend.sendType===2"
            v-model="smsSend.sendTime"
            type="datetime"
            placeholder="选择日期时间"
            style="marginRight:15px;"
          ></el-date-picker>
          <!-- <el-tooltip class="item" effect="dark" :content="information" placement="top-end" @mouseover.native="ifCanSend">
          <el-button
            @click="sendMail"
            size="small"
            style="color:#fff;backgroundColor: #428bca;fontSize:14px;"
          >发送</el-button>
          </el-tooltip>-->
          <el-button
            @click="sendSms"
            :disabled="isSending"
            size="small"
            style="color:#fff;backgroundColor: #428bca;fontSize:14px;"
          >发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import contactPerson from "./contactPerson";
export default {
  name: "sendSms",
  components: { contactPerson },
  props:['sendSmsList','activityId'],
  data() {
    return {
      smsSend: {
        sendTime: "",
        sendType: 1,
        list: [],
        templateCode: "",
        templateContent: "",
        templateName:''
      },
      smsList: [],
      isSending: false,
      mobanIndex: Number
    };
  },
  watch: {
    "smsSend.sendType"(val) {
      if (val === 1) {
        this.smsSend.sendTime = "";
      }
    },
    "smsSend.templateCode"(val) {
      this.smsList.forEach(item => {
        if (item.code===val) {
          this.smsSend.templateName = item.name;
          this.smsSend.templateContent=item.content
        }
      });
    }
  },
  created() {
    this.getSmsList();
  },
  methods: {
    getSmsList() {
      this.$request
        .get("/api/admin/emailTelPhone/getMessageTemplate")
        .then(res => {
          this.smsList = res.data.templates;
        });
    },
    sendSms() {
      if (this.smsSend.list.length === 0) {
        this.$message({
          message: "请选择要发送短信的成员",
          type: "warning"
        });
        return;
      }
      if (!this.smsSend.templateCode) {
        this.$message({
          message: "请选择短信模板",
          type: "warning"
        });
        return;
      }
      this.isSending = true;
      // this.smsSend.list=JSON.stringify(this.smsSend.list);
      this.$request
        .post("/api/admin/emailTelPhone/sendActivityTelPhone", this.smsSend)
        .then(res => {
          //   console.log(res);
          if (res.success) {
            this.isSending = false;
            this.$message({
              message: "发送成功",
              type: "success"
            });
            this.$emit('close');
          }
        });
    },
    getValidList(list) {
      this.smsSend.list = [];
      list.forEach(item => {
        this.smsSend.list.push({
          relationId:item.id,
          telphone:item.telphone,
          name:item.name
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.sendSms {
  // margin: 20px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.05), 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  font-size: 14px;
  color: #394263;
}
.sendSms-header{
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  align-items: center;
  border-bottom: 1px dashed #f0f0f0;
}
.smsInfo {
  padding: 20px;
}
.smsInfo__top {
  margin-top: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
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
.smsInfo-container {
  margin-bottom: 10px;
}
.smsInfo-container__show{
    padding-left: 20px;
    margin-bottom: 15px;
}
.smsInfo-container__show textarea {
  width: 100%;
  font-size: 14px;
  color: #323232;
  border: 0;
  padding: 0;
  margin: 0;
  resize: none;
  overflow-y: hidden;
  line-height: 40px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAlCAIAAADwXz80AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0OTFCQzU3M0Y2NjcxMUU2QjMwRUM1N0Q1Mzc5RkI1MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0OTFCQzU3NEY2NjcxMUU2QjMwRUM1N0Q1Mzc5RkI1MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5MUJDNTcxRjY2NzExRTZCMzBFQzU3RDUzNzlGQjUzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ5MUJDNTcyRjY2NzExRTZCMzBFQzU3RDUzNzlGQjUzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6OrYmwAAADBJREFUeNpi/P//PwM2wMSAA4xKjEqMSlBTggWIH7z6dv/lVwhfUZxbQYwLyAAIMAC5OQlJSymMqwAAAABJRU5ErkJggg==);
  height: 120px;
  overflow-y: auto;
}
</style>