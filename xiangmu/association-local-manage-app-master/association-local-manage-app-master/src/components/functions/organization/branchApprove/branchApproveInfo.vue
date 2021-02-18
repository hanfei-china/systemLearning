<template>
  <div class="joinApplicationInfo">
    <div class="joinApplicationInfo-header">
      <div>校友入会申请单</div>
    </div>
    <div v-if="Object.keys(selectInfo).length>0" class="joinApplicationInfo-show">
      <div class="joinApplicationInfo-show__header">
        <img :src="selectInfo.headImg" @click="memberFormVisible=true"/>
        <div>
          <span style="marginBottom:10px;">{{ selectInfo.nickName }}（{{ selectInfo.name }}）</span>
          <span style="color:#888888">申请时间：{{ selectInfo.createTime | yyyyMMdd }}</span>
        </div>
        <div style="alignSelf: flex-start;paddingTop:10px;justifyContent: flex-end;">
          <span style="color:green;cursor:pointer;" @click="memberFormVisible=true">点击查看详情</span>
        </div>
      </div>
      <div class="joinApplicationInfo-show__body">
        <ul>
          <li>
            <div class="leftName">姓名：</div>
            <div class="rightInfo">{{ selectInfo.name }}</div>
          </li>
          <li>
            <div class="leftName">身份证号：</div>
            <div class="rightInfo">{{ selectInfo.idNumber }}</div>
          </li>
          <li>
            <div class="leftName">性别：</div>
            <div class="rightInfo">{{ selectInfo.sex }}</div>
          </li>
          <li>
            <div class="leftName">电话：</div>
            <div class="rightInfo">{{ selectInfo.telphone }}</div>
          </li>
          <li>
            <div class="leftName">出生日期：</div>
            <div class="rightInfo">{{ selectInfo.birthday }}</div>
          </li>
          <li>
            <div class="leftName">所在城市：</div>
            <!--            <div-->
            <!--              v-if="selectInfo.currentCity&&!(JSON.parse(selectInfo.currentCity).city)"-->
            <!--              class="rightInfo"-->
            <!--            >{{JSON.parse(selectInfo.currentCity).province}}</div>-->
            <!--            <div-->
            <!--              v-if="selectInfo.currentCity&&JSON.parse(selectInfo.currentCity).city"-->
            <!--              class="rightInfo"-->
            <!--            >{{JSON.parse(selectInfo.currentCity).province}}-{{JSON.parse(selectInfo.currentCity).city}}-->
            <!--            </div>-->
            <div>{{ transArea(selectInfo.currentCity) }}</div>
          </li>
          <li>
            <div class="leftName">所在公司：</div>
            <div class="rightInfo">{{ selectInfo.workingCompany }}</div>
          </li>
          <li>
            <div class="leftName">所在行业：</div>
            <div class="rightInfo">{{ selectInfo.industry }}</div>
          </li>
          <li>
            <div class="leftName">职务：</div>
            <div class="rightInfo">{{ selectInfo.post }}</div>
          </li>
          <li>
            <div class="leftName">申请说明：</div>
            <div class="rightInfo">{{ selectInfo.applyDescription }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else style="paddingLeft:20px;">暂无信息</div>
    <!-- 查看弹框 -->
    <div class="dialogbox" v-show="memberFormVisible">
      <member-form-new
          :user-id="selectInfo.id"
          v-if="memberFormVisible"
          @close="memberFormVisible = false"
          :educationList="educationList"
          :collegeList="collegeList"
          :majorList="majorList"
          @refresh-members="refreshMembers"
      />
    </div>
  </div>
</template>

<script>
import memberFormNew from "../member/allMember/memberForm/MemberFormNew";
import {objectArraySplit} from '@/js/util/utilFunction'

export default {
  name: "joinApplicationInfo",
  props: ["selectInfo"],
  components: {
    memberFormNew
  },
  data() {
    return {
      memberFormVisible: false,
      educationList: [],
      collegeList: [],
      majorList: []
    };
  },
  created() {
    this.getMemberFields();
  },
  methods: {
    transArea(val) {
      return objectArraySplit(val)
    },
    getMemberFields(callback) {
      Promise.all([
        this.$request.get("/api/common/associator/historyCollege/educations"),
        this.$request.get("/api/common/associator/historyCollege/colleges"),
        this.$request.get("/api/common/associator/historyCollege/majors")
      ]).then(([educationList, collegeList, majorList]) => {
        this.educationList = educationList.data;
        this.collegeList = collegeList.data;
        this.majorList = majorList.data;
        callback && callback();
      });
    },
    refreshMembers() {
      this.$emit('refreshMembers');
    }
  }
};
</script>

<style lang="less" scoped>
.joinApplicationInfo {
  font-size: 14px;
  color: #222222;
  height: 100%;
  overflow-y: auto;

  .joinApplicationInfo-header {
    margin-left: 20px;
    display: flex;
    align-items: center;
    height: 63px;

    div {
      padding-left: 10px;
      color: #222222;
      font-weight: 700;
      line-height: 14px;
      border-left: 3px solid #222222;
    }
  }

  .joinApplicationInfo-show {
    .joinApplicationInfo-show__header {
      margin: 48px 0 45px 63px;
      display: flex;
      align-items: center;

      img {
        width: 67px;
        height: 67px;
        border-radius: 50%;
        margin-right: 26px;
        cursor: pointer;
      }

      div {
        display: flex;
        flex-direction: column;
      }
    }

    .joinApplicationInfo-show__body {
      ul {
        li {
          display: flex;
          margin-bottom: 23px;

          .leftName {
            width: 130px;
            text-align: right;
          }

          .rightInfo {
            text-align: left;
            padding-left: 10px;
            width: 400px;
          }
        }
      }
    }
  }
}

.dialogbox {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000000;
}
</style>