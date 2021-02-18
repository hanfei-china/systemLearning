<template>
    <div class="member-info-panel" :class="{visible}" v-loading="loading">
        <el-container class="absolute-fill-parent">
            <el-header height="auto" class="unset-padding border-bottom">
                <div class="member-info-panel-close-btn" @click.stop="$emit('update:visible',false)">
                    <i class="el-icon-close"/>
                </div>
                <div class="flex" style="padding: 16px;">
                    <div class="flex-fill-in-the-remaining-space flex-column flex flex-center">
                        <div>
                            <span>{{title}}</span>
                            <span class="danger-tip" v-if="memberTypeId&&memberName(memberTypeId)">（{{memberName(memberTypeId)}}）</span>
                        </div>
                    </div>
                    <div>
                        <slot name="custom-handlers"/>
                    </div>
                </div>
            </el-header>
            <el-main class="unset-padding position-relative" style="padding: 16px;">
                <el-container class="absolute-fill-parent">
                    <el-main class="unset-padding position-relative">
                        <el-container class="absolute-fill-parent">
                            <el-header class="unset-horizontal-padding" height="61px">
                                <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                                    <el-menu-item index="baseInfo">会员信息</el-menu-item>
                                    <el-menu-item index="accountInfo">账号信息</el-menu-item>
                                    <el-menu-item v-show="showBranches" index="joinBranches">加入分会</el-menu-item>
                                    <el-menu-item v-show="showSignInActivities" index="signInActivities">参与活动</el-menu-item>
                                    <el-menu-item v-show="showDonationRecords" index="donationRecords">捐赠记录</el-menu-item>
                                    <el-submenu index="more" v-if="showContacts || showOperationLog || showVisitRecords">
                                        <template slot="title">更多操作</template>
                                        <el-menu-item v-show="showContacts" index="contacts">联系人信息</el-menu-item>
<!--                                        <el-menu-item v-show="showOperationLog" index="operationLog">操作日志</el-menu-item>-->
                                        <el-menu-item v-show="showVisitRecords" index="visitRecords">跟踪记录</el-menu-item>
                                    </el-submenu>
                                </el-menu>
                            </el-header>
                            <el-main class="unset-padding position-relative">
                                <member-accounts :accounts="userInfos" v-show="activeIndex === 'accountInfo'"/>
                                <el-container class="absolute-fill-parent background-color-white" v-show="activeIndex === 'baseInfo'">
                                    <el-header style="padding: 0 16px;" class="flex flex-column flex-center border-bottom" height="48px">
                                        <div class="flex">
                                            <div class="flex flex-column flex-center" style="font-size: 12px;color: #888888;">显示字段：</div>
                                            <el-select v-model="showFieldsType" placeholder="请选择要显示的字段" size="mini">
                                                <el-option value="all" label="所有字段"/>
                                                <el-option value="selfModify" label="允许会员自行修改字段"/>
                                                <el-option value="onlyAdmin" label="仅管理员可见字段"/>
                                                <el-option value="privacy" label="隐私字段"/>
                                            </el-select>
                                        </div>
                                    </el-header>
                                    <el-main class="unset-padding">
                                        <vue-scroll>
                                            <div>
                                                <div style="padding: 16px;font-size: 14px;">
                                                    <member-info-preview-filed is-detail v-for="field of showFields"
                                                                               :key="field.code"
                                                                               :member-info="memberInfo" :field="field"/>
                                                </div>
                                            </div>
                                        </vue-scroll>
                                    </el-main>
                                </el-container>
                                <join-branches v-show="activeIndex === 'joinBranches'"
                                               :showBranchOperate="showBranchOperate" :member-id="memberId"/>
                                <operation-log v-show="activeIndex === 'operationLog'" :user-id="memberInfo.userId"/>
                                <visit-records v-show="activeIndex === 'visitRecords'" :member-id="memberId"/>
                                <sign-in-activities v-show="activeIndex === 'signInActivities'" :user-id="memberInfo.userId"/>
                                <single-member-contacts v-show="activeIndex === 'contacts'" :member-id="memberId"/>
                                <sign-in-activities v-show="activeIndex === 'signInActivities'"
                                                    :user-id="memberInfo.userId"/>
                                <donation-records v-show="activeIndex === 'donationRecords'"
                                                  :user-id="memberInfo.userId" />
                            </el-main>
                        </el-container>
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
    import {transferData} from "../../../../../js/util/utilFunction";

    import MemberInfoPreviewFiled from "./MemberInfoPreviewFiled";
    import JoinBranches from "./memberInfoCard/JoinBranches";
    import OperationLog from "./memberInfoCard/OperationLog";
    import VisitRecords from "./memberInfoCard/VisitRecords";
    import SignInActivities from "./memberInfoCard/SignInActivities";
    import SingleMemberContacts from "./memberInfoCard/singleMemberContacts/SingleMemberContacts";
    import MemberAccounts from "./memberInfoCard/MemberAccounts";
    import DonationRecords from "./memberInfoCard/DonationRecords";

    export default {
        name: "MemberInfoById",
        components: {
            MemberAccounts, DonationRecords,
            SingleMemberContacts,
            SignInActivities, VisitRecords, OperationLog, JoinBranches, MemberInfoPreviewFiled},
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            memberId: {
                type: String,
                default: null
            },
            title: {
                type: String,
                default: '会员信息'
            },
            showAccountInfo: {
                type: Boolean,
                default: true
            },
            showBranches: {
                type: Boolean,
                default: false
            },
            showOperationLog: {
                type: Boolean,
                default: false
            },
            showVisitRecords: {
                type: Boolean,
                default: false
            },
            showSignInActivities: {
                type: Boolean,
                default: false
            },
            showContacts: {
                type: Boolean,
                default: false
            },
            showDonationRecords: {
                type: Boolean,
                default: false
            },
            defaultPanel: {
                type: String,
                default: 'baseInfo'
            },
            showBranchOperate: {
                type: Boolean,
                default: true
            },
            memberTypes:{
                type:Array,
                default() {
                    return []
                }
            },
            educationList:Array,
            collegeList:Array,
            majorList:Array,
        },
        data() {
            return {
                memberFields: [],
                memberInfo: {},
                userInfos: [],
                loading: false,
                previewImageSrc: '',
                previewImageVisible: false,
                memberTypeId: null,

                activeIndex: this.defaultPanel,

                label: [],
                showLabels: [],
                showFieldsType: 'all'
            }
        },
        computed: {
            showFields(){

                if(this.showFieldsType === 'selfModify'){
                    return this.memberFields.filter(field=>{
                        return field.selfModify;
                    });
                }

                if(this.showFieldsType === 'onlyAdmin'){
                    return this.memberFields.filter(field=>{
                        return field.onlyAdmin;
                    });
                }

                if(this.showFieldsType === 'privacy'){
                    return this.memberFields.filter(field=>{
                        return field.privacy;
                    });
                }
                return this.memberFields;
            },
        },
        methods: {
            memberName(val){
                var obj = this.memberTypes.find(item=>item.key==val)
                if(obj){
                    return obj.title
                }
                return ""
            },
            handleSelect(index) {
                this.activeIndex = index;
            },
            transferData(field, value) {
                return transferData(field, value);
            },
            previewImage(imageSrc) {
                this.previewImageSrc = imageSrc;
                this.previewImageVisible = true;
            },
            getUserInfo() {
                this.loading = true;

                this.$request.get('/api/admin/member/getUserInfoAndMemberInfo', {params: {memberId: this.memberId}}).then(res => {
                    this.memberInfo = res.data.memberInfo;
                    this.userInfos = res.data.userInfos;
                    let memberTypeId = res.data.memberInfo.memberTypeId;
                    this.memberTypeId = memberTypeId;

                    let unitParams = {
                        orderWay: 1,
                        limit: 10000000,
                        offset: 0,
                    };

                    if (memberTypeId) {
                        Promise.all([this.$request.get('/api/admin/memberType/getAllFieldByMemberType', {params: {memberTypeId}}),
                            this.$request.get('/api/admin/organization/listOrganizationByCondition', {params: unitParams})]).then(([memberTypeData, units]) => {
                            this.memberTypeInfo = memberTypeData.data.memberType;
                            let unitOptions = [];
                            units.data.list.map(unit => {
                                unitOptions.push({
                                    key: unit.id,
                                    title: unit.organizationName
                                })
                            });


                            this.memberFields = memberTypeData.data.fieldsInfo.map(field => {
                                let {parameter, topicType} = field;
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
                                if (topicType === 13) {
                                    field.detailList.map(field=>{
                                        let {parameter, code} = field;
                                        if(code=="education"){
                                           field.parameter = {options:this.educationList}
                                        }
                                        if(code=="college"){
                                           field.parameter = {options:this.collegeList}
                                        }
                                        if(code=="major"){
                                           field.parameter = {options:this.majorList}
                                        }
                                        return field
                                    })
                                }

                                field.parameter = parameter;

                                return field;
                            });

                            this.$nextTick(()=>{ this.loading = false; })
                        })
                    }
                    else {
                        Promise.all([this.$request.get('/api/admin/associator/getFieldsInfo'),
                            this.$request.get('/api/admin/organization/listOrganizationByCondition', {params: unitParams})]).then(([fields, units]) => {

                            let unitOptions = [];
                            units.data.list.map(unit => {
                                unitOptions.push({
                                    key: unit.id,
                                    title: unit.organizationName
                                })
                            });


                            this.memberFields = fields.data.map(field => {
                                let {parameter, topicType} = field;
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

                            this.$nextTick(()=>{ this.loading = false; })

                            this.$nextTick(()=>{ this.loading = false; })
                        })
                    }

                    if(this.memberInfo.label){
                        this.label = JSON.parse(this.memberInfo.label);
                        this.getLabelList();
                    }else {
                        this.label = [];
                    }
                });
            },
            getLabelList() {
                let params = {
                    type: 0
                };
                this.$request.get('/api/admin/label/manage/getLabelGroupsAndLabelsByType', {params: params}).then((resp) => {
                    let list = resp.data;
                    for (let item of list) {
                        for (let label of item.labels) {
                            label.color = item.color;
                            label.isMultiple = item.isMultiple;
                        }
                    }

                    let labelList = [];
                    for(let item of list){
                        for (let label of item.labels) {
                            labelList.push(label);
                        }
                    }

                    if(this.label && this.label.length>0){
                        for(let label of this.label){
                            for(let item of labelList){
                                if(label.labelId === item.id){
                                    this.showLabels.push(item)
                                }
                            }
                        }
                    }

                })
            },
        },
        created() {
            this.getUserInfo()
        },
        watch: {
            memberId() {
                this.getUserInfo();
                this.getLabelList();
            },
        }
    }
</script>
