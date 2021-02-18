<template>
    <div class="position-relative">
        <el-checkbox class="position-absolute checkBox" v-model="trendItem.checkedItem"
                     @change="checkedTrend"/>
        <div class="pictures" v-if="pictureList.length > 0">
            <template v-if="pictureList.length === 1">
                <div :style="pictureStyle">
                    <el-image :src="pictureList[0]" style="width: 100%;height: 100%;" fit="cover"
                              :preview-src-list="pictureList"/>
                </div>
            </template>
            <template v-else-if="pictureList.length === 2">
                <div style="float: left;margin-right: 2px;" :style="picturesStyle">
                    <el-image :src="pictureList[0]" style="width: 100%;height: 100%;" fit="cover"
                              :preview-src-list="pictureList"/>
                </div>
                <div style="float: left;" :style="picturesStyle">
                    <el-image :src="pictureList[1]" style="width: 100%;height: 100%;" fit="cover"
                              :preview-src-list="pictureList"/>
                </div>
            </template>
            <template v-else>
                <div style="float: left;margin-right: 2px;" :style="picturesStyle">
                    <el-image :src="pictureList[0]" style="width: 100%;height: 100%;" fit="cover"
                              :preview-src-list="pictureList"/>
                </div>
                <div style="float: left;" :style="picturesStyle">
                    <div style="width: 100%;height: 84px;margin-bottom: 2px;">
                        <el-image :src="pictureList[1]" style="width: 100%;height: 100%;" fit="cover"
                                  :preview-src-list="pictureList"/>
                    </div>
                    <div class="position-relative" style="width: 100%;height: 84px;margin-bottom: 2px;">
                        <el-image :src="pictureList[2]" style="width: 100%;height: 100%;" fit="cover"
                                  :preview-src-list="pictureList"/>
                        <div class="position-absolute cursor-pointer addNum" style="width: 176px;" v-if="pictureList.length>3"
                             @click="openDetails">
                            + {{pictureList.length - 3}}
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="dynamicContent cursor-pointer" @click="openDetails">
            <div class="userInfo flex position-relative">
                <template>
                    <el-avatar v-if="trendItem.headImg" :size="32" :src="trendItem.headImg"/>
                    <el-avatar v-else :size="32" :src="noavatar"/>
                </template>
                <div class="flex-fill-in-the-remaining-space" style="margin-left: 16px;" @click.stop>
                    <p class="text-overflow" :title="trendItem.name">{{trendItem.name}}</p>
                    <p style="font-size: 10px;color: #999999;">{{trendItem.createTime | yyyyMMddHHmm}}</p>
                </div>
                <div class="status position-absolute" v-if="trendItem.exchangeStatus === 0"
                     style="background-color: #409EFF;">
                    对接中
                </div>
                <div class="status position-absolute" v-if="trendItem.exchangeStatus === 1"
                     style="background-color: #F2684F;">
                    已关闭
                </div>
                <div class="status position-absolute" v-if="trendItem.exchangeStatus === 2"
                     style="background-color: #67C23A;">
                    对接成功
                </div>
                <div class="status position-absolute" v-if="trendItem.exchangeStatus === 3"
                     style="background-color: #909399;">
                    对接失败
                </div>
            </div>
            <div class="details" :style="{height:pictureList.length===0?'210px':'40px'}">
                <div class="allDetails position-relative" :style="{height:pictureList.length===0?'200px':'40px'}"
                     v-if="trendItem.content">
                    <p class="information-detailsContent" :style="{lineClamp:pictureList.length===0?'10':'2'}">
                        <span style="color: #F2684F;">#{{trendItem.classTitle}}#</span>{{trendItem.content}}
                    </p>
                </div>
                <p v-else class="information-notDetails text-align-center flex">
                    <el-image :src="nodata" style="width: 120px;height: 40px;margin-right: 16px;"/>
                    <span>木有文字内容...</span>
                </p>
            </div>
            <div class="publishSite text-overflow" @click.stop :title="trendItem.address" style="margin-top: 16px;">
                <template v-if="trendItem.address">
                    <i class="el-icon-location-outline" style="margin-right: 6px;"/>{{trendItem.address}}
                </template>
            </div>
            <div class="publishSite text-overflow" @click.stop style="margin: 5px 0;">
                <template v-if="trendItem.phone">
                    <i class="el-icon-phone" style="margin-right: 6px;"/>{{trendItem.phone}}
                </template>
            </div>
            <div class="operate flex">
                <div class="flex-fill-in-the-remaining-space flex">
                    <p class="cursor-pointer" @click.stop>
                        <i class="iconfont icon-fenxiang"/>
                        {{trendItem.shareNum}}
                    </p>
                </div>
                <div class="flex-fill-in-the-remaining-space flex flex-end">
                    <p class="cursor-pointer" @click.stop>
                        <i class="iconfont icon-dongtai"/>
                        信息对接
                    </p>
                    <p class="cursor-pointer" style="margin-left: 25px;" @click.stop="$emit('deleteItem',trendItem.id)">
                        <i class="iconfont icon-xiazai14"/>
                        删除
                    </p>
                </div>
            </div>
        </div>
        <el-drawer :visible.sync="trendDetails" append-to-body :show-close="false" size="400px">
            <div slot="title" class="flex" style="line-height: 32px;">
                <div class="flex-fill-in-the-remaining-space">信息对接</div>
                <div>
                    <el-button size="small" type="danger" @click="$emit('deleteItem',trendItem.id)">删除</el-button>
                </div>
            </div>
            <trend-details :trendItem="trendItem"/>
        </el-drawer>
    </div>
</template>

<script>
    import TrendDetails from './TrendDetails'

    export default {
        name: "TrendItem",
        components: {TrendDetails},
        props: ["trendItem", "checkedItemStatus"],
        data() {
            return {
                nodata: require('../../../../../assets/nodata.png'),//无内容
                noavatar: require('../../../../../assets/default.jpg'),//无头像
                pictureList: [],//图片数组
                pictureStyle: {
                    width: '357px',
                    height: '170px'
                },
                picturesStyle: {
                    width: '176px',
                    height: '170px',
                },
                trendDetails: false,//动态详情抽屉
            }
        },
        created() {
            this.getPictureList()
        },
        watch: {
            checkedItemStatus(val) {
                this.$set(this.trendItem, "checkedItem", val);
            }
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
                    this.$emit('addCheckedItem', this.trendItem.id)
                } else {
                    this.$emit('reduceCheckedItem', this.trendItem.id)
                }
            },
            //打开详情
            openDetails() {
                this.trendDetails = true;
            }
        }
    }
</script>

<style scoped>

</style>
