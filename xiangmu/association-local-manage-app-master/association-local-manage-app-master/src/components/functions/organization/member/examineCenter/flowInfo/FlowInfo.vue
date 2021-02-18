<template>
    <el-container style="height: 100%;" class="position-relative">
        <el-header class="unset-horizontal-padding border-top">
            <el-menu mode="horizontal" :default-active="panel" @select="panelChange">
                <el-menu-item index="info" v-if="[0,1,9].indexOf(flowInfo.type) > -1">审批信息</el-menu-item>
                <el-menu-item index="info" v-if="flowInfo.type===2&&flowInfo.applicationFormId">会员信息</el-menu-item>
                <el-menu-item index="details">审批记录</el-menu-item>
            </el-menu>
        </el-header>
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent" v-show="panel === 'info'">
                <member-auth-info v-if="[0,1,2].indexOf(flowInfo.type) > -1&&flowInfo.applicationFormId"
                                  :user-id="flowInfo.userId" :record-type="flowInfo.type"
                                  :application-form-id="flowInfo.applicationFormId" :record="record"/>
                <examine-notice-info v-if="flowInfo.type === 9" :record="record"/>
            </div>
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
        <el-footer v-if="processable" class="border-top flex flex-column flex-center">
            <div class="text-align-right">
                <el-button icon="el-icon-success" type="primary" @click="agree" size="small" >批准</el-button>
                <el-button icon="el-icon-error" type="danger" size="small" @click="disagree">驳回</el-button>
            </div>
        </el-footer>
        <el-dialog :title="`${operator === 1 ? '批准' : '驳回'}申请`" :visible.sync="opinionVisible" append-to-body :close-on-click-modal="false" width="600px">
            <el-form label-width="80px">
                <el-form-item v-if="duesStandardTypeShow" label="会费标准" required>
                    <dues-type-choose style="width: 100%;" v-model="duesStandardType"/>
                </el-form-item>
                <el-form-item label="处理意见" :required="operator === 2">
                    <el-input v-model="opinion" type="textarea" :rows="6" :maxLength="200" resize="none" placeholder="请输入处理意见，200字以内"></el-input>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="closeOpinion">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submit">确定</el-button>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>
    import MemberAuthInfo from "./children/MemberAuthInfo";
    import ExamineNoticeInfo from "./children/ExamineNoticeInfo";
    import DuesTypeChoose from "../../../duesTypeManage/DuesTypeChoose";
    export default {
        name: "FlowInfo",
        components: {DuesTypeChoose, ExamineNoticeInfo, MemberAuthInfo},
        props:{
            flowInfo: Object,
            processable:{
                type: Boolean,
                default: true
            }
        },
        created() {
            let {type} = this.flowInfo;
            if([0,1,9].indexOf(type) <= -1){
                this.panel = 'details';
            }
        },
        data(){
            return {
                flowDetails: [],
                originalFlowDetails: [],

                panel: 'info',

                opinion: '',
                duesStandardType: '',
                opinionVisible: false,
                operator: null
            }
        },
        computed:{
            firstDetail(){
                if(this.originalFlowDetails.length > 1){
                    return this.originalFlowDetails[0];
                }else{
                    return null;
                }
            },
            destinationBranch(){
                if(this.firstDetail){
                    return this.firstDetail.destinationBranch;
                }else {
                    return null;
                }
            },
            duesStandardTypeShow(){
                if(this.operator === 1){
                    let type = this.flowInfo.type;
                    if(type === 4){
                        return this.branchId === this.destinationBranch;
                    } else if([1,8].indexOf(type) > -1){
                        return !!this.branchId;
                    }
                }
                return false;
            },
            branchId(){
                return this.$store.state.branchId;
            },
            adminId(){
                return this.$store.state.loginUser.adminId;
            },
            name(){
                return this.flowInfo.flowApplyUser;
            },
            flowTitle(){
                switch (this.flowInfo.type) {
                    case 0:
                    case 1:
                        return '会员资料认证申请';
                    case 2:
                    case 3:
                        return '会员入会申请';
                    case 4:
                        return '会籍分会变更申请';
                    case 5:
                        return '退出分会申请';
                    case 6:
                        return '退出协会申请';
                    case 7:
                        return '会员资料变更申请';
                    case 8:
                        return '加入会籍分会申请';
                    case 9:
                        return '收费公告发布申请';
                    default:
                        return '';
                }
            },
            flowType(){
                return this.flowInfo.type;
            },
            flowDetailsId(){
                let length = this.flowDetails.length;

                if(length > 0){
                    return this.flowDetails[length-1].id;
                }

                return '';
            },
            record(){
                let length = this.flowDetails.length;

                if(length > 0){
                    return this.flowDetails[length-1].record;
                }

                return '{}';
            }
        },
        methods:{
            getFlowDetails(){
                this.$request.get('/api/admin/flow/getFlowDetails',{params:{flowId: this.flowInfo.id}}).then(res=>{

                    this.originalFlowDetails = res.data;

                    let firstContent = `<div>${this.name} <span class="flow-detail-primary-state">提交</span> ${this.flowTitle}</div>`;

                    let firstDetail = {
                        createTime: this.flowInfo.beginTime,
                        content:'',
                        icon: 'el-icon-more',
                        color: '#409EFF',
                        id: '',
                    };



                    let flowDetails = [];

                    res.data.forEach((detail,index)=>{
                        let {state,adminId,record,id,createTime,opinion,applyReason} = detail;
                        let item = {createTime,id,record};
                        let branchName = detail.verifyBranchName || '总会';
                        let adminName = detail.adminName || '';

                        if(index === 0){
                            if(this.flowType === 2){
                                firstContent = `<div>${this.name} <span class="flow-detail-primary-state">提交</span> 加入【${branchName}】入会申请</div>`;
                            }

                            if(this.flowType === 3 && record){
                                let _contact = JSON.parse(record);
                                firstDetail.content += `
                                                        <div class="flex" style="font-size: 13px;padding-top: 4px;">
                                                            <div style="color:#909399;width:65px;text-align: right;">联系人：</div>
                                                            <div class="flex-fill-in-the-remaining-space">${_contact.contactPerson}</div>
                                                        </div>
                                                        <div class="flex" style="font-size: 13px;padding-top: 4px;">
                                                            <div style="color:#909399;width:65px;text-align: right;">手机号：</div>
                                                            <div class="flex-fill-in-the-remaining-space">${_contact.mobilePhone}</div>
                                                        </div><div class="flex" style="font-size: 13px;padding-top: 4px;">
                                                            <div style="color:#909399;width:65px;text-align: right;">固定电话：</div>
                                                            <div class="flex-fill-in-the-remaining-space">${_contact.telephone}</div>
                                                        </div><div class="flex" style="font-size: 13px;padding-top: 4px;">
                                                            <div style="color:#909399;width:65px;text-align: right;">电子邮箱：</div>
                                                            <div class="flex-fill-in-the-remaining-space">${_contact.email}</div>
                                                        </div>`;
                            }

                            if(applyReason){
                                firstDetail.content += `<div class="flex" style="font-size: 13px;padding-top: 4px;">
                                                        <div style="color:#909399;">申请备注：</div>
                                                        <div class="flex-fill-in-the-remaining-space">${applyReason}</div>
                                                    </div>`;
                            }

                        }

                        detail.name = detail.adminName || '';
                        if(state === 0){
                            item.content = `下一级审批人：【${branchName}${this.flowType === 2 ? ' / 总会' : ''}】管理员`;
                            item.icon = 'el-icon-loading';
                            item.color = '#409EFF';
                        }

                        if(state === 1){
                            item.content = `<div>${this.adminId === adminId ? '<i style="color:#E6A23C;" class="el-icon-s-flag"></i>' : ''}管理员【${adminName}】
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
                            item.content = `<div>${this.adminId === adminId ? '<i style="color:#E6A23C;" class="el-icon-s-flag"></i>' : ''}<i class="el-icon-s-check"></i>管理员【${adminName}】
                                                <span class="flow-detail-danger-state">驳回</span> 流程
                                                ${opinion? `<div class="flex" style="font-size: 13px;padding-top: 4px;">
                                                                <div style="color:#909399;">处理意见：</div>
                                                                <div style="color:#F56C6C;">${opinion}</div>
                                                            </div>` : ''}
                                            </div>`;
                            item.icon = 'el-icon-close';
                            item.color = '#F56C6C';
                        }

                        flowDetails.push(item);
                    });

                    firstDetail.content = firstContent;

                    this.flowDetails = [firstDetail].concat(flowDetails);
                })
            },
            panelChange(panel){
                this.panel = panel;
            },
            agree(){
                this.operator = 1;
                this.opinionVisible = true;
            },
            disagree(){
                this.operator = 2;
                this.opinionVisible = true;
            },
            closeOpinion(){
                this.opinionVisible = false;
                this.operator = null;
            },
            submit(){
                if(this.duesStandardTypeShow && !this.duesStandardType){
                    this.$message.warning(`请选择会费标准`);
                    return;
                }

                if(this.operator === 2 && !this.opinion){
                    this.$message.warning(`请输入处理意见`);
                    return;
                }

                this.$request.post('/api/admin/flow/approveFlow',{
                    flowDetailsId: this.flowDetailsId,
                    operator: this.operator,
                    opinion: this.opinion,
                    duesStandardType: this.duesStandardType
                }).then(()=>{
                    this.$message.success(`已${this.operator === 1 ? '批准' : '驳回'}流程`);
                    this.closeOpinion();
                    this.$emit('refresh')
                })
            }
        },
        mounted() {
            this.getFlowDetails();
        }
    }
</script>

<style lang="less">
    .flow-detail-primary-state{
        color: #409EFF;
    }

    .flow-detail-success-state{
        color: #67C23A;
    }

    .flow-detail-danger-state{
        color: #F56C6C;
    }

</style>
