<template>
    <el-container class="absolute-fill-parent background-color-white"
                  v-loading="loading" element-loading-text="数据加载中......" element-loading-spinner="el-icon-loading">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
               <div class="flex-fill-in-the-remaining-space flex flex-column flex-center" style="font-size: 16px;color: #333333;">
                   <div><i class="el-icon-s-tools" style="padding-right: 4px;"></i>表单设置</div>
               </div>
                <div>
                    <el-button type="primary" size="small" @click="submitData">保存设置信息</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative" v-if="formInfo">
            <div class="absolute-fill-parent">
                <vue-scroll>
                    <div style="width: 800px;margin: 20px auto;">
                        <div class="box-shadow" style="padding: 20px;">
                            <div class="lrd-common-setting-group-title">1 填表须知设置</div>
                            <el-form size="small" label-width="180px">
                                <el-form-item>
                                    <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            开启填表须知：
                                        </div>
                                    </template>
                                    <el-checkbox v-model="formInfo.isShowNotice">开启填表须知</el-checkbox>
                                </el-form-item>
                                <div v-show="formInfo.isShowNotice">
                                    <el-form-item>
                                        <template v-slot:label>
                                            <div class="custom-el-form-item-label required">
                                                填表须知标题：
                                            </div>
                                        </template>
                                        <el-input v-model="formInfo.noticeTitle" :maxlength="10" placeholder="填表须知标题，10字以内"/>
                                    </el-form-item>
                                    <el-form-item>
                                        <template v-slot:label>
                                            <div class="custom-el-form-item-label required">
                                                填表须知内容：
                                            </div>
                                        </template>
                                        <editor v-model="formInfo.noticeContent"></editor>
                                    </el-form-item>
                                    <el-form-item>
                                        <template v-slot:label>
                                            <div class="custom-el-form-item-label required">
                                                同意设置：
                                            </div>
                                        </template>
                                        <el-checkbox v-model="formInfo.isNeedAgreeNotice">开启填表人必须同意填表须知</el-checkbox>
                                    </el-form-item>
                                    <div v-show="formInfo.isNeedAgreeNotice">
                                        <el-form-item>
                                            <template v-slot:label>
                                                <div class="custom-el-form-item-label required">
                                                    复选框文字：
                                                </div>
                                            </template>
                                            <el-input v-model="formInfo.agreeNoticeCheckboxText" :maxlength="50" placeholder="复选框文字，50字以内"/>
                                        </el-form-item>
                                        <el-form-item>
                                            <template v-slot:label>
                                                <div class="custom-el-form-item-label required">
                                                    未勾选提示文字：
                                                </div>
                                            </template>
                                            <el-input v-model="formInfo.disagreeNoticeTip" :maxlength="50" placeholder="未勾选提示文字，50字以内"/>
                                        </el-form-item>
                                    </div>
                                    <el-form-item>
                                        <template v-slot:label>
                                            <div class="custom-el-form-item-label required">
                                                下一步按钮：
                                            </div>
                                        </template>
                                        <el-input v-model="formInfo.nextButtonText" :maxlength="10" placeholder="下一步按钮显示文字，10字以内"/>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </div>
                        <div class="box-shadow" style="padding: 20px;margin-top: 16px;">
                            <div class="lrd-common-setting-group-title">2 其他设置</div>
                            <el-form size="small" label-width="180px">
                                <el-form-item>
                                    <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            提交按钮显示文字：
                                        </div>
                                    </template>
                                    <el-input v-model="formInfo.submitText" :maxlength="10" placeholder="提交按钮显示文字，10字以内"/>
                                </el-form-item>
                                <el-form-item>
                                    <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            开启多次提交：
                                        </div>
                                    </template>
                                    <el-checkbox v-model="formInfo.isManyTimes">开启多次提交</el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            开启提交回执：
                                        </div>
                                    </template>
                                    <el-checkbox v-model="formInfo.isNeedHandle">开启提交回执</el-checkbox>
                                </el-form-item>
                                <div v-show="formInfo.isNeedHandle">
                                    <el-form-item>
                                        <template v-slot:label>
                                            <div class="custom-el-form-item-label required">
                                                [同意]回执显示文字：
                                            </div>
                                        </template>
                                        <el-input v-model="formInfo.resolveText" :maxlength="6" placeholder="[同意]回执显示文字，6字以内"/>
                                    </el-form-item>
                                    <el-form-item>
                                        <template v-slot:label>
                                            <div class="custom-el-form-item-label required">
                                                [不同意]回执显示文字：
                                            </div>
                                        </template>
                                        <el-input v-model="formInfo.rejectText" :maxlength="6" placeholder="[不同意]回执显示文字，6字以内"/>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </div>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import FormBuilder from '../js/formBuilder';
    import Editor from "../../../../util/editor/Editor";

    export default {
        name: "OnlineFormSetting",
        components: {Editor},
        data() {
            return {
                formInfo: null,
                loading: true
            }
        },
        computed: {
            formId() {
                return this.$route.params.formId;
            }
        },
        methods: {
            getFormInfo(callback) {
                this.$request.get('/api/admin/onlineForm', {
                    params: {id: this.formId}
                }).then(res => {
                    this.formInfo = new FormBuilder(res.data);
                    this.$nextTick(()=>{ this.loading = false; })
                    callback && callback();
                })
            },
            submitData(){
                let data = {...this.formInfo};
                delete data.fields;
                this.$request.put('/api/admin/onlineForm/configuration', data).then(() => {
                    this.getFormInfo(()=>{
                        this.$message.success({duration: 1000,message:'配置信息已更新'});
                    });
                })
            }
        },
        created() {
            this.getFormInfo();
        }
    }
</script>
