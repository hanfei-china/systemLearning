<template>
    <div class="account-container fixed-fill-parent flex flex-center flex-column">
        <div class="flex flex-center">
            <div class="login-form-container background-color-white">
                <div class="text-align-center">
                    <span>
                        <img v-show="systemSetting.systemLogo" class="login-form-icon" :src="systemSetting.systemLogo"/>
                    </span>
                    <span class="login-form-title">{{systemSetting.systemName}}</span>
                </div>
                <div style="margin-top: 40px;">
                    <el-form size="medium">
                        <el-form-item>
                            <el-input ref="loginName" @keyup.native.enter="enter" prefix-icon="el-icon-s-custom" v-model="loginName" placeholder="请输入登录账号"/>
                        </el-form-item>
                        <el-form-item>
                            <el-input ref="password" @keyup.native.enter="enter" prefix-icon="el-icon-key" type="password" v-model="password" placeholder="请输入登录密码"/>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-button size="medium" style="width: 100%;" type="primary" @click="login">登录</el-button>
                </div>
                <div class="text-align-right" style="padding-top: 16px;">
<!--                    <div class="flex-fill-in-the-remaining-space">-->
                        <el-link @click="ssoSignIn">单点登录</el-link>
<!--                    </div>-->
<!--                    <div>-->
<!--                        <el-link @click="forgetPassword">忘记密码</el-link>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return {
                loginName: '',
                password: ''
            }
        },
        computed:{
            systemSetting(){
                return this.$store.state.systemSetting;
            }
        },
        created(){
            this.$request.get('/api/admin/account/loginCheck').then(()=>{
                this.$message.success({message:'已登录',duration:1000});
                this.$router.push('/console');
            })
        },
        methods:{
            enter(){
                if(!this.loginName){
                    this.$refs.loginName.focus();
                    return;
                }

                if(!this.password){
                    this.$refs.password.focus();
                    return;
                }

                this.login();
            },
            login(){
                this.$message.closeAll();
                if(!this.loginName){
                    this.$message.warning('请输入登录账号');
                    this.$refs.loginName.focus();
                    return;
                }

                if(!this.password){
                    this.$message.warning('请输入登录密码');
                    this.$refs.password.focus();
                    return;
                }

                this.$request.post('/api/admin/account/anon/login',{
                    loginName: this.loginName, password: this.password
                }).then(()=>{
                    this.$message.success({message:'登录成功',duration:1000});
                    this.$router.push('/console');
                }).catch(()=>{})
            },
            ssoSignIn(){
                this.$request.get('/api/admin/account/cas').then((resp)=>{
                    let {data} = resp;
                    if(data === 'success'){
                        this.$message.success({message:'已登录系统',duration:1000});
                        this.$router.push('/console');
                    }
                });
            },
            forgetPassword(){
                this.$router.push('/forgetPassword');
            }
        },
    }
</script>
