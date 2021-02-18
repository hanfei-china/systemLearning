<template>
  <div class="memberListContainer">
    <!-- 顶部搜索模块 -->
    <div class="memberListSearch">
      <div class="memberListSearchTerm">
        <el-input class="memberList-SearchInput" placeholder="搜索姓名/手机号/学院" prefix-icon="el-icon-search" v-model="searchForm.nameOrPhone" size="small"></el-input>
        <!-- <el-select
          class="memberList-SearchSelect"
          v-model="searchForm.collage"
          clearable
          size="small"
          placeholder="选择所在学院"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.key"
            :label="item.title"
            :value="item.key"
          ></el-option>
        </el-select>-->
      </div>
      <!-- 查询条件展示 -->
      <!-- <div class="memberListSearchShow" v-if="searchInput.length>0||collegeSearch.length>0">
        <div style="color:rgb(102, 102, 102);">查询条件：</div>
        <div
          class="searchItem"
          v-if="searchInput.length>0"
        >{{searchType==='1'?'姓名： ':'手机号： '}} {{searchInput}}</div>
        <div class="searchItem" v-if="collegeSearch.length>0">所在学院： {{collegeSearch}}</div>
      </div>-->
    </div>
    <!-- 顶部操作模块 -->
    <div class="memberListTop">
      <div class="itemCheckIf" style="paddingLeft:20px;cursor:pointer;marginRight:20px;" @click.stop="selectAllClick">
        <!-- <div style="display:flex;marginRight:20px;">
          <img v-if="selectAllIf" src="./image/select.png" alt />
          <div v-else class="itemSelect" @click.stop="selectAllClick"></div>
          <div>全选</div>
        </div>-->
        <div class="itemSelect" v-if="!selectAllIf"></div>
        <div v-else class="itemCancleSelect">
          <img src="./image/select.png" alt />
        </div>
        <div>全选</div>
      </div>
      <div style="paddingRight:10px;">
        <el-button @click="ifPass(1,selectShowItem)" class="memberListTopTwo">通过</el-button>
        <el-button @click="noPass(selectShowItem)" class="memberListTopTwo" style="marginLeft:0;">不通过</el-button>
        <el-dropdown trigger="click" @command="toSchool" placement="bottom">
          <el-button class="el-dropdown-link memberListTopTwo">移交学院</el-button>
          <el-dropdown-menu slot="dropdown" style="maxHeight:200px;overflowY:auto;">
            <el-dropdown-item v-for="item in collegeList" :key="item.id" :command="item.id">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <div class="memberListTopTwo" @click="toSchool">移交给学院审批</div> -->
    </div>
    <!-- 中部待办会员申请 -->
    <ul class="memberListItems">
      <li v-for="item in leftShowlist" :key="item.id" :class="{'memberListItem':true,'leftSeletOne':leftSelectItem===item.id}">
        <!-- 选中时右角 -->
        <!-- <div class="rightArrow"></div> -->
        <!-- 选中、不选中的勾选框 -->
        <div class="itemCheckIf">
          <div class="itemSelect" v-if="selectShowItem.indexOf(item.taskId)===-1" @click.stop="selectOneItem(item.taskId)"></div>
          <div @click.stop="cancleSelectShowItem(item.taskId)" v-else class="itemCancleSelect">
            <img src="./image/select.png" alt />
          </div>
        </div>
        <!-- 信息展示 -->
        <div class="itemShowInfo" @click="clickApproveItem(item.id)">
          <div class="itemShowInfoTop">
            <img :src="item.userHeadImg" />
            <div class="itemShowInfoTop-right">
              <div class="itemShowInfoTop-right__top">
                <div style="display:flex;alignItems:center;">
                  <div style="fontSize:14px;color:#222222;marginRight:10px;fontWeight:700;">{{item.name}}</div>
                  <div style="color:#ECA038;fontSize:12px;padding:0 5px;backgroundColor: #FAEEDD;borderRadius:2px;">{{item.groupName}}</div>
                </div>
                <div>{{item.taskCreateTime | friendlyTime}}</div>
              </div>
              <!-- <div class="itemShowInfoTop-right__bot">
                <span>昵称： {{item.userNickName}}</span>
              </div>-->
              <div style="display:flex;alignItems:center;">
                <div style="color:#626262;fontSize:14px;marginRight:20px;">{{item.phone}}</div>
                <div style="color:#626262;fontSize:14px;">{{item.college}}</div>
              </div>
            </div>
          </div>
          <!-- <div class="itemShowInfoBot">
            <div style="color:#626262;fontSize:14px;">{{item.college}}</div>
            <div style="color:#626262;fontSize:14px;">{{item.phone}}</div>
          </div>-->
          <div class="ifPassApprove" style="marginTop:15px;paddingLeft:50px;">
            <el-button v-if="leftSelectItem===item.id" size="mini" @click.stop="ifPass(1,[item.taskId])" style="color:#fff;backgroundColor:#3FA1B6;fontSize:14px;">通过</el-button>
            <el-button v-else size="mini" @click.stop="ifPass(1,[item.taskId])" style="color:#3FA1B6;border:1px solid #3FA1B6;fontSize:14px;">通过</el-button>
            <el-button size="mini" style="color:#3FA1B6;border:1px solid #3FA1B6;fontSize:14px;" @click.stop="noPass([item.taskId])">不通过</el-button>
          </div>
        </div>
      </li>
    </ul>
    <!-- 底部分页功能 -->
    <div class="memberListBottom">
      <el-pagination style="width:80%" :pager-count="5" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="searchForm.limit" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="驳回意见" :visible.sync="rejectVisible" width="600px" append-to-body :close-on-click-modal="false" class="collegedia">
      <el-form label-width="100px">
        <el-form-item label="驳回意见" size="small">
          <el-input type="textarea" v-model="opinion" :autosize="{ minRows: 3, maxRows:6 }" placeholder="请输入驳回意见"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="el-icon-error" type="danger" size="small" @click="rejectVisible = false">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="ifPass(2,taskIds)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "memberList",
  props: ["rightSelectItem"],
  data() {
    return {
      leftShowlist: [],
      rightShowList: [],
      selectAllIf: false,
      searchForm: {
        collage: "",
        limit: 6,
        offset: 0,
        nameOrPhone: "",
        identity: "",
      },
      currentPage: 1,
      total: 0,
      collegeList: [], //学院列表
      searchInput: "",
      searchType: "", //type为1时，是进行姓名的搜索；type为2时，是进行手机号的搜索---用于展示搜索条件
      collegeSearch: "",
      collegeItems: [],
      selectShowItem: [], //当前选择的待办项---可能同时选择多个
      leftSelectItem: "", //左边选中的唯一的那个待办项
      rejectVisible:false,
      opinion:"",
      taskIds:[],
      roading:null
    };
  },
  watch: {
    "searchForm.nameOrPhone"(val) {
      this.getList();
    },
    "searchForm.collage"(val) {
      this.getList();
    },
    searchInput(val) {
      var reg = /^1(3|4|5|7|8)\d{9}$/;
      if (reg.test(val)) {
        this.searchType = "2";
      } else {
        this.searchType = "1";
      }
    },
    // rightSelectItem(val) {
    //   var nowIndex = 0;
    //   this.leftShowlist.forEach((item, index) => {
    //     if (item.id === this.leftSelectItem) {
    //       nowIndex = index;
    //     }
    //   });
    //   var totalPage = Math.ceil(this.total / this.searchForm.limit);
    //   var length = this.leftShowlist.length;
    //   if (val === 1) {
    //     //首个
    //     if (this.currentPage === 1) {
    //       this.leftSelectItem = this.leftShowlist[0].id;
    //     } else {
    //       this.currentPage = 1;
    //       this.changeSelectItem(1);
    //     }
    //   } else if (val === 2) {
    //     //上一个
    //     if (nowIndex === 0) {
    //       if (this.currentPage === 1) {
    //         return false;
    //       } else {
    //         this.currentPage--;
    //         this.changeSelectItem(this.currentPage, true);
    //       }
    //     } else {
    //       this.leftSelectItem = this.leftShowlist[nowIndex - 1].id;
    //     }
    //   } else if (val === 3) {
    //     //下一个
    //     if (nowIndex === this.leftShowlist.length - 1) {
    //       if (totalPage === this.currentPage) {
    //         return false;
    //       } else {
    //         this.currentPage++;
    //         this.changeSelectItem(this.currentPage);
    //       }
    //     } else {
    //       this.leftSelectItem = this.leftShowlist[nowIndex + 1].id;
    //     }
    //   } else if (val === 4) {
    //     //末个
    //     if (totalPage === this.currentPage) {
    //       this.leftSelectItem = this.leftShowlist[length - 1].id;
    //     } else {
    //       this.currentPage = totalPage;
    //       this.changeSelectItem(this.currentPage, true);
    //     }
    //   }
    // },
    leftSelectItem(val) {
      this.clickApproveItem(val);
    },
  },
  created() {
    this.getList();
    this.getCollegeList();
  },
  methods: {
    //获取列表信息
    getList(data) {
      this.leftShowlist = [];
      this.$request
        .get(
          "/api/admin/flow/getMemberApprovalPage?collage=" +
            this.searchForm.collage +
            "&limit=" +
            this.searchForm.limit +
            "&offset=" +
            this.searchForm.offset +
            "&nameOrPhone=" +
            this.searchForm.nameOrPhone +
            "&identity=" +
            this.searchForm.identity
        )
        .then((res) => {
          // console.log(res);
          if (res.data.list.length === 0) {
            return;
          }
          res.data.list.forEach((item) => {
            item.formData = JSON.parse(item.formData);
            var newObj = {
              createTime: item.createTime,
              taskCreateTime:item.taskCreateTime,
              id: item.id,
              groupName: item.groupName,
              userHeadImg: item.userHeadImg,
              userNickName: item.userNickName,
              taskId: item.taskId,
              phone: item.phone,
            };
            item.formData.forEach((ele) => {
              if (ele.key === "name" || ele.key === "college") {
                newObj[ele.key] = ele[ele.key];
              }
            });
            this.leftShowlist.push(newObj);
          });
          //因为左右两边展示的内容格式不同，所以要做处理
          //右边展示数据
          this.rightShowList = JSON.parse(JSON.stringify(res.data.list));
          //左边展示数据
          this.total = res.data.total;
          this.leftSelectItem = this.leftShowlist[0].id;
          if (data) {
            //要选择当前页的最后一个
            var index = this.leftShowlist.length - 1;
            this.leftSelectItem = this.leftShowlist[index].id;
          }
        });
    },
    //点击其中一个申请
    clickApproveItem(id) {
      this.leftSelectItem = id;
      var obj = {};
      this.rightShowList.some((item) => {
        if (item.id === id) {
          obj = JSON.parse(JSON.stringify(item));
          return true;
        }
      });
      // console.log(obj);
      this.$emit("selectOneInfo", obj);
    },
    //选中其中的一个
    selectOneItem(taskId) {
      this.selectShowItem.push(taskId);
      if (this.selectShowItem.length === this.leftShowlist.length) {
        this.selectAllIf = true;
      } else {
        this.selectAllIf = false;
      }
    },
    //取消选中的其中一个
    cancleSelectShowItem(taskId) {
      var num = this.selectShowItem.indexOf(taskId);
      this.selectShowItem.splice(num, 1);
      this.selectAllIf = false;
    },
    //点击通过或不通过按钮
    ifPass(result, taskIds) {
      if (taskIds.length === 0) {
        this.$message({
          message: "请先勾选要操作的申请项",
          type: "warning",
        });
        return false;
      }
      var archiveIds = "";
      this.$emit("getSameIds", (val) => { archiveIds = val; });
      this.$request.post("/api/admin/flow/approve", { result,taskIds,archiveIds,reason:this.opinion }).then((res) => {
        if (res.success) { this.getList();this.rejectVisible=false;this.selectShowItem=[];}
      });
    },
    noPass(taskIds){
      if (taskIds.length === 0) {
        this.$message({
          message: "请先勾选要操作的申请项",
          type: "warning",
        });
        return false;
      }
      this.taskIds = taskIds;
      this.rejectVisible = true;
      this.opinion = ""
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchForm.offset = this.searchForm.limit * (val - 1);
      this.getList();
    },
    //右边组件点击  上一个、下一个、首个、末个  按钮
    changeSelectItem(page, data) {
      this.searchForm.offset = this.searchForm.limit * (page - 1);
      this.getList(data);
    },
    //获取学院列表
    getCollegeList() {
      this.$request.get("/api/admin/college/getCollegeList").then((res) => {
        this.collegeList = JSON.parse(JSON.stringify(res.data));
      });
    },
    //移交给学院审批
    toSchool(key) {
      if (this.selectShowItem.length === 0) {
        this.$message({
          message: "请先勾选要移交的申请项",
          type: "warning",
        });
      } else {
        this.$request
          .post("/api/admin/flow/assignCollege", {
            collegeId: key,
            taskIds: this.selectShowItem,
          })
          .then((res) => {
            if (res.success) {
              this.getList();
            }
          });
      }
    },
    //全选或全不选
    selectAllClick() {
      this.selectAllIf = !this.selectAllIf;
      if (this.selectAllIf) {
        this.selectShowItem = [];
        this.leftShowlist.forEach((item) => {
          this.selectShowItem.push(item.taskId);
        });
      } else {
        this.selectShowItem = [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.memberListContainer {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  position: relative;
  .memberListTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 11px 0;
    background-color: #fff;
    width: 100%;
    border-bottom: 1px solid #e8e8e8;
    // div {
    //   padding: 0 25px;
    //   cursor: pointer;
    // }
    .memberListTopTwo {
      // border-left: 1px solid #ccc;
      // border-right: 1px solid #ccc;
      border: 1px solid #3fa1b6;
      color: #3fa1b6;
      font-size: 14px;
      margin-right: 10px;
      padding: 9px 16px;
      // padding: 10px 20px;
      // box-sizing: border-box;
    }
  }
  .memberListSearch {
    padding: 15px 20px;
    border-bottom: 1px solid #e6e6e6;
    .memberListSearchTerm {
      display: flex;
      // justify-content: space-between;
      // justify-content: space-around;
      .memberList-SearchInput {
        width: 100%;
      }
      .memberList-SearchSelect {
        width: 45%;
      }
    }
    .memberListSearchShow {
      display: flex;
      margin-top: 10px;
      align-items: center;
      .searchItem {
        padding: 5px 10px;
        border: 1px dashed rgb(0, 102, 255);
        color: rgb(0, 102, 255);
      }
    }
  }
  .memberListItems {
    flex: 1;
    // padding: 0 7px;
    padding-bottom: 70px;
    overflow-y: auto;
    .memberListItem {
      // background-color: #fff;
      border-bottom: 1px solid #e8e8e8;
      &:hover {
        background-color: #f9f9f9;
      }
      display: flex;
      padding: 20px;
      box-sizing: border-box;
      // margin-bottom: 10px;
      .itemShowInfo {
        flex: 1;
        .itemShowInfoTop {
          display: flex;
          // justify-content: space-between;
          font-size: 13px;
          color: #888888;
          align-items: center;
          img {
            width: 42px;
            height: 42px;
            margin-right: 8px;
            border-radius: 50%;
          }
          .itemShowInfoTop-right {
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
            .itemShowInfoTop-right__top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 7px;
            }
          }
        }
        // .itemShowInfoMid {
        //   font-size: 16px;
        //   display: flex;
        //   padding: 25px 0 15px 0;
        //   align-items: center;
        //   div {
        //     margin-right: 25px;
        //   }
        // }
        .itemShowInfoBot {
          padding: 7px 0 0 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .ifPassApprove {
            display: flex;
            font-size: 14px;
            div {
              padding: 5px 25px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .memberListBottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #f9f9f9;
  }
}
.leftSeletOne {
  // border: 2px solid rgb(255, 204, 0);
  background-color: #f9f9f9;
  position: relative;
}
.itemCheckIf {
  // width: 10%;
  display: flex;
  align-items: center;
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
</style>
