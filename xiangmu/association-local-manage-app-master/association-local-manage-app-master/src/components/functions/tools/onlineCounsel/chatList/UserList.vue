<template>
  <el-container class="absolute-fill-parent">
    <el-header style="padding-top: 14px;borderBottom:1px solid #e8e8e8;">
      <div class="leftHeader">
        <el-popover placement="right-start" width="300" trigger="hover">
          <div class="accountSetTop">
            <div style="marginRight:50px;">在线状态</div>
            <div class="switchState">
              <div style="marginRight:15px;display:flex;alignItem:center;">
                <span class="stateShow" :style="{'backgroundColor':customServiceState?'green':'red'}"></span>
                <span>{{customServiceState?'在线':'隐藏'}}</span>
              </div>
              <el-switch v-model="customServiceState"></el-switch>
            </div>
          </div>
          <img src="https://tenant-assets.meiqiausercontent.com/static-files/default-avatar.jpg" style="width:38px;height:38px;borderRadius:50%;cursor: pointer;" slot="reference" />
        </el-popover>
        <div class="accoutState" :style="{'backgroundColor':customServiceState?'green':'red'}"></div>
      </div>
    </el-header>
    <el-main class="position-relative unset-padding mainSet">
      <div class="leftListHeader">
        <div style="display:flex;">
          <div class="leftListHeaderItem" @click="selectSort(0)" :style="{'color':selectSortItem===0?'rgba(4, 15, 66, 0.9)':'rgba(4, 15, 66, 0.3)'}">我的</div>
          <div class="leftListHeaderItem" @click="selectSort(1)" :style="{'color':selectSortItem===1?'rgba(4, 15, 66, 0.9)':'rgba(4, 15, 66, 0.3)'}">机器人</div>
          <div class="leftListHeaderItem" @click="selectSort(2)" :style="{'color':selectSortItem===2?'rgba(4, 15, 66, 0.9)':'rgba(4, 15, 66, 0.3)'}">同事</div>
        </div>
        <el-popover placement="right" width="200" trigger="click" v-model="visible">
          <div v-if="colleagueServiceInfo.length>0">
            <div style="borderBottom:1px solid #ccc;padding:5px 0;">选择同事列表</div>
            <el-checkbox-group v-model="selectColleague" style="minHeight:100px;" @change="selectcolItem">
              <el-checkbox :label="item.adminName" v-for="item in colleagueServiceInfo" :key="item.adminId" style="padding:7px 0;display:block;"></el-checkbox>
            </el-checkbox-group>
            <div style="borderTop:1px solid #ccc;padding:5px 0;">
              <el-checkbox style="marginRight:25px;" :indeterminate="isIndeterminate" v-model="selectAll" @change="selectAllCol">全选</el-checkbox>
            </div>
          </div>
          <div v-else>暂无在线同事</div>
          <el-button type="text" slot="reference" @click="selectColleagueClick" class="leftListHeaderItem" v-if="selectSortItem===2" width="800" height="400">选择</el-button>
        </el-popover>
      </div>
      <vue-scroll>
        <div class="user-box cursor-pointer flex position-relative" style="width:300px;" :class="{activeItem:item.userId === selectItem.userId}" v-for="item in serviceList" :key="item.id" @click="checkedUser(item)">
          <div style="padding: 15px;">
            <el-avatar v-if="item.userStatus" icon="iconfont icon-zaixian" style="backgroundColor:#409eff"></el-avatar>
            <el-avatar v-else icon="iconfont icon-buzaixian"></el-avatar>
          </div>
          <div class="flex-fill-in-the-remaining-space" style="padding: 10px 0;">
            <div style="display:flex;justifyContent: space-between;">
              <p style="font-size: 14px;color: #999;line-height: 26px;">{{item.userId}}</p>
              <p v-if="item.content.type===1" style="font-size: 12px;color: #999999;line-height: 26px;marginRight:15px;">{{item.content.chatTime | HHmmss}}</p>
              <p v-else style="font-size: 12px;color: #999999;line-height: 26px;marginRight:15px;">{{item.content.createTime | HHmmss}}</p>
            </div>
            <div>
              <!-- 如果超时，就会展示下面的这句话 -->
              <!-- <span></span> -->
              <!-- 这是本条会话的最新一条信息 -->
              <div style="fontSize:14px;color:#333;">
                <!-- 图片模板 -->
                <div v-if="item.content.imageUrl&&item.content.imageUrl.length>0">
                  <span class="contentText">
                    <span class="contentText">【图片】</span>
                  </span>
                </div>
                <!-- 文字表情模板 -->
                <div>
                  <span v-for="(content,num) in item.content.content.split(':;')" :key="num" class="contentText">
                    <span v-if="/^#/.test(content)" class="contentText">
                      <svg class="icon" aria-hidden="true" style="font-size:24px;margin:0 5px;">
                        <use :xlink:href="content" />
                      </svg>
                    </span>
                    <span v-else class="contentText">{{content}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vue-scroll>
    </el-main>
  </el-container>
</template>

<script>
import "./icon/iconfont.css";
import "./faceIcon/iconfont.js";
import iconFontList from "./faceIcon/iconFontList.js";
//导入webSocket
import socket from "./mixins/stomp";
export default {
  name: "UserList",
  mixins: [socket],
  data() {
    return {
      serviceList: [], //回话列表
      selectSortItem: 0, //选中的展示类型，默认是'我的'
      customServiceState: true, //客服在线状态：false表示隐身；true表示在线
      timer: null, //定时器
      myServiceInfo: {},
      computerServiceInfo: {},
      colleagueServiceInfo: [],
      iconFontList, //表情列表
      selectColleague: [], //选中的同事的adminId列表---用于发起请求
      selectAll: false, //同事全选
      visible: false, //在线同事列表展示框是否展示
      selectItem: {userId:""}, //点击的对话信息
      isIndeterminate: true, //表示全选按钮的状态的不确定性
    };
  },
  watch: {
    //监听同事选择结果
    selectColleague(val) {
      this.selectSort(2);
    },
    userListSearch(val) {
      this.$emit("searchList", val);
    },
    customServiceState(val) {
      var status = 1;
      if (!val) {
        status = 2;
        clearInterval(this.timer);
        this.timer = null
      } else {
        this.timer = setInterval(() => {
          this.$request
            .put("/api/admin/message/deliveryCustomerOnlineStatus", {
              adminId: this.myServiceInfo.adminId
            })
            .then(res => {
              // console.log(res);
            });
        }, 30000);
      }
      this.$request.put("/api/admin/message/updateOnlineCustomerStatus?status=" + status).then((res) => {});
    },
  },
  beforeDestroy() {
    console.log("清除定时器");
    clearInterval(this.timer);
    this.timer = null
  },
  methods: {
    connectSocket(){
      // this.customServiceState = true;
      this.getServiceInfo(true);
    },
    //获取所有客服的信息
    getServiceInfo(ifInitialization) {
      this.$request.get("/api/admin/message/getOnlineServiceList").then((res) => {
        this.myServiceInfo = JSON.parse(JSON.stringify(res.data.myself));
        this.computerServiceInfo = JSON.parse(JSON.stringify(res.data.robot));
        this.colleagueServiceInfo = JSON.parse( JSON.stringify(res.data.colleague) );
        if (ifInitialization) {
          //获取到信息后要获取“我的”会话
          this.selectSort(0);
        }
      });
    },
    //选择当前展示的对话类别
    selectSort(data) {
      this.selectSortItem = data;
      var arr = [];
      if (data === 0) {
        arr.push(this.myServiceInfo.adminId);
      } else if (data === 1) {
        arr.push(this.computerServiceInfo.adminId);
      } else {
        var arr_1 = this.selectColleagueList();
        arr.push(...arr_1);
      }
      this.$request.post("/api/admin/message/getChatServiceUserList", { ids: arr }).then((res) => {
        this.serviceList = JSON.parse(JSON.stringify(res.data));
        if (!this.serviceList || this.serviceList.length === 0) {
          return false;
        }
        this.serviceList.forEach((item, index) => {
          item.content = JSON.parse(item.content);
          if (item.content.flag === 0) {
            item.content.content = "无法识别您的问题，请转接人工或拨打人工热线：82335553，或者给我们";
          } else if (item.content.flag === 3) {
            item.content.content = "数据库中暂无此类问题~";
          } else if (item.content.flag === 2) {
            item.content.content = "您是否想要咨询以下问题:";
          } else if (item.content.flag === 1) {
            item.content.content = item.content.answer.externalAnswers?item.content.answer.externalAnswers:item.content.answer.insideAnswers;
          }
        });
        //进行排序---下线的会话要放置到会话列表的下面
        var arr_3 = [];
        var arr_4 = [];
        this.serviceList.forEach((item) => {
          if (item.userStatus === 0) {
            arr_3.push(item);
          } else {
            arr_4.push(item);
          }
        });
        this.serviceList = arr_4.concat(arr_3);
        // if(this.serviceList.length>0){
        //   this.checkedUser(this.serviceList[0])
        // }
      });
    },
    //选择同事的数据列表处理
    selectColleagueList() {
      var that = this;
      var info = [];
      this.selectColleague.forEach((item) => {
        that.colleagueServiceInfo.some((colleage) => {
          if (colleage.adminName === item) {
            info.push(colleage.adminId);
            return true;
          }
        });
      });
      return info;
    },
    //选中会话
    checkedUser(item) {
      this.$store.commit('SET_NOW_CHAT',item.userId);
      this.$emit("checkedUser", item, true);
      this.$set(item, "noReadCount", 0);
      this.selectItem = JSON.parse(JSON.stringify(item));
    },
    //点击选择按钮---选择在线同事
    selectColleagueClick() {
      this.visible = !this.visible;
      //更新在线同事列表信息
      this.getServiceInfo(false);
    },
    //webSocket监控信息更新
    updateInfo(data) {
      //对当前展示的回话列表进行更新
      var info = JSON.parse(data.msgData);
      this.$emit("setStompMessage",data)
      // console.log(data, info);
      var aaa = false;
      //会话断开
      if (info.status === 3) {
        aaa = true;
      }
      //会话移除、断开、连接或者聊天内容更新的情况---判断是否是当前展示的会话列表中的会话
      this.serviceList.some((item) => {
        if (item.id === info.id) {
          aaa = true;
        }
      });
      //会话新增情况---判断更新的会话是否是当前账号的
      if ( info.adminId === this.myServiceInfo.adminId && this.selectSortItem === 0 ) {
        aaa = true;
      }
      //会话新增情况---当前展示的是机器人会话，新增的也是机器人账号
      if (info.adminId === "customer" && this.selectSortItem === 1) {
        aaa = true;
      }
      //会话新增情况---当前展示的是同事会话，新增的也是同事的会话
      var arr = this.selectColleagueList();
      if (arr.indexOf(info.adminId) >= 0 && this.selectSortItem === 2) {
        aaa = true;
      }
      if (aaa) {
        this.selectSort(this.selectSortItem);
      }
      //对右边的对话框的处理---当前点击的会话发生移除或新增到其他地方时（对这里来说是同一种情况）。对话框信息不展示---也就是右边的对话框隐藏
      if (this.selectItem.id === info.id && info.status === 2) {
        this.$emit("checkedUser", {}, false);
      }
    },
    //选择同事
    selectcolItem() {
      this.selectSort(2);
      if (this.selectColleague.length === this.colleagueServiceInfo.length) {
        this.isIndeterminate = false;
        this.selectAll = true;
      } else {
        this.isIndeterminate = true;
        this.selectAll = false;
      }
    },
    //点击全选按钮，选中所有同事
    selectAllCol(val) {
      // console.log(val);
      if (val) {
        this.colleagueServiceInfo.forEach((item) => {
          this.selectColleague.push(item.adminName);
          this.isIndeterminate = false;
        });
      } else {
        this.selectColleague = [];
        this.isIndeterminate = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.leftHeader {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  align-items: center;
  position: relative;
  .accoutState {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: 27px;
    left: 27px;
  }
}
.accountSetTop {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 10px 25px;
  align-items: center;
  .switchState {
    display: flex;
    font-size: 12px;
    line-height: 12px;
    align-items: center;
    .stateShow {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
.leftListHeader {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  box-shadow: 0 2px 8px 0 #f4f6fb;
  .leftListHeaderItem {
    font-size: 14px;
    padding: 5px 7px;
    cursor: pointer;
    color: black;
  }
}
.mainSet::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.activeItem {
  background-color: #e6f5ff;
  border-right: 3px solid #1880ff;
  box-sizing: border-box;
}
// 这是引用svg图标时初始化的CSS样式
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
// -------------
.contentText {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // word-break: keep-all;
  padding-right: 15px;
  width: 200px;
  display: block;
}
</style>
