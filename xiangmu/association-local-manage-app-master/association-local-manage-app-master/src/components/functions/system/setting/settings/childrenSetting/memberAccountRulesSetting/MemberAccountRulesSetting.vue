<template>
    <div class="absolute-fill-parent background-color-white">
        <vue-scroll>
            <div style="padding: 16px;">
                <el-card header="会员账号创建规则" shadow="never" :body-style="{ padding: '16px' }">
                    <el-form label-width="95px" size="small">
                        <el-form-item label="账号字段：">
                            <all-member-field-choose placeholder="请选择账号字段" v-model="memberAccountRulesSetting.accountField"/>
                        </el-form-item>
                        <el-form-item label="注册时：">
                            <account-rules v-model="memberAccountRulesSetting.registerRules"/>
                        </el-form-item>
                        <el-form-item label="导入时：">
                            <account-rules v-model="memberAccountRulesSetting.importRules"/>
                        </el-form-item>
                        <el-form-item>
                            <div class="text-align-right">
                                <el-button type="primary" @click="saveSetting('updateMemberAccountRules',memberAccountRulesSetting)">保存配置</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </vue-scroll>
    </div>
</template>

<script>

    import AllMemberFieldChoose from "../../../../../organization/member/memberField/AllMemberFieldChoose";
    import AccountRules from "../../../../memberPrivilege/memberAccountRule/components/AccountRules";
    export default {
        name: "MemberAccountRulesSetting",
        components: {AccountRules, AllMemberFieldChoose},
        data() {
            return {
                memberAccountRulesSetting: {
                    accountField: null,
                    registerRules: [],
                    importRules: []
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
                Promise.all([this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 16}})])
                    .then(([memberAccountRulesRes]) => {
                        this.memberAccountRulesSetting = memberAccountRulesRes.data;
                    })
            }
        },
        created() {
            this.getSetting();
        }
    }
</script>
