<template>
    <div class="absolute-fill-parent background-color-white">
        <vue-scroll class="absolute-fill-parent">
            <div style="padding: 16px;">
                <el-card header="基础配置" shadow="never" :body-style="{ padding: '16px' }">
                    <el-form label-width="120px" size="small">
                        <el-form-item label="系统名称：">
                            <el-input v-model="systemSetting.systemName" placeholder="系统名称，50字以内" :maxlength="50"/>
                        </el-form-item>
                        <el-form-item label="系统简介：">
                            <el-input v-model="systemSetting.systemIntroduce" :rows="8" resize="none" placeholder="系统简介" type="textarea" :maxlength="500"/>
                        </el-form-item>
                        <el-form-item label="组织名称：">
                            <el-input v-model="systemSetting.organizationName" placeholder="组织名称，50字以内" :maxlength="50"/>
                        </el-form-item>
                        <el-form-item label="欢迎语：">
                            <el-input v-model="systemSetting.welcomeSpeech" placeholder="欢迎语，50字以内" :maxlength="50"/>
                        </el-form-item>
                        <el-form-item label="系统LOGO：">
                            <image-upload unrestricted :attributes="logoAttributes" v-model="systemSetting.systemLogo">
                                <span style="font-size: 12px;">点击设置系统LOGO，<span style="color: red;">图片应小于200Kb</span></span>
                            </image-upload>
                        </el-form-item>
                        <el-form-item label="系统Icon：">
                            <image-upload unrestricted :attributes="faviconAttributes" v-model="systemSetting.systemFavicon">
                                <span style="font-size: 12px;">点击设置系统favicon，<span style="color: red;">图片应小于40Kb</span></span>
                            </image-upload>
                        </el-form-item>
                        <el-form-item label="登录页面图标：">
                            <image-upload unrestricted :attributes="loginLogoAttributes" v-model="systemSetting.loginLogo">
                                <span style="font-size: 12px;">点击设置登录页面图标，<span style="color: red;">图片应小于500Kb</span></span>
                            </image-upload>
                        </el-form-item>
                        <el-form-item label="登录页面背景：">
                            <image-upload unrestricted :attributes="loginBackgroundAttributes" v-model="systemSetting.loginBackground">
                                <span style="font-size: 12px;">点击设置登录页面背景，<span style="color: red;">图片应小于5Mb</span></span>
                            </image-upload>
                        </el-form-item>
                        <el-form-item style="margin-top: 40px;">
                            <div class="text-align-right">
                                <el-button type="primary" @click="saveSetting('systemSetting',systemSetting)">保存配置</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    import ImageUpload from "../../../../../util/ImageUpload";
    import {SET_SYSTEM_SETTING} from "../../../../../../js/store/mutation-types";

    export default {
        name: "SystemSetting",
        components: {ImageUpload},
        data(){
            return {
                logoAttributes:{
                    width: 100,
                    height: 100,
                    uploadBtnText: '上传LOGO',
                    maxSize: 200 * 1024,
                    isContain: true
                },
                faviconAttributes:{
                    width: 100,
                    height: 100,
                    uploadBtnText: '上传favicon',
                    maxSize: 40 * 1024
                },
                loginLogoAttributes:{
                    width: 145,
                    height: 41,
                    uploadBtnText: '上传登录页面图标',
                    maxSize: 500 * 1024
                },
                loginBackgroundAttributes:{
                    uploadBtnText: '上传登录页面背景',
                    maxSize: 5 * 1024 * 1024
                },
                systemSetting:{
                    loginBackground: null,
                    loginLogo: null,
                    organizationName: null,
                    systemFavicon: null,
                    systemLogo: null,
                    systemName: null,
                    welcomeSpeech: null,
                    systemIntroduce: null
                }
            }
        },
        methods:{
            saveSetting(path,originalSetting) {
                let systemSetting = {...originalSetting};
                this.$request.post(`/api/admin/settings/manage/${path}`, systemSetting).then(() => {
                    if('systemSetting' === path){
                        this.$store.commit(SET_SYSTEM_SETTING,systemSetting);
                    }
                    this.$message.success('配置已更新');
                })
            },
            getSetting(){
                Promise.all([this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 1}})])
                    .then(([systemSettingRes]) => {
                        let defaultLoginBackground = 'https://xyh.huiyixing.com/group1/M00/00/26/CgIlOl4j_lSAKXu8AAc_Xgto4cs121.png';
                        this.systemSetting = {...systemSettingRes.data,loginBackground: systemSettingRes.data.loginBackground || defaultLoginBackground};
                    });
            }
        },
        created() {
            this.getSetting();
        }
    }
</script>
