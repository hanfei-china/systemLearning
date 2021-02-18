<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-aside class="unset-padding position-relative border-right" width="200px">
      <el-container class="absolute-fill-parent">
        <el-header class="flex flex-column flex-center border-bottom">
          <div class="flex">
            <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">所有设置</div>
          </div>
        </el-header>
        <el-main class="unset-padding position-relative">
          <div class="absolute-fill-parent">
            <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
              <el-menu @select="setChosenSetting" class="border-right-unset custom-el-menu"
                       :default-active="chosenSetting">
                <el-menu-item v-for="setting of settings" :index="setting.id" :key="setting.id">
                  <div class="text-overflow" style="width: 160px;">{{ setting.title }}</div>
                </el-menu-item>
              </el-menu>
            </vue-scroll>
          </div>
        </el-main>
      </el-container>
    </el-aside>
    <el-main class="unset-padding position-relative">
      <component :is="chosenSetting"/>
    </el-main>
  </el-container>
</template>

<script>
import SystemSetting from "./childrenSetting/SystemSetting";
import BranchSetting from "./childrenSetting/BranchSetting";
import ServerSetting from "./childrenSetting/ServerSetting";
import WxSetting from "./childrenSetting/WxSetting";
// import BaiduSetting from "./childrenSetting/BaiduSetting";
// import SmsSetting from "./childrenSetting/SmsSetting";
import TencentSetting from "./childrenSetting/TencentSetting";
// import OtherSetting from "./childrenSetting/OtherSetting";
import UnifiedIdentitySetting from "./childrenSetting/UnifiedIdentitySetting";
import UploadProtocol from "./childrenSetting/UploadProtocol";
// import MapSetting from "./childrenSetting/MapSetting";
import WebsiteSetting from './childrenSetting/WebsiteSetting'
import SchoolFeteSetting from "./childrenSetting/SchoolFeteSetting";

export default {
  name: "Settings",
  components: {
    UploadProtocol,
    UnifiedIdentitySetting,
    TencentSetting,
    WxSetting,
    ServerSetting,
    BranchSetting,
    SystemSetting,
    WebsiteSetting,
    SchoolFeteSetting
  },
  data() {
    return {
      settings: [
        {id: 'systemSetting', title: '系统设置'},
        {id: 'branchSetting', title: '分会设置'},
        {id: 'serverSetting', title: '邮件服务器设置'},
        {id: 'wxSetting', title: '微信相关设置'},
        {id: 'websiteSetting', title: '站群相关设置'},
        // {id:'baiduSetting',title:'人脸识别设置'},
        // {id:'smsSetting',title:'短信相关设置'},
        {id: 'tencentSetting', title: '腾讯云相关设置'},
        {id: 'unifiedIdentitySetting', title: '统一认证登录设置'},
        {id: 'uploadProtocol', title: '小程序用户条款'},
        // {id:'otherSetting',title:'其它设置'},
        // {id:'mapSetting',title:'认养地图设置'},
        {id: 'schoolFeteSetting', title: '校庆专题设置'}
      ],
      chosenSetting: 'systemSetting'
    }
  },
  methods: {
    setChosenSetting(id) {
      this.chosenSetting = id;
    }
  },
  mounted() {
    if (this.$route.query.toSetting === 'wxSetting') {
      this.chosenSetting = 'wxSetting'
    } else if (this.$route.query.toSetting === 'websiteSetting') {
      this.chosenSetting = 'websiteSetting'
    }
  }
}
</script>
