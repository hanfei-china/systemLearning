<template>
  <el-container class="absolute-fill-parent album-wrap album-manage-wrap flex">
    <!-- <el-aside class="border-right position-relative" style="width: 200px;">
      <AlbumMenu @select="setChosenAlbum" @setMenuList="setMenuList"></AlbumMenu>
    </el-aside> -->
    <el-aside class="border-right position-relative" style="width: 200px;">
      <group-list v-model="chosenGroup" :type-name="typeName" group-type="2" @setMenuList="setMenuList" />
    </el-aside>
    <el-main class="manageWrap position-relative unset-padding flex-fill-in-the-remaining-space">
      <el-container class="absolute-fill-parent">
        <el-header class="flex border-bottom" style="line-height: 60px;padding: 0 20px;">
          <div>
            <el-radio-group size="small" v-model="navItem" fill="#3FA1B6">
              <el-radio-button v-for="item in navList" :key="item.label" :label="item.label">
                {{item.value}}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="flex-fill-in-the-remaining-space" style="padding-left: 30px;">
            <el-input style="width:180px;margin-right:10px;" class="el-input-short" size="small" placeholder="搜索相册名称" v-model="searchTitle" prefix-icon="el-icon-search"/>
            <template v-if="navItem=='albumTable'">创建时间
            <el-date-picker value-format="yyyy-MM-dd" style="width:220px;margin-left:5px;" size="small" v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker></template>
          </div>
          <div>
            <el-button size="mini" class="primaryBtnClass" @click="toAcademyList">毕业照查询</el-button>
            <el-button size="mini" class="primaryBtnClass" @click="uploadPictureVisible = true">上传照片</el-button>
            <el-button size="mini" class="primaryBtnClass" @click="uploadVideoVisible = true">上传视频</el-button>
            <el-button size="mini" v-show="chosenGroup.otherType !== 0" @click="albumFormVisible = true">创建相册</el-button>
          </div>
        </el-header>
        <el-main class="unset-padding position-relative">
          <component :is="navItem" :menuList="menuList" :searchTitle="searchTitle" :dateRange="dateRange" :chosenGroupId="chosenGroupId" :refresh="refreshStatus" :refreshItem="navItem" :chosenGroup="chosenGroup" @changeRefreshStatus="changeRefreshStatus" />
        </el-main>
      </el-container>
    </el-main>
    <!--创建相册弹窗-->
    <el-dialog title="创建相册" :visible.sync="albumFormVisible" append-to-body :close-on-click-modal="false" width="800px">
      <album-form v-if="albumFormVisible" :chosen-group="chosenGroup" :defaultGroupId="chosenGroup.id" @close="albumFormVisible = false" @refresh="refreshAlbum" />
    </el-dialog>
    <!--上传照片弹窗-->
    <el-dialog title="上传照片" :visible.sync="uploadPictureVisible" append-to-body :close-on-click-modal="false" width="800px">
      <picture-form v-if="uploadPictureVisible" @close="uploadPictureVisible = false" @refresh="refreshPicture" />
    </el-dialog>
    <!--上传视频弹窗-->
    <el-dialog title="上传视频" :visible.sync="uploadVideoVisible" append-to-body :close-on-click-modal="false" width="800px">
      <upload-video v-if="uploadVideoVisible" @close="uploadVideoVisible = false" @refresh="refreshPicture" />
    </el-dialog>
  </el-container>
</template>

<script>
import AlbumTable from "./albumTable/AlbumTable";
import PictureTable from "./pictureTable/PictureTable";
import AlbumForm from "./albumTable/AlbumForm";
import PictureForm from "./pictureTable/PictureForm";
import GroupList from "../../../util/group/AlbumGroupList";
import { SET_FROMHOMEPAGE } from "@/js/store/mutation-types";
import uploadVideo from './pictureTable/uploadVideo'

import AlbumMenu from "./AlbumMenu"
export default {
  name: "AlbumManage",
  components: { AlbumMenu,GroupList, AlbumTable, PictureTable, AlbumForm, PictureForm, uploadVideo },
  data() {
    return {
      typeName: "分组",
      chosenGroup: {},
      navList: [
        {
          label: "albumTable",
          value: "相册",
        },
        {
          label: "pictureTable",
          value: "照片",
        },
      ],
      navItem: "albumTable", //相册页面/照片页面
      searchTitle: "", //搜索内容
      refreshStatus: false,
      albumFormVisible: false, //创建相册弹窗
      uploadPictureVisible: false, //上传照片弹窗
      menuList:[],
      dateRange:[],
      uploadVideoVisible:false
    };
  },
  computed: {
    chosenGroupId() {
      return this.chosenGroup.id;
    },
  },
  methods: {
    setChosenAlbum(val){
      this.chosenGroup = val;
    },
    setMenuList(list){
      this.menuList = list
    },
    refreshAlbum() {
      this.navItem = "albumTable";
      this.refreshStatus = true;
    },
    refreshPicture() {
      this.navItem = "pictureTable";
      this.refreshStatus = true;
    },
    changeRefreshStatus() {
      this.refreshStatus = false;
    },
    toAcademyList() {
      const { href } = this.$router.resolve({
        path: "/graduationPhotoEnquiry/academyList",
      });
      window.open(href, "_blank");
    },
  },
  mounted() {
    var fromHomePageType = this.$store.state.fromHomePageType;
    if(fromHomePageType=="createAlbum"){
      this.albumFormVisible = true;
    }else if(fromHomePageType=="uploadPhoto"){
      this.uploadPictureVisible = true;
    }
    this.$store.commit(SET_FROMHOMEPAGE,"");
  },
};
</script>
