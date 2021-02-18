<template>
  <el-container class="absolute-fill-parent background-color-white" style="padding: 16px;">
    <el-tabs @tab-click="handleClick" v-model="activeText">
      <el-tab-pane :name="item.text" v-for="(item,index) in tabOptions" :key="index">
        <span slot="label">
          <span v-if="item.text =='待发货'||item.text =='待审核退款'"
                style="font-weight:bold">{{item.text + '(' + (summary[item.key] || 0) + ')'}}</span>
          <span v-else>{{item.text + '(' + (summary[item.key] || 0) + ')'}}</span>
        </span>
      </el-tab-pane>
    </el-tabs>
    <el-form :model="params" :inline="true" class="form" label-width="110px" size="small"
             @keyup.enter.native="onSubmit">
      <el-form-item>
        <el-input v-model="params.searchContent" placeholder="搜索订单编号/用户昵称/收货地址" style="width: 280px" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit" icon="el-icon-search" size="mini" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 8px">
      <el-button @click="batchCancel" size="small" :disabled="multipleSelection.length==0" v-if="activeIndex==1">取消订单
      </el-button>
      <el-button @click="batchRefund(true)" size="small" :disabled="multipleSelection.length==0"
                 v-if="activeIndex==2||activeIndex==3||activeIndex==4||activeIndex==7">退款
      </el-button>
      <el-button @click="batchRefund(false)" size="small" :disabled="multipleSelection.length==0" v-if="activeIndex==4">
        拒绝退款
      </el-button>
    </div>
    <el-main class="unset-padding">
      <el-table
          size="small"
          :data="orderList"
          class="custom-el-table header-gray"
          border
          stripe
          height="100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <goods-info :extendsInfo="row.extendsInfo"/>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" prop="orderNo" show-tooltip-when-overflow/>
        <el-table-column label="积分抵现金额（元）" prop="integralCount"/>
        <el-table-column label="实付款金额（元）" prop="amount"/>
        <el-table-column label="收货地址" min-width="150" prop="address"/>
        <el-table-column label="支付方式">
          <template slot-scope="{row}">
            <span v-if="row.paymentPlatform === 1">微信</span>
          </template>
        </el-table-column>
        <el-table-column label="快递类型" prop="expressName"/>
        <el-table-column label="快递单号" prop="expressNo"/>
        <el-table-column label="更新时间">
          <template slot-scope="{row}">
            <span>{{row.orderUpdateTime | yyyyMMddHHmm}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="{row}">
            <span>{{row.createTime | yyyyMMddHHmm}}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易状态">
          <template slot-scope="{row}">
            <span v-if="row.orderStatus === 1">未支付</span>
            <span v-else-if="row.orderStatus === 4">超时关闭</span>
            <span v-else-if="row.orderStatus === 7">已取消</span>
            <span v-else-if="row.orderStatus === 2 && row.sendStatus  === 1">待发货</span>
            <span v-else-if="row.orderStatus === 2 && row.sendStatus  === 2">已发货</span>
            <span v-else-if="row.orderStatus === 6">退款中</span>
            <span v-else-if="row.orderStatus === 3">已退款</span>
            <span v-else-if="row.orderStatus === 8">拒绝退款</span>
            <span v-else-if="row.orderStatus === 5">待审核退款</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button
                type="text"
                v-if="row.orderStatus === 1"
                size="small"
                @click="cancelOrder(row)"
            >取消订单
            </el-button>
            <el-button
                type="text"
                v-if="row.orderStatus === 7 || row.orderStatus==3 || row.orderStatus==4"
                size="small"
                @click="deleteOrder(row)"
            >删除订单
            </el-button>
            <el-button
                type="text"
                v-if="row.orderStatus === 2 || row.orderStatus === 8 ||row.orderStatus === 5 "
                size="small" style="color:red"
                @click="refundOrder(row)"
            >退款
            </el-button>
            <el-button
                type="text"
                v-if="(row.orderStatus === 2 || row.orderStatus === 8) && row.sendStatus  === 1"
                size="small"
                @click="postOrder(row)"
            >发货
            </el-button>
            <el-button
                type="text"
                v-if="row.orderStatus === 6 || row.orderStatus === 3 || row.orderStatus === 8"
                size="small"
                style="color:#3399ff"
                @click="viewRefund(row)"
            >查看退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="auto" class="flex" style="padding: 16px 0 0;">
      <!--      <div class="flex-fill-in-the-remaining-space">-->
      <!--        <batch-operation>-->
      <!--          <li>-->
      <!--            <a :href="downloadUrl">订单导出</a>-->
      <!--          </li>-->
      <!--        </batch-operation>-->
      <!--      </div>-->
      <div>
        <el-pagination
            size="small"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
      </div>
    </el-footer>

    <el-dialog class="title_bg" title="快递信息" :visible.sync="postDialogVisible" :modal="false">
      <el-form :model="postForm">
        <el-form-item label="快递公司" label-width="120px">
          <el-input v-model="postForm.expressName"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" label-width="120px">
          <el-input v-model="postForm.expressNo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="postDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitPost">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="title_bg" title="退款" :visible.sync="refundDialogVisible" :modal="false">
      <div style="border: 1px dashed #ccc; margin-bottom: 10px;">
        <el-form :model="model" v-if="model.refundType==2">
          <el-form-item label="申请用户:" label-width="120px">
            <p>{{model.nickName}}</p>
          </el-form-item>
          <el-form-item label="申请时间:" label-width="120px">
            <p>{{model.applyTime | yyyyMMddHHmm}}</p>
          </el-form-item>
          <el-form-item label="申请退款金额:" label-width="120px">
            <p>¥ {{model.applyRefundAmount}}</p>
          </el-form-item>
          <el-form-item label="申请退款积分:" label-width="120px">
            <p>{{model.applyRefundIntegral}}</p>
          </el-form-item>
          <el-form-item label="申请退款说明:" label-width="120px">
            <p>{{model.refundReason}}</p>
          </el-form-item>
        </el-form>
      </div>
      <el-form :model="form">
        <el-form-item label="是否同意退款:" prop="isEnabled" label-width="120px" v-if="model.orderStatus==5">
          <el-radio-group v-model="form.isAgree" @change="changeAgree">
            <el-radio :label="true">同意退款</el-radio>
            <br/>
            <el-radio :label="false">拒绝退款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="实际退款积分:" label-width="120px">
          <el-input v-model="form.refundIntegral" :disabled="!form.isAgree"></el-input>
        </el-form-item>
        <el-form-item label="实际退款金额:" label-width="120px">
          <el-input v-model="form.refundAmount" :disabled="!form.isAgree"></el-input>
        </el-form-item>
        <el-form-item label="退款描述:" label-width="120px">
          <el-input v-model="form.refundDescribe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitRefund">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="title_bg" title="退款详情" :visible.sync="refundInfoDialogVisible" :modal="false">
      <el-form :model="model" style="30%">
        <div style="border: 1px dashed #ccc;">
          <el-form-item label="申请用户:" label-width="120px">
            <p>{{model.nickName}}</p>
          </el-form-item>
          <el-form-item label="申请时间:" label-width="120px">
            <p>{{model.applyTime | yyyyMMddHHmm}}</p>
          </el-form-item>
          <el-form-item label="退款类型:" label-width="120px">
            <p>{{model.refundType == 1 ? '管理员申请' : '用户提交申请'}}</p>
          </el-form-item>
          <el-form-item label="申请退款金额:" label-width="120px">
            <p>¥ {{model.applyRefundAmount}}</p>
          </el-form-item>
          <el-form-item label="申请退款积分:" label-width="120px">
            <p>{{model.applyRefundIntegral}}</p>
          </el-form-item>
          <el-form-item label="申请退款说明:" label-width="120px">
            <p>{{model.refundReason}}</p>
          </el-form-item>
        </div>
        <el-form-item label="处理人:" label-width="120px">
          <p>{{model.handlerName}}</p>
        </el-form-item>
        <el-form-item label="处理时间:" label-width="120px">
          <p>{{model.refundTime | yyyyMMddHHmm}}</p>
        </el-form-item>
        <el-form-item label="是否同意退款:" label-width="120px">
          <p>
            <span v-if="model.isAgree">是</span>
            <span v-else>否</span>
          </p>
        </el-form-item>
        <el-form-item label="实际退款积分:" label-width="120px">
          <p>{{model.refundIntegral}}</p>
        </el-form-item>
        <el-form-item label="实际退款金额:" label-width="120px">
          <p>¥ {{model.refundAmount}}</p>
        </el-form-item>
        <el-form-item label="退款描述:" label-width="120px">
          <p>{{model.refundDescribe}}</p>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import GoodsInfo from "./GoodsBoughtInfo";
export default {
  name: "GoodsBought",
  components: { GoodsInfo},
  props: ['userId'],
  data() {
    return {
      tabOptions: [
        {text: '全部', key: 'orderSum', params: {}},
        {text: '待支付', key: 'loadPayNum', params: {orderStatus: 1}},
        {text: '待发货', key: 'loadSendNum', params: {orderStatus: 2, sendStatus: 1}},
        {text: '已发货', key: 'sendNum', params: {orderStatus: 2, sendStatus: 2}},
        {text: '待审核退款', key: 'userRefundNum', params: {orderStatus: 5}},
        {text: '退款中', key: 'refundIngNum', params: {orderStatus: 6}},
        {text: '已退款', key: 'refundNum', params: {orderStatus: 3}},
        {text: '拒绝退款', key: 'unRefundNum', params: {orderStatus: 8}},
        {text: '已取消', key: 'cancelNum', params: {orderStatus: 7}}
      ],
      activeIndex: 0,
      activeText: '全部',
      params: {
        searchContent: '',
      },

      summary: {},
      multipleSelection: [],
      orderList: [], //订单列表
      currentPage: 1,
      pageSize: 20,
      total: 0,

      postDialogVisible: false,
      refundDialogVisible: false,
      refundInfoDialogVisible: false,

      model: {},
      form: {
        isAgree: true,
        refundIntegral: '',
        refundAmount: '',
        refundDescribe: ''
      },
      postForm: {
        name: '',
        orderNum: ''
      }
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    handleClick(tab) {
      this.activeIndex = tab.index;
      this.activeText = this.tabOptions[tab.index].text;
      this.getOrderList();
    },
    onSubmit() {
      this.currentPage = 1;
      this.getOrderList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderList();
    },
    getOrderList() {
      this.$request
          .get("/api/admin/goods/getOrderListByAdmin", {
            params: Object.assign({
              limit: this.pageSize,
              userId:this.userId,
              offset: this.pageSize * (this.currentPage - 1)
            }, this.params, this.tabOptions[this.activeIndex].params)
          })
          .then(res => {
              res.data.result.list.forEach(item => {
                let extendsInfo = JSON.parse(item.extendsInfo);
                let address = JSON.parse(extendsInfo.address || "{}");
                let str=""
                if (address.deliveryPerson) {
                  str+="【" + address.deliveryPerson + address.telephone + "】"
                  if(address.detailAddress){
                    try {
                      let valueObj = JSON.parse(address.detailAddress)
                      if(valueObj.province){str+=valueObj.province}
                      if(valueObj.city){str+="-"+valueObj.city}
                      if(valueObj.area){str+="-"+valueObj.area}
                      if(valueObj.detail){str+=" "+valueObj.detail}
                    } catch (e) {
                      str+=address.detailAddress||""
                    }
                  }
                  item.address = str
                  // item.address =  + (address.detailAddress || address.address || '');
                }
                item.integralCount = extendsInfo.integralCount || 0;
                item.totalAmount = item.amount + item.integralCount;
              })
              this.orderList = res.data.result.list;
              this.total = res.data.result.total;
              this.summary = res.data.titleNum;
          });
    },
    cancelOrder(row) {
      let me = this;
      me.$confirm('取消订单后该订单将直接作废且无法恢复，是否确认取消?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        me.$request.put('/api/admin/goods/updateOrderOrSendStatus', {
          orderIds: [row.id],
          isCancelOrder: true
        }).then(res => {
          if (res.code == 200) {
            me.$message.info('取消订单成功');
            me.getOrderList();
          } else {
            me.$message.error('取消订单失败，请稍后重试~');
          }
        });
      });
    },
    batchCancel() {
      let me = this;
      me.$confirm('取消订单后该订单将直接作废且无法恢复，是否确认取消?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        me.$request.put('/api/admin/goods/updateOrderOrSendStatus', {
          orderIds: this.multipleSelection,
          isCancelOrder: true
        }).then(res => {
          if (res.code == 200) {
            me.$message.info('取消订单成功');
            me.getOrderList();
          } else {
            me.$message.error('取消订单失败，请稍后重试~');
          }
        });
      });
    },
    deleteOrder(row) {
      let me = this;
      me.$confirm('订单记录删除后无法恢复，是否确认删除?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        me.$request.delete('/api/admin/goods/deleteOrder', {
          data: {
            orderId: row.id
          }
        }).then(res => {
          if (res.code == 200) {
            me.$message.info('删除订单成功');
            me.getOrderList();
          } else {
            me.$message.error('删除订单失败，请稍后重试~');
          }
        });
      });
    },
    refundOrder(row) {
      this.model = row;
      this.form = {
        isAgree: true,
        refundIntegral: row.applyRefundIntegral,
        refundAmount: row.applyRefundAmount,
        refundDescribe: ''
      };
      this.refundDialogVisible = true;
    },
    batchRefund(isAgree) {
      this.$prompt('请输入审核意见', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.$request.put('/api/admin/goods/BatchRefundOrderByAdmin', {
          orderIds: this.multipleSelection,
          isAgree: isAgree,
          refundDescribe: value
        }).then(res => {
          if (res.code == 200) {
            this.$message.info('取消订单成功');
            this.getOrderList();
          } else {
            this.$message.error('取消订单失败，请稍后重试~');
          }
        });
      });
    },
    changeAgree(value) {
      if (value == false) {
        this.form.refundAmount = 0;
        this.form.refundIntegral = 0;
      } else {
        this.form.refundIntegral = this.model.applyRefundIntegral;
        this.form.refundAmount = this.model.applyRefundAmount;
      }
    },
    submitRefund() {
      this.refundDialogVisible = false;
      this.$request.put('/api/admin/goods/refundOrderByAdmin', Object.assign({
            orderId: this.model.id,
          }, this.form
      )).then(res => {
        if (res.code == 200) {
          this.$message.info('退款提交成功');
          this.getOrderList();
        } else {
          this.$message.error('退款提交失败，请稍后重试~');
        }
      });
    },
    postOrder(row) {
      this.postDialogVisible = true;
      this.model = row;
      this.postForm = {
        expressName: '',
        expressNo: ''
      };
    },
    submitPost() {
      if (!this.postForm.expressName) {
        this.$alert('内容不得为空', '提示', {
          confirmButtonText: '确定',
        });
        return
      }
      if (!this.postForm.expressNo) {
        this.$alert('内容不得为空', '提示', {
          confirmButtonText: '确定',
        });
        return
      }
      var reqDeliverGoods = {
        expressName: this.postForm.expressName,
        expressNo: this.postForm.expressNo,
        orderId: this.model.id
      }
      // console.log(reqDeliverGoods)
      this.$request.post('/api/admin/goods/order/deliverGoods', reqDeliverGoods).then(res => {
        if (res.code == 200) {
          this.postDialogVisible = false;
          this.getOrderList();
        } else {
          this.$message.error('信息提交失败，请稍后重试~');
        }
      })
    },
    viewRefund(row) {
      this.model = row;
      this.refundInfoDialogVisible = true;
    },

    //填写快递信息框
    //点击弹出框的取消按钮
    cancelClose() {
      this.dialogFormVisible = false;
      this.form = {
        name: '',
        orderNum: ''
      }
    }
  }
};
</script>

<style>
.title_bg {
  background-color: #44444475;
}

.el-form-item {
  margin-bottom: 10px !important;
}

.el-dialog {
  width: 35% !important;
  border: 1px solid #c3d3e1 !important;
}

.el-dialog__header {
  background-color: #409EFF;
}

.el-dialog__title {
  color: #fff;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}

.el-radio {
  margin-top: 14px;
}
</style>
