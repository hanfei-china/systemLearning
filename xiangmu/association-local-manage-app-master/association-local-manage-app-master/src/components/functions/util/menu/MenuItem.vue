<template>
    <el-menu-item :key="item.id" :index="item.id" v-if="!item.children || item.children.length < 1">
        <template v-if="item.isSystemModule || !item.menuPath">
            <template v-if="item.menuIcon">
              <i v-if="isIcon(item.menuIcon)" class="console-menu-icon" :class="item.menuIcon"></i>
              <img v-else style="width:16px;" class="console-menu-icon" :src="item.menuIcon" alt="">
            </template>
            <span>{{item.menuTitle}}</span>
            <!-- 智能客服---客服管理 -->
            <template v-if="item.modulePath=='/console/tools/onlineCounsel/chatList'&&chatNum>0">
              <div class="chatNum">{{chatNum}}</div>
            </template>
            <!-- 商城---订单管理 -->
            <template v-if="item.id=='5764D59192F94C269300B579B6F87C27'&&orderNum>0">
              <div class="chatNum">{{orderNum}}</div>
            </template>
        </template>
        <template v-else>
            <template v-if="item.menuIcon">
              <i v-if="isIcon(item.menuIcon)" class="console-menu-icon" :class="item.menuIcon"></i>
              <img v-else style="width:16px;" class="console-menu-icon" :src="item.menuIcon" alt="">
            </template>
            <span style="opacity: 0;" >{{item.menuTitle}}</span>
            <a class="absolute-fill-parent" :style="{padding: isSub ? '0 40px' : '0 20px'}" :href="item.menuPath" :target="item.isSelf ? '_self' : '_blank'" @click.stop>
              <template v-if="item.menuIcon">
                <i v-if="isIcon(item.menuIcon)" class="console-menu-icon" :class="item.menuIcon"></i>
                <img v-else style="width:16px;" class="console-menu-icon" :src="item.menuIcon" alt="">
            </template>{{item.menuTitle}}</a>
        </template>
    </el-menu-item>
    <el-submenu :key="item.id" :index="item.id" v-else>
        <template slot="title">
            <template v-if="item.menuIcon">
              <i v-if="isIcon(item.menuIcon)" class="console-menu-icon" :class="item.menuIcon"></i>
              <img v-else style="width:16px;" class="console-menu-icon" :src="item.menuIcon" alt="">
            </template>
            <span>{{item.menuTitle}}</span>
            <!-- 智能客服总菜单 -->
            <template v-if="item.id=='3BCDE8EAE47B4870B9A7D52FBBBBF77A'&&chatNum>0">
              <div class="chatNum">{{chatNum}}</div>
            </template>
            <!-- 商城总菜单 -->
            <template v-if="item.id=='402000'&&orderNum>0">
              <div class="chatNum shop">{{orderNum}}</div>
            </template>
        </template>
        <menu-item :chatNum="chatNum" :orderNum="orderNum" is-sub :key="child.id" v-for="child of item.children" :item="child"/>
    </el-submenu>
</template>

<script>
    export default {
        name: "MenuItem",
        props:{
            item: Object,
            isSub: {
                type: Boolean,
                default: false
            },
            orderNum:{
              type:Number,
              default:0
            },
            chatNum:{
              type:Number,
              default:0
            }
        },
        data(){
          return {
            timer:null,
          }
        },
        created(){
          // if (this.item.id=='3BCDE8EAE47B4870B9A7D52FBBBBF77A'||this.item.id=='B8788DE662B34108B19B305CB59E9057') {
          if (this.item.modulePath=='/console/tools/onlineCounsel/chatList') {
            this.getChatNum();
            this.timer = setInterval(() => {
              this.getChatNum();
            }, 30000);
          }
        },
        methods:{
          isIcon(val){
            if(val.indexOf("console-icon")==0){
              return true
            }else{
              return false
            }
          },
          getChatNum(){
            this.$request.put("/api/admin/message/deliveryCustomerOnlineStatus").then(res => {
              // this.chatNum=res.data;
            });
          }
        }
    }
</script>

<style lang="less" scoped>
.chatNum{
  position: absolute;
  background-color: red;
  color: #fff;
  font-size: 12px;
  line-height: initial;
  top: 4px;
  left: 100px;
  padding: 2px 5px;
  border-radius: 10px
}
.shop{
  left: 70px;
}
</style>
