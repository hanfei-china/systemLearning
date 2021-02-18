<template>
    <el-container class="absolute-fill-parent background-color-white project-management" style="z-index: 3;">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-column flex-center"
                     style="font-size: 16px;color: #333333;">
                    <div>{{!donationId ?
                        '新建捐赠项目' : '变更项目信息'}}
                    </div>
                </div>
                <div>
                    <el-button type="danger" size="small" @click="$emit('close')">取消</el-button>
                    <el-button type="primary" size="small" @click="submitData">确定</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent">
                <vue-scroll>
                    <div style="margin: 20px auto;width: 800px;padding: 20px;" class="box-shadow">
                        <el-form label-width="160px" size="small">
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        项目名称：
                                    </div>
                                </template>
                                <el-input v-model="title" placeholder="项目名称，100字以内"/>
                            </el-form-item>
                            <el-form-item v-if="!routeClassId">
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        项目分类：
                                    </div>
                                </template>
                                <online-donation-class-choose style="width: 100%;" v-model="classId"/>
                            </el-form-item>
                            <el-form-item class="donation-desc">
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        项目简介：
                                    </div>
                                </template>
                                <el-input v-model="donationDesc" placeholder="项目简介，200字以内" type="textarea" maxlength="200"
                                show-word-limit :rows="3"/>
                            </el-form-item>
                            <el-form-item v-if="!routeClassId">
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        是否支持团体捐赠：
                                    </div>
                                </template>
                                <el-radio v-model="groupDonation" label="1">支持</el-radio>
                                <el-radio v-model="groupDonation" label="0">不支持</el-radio>
                            </el-form-item>
                            <div class="flex">
                                <el-form-item style="padding-right: 10px; flex: 0 0 310px;">
                                    <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            目标金额：
                                        </div>
                                    </template>
                                    <template>
                                        <el-radio v-model="targetAmountType" label="1">限定</el-radio>
                                        <el-radio v-model="targetAmountType" label="0">非限定</el-radio>
                                    </template>
                                </el-form-item>
                                <el-form-item class="donation-cycle" style="padding-left: 10px; flex: 0 0 350px;" v-if="targetAmountType=='1'">
                                    <!-- <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            目标金额：
                                        </div>
                                    </template>
                                    <template>
                                        <el-radio v-model="targetAmountType" label="1">限定</el-radio>
                                        <el-radio v-model="targetAmountType" label="0">非限定</el-radio>
                                    </template> -->
                                    <template v-if="targetAmountType=='1'">
                                        <el-input v-model="targetAmount" :maxlength="12"
                                              placeholder="请输入目标金额（单位：元），格式如（0.01 | 1000）"/>
                                    </template>
                                </el-form-item>
                            </div>
                            <div class="flex">
                                <el-form-item style="padding-right: 10px; flex: 0 0 310px;">
                                    <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            捐赠周期：
                                        </div>
                                    </template>
                                    <template>
                                        <el-radio v-model="timeType" label="1">限定</el-radio>
                                        <el-radio v-model="timeType" label="0">非限定</el-radio>
                                    </template>
                                </el-form-item>
                                <el-form-item class="flex-fill-in-the-remaining-space donation-cycle" style="padding-left: 10px;" v-if="timeType=='1'">
                                    <!-- <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            捐赠周期：
                                        </div>
                                    </template> -->
                                    <el-date-picker v-model="targetTime" start-placeholder="开始日期" end-placeholder="结束日期"
                                                    type="daterange"/>
                                </el-form-item>
                            </div>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        项目负责人：
                                    </div>
                                </template>
                                <el-input v-model="headPerson" placeholder="项目负责人姓名，20字以内"/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        联系方式：
                                    </div>
                                </template>
                                <el-input v-model="phone" :maxlength="30"
                                          placeholder="请输入11位手机号或座机号，如为座机，请输入'区号-电话号码-分机号'，分机号可以为空"/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        电子邮箱：
                                    </div>
                                </template>
                                <el-input v-model="email" :maxlength="100" placeholder="请输入电子邮箱地址"/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        海报：
                                    </div>
                                </template>
                                <image-upload v-model="poster"/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        项目详情：
                                    </div>
                                </template>
                                <editor v-model="introduction"/>
                            </el-form-item>
                        </el-form>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import ImageUpload from "../../../util/ImageUpload";
    import Editor from "../../../util/editor/Editor";
    import OnlineDonationClassChoose from "./onlineDonationClassManage/OnlineDonationClassChoose";

    export default {
        name: "OnlineDonationForm",
        components: {OnlineDonationClassChoose, Editor, ImageUpload},
        props: {
            donationId: String,
            propClassId: String
        },
        data() {
            return {
                title: '',
                targetAmountType:'1',
                timeType:"1",
                groupDonation:'1',
                targetAmount: '0.00',
                targetTime: [new Date(), new Date()],
                headPerson: '',
                phone: '',
                email: '',
                poster: '',
                introduction: '',
                classId: this.propClassId,
                donationDesc:""
            }
        },
        computed:{
            routeClassId(){
                return this.$route.params.classId;
            }
        },
        methods: {
            submitData() {
                if(this.donationDesc==""||this.donationDesc==null){
                    this.$message.error('项目简介为空');
                    return;
                }
                let data = {
                    title: this.title,
                    targetAmount: this.targetAmountType=='1'?this.targetAmount:0,
                    startTime: this.timeType=='1'?this.targetTime[0]:'',
                    endTime: this.timeType=='1'?this.targetTime[1]:'',
                    headPerson: this.headPerson,
                    phone: this.phone,
                    email: this.email,
                    poster: this.poster,
                    introduction: this.introduction,
                    classId: this.classId || this.routeClassId,
                    targetAmountType:Number(this.targetAmountType),
                    timeType:Number(this.timeType),
                    groupDonation:this.groupDonation=='1'?true:false,
                    donationDesc:this.donationDesc
                };

                if (this.donationId) {
                    data.id = this.donationId;
                    this.$request.put('/api/admin/onlineDonation', data).then(() => {
                        this.$emit('refresh');
                        this.$emit('close');
                        this.$message.success("项目信息变更成功");
                    });
                } else {
                    this.$request.post('/api/admin/onlineDonation', data).then(() => {
                        this.$emit('refresh');
                        this.$emit('close');
                        this.$message.success("项目新建成功");
                    });
                }
            },
            getDonationInfo() {
                if (this.donationId) {
                    this.$request.get('/api/admin/onlineDonation', {
                        params: {
                            id: this.donationId
                        }
                    }).then(res => {
                        let {data} = res;

                        this.title = data.title;
                        this.targetAmount = data.targetAmountType==0?'':data.targetAmount;
                        this.targetTime = data.timeType==0?[]:[new Date(data.startTime), new Date(data.endTime)];
                        this.headPerson = data.headPerson;
                        this.phone = data.phone;
                        this.email = data.email;
                        this.poster = data.poster;
                        this.introduction = data.introduction;
                        this.classId = data.classId;
                        this.targetAmountType = data.targetAmountType+'';
                        this.timeType = data.timeType+'';
                        this.groupDonation = data.groupDonation==true?'1':'0';
                        this.donationDesc = data.donationDesc
                    })
                }
            }
        },
        created() {
            this.getDonationInfo();
        }
    }
</script>
<style>
.project-management .el-main .donation-cycle .el-form-item__content{
    margin-left: 0 !important;
}
.project-management .el-main .donation-desc .el-form-item__content .el-textarea__inner{
    resize: none;
}
.project-management .el-main .donation-desc .el-form-item__content .el-input__count{
    line-height: 24px;
    bottom: 1;
}
</style> 
