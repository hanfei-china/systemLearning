<template>
    <div class="absolute-fill-parent background-color-white">
        <vue-scroll>
            <div style="padding: 16px;">
                <el-card header="腾讯云点播配置" shadow="never" :body-style="{ padding: '16px' }">
                    <el-form label-width="130px" size="small">
                        <el-form-item label="secretId" required>
                            <el-input v-model="qCloudVodSetting.secretId" placeholder="请输入secretId"/>
                        </el-form-item>
                        <el-form-item label="secretKey" required>
                            <el-input v-model="qCloudVodSetting.secretKey" placeholder="请输入secretKey"/>
                        </el-form-item>
                        <el-form-item label="签名方式" required>
                            <el-input v-model="qCloudVodSetting.hmacAlgorithm" disabled placeholder="请输入签名方式"/>
                        </el-form-item>
                        <el-form-item label="编码格式" required>
                            <el-input v-model="qCloudVodSetting.charset" disabled placeholder="请输入编码格式"/>
                        </el-form-item>
                        <el-form-item>
                            <div class="text-align-right">
                                <el-button type="primary" @click="saveSetting('updateCloudVod',qCloudVodSetting)">保存配置</el-button>
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
        name: "TencentSetting",
        data() {
            return {
                qCloudVodSetting: {
                    secretId: null,
                    secretKey: null,
                    hmacAlgorithm: null,
                    charset: null,
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
                Promise.all([this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 6}})])
                    .then(([qCloudVodRes]) => {
                        this.qCloudVodSetting = {...qCloudVodRes.data.qcloudVod,hmacAlgorithm:'HmacSHA1',charset:'UTF-8'};
                    })
            }
        },
        created() {
            this.getSetting();
        }
    }
</script>
