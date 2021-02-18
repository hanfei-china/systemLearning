<template>
  <div class="memberListContainer">
    <!-- 顶部搜索模块 -->
    <div class="memberListSearch">
      <div class="memberListSearchTerm">
        <el-input class="memberList-SearchInput" placeholder="搜索姓名/手机号/学院" prefix-icon="el-icon-search"
                  v-model="searchForm.searchContent" size="small"></el-input>
      </div>
    </div>
    <!-- 顶部操作模块 -->
    <div class="memberListTop">
      <div class="itemCheckIf" style="paddingLeft:20px;cursor:pointer;marginRight:20px;" @click.stop="selectAllClick">
        <div class="itemSelect" v-if="!selectAllIf"></div>
        <div v-else class="itemCancleSelect"><img src="../image/select.png" alt=""></div>
        <div>全选</div>
      </div>
      <div style="paddingRight:10px;">
        <el-button @click="ifPass(1,selectShowItem)" class="memberListTopTwo">通过</el-button>
        <el-button @click="noPass(selectShowItem)" class="memberListTopTwo" style="marginLeft:0;">不通过</el-button>
        <!-- <el-dropdown trigger="click" @command="toSchool" placement="bottom">
          <el-button class="el-dropdown-link memberListTopTwo">移交学院</el-button>
          <el-dropdown-menu slot="dropdown" style="maxHeight:200px;overflowY:auto;">
            <el-dropdown-item v-for="item in collegeList" :key="item.id" :command="item.id">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
    </div>
    <!-- 中部待办会员申请 -->
    <ul class="memberListItems">
      <li v-for="item in leftShowlist" :key="item.id"
          :class="{'memberListItem':true,'leftSeletOne':leftSelectItem===item.id}">
        <div class="itemCheckIf">
          <div class="itemSelect" v-if="selectShowItem.indexOf(item.id)===-1"
               @click.stop="selectOneItem(item.id)"></div>
          <div @click.stop="cancleSelectShowItem(item.id)" v-else class="itemCancleSelect">
            <img src="../image/select.png" alt="">
          </div>
        </div>
        <!-- 信息展示 -->
        <div class="itemShowInfo" @click="clickApproveItem(item.id)">
          <div class="itemShowInfoTop">
            <img :src="item.headImg"/>
            <div class="itemShowInfoTop-right">
              <div class="itemShowInfoTop-right__top">
                <div style="display:flex;alignItems:center;">
                  <div style="fontSize:14px;color:#222222;marginRight:10px;fontWeight:700;">{{ item.name }}</div>
                </div>
                <div>{{ item.createTime | friendlyTime }}</div>
              </div>
              <div style="display:flex;alignItems:center;">
                <div style="color:#626262;fontSize:14px;">{{ item.college }}</div>
              </div>
            </div>
          </div>
          <div class="ifPassApprove" style="marginTop:15px;paddingLeft:50px;">
            <el-button v-if="leftSelectItem===item.id" size="mini" @click.stop="ifPass(1,[item.id])"
                       style="color:#fff;backgroundColor:#3FA1B6;fontSize:14px;">通过
            </el-button>
            <el-button v-else size="mini" @click.stop="ifPass(1,[item.id])"
                       style="color:#3FA1B6;border:1px solid #3FA1B6;fontSize:14px;">通过
            </el-button>
            <el-button size="mini" style="color:#3FA1B6;border:1px solid #3FA1B6;fontSize:14px;"
                       @click.stop="noPass([item.id])">不通过
            </el-button>
          </div>
        </div>
      </li>
      <li v-if="leftShowlist.length==0">
        <div class="nodata">
          <img src="../image/no-data.png" alt="">
          <p>暂无数据</p>
        </div>
      </li>
    </ul>
    <!-- 底部分页功能 -->
    <div class="memberListBottom">
      <el-pagination style="width:80%" :pager-count="5" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-size="searchForm.limit" layout="total, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <el-dialog title="驳回意见" :visible.sync="rejectVisible" width="600px" append-to-body :close-on-click-modal="false"
               class="collegedia">
      <el-form label-width="100px">
        <el-form-item label="驳回意见" size="small">
          <el-input type="textarea" v-model="rejectReason" :autosize="{ minRows: 3, maxRows:6 }"
                    placeholder="请输入驳回意见"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="el-icon-error" type="danger" size="small" @click="rejectVisible = false">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="ifPass(2,ids)">确定</el-button>
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
      selectAllIf: false,
      searchForm: {
        limit: 6,
        offset: 0,
        searchContent: "",
      },
      currentPage: 1,
      total: 0,
      collegeList: [], //学院列表
      selectShowItem: [], //当前选择的待办项---可能同时选择多个
      leftSelectItem: "", //左边选中的唯一的那个待办项
      rejectVisible: false,
      rejectReason: "",
      ids: [],
    };
  },
  watch: {
    "searchForm.searchContent"(val) {
      this.searchForm.offset = 0
      this.getList();
    },
    leftSelectItem(val) {
      this.clickApproveItem(val);
    },
  },
  created() {
    this.getList();
    // this.getCollegeList();
  },
  methods: {
    //获取列表信息
    getList() {
      this.leftShowlist = [];
      this.$request.get("/api/admin/member/card/list?limit=" + this.searchForm.limit + "&offset=" + this.searchForm.offset + "&searchContent=" + this.searchForm.searchContent + "&auditStatus=0").then((res) => {
        this.leftShowlist = res.data.list
        //左边展示数据
        this.total = res.data.total;
        if (this.leftShowlist.length > 0) {
          this.leftSelectItem = this.leftShowlist[0].id;
        } else {
          this.leftSelectItem = "";
        }
      });
    },
    //点击其中一个申请
    clickApproveItem(id) {
      this.leftSelectItem = id;
      var obj = null;
      this.leftShowlist.some((item) => {
        if (item.id === id) {
          obj = JSON.parse(JSON.stringify(item));
          return true;
        }
      });
      this.$emit("selectOneInfo", obj);
    },
    //选中其中的一个
    selectOneItem(id) {
      this.selectShowItem.push(id);
      if (this.selectShowItem.length === this.leftShowlist.length) {
        this.selectAllIf = true;
      } else {
        this.selectAllIf = false;
      }
    },
    //取消选中的其中一个
    cancleSelectShowItem(id) {
      var num = this.selectShowItem.indexOf(id);
      this.selectShowItem.splice(num, 1);
      this.selectAllIf = false;
    },
    //点击通过或不通过按钮
    ifPass(applyStatus, ids) {
      if (ids.length === 0) {
        this.$message({
          message: "请先勾选要操作的申请项",
          type: "warning",
        });
        return false;
      }
      this.$emit("changeLoading", true)
      this.$request.put("/api/admin/member/card/apply", {
        applyStatus,
        ids,
        rejectReason: this.rejectReason
      }).then((res) => {
        this.$emit("changeLoading", false)
        if (res.success) {
          this.getList();
          this.rejectVisible = false;
          this.selectShowItem = [];
          this.selectAllIf = false;
        }
      });
    },
    noPass(ids) {
      if (ids.length === 0) {
        this.$message({
          message: "请先勾选要操作的申请项",
          type: "warning",
        });
        return false;
      }
      this.ids = ids;
      this.rejectVisible = true;
      this.rejectReason = ""
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchForm.offset = this.searchForm.limit * (val - 1);
      this.getList();
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
              ids: this.selectShowItem,
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
          this.selectShowItem.push(item.id);
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


.nodata {
  text-align: center;
  margin-top: 100px;

  img {
    width: 250px;
  }

  p {
    color: #909399;
  }
}
</style>
