<template>
  <el-container class="absolute-fill-parent background-color-white onlineCounsel">
    <el-main class="position-relative">
      <el-container class="absolute-fill-parent">
        <el-aside class="border-right userCont position-relative">
          <user-list @setStompMessage="setStompMessage" @searchList="searchList" @checkedUser="checkedUser"></user-list>
        </el-aside>
        <el-main class="unset-padding userChat position-relative" v-show="chatCont">
          <message-list :stompMessage="stompMessage" :checkedUserInfo="checkedUserInfo" @closeMessage="checkedUser"></message-list>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import UserList from "./UserList";
import MessageList from "./MessageList";

export default {
  name: "chatList",
  components: { UserList, MessageList },
  data() {
    return {
      userListSearch: [], //搜索的用户列表
      checkedUserInfo: {}, //选中的用户
      chatCont: false, //右侧聊天默认不显示
      stompMessage:{}
    };
  },
  methods: {
    //搜索的列表
    searchList(val) {
      this.userListSearch = val;
    },
    checkedUser(item, ifShow) {
      this.checkedUserInfo = item;
      this.chatCont = ifShow;
    },
    setStompMessage(data){
      this.stompMessage = JSON.parse(JSON.stringify(data));
    }
  },
};
</script>
