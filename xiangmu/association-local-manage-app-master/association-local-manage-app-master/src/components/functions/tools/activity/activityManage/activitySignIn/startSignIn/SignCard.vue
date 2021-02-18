<template>
    <el-container class="absolute-fill-parent">
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-aside class="flex flex-center flex-column" width="100px">
                    <div class="flex flex-center"><el-button type="primary" size="lager" :disabled="!(index>0)" circle  icon="el-icon-arrow-left" @click="pageUp"/></div>
                </el-aside>
                <el-main class="unset-padding position-relative">
                    <vue-scroll class="absolute-fill-parent">
                        <div>
                            <div style="width: 800px;margin:auto;padding-top: 16px;">
                                <el-card shadow="always" style="">
                                    <div slot="header" class="flex">
                                        <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">报名信息</div>
                                        <div>
                                            <el-button size="small" type="primary" @click="participantVisible=true">编辑报名信息</el-button>
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <div style="padding-top: 22px;">
                                            <el-avatar :src="data.headImg?data.headImg:headImage"/>
                                        </div>
                                        <div class="flex-fill-in-the-remaining-space"
                                             style="line-height: 28px;color: #999999;padding: 0 20px;">
                                            <activity-sign-in-info-preview-filed v-for="field of activityFields" :key="field.code" :field="field" :member-info="data"/>
                                            <div class="flex activity-sign-info-item">
                                                <div class="activity-sign-info-item-title">签到码：</div>
                                                <div class="activity-sign-info-item-content flex-fill-in-the-remaining-space">
                                                    {{data.signInCode}}
                                                </div>
                                            </div>
                                            <div class="flex activity-sign-info-item">
                                                <div class="activity-sign-info-item-title">报名时间：</div>
                                                <div class="activity-sign-info-item-content flex-fill-in-the-remaining-space">
                                                    {{data.createTime | yyyyMMddHHmmss}}
                                                </div>
                                            </div>
                                            <div class="flex activity-sign-info-item">
                                                <div class="activity-sign-info-item-title">审核时间：</div>
                                                <div class="activity-sign-info-item-content flex-fill-in-the-remaining-space">
                                                    {{data.verifyTime | yyyyMMddHHmmss}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-card>
                                <el-card style="margin-top: 16px;">
                                    <div slot="header" class="clearfix">
                                        <span>签到记录</span>
                                    </div>
                                    <div style="padding-bottom: 12px;" v-for="item of signDataList" :key="item.id">
                                         <span class="primary-tip"><i class="el-icon-timer"/>{{item.signTime | yyyyMMddHHmmss}}</span>
                                        在 <span class="danger-tip"><i class="el-icon-add-location"/>{{item.address}}</span>
                                        通过<span class="danger-tip">【{{item.signInWay | activitySignInType}}】</span>方式进行签到；
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </vue-scroll>
                </el-main>
                <el-aside class="flex flex-center flex-column" width="100px">
                    <div class="flex flex-center"><el-button type="primary" size="lager" :disabled="!(index < size - 1)" circle icon="el-icon-arrow-right" @click="pageNext"/></div>
                </el-aside>
            </el-container>
        </el-main>
        <el-footer class="flex flex-center" style="padding-top: 10px;">
            <div>
                <el-button type="primary" @click="signRecord">签到</el-button>
                <el-button type="warning" @click="$emit('cancel')">取消</el-button>
            </div>
        </el-footer>
        <el-dialog :title="formTitle" :visible.sync="participantVisible" append-to-body
                   :close-on-click-modal="false"
                   width="800px">
            <participant-form v-if="participantVisible"
                              :activityId="activityId" :relation-id="relationId"
                              @close="participantVisible=false" @refresh="refresh"/>
        </el-dialog>
    </el-container>

</template>

<script>
    import ActivitySignInInfoPreviewFiled from "../../../util/ActivitySignInInfoPreviewFiled";
    import ParticipantForm from "../../orderList/ParticipantForm";
    export default {
        name: "SignCard",
        components: {ParticipantForm, ActivitySignInInfoPreviewFiled},
        props: ['signUserInfo', 'total', 'searchStr', 'autoSignIn', 'addressSignId'],
        data() {
            return {
                headImage: require('../../../../../../../assets/default.jpg'),
                data: this.signUserInfo,
                index: 0,//第几个
                size: this.total,//总数
                activityFields: [],
                signDataList:[],

                participantVisible: false,
                formTitle: '编辑报名信息'
            }
        },
        created() {
            if (this.autoSignIn && this.size === 1) {
                this.signRecord();
            }
            this.getSignData();
            this.getActivityFieldsInfo();
        },
        computed: {
            activityId() {
                return this.$route.params.activityId
            },
            userId(){
                return this.data.userId;
            },
            relationId(){
                return this.data.relationId;
            },
            signInCode(){
                return this.data.signInCode;
            }
        },
        methods: {
            pageUp() {
                this.index--;
                this.getList();
            },
            pageNext() {
                this.index++;
                this.getList();
            },
            //获取列表
            getList() {
                this.$request.get('/api/admin/activity/address/getActivityRegisterInfoBySignInCode', {
                    params: {
                        activityId: this.activityId,
                        limit: 1,
                        offset: this.index,
                        searchStr: this.searchStr
                    }
                }).then(res => {
                    if (res.success) {
                        this.size = res.data.total;
                        this.data = res.data.list[0];
                        if (this.size === 1 && this.autoSignIn) {
                            this.signRecord()
                        }
                    }
                })
            },
            //签到
            signRecord() {
                this.$request.post('/api/admin/activity/signRecord/addSignRecord', {
                    addressSignId: this.addressSignId,
                    relationId: this.relationId,
                    signInCode: this.signInCode
                }).then(res => {
                    if (res.success) {
                        this.$message.closeAll();
                        this.$message.success('签到成功');
                        this.$emit('cancel');
                    }
                })
            },
            //获取活动字段
            getActivityFieldsInfo() {
                if (!this.activityId) {
                    return;
                }
                this.activityFields = [];
                this.$request.get('/api/common/activity/getActivityFieldsInfo', {
                    params: {
                        activityId: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        for (let field of res.data) {
                            let {parameter, topicType, id, code, name, necessary} = field;

                            let regularType = "unset", regularString = "";
                            let itemList = [];
                            if (topicType === 2 || topicType === 3) {
                                parameter = JSON.parse(parameter);
                                if (parameter.options) {
                                    let options = parameter.options;
                                    for (let option of options) {
                                        itemList.push(option);
                                    }
                                }
                            }

                            this.activityFields.push({
                                id, code, name, necessary, topicType,
                                itemList, regularType, regularString
                            });
                        }
                    }
                })
            },
            getSignData() {
                this.signDataList = [];
                if(!this.relationId){return;}
                this.$request.get('/api/admin/activity/signRecord/getSignRecordsByAddressSignId', {
                    params: {
                        activityId: this.activityId,
                        addressSignId: this.addressSignId,
                        relationId: this.relationId,
                        limit: 1000,
                        offset: 0,
                    }
                }).then(res => {
                    if (res.success) {
                        this.signDataList = res.data.list;
                    }
                })
            },
            refresh(){
                this.$request.get('/api/admin/activityInfo/getSignUpInfoById',{params:{relationId:this.relationId}}).then(res=>{
                    this.data = Object.assign(this.data,res.data);
                })
            }

        },
        watch:{
            relationId(){
                this.getSignData();
            }
        }
    }
</script>
