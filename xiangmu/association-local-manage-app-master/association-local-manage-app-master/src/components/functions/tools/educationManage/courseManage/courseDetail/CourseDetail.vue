<template>
    <el-container class="position-relative" style="width: 800px;height: 100%;font-size: 12px;">
        <el-header class="flex border-bottom" style="padding: 16px;">
            <p class="flex-fill-in-the-remaining-space" style="line-height: 32px;">
                <i class="el-icon-arrow-left" style="margin-right: 17px;"></i>课程详情
            </p>
        </el-header>
        <el-main style="padding: 16px 0;">
            <div class="flex border-bottom" style="padding: 0 16px 10px;">
                <div style="margin-right: 16px;" v-if="basicInfo.poster">
                    <el-image style="width: 160px; height: 100px" :src="basicInfo.poster" fit="contain"></el-image>
                </div>
                <div class="flex-fill-in-the-remaining-space" style="line-height: 32px;">
                    <div class="flex">
                        <p>{{basicInfo.title}}</p>
                        <p class="flex-fill-in-the-remaining-space text-align-right"><!--创建人：创建人--> 创建时间：{{basicInfo.createTime | yyyyMMdd}}</p>
                    </div>
                    <!--<div>
                        <el-button type="text" size="small" class="unset-padding" style="color: #555;"
                                   icon="el-icon-user-solid">26人学习
                        </el-button>
                        <el-button type="text" size="small" class="unset-padding" style="color: #555;"
                                   icon="el-icon-view">26人浏览
                        </el-button>
                        <el-button type="text" size="small" class="unset-padding" style="color: #555;"
                                   icon="el-icon-share">26人分享
                        </el-button>
                        <el-button type="text" size="small" class="unset-padding" style="color: #555;"
                                   icon="el-icon-star-off">26人收藏
                        </el-button>
                    </div>
                    <div class="flex">
                        课程评分
                        <div style="padding-top: 6px;">
                            <el-rate v-model="value" disabled text-color="#ff9900"></el-rate>
                        </div>
                    </div>-->
                    <div>
                        课程售价
                        <span style="color: red;"><i>￥</i>{{basicInfo.price}}</span>
                    </div>
                </div>
            </div>
            <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">课程简介</el-menu-item>
                <el-menu-item index="2">课程目录</el-menu-item>
                <el-menu-item index="3">评论</el-menu-item>
<!--                <el-menu-item index="4">订单</el-menu-item>-->
            </el-menu>
            <div style="height: calc(100%  - 190px);width: 100%;" class="position-relative">
                <div v-if="activeIndex === '4'" class="absolute-fill-parent">
                    <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border stripe>
                        <el-table-column fixed type="selection" width="55" align="center"></el-table-column>
                        <el-table-column fixed type="index" width="55" align="center" label="序号"></el-table-column>
                        <el-table-column label="订单编号" sortable></el-table-column>
                        <el-table-column label="金额/人民币(元)" sortable></el-table-column>
                        <el-table-column label="课程"></el-table-column>
                        <el-table-column label="用户"></el-table-column>
                        <el-table-column label="支付方式"></el-table-column>
                        <el-table-column label="时间" width="180px"></el-table-column>
                        <el-table-column label="状态">
                            <template>
                                <span style="color: #909399;">已退款</span>
                                <!--                                <span style="color: #67C23A;">已完成</span>-->
                                <!--                                <span style="color: #F56C6C;">待支付</span>-->
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" fixed="right" width="120px">
                            <el-tooltip effect="dark" content="原因" placement="top-start">
                                <el-button type="text" size="small" class="unset-padding" icon="el-icon-info"></el-button>
                            </el-tooltip>
                            <el-button type="text" size="small" class="unset-padding custom-el-button danger">退款
                            </el-button>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-else class="absolute-fill-parent">
                    <vue-scroll @handle-scroll="load">
                        <div v-show="activeIndex === '1'" style="padding: 10px;">
                            <div v-html="basicInfo.introduction"></div>
                        </div>
                        <div v-show="activeIndex === '2'" style="padding: 10px;">
                            <div v-if="basicInfo.type === 0 || basicInfo.type === 1">
                                <el-image style="width: 320px;height: 200px;" :src="basicInfo.resource"></el-image>
                            </div>
                            <div v-if="basicInfo.type === 2">
                                <catalog-list :list="catalogList"></catalog-list>
                            </div>
                        </div>
                        <div v-show="activeIndex === '3'" class="commentArea">
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
        </el-main>
    </el-container>
</template>

<script>
    import CatalogList from "./CatalogList";
    export default {
        name: "CourseDetail",
        components: {CatalogList},
        props: {id: String},
        data() {
            return {
                activeIndex: '1',//tab
                orderData: [],//订单表格

                basicInfo: {},//课程基本信息
                catalogList: [],

                offset: 0,
                commentList: [],
                commentTotal: 0
            }
        },
        created(){
            this.getInfo();
            this.getComment();
        },
        methods: {
            handleSelect(val) {
                this.activeIndex = val;
            },
            getInfo(){
                this.$request.get('/api/admin/onlineCourse/' + this.id).then(res=>{
                    if(res.success){
                        this.basicInfo = res.data;
                        if(res.data.type === 2){
                            this.catalogList = JSON.parse(res.data.catalog)
                        }
                    }
                })
            },
            getComment(){
                this.$request.get('/api/admin/comment/listComments', {
                    params: {
                        limit: 10,
                        offset: this.offset,
                        objectId: this.id
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
                            this.getComment();
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
                    this.getComment();
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .commentArea {
        padding: 20px 16px;

        .commentCont {
            width: 328px;
            box-sizing: border-box;
            line-height: 18px;
            padding: 20px 0 20px 36px;
        }
    }
</style>
