<template>
  <div class="trendDetails position-relative">
    <div class="inner position-absolute flex flex-column">
      <div class="userInfo flex">
        <div class="flex-fill-in-the-remaining-space flex">
          <template>
            <el-avatar v-if="trendItem.headImg" :size="40" :src="trendItem.headImg" style="margin-right: 10px;"></el-avatar>
            <el-avatar v-else :size="40" :src="noavatar" style="margin-right: 10px;"></el-avatar>
          </template>
          <div style="height: 40px;line-height: 20px;">
            <p style="height: 20px;">{{trendItem.name}}</p>
            <p class="time-style">{{trendItem.createTime | yyyyMMddHHmm}}</p>
          </div>
        </div>
        <div class="flex" style="line-height: 40px;">
          <p style="margin-right: 26px;"><i class="iconfont icon-zan" style="margin-right: 4px;"></i>{{trendItem.praiseNum}}
          </p>
          <!-- <p><i class="iconfont icon-comment" style="margin-right: 4px;"></i>{{trendItem.reviewNum}}</p> -->
        </div>
      </div>
      <div class="content">{{trendItem.content}}</div>
      <div class="pictureList flex flex-wrap">
        <div v-for="item in pictureList" :key="item" class="pictureWrap">
          <el-image :src="item" style="width: 100%;height: 100%;" fit="cover" :preview-src-list="pictureList"></el-image>
        </div>
      </div>
      <p class="location" v-if="trendItem.address" :title="trendItem.address">
        <i class="el-icon-location-outline" style="margin-right: 6px;"></i>{{trendItem.address}}
      </p>
      <!-- <div class="tab-head flex">
                <div class="tabItem cursor-pointer" :class="{active:tabIndex === 'first'}"
                     @click="tabIndex = 'first'">
                    评论（{{trendItem.reviewNum}}）
                </div>
                <div class="tabItem cursor-pointer" :class="{active:tabIndex === 'second'}"
                     @click="tabIndex = 'second'">被举报记录
                </div>
            </div>
            <div class="tabCont flex-fill-in-the-remaining-space">
                <vue-scroll @handle-scroll="load">
                    <div class="commentArea" v-if="tabIndex === 'first'">
                        <div v-for="item in commentList" :key="item.id">
                            <div class="reviewer flex">
                                <div>
                                    <el-avatar v-if="item.userHeadImg" :size="36" :src="item.userHeadImg"
                                               style="margin-right: 10px;"></el-avatar>
                                    <el-avatar v-else :size="36" :src="noavatar"
                                               style="margin-right: 10px;"></el-avatar>
                                </div>
                                <div class="flex-fill-in-the-remaining-space"
                                     style="height: 36px;line-height: 18px;font-size: 12px;">
                                    <p style="height: 20px;">{{item.userName}}</p>
                                    <div class="flex">
                                        <p class="flex-fill-in-the-remaining-space time-style">{{item.createTime |
                                            yyyyMMddHHmm}}</p>
                                        <div>
                                            <el-button size="small" type="text"
                                                       class="unset-padding custom-el-button danger"
                                                       @click="deleteComment(item.id)">删除
                                            </el-button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="commentCont">
                                <template v-if="item.toUserName">回复<span
                                        style="color: #097CEF;">{{item.toUserName}}</span>：
                                </template>
                                {{item.content}}
                            </div>
                        </div>
                    </div>
                    <div class="informArea" v-if="tabIndex === 'second'">
                        <div class="informer flex">
                            <div class="flex-fill-in-the-remaining-space flex">
                                <template>
                                    &lt;!&ndash;                                            <el-avatar v-if="headImg" :size="36" :src="headImg"&ndash;&gt;
                                    &lt;!&ndash;                                                       style="margin-right: 10px;"></el-avatar>&ndash;&gt;
                                    &lt;!&ndash;                                            <el-avatar v-else :size="36" :src="noavatar"&ndash;&gt;
                                    &lt;!&ndash;                                                       style="margin-right: 10px;"></el-avatar>&ndash;&gt;
                                </template>
                                <div style="height: 30px;line-height: 15px;font-size: 12px;">
                                    <p style="height: 20px;">姓名</p>
                                    &lt;!&ndash;                                    <p>{{时间 | yyyyMMddHHmm}}</p>&ndash;&gt;
                                    <p class="time-style">2017-03-04 12:03:02</p>
                                </div>
                            </div>
                            <div>
                                <span>待处理</span>
                                <span>已处理</span>
                                <span>已忽略</span>
                            </div>
                        </div>
                        <div class="informDescription">
                            <p>举报说明内容</p>
                            <el-button type="text" class="">查看图片（3）</el-button>
                            <div class="pictureArea">
                                <div class="pictureWrap"></div>
                            </div>
                            <div class="remark">
                                <p>处理备注：</p>
                                <p>备注内容备注内容备注内容备注内容
                                    备注内容备注内容备注内容备注内容备注内容
                                    备注内容备注内容备注内容备注内容备注内容</p>
                            </div>
                        </div>
                    </div>
                </vue-scroll>
            </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "TrendDetails",
  props: ["trendItem"],
  data() {
    return {
      noavatar: require("../../../../../assets/default.jpg"), //无头像
      pictureList: [], //图片数组
      tabIndex: "first", //选项卡

      limit: 10, //查询条数
      offset: 0, //偏移量
      commentList: [], //回复列表
      listCount: 0,
    };
  },
  created() {
    this.getPictureList();
    this.getCommentList();
  },
  methods: {
    getPictureList() {
      if (this.trendItem.otherContent) {
        this.pictureList = JSON.parse(this.trendItem.otherContent).config;
      }
    },
    //获取评论
    getCommentList() {
      this.$request
        .get("/api/admin/comment/listComments", {
          params: {
            limit: this.limit,
            objectId: this.trendItem.id,
            offset: this.offset,
          },
        })
        .then((res) => {
          if (res.success) {
            this.commentList = this.commentList.concat(res.data.list);
            this.listCount = res.data.total;
          }
        });
    },
    //滚动加载
    load(vertical, horizontal, nativeEvent) {
      let { scrollTop } = vertical;
      let scrollHeight = nativeEvent.target.scrollHeight;
      let clientHeight = nativeEvent.target.clientHeight;
      if (
        this.commentList.length < this.listCount &&
        scrollTop === scrollHeight - clientHeight
      ) {
        this.offset += 20;
        this.getCommentList();
      }
    },
    //删除评论
    deleteComment(id) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/comment/deleteComment", { params: { id: id } })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.commentList = [];
                this.offset = 0;
                this.getCommentList();
              }
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="less">
.trendDetails {
  width: 100%;
  height: calc(100% - 20px);
  font-size: 14px;
  color: #66696c;

  .inner {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;

    .time-style {
      font-size: 12px;
      color: #999999;
    }

    .content {
      padding: 16px 0;
      line-height: 18px;
    }

    .pictureList {
      .pictureWrap {
        width: 100px;
        height: 100px;
        margin: 0 10px 10px 0;
      }
    }

    .location {
      font-size: 11px;
      color: #409eff;
    }

    .tab-head {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      border-bottom: 2px solid #e4e7ed;

      .tabItem {
        margin: 0 20px 0 0;
        height: 38px;
        line-height: 38px;
        border-bottom: 2px solid transparent;

        &.active {
          color: #409eff;
          border-bottom-color: #409eff;
        }
      }
    }

    .tabCont {
      width: 100%;
      height: 100%;

      .commentArea {
        padding: 20px 16px;

        .commentCont {
          width: 328px;
          box-sizing: border-box;
          line-height: 18px;
          padding: 20px 0 20px 36px;
        }
      }

      .informArea {
        padding: 20px 16px;

        .informDescription {
          padding: 16px 0 16px 40px;
          line-height: 18px;

          .pictureArea {
            .pictureWrap {
              width: 100px;
              height: 100px;
              background-color: #409eff;
              margin: 0 10px 10px 0;
            }
          }

          .remark {
            line-height: 18px;
            background-color: #f2f6fc;
            padding: 16px;
          }
        }
      }
    }
  }
}
</style>
