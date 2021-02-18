<template>
  <div class="absolute-fill-parent" style="backgroundColor:#f3f4f8;">
    <div class="chatTop">
      <!-- 将“我的”会话转接给“同事”---需要选择具体的同事 -->
      <el-popover placement="right" width="200" v-model="visible">
        <!-- 将“我的”会话转接给“同事” -->
        <div v-if="myServiceInfo.adminId===userInfo.adminId">
          <!-- 有同事的时候 -->
          <div v-if="colleagueServiceInfo.length>0">
            <div style="paddingBottom:5px;marginBottom:5px;">请选择要转接给的同事：</div>
            <el-radio-group v-model="selectColleage" style="display:block;">
              <el-radio v-for="item in colleagueServiceInfo" :key="item.adminId" :label="item.adminId" style="padding:5px 0;display:block;">{{item.adminName}}</el-radio>
            </el-radio-group>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="closeTurnChatTo">取消</el-button>
              <el-button type="primary" size="mini" @click="turnChatTo">确定</el-button>
            </div>
          </div>
          <!-- 没有同事的时候 -->
          <div v-else>暂无在线同事</div>
        </div>
        <!-- 将“同事”的会话转接给“我的” -->
        <div v-else>
          <div>确定要将此会话转接到当前账号上吗？</div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="closeTurnChatTo">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmTurn">确定</el-button>
          </div>
        </div>
        <el-button type="text" v-if="userInfo.adminId!=='customer'" style="padding:0 25px;;cursor:pointer;border:none;color:black;" slot="reference">转接</el-button>
      </el-popover>
      <!--  -->

      <!-- 将“同事”的会话转接给“我的”---没有列表，只能转接给账号本身 -->
      <!-- <el-popconfirm title="确定要将此会话转接到当前账号上吗？" v-else @onConfirm="confirmTurn">
        <el-button
          slot="reference"
          type="text"
          v-if="userInfo.adminId!=='customer'"
          style="padding:0 25px;;cursor:pointer;border:none;color:black;"
        >转接</el-button>
      </el-popconfirm> -->
      <!--  -->

      <div v-if="userInfo.adminId===myServiceInfo.adminId" style="padding:0 25px;borderLeft:1px solid rgb(178, 178, 178);cursor:pointer;" @click="closeChat">结束</div>
    </div>

    <div class="chatRecords" ref="middleChatList">
      <div v-if="hasHistoryList&&moreHistory" class="getHistoryInfo" @click="getHistoryInfo(false)" style="cursor:pointer;">点击加载更多历史消息</div>
      <div v-if="hasHistoryList&&!moreHistory" class="getHistoryInfo">没有更多消息了</div>
      <div ref="msgContainer">
        <template v-for="(item,index) in list">
          <!-- 右边 -->
          <div class="chatItem" :key="index" v-if="item.type===1">
            <div v-if="(item.flag===4)&&hasHistoryList" class="historyContent">------ 以上为历史内容 ------</div>
            <div class="chatItemTop-left">
              <span style="float: right;fontSize:12px;lineHeight:16px;">{{item.chatTime | MMddHHmmss}}</span>
            </div>
            <!-- PC端模板 -->
            <span class="chatItemText-left">
              <div style="padding: 10px 15px;">
                <!-- 机器人客服 -->
                <div v-if="item.flag===0">
                  {{item.text}}
                  <span style="color:rgb(121, 201, 192);cursor: pointer;">留言</span>
                </div>
                <div v-if="[2,3,4].indexOf(item.flag)>=0">{{item.text}}</div>
                <!-- 答案 -->
                <div v-if="item.flag===1">{{item.answer.insideAnswers}}</div>
                <!-- 相关问题 -->
                <div class="answerList" v-if="(item.flag===1||item.flag===2)&&item.question.length>0">
                  <div style="color:rgb(170, 170, 170)" v-if="item.flag!==2">相关问题：</div>
                  <ul>
                    <li v-for="(question,index) in item.question" :key="index" style="margin:5px 0;color:green;">
                      {{(index+1)+'. '}}
                      <a href="javascript:;" style="color:green;">{{question}}</a>
                    </li>
                  </ul>
                </div>
                <!-- 人工客服--文本及带表情的文本 -->
                <div v-if="item.flag===5">
                  <span v-for="(content,num) in item.content.split(':;')" :key="num">
                    <span v-if="/^#/.test(content)">
                      <svg class="icon" aria-hidden="true" style="font-size:24px;margin:0 5px;">
                        <use :xlink:href="content" />
                      </svg>
                    </span>
                    <span v-else>{{content}}</span>
                  </span>
                </div>
                <!-- 图片模板 -->
                <div v-if="item.flag===6">
                  <a :href="item.imageUrl" target="_blank">
                    <img :src="item.imageUrl" width="200" />
                  </a>
                </div>
              </div>
            </span>
          </div>
          <!-- 左边 -->
          <div class="chatItem" :key="index" v-if="item.type===0">
            <div class="chatItemTop-right">
              <span style="float: left;">{{item.createTime | MMddHHmmss}}</span>
            </div>
            <!-- PC端模板 -->
            <div class="chatItemText-right" :style="{padding:(item.imageUrl&&item.imageUrl.length>0)?'0':'10px 15px'}">
              <!-- 图片模板 -->
              <div v-if="item.imageUrl&&item.imageUrl.length>0">
                <a :href="item.imageUrl" target="_blank">
                  <img :src="item.imageUrl" width="200" />
                </a>
              </div>
              <!-- 文字表情模板 -->
              <div v-else>
                <span v-for="(content,num) in item.content.split(':;')" :key="num">
                  <span v-if="/^#/.test(content)">
                    <svg class="icon" aria-hidden="true" style="font-size:24px;margin:0 5px;">
                      <use :xlink:href="content" />
                    </svg>
                  </span>
                  <span v-else>{{content}}</span>
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="chatInput position-absolute" id="sendMessage">
      <div class="faceIcon" v-if="faceIconShow">
        <ul class="iconFontList">
          <li class="iconFontItem" v-for="(item,index) in iconFontList" :key="index" @click="selectFaceIcon(item)">
            <svg class="icon" aria-hidden="true" style="font-size:24px;">
              <use :xlink:href="item" />
            </svg>
          </li>
        </ul>
      </div>
      <div class="replayState">
        <div class="replayItem">
          <div @click="selectState(0)" :class="{selectReplayState:replayState===0}">回复</div>
          <!-- <div @click="selectState(1)" :class="{selectReplayState:replayState===1}">内部回复</div> -->
          <div @click="selectState(2)" :class="{selectReplayState:replayState===2}">匿名回复</div>
        </div>
        <div class="replayMore">
          <i class="iconfont icon-smile" @click="faceIconShow=!faceIconShow"></i>
          <!-- 文件的图标先隐藏，后续考虑是否增加文件发送功能 -->
          <!-- <i class="iconfont icon-lc-drive-o"></i> -->
          <el-upload class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess">
            <i class="iconfont icon-comiistupian"></i>
          </el-upload>
          <!-- <i class="iconfont icon-dianzan"></i> -->
        </div>
      </div>
      <div ref="replayBorder" class="replayBox">
        <textarea rows="3" class="chatMsg" placeholder="请在这里输入咨询内容(500字以内)" v-model="content" maxlength="500" @keydown.enter="sendMsg" id="teatAreaBox"></textarea>
        <el-button size="small" type="primary" @click="sendMsg" class="sendBtn" :disabled="ifSend">发送 | Enter</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { stompURL } from "../../../../../js/config/serviceConfig";
import { requestBaseUrl } from "../../../../../js/config/serviceConfig";
import "./icon/iconfont.css";
import "./faceIcon/iconfont.js";
import iconFontList from "./faceIcon/iconFontList.js";
import { addListener, removeListener } from "resize-detector";
export default {
  name: "MessageList",
  props: ["checkedUserInfo","stompMessage"],
  data() {
    return {
      list: [], //信息列表
      userInfo: {}, //用户信息
      msgContainerHeight: 0,
      content: "", //发送的消息
      ifSend: false, //发送按钮是否禁用
      replayState: 0, //回复状态：0表示直接回复；1表示内部回复；2表示匿名回复
      faceIconShow: false, //表情是否展示
      iconFontList: iconFontList, //表情数据
      action: requestBaseUrl + "/api/common/anon/uploadFile", //上传图片及文件的地址
      hasHistoryList: false, //是否有历史记录---判断是否曾经咨询过问题
      limit: 10, //分页效果的每页条数
      offset: 0, //分页效果的页码---默认为1，因为页面中会一直展示最新1页的数据
      ifGetHistory: false, //是否去获取历史记录，是的话，展示信息不再进行截取
      number: 1, //历史记录获取的次数，默认从第一次获取
      total: 0, //历史纪录的总条数
      moreHistory: true, //是否还能获取历史记录
      hasHistoryList: false, //是否有历史记录---判断是否曾经咨询过问题
      myServiceInfo: "", //当前等用账号的id信息---用于发送请求时使用
      colleagueServiceInfo: [], //当前在线同事的信息集合
      stomp: null, //单独页面上的webSocket对象
      selectColleage: "", //要转接的同事的adminId
      visible: false, //转接框是否展示
      stomp_two: null, //socket对象
    };
  },
  watch: {
    //用于在切换用户时，重新获取消息列表
    checkedUserInfo(val) {
      this.userInfo = val;
      //创建对应会话的连接
      // this.stompInit();
      //获取历史记录的总条数---用于后续获取历史记录时计算偏移量offset
      var that = this;
      var params={
        limit:1,
        offset:0,
        id:val.id,
        userId:val.userId
      }
      this.$request
        .get(
          "/api/admin/message/getChatRecord",{params}
        )
        .then(res => {
          // console.log(res);
          that.total = res.data.total;
          if (res.data.total > 0) {
            that.hasHistoryList = true;
          } else {
            that.hasHistoryList = false;
          }
          //初始化
          this.list = [];
          this.limit = 10;
          this.offset = 0;
          this.ifGetHistory = false;
          this.number = 1;
          this.moreHistory = true;
          that.getHistoryInfo(true);
        });
      //断开之前的连接，并创建新的连接
    },
    stompMessage(val){
      if(val&&val.msgData&&this.userInfo.id==JSON.parse(val.msgData).id){
        var obj = val;
        obj.msgData = JSON.parse(val.msgData).content
        this.updateInfo(obj)
      }
    },
    content(val) {
      if (val === "") {
        this.ifSend = true;
      } else {
        this.ifSend = false;
      }
    },
    replayState(val) {
      if (val === 0) {
        this.$refs.replayBorder.style.border = "1px solid #fff";
      } else if (val === 1) {
        this.$refs.replayBorder.style.border = "1px solid #ffe1a8";
      } else {
        this.$refs.replayBorder.style.border = "1px solid #89e8c4";
      }
    },
    //当转接框展示时，要发起请求，获取同事列表
    visible(val) {
      if (val) {
        //  console.log(111);
        this.getMyId();
      }
    },
  },
  created() {
    if (this.content === "") {
      this.ifSend = true;
    }
    this.getMyId();
  },
  mounted() {
    addListener(this.$refs.msgContainer, this.msgContainerResize);
    //断开之前的webSocket连接
    if (window.stomp_two) {
      console.log("清除之前的连接");
      window.stomp_two.disconnect();
    }
  },
  beforeDestroy() {
    removeListener(this.$refs.msgContainer, this.msgContainerResize);
    if (window.stomp_two) {
      console.log("断开连接");
      window.stomp_two.disconnect();
    }
  },
  methods: {
    //获取当前账号的id信息
    getMyId() {
      this.$request.get("/api/admin/message/getOnlineServiceList").then((res) => {
        this.myServiceInfo = JSON.parse(JSON.stringify(res.data.myself));
        this.colleagueServiceInfo = JSON.parse( JSON.stringify(res.data.colleague) );
      });
    },
    //创建webSocket连接
    stompInit() {
      let self = this;
      let stomp = new Socket(stompURL + "/stomp", "10000", "10000");
      window.stomp_two = stomp;
      stomp.on("/topic/" + self.userInfo.id, function (message) {
        console.log(message)
        self.updateInfo(message);
      });
      stomp.onClose(function (e) {
        console.log("会话断线了");
        // self.closeSocket();
      });
      stomp.onOpen(function (e) {
        console.log("会话建立连接");
        // self.connectSocket();
      });
    },
    //监听的会话接收到消息
    updateInfo(data) {
      var info = JSON.parse(data.msgData);
      console.log(info)
      this.$request.put('/api/admin/message/onlineMessageListCall',{userId:info.sendName});
      this.$store.commit('SET_NOW_CHAT',info.sendName);
      if (info.flag === 0) {
        info.text = "无法识别您的问题，请转接人工或拨打人工热线：82335553，或者给我们";
      } else if (info.flag === 3) {
        info.text = "数据库中暂无此类问题~";
      } else if (info.flag === 2) {
        info.text = "您是否想要咨询以下问题:";
      }
      this.list.push(info);
      this.scrollBottom();
    },
    //滚动条滚动方法
    scrollBottom() {
      var that = this;
      this.$nextTick(() => {
        var heightLong = this.$refs.middleChatList.scrollHeight; //总长
        var scrollLong = this.$refs.middleChatList.scrollTop; //当前滚动条的位置
        var scrollHeight = heightLong - scrollLong; //滚动条需要向下滚动的距离
        var scrollSize = scrollHeight / timeLong; //滚动条每次增加的距离；
        var num = 0; //滚动条向下递进的次数
        if (that.$refs.middleChatList.scrollTo) {
          var timeLong = 120; //滚动的总时长
          var timer = setInterval(() => {
            num++;
            if (num == timeLong + 1) {
              clearInterval(timer);
            } else {
              that.$refs.middleChatList.scrollTo(
                0,
                that.$refs.middleChatList.scrollHeight + scrollHeight / timeLong
              );
            }
          }, 1);
        } else {
          var timeLong = 50; //滚动的总时长
          var timer = setInterval(() => {
            num++;
            if (num == timeLong + 1) {
              clearInterval(timer);
            } else {
              that.$refs.middleChatList.scrollTop =
                that.$refs.middleChatList.scrollTop + scrollHeight / timeLong;
            }
          }, 1);
        }
      });
    },
    msgContainerResize() {
      let height = this.$refs.msgContainer.clientHeight;
      if (this.msgContainerHeight > 0) {
        this.$refs.middleChatList.scrollTo(
          {
            y: height - this.msgContainerHeight,
          },
          0
        );
      }
    },
    //获取历史消息列表
    getHistoryInfo(ifbottom) {
      var OldHeight = this.$refs.middleChatList.scrollHeight;
      var limit = this.limit;
      this.offset = this.total - this.limit * this.number;
      let offset = 0;
      if (this.offset >= 0) {
        offset = this.offset;
      } else {
        offset = 0;
        this.moreHistory = false;
      }
      var that = this;
      this.ifGetHistory = true;
      var params={
        limit,
        offset,
        id:that.userInfo.id,
        userId:that.userInfo.userId
      }
      this.$request
        .get(
          "/api/admin/message/getChatRecord",{params}
        )
        .then((res) => {
          that.number++;
          var arr = res.data.list;
          //   console.log(arr)
          var arr_1 = arr.map((item) => {
            var msg = JSON.parse(item);
            if (msg.flag === 0) {
              msg.text =
                "无法识别您的问题，请转接人工或拨打人工热线：82335553，或者给我们";
            } else if (msg.flag === 3) {
              msg.text = "数据库中暂无此类问题~";
            } else if (msg.flag === 2) {
              msg.text = "您是否想要咨询以下问题:";
              //   msg.text = "";
            }
            msg.history = true;
            return msg;
          });
          //   console.log(arr_1);
          this.list.unshift(...arr_1);
          //要将滚动条滚动到之前的位置
          this.$nextTick(() => {
            if (ifbottom) {
              that.scrollBottom();
            } else {
              var newHeight = that.$refs.middleChatList.scrollHeight;
              that.$refs.middleChatList.scrollTo(0, newHeight - OldHeight);
            }
          });
        });
    },
    //消息回复
    sendMsg() {
      if (this.replayState === 0) {
        var sender = this.myServiceInfo.adminId;
      } else if (this.replayState === 1) {
        //内部回复，先不处理
      } else {
        var sender = this.userInfo.adminId;
      }
      var obj = {
        chatTime: Date.now(),
        type: 1,
        flag: 5,
        content: this.content,
        id: this.userInfo.id,
        sender: sender,
      };
      this.list.push(obj);
      this.scrollBottom();
      this.$request
        .post("/api/admin/message/sendMessageToUser", obj)
        .then((res) => {
          // console.log(res);
          if (res.success) {
            this.content = "";
            // this.getHistoryInfo(true);
          }
        });
    },
    //切换回复状态
    selectState(data) {
      this.replayState = data;
    },
    //选中表情
    selectFaceIcon(val) {
      this.content = this.content + ":;" + val + ":;";
      this.faceIconShow = false;
    },
    //发送图片
    handleAvatarSuccess(response, file, fileList) {
      var imageUrl = file.response.data;
      //发送并展示图片内容
      this.content = ""; //逻辑设定---发送图片或文件时，默认不能发送消息
      var obj = {
        chatTime: Date.now(),
        type: 1,
        flag: 6,
        id: this.userInfo.id,
        sender: this.myServiceInfo.adminId,
        content: "",
        imageUrl: imageUrl,
      };
      this.list.push(obj);
      this.scrollBottom();
      this.$request
        .post("/api/admin/message/sendMessageToUser", obj)
        .then((res) => {
          this.content = "";
        });
    },
    //点击转接框的确定按钮---将本账号的会话转接给同事
    turnChatTo() {
      // 1. 关闭展示框；2. 发起请求；3. 关闭此组件---会话关闭;4. 清空已选择同事
      this.visible = false;
      if (!this.selectColleage) {
        return;
      }
      this.$request
        .put("/api/admin/message/updateChatServiceUser", {
          id: this.userInfo.id,
          newAdminId: this.selectColleage,
          oldAdminId: this.userInfo.adminId,
        })
        .then((res) => {
          // console.log(res);
          if (res.success) {
            this.$emit("closeMessage", {}, false);
            this.selectColleage = "";
          }
        });
    },
    //点击转接框的取消按钮
    closeTurnChatTo() {
      // 1. 关闭展示框；2. 清空已选择同事
      this.visible = false;
      this.selectColleage = [];
    },
    //点击确定按钮---将同事的会话转接给本账号
    confirmTurn() {
      //发起请求---将此会话转接到当前账号上，然后关闭此会话
      this.$request
        .put("/api/admin/message/updateChatServiceUser", {
          id: this.userInfo.id,
          newAdminId: this.myServiceInfo.adminId,
          oldAdminId: this.userInfo.adminId,
        })
        .then((res) => {
          // console.log(res);
          if (res.success) {
            this.$emit("closeMessage", {}, false);
            this.visible = false;
          }
        });
    },
    //点击结束会话按钮
    closeChat() {
      this.$request
        .put("/api/admin/message/endChatSession?id=" + this.userInfo.id)
        .then((res) => {
          console.log(res);
          if (res.success) {
            this.$emit("closeMessage", {}, false);
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
#sendMessage {
  position: absolute;
  width: auto;
  height: auto;
  left: 27px;
  right: 27px;
  bottom: 15px;
  border: none;
  box-shadow: 0 1px 8px 1px rgba(53, 56, 63, 0.1);
  border-radius: 7px;
  padding: 0;
  .faceIcon {
    position: absolute;
    top: -350px;
    right: 0px;
    width: 272px;
    padding: 12px 16px;
    box-sizing: border-box;
    overflow-x: initial;
    background-color: #fff;
    .iconFontList {
      display: flex;
      flex-wrap: wrap;
      .iconFontItem {
        box-sizing: border-box;
        width: 40px;
        height: 40px;
        padding: 8px;
        cursor: pointer;
      }
    }
  }
}
.chatRecords {
  height: calc(100% - 263px) !important;
  padding: 10px 15px 0 27px;
  box-sizing: border-box;
  overflow-y: auto;
}
.replayState {
  display: flex;
  justify-content: space-between;
  padding: 0 7px 0 14px;
  border-bottom: 1px solid #eef0f6;
  .replayItem {
    display: flex;
    justify-content: flex-start;
    div {
      padding: 10px;
      margin: 0 18px 0 0;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      box-sizing: border-box;
      transition: all 0.5s;
      color: rgba(4, 15, 66, 0.3);
      border-bottom: 2px solid #fff;
    }
  }
  .replayMore {
    display: flex;
    align-items: center;
    padding-right: 15px;
    i {
      margin-left: 15px;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
.selectReplayState {
  border-bottom: 2px solid #1880ff !important;
  color: rgba(4, 15, 66, 0.9) !important;
}
#teatAreaBox {
  box-sizing: border-box;
  font-size: 16px;
  height: 80px;
  padding: 10px 15px 0 15px;
  margin-bottom: 5px;
}
.replayBox {
  height: 134px;
  box-sizing: border-box;
  border: 1px solid #fff;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
}
.sendBtn {
  float: right;
  margin-right: 15px;
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
.chatItem {
  margin-bottom: 20px;
  overflow: hidden;
  padding-right: 12px;
  .historyContent {
    color: rgb(178, 178, 178);
    font-size: 13px;
    text-align: center;
    line-height: 13px;
    margin: 15px 0;
  }
  .chatItemTop-left {
    overflow: hidden;
    color: rgb(178, 178, 178);
    font-size: 13px;
    margin-bottom: 5px;
  }
  .chatItemText-left {
    float: right;
    background-color: #fff;
    border: 1px solid rgb(237, 237, 237);
    //   padding: 10px 15px;
    border-radius: 3px;
    margin-left: 25%;
    font-size: 15px;
    position: relative;
    .feedBack {
      width: 100%;
      display: flex;
      border-top: 1px solid rgb(237, 237, 237);
      .feedBackItem {
        width: 50%;
        box-sizing: border-box;
        padding: 5px 0;
        text-align: center;
        color: rgb(96, 136, 230);
      }
    }
  }
  .chatItemTop-right {
    overflow: hidden;
    color: rgb(178, 178, 178);
    font-size: 13px;
    margin-bottom: 5px;
  }
  .chatItemText-right {
    float: left;
    padding: 10px 15px;
    background-color: rgb(121, 201, 192);
    color: #fff;
    border-radius: 3px;
    margin-right: 25%;
  }
}
.getHistoryInfo {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  width: 100%;
  text-align: center;
  color: rgb(178, 178, 178);
  font-size: 13px;
  padding: 15px 0;
}
.chatTop {
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid rgb(232, 232, 232);
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
}
</style>
