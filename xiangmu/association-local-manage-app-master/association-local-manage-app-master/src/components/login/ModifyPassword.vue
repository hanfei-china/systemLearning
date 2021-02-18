<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form ref="form" style="width: 100%;" size="small" label-width="100px" :model="userForm" :rules="rules">
                <el-form-item label="原密码：" prop="password">
                    <el-input :readonly="readonly" @focus="readonly = false" type="password" v-model="userForm.password" auto-complete="new-password"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="password1">
                    <el-input :readonly="readonly" @focus="readonly = false" type="password" v-model="userForm.password1" auto-complete="new-password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="password2">
                    <el-input :readonly="readonly" @focus="readonly = false" type="password" v-model="userForm.password2" auto-complete="new-password"></el-input>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer height="auto" class="unset-padding">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="modifyPwd">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "ModifyPassword",
        data(){
            return {
                readonly: true,
                userForm:{
                    password: '',
                    password1: '',
                    password2: ''
                },
                rules: {
                    password: [
                        {required: true, message: '请输入原密码', trigger: ['blur', 'change']}
                    ],
                    password1: [
                        {required: true, message: '请输入新密码', trigger: ['blur', 'change']}
                    ],
                    password2: [
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if (value === '') {
                                    callback(new Error('请输入确认密码'));
                                } else if (value !== this.userForm.password1) {
                                    callback(new Error('两次输入密码不一致!'));
                                } else {
                                    callback();
                                }
                            }, trigger: ['blur', 'change']
                        }
                    ]
                }
            }
        },
        methods:{
            modifyPwd(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                       this.$request.put('/api/admin/account/modifyPassword',{...this.userForm}).then(()=>{
                           this.$emit('close');
                           this.$message.success({message:"密码修改成功",duration:1500});
                       })
                    }
                });
            }
        }
    }
</script>
