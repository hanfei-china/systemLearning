<template>
    <div class="absolute-fill-parent background-color-white">
        <vue-scroll>
            <div style="padding: 16px;">
                <el-card header="百度人脸识别配置" shadow="never" :body-style="{ padding: '16px' }">
                    <el-form label-width="130px" size="small">
                        <el-form-item label="人脸库(appId)" required>
                            <el-input v-model="faceIdentitySetting.appId" placeholder="请输入appId"/>
                        </el-form-item>
                        <el-form-item label="appKey" required>
                            <el-input v-model="faceIdentitySetting.appKey" placeholder="请输入appKey"/>
                        </el-form-item>
                        <el-form-item label="appSecret" required>
                            <el-input v-model="faceIdentitySetting.appSecret" placeholder="请输入appSecret"/>
                        </el-form-item>
                        <el-form-item label="用户组(groupId)" required>
                            <el-input v-model="faceIdentitySetting.face_identification_group_id" placeholder="请输入小程序管理后台设置的token"/>
                        </el-form-item>
                        <el-form-item label="匹配阈值" required>
                            <el-input-number controls-position="right" :min="0" :max="100" v-model="faceIdentitySetting.threshold_score" />
                        </el-form-item>
                        <el-form-item>
                            <div class="text-align-right">
                                <el-button type="primary" @click="saveSetting('updateBaiduFace',faceIdentitySetting)">保存配置</el-button>
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
        name: "BaiduSetting",
        data() {
            return {
                faceIdentitySetting: {
                    appId: null,
                    appKey: null,
                    appSecret: null,
                    face_identification_group_id: null,
                    threshold_score: 0
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
                Promise.all([this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 13}})])
                    .then(([faceIdentityRes]) => {
                        this.faceIdentitySetting = faceIdentityRes.data;
                    })
            }
        },
        created() {
            this.getSetting();
        }
    }
</script>
