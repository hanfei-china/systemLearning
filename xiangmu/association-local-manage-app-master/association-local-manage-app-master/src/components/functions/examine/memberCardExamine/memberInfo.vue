<template>
  <div class="memberInfoContainer">
    <div class="memberInfoShow" v-if="showItemInfo">
      <!-- 上面的信息展示栏 -->
      <div class="headbox" style="padding:10px 0 ; margin: 20px 0">
        <img v-if="showItemInfo&&showItemInfo.headImg" :src="showItemInfo.headImg" alt="">
        <img v-else src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="">
        <div class="userinfo">
          <div class="flex" style="align-items: center">
            <span>{{ showItemInfo.nickName }} （{{ showItemInfo.name }}）</span>
            <span style="color:green;cursor: pointer;padding-left: 10px" type="text" @click="memberFormVisible=true">点击查看校友详情</span>
          </div>
          <p>申请时间: {{ showItemInfo.createTime|yyyyMMdd }}</p>
        </div>
      </div>
      <div class="memberInfoMiddle">
        <div class="middlePart">
          <div class="middleTop">
            <div>校友卡信息</div>
          </div>
          <div class="middleItemShow">
            <el-image class="imgShow" :src="showItemInfo.photo" title="点击查看大图"
                      :preview-src-list="[showItemInfo.photo]"></el-image>
            <div class="middleCont">
              <p v-for="item in basicList" :key="item.key">
                <span>{{ item.title }}：</span>{{ showItemInfo[item.key] }}
              </p>
              <p>
                <span>在校经历：</span>{{ showItemInfo.type == '0' ? showItemInfo.identity : "教职工" }}
              </p>
              <template v-if="showItemInfo.type == '0'">
                <p v-for="item in studentExperienceField" :key="item.key">
                  <span>{{ item.title }}：</span>{{ showItemInfo[item.key] }}
                </p>
              </template>
              <template v-else>
                <p v-for="item in teacherExperienceField" :key="item.key">
                  <span>{{ item.title }}：</span>{{ showItemInfo[item.key] }}
                </p>
              </template>
            </div>
          </div>
        </div>
        <div class="middlePart w410">
          <div class="middleTop">
            <div>电子校友卡预览</div>
          </div>
          <div class="card-view"
               :style="'background-image:url('+cardSettings.background+')'">
            <el-row>
              <div class="card-logo block">
                <el-image :src="cardSettings.logo">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="card-tab">校友卡</div>
            </el-row>
            <el-row>
              <div class="card-view-fields" style="max-width: 200px">
                <el-row class="card-name">
                  <span style="white-space: nowrap">{{ showItemInfo.name }}</span>
                  <p>{{ showItemInfo.type == '0' ? showItemInfo.identity : "教职工" }}</p>
                </el-row>
                <el-row class="card-info" style="align-items: flex-start">
                  <span style="white-space: nowrap">{{ showItemInfo.type == '0' ? "学院" : "单位" }}</span>
                  <p>{{ showItemInfo.type == '0' ? showItemInfo.college : showItemInfo.department }}</p>
                </el-row>
                <el-row class="card-info" style="align-items: flex-start">
                  <span style="white-space: nowrap">{{ showItemInfo.type == '0' ? "专业" : "职务" }}</span>
                  <p>{{ showItemInfo.type == '0' ? showItemInfo.major : showItemInfo.job }}</p>
                </el-row>
                <el-row class="card-no" v-if="showItemInfo.cardNo">
                  <span style="white-space: nowrap">No.{{ showItemInfo.cardNo }}</span>
                </el-row>
              </div>
              <img :src="showItemInfo.photo" class="card-img"/>
            </el-row>
          </div>
        </div>
      </div>
      <div class="memberInfoMiddle" style="margin-top:40px;" v-if="cardSettings.enablePhysicsCard">
        <div class="middlePart">
          <div class="middleTop">
            <div>实体卡申领信息</div>
          </div>
          <div class="middleItemShow">
            <div class="middleCont">
              <p>
                <span>领取方式：</span>{{ showItemInfo.receiveWay ? receiveWayArray[showItemInfo.receiveWay].title : '暂无' }}
              </p>
              <p v-if="showItemInfo.receiveWay=='0'||showItemInfo.receiveWay=='2'">
                <span>领取地址：</span>{{ showItemInfo.pickupAddress || cardSettings.pickupAddress }}
              </p>
              <template v-else-if="showItemInfo.receiveWay=='1'">
                <p><span>收件人姓名：</span>{{ showItemInfo.receiverName }}</p>
                <p><span>收件人手机号：</span>{{ showItemInfo.receiverPhone }}</p>
                <p><span>收件地址：</span>{{ showItemInfo.receiverAddress|addressFilter }}</p>
              </template>
              <p v-if="showItemInfo.receiveWay=='2'">
                <span>代领人：</span>{{ showItemInfo.substituteName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>暂无数据</div>
    <!-- 查看弹框 -->
    <div class="dialogbox" v-show="memberFormVisible">
      <member-form-new
          :member-id="showItemInfo.memberId"
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
import memberFormNew from "../../organization/member/allMember/memberForm/MemberFormNew";

export default {
  name: "memberInfo",
  props: ["showItemInfo"],
  components: {memberFormNew},
  data() {
    return {
      basicList: [
        {key: "name", title: "姓名"},
        {key: "englishName", title: "英文名"},
        {key: "sex", title: "性别"},
        // {key:"mobile",title:"手机号"}
      ],
      teacherExperienceField: [
        {key: "department", title: "部门", topicType: 0},
        {key: "job", title: "职务", topicType: 0},
        // {key:"jobNo",title:"工号",topicType:0}
      ],
      studentExperienceField: [
        {key: "entranceDate", title: "入学年", topicType: 5,},
        {key: "graduationDate", title: "毕业年", topicType: 5},
        {key: "college", title: "学院", topicType: 2},
        {key: "major", title: "专业", topicType: 2},
        // {key:"cless",title:"班级",topicType:0},
        // {key:"studentNo",title:"学号",topicType:0},
      ],
      receiveWayArray: [{key: "0", title: "自取"}, {key: "1", title: "邮寄"}, {key: "2", title: "他人代领"}],
      cardSettings: {},
      memberFormVisible: false,
      educationList: [],
      collegeList: [],
      majorList: []
    };
  },
  watch: {
    showItemInfo(val) {
      //这一步的目的是为了更新左边的数据，以便右边的“上一个、下一个”等功能不失效
      this.$emit("changeItem", 0);
    }
  },
  created() {
    this.$request.get("/api/admin/settings/manage/getCommonSetting?type=20").then(r => {
      let res = r.data
      if (!res.background) {
        res.background = require('./img/card-bg.png')
      }
      this.cardSettings = res
    });
    this.getMemberFields()
  },
  methods: {
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
    },
    //改变当前选择项
    changeItem(data) {
      this.$emit("changeItem", data);
    },
  },
};
</script>

<style lang="less" scoped>
.memberInfoContainer {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;

  .memberInfoShow {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    overflow-y: auto;

    .memberInfoMiddle {
      display: flex;
      justify-content: space-between;

      .middlePart:first-child {
        margin-right: 20px;
        flex: 1;
        min-width: 380px;
        flex-shrink: 0;
      }

      .w410 {
        width: 410px;
        flex-shrink: 0;
      }

      .middleTop {
        padding-bottom: 15px;
        display: flex;
        font-size: 14px;
        color: rgb(102, 102, 102);
        align-items: flex-end;

        div {
          font-size: 16px;
          font-weight: 700;
          color: #222222;
          line-height: 16px;

          &:first-child {
            padding: 0 10px;
            border-left: 3px solid #28394b;
          }

          margin-right: 35px;
        }
      }

      .middleItemShow {
        .imgShow {
          width: 90px;
        }

        .middleCont {
          display: flex;
          flex-wrap: wrap;
          margin-top: 10px;

          p {
            width: 50%;
            display: flex;
            line-height: 24px;
            margin: 5px 0;

            span {
              white-space: nowrap;
              flex-shrink: 0;
              color: rgba(124, 124, 124, 0.85);
            }
          }
        }
      }
    }
  }
}

.headbox {
  padding: 10px 0 30px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #e6e6e6;

  img {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    object-fit: cover;
  }

  .userinfo {
    margin-left: 20px;

    div {
      font-size: 14px;
      color: #222222;
    }

    p {
      font-size: 14px;
      line-height: 40px;
      color: #888888;
      word-spacing: 10px;
    }
  }
}


.card-view {
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  width: 410px;
  padding-bottom: 23px;

  .card-logo {
    float: left;
    margin-left: 25px;
    margin-top: 28px;
  }

  .card-tab {
    background-image: url('../image/card-tab.png');
    width: 90px;
    height: 36px;
    color: #fff;
    right: 0;
    float: right;
    text-align: center;
    line-height: 40px;
    margin-top: 23px;
  }

  .card-view-fields {
    float: left;
    margin-left: 35px;
    font-size: 14px;

    .el-row {
      display: flex;
      align-items: center;
    }

    .card-name {
      margin-top: 20px;

      span {
        font-size: 20px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
      }

      p {
        margin-left: 10px;
        font-size: 14px;
        color: #5B5B5B;
        line-height: 20px;
      }
    }

    .card-info {
      margin-top: 10px;

      span {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 20px;
      }

      p {
        margin-left: 10px;
        font-size: 14px;
        color: #5B5B5B;
        line-height: 20px;
      }
    }

    .card-no {
      margin-top: 19px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
  }

  .card-img {
    width: 104px;
    height: 140px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
    border: 3px solid #FFFFFF;
    float: right;
    margin-top: 20px;
    margin-right: 30px;
    object-fit: cover;
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
