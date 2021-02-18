<template>
    <div class="member-info-panel" :class="{visible}" v-loading="loading">
        <el-container class="absolute-fill-parent">
            <el-header height="auto" class="unset-padding border-bottom">
                <div class="member-info-panel-close-btn" @click.stop="$emit('update:visible',false)">
                    <i class="el-icon-close"></i>
                </div>
                <div class="flex" style="padding: 16px;">
                    <div class="flex-fill-in-the-remaining-space flex-column flex flex-center">
                        <div>
                            <span>申请详情</span>
                            <span> | {{updateRecord.recordType | memberInfoUpdateType}}</span>
                            <span class="danger-tip">（{{updateRecord.typeName}}）</span>
                        </div>
                    </div>
                    <div>
                        <slot name="custom-handlers"></slot>
                    </div>
                </div>
            </el-header>
            <el-main class="unset-padding position-relative" style="padding: 16px;">
                <el-container class="absolute-fill-parent">
                    <el-header class="unset-padding" height="auto">
                        <div class="member-account-info border-bottom" style="padding: 16px 16px 8px 16px;">
                            <div>
                                <span>账号信息</span>
                            </div>
                            <div class="flex" v-if="userInfo">
                                <div class="member-info-avatar" :style="{'background-image':'url('+userInfo.headImg+')'}"></div>
                                <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                                    <div class="flex member-account-info-item" style="padding-bottom: 6px;">
                                        <div class="member-account-info-item-title">会员账号：</div>
                                        <div>{{userInfo.phone}}</div>
                                    </div>
                                    <div class="flex member-account-info-item" >
                                        <div class="member-account-info-item-title">注册时间：</div>
                                        <div>{{userInfo.createTime | yyyyMMddHHmmss}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-header>
                    <el-main class="unset-padding position-relative">
                        <div class="absolute-fill-parent">
                            <vue-scroll>
                                <div>
                                    <div style="padding: 16px;font-size: 14px;">
                                        <div style="padding-bottom: 4px;">详细信息</div>
                                        <member-info-preview-filed is-detail v-for="field of memberFields" :key="field.code"
                                                                   :member-info="memberInfo" :field="field"/>
                                    </div>
                                </div>
                            </vue-scroll>
                        </div>
                    </el-main>
                </el-container>
            </el-main>
        </el-container>
        <el-dialog title="大图预览" append-to-body :close-on-click-modal="false" :visible.sync="previewImageVisible"
                   width="800px">
            <div style="text-align: center;">
                <img :src="previewImageSrc" style="max-width: 100%;max-height: 600px;">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {transferData} from "../../../../js/util/utilFunction";
    import MemberInfoPreviewFiled from "../../organization/member/common/MemberInfoPreviewFiled";

    export default {
        name: "MemberExamineInfo",
        components: {MemberInfoPreviewFiled},
        props:{
            visible: {
                type: Boolean,
                default: false
            },
            updateRecord:{
                type: Object,
                required: true
            },
        },
        data(){
            return {
                memberFields: [],
                memberInfo: {},
                loading: false,
                previewImageSrc: '',
                previewImageVisible: false,
                userInfo:null
            }
        },
        methods:{
            transferData(field, value) {
                return transferData(field, value);
            },
            previewImage(imageSrc) {
                this.previewImageSrc = imageSrc;
                this.previewImageVisible = true;
            },
            getUserInfo(){
                this.loading = true;

                let unitParams = {
                    orderWay: 1,
                    limit: 10000000,
                    offset: 0,
                };

                if(this.updateRecord.recordType === '0'){
                    //资料认证
                    Promise.all([this.$request.get('/api/admin/applicationForm/getAllFieldsInfoByApplicationFormId',
                        {params:{applicationFormId: this.updateRecord.applicationFormId}}),
                        this.$request.get('/api/admin/organization/listOrganizationByCondition', {params: unitParams})]).then(([fields, units])=>{

                        let unitOptions = [];
                        units.data.list.map(unit => {
                            unitOptions.push({
                                key: unit.id,
                                title: unit.organizationName
                            })
                        });

                        this.memberFields = fields.data.fieldsInfo.map(field=>{
                            let {parameter,topicType} = field;
                            if (parameter && typeof parameter == 'string') {
                                parameter = JSON.parse(parameter);
                            } else {
                                parameter = {};
                            }

                            if (topicType === 10) {
                                field.topicType = 2;
                                parameter = {
                                    options: unitOptions
                                };
                            }

                            field.parameter = parameter;

                            return field;
                        });

                        this.memberInfo = JSON.parse(this.updateRecord.record);
                        this.$nextTick(()=>{ this.loading = false; })
                    });
                }else{
                    //资料变更
                    Promise.all([this.$request.get('/api/admin/memberType/getAllFieldByMemberType',{
                            params:{memberTypeId: this.updateRecord.memberTypeId}
                        }),
                        this.$request.get('/api/admin/organization/listOrganizationByCondition', {params: unitParams})]).then(([fields, units])=>{

                        let unitOptions = [];
                        units.data.list.map(unit => {
                            unitOptions.push({
                                key: unit.id,
                                title: unit.organizationName
                            })
                        });

                        this.memberFields = fields.data.fieldsInfo.map(field=>{
                            let {parameter,topicType} = field;
                            if (parameter && typeof parameter == 'string') {
                                parameter = JSON.parse(parameter);
                            } else {
                                parameter = {};
                            }

                            if (topicType === 10) {
                                field.topicType = 2;
                                parameter = {
                                    options: unitOptions
                                };
                            }

                            field.parameter = parameter;

                            return field;
                        });

                        this.memberInfo = JSON.parse(this.updateRecord.record);
                        this.$nextTick(()=>{ this.loading = false; })
                    });
                }

                if(this.updateRecord.memberUserId){
                    this.$request.get('/api/common/associator/getUserInfoAndMemberInfo',
                        {params:{userId: this.updateRecord.memberUserId}}).then(memberInfo=>{
                        this.userInfo = memberInfo.data.userInfo;
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }
            }
        },
        created() {
            this.getUserInfo();
        },
        watch:{
            updateRecord(){
                this.getUserInfo();
            }
        }
    }
</script>
