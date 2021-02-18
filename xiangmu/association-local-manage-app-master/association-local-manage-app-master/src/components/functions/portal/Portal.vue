<template>
  <el-container class="absolute-fill-parent flex flex-column flex-center">
    <div class="absolute-fill-parent website-pro-flex" v-if="moduleId=='branch'">
      <component v-for="(child) of module.modules" :is="child.name" :key="child.id" :module="child" />
    </div>
    <div class="absolute-fill-parent website-pro-flex direcol" v-else-if="homePageData">
      <div class="databox">
        <h3 class="parttitle">数据统计</h3>
        <div class="datamain">
          <div class="datasec">
            <div class="datarow1"><img src="@/assets/portal/xiaoyou.png" alt=""><span>校友</span></div>
            <div class="datarow2">
              <div>
                <p class="datacount">{{homePageData.memberInfo.activeMemberCount || 0}}/{{homePageData.memberInfo.memberTotal || 0}}</p>
                <p class="dataexplain">已激活校友/所有校友</p>
              </div>
              <div>
                <p class="datacount">{{homePageData.branchCount || 0}}</p>
                <p class="dataexplain">分会数量/个</p>
              </div>
              <div>
                <p class="datacount">{{homePageData.organizationCount || 0}}</p>
                <p class="dataexplain">入住校友企业/个</p>
              </div>
            </div>
          </div>

          <div class="datasec">
            <div class="datarow1"><img src="@/assets/portal/shangcheng.png" alt=""><span>商城</span></div>
            <div class="datarow2">
              <div>
                <p class="datacount">{{homePageData.goodsCount || 0}}</p>
                <p class="dataexplain">商品总数量/个</p>
              </div>
              <div>
                <p class="datacount">{{homePageData.orderInfo.completeTotal || 0}}/{{homePageData.orderInfo.orderTotal || 0}}</p>
                <p class="dataexplain">完成订单数/订单总数</p>
              </div>
              <div>
                <p class="datacount">{{homePageData.orderInfo.amount || 0}}</p>
                <p class="dataexplain">商品收入总额/元</p>
              </div>
            </div>
          </div>

          <div class="datasec">
            <div class="datarow1"><img src="@/assets/portal/huodong.png" alt=""><span>活动</span></div>
            <div class="datarow2">
              <div>
                <p class="datacount">{{homePageData.activityCount || 0}}</p>
                <p class="dataexplain">活动总数/个</p>
              </div>
              <div>
                <p class="datacount">{{homePageData.activityUserCount || 0}}</p>
                <p class="dataexplain">参加活动总人数</p>
              </div>
              <div>
                <p class="datacount">{{homePageData.guestCount || 0}}</p>
                <p class="dataexplain">活动嘉宾/个</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="centerbox">
        <div class="functionbox">
          <h3 class="parttitle">常用功能</h3>
          <ul class="btnlist">
            <li v-for="item in btnList" @click="item.clickHandle" :key="item.title">
              <img :src="item.icon" alt="">
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>

        <div class="functionbox">
          <h3 class="parttitle">待办事项</h3>
          <ul class="btnlist">
            <li v-for="item in todoList" :key="item.title" @click="item.clickHandle">
              <el-badge :hidden="homePageData[item.attr]==0" is-dot class="item">{{homePageData[item.attr] || 0}}</el-badge>
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="bottombox">
        <div class="functionbox">
          <h3 class="parttitle">知名校友<span @click="$router.push('/console/organization/member/memberMatch')">更多</span></h3>
          <ul class="alumnuslist">
            <li v-for="(item,index) in homePageData.famousAlumniList" :key="index">
              <img v-if="item.headImg" :src="item.headImg" alt="">
              <img v-else src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="">
              <div class="alumnusinfo">
                <h4>{{item.name}} <span v-if="item.post">{{item.post}}</span></h4>
                <p>{{item.workingCompany}}</p>
                <p><span>{{item.messageCount}}</span> 相关信息</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="functionbox">
          <h3 class="parttitle">校友地区分布</h3>
          <div class="mapbox">
            <div id="portalmap"></div>
            <div id="portalbar"></div>
          </div>
        </div>
      </div>

      <div class="fixedbox">小程序二维码 <img class="ewmtip" src="@/assets/portal/ewm.png" alt="">
        <div class="ewmbox">
          <img :src="ewmLink" alt="">
          <p>扫一扫，打开小程序</p>
          <div @click="downloadpic(ewmLink,'小程序码')">下载</div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
import WsCellContainer from "../tools/websitePro/js/modules/layout/wsCell/wsCellContainer";
import Vue from "vue";
import WsRow from "../tools/websitePro/component/modules/layout/portal/wsRow/WsRow";
import WsCol from "../tools/websitePro/component/modules/layout/portal/wsCol/WsCol";
import WsPortalNotice from "../tools/websitePro/component/modules/layout/portal/wsPortalNotice/WsPortalNotice";
import WsCellTitleContainer from "../tools/websitePro/component/modules/layout/portal/wsCellTitleContainer/WsCellTitleContainer";
import WsPortalButton from "../tools/websitePro/component/modules/layout/portal/wsPortalButton/WsPortalButton";
import WsPortalChart from "../tools/websitePro/component/modules/layout/portal/wsPortalChart/WsPortalChart";
import WsPortalRichText from "../tools/websitePro/component/modules/layout/portal/wsPortalRichText/WsPortalRichText";
import { SET_FROMHOMEPAGE } from "@/js/store/mutation-types";

import echarts from "echarts";
import "echarts/map/js/china.js";

export default {
  name: "Portal",
  components: {
    WsPortalRichText,
    WsPortalChart,
    WsPortalButton,
    WsCellTitleContainer,
    WsPortalNotice,
    WsCol,
    WsRow,
  },
  data() {
    var that = this
    return {
      module: new WsCellContainer({}),
      btnList: [
        {
          title: "合并重复校友",
          icon: require("@/assets/portal/btn1.png"),
          clickHandle(){
            that.$router.push('/console/examine/memberMerge')
          },
        },
        {
          title: "发布活动",
          icon: require("@/assets/portal/btn2.png"),
          clickHandle(){
            const {href} = that.$router.resolve({ path: '/addActivity' });
            window.open(href, '_blank')
          },
        },
        {
          title: "发布商品",
          icon: require("@/assets/portal/btn3.png"),
          clickHandle(){
            that.$store.commit(SET_FROMHOMEPAGE,"addGoods");
            that.$router.push('/console/tools/onlineMall/goodsManage')
          },
        },
        {
          title: "创建相册",
          icon: require("@/assets/portal/btn4.png"),
          clickHandle(){
            that.$store.commit(SET_FROMHOMEPAGE,"createAlbum");
            that.$router.push('/console/tools/album/manage')
          },
        },
        {
          title: "上传照片",
          icon: require("@/assets/portal/btn5.png"),
          clickHandle(){
            that.$store.commit(SET_FROMHOMEPAGE,"uploadPhoto");
            that.$router.push('/console/tools/album/manage')
          },
        },
        {
          title: "群发邮件",
          icon: require("@/assets/portal/btn6.png"),
          clickHandle(){
            that.$router.push('/console/organization/notice/sendEmail')
          },
        },
      ],
      todoList: [
        {
          title: "认证申请",
          attr:"approvalCount",
          clickHandle(){
            that.$router.push('/console/examine/memberInfoExamine')
          },
        },
        {
          title: "校友入会申请",
          attr:"branchApprovalCount",
          clickHandle(){
            that.$router.push('/console/organization/branchApprove')
          },
        },
        {
          title: "企业入会申请",
          attr:"applyCount",
          clickHandle(){
            that.$router.push('/console/organization/unitExamine')
          },
        },
        {
          title: "活动审核",
          attr:"activityApprovalCount",
          clickHandle(){
            that.$router.push('/console/tools/activityExamine')
          },
        },
        {
          title: "相册照片审核",
          attr:"photoApprovalCount",
          clickHandle(){
            that.$router.push('/console/tools/album/examine')
          },
        },
        {
          title: "待发货数量",
          attr:"goodWaitSendNum",
          clickHandle(){
            that.$router.push('/console/tools/onlineMall/goodsOrderManage')
          },
        },
        // {
        //   title: "智能客服留言数量",
        //   attr:"leavingMessage",
        //   clickHandle(){
        //     that.$router.push('/console/tools/onlineCounsel/commentList')
        //   },
        // },
      ],
      homePageData:null,
      ewmLink:""
    };
  },
  computed: {
    branchId() {
      return this.$store.state.branchId;
    },
    moduleId() {
      return this.branchId ? "branch" : "main";
    },
    isHasRow() {
      for (let module of this.module.modules) {
        let { name } = module;
        if (name === "wsRow") {
          return true;
        }
      }
      return false;
    },
    componentContainerStyle() {
      if (this.isHasRow) {
        return {
          flexDirection: "column",
        };
      }

      return {};
    },
  },
  created() {
    this.getModuleInfo();
    this.$request.get("/api/admin/homePage/getHomePageDate").then((res) => {
      this.homePageData = res.data;
      if(this.homePageData.famousAlumniList.length>5){
        this.homePageData.famousAlumniList = this.homePageData.famousAlumniList.slice(0,5)
      }
      this.$nextTick(()=>{
        this.initChart();
      })
    });
    this.$request.get("/api/admin/homePage/getWeiXinCode").then((res) => {
      this.ewmLink = res.data
    });
  },
  methods: {
    formatProvince($province){
      $province = $province.replace(/省$/, '');
      $province = $province.replace(/市$/, '');
      $province = $province.replace(/自治区$/, '');
      $province = $province.replace(/壮族$/, '');
      $province = $province.replace(/回族$/, '');
      $province = $province.replace(/维吾尔$/, '');
      $province = $province.replace(/特别行政区$/, '');
      return $province;
    },
    getModuleInfo() {
      if (this.moduleId=='branch') {
        this.$request
          .post("/api/common/designTemplate/portalInfo", {
            moduleId: this.moduleId,
          })
          .then((res) => {
            let { data } = res;
            let { templateConfig } = data;
            this.module = Vue.observable(
              new WsCellContainer(JSON.parse(templateConfig))
            );
          });
      }
    },
    initChart() {
      var data = this.homePageData.addressGroupCount.sort((a, b) => {
        return b.value - a.value;
      });
      let max = data[0].value;
      if(max <= 0){
        max = 2;
      }
      data.map(item=>item.name=this.formatProvince(item.name))
      var myChart = echarts.init(document.getElementById("portalmap"));
      var option = {
        visualMap: {
          min: 0,
          max: max,
          inRange: {
            color: ["#77C6D7","#2F7A8A"],
          },
          show: false,
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "white",
          axisPointer: {
            type: "shadow",
          },
          confine: true,
          padding: 10,
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
          textStyle: {
            color: "d0d0d0",
            fontSize: 12,
          },
          formatter: (param) => {
            let html = '暂无数据';
            if (param.data) {
              let value = param.data.value;
              if(Array.isArray(value)){
                value = param.data.value[2];
              }
              html = `${param.seriesName}<br/> ${param.name} :${value}（人）`;
            }
            return html;
          }
        },
        series: [
          {
            name: "校友分布",
            type: "map",
            mapType: "china",
            label: {
              normal: {
                show: true, //省份名称
              },
              emphasis: {
                show: false,
              },
            },
            data: data, //数据
          },
        ],
      };
      myChart.setOption(option);


      var myChart1 = echarts.init(document.getElementById("portalbar"));
      let title = "校友分布";
      let yData = [];
      let shadowData = [];
      let length = data.length>10?10:data.length;
      for (let j = 0; j < length; j++) {
        let item = data[j];
        yData.push(item.name);
      }
      var option1 = {
        backgroundColor: "transparent",
        grid: {
          // right: 20,
          // top: 20,
          bottom: 20,
          left:140
          // width: 180,
        },
        tooltip: {
          trigger: "item",
          formatter: (param) => {
            let html = "暂无数据";
            if (param.data) {
              let value = param.value;
              if (Array.isArray(value)) {
                value = param.value[2];
              }

              html = `${param.seriesName}<br/> ${param.name} :${value}（个）`;
            }
            return html;
          },
        },
        xAxis: { show: false },
        yAxis: {
          type: "category",
          inverse: true,
          nameGap: 16,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            margin: 60,
            textStyle: {
              color: "#101317",
              align: "left",
              fontSize: 12,
            },
          },
          data: yData,
        },
        series: [
          {
            name: title,
            type: "bar",
            barMaxWidth: 18,
            z: 2,
            itemStyle: {
              normal: {
                color: function (params) {
                  let { value, dataIndex } = params;
                  if (value > 0) {
                    if (dataIndex < 3) {
                      return "#2F7A8A";
                    } else if(dataIndex < 7){
                      return "#3FA1B6";
                    }else{
                      return "#E5EDF0"
                    }
                  }
                },
              },
            },
            label: {
              normal: {
                show: true,
                color:"#919DA9",
                position: 'right',
                formatter(params) {
                  let { value } = params;
                  if (value) {
                    return value;
                  } else {
                    return "";
                  }
                },
              },
            },
            data: data,
          },
        ],
      };
      myChart1.setOption(option1);
      window.addEventListener("resize", function () {
        myChart.resize();
        myChart1.resize();
      });

    },

    downloadpic(imgsrc,name){
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    }
  },
  watch: {
    moduleId() {
      this.getModuleInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.direcol {
  flex-direction: column;
  .databox {
    flex-shrink: 0;
    height: 180px;
    margin: 15px 15px 0;
    background: #ffffff;
    border-radius: 6px;
    padding: 0 12px;
    .datamain {
      display: flex;
      margin-top: 23px;
      padding-left: 4px;
      .datasec {
        box-sizing: border-box;
        width: 33.333%;
        height: 82px;
        padding-left: 22px;
        border-left: 1px dashed #e8e8e8;
        .datarow1 {
          font-size: 0;
          img {
            width: 24px;
            height: 24px;
            vertical-align: top;
          }
          span {
            font-size: 14px;
            color: #555555;
            display: inline-block;
            line-height: 24px;
            margin-left: 8px;
          }
        }
        .datarow2 {
          margin-top: 17px;
          display: flex;
          div {
            width: 33.333%;
            box-sizing: border-box;
            padding-right: 10px;
            .datacount {
              font-size: 18px;
              color: #222222;
              line-height: 20px;
            }
            .dataexplain {
              font-size: 12px;
              color: #888888;
              line-height: 17px;
              margin-top: 11px;
            }
          }
        }
      }
      .datasec:first-child {
        padding-left: 0;
        border-left: 0;
      }
    }
  }
  .parttitle {
    font-size: 16px;
    color: #222222;
    line-height: 44px;
    border-bottom: 1px solid #f7f7f7;
    display: flex;
    justify-content: space-between;
    span {
      cursor: pointer;
      color: #c6c6c6;
      font-size: 12px;
    }
  }

  .centerbox {
    display: flex;
    margin: 15px;
    height: 200px;
    // flex-shrink: 0;
    .functionbox {
      background: #ffffff;
      border-radius: 6px;
      width: 50%;
      padding: 0 12px;
      .btnlist {
        display: flex;
        // margin-top: 39px;
        height: calc(100% - 45px );
        justify-content: space-around;
        align-items: center;
        li {
          text-align: center;
          cursor: pointer;
          img {
            width: 50px;
            height: 50px;
          }
          p {
            font-size: 14px;
            color: #555555;
            line-height: 28px;
          }
        }
      }
    }
    .functionbox:last-child {
      margin-left: 15px;
      div {
        font-size: 22px;
        color: #222222;
        line-height: 26px;
        margin: 12px 0;
      }
    }
  }
  .bottombox {
    flex: 1;
    margin: 0 15px 15px;
    display: flex;
    min-height: 260px;
    flex-shrink: 0;
    .functionbox {
      height: 100%;
      background: #ffffff;
      border-radius: 6px;
      width: 28%;
      min-width: 240px;
      padding: 0 12px;
      .alumnuslist {
        height: calc(100% - 47px);
        overflow: auto;
        li {
          display: flex;
          margin-left: 5px;
          margin-top: 13px;
          img {
            width: 62px;
            height: 62px;
            border-radius: 50%;
            flex-shrink: 0;
          }
          .alumnusinfo {
            margin-left: 13px;
            h4 {
              font-size: 14px;
              color: #222222;
              line-height: 20px;
              margin-bottom: 2px;
              display: flex;
              span{
                font-size: 12px;
                line-height: 20px;
                background: #FAEEDD;
                border-radius: 2px;
                color: #ECA038;
                margin-left: 13px;
                padding: 0 2px;
              }
            }
            p {
              font-size: 12px;
              line-height: 22px;
              color: #c6c6c6;
              span {
                color: #ff9d00;
              }
            }
          }
        }
      }
    }

    .functionbox:last-child {
      margin-left: 15px;
      width: 72%;
      // width: 100%;
      .mapbox {
        height: calc(100% - 60px);
        display: flex;
        #portalmap {
          width: 60%;
          height: 100%;
        }
        #portalbar {
          flex: 1;
          margin-left: 15px;
          height: 100%;
          // height: 1000px;
        }
      }
    }
  }

  .fixedbox{
    padding: 7px;
    box-sizing: border-box;
    width: 35px;
    // height: 119px;
    background: #FFFFFF;
    box-shadow: 0px 0px 3px 1px rgba(214, 214, 214, 0.68);
    border-radius: 5px 0px 0px 5px;
    position: fixed;
    right: 0;
    top: 170px;
    font-size: 12px;
    color: #3FA1B6;
    text-align: center;
    line-height: 14px;
    .ewmtip{
      width: 20px;
      height: 20px;
      margin-top: 3px;
    }
    .ewmbox{
      display: none;
      padding-top: 16px;
      box-sizing: border-box;
      position: absolute;
      width: 160px;
      height: 205px;
      right: 0;
      top: -43px;
      background: #FFFFFF;
      box-shadow: 0px 0px 3px 1px rgba(214, 214, 214, 0.68);
      border-radius: 5px 0px 0px 5px;
      text-align: center;
      img{
        width: 100px;
        height: 100px;
      }
      p{
        font-size: 12px;
        color: #222222;
        line-height: 15px;
        margin-top: 14px;
        margin-bottom: 19px;
      }
      div{
        width: 99px;
        height: 26px;
        background: #6CB7C7;
        text-align: center;
        color: white;
        line-height: 26px;
        margin: 0 auto;
        cursor: pointer;
      }
    }
  }
  .fixedbox:hover{
    .ewmbox{
      display: block;
    }
  }
}
</style>
