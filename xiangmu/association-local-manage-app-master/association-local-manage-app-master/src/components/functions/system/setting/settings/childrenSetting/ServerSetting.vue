<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-main class="position-relative unset-padding">
            <vue-scroll class="absolute-fill-parent">
                <div style="height: 380px;padding: 20px;width: 800px;">
                    <el-alert title="使用第三方客户端发送邮件时，有的邮箱（例如网易邮箱）需要使用授权码。获取授权码方式见邮箱的官方说明。"
                              type="warning" show-icon :closable="false" style="margin-bottom: 20px;"></el-alert>
                    <el-form label-width="130px" size="small">
                        <el-form-item label="smtp服务器地址：">
                            <el-input v-model="setting.smtpServerHost" placeholder="smtp服务器地址"/>
                            <div>例如：<span class="warning-tip">smtp.aliyun.com</span></div>
                        </el-form-item>
                        <el-form-item label="邮箱用户名：">
                            <el-input v-model="setting.userName" placeholder="邮箱用户名"/>
                            <div>例如：<span class="warning-tip">xxx@aliyun.com</span></div>
                        </el-form-item>
                        <el-form-item label="密码或授权码：">
                            <el-input v-model="setting.password" placeholder="邮箱密码或授权码" type="password"/>
                        </el-form-item>
                        <el-form-item style="margin-top: 40px;">
                            <el-button type="primary" @click="saveSetting">&nbsp;&nbsp;&nbsp;保存配置&nbsp;&nbsp;&nbsp;
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "ServerSetting",
        data() {
            return {
                setting: {
                    smtpServerHost: '',
                    userName: '',
                    password: ''
                },
            }
        },
        methods: {
            saveSetting() {
                let setting = {...this.setting};
                this.$request.post('/api/admin/settings/manage/updateEmailSetting', setting).then(() => {
                    this.$message.success('服务器配置已更新');
                })
            },
            getSetting() {
                this.$request.get('/api/admin/settings/manage/getEmailSetting').then(res => {
                    if (res.success) {
                        if (res.data !== null) {
                            this.setting = res.data;
                        }
                    }
                })
            }
        },
        created() {
            this.getSetting();
        }
    }
</script>

<style scoped>

</style>