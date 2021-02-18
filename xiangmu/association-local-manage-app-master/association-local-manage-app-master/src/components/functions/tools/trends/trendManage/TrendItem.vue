<template>
  <div class="position-relative">
    <el-checkbox class="position-absolute checkBox" v-model="trendItem.checkedItem" @change="checkedTrend" />
    <div class="pictures" v-if="pictureList.length > 0">
      <template v-if="pictureList.length === 1">
        <div :style="pictureStyle">
          <el-image :src="pictureList[0]" style="width: 100%;height: 100%;" fit="cover" :preview-src-list="pictureList" />
        </div>
      </template>
      <template v-else-if="pictureList.length === 2">
        <div style="float: left;margin-right: 2px;" :style="picturesStyle">
          <el-image :src="pictureList[0]" style="width: 100%;height: 100%;" fit="cover" :preview-src-list="pictureList" />
        </div>
        <div style="float: left;" :style="picturesStyle">
          <el-image :src="pictureList[1]" style="width: 100%;height: 100%;" fit="cover" :preview-src-list="pictureList" />
        </div>
      </template>
      <template v-else>
        <div style="float: left;margin-right: 2px;" :style="picturesStyle">
          <el-image :src="pictureList[0]" style="width: 100%;height: 100%;" fit="cover" :preview-src-list="pictureList" />
        </div>
        <div style="float: left;" :style="picturesStyle">
          <div style="width: 100%;height: 84px;margin-bottom: 2px;">
            <el-image :src="pictureList[1]" style="width: 100%;height: 100%;" fit="cover" :preview-src-list="pictureList" />
          </div>
          <div class="position-relative" style="width: 100%;height: 84px;margin-bottom: 2px;">
            <el-image :src="pictureList[2]" style="width: 100%;height: 100%;" fit="cover" :preview-src-list="pictureList" />
            <div class="position-absolute cursor-pointer addNum" v-if="pictureList.length>3" @click="openDetails">
              + {{pictureList.length - 3}}
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="dynamicContent cursor-pointer" @click="openDetails">
      <div class="userInfo flex">
        <template>
          <el-avatar v-if="trendItem.headImg" :size="32" :src="trendItem.headImg" />
          <el-avatar v-else :size="32" :src="noavatar" />
        </template>
        <div style="margin-left: 16px;" @click.stop>
          <p class="text-overflow" :title="trendItem.name">{{trendItem.name}}</p>
          <p style="font-size: 10px;color: #999999;">{{trendItem.createTime | yyyyMMddHHmm}}</p>
        </div>
      </div>
      <div class="details" :style="{height:pictureList.length===0?'230px':'60px'}">
        <div class="allDetails position-relative" :style="{height:pictureList.length===0?'220px':'60px'}" v-if="trendItem.content">
          <p class="detailsContent" :style="{lineClamp:pictureList.length===0?'11':'3'}">
            {{trendItem.content}}
          </p>
        </div>
        <p v-else class="notDetails text-align-center flex">
          <el-image :src="nodata" style="width: 120px;height: 60px;margin-right: 16px;" />
          <span>木有文字内容...</span>
        </p>
      </div>
      <div class="publishSite text-overflow" :title="trendItem.address" style="margin: 8px 0 15px;" @click.stop>
        <template v-if="trendItem.address">
          <i class="el-icon-location-outline" style="margin-right: 6px;" />{{trendItem.address}}
        </template>
      </div>
      <div class="operate flex">
        <div class="flex">
          <p @click.stop class="cursor-pointer">
            <i class="iconfont icon-zan" />
            {{trendItem.praiseNum}}
          </p>
          <!-- <p @click.stop style="margin-left: 25px;" @click="openDetails" class="cursor-pointer">
            <i class="iconfont icon-comment" />
            {{trendItem.reviewNum}}
          </p> -->
        </div>
        <div class="flex-fill-in-the-remaining-space flex flex-end operateBox">
          <!-- <p @click.stop class="cursor-pointer">
            <i class="iconfont icon-dongtai" />
            动态
          </p> -->
          <p v-if="trendItem.status==0||trendItem.status==2" class="cursor-pointer" style="margin-left: 25px;" @click.stop="$emit('rejectComment',trendItem.id)">
            <i class="iconfont icon-menu_reject" />
            拒绝
          </p>
          <p v-if="trendItem.status==0||trendItem.status==3" class="cursor-pointer" style="margin-left: 25px;" @click.stop="$emit('passComment',trendItem.id)">
            <i class="iconfont icon-shenhetongguo_huaban" />
            通过
          </p>
          <p class="cursor-pointer" style="margin-left: 25px;" @click.stop="$emit('deleteItem',trendItem.id)">
            <i class="iconfont icon-xiazai14" />
            删除
          </p>
        </div>
      </div>
    </div>
    <el-drawer :visible.sync="trendDetails" append-to-body :show-close="false" size="400px">
      <div slot="title" class="flex" style="line-height: 32px;">
        <div class="flex-fill-in-the-remaining-space">动态</div>
        <div>
          <el-button v-if="trendItem.status==0||trendItem.status==2" size="small" @click="$emit('rejectComment',trendItem.id)">拒绝</el-button>
          <el-button v-if="trendItem.status==0||trendItem.status==3" size="small" @click="$emit('passComment',trendItem.id)">通过</el-button>
          <el-button size="small" type="danger" @click="$emit('deleteItem',trendItem.id)">删除</el-button>
        </div>
      </div>
      <trend-details :trendItem="trendItem" />
    </el-drawer>
  </div>
</template>

<script>
// 动态 审核状态：0-待审核；1-已删除；2-已通过；3-已驳回；
import TrendDetails from "./TrendDetails";

export default {
  name: "TrendItem",
  components: { TrendDetails },
  props: ["trendItem", "checkedItemStatus"],
  data() {
    return {
      nodata: require("../../../../../assets/nodata.png"), //无内容
      noavatar: require("../../../../../assets/default.jpg"), //无头像
      pictureList: [], //图片数组
      pictureStyle: {
        width: "323px",
        height: "170px",
      },
      picturesStyle: {
        width: "159px",
        height: "170px",
      },
      trendDetails: false, //动态详情抽屉
    };
  },
  created() {
    this.getPictureList();
  },
  watch: {
    checkedItemStatus(val) {
      this.$set(this.trendItem, "checkedItem", val);
    },
  },
  methods: {
    getPictureList() {
      if (this.trendItem.otherContent) {
        this.pictureList = JSON.parse(this.trendItem.otherContent).config;
      }
    },
    //选择某一项动态
    checkedTrend(val) {
      if (val) {
        this.$emit("addCheckdItem", this.trendItem.id);
      } else {
        this.$emit("reduceCheckdItem", this.trendItem.id);
      }
    },
    //打开详情
    openDetails() {
      this.trendDetails = true;
    },
  },
};
</script>

<style lang="less" scoped>
.operateBox{
  align-items: center;
  p{
    line-height: 31px;
    align-items: center;
  }
}
</style>
