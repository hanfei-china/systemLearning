<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form label-width="120px" size="small">
                <el-form-item label="姓名：" required>
                    <el-input placeholder="请输入讲师姓名" v-model="name"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" required>
                    <el-input placeholder="请输入讲师手机号" v-model="phone"></el-input>
                </el-form-item>
                <el-form-item label="头像：" required>
                    <div class="flex">
                        <div style="width: 120px;height: 120px;background-color: #999999;margin-right: 16px;">
                            <img v-if="avatar" :src="avatar" class="avatar"/>
                        </div>
                        <div class="flex flex-column flex-end">
                            <el-upload :action="action" :show-file-list="false"
                                       :on-success="uploadSuccess">
                                <el-button size="small" type="primary">上传头像</el-button>
                            </el-upload>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="简介：">
                    <el-input type="textarea" v-model="introduction" :rows="5" resize="none" placeholder="请输入讲师简介"></el-input>
                </el-form-item>
                <el-form-item label="启用：">
                    <el-switch v-model="enabled" active-color="#13ce66"></el-switch>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer height="auto" class="unset-padding text-align-right">
            <el-button size="small" type="danger" @click="$emit('close')">取消返回</el-button>
            <el-button size="small" type="primary" @click="saveData">确定保存</el-button>
        </el-footer>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from '../../../../../js/config/serviceConfig';
    export default {
        name: "LecturerForm",
        props: {
            id: String
        },
        data(){
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',//图片上传地址

                avatar: '',
                enabled: false,
                introduction: '',
                name: '',
                phone: ''
            }
        },
        created(){
            if(this.id){
                this.getInfo();
            }
        },
        methods: {
            getInfo(){
                this.$request.get('/api/admin/onlineCourse/Lecturer/' + this.id).then(res=>{
                    if(res.success){
                        this.avatar = res.data.avatar;
                        this.enabled = res.data.enabled;
                        this.introduction = res.data.introduction;
                        this.name = res.data.name;
                        this.phone = res.data.phone;
                    }
                })
            },
            uploadSuccess(res) {
                this.avatar = res.data;
            },
            saveData(){
                if(!this.name){
                    this.$message.warning('请输入讲师姓名');
                    return;
                }
                if(!this.phone){
                    this.$message.warning('请输入讲师手机号');
                    return;
                }
                if(!this.avatar){
                    this.$message.warning('请上传讲师头像');
                    return;
                }
                if(this.id){
                    this.$request.put('/api/admin/onlineCourse/Lecturer',{
                        avatar: this.avatar,
                        enabled: this.enabled,
                        introduction: this.introduction,
                        name: this.name,
                        phone: this.phone,
                        id: this.id
                    }).then(res=>{
                        if(res.success){
                            this.$message.success('讲师已编辑');
                            this.$emit('close');
                            this.$emit('refresh');
                        }
                    })
                }else {
                    this.$request.post('/api/admin/onlineCourse/Lecturer',{
                        avatar: this.avatar,
                        enabled: this.enabled,
                        introduction: this.introduction,
                        name: this.name,
                        phone: this.phone
                    }).then(res=>{
                        if(res.success){
                            this.$message.success('讲师已添加');
                            this.$emit('close');
                            this.$emit('refresh');
                        }
                    })
                }
            }
        }
    }
</script>

<style>
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
