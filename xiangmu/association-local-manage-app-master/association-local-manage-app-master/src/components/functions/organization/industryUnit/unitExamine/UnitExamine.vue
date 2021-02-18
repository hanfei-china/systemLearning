<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-aside class="border-right position-relative" style="width: 400px;">
      <div class="memberListContainer">
        <!-- 顶部搜索模块 -->
        <div class="memberListSearch">
          <div class="memberListSearchTerm">
            <el-input
              class="memberList-SearchInput"
              placeholder="搜索姓名/手机号"
              prefix-icon="el-icon-search"
              v-model="searchApplyContent"
              size="small"
              clearable
            ></el-input>
          </div>
        </div>
        <!-- 顶部操作模块 -->
        <div class="memberListTop">
          <div
            class="itemCheckIf"
            style="paddingLeft:20px;cursor:pointer;marginRight:20px;"
            @click.stop="selectAllClick"
          >
            <div class="itemSelect" v-if="!selectAllIf"></div>
            <div v-else class="itemCancleSelect">
              <img src="./image/select.png" alt />
            </div>
            <div>全选</div>
          </div>
          <div style="paddingRight:10px;">
            <el-button @click="examinePictures(1,idList)" class="memberListTopTwo">通过</el-button>
            <el-button
              @click="examinePictures(2,idList)"
              class="memberListTopTwo"
              style="marginLeft:0;"
            >不通过</el-button>
          </div>
        </div>
        <!-- 中部待办会员申请 -->
        <ul class="memberListItems">
          <li
            v-for="(item,index) in list"
            :key="item.id"
            class="memberListItem"
            :class="{'leftSeletOne':curentIndex===index}"
          >
            <div class="itemCheckIf">
              <div class="itemSelect" v-if="!item.checked" @click.stop="checkItem(item)"></div>
              <div
                @click.stop="item.checked=false;selectAllIf=false"
                v-else
                class="itemCancleSelect"
              >
                <img src="./image/select.png" alt />
              </div>
            </div>
            <!-- 信息展示 -->
            <div class="itemShowInfo" @click="leftSelectItem = item;curentIndex=index">
              <div class="itemShowInfoTop">
                <img :src="item.headImg" />
                <div class="itemShowInfoTop-right">
                  <div class="itemShowInfoTop-right__top">
                    <div style="display:flex;alignItems:center;">
                      <div
                        style="fontSize:14px;color:#222222;marginRight:10px;fontWeight:700;"
                      >{{item.nickName}}</div>
                    </div>
                    <div>{{item.createTime | friendlyTime}}</div>
                  </div>
                </div>
              </div>
              <div class="itemShowInfoMid">
                <div class="row">
                  校友：{{item.schoolFellowName}}
                  <span>{{item.college}}</span>
                </div>
                <div class="row">企业：{{item.organizationName}}</div>
              </div>
              <div style="marginTop:7px;paddingLeft:50px;">
                <el-button
                  size="mini"
                  @click.stop="examinePictures(1,[item.id])"
                  class="plainBtnClass"
                >通过</el-button>
                <el-button
                  size="mini"
                  class="plainBtnClass"
                  @click.stop="examinePictures(2,[item.id])"
                >不通过</el-button>
              </div>
            </div>
          </li>
        </ul>
        <!-- 底部分页功能 -->
        <div class="memberListBottom">
          <el-pagination
            style="width:80%"
            :pager-count="5"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-size="page.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="page.total"
          ></el-pagination>
        </div>
      </div>
    </el-aside>
    <el-main class="position-relative unset-padding" v-if="leftSelectItem">
      <el-container class="absolute-fill-parent album-wrap album-examine-wrap">
        <el-header height="158px">
          <div class="elhead">
            <h5>企业入驻申请</h5>
          </div>
          <div class="userbox">
            <img class="userhead" :src="leftSelectItem.headImg" alt />
            <div class="userinfo">
              <div>
                <span>{{leftSelectItem.nickName}}</span>
                <span v-if="leftSelectItem.schoolFellowName">（{{leftSelectItem.schoolFellowName}}）</span>
              </div>
              <p>申请时间：{{leftSelectItem.createTime|yyyyMMdd}}</p>
            </div>
          </div>
        </el-header>
        <el-main class="tableWrap">
          <vue-scroll>
            <div class="picture-table-wrap">
              <div class="partbox">
                <h5 class="parttitle">企业基本信息</h5>
                <div class="fieldshow">
                  <div v-for="(item,index) in basicField" :key="index" class="fieldinfo">
                    {{item.title}}：
                    <span>{{leftSelectItem[item.key]}}</span>
                  </div>
                </div>
              </div>
              <div class="partbox">
                <h5 class="parttitle">企业联系信息</h5>
                <div class="fieldshow">
                  <div v-for="(item,index) in linkField" :key="index" class="fieldinfo">
                    {{item.title}}：
                    <span v-if="item.key=='organizationAddress'">
                      <span>{{leftSelectItem.addressArray.join('-')}}</span>
                    </span>
                    <span v-else>{{leftSelectItem[item.key]}}</span>
                  </div>
                </div>
              </div>
              <div class="partbox">
                <h5 class="parttitle">企业LOGO</h5>
                <div class="picWrap">
                  <el-image
                    fit="cover"
                    style="width: 100%; height: 100%"
                    :src="leftSelectItem.logoUrl"
                    :preview-src-list="[leftSelectItem.logoUrl]"
                  > <div slot="error" class="image-slot">
                    无图片
                  </div></el-image>
                </div>
              </div>
              <div class="partbox">
                <h5 class="parttitle">营业执照</h5>
                <div class="picWrap">
                  <el-image
                    fit="cover"
                    style="width: 100%; height: 100%"
                    :src="leftSelectItem.businessUrl"
                    :preview-src-list="[leftSelectItem.businessUrl]"
                  ></el-image>
                </div>
              </div>
              <div class="partbox">
                <h5 class="parttitle">校友个人信息</h5>
                <div class="fieldshow">
                  <div v-for="(item,index) in alumnicInfo" :key="index" class="fieldinfo">
                    {{item.title}}：
                    <span>{{leftSelectItem[item.key]}}</span>
                  </div>
                </div>
              </div>
            </div>
          </vue-scroll>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "firmExamine",
  data() {
    return {
      leftSelectItem: null, //左边选中的唯一的那个待办项
      curentIndex: 0,
      searchApplyContent: "", //搜索内容
      page: {
        currentPage: 1,
        pageSize: 5,
        total: 0
      },
      list: [], //照片列表
      selectAllIf: false,
      loading: true,
      basicField: [
        { key: "organizationName", title: "企业全称" },
        { key: "shortName", title: "企业简称" },
        { key: "creditCode", title: "统一社会信用代码" },
        { key: "organizationNature", title: "企业性质" },
        { key: "industry", title: "所属行业" },
        { key: "organizationScale", title: "企业规模" }
      ],
      linkField: [
        { key: "organizationAddress", title: "企业地址" },
        { key: "contactPhone", title: "企业电话" },
        { key: "organizationEmail", title: "企业邮箱" },
        { key: "organizationWebsite", title: "企业官网" }
      ],
      alumnicInfo: [
        { key: "schoolFellowName", title: "姓名" },
        { key: "sex", title: "性别" },
        { key: "schoolFellowPhone", title: "手机号" },
        { key: "job", title: "本单位职务" },
        { key: "education", title: "本校经历" },
        { key: "entranceDate", title: "就读年份" },
        { key: "college", title: "所在学院" },
        { key: "major", title: "专业" },
        { key: "cless", title: "班级" },
        { key: "studentNo", title: "学号" }
      ]
    };
  },
  computed: {
    checkedList() {
      return this.list.filter(item => item.checked);
    },
    idList() {
      if (this.checkedList.length) {
        return this.checkedList.map(item => item.id);
      } else {
        return [];
      }
    }
  },
  created() {
    this.getList();
  },
  watch: {
    searchApplyContent() {
      this.getList();
    }
  },
  methods: {
    checkItem(item) {
      item.checked = true;
      if (this.list.every(item => item.checked)) {
        this.selectAllIf = true;
      }
    },
    //全选或全不选
    selectAllClick() {
      this.selectAllIf = !this.selectAllIf;
      if (this.selectAllIf) {
        this.list.map(item => {
          item.checked = true;
        });
      } else {
        this.list.map(item => {
          item.checked = false;
        });
      }
    },
    //获取照片审批列表
    getList() {
      this.list = [];
      this.selectAllIf = false;
      this.loading = true;

      this.$request
        .get("/api/admin/organization/listOrganizationByCondition", {
          params: {
            searchApplyContent: this.searchApplyContent,
            limit: this.page.pageSize,
            offset: this.page.pageSize * (this.page.currentPage - 1),
            orderWay: 2,
            applyStatus: 0
          }
        })
        .then(res => {
          if (res.success) {
            var list = res.data.list;
            list.map(item => {
              this.$set(item, "checked", false);
              item.addressArray = []
              if (item.organizationAddress) {
                let organizationAddress = JSON.parse(item.organizationAddress)
                if (organizationAddress.country) {
                  item.addressArray.push(organizationAddress.country)
                }
                if (organizationAddress.province) {
                  item.addressArray.push(organizationAddress.province)
                }
                if (organizationAddress.city) {
                  item.addressArray.push(organizationAddress.city)
                }
                if (organizationAddress.area) {
                  item.addressArray.push(organizationAddress.area)
                }
                if (organizationAddress.detail) {
                  item.addressArray.push(organizationAddress.detail)
                }
              }
              if (item.contactAddress) {
                item.addressArray.push(item.contactAddress)
              }
            });
            this.list = list;
            this.page.total = res.data.total;
            if (this.list.length > 0) {
              // 暂且通过创建时间作为唯一值
              if (
                this.leftSelectItem &&
                this.list[this.curentIndex] &&
                this.leftSelectItem.createTime ==
                  this.list[this.curentIndex].createTime
              ) {
                this.leftSelectItem = this.list[this.curentIndex];
              } else {
                this.leftSelectItem = this.list[0];
                this.curentIndex = 0;
              }
            } else {
              this.leftSelectItem = null;
            }
          }
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    //审核通过/不通过
    examinePictures(state, idList) {
      if (idList.length == 0) {
        this.$message({ message: "请先勾选要操作的申请项", type: "warning" });
        return false;
      }
      this.$request
        .put("/api/admin/organization/applyOrganization", {
          applyStatus: state,
          ids: idList ? idList : this.idList
        })
        .then(res => {
          if (res.success) {
            this.$message.success("审批完成");
            this.getList();
          }
        });
    },
  }
};
</script>


<style lang="less" scoped>
// @import "../../../../../css/common.less";
.memberListContainer {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  position: relative;
  height: 100%;
  .memberListTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    background-color: #fff;
    width: 100%;
    border-bottom: 1px solid #e8e8e8;
    .memberListTopTwo {
      border: 1px solid #3fa1b6;
      color: #3fa1b6;
      font-size: 14px;
      margin-right: 10px;
      padding: 9px 16px;
    }
  }
  .memberListSearch {
    padding: 10px 15px;
    border-bottom: 1px solid #e6e6e6;
    .memberListSearchTerm {
      display: flex;
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
    padding-bottom: 70px;
    overflow-y: auto;
    .memberListItem {
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
        .itemShowInfoMid {
          margin-top: -5px;
          padding-left: 50px;
          .row {
            font-size: 14px;
            color: #626262;
            line-height: 25px;
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
  background-color: #f9f9f9;
  position: relative;
}
.itemCheckIf {
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

.elhead {
  display: flex;
  align-items: center;
  height: 50px;
  h5 {
    font-size: 14px;
    color: #222222;
    padding-left: 11px;
    line-height: 16px;
    height: 16px;
    border-left: 3px solid #28394b;
  }
}
.userbox {
  display: flex;
  height: 107px;
  align-items: center;
  border-bottom: 1px dashed #e6e6e6;
  .userhead {
    width: 76px;
    height: 76px;
    border-radius: 50%;
  }
  .userinfo {
    margin-left: 22px;
    div {
      font-size: 14px;
      color: #222222;
      line-height: 30px;
    }
    p {
      font-size: 12px;
      color: #888888;
      line-height: 28px;
    }
  }
}

.tableWrap {
  box-sizing: border-box;
  padding: 0 0;
  .picture-table-wrap {
    // width: 100%;
    overflow-x: hidden;
    padding: 0 20px;
    .partbox {
      border-bottom: 1px dashed #e6e6e6;
      padding: 17px;
      .parttitle {
        color: #222222;
        font-size: 14px;
        line-height: 34px;
        font-weight: 500;
      }
      .fieldshow {
        display: flex;
        flex-wrap: wrap;
        .fieldinfo {
          width: 50%;
          box-sizing: border-box;
          padding-right: 30px;
          font-size: 14px;
          color: #393939;
          line-height: 34px;
        }
      }
      .picWrap {
        width: 230px;
        height: 180px;
        margin: 18px 16px 13px 0;
        overflow: hidden;
        position: relative;
      }
    }
  }
}

/deep/.el-image-viewer__close {
  color: white;
}
/deep/.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}
</style>
