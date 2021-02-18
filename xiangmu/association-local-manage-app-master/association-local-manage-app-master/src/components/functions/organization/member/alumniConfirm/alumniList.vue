<template>
  <div class="alumniList">
    <div class="alumniList-search">
      <el-input
        placeholder="请输入校友姓名/网页标题"
        prefix-icon="el-icon-search"
        v-model="confirmForm.searchContent"
      ></el-input>
    </div>
    <div class="alumniList-result">
      <div>
        发现疑似校友&nbsp;&nbsp;
        <span>{{alumniTotal}}</span>&nbsp;&nbsp;位
      </div>
      <div>
        已添加&nbsp;&nbsp;
        <span>{{addCount}}</span>&nbsp;&nbsp;位，剩余&nbsp;&nbsp;
        <span>{{unConfirmCount}}</span>&nbsp;&nbsp;位待确认
      </div>
    </div>
    <div class="alumniList-operationBtn">
      <div class="itemCheckIf" @click="selectAllIf=!selectAllIf">
        <div class="itemSelect" v-if="!selectAllIf"></div>
        <div v-else class="itemCancleSelect">
          <img src="./image/select.png" alt />
        </div>
        <div>全选</div>
      </div>
      <div class="notAlumni" @click="notAlimni(selectAlumnis)">不是校友</div>
    </div>
    <div class="alumniList-memberList">
      <div
        :class="{'alumniItem':true,'active':clickOne.id==item.id}"
        v-for="item in confirmList"
        :key="item.id"
        @click="clickAlumni(item)"
      >
        <div class="itemCheckIf" @click.stop="selectOne(item.id)">
          <div v-if="selectAlumnis.indexOf(item.id)>=0" class="itemCancleSelect">
            <img src="./image/select.png" alt />
          </div>
          <div class="itemSelect" v-else></div>
        </div>
        <div style="flex:1;">
          <div class="alumniItem-header">
            <div class="sourceTime">
              <div style="color:#C6C6C6;">
                检索时间：&nbsp;&nbsp;
                <span>{{item.updateTime | yyyyMMddHHmmss}}</span>
              </div>
            </div>
          </div>
          <div class="alumniItem-middle">
            <img v-if="item.image" :src="JSON.parse(item.image)[0]" class="alumniItem-middle__img" />
            <img v-else src="../alumniMatch/image/header.png" class="alumniItem-middle__img" />
            <div class="alumniItem-middle__text">
              <div style="display:flex;justifyContent:space-between;">
                <div style="fontSize:16px;fontWeight:700;">
                  姓名：&nbsp;
                  <span>{{item.alumniName}}</span>
                </div>
                <div style="color:#FF9D00;">
                  来源：&nbsp;
                  <span>{{item.title?item.title.split('-')[1]:''}}</span>
                </div>
              </div>
              <div style="fontSize:16px;display:flex;alignItems:center;fontWeight:700;">
                网页标题：&nbsp;
                <a target="_blank" :href="item.searchUrl">{{item.title}}</a>
              </div>
              <div style="fontSize:12px;color:#C6C6C6;">
                网页最近一次更新时间：&nbsp;
                <span>{{item.baiduUpdateTime}}</span>
              </div>
            </div>
          </div>
          <div class="alumniItem-footer">
            <div @click="createNewAlumni(item)">新建知名校友</div>
            <div @click="linkToAlumni(item)">关联知名校友</div>
            <div @click="notAlimni([item.id])">不是校友</div>
          </div>
        </div>
        <!-- <div class="alumniItem-arrow"></div> -->
      </div>
    </div>
    <div class="alumniList-page">
      <el-pagination
        :pager-count="5"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="confirmForm.limit"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 新建知名校友弹框 -->
    <create-alumni
      v-if="createNewVisible"
      @close="createNewVisible=false"
      :createNewVisible="createNewVisible"
      :createAlumniInfo="createAlumniInfo"
      @toCreateNew="toCreateNew"
      @fresh-member="freshMember"
      @seeMember="seeMember"
    ></create-alumni>
    <!-- 关联知名校友弹框 -->
    <link-alumni
      @fresh="freshMember"
      :linkToAlumniInfo="linkToAlumniInfo"
      v-if="updataVisible"
      @close="updataVisible=false"
      @fresh-member="freshMember"
      :updataVisible="updataVisible"
      @linkSeeMember="linkSeeMember"
    ></link-alumni>
    <!-- 查看弹框 -->
    <div class="dialogbox" v-show="memberFormVisible">
      <member-form-new
        :user-id="memberFormId"
        :isFamous="isFamous"
        v-if="memberFormVisible"
        @close="closeSeeMember"
        :educationList="educationList"
        :collegeList="collegeList"
        :majorList="majorList"
        @refresh-members="refreshMembers"
      />
    </div>
    <!-- <el-dialog
      title="新建知名校友"
      :visible.sync="memberFormVisible"
      :close-on-click-modal="false"
      append-to-body
      :fullscreen="true"
    >
      <member-form-new
        :user-id="memberFormId"
        v-if="memberFormVisible"
        @close="memberFormVisible = false"
        :educationList="educationList"
        :collegeList="collegeList"
        :majorList="majorList"
        @refresh-members="refreshMembers"
      />
    </el-dialog>-->
  </div>
</template>

<script>
import memberFormNew from "../allMember/memberForm/MemberFormNew";
import createAlumni from "./createAlumni";
import linkAlumni from "./linkAlumni";
export default {
  name: "alumniList",
  components: { createAlumni, linkAlumni, memberFormNew },
  data() {
    return {
      selectAllIf: false,
      currentPage: 1,
      confirmForm: {
        limit: 10,
        offset: 0,
        searchContent: ""
      },
      total: 100,
      alumniTotal: 0,
      addCount: 0,
      unConfirmCount: 0,
      confirmList: [],
      clickOne: {},
      selectAlumnis: [],
      createNewVisible: false,
      createAlumniInfo: {},
      updataVisible: false,
      linkToAlumniInfo: {},
      memberFormId: "",
      memberFormVisible: false,
      closeDIalog: "",
      educationList: [],
      collegeList: [],
      majorList: [],
      createAlumniList:[],
      createAlumniListTotal:0,
      isFamous:false
    };
  },
  watch: {
    "confirmForm.searchContent"(newVal) {
      this.confirmForm.searchContent = newVal;
      this.confirmForm.offset=0;
      this.getConfirmList();
    },
    selectAllIf(val) {
      this.selectAlumnis = [];
      if (val) {
        this.confirmList.forEach(item => {
          this.selectAlumnis.push(item.id);
        });
      }
    }
  },
  created() {
    this.getConfirmList();
    this.getMemberFields();
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
    handleCurrentChange(page) {
      this.confirmForm.offset = (page - 1) * this.confirmForm.limit;
      this.getConfirmList();
    },
    getConfirmList() {
      this.$request
        .get("/api/admin/reptile/getSuspectedAlumni", {
          params: this.confirmForm
        })
        .then(res => {
          this.alumniTotal = res.data.statistics.alumniTotal;
          this.addCount = res.data.statistics.addCount;
          this.unConfirmCount = res.data.statistics.unConfirmCount;
          this.total = res.data.result.total;
          if (res.data.result.list.length > 0) {
            this.confirmList = JSON.parse(JSON.stringify(res.data.result.list));
            this.clickAlumni(this.confirmList[0]);
          } else {
            this.confirmList = [];
          }
        });
    },
    refreshMembers() {
      this.getConfirmList();
      this.memberFormVisible = false;
    },
    clickAlumni(info) {
      this.clickOne = info;
      this.$emit("clickOneAlumni", info);
    },
    selectOne(id) {
      var num = this.selectAlumnis.indexOf(id);
      if (num >= 0) {
        this.selectAlumnis.splice(num, 1);
      } else {
        this.selectAlumnis.push(id);
      }
    },
    notAlimni(arr) {
      if (arr.length == 0) {
        this.$message({
          message: "请先选择要处理的信息项",
          type: "warning"
        });
        return;
      }
      this.$request
        .post("/api/admin/reptile/relationAssociateAlumni", {
          type: 2,
          ids: arr
        })
        .then(res => {
          this.selectAlumnis = [];
          this.selectAllIf = false;
          this.getConfirmList();
        });
    },
    createNewAlumni(info) {
     var  params= {
        limit: 4,
        offset: 0,
        searchContent: "",
        name: info.alumniName
      };
      this.$request
        .get("/api/admin/reptile/getSameMemberByName", {
          params
        })
        .then(res => {
          // console.log(res);
          if (res.data.list.length == 0) {
            // this.$emit("toCreateNew", this.createAlumniInfo);
            this.toCreateNew(info);
            return;
          }else{
            this.createAlumniInfo = JSON.parse(JSON.stringify(info));
            this.createNewVisible = true;
          }
        });
    },
    toCreateNew(info) {
      this.$emit("toCreateNew", info);
    },
    freshMember() {
      this.handleCurrentChange(this.currentPage);
    },
    linkToAlumni(info) {
      this.linkToAlumniInfo = JSON.parse(JSON.stringify(info));
      this.updataVisible = true;
    },
    seeMember(info) {
      this.memberFormId = info.id;
      this.isFamous = info.isFamous;
      this.memberFormVisible = true;
      this.createNewVisible = false;
      this.closeDIalog = "create";
    },
    linkSeeMember(info) {
      this.memberFormId = info.id;
      this.isFamous=info.isFamous;
      this.memberFormVisible = true;
      this.updataVisible = false;
      this.closeDIalog = "link";
    },
    closeSeeMember() {
      this.memberFormVisible = false;
      if (this.closeDIalog == "create") {
        this.createNewVisible = true;
      } else {
        this.updataVisible = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.alumniList {
  display: flex;
  flex-direction: column;
}

.alumniList-search {
  padding: 15px 11px;
  box-sizing: border-box;
}

.alumniList-result {
  padding: 8px 15px;
  box-sizing: border-box;
  font-size: 14px;
  // font-weight: 700;
  color: #626262;
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  span {
    font-size: 14px;
    color: #ff9d00;
  }
}

.alumniList-operationBtn {
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.itemCheckIf {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 20px;
  .itemSelect {
    margin-right: 7px;
    width: 16px;
    height: 16px;
    border: 1px solid #dddddd;
    border-radius: 2px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .itemCancleSelect {
    box-sizing: border-box;
    margin-right: 7px;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    cursor: pointer;
    background-color: #63bcc0;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 9px;
      height: 9px;
    }
  }
}
.notAlumni {
  padding: 7px 20px;
  // background-color: rgb(215, 215, 215);
  color: #3fa1b6;
  border: 1px solid #3fa1b6;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
}

.alumniList-memberList {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
  // padding: 15px;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;
}
.alumniItem {
  background-color: #fff;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  // margin-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  .alumniItem-arrow {
    display: none;
    position: absolute;
    width: 10px;
    height: 10px;
    border-right: 1px solid #3fa1b6;
    border-bottom: 1px solid #3fa1b6;
    transform: rotate(-45deg);
    top: 50%;
    right: -7px;
    background-color: #fff;
    z-index: 10;
  }
  &:hover {
    // border: 1px solid #3fa1b6;
    background-color: #f9f9f9;
    .alumniItem-arrow {
      display: block;
    }
  }
}
.active {
  // border: 1px solid #3fa1b6;
  background-color: #f9f9f9;
  .alumniItem-arrow {
    display: block;
  }
}
.alumniItem-header {
  display: flex;
  align-items: center;
}
.sourceTime {
  // margin-left: 10px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alumniItem-middle {
  margin: 15px 0;
  display: flex;
  align-items: center;
}
.alumniItem-middle__img {
  width: 71px;
  height: 90px;
  margin-right: 10px;
  // border: 1px solid red;
}
.alumniItem-middle__text {
  display: flex;
  height: 90px;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  a {
    text-decoration: underline;
    color: #3fa1b6;
    display: inline-block;
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 400;
  }
}

.alumniItem-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  div {
    padding: 7px 15px;
    border-radius: 4px;
    border: 1px solid #3fa1b6;
    color: #3fa1b6;
    cursor: pointer;
    margin-right: 10px;
    &:first-child {
      background-color: #3fa1b6;
      color: #fff;
      border: 1px solid #3fa1b6;
    }
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      transform: scale(1.02);
    }
  }
}

.alumniList-page {
  width: 100%;
  background-color: #fff;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #f9f9f9;
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