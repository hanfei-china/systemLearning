<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding">
      <el-container v-if="!showDetailVisible" class="absolute-fill-parent activeList-wrap" style="padding: 0 25px 16px;">
        <el-main class="unset-padding position-relative">
          <vue-scroll v-show="list.length > 0">
            <div class="listWrap">
              <div class="listInner flex flex-wrap">
                <div class="activeItem position-relative" v-for="item in list" :key="item.id">
                  <div class="itemBg position-relative">
                    <el-image style="width: 100%;height: 188px;" fit="cover" :src="item.posterUrl"></el-image>
                    <div class="position-absolute" style="right: 10px;top: 10px;">
                      <el-checkbox v-model="item.checked" @change="checked=>checkedItem(checked, item.id)"></el-checkbox>
                    </div>
                  </div>
                  <div class="itemDesc">
                    <div style="font-size: 14px;color: black;" class="text-overflow">
                      #&nbsp;{{item.branchName}}&nbsp;#&nbsp;&nbsp;{{item.theme}}
                    </div>
                    <div style="padding-top: 8px;font-size: 12px;color: #727272;">
                      <i class="el-icon-timer"></i>
                      {{item.beginTime | yyyyMMddHHmm}}
                      <span style="display: inline-block;padding: 0 5px;">至</span>
                      {{item.endTime | yyyyMMddHHmm}}
                    </div>
                    <div style="padding-top: 8px;">
                      <div style="font-size: 12px;color: #727272;" class="text-overflow">
                        <i class="el-icon-map-location" style="margin-right: 4px;"></i>{{item.address}}
                      </div>
                    </div>
                    <div style="padding-top: 8px;">
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
                          <span slot="reference" style="cursor:pointer;">{{item.name}}</span>
                        </el-popover>
                      </div>
                    </div>
                    <div class="text-align-right" style="padding-top: 10px;">
                      <el-tooltip v-if="item.branchId" style="margin-right:10px;" effect="dark" content="公开后的活动会出现在活动大厅" placement="top">
                        <el-switch active-color="#3FA1B6" @change="changePublic(item.id,item.isPublic)" v-model="item.isPublic" active-text="公开" inactive-text="不公开"></el-switch>
                      </el-tooltip>
                      <el-button size="mini" @click="toDetails(item)">查看详情</el-button>
                      <el-button size="mini" @click="operateAct('1', item.id)">同意</el-button>
                      <el-button type="danger" size="mini" @click="rejectClick(item.id)">拒绝
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vue-scroll>
          <no-data v-show="list.length === 0">
            <div class="text-align-center" style="font-size: 16px;color: #888888;padding-top: 6px;">暂无活动
            </div>
          </no-data>
        </el-main>
        <el-footer class="flex" height="auto" style="padding: 16px 0 0;">
          <div class="flex-fill-in-the-remaining-space">
            <batch-operation>
              <li>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="checkAllChange" :disabled="list.length === 0">全选</el-checkbox>
              </li>
              <li @click="operateActs('1')">同意</li>
              <li @click="operateActs('2')">拒绝</li>
            </batch-operation>
          </div>
          <div class="flex-fill-in-the-remaining-space text-align-right">
            <el-pagination size="small" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,50,100]" :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="total" background></el-pagination>
          </div>
        </el-footer>
      </el-container>
      <active-detail v-if="showDetailVisible" :detailId="detailId" :operateVisible="true" @openVisible="openVisible" @operateAct="copyOperateAct"></active-detail>
    </el-main>
    <el-dialog title="驳回意见" :visible.sync="rejectVisible" width="600px" append-to-body :close-on-click-modal="false" class="collegedia">
      <el-form label-width="100px">
        <el-form-item label="驳回意见" size="small">
          <el-input type="textarea" v-model="opinion" :autosize="{ minRows: 3, maxRows:6 }" placeholder="请输入驳回意见"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="el-icon-error" type="danger" size="small" @click="rejectVisible = false">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="operateAct('2', rejectId)">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import ActiveDetail from "./ActiveDetail";
import NoData from "../../../../util/noData/NoData";
import BatchOperation from "../../../../util/BatchOperation";

export default {
  name: "ActivityExamine",
  components: { BatchOperation, NoData, ActiveDetail },
  data() {
    return {
      list: [],
      idList: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      showDetailVisible: false, //查看详情
      detailId: "",
      checkedList: [],
      checkedAll: false,
      isIndeterminate: false, //开启全选
      checkedItemStatus: false, //某一项是否选中
      rejectVisible:false,
      opinion:'',      //驳回意见
      rejectId:'',     //驳回活动的id
    };
  },
  created() {
    this.getList();
  },
  watch: {
    checkedItemStatus(val) {
      for (let i = 0; i < this.list.length; i++) {
        this.$set(this.list[i], "checked", val);
      }
    },
  },
  methods: {
    changePublic(id, isPublic) {
      var params = { activityId: id, isPublic: isPublic };
      this.$request.put("/api/admin/activityInfo/updateActivityInfoPublic", params).then(res => {});
    },
    getList() {
      this.idList = [];
      this.$request
        .get("/api/admin/activityInfo/getActivityInfosOfMyBranch", {
          params: {
            activityTitle: "",
            condition: "5",
            limit: this.pageSize,
            offset: this.pageSize * (this.currentPage - 1),
          },
        })
        .then((res) => {
          if (res.success) {
            let copyList = res.data.list;
            copyList.map((item) => {
              this.$set(item, "checked", false);
            });
            this.list = copyList;

            this.total = res.data.total;
            for (let i = 0; i < copyList.length; i++) {
              this.idList.push(copyList[i].id);
            }
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 0;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    toDetails(row) {
      this.showDetailVisible = true;
      this.detailId = row.id;
    },
    rejectClick(id){
      this.rejectId=id;
      this.rejectVisible=true;
    },
    operateAct(status, id) {
      this.$request
        .put("/api/admin/activityInfo/updateVerifyStatus", {
          ids: [id],
          verifyStatus: status,
          refuseReason:status == "2"?this.opinion:''
        })
        .then((res) => {
          if (res.success) {
            if (status === "1") {
              this.$message.success("已通过");
            } else {
              this.$message.success("已拒绝");
              this.rejectVisible=false;
            }

            if (this.checkedList.length > 0) {
              this.reduceCheckdItem(id);
            }
            this.total = this.total - 1;
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].id === id) {
                this.list.splice(i, 1);
              }
            }
            for (let i = 0; i < this.idList.length; i++) {
              if (this.idList[i] === id) {
                this.idList.splice(i, 1);
              }
            }
            this.checkedAllStatus();
          }
        });
    },
    operateActs(status) {
      this.$request
        .put("/api/admin/activityInfo/updateVerifyStatus", {
          ids: this.checkedList,
          verifyStatus: status,
        })
        .then((res) => {
          if (res.success) {
            if (status === "1") {
              this.$message.success("已通过");
            } else {
              this.$message.success("已拒绝");
            }
            this.getList();
            this.checkedList = [];
            this.checkedAllStatus();
          }
        });
    },
    openVisible() {
      this.showDetailVisible = false;
    },
    copyOperateAct(val) {
      this.operateAct(val.status, val.id);
      this.showDetailVisible = false;
    },
    //选择某一项
    checkedItem(val, id) {
      if (val) {
        this.addCheckdItem(id);
      } else {
        this.reduceCheckdItem(id);
      }
    },
    //选择某一项动态
    addCheckdItem(val) {
      this.checkedList.push(val);
      this.checkedAllStatus();
    },
    //不选中某一项动态
    reduceCheckdItem(val) {
      for (let i = 0; i < this.checkedList.length; i++) {
        if (this.checkedList[i] === val) {
          this.checkedList.splice(i, 1);
        }
      }
      this.checkedAllStatus();
    },
    //全选状态
    checkedAllStatus() {
      let checkedCount = this.checkedList.length;
      this.checkedAll = checkedCount === this.list.length && checkedCount > 0;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.list.length;
      this.checkedItemStatus = checkedCount === this.list.length;
    },
    //全选
    checkAllChange(val) {
      this.checkedList = val ? this.idList : [];
      this.isIndeterminate = false;
      this.checkedItemStatus = val;
    },
  },
};
</script>

<style lang="less" scoped>
.allContact{
  display: flex;
  align-items: center;
  /deep/.left{
    width: 100px;
    text-align: right;
  }
}
</style>

