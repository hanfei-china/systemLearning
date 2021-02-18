<template>
    <div class="absolute-fill-parent background-color-white">
        <vue-scroll>
            <div style="padding: 16px;">
                <el-card header="网站抓取配置" shadow="never" :body-style="{ padding: '16px' }">
                    <el-form label-width="0" size="small">
                        <el-form-item>
                            <el-checkbox v-model="grabWebsiteSetting.grab">抓取网站内容</el-checkbox>
                        </el-form-item>
                        <el-form-item>
                            <div class="text-align-right">
                                <el-button type="primary" @click="saveSetting('updateWebsiteGrab',grabWebsiteSetting)">保存配置</el-button>
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
        name: "OtherSetting",
        data() {
            return {
                grabWebsiteSetting: {
                    grab: false
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
                Promise.all([this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 12}})])
                    .then(([grabWebsiteRes]) => {
                        this.grabWebsiteSetting = {...grabWebsiteRes.data};
                    })
            }
        },
        created() {
            this.getSetting();
        }
    }
</script>
