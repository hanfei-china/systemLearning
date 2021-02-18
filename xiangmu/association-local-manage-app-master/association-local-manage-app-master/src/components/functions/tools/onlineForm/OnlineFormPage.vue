<template>
    <div class="wrap" :class="isMobile?'isMobile':''">
        <vue-scroll>
            <div class="content" v-if="formData.isShowNotice && !showForm">
                <div class="background-color-white">
                    <div class="box">
                        <div class="boxInner">
                            <p class="header">{{formData.noticeTitle}}</p>
                            <div v-html="formData.noticeContent"></div>
                            <div v-if="formData.isNeedAgreeNotice" class="text-align-center" style="margin-top: 20px;">
                                <el-checkbox v-model="agreeNotice">{{formData.agreeNoticeCheckBoxText}}</el-checkbox>
                            </div>
                            <div class="text-align-center" style="padding: 30px 0;">
                                <el-button size="small" class="button" @click="nextStep">{{formData.nextButtonText}}</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content" v-if="showForm">
                <img class="formbg" src="../../../../assets/formTop.jpg" alt="">
                <div class="background-color-white">
                    <div class="box">
                        <div class="boxInner">
                            <p class="header">{{title}}</p>
                            <div>
                                <el-form ref="form" size="small" class="custom-el-form column">
                                    <el-form-item v-for="field in fieldList" :key="field.code">
                                        <template v-slot:label>
                                        <span class="custom-el-form-item-label" :class="{required: field.isRequire}">
                                            {{field.title}}：
                                        </span>
                                        </template>
                                        <online-form-edit-field :ref="field.code" :code="field.code" :config="field"
                                                                v-model="field.value"/>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="text-align-center" style="padding: 30px 0;">
                                <el-button size="small" class="button" @click="submitData">{{formData.submitText}}</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </vue-scroll>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="500px">
            <div class="text-align-center" style="padding: 50px 0;">
                表单信息已提交
            </div>
            <div class="text-align-right">
                <el-button size="small" type="primary" @click="refresh">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import OnlineFormEditField from "./setting/fields/OnlineFormEditField";
    import {formatDate} from "./js/settingStore";

    export default {
        name: "OnlineFormPage",
        components: {OnlineFormEditField},
        data() {
            return {
                title: '',
                fieldList: [],
                formData: {},
                agreeNotice: false,//同意填表须知
                showForm: true,
                dialogVisible: false,
                isMobile:false
            }
        },
        computed: {
            memberFormId() {
                return this.$route.params.formId
            },
        },
        created() {
            if(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)){
                this.isMobile = true;
            }
            this.getFormList();
        },
        methods: {
            getFormList() {
                this.$request.get('/api/common/onlineForm/onlineFormInfo', {params: {id: this.memberFormId}}).then(res => {
                    this.formData = res.data;
                    this.title = res.data.formTitle;
                    if(this.formData.isShowNotice){
                        this.showForm = false;
                    }else {
                        this.showForm = true;
                    }
                    let fields = JSON.parse(res.data.fields);
                    this.fieldList = fields.filter(field => {
                        field.value = null;
                        return true;
                    });
                })
            },
            nextStep(){
                if(this.formData.isNeedAgreeNotice && !this.agreeNotice){
                    this.$message.warning(this.formData.disagreeNoticeTip);
                }else {
                    this.showForm = true;
                }
            },
            submitData() {
                let fieldRelation = {};

                for (let field of this.fieldList) {
                    let {value, code, type, isRequire, title} = field;
                    if(type === 8){
                        continue;
                    }

                    if (type === 5 || type === 6 || type === 7) {
                        if (value) {
                            value = JSON.stringify(value);
                        }
                    }

                    if (type === 3 && value) {
                        value = formatDate(new Date(value), 'yyyy-MM-dd HH:mm');
                    }

                    let types = ['','请输入','请输入','请选择','请选择','请选择','请上传','请上传'];

                    if(isRequire && !value){
                        this.$message.warning(`${types[type]}${title}`);
                        return;
                    }

                    fieldRelation[code] = value;
                }
                this.$request.post('/api/common/onlineForm/submit', {
                    formData: fieldRelation,
                    formId: this.memberFormId
                }).then(res => {
                    if (res.success) {
                        this.dialogVisible = true;
                    }
                })
            },
            refresh(){
                this.dialogVisible = false;
                this.getFormList();
            }
        }
    }
</script>

<style scoped lang="less">
    .wrap {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #F3F6FA;
        background-image: url('../../../../assets/formBg.jpg');
        background-repeat: repeat-x;
        background-size: 1px 300px;

        .content {
            width: 80%;
            max-width: 920px;
            // background: url('../../../../assets/formTop.jpg') no-repeat top center;
            // background-size: 910px 144px;
            // padding-top: 120px;
            margin: 0 auto;
            .formbg{
                width: 100%;
            }
            .box {
                box-shadow: 0 1px 6px 0 rgba(205, 220, 245, 1);

                .boxInner {
                    margin: auto 70px;
                    .header {
                        color: #5A83E5;
                        font-size: 24px !important;
                        font-weight: bold;
                        vertical-align: middle;
                        margin: 0;
                        padding: 55px 0 30px;
                        line-height: 30px;
                        text-align: center;
                    }

                    .button {
                        border: 1px solid transparent;
                        border-radius: 0;
                        line-height: 32px;
                        padding: 0 24px;
                        background: #5A83E5;
                        outline: none;
                        font-size: 16px;
                        color: #ffffff;
                    }
                }
            }
        }
    }
    .wrap.isMobile{
        .content{
            width: 100%;
            .box{
                .boxInner{
                    margin: 0 20px;
                }
                .header{
                    padding: 30px 0;
                }
            }
        }
        
    }
</style>
