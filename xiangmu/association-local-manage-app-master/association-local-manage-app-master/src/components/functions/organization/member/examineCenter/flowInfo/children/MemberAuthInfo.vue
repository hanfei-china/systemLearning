<template>
    <el-container class="absolute-fill-parent" v-loading="loading">
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
                                    <div>{{userInfo.account || userInfo.name}}</div>
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
                                    <member-info-preview-filed is-detail v-for="field of memberFields" :key="field.code" v-if="field.topicType!=14"
                                                               :member-info="memberInfo" :field="field" :memberInfoId="memberInfoId" />
                                </div>
                                <div v-if="contacts.length>0" style="padding: 16px;font-size: 14px;">
                                    <div style="padding-bottom: 4px;">联系人信息</div>
                                    <el-card class="member-contacts-item" v-for="(contact,index) of contacts" :key="index" shadow="hover">
                                        <div class="flex">
                                            <div>
                                                <div class="member-contacts-name-avatar">{{contact.name | nameAvatar}}</div>
                                            </div>
                                            <div class="flex-fill-in-the-remaining-space">
                                                <div class="contacts-field-row flex">
                                                    <div class="contacts-field-title">姓名：</div>
                                                    <div>{{contact.name}}</div>
                                                </div>
                                                <div class="contacts-field-row flex">
                                                    <div class="contacts-field-title">职位：</div>
                                                    <div>{{contact.post}}</div>
                                                </div>
                                                <div class="flex contacts-field-row">
                                                    <div class="contacts-field-title">手机号：</div>
                                                    <div>{{contact.phone}}</div>
                                                </div>
                                                <div class="flex contacts-field-row">
                                                    <div class="contacts-field-title">座机：</div>
                                                    <div>{{contact.landline}}</div>
                                                </div>
                                                <div class="flex contacts-field-row">
                                                    <div class="contacts-field-title">电子邮箱：</div>
                                                    <div>{{contact.email}}</div>
                                                </div>
                                                <div class="flex contacts-field-row">
                                                    <div class="contacts-field-title">传真：</div>
                                                    <div>{{contact.fax}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                            </div>
                        </vue-scroll>
                    </div>
                </el-main>
            </el-container>
        </el-main>
        <el-dialog title="大图预览" append-to-body :close-on-click-modal="false" :visible.sync="previewImageVisible"
                   width="800px">
            <div style="text-align: center;">
                <img :src="previewImageSrc" style="max-width: 100%;max-height: 600px;">
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import MemberInfoPreviewFiled from "../../../common/MemberInfoPreviewFiled";

    export default {
        name: "MemberAuthInfo",
        components: {MemberInfoPreviewFiled},
        props:{
            userId: String,
            recordType: Number,
            record: String,
            applicationFormId: String
        },
        filters:{
            nameAvatar(value){
                if(value){
                    if(value.length === 1){
                        return value.substring(0,1);
                    }else{
                        return value.substring(value.length-2,value.length);
                    }
                }
                return '';
            }
        },
        data(){
            return {
                memberFields: [],
                loading: false,
                previewImageSrc: '',
                previewImageVisible: false,
                userInfo:null,
                memberInfoId:""
            }
        },
        computed:{
            recordEntity(){
                return this.record ? JSON.parse(this.record) : {};
            },
            memberInfo(){
                if(this.recordEntity.hasOwnProperty('record')){
                    return this.recordEntity.record;
                }else{
                    return this.recordEntity;
                }
            },
            contacts(){
                if(this.recordEntity.hasOwnProperty('contacts')){
                    return this.recordEntity.contacts;
                }else{
                    return [];
                }
            },
        },
        methods:{
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

                if([0,1,2].indexOf(this.recordType) > -1){
                    //资料认证
                    Promise.all([this.$request.get('/api/admin/applicationForm/formFields',
                        {params:{formId: this.applicationFormId}}),
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
                        this.$nextTick(()=>{ this.loading = false; })
                    });
                }else{
                    //资料变更
                    Promise.all([this.$request.get('/api/admin/memberType/getAllFieldByMemberType',{params:{memberTypeId: this.updateRecord.memberTypeId}}),
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

                        this.memberInfo = JSON.parse(this.record);
                        this.$nextTick(()=>{ this.loading = false; })
                    });
                }

                this.$request.get('/api/common/associator/getUserInfoAndMemberInfo',
                    {params:{userId: this.userId}}).then(memberInfo=>{
                    this.userInfo = memberInfo.data.userInfo;
                    this.$nextTick(()=>{ this.loading = false; })
                    this.memberInfoId = memberInfo.data.memberInfo?memberInfo.data.memberInfo.id:""
                })
            }
        },
        created() {
            this.getUserInfo();
        },
        watch:{
            updateRecord(){
                this.getUserInfo();
            },
            memberFields(val){
                val.map(field=>{
                    let {topicType} = field;
                    if (topicType === 13) {
                        field.detailList.map(field=>{
                            let {parameter, code} = field;
                            if(code=="education"){
                                this.$request.get('/api/common/associator/historyCollege/educations').then(r=>{
                                    field.parameter = {options:r.data}
                                })
                            }
                            if(code=="college"){
                                this.$request.get('/api/common/associator/historyCollege/colleges').then(r=>{
                                    field.parameter = {options:r.data}
                                })
                            }
                            if(code=="major"){
                                this.$request.get('/api/common/associator/historyCollege/majors').then(r=>{
                                    field.parameter = {options:r.data}
                                })
                            }
                            return field
                        })
                    }
                    return field;
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .contacts-field-title{
        width: 70px;
        text-align: right;
        color: #888888;
    }

    .contacts-field-row:not(:last-child){
        margin-bottom: 8px;
    }

    .member-contacts-name-avatar{
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        margin-right: 8px;

        &:nth-child(4n+1){
            background-color: #409EFF;
        }

        &:nth-child(4n+2){
            background-color: #67C23A;
        }

        &:nth-child(4n+3){
            background-color: #E6A23C;
        }

        &:nth-child(4n+4){
            background-color: #F56C6C;
        }

    }
</style>
