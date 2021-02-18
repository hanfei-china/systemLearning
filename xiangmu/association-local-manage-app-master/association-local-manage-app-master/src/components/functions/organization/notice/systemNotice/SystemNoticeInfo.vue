<template>
    <div style="height: 100%;" class="position-relative">
        <el-container class="absolute-fill-parent">
            <el-header class="unset-horizontal-padding border-top position-relative">
                <el-menu mode="horizontal" :default-active="panel" @select="panelChange">
                    <el-menu-item index="content">公告内容</el-menu-item>
                    <el-menu-item index="details">审批记录</el-menu-item>
                </el-menu>
                <div v-show="flowInfo.state === 2" class="border-top flex flex-column flex-center position-absolute"
                     style="top: 0;right: 16px;bottom: 0;">
                    <div class="text-align-right">
                        <el-button icon="el-icon-edit" type="primary" @click="$emit('edit',flowInfo)" size="small" >修改</el-button>
                    </div>
                </div>
            </el-header>
            <el-main class="unset-padding position-relative">
                <vue-scroll :ops="{scrollPanel:{scrollingX: false}}" v-show="panel === 'content'">
                    <div class="notice-content" style="padding: 16px;" v-html="flowInfo.record.content"></div>
                </vue-scroll>
                <vue-scroll :ops="{scrollPanel:{scrollingX: false}}" v-show="panel === 'details'">
                    <div style="padding: 16px;">
                        <el-timeline>
                            <el-timeline-item
                                    v-for="(activity, index) in flowDetails"
                                    :key="index" :icon="activity.icon" :color="activity.color" size="large"
                                    :timestamp="activity.createTime | yyyyMMddHHmmss">
                                <div v-html="activity.content"></div>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </vue-scroll>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "SystemNoticeInfo",
        props:{
            flowInfo: Object,
        },
        data(){
            return {
                panel: 'content'
            }
        },
        computed:{
            flowDetails(){
                let firstDetail = {
                    createTime: this.flowInfo.beginTime,
                    content:`<div><i style="color:#E6A23C;" class="el-icon-s-flag"></i>【我】<span class="flow-detail-primary-state">提交</span> 公告发布申请</div>`,
                    icon: 'el-icon-more',
                    color: '#409EFF',
                    id: '',
                };

                let {state,record,id,createTime,opinion,adminName} = this.flowInfo;
                let item = {createTime,id,record};

                let branchName = '总会' ;

                if(state === 0){
                    item.content = `下一级审批人：【${branchName}】管理员`;
                    item.icon = 'el-icon-loading';
                    item.color = '#409EFF';
                }

                if(state === 1){
                    item.content = `<div>【${branchName}】管理员【${adminName}】
                                                <span class="flow-detail-success-state">通过</span> 流程
                                                ${opinion? `<div class="flex" style="font-size: 13px;padding-top: 4px;">
                                                                <div style="color:#909399;">处理意见：</div>
                                                                <div style="color:#F56C6C;">${opinion}</div>
                                                            </div>` : ''}
                                            </div>`;
                    item.icon = 'el-icon-check';
                    item.color = '#67C23A';
                }

                if(state === 2){
                    item.content = `<div>【${branchName}】管理员【${adminName}】
                                                <span class="flow-detail-danger-state">驳回</span> 流程
                                                ${opinion? `<div class="flex" style="font-size: 13px;padding-top: 4px;">
                                                                <div style="color:#909399;">处理意见：</div>
                                                                <div style="color:#F56C6C;">${opinion}</div>
                                                            </div>` : ''}
                                            </div>`;
                    item.icon = 'el-icon-close';
                    item.color = '#F56C6C';
                }

                return [firstDetail,item];
            }
        },
        methods:{
            panelChange(panel){
                this.panel = panel;
            },
        }
    }
</script>
<style lang="less">
    .notice-content{
        img{
            max-width: 100%;
        }
    }
</style>
