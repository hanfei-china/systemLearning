<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding">
      <el-container class="absolute-fill-parent activeList-wrap">
        <el-header class="unset-padding flex border-bottom active-common-header">
          <div class="nav flex-fill-in-the-remaining-space">
            <span class="navWrap cursor-pointer" v-for="item in activitiType" :key="item.condition" @click="changeType(item.condition)">
              <span class="nav-item" :class="{active:activeNav === item.condition}">{{item.title}}</span>
            </span>
          </div>
          <div class="search_Create">
            <!-- <el-checkbox style="margin-right: 10px;" v-model="isUserActivity">会员所发活动</el-checkbox> -->
            <el-checkbox style="margin-right: 10px;" v-model="isOnlyPublic">仅看公开活动</el-checkbox>
            <el-select v-if="activeNav!='7'" filterable class="small-input" clearable size="small" placeholder="筛选分会" v-model="selectBranch">
              <el-option v-for="item in branchList" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
            <!-- 活动状态 -->
            <el-select class="small-input" clearable size="small" placeholder="活动状态" v-model="selectType">
              <el-option v-for="item in navList" :key="item.condition" :value="item.condition" :label="item.title" />
            </el-select>
            <el-input class="small-input" size="small" placeholder="请输入活动名称" v-model="searchWord" />
            <el-button icon="el-icon-circle-plus" type="primary" size="small" @click="toCreate">创建活动</el-button>
            <!--                <el-button icon="el-icon-circle-plus" type="primary" size="small" @click="toUploadPosters">添加海报-->
            <!--                </el-button>-->
          </div>
        </el-header>
        <el-main class="unset-padding position-relative">
          <vue-scroll v-show="activeList.length > 0">
            <div class="listWrap">
              <div class="listInner flex flex-wrap">
                <div class="activeItem position-relative" v-for="item in activeList" :key="item.id">
                  <div v-if="item.activityType === '2'" class="itemMark"></div>
                  <div class="itemBg">
                    <el-image @click="toManage(item.id)" style="width: 100%;height: 188px;cursor:pointer;" fit="cover" :src="item.posterUrl" />
                  </div>
                  <div class="itemDesc">
                    <div @click="toManage(item.id)" style="font-size: 14px;color: black;maxWidth:300px;cursor:pointer;" class="text-overflow">#&nbsp;{{item.branchName}}&nbsp;#&nbsp;&nbsp;{{item.theme}}</div>
                    <div style="padding-top: 8px;font-size: 12px;color: #727272;">
                      <i class="el-icon-timer" />
                      {{item.beginTime | yyyyMMddHHmm}}
                      <span style="display: inline-block;padding: 0 5px;">至</span>
                      {{item.endTime | yyyyMMddHHmm}}
                    </div>
                    <div style="padding-top: 8px;">
                      <div style="font-size: 12px;color: #727272;maxWidth:300px;" class="text-overflow">
                        <i class="el-icon-map-location" style="margin-right: 4px;" />
                        {{item.address}}
                      </div>
                    </div>
                    <div style="padding-top: 8px;" v-if="item.activityType === '2'">
                       <div style="font-size: 12px;color: #727272;" class="text-overflow">
                           <i class="el-icon-user" style="margin-right: 4px;"></i>
                           <el-popover
                           placement="top"
                           width="220"
                           trigger="hover">
                               <div>
                                   <div class="allContact">
                                   <div class="left">手机号：</div>
                                   <div>{{item.telphone}}</div>
                                   </div>
                                   <div class="allContact">
                                   <div class="left">备用联系方式：</div>
                                   <div>{{item.phoneOne}}</div>
                                   </div>
                                   <div class="allContact">
                                   <div class="left">邮箱：</div>
                                   <div>{{item.email}}</div>
                                   </div>
                                   <div class="allContact">
                                   <div class="left">qq：</div>
                                   <div>{{item.qq}}</div>
                                   </div>
                                   <div class="allContact">
                                   <div class="left">微信：</div>
                                   <div>{{item.wechat}}</div>
                                   </div>
                                   <div class="allContact">
                                   <div class="left">是否认证：</div>
                                   <div>{{item.materialStatus==2?'已认证':'未认证'}}</div>
                                   </div>
                               </div>
                               <span slot="reference" style="cursor:pointer;">{{item.name||666}}</span>
                           </el-popover>
                       </div>
                   </div>
                    <div class="text-align-right" style="padding-top: 10px;">
                      <div>
                        <el-tooltip v-if="item.branchId" class="item" effect="dark" content="公开后的活动会出现在活动大厅" placement="top">
                          <el-switch @change="changePublic(item.id,item.isPublic)" v-model="item.isPublic" active-text="公开" inactive-text="不公开"></el-switch>
                        </el-tooltip>
                        <el-popover placement="top-start" width="120" trigger="hover" popper-class="popoverBtn">
                          <div class="operateBtn" v-if="item.publishStatus === '1'" @click="toManage(item.id)">
                            <span class="el-icon-s-order"></span>&nbsp;&nbsp;管理
                          </div>
                          <div class="operateBtn" size="mini" @click="toEdit(item.id)">
                            <span class="el-icon-edit"></span>&nbsp;&nbsp;编辑
                          </div>
                          <div class="operateBtn" size="mini" v-if="item.activityType !== '2' && item.publishStatus === '1'" @click="toUpdate(item.id,'0')">
                            <span class="el-icon-folder-add"></span>&nbsp;&nbsp;移到草稿
                          </div>
                          <div class="operateBtn" size="mini" v-if="item.activityType !== '2' && item.publishStatus === '0'" @click="toUpdate(item.id,'1')">
                            <span class="el-icon-folder-remove"></span>&nbsp;&nbsp;发布
                          </div>
                          <div class="operateBtn" size="mini" v-if="item.activityType === '2'" @click="toDetails(item.id)">
                            <span class="el-icon-zoom-in"></span>&nbsp;&nbsp;查看详情
                          </div>
                          <div class="operateBtn" size="mini" @click="shareCode(item)">
                            <span class="iconfont icon-qr-code"></span>&nbsp;&nbsp;二维码
                          </div>
                          <div class="operateBtn" size="mini" type="danger" @click="toUpdate(item.id,'2')">
                            <span class="el-icon-delete"></span>&nbsp;&nbsp;删除
                          </div>
                          <el-button slot="reference" circle icon="el-icon-more" size="mini" style="marginLeft:15px;"></el-button>
                        </el-popover>
                      </div>
                      <!-- <el-button-group>
                                                <el-button icon="el-icon-s-order" size="mini"
                                                           v-if="item.publishStatus === '1'"
                                                           @click="toManage(item.id)">管理
                                                </el-button>
                                                <el-button icon="el-icon-edit" size="mini"
                                                           @click="toEdit(item.id)">编辑
                                                </el-button>
                                                <el-button icon="el-icon-folder-add" size="mini"
                                                           v-if="item.activityType !== '2' && item.publishStatus === '1'"
                                                           @click="toUpdate(item.id,'0')">移到草稿
                                                </el-button>
                                                <el-button icon="el-icon-folder-remove" size="mini"
                                                           v-if="item.activityType !== '2' && item.publishStatus === '0'"
                                                           @click="toUpdate(item.id,'1')">发布
                                                </el-button>
                                                <el-button icon="el-icon-zoom-in" size="mini"
                                                           v-if="item.activityType === '2'"
                                                           @click="toDetails(item.id)">查看详情
                                                </el-button>
                                                <el-tooltip class="item" effect="dark" content="活动分享二维码" placement="top">
                                                    <el-button icon="iconfont icon-qr-code" size="mini"
                                                               @click="shareCode(item)"/>
                                                </el-tooltip>
                                                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                                    <el-button icon="el-icon-delete" size="mini" type="danger"
                                                               @click="toUpdate(item.id,'2')"/>
                                                </el-tooltip>
                      </el-button-group>-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vue-scroll>
          <no-data v-show="activeList.length === 0">
            <div class="text-align-center" style="font-size: 16px;color: #888888;padding-top: 6px;">暂无活动</div>
          </no-data>
        </el-main>
        <el-footer class="text-align-right" style="padding:14px 0 0;">
          <el-pagination size="small" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[12, 24, 50, 100]" :page-size="pageSize" :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper" :total="totalCount" background></el-pagination>
        </el-footer>
        <el-dialog :visible.sync="activityShareCodeFormVisible" title="活动分享二维码" append-to-body :close-on-click-modal="false" width="800px">
          <div class="flex flex-center">
            <qr-code :activity-id="activityShareId" :activity-name="activityShareName" :activity-mp-code="activityShareCode" />
          </div>
        </el-dialog>
      </el-container>
      <active-detail v-if="showDetailVisible" :detailId="detailId" @openVisible="openVisible" />
    </el-main>
  </el-container>
</template>

<script>
import NoData from "../../../../util/noData/NoData";
import ActiveDetail from "../activityExamine/ActiveDetail";
import QrCode from "../qrCode/QrCode";

export default {
  name: "ActivityList",
  components: { QrCode, ActiveDetail, NoData },
  data() {
    return {
      isUserActivity: false,
      activityCategoryId: "", //活动分类
      activityCategoryList: [], //分类列表
      searchWord: "", //搜索框关键字
      currentPage: 1, //开始页
      pageSize: 12, //每页条数
      totalCount: 0, //总条数
      activeList: [], //活动列表
      activeNav: "0", //tab标签切换
      selectType: "",
      navList: [
        {
          condition: "1",
          title: "进行中",
        },
        {
          condition: "2",
          title: "已结束",
        },
        {
          condition: "3",
          title: "草稿",
        },
      ],
      activitiType: [
        {
          condition: "0",
          title: "全部活动",
        },
        {
          condition: "7",
          title: "总会活动",
        },
        {
          condition: "6",
          title: "各分会活动",
        },
      ],
      branchList: [], //分会列表
      selectBranch: "",
      isOnlyPublic: false,

      activityShareCodeFormVisible: false,
      activityShareCode: "",
      activityShareName: "",
      activityShareId: "",
      detailId: "",
      showDetailVisible: false,
    };
  },
  created() {
    this.getActiveList("0");
    this.getActivityCategoryList();
    this.getBranchList();
  },
  watch: {
    searchWord() {
      this.getActiveList(this.activeNav);
    },
    // activityCategoryId() {
    //     this.getActiveList(this.activeNav);
    // },
    selectBranch() {
      this.getActiveList(this.activeNav);
    },
    selectType() {
      this.getActiveList(this.activeNav);
    },
    isUserActivity() {
      this.currentPage = 1;
      this.getActiveList(this.activeNav);
    },
    isOnlyPublic() {
      this.getActiveList(this.activeNav);
    },
  },
  methods: {
    //获取活动类型列表
    getActivityCategoryList() {
      this.$request
        .get("/api/admin/group/getCategoryNameAndIdByName", {
          params: {
            type: 3,
          },
        })
        .then((res) => {
          this.activityCategoryList = res.data;
        });
    },
    //获取分会列表
    getBranchList() {
      this.$request.get("/api/admin/branch/branchListByName").then((res) => {
        console.log(res);
        this.branchList = JSON.parse(JSON.stringify(res.data));
      });
    },
    //查看详情
    toDetails(id) {
      this.showDetailVisible = true;
      this.detailId = id;
    },
    openVisible() {
      this.showDetailVisible = false;
    },
    //跳转到创建活动页面
    toCreate() {
      const { href } = this.$router.resolve({
        path: "/addActivity/all",
      });
      window.open(href, "_blank");
    },
    //跳转到上传海报页面
    toUploadPosters() {
      const { href } = this.$router.resolve({
        path: "/uploadPosters",
      });
      window.open(href, "_blank");
    },
    //跳转到管理报名者页面
    toManage(id) {
      const { href } = this.$router.resolve({
        name: "/activeForm/:activityId/orderList",
        params: {
          activityId: id,
        },
      });
      window.open(href, "_blank");
    },
    //跳转编辑页面
    toEdit(id) {
      const { href } = this.$router.resolve({
        name: "/activeForm/:activityId/editActivity",
        params: {
          activityId: id,
        },
      });
      window.open(href, "_blank");
    },
    //保存草稿、发布、删除
    toUpdate(id, status) {
      if (status === "2") {
        this.$confirm("此操作将永久删除该文件，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$request
              .put("/api/admin/activityInfo/updateActivityInfoStatus", {
                activityId: id,
                publishStatus: status,
              })
              .then((res) => {
                if (res.success) {
                  this.$message.success("删除成功");
                  this.getActiveList(this.activeNav);
                }
              });
          })
          .catch(() => {});
      } else {
        this.$request
          .put("/api/admin/activityInfo/updateActivityInfoStatus", {
            activityId: id,
            publishStatus: status,
          })
          .then((res) => {
            if (res.success) {
              this.$message.success("操作成功");
              this.getActiveList(this.activeNav);
            }
          });
      }
    },

    //分页变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.this.currentPage = 1;
      this.getActiveList(this.activeNav);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getActiveList(this.activeNav);
    },
    //获取所有活动信息
    getActiveList(num) {
      let condition = num;
      //状态 0草稿  1发布  2删除
      this.activeNav = num;
      this.$request
        .get("/api/admin/activityInfo/getActivityInfosOfMyBranch", {
          params: {
            // isUserActivity: this.isUserActivity,
            activityCategoryId: this.activityCategoryId,
            activityTitle: this.searchWord,
            condition: condition,
            limit: this.pageSize,
            offset: this.pageSize * (this.currentPage - 1),
            branchId: this.selectBranch,
            activityStatus: this.selectType,
            isPublic: this.isOnlyPublic ? this.isOnlyPublic : "",
          },
        })
        .then((res) => {
          if (res.success) {
            this.activeList = res.data.list;
            this.totalCount = res.data.total;
          }
        });
    },
    shareCode(row) {
      this.activityShareCodeFormVisible = true;
      this.activityShareCode = "";
      this.activityShareId = row.id;
      this.$request
        .get("/api/admin/activityInfo/shareCode", {
          params: {
            activityId: row.id,
          },
        })
        .then((res) => {
          this.activityShareCode = res.data + "?time=" + new Date().valueOf();
          this.activityShareName = row.theme;
        });
    },
    //改变活动状态
    changePublic(id, isPublic) {
      var params = {
        activityId: id,
        isPublic: isPublic,
      };
      this.$request
        .put("/api/admin/activityInfo/updateActivityInfoPublic", params)
        .then((res) => {
          if (res.success) {
            this.getActiveList(this.activeNav);
          }
        });
    },
    //改变活动筛选的类型
    changeType(condition) {
      this.selectBranch = "";
      this.getActiveList(condition);
    },
  },
};
</script>

<style scoped lang="less">
.itemMark {
  position: absolute;
  width: 60px;
  right: -8px;
  top: 0;
}

.itemMark:before {
  /*做一个书签效果*/
  position: absolute; /*必须*/
  top: 0;
  left: -18px;
  z-index: 1;
  height: 0;
  padding-left: 10px;
  line-height: 0;
  color: #ffffff;
  border: 10px solid #ee7600;
  border-left-color: transparent; /*右边框透明，变成空缺的角*/
  content: "会员活动";
  box-shadow: 0 5px 5px -5px #000;
  font-size: 10px;
}

.itemMark:after {
  /*书签的夹角*/
  content: "";
  position: absolute;
  z-index: 1;
  top: 20px;
  left: 52px;
  border: 4px solid #89540c;
  border-right-color: transparent;
  border-bottom-color: transparent;
}
.operateBtn {
  padding: 5px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  width: 150px;
}
.operateBtn:hover {
  color: #409eff;
}
/deep/.popoverBtn {
  min-width: 0 !important;
}
.allContact{
  display: flex;
  align-items: center;
  /deep/.left{
    width: 100px;
    text-align: right;
  }
}
</style>
