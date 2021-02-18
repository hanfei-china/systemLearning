<template>
    <div class="absolute-fill-parent background-color-white">
        <vue-scroll>
            <div style="padding: 16px;">
                <el-card header="短信账号配置" shadow="never" :body-style="{ padding: '16px' }">
                    <el-form label-width="115px" size="small">
                        <el-form-item label="自动发送" required>
                            <el-checkbox disabled v-model="etongnetSetting.autosend">自动发送</el-checkbox>
                        </el-form-item>
                        <el-form-item label="SPId" required>
                            <el-input v-model="etongnetSetting.spid" placeholder="请输入SPId"/>
                        </el-form-item>
                        <el-form-item label="SPPassword" required>
                            <el-input v-model="etongnetSetting.sppassword" placeholder="请输入SPPassword"/>
                        </el-form-item>
                        <el-form-item label="服务器地址" required>
                            <el-input v-model="etongnetSetting.url" placeholder="请输入短信服务器地址"/>
                        </el-form-item>
                        <el-form-item label="消息编码格式" required>
                            <el-input v-model="etongnetSetting.dc" disabled placeholder="请输入消息编码格式"/>
                        </el-form-item>
                        <el-form-item>
                            <div class="text-align-right">
                                <el-button type="primary" @click="saveSetting('updateEtongnet',etongnetSetting)">保存配置</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card style="margin-top: 16px;" shadow="never">
                    <template v-slot:header>
                        <span>短信验证码模版配置<span class="danger-tip">({{tip}})</span></span>
                    </template>
                    <el-form label-width="115px" size="small">
                        <el-form-item label="登录模版" required>
                            <el-input v-model="verifyCodeSetting.loginMsg" placeholder="请输入登录验证码模版"/>
                        </el-form-item>
                        <el-form-item label="注册模版" required>
                            <el-input v-model="verifyCodeSetting.registerMsg" placeholder="请输入注册验证码模版"/>
                        </el-form-item>
                        <el-form-item label="重置密码模版" required>
                            <el-input v-model="verifyCodeSetting.resetMsg" placeholder="请输入重置密码验证码模版"/>
                        </el-form-item>
                        <el-form-item label="短信签名" required>
                            <el-input v-model="verifyCodeSetting.sign" placeholder="请输入短信签名"/>
                        </el-form-item>
                        <el-form-item>
                            <div class="text-align-right">
                                <el-button type="primary" @click="saveSetting('updateVerifyCode',verifyCodeSetting)">保存配置</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </vue-scroll>
    </div>
</template>

<script>

    export default {
        name: "SmsSetting",
        data() {
            return {
                tip: `请使用{{1}}表示验证码`,
                etongnetSetting: {
                    autosend: true,
                    dc: null,
                    spid: null,
                    sppassword: null,
                    url: null
                },
                verifyCodeSetting: {
                    loginMsg: null,
                    registerMsg: null,
                    resetMsg: null,
                    sign: null
                },
            }
        },
        methods: {
            saveSetting(path,originalSetting) {
                let setting = {...originalSetting};
                this.$request.post(`/api/admin/settings/manage/${path}`, setting).then(() => {
                    this.$message.success('配置已更新');
                })
            },
            getSetting() {
                Promise.all([this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 7}}),
                    this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 8}})])
                    .then(([etongnetRes, verifyCodeRes]) => {
                        this.etongnetSetting = {...etongnetRes.data,autosend: true,dc:8};
                        let {msgs,sign} = verifyCodeRes.data;
                        let verifyCodeSetting = {sign};
                        for(let msg of msgs){
                            let {type,content} = msg;
                            if(type === '0'){
                                verifyCodeSetting.loginMsg = content;
                            }
                            if(type === '1'){
                                verifyCodeSetting.registerMsg = content;
                            }
                            if(type === '2'){
                                verifyCodeSetting.resetMsg = content;
                            }
                        }
                        this.verifyCodeSetting = verifyCodeSetting;
                    })
            }
        },
        created() {
            this.getSetting();
        }
    }
</script>
