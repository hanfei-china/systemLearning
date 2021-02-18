<template>
  <div class="sendEmail">
    <div class="sendEmailContent">
      <!-- 第一部分 -->
      <div class="sendEmailContent-top">
        <div class="sendEmailContent-top__one">
          <img src="./image/iconPre.png" alt />
          <span>邮件设置</span>
        </div>
        <!-- <div class="sendEmailContent-top__two">
          <span>发信箱</span>
          <el-select v-model="value" clearable placeholder="请选择" style="width:35%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>-->
        <div class="sendEmailContent-top__thr">
          <div class="sendEmailContent-top__thrOne">
            <span>发件人名称</span>
            <i v-if="!editSenderName" @click="editSenderName=true" style="fontSize:16px;">{{senderName}}</i>
            <div v-else>
              <el-input
                v-model="editName"
                placeholder="请输入内容"
                size="mini"
                style="width:100px;marginRight:20px;fontSize:16px;"
              ></el-input>
              <span class="el-icon-success" style="fontSize:18px;" @click="changeName(true)"></span>
              <span class="el-icon-error" @click="changeName(false)"></span>
            </div>
          </div>
          <!-- <div class="sendEmailContent-top__thrOne">
            <span>回复邮件自动转发到邮箱</span>
            <i v-if="!editAcceptUrl" @click="editAcceptUrl=true">元始天尊</i>
            <div v-else>
              <el-input v-model="acceptUrl" placeholder="请输入内容" size="mini" style="width:200px;marginRight:20px;"></el-input>
              <span class="el-icon-success" style="fontSize:18px;"></span>
              <span class="el-icon-error"></span>
            </div>
          </div>-->
        </div>
      </div>
      <!-- 第二部分 -->
      <contact-person v-model="isAllMember" :contactPerson="memberList" @getContactPerson="getContactPerson"></contact-person>
      <!-- 第三部分 -->
      <content-edit :is-all-member="isAllMember" :senderName="senderName" :receivers="contactPerson"></content-edit>
    </div>
  </div>
</template>

<script>
import contactPerson from "./contactPerson";
import contentEdit from "./contentEdit";
export default {
  name: "sendEmail",
  components: { contactPerson, contentEdit },
  data() {
    return {
      value: "",
      options: [],
      memberList: null, //这是从会员列表页面跳转过来时携带的要发送邮件的成员信息
      editSenderName: false,
      senderName: "",
      editName:'',
      editAcceptUrl: false,
      acceptUrl: "",
      contactPerson: [] ,//联系人列表
      isAllMember: false
    };
  },
  created() {
    // console.log(this.$route.params.memberList);
    if (this.$route.params.memberList) {
      this.memberList = JSON.parse(
        JSON.stringify(this.$route.params.memberList)
      );
    } else {
      this.memberList = [];
    }
    this.senderName=this.$store.state.loginUser.name;
    this.editName=this.senderName;
  },
  methods: {
    getContactPerson(info) {
      this.contactPerson = JSON.parse(JSON.stringify(info));
    },
    //修改账号姓名
    changeName(state){
      if (state) {
        this.senderName=this.editName;
        this.editSenderName=false;
      }else{
        this.editSenderName=false;
      }
    }
  }
};
</script>

<style scoped lang="less">
.sendEmail {
  padding: 20px;
  background-color: #fff;
}
.sendEmailContent {
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.05), 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
}
.sendEmailContent-top {
  border-bottom: 1px solid #dfdfdf;
  .sendEmailContent-top__one {
    padding: 20px;
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
  .sendEmailContent-top__two {
    padding: 0 40px 20px 40px;
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
      font-size: 14px;
      color: #686868;
      line-height: 2.5;
    }
  }
  .sendEmailContent-top__thr {
    padding: 0 40px 20px 40px;
    display: flex;
    .sendEmailContent-top__thrOne {
      // flex: 1;
      display: flex;
      margin-right: 100px;
      span {
        margin-right: 10px;
        font-size: 14px;
        line-height: 20px;
        color: #686868;
      }
      i {
        color: #8baed8;
        font-size: 12px;
        font-style: normal;
        border-bottom: 1px dashed #8baed8;
        cursor: pointer;
      }
      div {
        span {
          font-size: 18px;
          color: #8baed8;
          cursor: pointer;
        }
      }
    }
  }
}
</style>