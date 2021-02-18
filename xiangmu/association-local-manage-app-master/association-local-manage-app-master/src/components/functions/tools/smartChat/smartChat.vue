<template>
  <div class="container">
    <div v-if="socketClose" class="masklayer">
      <span style="fontSize:16px;letterSpacing: 5px;">{{closeInfo}}</span>
    </div>
    <div class="ShowSubInfo" v-if="ifShowSubInfo" v-text="showSubInfo"></div>
    <div class="chatContainer">
      <div class="chatBody">
        <!-- 头部 -->
        <div class="chatTop">
          <div class="chatTopLfet">
            <img v-if="!equipment&&!ifComments" src="./image/photo.png" class="chatTopImg" />
            <span v-if="ifComments" style="display:flex;alignItems:center;fontSize:16px;">
              <span class="el-icon-arrow-left" v-if="equipment" style="width:20px;height:20px;lineHeight:20px;fontSize:20px;marginRight:5px;" @click="cancelComment()"></span>
              {{equipment?'给我们留言':'留言板 | 您有什么疑问，可以给我留言呦~'}}
            </span>
            <span v-if="!ifComments&&!isPersonService">
              <span style="fontSize:16px;">{{cookieID.adminName}}</span>
              <span v-if="!equipment">
                <span style="margin:0 10px;">|</span>您的智能客服，有什么问题可以问我呦~
              </span>
            </span>
            <span v-if="!ifComments&&isPersonService">
              <span style="fontSize:16px;">{{customServiceInfo.adminName}}</span>
              <span v-if="!equipment">
                <span style="margin:0 10px;">|</span>您的智能客服，有什么问题可以问我呦~
              </span>
            </span>
          </div>
          <div style="display:flex;alignItems:center;">
            <div :style="{'marginRight':equipment?'5px':'20px'}" class="toPersonClick" @click="toPerson">
              <img v-if="!ifComments&&!isPersonService" style="width:24px;height:24px;marginRight:5px;backgroundColor: #fff;borderRadius:50%;" src="./image/person.png" />
              <span v-if="!ifComments&&!isPersonService&&!equipment">人工服务</span>
            </div>
            <img src="./image/openSound.png" v-if="isOpenSound" class="iconfont icon-tishiyinS" style="cursor: pointer;width:20px;height:20px;" @click="isOpenSound=!isOpenSound" />
            <img src="./image/closeSound.png" v-if="!isOpenSound" class="iconfont icon-tishiyinN" style="cursor: pointer;width:20px;height:20px;" @click="isOpenSound=!isOpenSound" />
            <!-- IE浏览器的音频播放标签 -->
            <!-- <embed src="" type="" autostart="false" loop="false" hidden="true"> -->
            <!-- 非IE浏览器 -->
            <audio ref="audioInfo" src="./audio/audio.mp3" hidden="true" preload="auto"></audio>
          </div>
        </div>
        <!-- 留言模块 -->
        <div class="leaveComments" id="leaveComments" v-if="ifComments">
          <div class="commentTop">您好，很抱歉我们暂时无法为您提供服务，如需帮助，请留言，我们将尽快联系并解决您的问题</div>
          <ul class="commentForm">
            <li class="commentItem" id="commentItem">
              <span class="commentFormItemName">工号</span>
              <input type="text" placeholder="请输入工号" :class="{'commentFormInput':true,'commentInput':equipment}" v-model="commentForm.jobNumber" />
            </li>
            <li class="commentItem" id="commentItem">
              <span class="commentFormItemName">项目编号</span>
              <input type="text" placeholder="请输入项目编号" :class="{'commentFormInput':true,'commentInput':equipment}" v-model="commentForm.projectNumber" />
            </li>
            <li class="commentItem" id="commentItem">
              <span class="commentFormItemName">
                手机
                <span style="color:red;">*</span>
              </span>
              <input type="text" placeholder="请输入手机号码" :class="{'commentFormInput':true,'commentInput':equipment}" v-model="commentForm.telPhone" />
            </li>
            <li>
              <div class="commentFormItemName" style="width:100px;height:40px;lineHeight:40px;">
                留言内容
                <span style="color:red;">*</span>
              </div>
              <textarea id="commentTextarea" class="commentFormTextarea" placeholder="请输入留言内容" v-model="commentForm.content"></textarea>
            </li>
          </ul>
          <div v-if="equipment" id="phoneSubmitBtn">
            <div id="clickSubmitBtn" @click="submitComment">提交</div>
          </div>
          <!-- PC端的提交按钮 -->
          <div v-else class="PCsubmitBtn">
            <div style="backgroundColor:rgba(0, 0, 0, 0.1);color:rgba(91, 91, 91, 1);marginRight:20px;" @click="cancelComment">取消</div>
            <div style="backgroundColor:rgba(0, 131, 204, 1);color:#fff;" @click="submitComment">提交</div>
          </div>
        </div>
        <!-- 客服与客户聊天模块 -->
        <div class="chatMiddle" v-if="!ifComments" ref="talkArea">
          <div v-if="hasHistoryList&&moreHistory" class="getHistoryInfo" @click="getHistoryInfo" style="cursor:pointer;">点击加载更多历史消息</div>
          <div v-if="hasHistoryList&&!moreHistory" class="getHistoryInfo">没有更多消息了</div>
          <template v-for="(item,index) in list">
            <!-- 客服模板 -->
            <div class="chatItem" :key="index" v-if="item.type===1">
              <div v-if="(item.flag===4)&&hasHistoryList" class="historyContent">------ 以上为历史内容 ------</div>
              <div v-if="item.flag===7" class="historyContent">------ 当前会话转接，由客服-{{customServiceInfo.adminName}}为您服务 ------</div>
              <div v-if="item.flag===8" class="historyContent">------ 当前人工客服繁忙，由机器人客服为您服务 ------</div>
              <div v-if="item.flag===9" class="historyContent">------ 当前暂无人工客服在线 ------</div>
              <div class="chatItemTop-left">
                <span v-if="!equipment" style="float: left;marginRight:10px;fontSize:12px;lineHeight:16px;">{{item.sendName==='customer'?'小其':item.sendName}}</span>
                <span v-if="!equipment" style="float: left;fontSize:12px;lineHeight:16px;">{{item.chatTime | timeFilter}}</span>
                <span v-if="equipment" style="float: left;fontSize:12px;lineHeight:16px;margin-left:47px;">{{item.chatTime | timeFilter}}</span>
              </div>
              <!-- PC端模板 -->
              <span class="chatItemText-left" v-if="!equipment">
                <div style="padding: 10px 15px;">
                  <!-- 回话 -->
                  <div v-if="item.flag===0">
                    {{item.text}}
                    <!-- <span style="color:rgba(0, 131, 204, 1);cursor: pointer;" @click="ifComments = true">留言</span> -->
                  </div>
                  <div v-if="[2,3,4,7,8].indexOf(item.flag)>=0">{{item.text}}</div>
                  <!-- 答案 -->
                  <div v-if="item.flag===1">{{item.answer.insideAnswers}}</div>
                  <!-- 相关问题 -->
                  <div class="answerList" v-if="(item.flag===1||item.flag===2)&&item.question.length>0">
                    <div style="color:rgb(170, 170, 170)" v-if="item.flag!==2">相关问题：</div>
                    <ul>
                      <li v-for="(question,index) in item.question" :key="index" @click="selectQuestion(question)" style="margin:5px 0;color:rgba(0, 131, 204, 1)">
                        {{(index+1)+'. '}}
                        <a href="javascript:;" style="color:rgba(0, 131, 204, 1);">{{question}}</a>
                      </li>
                    </ul>
                    <div style="color:rgb(170, 170, 170);margin-top:10px;">点击问题或回复数字查看答案</div>
                  </div>
                  <!-- 人工客服---文本及带表情的文本 -->
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
                <!-- 是否解决---当有答案时出现 -->
                <div class="feedBack" v-if="opinionList.indexOf(index)>=0&&item.flag===1">
                  <div class="feedBackItem" style="width:100%;color:rgb(170, 170, 170);">{{showOpinion[index]}}</div>
                </div>
                <div v-if="(opinionList.indexOf(index)<0)&&(item.flag===1)&&(!item.history)" class="feedBack">
                  <div class="feedBackItem" style="borderRight:1px solid rgb(237, 237, 237);cursor:pointer;color:rgba(0, 131, 204, 1);" @click="submitOpinion(0,index)">解决</div>
                  <div class="feedBackItem" style="cursor:pointer;color:rgba(0, 131, 204, 1);" @click="submitOpinion(1,index)">未解决</div>
                </div>
              </span>
              <!-- 移动端模板 -->
              <span id="chatItemText-left" v-if="equipment" style="maxWidth: 93%;">
                <img class="chatItemUserPhoto" src="./image/servicePerson.png" />
                <div id="chatItemText-leftText">
                  <div id="arrow"></div>
                  <div style="padding:10px 15px;">
                    <!-- 回话 -->
                    <div v-if="item.flag===0" style="wordWrap:break-word;">
                      {{item.text}}
                      <!-- <span style="color:rgba(0, 131, 204, 1);cursor: pointer;" @click="ifComments = true">留言</span> -->
                    </div>
                    <div v-if="[2,3,4,7,8].indexOf(item.flag)>=0">{{item.text}}</div>
                    <!-- 答案 -->
                    <div v-if="item.flag===1">{{item.answer.insideAnswers}}</div>
                    <!-- 相关问题 -->
                    <div id="answerList" v-if="(item.flag===1||item.flag===2)&&item.question.length>0">
                      <div style="color:rgb(170, 170, 170);">相关问题：</div>
                      <ul>
                        <li v-for="(question,index) in item.question" :key="index" @click="selectQuestion(question)" style="margin:5px 0;color:rgb(96, 136, 230);">
                          {{(index+1)+'. '}}
                          <a href="javascript:;" style="color:rgb(96, 136, 230);">{{question}}</a>
                        </li>
                      </ul>
                      <div style="color:rgb(170, 170, 170);margin-top:10px;">点击问题或回复数字查看答案</div>
                    </div>
                    <!-- 人工客服---文本及带表情的文本 -->
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
                  <!-- 是否解决---当有答案时出现 -->
                  <div class="feedBack" v-if="opinionList.indexOf(index)>=0&&item.flag===1">
                    <div class="feedBackItem" style="width:100%;color:rgb(170, 170, 170);">{{showOpinion[index]}}</div>
                  </div>
                  <div v-if="(opinionList.indexOf(index)<0)&&(item.flag===1)&&(!item.history)" class="feedBack">
                    <div class="feedBackItem" style="borderRight:1px solid rgb(237, 237, 237);" @click="submitOpinion(0,index)">解决</div>
                    <div class="feedBackItem" @click="submitOpinion(1,index)">未解决</div>
                  </div>
                </div>
              </span>
              <div v-if="(item.flag===0&&!item.history)||item.unsolved" class="toPerson" :style="{color:equipment?'rgb(0, 122, 255)':'rgba(0, 131, 204, 1)'}" @click="toPerson">转人工</div>
            </div>
            <!-- 用户模板 -->
            <div class="chatItem" :key="index" v-if="item.type===0">
              <div class="chatItemTop-right">
                <span v-if="!equipment" style="float: right;">{{item.createTime | timeFilter}}</span>
                <span v-else style="float: right;margin-right:7px;">{{item.createTime | timeFilter}}</span>
              </div>
              <!-- PC端模板 -->
              <div class="chatItemText-right" v-if="!equipment" :style="{padding:(item.imageUrl&&item.imageUrl.length>0)?'0':'10px 15px'}">
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
              <!-- 移动端模板 -->
              <div v-else style="overflow:hidden;display:flex;justifyContent:flex-end;">
                <div id="chatItemText-right" :style="{padding:(item.imageUrl&&item.imageUrl.length>0)?'0':'10px 15px'}">
                  <!-- 小角 -->
                  <div id="userArrow" v-if="!(item.imageUrl&&item.imageUrl.length>0)"></div>
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
                <img src="./image/userPerson.png" class="userPerson" />
              </div>
            </div>
          </template>
          <div class="personService" v-if="toPersonIf">正在为您转接，请稍侯。。。</div>
        </div>
        <!-- 客户输入框模块 -->
        <div class="chatBottom" v-if="!ifComments" id="chatBottom">
          <!-- 图标展示模块 -->
          <div class="faceIcon" v-if="faceIconShow">
            <ul class="iconFontList">
              <li class="iconFontItem" v-for="(item,index) in iconFontList" :key="index" @click="selectFaceIcon(item)">
                <svg class="icon" aria-hidden="true" style="font-size:24px;">
                  <use :xlink:href="item" />
                </svg>
              </li>
            </ul>
          </div>
          <!-- PC端小图标模块 -->
          <div class="chatBotImg" v-if="!equipment">
            <div class="iconMask" v-if="!isPersonService"></div>
            <span class="iconfont icon-smile" style="cursor:pointer;fontSize:22px;" @click="faceIconShow=!faceIconShow"></span>
            <!-- <span class="iconfont icon-comiistupian" style="cursor:pointer;fontSize:22px;"></span> -->
            <el-upload class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess">
              <i class="iconfont icon-comiistupian" style="cursor:pointer;fontSize:22px;"></i>
            </el-upload>
          </div>
          <!-- 移动端图标模块 -->
          <div v-if="equipment" id="chatBotImg">
            <div class="iconMask" v-if="!isPersonService"></div>
            <span class="iconfont icon-smile" style="cursor:pointer;fontSize:22px;marginRight:10px;" @click="faceIconShow=!faceIconShow"></span>
            <el-upload class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess">
              <i class="iconfont icon-comiistupian" style="cursor:pointer;fontSize:22px;"></i>
            </el-upload>
            <!-- <span
              class="iconfont icon-comiistupian"
              style="cursor:pointer;fontSize:22px;marginRight:6px;"
            ></span>-->
          </div>
          <!-- 输入模块 -->
          <input @keyup.enter="submitChat" type="text" id="chatBotText" class="chatBotText" placeholder="请输入您的问题" v-model="value" />
          <!-- <textarea
            @keyup.enter="submitChat"
            v-else
            placeholder="请输入"
            class="chatBotText"
            v-model="value"
          ></textarea>-->
          <!-- 按钮模块 -->
          <button v-if="!equipment" id="chatBotBtn" class="chatBotBtn" @click="submitChat" :style="canBeSub?'backgroundColor:rgba(0, 131, 204, 1);':'backgroundColor: #ccc;'">
            <span>发送</span>
            <img src="./image/send.png" alt style="width:18px;height:18px;marginLeft:10px;" />
          </button>
          <button v-else id="chatBotBtn" @click="submitChat" style="backgroundColor:rgb(0, 122, 255);">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestBaseUrl } from "../../../../js/config/serviceConfig";
import {stompURL} from '@/js/config/serviceConfig'
import "./smartChat.css";
import "./icon/iconfont.css";
import "../onlineCounsel/chatList/icon/iconfont.css";
import "../onlineCounsel/chatList/faceIcon/iconfont.js";
import iconFontList from "../onlineCounsel/chatList/faceIcon/iconFontList.js";
export default {
  name: "smartChat",
  data() {
    return {
      cookieID: {},
      closeInfo: "连接中，请稍候~", //遮罩层的提示文字
      list: [], //存放聊天数据
      value: "", //用于输入的文本内容
      canBeSub: false, //用于判断是否可以发送消息
      screenWidth: 0, //屏幕宽
      equipment: 0, //用户设备   0为PC，1为移动端
      socket: null, //存储socket对象
      opinionList: [], //反馈列表
      showOpinion: {}, //反馈后展示内容
      socketClose: true, //连接是否断开
      historyList: [], //根据数字去查询问题
      limit: 10, //分页效果的每页条数
      offset: 0, //分页效果的页码---默认为1，因为页面中会一直展示最新1页的数据
      ifGetHistory: false, //是否去获取历史记录，是的话，展示信息不再进行截取
      number: 1, //历史记录获取的次数，默认从第一次获取
      total: 0, //历史纪录的总条数
      moreHistory: true, //是否还能获取历史记录
      hasHistoryList: false, //是否有历史记录---判断是否曾经咨询过问题
      ifComments: false, //是否进入留言模块，默认为否
      commentForm: {
        //留言内容
        telPhone: "",
        content: "",
        jobNumber: "",
        projectNumber: "",
      },
      ifShowSubInfo: false,
      showSubInfo: "",
      isOpenSound: true, //是否开启声音提示
      faceIconShow: false, //是否展示表情包
      iconFontList: iconFontList, //表情数据
      action: requestBaseUrl + "/api/common/anon/uploadFile", //上传图片及文件的地址
      toPersonIf: false, //是否要转接人工
      sendUrl: "", //客户端聊天时发送消息的地址---在转人工以及人工转机器人的时候会发生变化
      customServiceInfo: {
        //人工客服的信息
        adminId: "",
        adminName: "",
      },
      isPersonService: false, //当前是否为人工服务
      timer: null, //监控用户是否在线---避免非正常下线
      timerTwo: null, //监控用户是否在正常使用客服，如果超过设定时间没有操作，将自动下线
    };
  },
  watch: {
    value(newVal) {
      if (newVal && newVal.trim()) {
        this.canBeSub = true;
      } else {
        this.canBeSub = false;
      }
    },
    screenWidth(newVal) {
      if (newVal < 540) {
        this.equipment = 1;
      }
    },
    isPersonService(val) {
      if (val) {
        this.sendUrl = "/api/message/sendMessageArtificial";
      } else {
        this.sendUrl = "/api/message/sendMessage";
      }
    },
  },
  created(){
    this.getCookieInfo(true);
  },
  mounted() {
    //监听屏幕宽度
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    //这一步不能在这里做，要在建立连接以后，因为建立连接后又进行了数据的补充
    // this.scrollBottom();
  },
  filters: {
    //时间过滤器
    timeFilter(time) {
      var date = new Date(time);
      var h = date.getHours();
      var m = date.getMinutes();
      var T = "AM";
      if (h >= 12) {
        h = h - 12;
        T = "PM";
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      return h + ":" + m + " " + T;
    },
  },
  methods: {
    //发起轮询---监控用户是否保持在线
    ifStayInline() {
      this.$request.put("/api/message/deliveryUserOnlineStatus");
      this.timer = setInterval(() => {
        this.$request.put("/api/message/deliveryUserOnlineStatus",null,{noLoading:true}).then((res) => {});
      }, 30000);
    },
    //页面初始化，获取cookie信息
    getCookieInfo(ifUpdate) {
      this.$request.get("/api/message/getCookieSign").then((res) => {
        if (JSON.parse(res.data).flag) {
          this.customServiceInfo = JSON.parse(res.data);
          this.cookieID = JSON.parse(res.data);
          this.isPersonService = true;
          this.sendUrl = "/api/message/sendMessageArtificial";
        } else {
          this.cookieID = JSON.parse(res.data);
          this.isPersonService = false;
          this.sendUrl = "/api/message/sendMessage";
        }
        if (ifUpdate) {
          if (window.newstomp) {
            window.newstomp.disconnect()
          }
          this.stompInit();
        }
      });
    },
    stompInit() {
      let self = this;
      let stomp = new Socket(stompURL + '/stomp', '10000', '10000');
      window.newstomp = stomp;
      stomp.on('/topic/' + this.cookieID.userId, function (message) {
        self.getChat(message);
      });
      stomp.onClose(function (e) {
        self.closeSocket();//关闭连接，打开遮罩层
      });
      stomp.onOpen(function (e) {
        self.$request.get("/api/message/getChatRecord?limit=" + 1 + "&offset=" + 0).then((res) => {
          self.total = res.data.total;
          if (res.data.total > 0) {
            self.hasHistoryList = true;
          }
          self.ifStayInline();
          self.socketClose = false;
          self.getHistoryInfo(self.connectSocket);
        });
      });
    },
    //客户端接收消息
    getChat(data) {
      console.log(data);
      //播放消息提示音
      this.audioPlay();
      var msg = JSON.parse(data.msgData);
      //判断是否为转接信息
      if (msg.messageType === 2) {
        // 转接给机器人的情况---客服主动断开连接
        if (msg.adminId === "customer") {
          this.toPersonIf = false;
          this.$set(this.customServiceInfo, "adminId", "");
          this.$set(this.customServiceInfo, "adminName", "");
          this.isPersonService = false;
          this.list.push({
            answer: {
              externalAnswers: "",
              id: "",
              insideAnswers: "",
            },
            chatTime: Date.now(),
            flag: 8,
            type: 1,
            text: "你好，请问遇到了什么问题吗？",
          });
          this.scrollBottom();
          this.getCookieInfo(false);
          return;
        } else {
          this.customServiceInfo.adminId = msg.adminId;
          this.customServiceInfo.adminName = msg.adminName;
          this.list.push({
            answer: {
              externalAnswers: "",
              id: "",
              insideAnswers: "",
            },
            chatTime: Date.now(),
            flag: 7,
            type: 1,
            text:
              "你好，我是" +
              this.customServiceInfo.adminName +
              "，请问有什么可以帮助您的？",
          });
        }
      }
      if (msg.flag === 0) {
        // msg.text = "无法识别您的问题，请拨打人工热线：82335553，或者给我们";
        msg.text =
          "无法识别您的问题，请转接人工或拨打人工热线：15529657738(同微信)";
      } else if (msg.flag === 3) {
        msg.text = "数据库中暂无此类问题~";
      } else if (msg.flag === 2) {
        msg.text = "您是否想要咨询以下问题:";
        // msg.text = "";
      }
      if (msg.question && msg.question.length > 0) {
        this.historyList = JSON.parse(JSON.stringify(msg.question));
      }
      this.list.push(msg);
      //对数据进行监控，超过10条时，进行截取
      if (this.list.length > 10 && !this.ifGetHistory) {
        var num = this.list.length - 10;
        this.list.splice(0, num);
      }
      this.scrollBottom();
    },
    //客户端向服务端发送信息
    submitChat() {
      var value = this.value.replace("\n", "");
      this.value = "";
      if (value === "" || value.trim() === "") {
        return false;
      }
      var receiver = this.isPersonService
        ? this.customServiceInfo.adminId
        : this.cookieID.adminId;
      var obj_1 = {
        content: value,
        receiver,
        createTime: Date.now(),
        type: 0,
      };
      this.list.push(obj_1);

      var content = "";
      var num = value - 1;
      if (num >= 0 && this.historyList[num]) {
        content = this.historyList[num];
      } else {
        content = value;
      }
      var obj = {
        content: content,
        receiver,
        createTime: Date.now(),
        type: 0,
      };
      this.scrollBottom();
      //客户端向服务器发送消息
      this.$request.post(this.sendUrl, obj).then((res) => {});
    },
    //滚动条滚动方法
    scrollBottom() {
      var that = this;
      this.$nextTick(() => {
        var heightLong = this.$refs.talkArea.scrollHeight; //总长
        var scrollLong = this.$refs.talkArea.scrollTop; //当前滚动条的位置
        var scrollHeight = heightLong - scrollLong; //滚动条需要向下滚动的距离
        var scrollSize = scrollHeight / timeLong; //滚动条每次增加的距离；
        var num = 0; //滚动条向下递进的次数
        if (that.$refs.talkArea.scrollTo) {
          var timeLong = 120; //滚动的总时长
          var timer = setInterval(() => {
            num++;
            if (num == timeLong + 1) {
              clearInterval(timer);
            } else {
              that.$refs.talkArea.scrollTo(
                0,
                that.$refs.talkArea.scrollTop + scrollHeight / timeLong
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
              that.$refs.talkArea.scrollTop =
                that.$refs.talkArea.scrollTop + scrollHeight / timeLong;
            }
          }, 1);
        }
      });
      //每次屏幕滚动，都会刷新监控
      this.ifUseChatService();
    },
    //监控用户是否在使用客服
    ifUseChatService() {
      clearTimeout(this.timerTwo);
      this.timerTwo = setTimeout(() => {
        window.newstomp.disconnect();
        this.socketClose = true;
        clearTimeout(this.timer);
        this.closeInfo = "会话超时断开，请刷新页面~";
      }, 600000);
    },
    //点击服务器返回的问题列表
    selectQuestion(value) {
      this.value = value;
      this.submitChat();
    },
    //提交反馈意见---后续需要根据反馈意见决定是否要转为人工客服
    submitOpinion(data, index) {
      var that = this;
      this.opinionList.push(index);
      this.$set(that.showOpinion, index, "提交中");
      setTimeout(() => {
        this.$set(that.showOpinion, index, "已反馈");
        if (data) {
          var item = that.list[index];
          item.unsolved = true;
          this.list.splice(index, 1, item);
        }
      }, 500);
    },
    //连接断开，打开遮罩层
    closeSocket() {
      this.socketClose = true;
      this.historyList = [];
      this.list = [];
      clearTimeout(this.timer);
    },
    //创建连接，关闭遮罩层
    connectSocket() {
      var text = this.isPersonService? "你好，我是" + this.customServiceInfo.adminName + "，请问有什么可以帮助您的？" : "欢迎，请问遇到了什么问题吗？";
      this.list.push(
        ...[
          {
            answer: { externalAnswers: "", id: "", insideAnswers: "" },
            chatTime: Date.now(),
            flag: 4,
            type: 1,
            text,
            sendName: this.customServiceInfo.adminName || "小其",
          }
        ]
      );
      this.scrollBottom();
    },
    //获取历史记录
    getHistoryInfo(callback) {
      if (!this.moreHistory || !this.hasHistoryList) {
        return false;
      }
      var OldHeight = this.$refs.talkArea.scrollHeight;
      var limit = this.limit;
      var oldOffset = this.offset;
      this.offset = this.total - this.limit * this.number;
      let offset = 0;
      if (this.offset >= 0) {
        offset = this.offset;
      } else {
        offset = 0;
        limit = oldOffset;
        this.moreHistory = false;
      }
      var that = this;
      this.ifGetHistory = true;
      this.$request.get("/api/message/getChatRecord?limit=" + limit + "&offset=" + offset).then((res) => {
        that.number++;
        var arr = res.data.list;
        var arr_1 = arr.map((item) => {
          var msg = JSON.parse(item);
          if (msg.flag === 0) {
            msg.text = "无法识别您的问题，请转接人工或拨打人工热线：15529657738(同微信)";
          } else if (msg.flag === 3) {
            msg.text = "数据库中暂无此类问题~";
          } else if (msg.flag === 2) {
            msg.text = "您是否想要咨询以下问题:";
            //   msg.text = "";
          }
          msg.history = true;
          return msg;
        });
        this.list.unshift(...arr_1);
        //要将滚动条滚动到之前的位置
        this.$nextTick(() => {
          var newHeight = this.$refs.talkArea.scrollHeight;
          that.$refs.talkArea.scrollTo(0, newHeight - OldHeight);
        });
        callback&&callback()
      });
    },
    //转人工服务
    toPerson() {
      var that = this;
      this.toPersonIf = true;
      this.$request.get("/api/message/getOnlineCustomerService").then((res) => {
        // console.log(res);
        this.toPersonIf = false;
        if (res.data.flag) {
          // 转接成功：1. 聊天数据清空；2. 历史数据初始化；3. 客服发送请求的接口改变;4. 客服名字等信息改变；
          //1. 清空聊天数据
          this.list = [];
          //2. 历史数据初始化
          this.limit = 10;
          this.offset = 0;
          this.ifGetHistory = false;
          this.number = 1;
          this.total = 0;
          this.moreHistory = true;
          //获取总的历史数据---用于计算偏移量
          this.$request
            .get("/api/message/getChatRecord?limit=" + 1 + "&offset=" + 0)
            .then((res) => {
              console.log(res);
              that.total = res.data.total;
              if (res.data.total > 0) {
                that.hasHistoryList = true;
              } else {
                that.hasHistoryList = false;
              }
            });
          //3. 接口数据变化
          //   this.sendUrl = "/api/message/sendMessageArtificial";
          //4. 人工客服信息
          this.customServiceInfo.adminId = res.data.adminId;
          this.customServiceInfo.adminName = res.data.adminName;
          this.isPersonService = true;
          //5. 展示初始信息
          this.list.push({
            answer: {
              externalAnswers: "",
              id: "",
              insideAnswers: "",
            },
            chatTime: Date.now(),
            flag: 4,
            type: 1,
            text: "你好，我是" + res.data.adminName + "，请问有什么帮助您的？",
          });
        } else {
          //跳转失败的话就会转入留言功能
          // this.ifComments = true;
          this.list.push({
            answer: {
              externalAnswers: "",
              id: "",
              insideAnswers: "",
            },
            chatTime: Date.now(),
            flag: 9,
            type: 1,
          });
        }
      });
    },
    //取消留言
    cancelComment() {
      this.commentForm = {
        //留言内容
        telPhone: "",
        content: "",
        jobNumber: "",
        projectNumber: "",
      };
      this.ifComments = false;
      this.scrollBottom();
    },
    //提交留言
    submitComment() {
      var that = this;
      if (
        this.commentForm.telPhone === "" ||
        this.commentForm.telPhone.trim === ""
      ) {
        this.showSubInfo = "请填写手机号码";
        this.showCommentInfo();
        return false;
      } else if (
        this.commentForm.content === "" ||
        this.commentForm.content.trim === ""
      ) {
        this.showSubInfo = "请填写留言内容";
        this.showCommentInfo();
        return false;
      }
      var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (!reg.test(this.commentForm.telPhone)) {
        this.showSubInfo = "请填写正确的手机号码";
        this.showCommentInfo();
        return false;
      }
      //提交信息
      this.$request
        .post("/api/message/saveCustomerMessage", that.commentForm)
        .then((res) => {
          console.log(res);
          that.showSubInfo = "提交成功";
          that.ifShowSubInfo = true;
          setTimeout(() => {
            that.showSubInfo = "";
            that.ifShowSubInfo = false;
            that.commentForm = {
              telPhone: "",
              content: "",
              jobNumber: "",
              projectNumber: "",
            };
            that.ifComments = false;
            that.scrollBottom();
          }, 1500);
        });
    },
    //留言展示方式
    showCommentInfo() {
      this.ifShowSubInfo = true;
      setTimeout(() => {
        this.ifShowSubInfo = false;
        this.showSubInfo = "";
      }, 1500);
    },
    //消息提示
    audioPlay() {
      if (this.isOpenSound) {
        //此时是开启提示音的
        this.$refs.audioInfo.play();
      } else {
        return false;
      }
    },
    //选中表情
    selectFaceIcon(val) {
      this.value = this.value + ":;" + val + ":;";
      this.faceIconShow = false;
    },
    //上传图片
    handleAvatarSuccess(response, file, fileList) {
      var imageUrl = file.response.data;
      //发送并展示图片内容
      this.value = ""; //逻辑设定---发送图片或文件时，默认不能发送消息
      var receiver = this.isPersonService
        ? this.customServiceInfo.adminId
        : this.cookieID.adminId;
      var obj = {
        content: "",
        receiver,
        createTime: Date.now(),
        type: 0,
        imageUrl: imageUrl,
      };
      this.list.push(obj);
      this.scrollBottom();
      this.$request.post(this.sendUrl, obj).then((res) => {});
    },
  },
};
</script>

<style scoped lang="less">
.container {
  overflow-y: auto;
  // width: 100vw;
  // height: 100vh;
  position: relative;
  height: 930px;
  .masklayer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ShowSubInfo {
    z-index: 1000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px 15px;
    letter-spacing: 2px;
    font-size: 15px;
    border-radius: 5px;
  }
}
.chatContainer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  background: -webkit-linear-gradient(
    left,
    rgba(0, 118, 208, 1),
    rgba(184, 237, 255, 1),
    rgba(0, 118, 208, 1)
  );
  .chatBody {
    width: 1000px;
    height: 720px;
    display: flex;
    flex-direction: column;
    .chatTop {
      height: 10%;
      width: 100%;
      // background-color: rgb(121, 201, 192);
      background: -webkit-linear-gradient(
        left,
        rgba(47, 75, 162, 1),
        rgba(41, 220, 231, 1)
      );
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      padding: 0 15px;
      display: flex;
      align-items: center;
      color: #fff;
      box-sizing: border-box;
      justify-content: space-between;
      .chatTopImg {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .leaveComments {
      width: 100%;
      height: 90%;
      background-color: rgb(242, 243, 245);
      overflow-y: auto;
      position: relative;
      &::-webkit-scrollbar {
        width: 0px !important;
      }
      .commentTop {
        font-size: 13px;
        color: rgb(102, 102, 102);
        word-break: break-all;
        padding: 16px;
      }
      .PCsubmitBtn {
        position: absolute;
        bottom: 36px;
        right: 30px;
        display: flex;
        div {
          width: 97px;
          height: 36px;
          font-size: 14px;
          line-height: 36px;
          text-align: center;
          border-radius: 6px;
          cursor: pointer;
        }
      }
      .commentForm {
        padding: 0 15px;
        .commentItem {
          // margin-bottom:15px;
          display: flex;
          align-items: center;
          height: 60px;
          border-bottom: 1px solid rgba(238, 238, 238, 1);
        }
        .commentFormItemName {
          color: rgb(68, 68, 68);
          font-size: 13px;
          // padding: 0px 0px 6px 16px;
          margin-right: 10px;
          width: 60px;
          text-align: left;
        }
        .commentFormInput {
          flex: 1;
          height: 36px;
          padding: 12px;
          box-sizing: border-box;
          border-width: initial;
          border-style: none;
          border-color: initial;
          border-image: initial;
          font-size: 15px;
          border-radius: 6px;
        }
        .commentFormTextarea {
          display: block;
          box-sizing: border-box;
          width: 100%;
          height: 90px;
          overflow-x: hidden;
          overflow-y: auto;
          resize: none;
          background-color: rgb(255, 255, 255);
          word-break: break-all;
          font-size: 13px;
          -webkit-appearance: none;
          padding: 12px 16px;
          outline: 0px;
          border-width: initial;
          border-style: none;
          border-color: initial;
          border-image: initial;
          font-size: 15px;
        }
      }
      .commentFormSubmit {
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        vertical-align: middle;
        font-size: 13px;
        cursor: pointer;
        text-align: center;
        opacity: 1;
        color: white;
        border-width: 0px;
        border-style: initial;
        border-color: initial;
        border-image: initial;
        outline: none;
        border-radius: 3px;
        text-decoration: none;
        .commentFormBtn {
          margin: 0px;
          padding: 0px;
        }
      }
    }
    .chatMiddle {
      height: 81%;
      width: 100%;
      box-sizing: border-box;
      overflow-y: auto;
      position: relative;
      padding: 40px 14px 14px;
      background-color: #fff;
      .getHistoryInfo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        color: rgb(178, 178, 178);
        font-size: 13px;
        padding: 15px 0;
      }
      .chatItem {
        margin-bottom: 20px;
        overflow: hidden;
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
          float: left;
          background-color: #fff;
          border: 1px solid rgb(237, 237, 237);
          //   padding: 10px 15px;
          border-radius: 3px;
          margin-right: 25%;
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
          float: right;
          padding: 10px 15px;
          background-color: rgba(0, 131, 204, 1);
          color: #fff;
          border-radius: 3px;
          margin-left: 25%;
        }
      }
    }
    .chatBottom {
      height: 9%;
      width: 100%;
      background-color: yellow;
      box-sizing: border-box;
      border-top: 1px solid rgb(237, 237, 237);
      background: rgb(255, 255, 255);
      position: relative;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      display: flex;
      align-items: center;
      .chatBotText {
        height: 36px;
        width: 80%;
        padding: 5px 10px;
        box-sizing: border-box;
        resize: none;
        border: 1px solid rgba(223, 223, 223, 1);
        border-radius: 6px;
        margin: 0 15px;
      }
      .chatBotImg {
        display: flex;
        margin-left: 15px;
        position: relative;
        .iconMask {
          position: absolute;
          top: -4px;
          left: -4px;
          width: 60px;
          height: 30px;
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          background-color: rgba(204, 204, 204, 0.3);
        }
        span {
          flex: 1;
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
      .chatBotBtn {
        height: 36px;
        padding: 5px 15px;
        border: 0;
        color: #fff;
        border-radius: 5px;
        display: flex;
        align-items: center;
      }
    }
  }
}
.faceIcon {
  position: absolute;
  top: -106px;
  right: 1px;
  left: 1px;
  border-top: 1px solid rgb(221, 221, 221);
  //   width: 272px;
  padding: 12px 16px;
  box-sizing: border-box;
  overflow-x: initial;
  background-color: #fff;
  .iconFontList {
    display: flex;
    flex-wrap: wrap;
    max-height: 150px;
    overflow-y: auto;
    .iconFontItem {
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      padding: 8px;
      cursor: pointer;
    }
  }
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
.toPerson {
  font-size: 13px;
  color: rgb(121, 201, 192);
  text-align: center;
  line-height: 13px;
  margin-top: 20px;
  width: 100%;
  float: left;
  cursor: pointer;
}
.personService {
  font-size: 13px;
  width: 100%;
  text-align: center;
  color: rgb(178, 178, 178);
  font-size: 13px;
  padding: 15px 0;
}
.toPersonClick {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
