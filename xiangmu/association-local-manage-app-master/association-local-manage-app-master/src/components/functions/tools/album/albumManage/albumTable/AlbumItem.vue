<template>
  <div>
    <div class="position-absolute" style="right: 5px;top: 25px;">
      <el-checkbox v-model="albumInfo.checked" @change="checkedItemChange" />
    </div>
    <div class="albumCover position-relative cursor-pointer" @click="toHomePage(albumInfo.id)">
      <div class="topbtnbox">
        <img @click.stop="istop(albumInfo.id,false)"  v-if="albumInfo.isTop" class="zhidin canceltop" src="../../../../../../assets/img/canceltop.png" alt="">
        <img @click.stop="istop(albumInfo.id,true)"  v-else class="zhidin" src="../../../../../../assets/img/topping.png" alt="">
      </div>
      <el-image fit="cover" style="width: 100%;height: 152px;" :src="albumInfo.coverUrl" />
      <div class="backModel position-absolute">
        <div class="albumTheme position-absolute flex">
          <span class="themetitle flex-fill-in-the-remaining-space" style="font-size: 14px;">#{{getThemeName()}}</span>
          <p>
            <span class="iconfont icon-chakan" />
            <span style="margin: 0 20px 0 6px;">{{albumInfo.allPageView}}</span>
            <span class="iconfont icon-xiangce-copy" />
            <span style="margin: 0 0 0 6px;">{{albumInfo.photoNum}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="albumTitle">
      <p :title="albumInfo.title" class="text-overflow cursor-pointer">
        {{albumInfo.title}}</p>
      <p style="margin-top: 8px;">
        创建时间
        <span style="font-size: 12px;margin-left: 12px;">{{albumInfo.createTime | yyyyMMddHHmm}}</span>
      </p>
    </div>
    <div class="albumOperate flex">
      <p class="flex-fill-in-the-remaining-space">
        <el-button type="text" @click="albumFormVisible = true">编辑</el-button>
        <el-button type="text" style="color: #F2684F;" @click="deleteAlbum">删除</el-button>
      </p>
      <p style="color: #A1A5AA;">
        启用
        <el-switch active-color="#13ce66" v-model="inUsed" @change="operateAlbum" />
      </p>
    </div>
    <el-dialog title="编辑相册" :visible.sync="albumFormVisible" append-to-body :close-on-click-modal="false" width="760px">
      <album-form v-if="albumFormVisible" :albumId="albumInfo.id" @close="albumFormVisible = false" :chosen-group="chosenGroup" @refresh="$emit('refresh')" />
    </el-dialog>
  </div>
</template>

<script>
import AlbumForm from "./AlbumForm";

export default {
  name: "AlbumItem",
  components: { AlbumForm },
  props: {
    albumInfo: Object,
    albumCheckedItemStatus: Boolean,
    chosenGroup: {
      type: Object,
      default() {
        return {};
      },
    },
    menuList:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      albumFormVisible: false, //编辑相册弹窗
      inUsed: true,
    };
  },
  created() {
    this.inUsed = this.albumInfo.inUsed;
  },
  watch: {
    albumInfo(val) {
      this.inUsed = val.inUsed;
    },
    albumCheckedItemStatus(val) {
      this.$set(this.albumInfo, "checked", val);
    },
  },
  methods: {
    istop(id, isTop) {
      var str = isTop ? "" : "取消";
      this.$msgbox
        .confirm("是否" + str + "置顶？", "提示", {
          type: "warning",
          confirmButtonText: "确认",
        })
        .then(() => {
          var params={
            id:id,
            isTop:isTop
          }
          this.$request.put('/api/admin/photoAlbum/manage/updatePhotoAlbumTop',params).then((r) => {
            this.$message.success(`${str}置顶成功`);
            this.$emit('refresh');
          });
        })
        .catch(() => {});
    },
    // 遍历menulist
    getObj(list){
      var categoryId = this.albumInfo.categoryId
      for(var i=0;i<list.length;i++){
        if(list[i].id==categoryId){
          return list[i]
        }else if(list[i].children.length>0){
          var obj = this.getObj(list[i].children)
          if(obj){return obj}
          // return this.getObj(list[i].children)
        }
      }
      return null
    },
    getThemeName(){
      var obj = this.getObj(this.menuList)
      if(obj){
        return obj.name
      }else{
        return ""
      }
    },
    //选择某一项
    checkedItemChange(val) {
      if (val) {
        this.$emit("addCheckdItem", this.albumInfo.id);
      } else {
        this.$emit("reduceCheckdItem", this.albumInfo.id);
      }
    },
    //跳转详情页面
    toHomePage(id) {
      const { href } = this.$router.resolve({
        name: "albumHomepage",
        params: { moduleId: id },
      });
      window.open(href, "_blank");
    },
    //删除相册
    deleteAlbum() {
      this.$emit("deleteItem", this.albumInfo.id);
    },
    //单个启用/禁用相册
    operateAlbum(val) {
      if (val) {
        this.$request
          .put("/api/admin/photoAlbum/manage/updatePhotoAlbumStatus", {
            albumIds: [this.albumInfo.id],
            inUsed: this.inUsed,
          })
          .then((res) => {
            if (res.success) {
              this.$message.success("操作成功");
            }
          });
      } else {
        this.$request
          .put("/api/admin/photoAlbum/manage/updatePhotoAlbumStatus", {
            albumIds: [this.albumInfo.id],
            inUsed: this.inUsed,
          })
          .then((res) => {
            if (res.success) {
              this.$message.success("操作成功");
            }
          });
      }
    },
  },
};
</script>

<style scoped lang="less">
.topbtnbox {
    text-align: right;
    height: 18px;
    .zhidin {
      width: 50px;
      cursor: pointer;
    }
  }
</style>
