<template>
    <div class="absolute-fill-parent background-color-white">
        <vue-scroll>
            <div style="padding: 16px;">
                <el-card header="CAS单点登录配置" shadow="never" :body-style="{ padding: '16px' }">
                    <el-alert style="margin-bottom: 16px;" title="cas服务前缀、cas登录地址、客户端前缀以及cas登出地址变更后需要重新启动服务" type="warning" show-icon></el-alert>
                    <el-form label-width="130px" size="small">
                        <el-form-item label="启用单点" required>
                            <el-checkbox v-model="casClientSetting.isUsed">启用单点登录</el-checkbox>
                        </el-form-item>
                        <el-form-item label="cas服务前缀" required>
                            <el-input v-model="casClientSetting.serverUrlPrefix" placeholder="请输入cas服务前缀"/>
                        </el-form-item>
                        <el-form-item label="cas登录地址" required>
                            <el-input v-model="casClientSetting.serverLoginUrl" placeholder="请输入cas服务登录地址"/>
                        </el-form-item>
                        <el-form-item label="客户端前缀" required>
                            <el-input v-model="casClientSetting.clientHostUrl" placeholder="请输入cas客户端前缀"/>
                        </el-form-item>
                        <el-form-item label="cas登出地址" required>
                            <el-input v-model="casClientSetting.clientLogoutUrl" placeholder="请输入cas登出地址"/>
                        </el-form-item>
                        <el-form-item>
                            <div class="text-align-right">
                                <el-button type="primary" @click="saveSetting('updateCas',casClientSetting)">保存配置</el-button>
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
        name: "UnifiedIdentitySetting",
        data() {
            return {
                casClientSetting: {
                    isUsed: false,
                    serverUrlPrefix: '',
                    serverLoginUrl: '',
                    clientHostUrl: '',
                    clientLogoutUrl: ''
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
                Promise.all([this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 14}})])
                    .then(([casClientRes]) => {
                        this.casClientSetting = casClientRes.data;
                    })
            }
        },
        created() {
            this.getSetting();
        }
    }
</script>
