<template>
  <div class="smsList">
    <!-- 筛选头部 -->
    <div class="smsListHead">
      <div class="smsListHead-top">
        <img src="../sendEmail/image/iconPre.png" alt/>
        <span>发送日志</span>
      </div>
      <div class="smsListHead-bot">
        <el-input
          v-model="smsSearchForm.templateContent"
          placeholder="短信模板"
          size="mini"
          style="width:300px;marginRight:20px;"
        ></el-input>
        <el-input
          v-model="smsSearchForm.senderName"
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
          v-model="smsSearchForm.selectType"
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
        <div v-if="smsSearchForm.selectType===1">
          <el-input
            v-model="smsSearchForm.startNum"
            placeholder="送达数（小）"
            size="mini"
            style="width:100px;"
          ></el-input>
          <span style="margin:0 10px;">至</span>
          <el-input
            v-model="smsSearchForm.endNum"
            placeholder="送达数（大）"
            size="mini"
            style="width:100px;marginRight:20px;"
          ></el-input>
        </div>
        <div v-if="smsSearchForm.selectType===2">
          <el-input
            v-model="smsSearchForm.startNum"
            placeholder="失败数（小）"
            size="mini"
            style="width:100px;"
          ></el-input>
          <span style="margin:0 10px;">至</span>
          <el-input
            v-model="smsSearchForm.endNum"
            placeholder="失败数（大）"
            size="mini"
            style="width:100px;marginRight:20px;"
          ></el-input>
        </div>
        <el-button icon="el-icon-search" size="mini" @click="getsmsList"></el-button>
        <el-button icon="el-icon-refresh-right" size="mini" @click="updateSearch"></el-button>
      </div>
    </div>
    <!-- 短信列表 -->
    <div class="smsListTable">
      <el-table
        :data="smsTableList"
        style="width: 100%"
        :header-cell-style="{'backgroundColor': '#fafafa'}"
      >
        <el-table-column prop="date" label="短信模板" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              style="color: #5086c5;cursor:pointer;"
              @click="lookTheme(scope.row)"
            >{{ scope.row.templateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发信人" width="250" align="center" prop="name"></el-table-column>
        <el-table-column width="50" align="center" prop="senderName">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="定时发送"
              placement="top"
              v-if="scope.row.sendType==2"
            >
              >
              <el-button class="el-icon-time" type="text" style="color:black;"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="250" align="center">
          <template slot="header">
            <div style="cursor: pointer;" @click="changeOrder">
              <span style="marginRight:5px;">时间</span>
              <span
                v-if="smsSearchForm.orderType===1"
                class="el-icon-sort-up"
                style="fontSize:16px;color:#428bca;"
              ></span>
              <span
                v-if="smsSearchForm.orderType===2"
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
        <el-table-column prop="address" label="送达" width="150"
                         align="center">
          <div slot-scope="scope">
            <span v-if="scope.row.successNum===null" style="color:green;">-</span>
            <span @click="setSendMemParm(scope.row.id,3,scope.row.successNum,'成功列表')"
                  class="canClick">{{ scope.row.successNum }}</span>
          </div>
        </el-table-column>
        <el-table-column prop="address" label="失败" width="150" align="center">
          <div slot-scope="scope">
            <span v-if="scope.row.errorNum===null" style="color:red;">-</span>
            <span @click="setSendMemParm(scope.row.id,2,scope.row.errorNum,'失败列表')"
                  class="canClick">{{ scope.row.errorNum }}</span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="smsPagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currenPage"
        :page-sizes="[10, 20, 50, 200]"
        :page-size="smsSearchForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 邮件详情 -->
    <el-dialog :visible.sync="dialogTableVisible" width="40%" append-to-body>
      <div slot="title" style="color:#394263;fontSize:24px;">{{ lookInfo.templateName }}</div>
      <div class="mailContent">
        <p style="marginBottom:5px;">
          发送自:
          <span>{{ lookInfo.name }}</span>
        </p>
        <!--        <p v-if="sendSuccess.length>0">-->
        <!--          发送成功:-->
        <!--          <span v-for="item in sendSuccess" :key="item.id">-->
        <!--            <span>{{ item.memberName }}({{ item.telPhone }})&nbsp;&nbsp;</span>-->
        <!--          </span>-->
        <!--        </p>-->
        <!--        <p v-if="sendFail.length>0">-->
        <!--          发送失败:-->
        <!--          <span v-for="item in sendFail" :key="item.id">-->
        <!--            <span>{{ item.memberName }}({{ item.telPhone }})&nbsp;&nbsp;</span>-->
        <!--          </span>-->
        <!--        </p>-->
      </div>
      <div class="mailContentShow" v-html="lookInfo.templateContent"></div>
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
  name: "smsList",
  components: {
    SendMemberForm
  },
  data() {
    return {
      sendMemDialog: false,
      sendMemDialogTitle: '',
      sendMemParm: {
        id: '',
        sendType: -1
      },
      smsSearchForm: {
        endNum: null,
        startNum: null,
        startTime: null,
        endTime: null,
        limit: 20,
        offset: 0,
        orderType: 2,
        selectType: null,
        senderName: "",
        templateContent: ""
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
      smsTableList: [],
      total: 0,
      currenPage: 1,
      dialogTableVisible: false,
      smsInfo: {
        record: {},
        list: []
      },
      sendFail: [],
      sendSuccess: [],
      lookInfo: {}
    };
  },
  created() {
    this.getsmsList();
  },
  methods: {
    setSendMemParm(id, sendType, num, title) {
      if (num && num > 0) {
        this.sendMemParm.id = id;
        this.sendMemParm.sendType = sendType
        this.sendMemDialogTitle = title
        this.sendMemDialog = true
      }
      return
    },
    getsmsList() {
      // 送达数和失败数的处理
      this.smsSearchForm.startNum = this.smsSearchForm.startNum
        ? this.smsSearchForm.startNum - 0
        : null;
      this.smsSearchForm.endNum = this.smsSearchForm.endNum
        ? this.smsSearchForm.endNum - 0
        : null;
      //时间范围的处理
      this.smsSearchForm.startTime = this.selectData[0];
      this.smsSearchForm.endTime = this.selectData[1];
      this.$request
        .post(
          "/api/admin/emailTelPhone/getSendTelPhoneRecord",
          this.smsSearchForm
        )
        .then(res => {
          this.smsTableList = JSON.parse(JSON.stringify(res.data.list));
          this.total = res.data.total;
        });
    },
    handleSizeChange(limitNum) {
      // console.log(limitNum);
      this.smsSearchForm.limit = limitNum;
      this.getsmsList();
    },
    handleCurrentChange(pageNow) {
      // console.log(pageNow);
      this.smsSearchForm.offset = this.smsSearchForm.limit * (pageNow - 1);
      this.getsmsList();
    },
    //刷新
    updateSearch() {
      this.smsSearchForm = {
        endNum: null,
        startNum: null,
        startTime: null,
        endTime: null,
        limit: 20,
        offset: 0,
        orderType: 1,
        selectType: null,
        senderName: "",
        templateContent: ""
      };
      this.selectData = [];
      this.getsmsList();
    },
    //切换倒序或正序
    changeOrder() {
      this.smsSearchForm.orderType = this.smsSearchForm.orderType === 1 ? 2 : 1;
      this.getsmsList();
    },
    //查看邮件详情
    lookTheme(info) {
      this.sendSuccess = [];
      this.sendFail = [];
      this.lookInfo = JSON.parse(JSON.stringify(info));
      if (Array.isArray(info.receiverRecordList)) {
        info.receiverRecordList.forEach(item => {
          if (item.isSuccess == 3) {
            this.sendSuccess.push(item);
          } else if (item.isSuccess == 2) {
            this.sendFail.push(item);
          }
        });
      }
      this.dialogTableVisible = true;
    }
  }
};
</script>

<style scoped lang="less">
.smsList {
  margin: 20px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.05), 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;

  .smsListHead {
    padding: 20px;
    height: 130px;

    .smsListHead-top {
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

    .smsListHead-bot {
      display: flex;
    }
  }

  .smsListTable {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
  }

  .smsPagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    height: 72px;
    box-sizing: border-box;
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
  height: 200px;
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