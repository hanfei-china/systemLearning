<template>
  <div class="emailList">
    <!-- 筛选头部 -->
    <div class="emailListHead">
      <div class="emailListHead-top">
        <img src="../sendEmail/image/iconPre.png" alt/>
        <span>发送日志</span>
      </div>
      <div class="emailListHead-bot">
        <el-input
          v-model="emailSearchForm.subject"
          placeholder="邮件主题"
          size="mini"
          style="width:300px;marginRight:20px;"
        ></el-input>
        <el-input
          v-model="emailSearchForm.senderName"
          placeholder="发件人名称"
          size="mini"
          style="width:150px;marginRight:20px;"
        ></el-input>
        <el-date-picker
          v-model="selectData"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          style="marginRight:20px;"
        ></el-date-picker>
        <el-select
          v-model="emailSearchForm.selectType"
          placeholder="请选择过滤条件"
          size="mini"
          style="marginRight:20px;"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div v-if="emailSearchForm.selectType===1">
          <el-input
            v-model="emailSearchForm.startNum"
            placeholder="送达数（小）"
            size="mini"
            style="width:100px;"
          ></el-input>
          <span style="margin:0 10px;">至</span>
          <el-input
            v-model="emailSearchForm.endNum"
            placeholder="送达数（大）"
            size="mini"
            style="width:100px;marginRight:20px;"
          ></el-input>
        </div>
        <div v-if="emailSearchForm.selectType===2">
          <el-input
            v-model="emailSearchForm.startNum"
            placeholder="失败数（小）"
            size="mini"
            style="width:100px;"
          ></el-input>
          <span style="margin:0 10px;">至</span>
          <el-input
            v-model="emailSearchForm.endNum"
            placeholder="失败数（大）"
            size="mini"
            style="width:100px;marginRight:20px;"
          ></el-input>
        </div>
        <el-button icon="el-icon-search" size="mini" @click="getEmailList"></el-button>
        <el-button icon="el-icon-refresh-right" size="mini" @click="updateSearch"></el-button>
      </div>
    </div>
    <!-- 邮箱列表 -->
    <div class="emailListTable">
      <el-table
        :data="emailTableList"
        style="width: 100%"
        :header-cell-style="{'backgroundColor': '#fafafa'}"
      >
        <el-table-column prop="date" label="主题">
          <template slot-scope="scope">
            <span
              style="color: #5086c5;cursor:pointer;"
              @click="lookTheme(scope.row)"
            >{{ scope.row.theme }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发信人" width="250" align="center" prop="senderName"></el-table-column>
        <el-table-column width="50" align="center" prop="senderName">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="定时发送"
              placement="top"
              v-if="scope.row.emailType===2"
            >
              >
              <el-button class="el-icon-time" type="text" style="color:black;"></el-button>
            </el-tooltip>
            <!-- <span class="el-icon-time" v-if="scope.row.emailType===2"></span> -->
          </template>
        </el-table-column>
        <el-table-column prop="address" width="250" align="center">
          <template slot="header">
            <div style="cursor: pointer;" @click="changeOrder">
              <span style="marginRight:5px;">时间</span>
              <span
                v-if="emailSearchForm.orderType===1"
                class="el-icon-sort-up"
                style="fontSize:16px;color:#428bca;"
              ></span>
              <span
                v-if="emailSearchForm.orderType===2"
                class="el-icon-sort-down"
                style="fontSize:16px;color:#428bca;"
              ></span>
            </div>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.sendTime | yyyyMMddHHmm }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="正在发送" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loadNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="送达" width="150" align="center">
          <template slot-scope="scope">
            <span @click="setSendMemParm(scope.row.id,true,scope.row.successNum,'成功列表')" class="canClick">{{ scope.row.successNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="失败" width="150" align="center">
          <template slot-scope="scope">
            <span @click="setSendMemParm(scope.row.id,false,scope.row.errorNum,'失败列表')" class="canClick">{{ scope.row.errorNum }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="emailPagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currenPage"
        :page-sizes="[10, 20, 50, 200]"
        :page-size="emailSearchForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 邮件详情 -->
    <el-dialog :visible.sync="dialogTableVisible" width="40%" append-to-body>
      <div slot="title" style="color:#394263;fontSize:24px;">{{ emailInfo.record.theme }}</div>
      <div class="mailContent">
        <p style="marginBottom:5px;">
          发送自:
          <span>{{ emailInfo.record.senderName }}</span>
        </p>
        <!--        <p>-->
        <!--          发送成功:-->
        <!--          <span v-for="item in emailInfo.list" :key="item.id">-->
        <!--            <span v-if="item.sendStatus">{{item.memberName}}({{item.memberEmail}})</span>-->
        <!--          </span>-->
        <!--        </p>-->
        <!--        <p v-if="sendFailList.length>0">-->
        <!--          发送失败:-->
        <!--          <span v-for="item in sendFailList" :key="item.id">-->
        <!--            <span v-if="!item.sendStatus">{{item.memberName}}({{item.memberEmail}})</span>-->
        <!--          </span>-->
        <!--        </p>-->
      </div>
      <div class="mailContentShow" v-html="emailInfo.record.emailContent"></div>
    </el-dialog>
    <!--    发送人员列表-->
    <el-dialog :visible.sync="sendMemDialog" width="40%" :title="sendMemDialogTitle" append-to-body>
      <send-member-form :sendMemParm="sendMemParm" v-if="sendMemDialog"/>
    </el-dialog>
  </div>
</template>

<script>
import SendMemberForm from "./sendMemForm";
export default {
  name: "emailList",
  data() {
    return {
      emailSearchForm: {
        endNum: null,
        startNum: null,
        startTime: null,
        endTime: null,
        limit: 20,
        offset: 0,
        orderType: 2,
        selectType: null,
        senderName: "",
        subject: ""
      },
      selectData: [],
      options: [
        {
          value: 1,
          label: "邮件送达数"
        },
        {
          value: 2,
          label: "邮件失败数"
        }
      ],
      emailTableList: [],
      total: 0,
      currenPage: 1,
      dialogTableVisible: false,
      emailInfo: {   //邮件详情展示信息
        record: {},
        list: []
      },
      sendFailList: [] ,
      sendMemDialog: false,
      sendMemDialogTitle: '',
      sendMemParm: {
        id: '',
        sendStatus: -1
      },//发送失败的列表
    };
  },
  components: {
    SendMemberForm
  },
  created() {
    this.getEmailList();
  },
  methods: {
    setSendMemParm(id, sendStatus, num, title) {
      if (num && num > 0) {
        this.sendMemParm.id = id;
        this.sendMemParm.sendStatus  = sendStatus
        this.sendMemDialogTitle = title
        this.sendMemDialog = true
      }
      return
    },
    getEmailList() {
      // 送达数和失败数的处理
      this.emailSearchForm.startNum = this.emailSearchForm.startNum
        ? this.emailSearchForm.startNum - 0
        : null;
      this.emailSearchForm.endNum = this.emailSearchForm.endNum
        ? this.emailSearchForm.endNum - 0
        : null;
      //时间范围的处理
      this.emailSearchForm.startTime = this.selectData[0];
      this.emailSearchForm.endTime = this.selectData[1];
      this.$request
        .post(
          "/api/admin/emailTelPhone/getSendEmailRecord",
          this.emailSearchForm
        )
        .then(res => {
          console.log(res);
          this.emailTableList = JSON.parse(JSON.stringify(res.data.list));
          this.total = res.data.total;
        });
    },
    handleSizeChange(limitNum) {
      // console.log(limitNum);
      this.emailSearchForm.limit = limitNum;
      this.getEmailList();
    },
    handleCurrentChange(pageNow) {
      // console.log(pageNow);
      this.emailSearchForm.offset = this.emailSearchForm.limit * (pageNow - 1);
      this.getEmailList();
    },
    //刷新
    updateSearch() {
      this.emailSearchForm = {
        endNum: null,
        startNum: null,
        startTime: null,
        endTime: null,
        limit: 20,
        offset: 0,
        orderType: 1,
        selectType: null,
        senderName: "",
        subject: ""
      };
      this.selectData = [];
      this.getEmailList();
    },
    //切换倒序或正序
    changeOrder() {
      this.emailSearchForm.orderType =
        this.emailSearchForm.orderType === 1 ? 2 : 1;
      this.getEmailList();
    },
    //查看邮件详情
    lookTheme(info) {
      //   console.log(info);
      this.sendFailList = [];
      this.$request
        .get("/api/admin/emailTelPhone/getSendEmailRecordDetail?id=" + info.id)
        .then(res => {
          this.emailInfo = JSON.parse(JSON.stringify(res.data));
          res.data.list.forEach(item => {
            if (!item.sendStatus) {
              this.sendFailList.push(item);
            }
          });
          this.dialogTableVisible = true;
        });
    }
  }
};
</script>

<style scoped lang="less">
.emailList {
  margin: 20px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.05), 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;

  .emailListHead {
    padding: 20px;

    .emailListHead-top {
      padding: 20px;
      padding-left: 0;
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

    .emailListHead-bot {
      display: flex;
    }
  }

  .emailListTable {
    padding: 20px;
    height: 600px;
    overflow-y: auto;
  }

  .emailPagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
  }
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

/deep/ .el-table__row {
  height: 50px;
}
</style>