<template>
    <div class="trendDetails position-relative">
        <div class="inner position-absolute flex flex-column">
            <div class="userInfo flex">
                <div class="flex-fill-in-the-remaining-space flex">
                    <template>
                        <el-avatar v-if="trendItem.headImg" :size="40" :src="trendItem.headImg"
                                   style="margin-right: 10px;"></el-avatar>
                        <el-avatar v-else :size="40" :src="noavatar" style="margin-right: 10px;"></el-avatar>
                    </template>
                    <div style="height: 40px;line-height: 20px;">
                        <p style="height: 20px;">{{trendItem.name}}</p>
                        <p class="time-style">{{trendItem.createTime | yyyyMMddHHmm}}</p>
                    </div>
                </div>
                <div class="flex" style="line-height: 40px;">
                    <p style="margin-right: 16px;"><i class="el-icon-share" style="margin-right: 4px;"></i>{{trendItem.shareNum}}
                    </p>
                    <div class="status-wrap">
                        <p class="status" v-if="trendItem.exchangeStatus === 0"
                           style="background-color: #409EFF;">
                            对接中 </p>
                        <p class="status" v-if="trendItem.exchangeStatus === 1"
                           style="background-color: #F2684F;">
                            已关闭 </p>
                        <p class="status" v-if="trendItem.exchangeStatus === 2"
                           style="background-color: #67C23A;">
                            对接成功 </p>
                        <p class="status" v-if="trendItem.exchangeStatus === 3"
                           style="background-color: #909399;">
                            对接失败 </p>
                    </div>
                </div>
            </div>
            <div class="content">
                <span style="color: #F56C6C;margin-right: 6px;">#{{trendItem.classTitle}}#</span>
                {{trendItem.content}}
            </div>
            <div class="pictureList flex flex-wrap">
                <div v-for="item in pictureList" :key="item" class="pictureWrap">
                    <el-image :src="item" style="width: 100%;height: 100%;" fit="cover"
                              :preview-src-list="pictureList"></el-image>
                </div>
            </div>
            <p class="location" v-if="trendItem.address" :title="trendItem.address">
                <i class="el-icon-location-outline" style="margin-right: 6px;"></i>{{trendItem.address}}
            </p>
            <p class="location" v-if="trendItem.phone" style="margin-top: 10px;">
                <i class="el-icon-phone" style="margin-right: 6px;"></i>{{trendItem.phone}}
            </p>
            <div class="tab-head flex">
                <div class="tabItem cursor-pointer active">
                    评论（{{commentTotal}}）
                </div>
            </div>
            <div class="tabCont flex-fill-in-the-remaining-space">
                <vue-scroll @handle-scroll="load">
                    <div class="commentArea">
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
                </vue-scroll>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TrendDetails",
        props: ["trendItem"],
        data() {
            return {
                pictureList: [],//图片数组
                noavatar: require('../../../../../assets/default.jpg'),//无头像
                tabIndex: 'second',

                offset: 0,
                commentList: [],
                commentTotal: 0
            }
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
            getCommentList() {
                this.$request.get('/api/admin/comment/listComments', {
                    params: {
                        limit: 10,
                        offset: this.offset,
                        objectId: this.trendItem.id
                    }
                }).then(res => {
                    if (res.success) {
                        this.commentList = this.commentList.concat(res.data.list);
                        this.commentTotal = res.data.total;
                    }
                })
            },
            deleteComment(id) {
                this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/comment/deleteComment', {params: {id: id}}).then(res => {
                        if (res.success) {
                            this.$message.success('评论已删除');
                            this.commentList = [];
                            this.offset = 0;
                            this.getCommentList();
                        }
                    })
                }).catch(() => {
                })
            },
            load(vertical, horizontal, nativeEvent) {
                let {scrollTop} = vertical;
                let scrollHeight = nativeEvent.target.scrollHeight;
                let clientHeight = nativeEvent.target.clientHeight;
                if (this.commentList.length < this.commentTotal && scrollTop === scrollHeight - clientHeight) {
                    this.offset += 10;
                    this.getCommentList();
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .trendDetails {
        width: 100%;
        height: calc(100% - 20px);
        font-size: 14px;
        color: #66696C;

        .inner {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 0 20px;

            .time-style {
                font-size: 12px;
                color: #999999;
            }

            .userInfo {
                .status-wrap {
                    width: 64px;
                    height: 26px;
                    overflow: hidden;
                    margin-top: 7px;

                    .status {
                        width: 90px;
                        height: 26px;
                        border-radius: 26px;
                        color: #FFFFFF;
                        line-height: 26px;
                        box-sizing: border-box;
                        padding-left: 10px;
                    }
                }

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
                color: #409EFF;
            }

            .tab-head {
                width: 100%;
                height: 40px;
                box-sizing: border-box;
                border-bottom: 2px solid #E4E7ED;

                .tabItem {
                    margin: 0 20px 0 0;
                    height: 38px;
                    line-height: 38px;
                    border-bottom: 2px solid transparent;

                    &.active {
                        color: #409EFF;
                        border-bottom-color: #409EFF;
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
                                background-color: #409EFF;
                                margin: 0 10px 10px 0;
                            }
                        }

                        .remark {
                            line-height: 18px;
                            background-color: #F2F6FC;
                            padding: 16px;
                        }
                    }
                }
            }
        }
    }
</style>