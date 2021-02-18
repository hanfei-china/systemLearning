<template>
    <div class="account-container fixed-fill-parent flex flex-center flex-column">
        <div class="forget-password-type-container">
            <div class="forget-password-type-container-title">
                手机短信找回密码
            </div>
            <div class="forget-pwd-type-content-container flex flex-center">
                <div v-if="confirmPasswordVal === 1">
                    <el-form style="width: 600px;margin-top: 70px;" label-width="100px" label-position="right">
                        <el-form-item>
                            <template v-slot:label>
                                <div class="custom-el-form-item-label required">
                                    用户名:
                                </div>
                            </template>
                            <el-input prefix-icon="iconfont icon-fl-renyuan" placeholder="用户名"></el-input>
                        </el-form-item>
                        <div class="flex">
                            <el-form-item class="flex-fill-in-the-remaining-space">
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        验证码:
                                    </div>
                                </template>
                                <el-input prefix-icon="iconfont icon-tag" placeholder="短信验证码"></el-input>
                            </el-form-item>
                            <div style="padding-left: 16px;">
                                <el-button type="primary">发送验证码</el-button>
                            </div>
                        </div>
                    </el-form>
                    <div class="text-align-center" style="padding: 14px 16px;">
                        <el-button type="primary" @click="verification">下一步</el-button>
                    </div>
                </div>
                <div v-else-if="confirmPasswordVal === 2">
                    <el-form style="width: 600px;margin-top: 70px;" label-width="100px">
                        <el-form-item>
                            <template v-slot:label>
                                <div class="custom-el-form-item-label required">
                                    新密码：
                                </div>
                            </template>
                            <el-input prefix-icon="iconfont icon-password" type="password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <template v-slot:label>
                                <div class="custom-el-form-item-label required">
                                    确认密码：
                                </div>
                            </template>
                            <el-input prefix-icon="iconfont icon-password" type="password" placeholder="请再次输入密码"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="text-align-center" style="padding: 14px 16px;">
                        <el-button type="primary">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ForgetPassword",
        data(){
            return {
                confirmPasswordVal: 1,//输入新密码模块
            }
        },
        methods: {
            verification(){
                this.confirmPasswordVal = 2;
            }
        }
    }
</script>

<style scoped>

</style>