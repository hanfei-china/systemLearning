<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="80px">
                <el-form-item label="头像：" required>
                    <div class="flex">
                        <div style="width: 130px;height: 130px;background-color: #d8d8d8;">
                            <el-image v-if="headImg" :src="headImg" style="width: 100%;height: 100%;" fit="cover"/>
                        </div>
                        <div style="padding-left: 20px;" class="flex flex-column flex-end">
                            <el-upload :action="action" multiple :show-file-list="false"
                                       :on-success="handleAvatarSuccess">
                                <el-button size="small" type="warning">上传图片</el-button>
                            </el-upload>
                            <p style="color: #7b8798;font-size: 12px;margin-top: 7px;">
                                建议上传图片尺寸：1:1；小于300KB；格式为.jpg、.gif、.png</p>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="姓名：" required>
                    <el-input placeholder="请输入嘉宾姓名，50字以内" v-model="name" :maxlength="50"/>
                </el-form-item>
                <el-form-item label="职位：" required>
                    <el-input placeholder="请输入嘉宾职位" v-model="positionTitle" :maxlength="128"/>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input placeholder="请输入嘉宾手机号" v-model="phone" :maxlength="32"/>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input placeholder="请输入嘉宾邮箱" v-model="mail" :maxlength="100"/>
                </el-form-item>
                <el-form-item label="介绍：">
                    <el-input placeholder="请输入嘉宾介绍，500字以内" type="textarea" :rows="5" resize="none" v-model="description"
                              :maxlength="500"/>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex flex-center flex-column unset-padding" height="auto"
                   style="padding-top: 16px !important;">
            <div class="flex flex-end">
                <el-button size="small" icon="el-icon-error" type="danger" @click="$emit('close')">取消返回</el-button>
                <el-button size="small" icon="el-icon-success" type="primary" @click="saveData">确 定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from '../../../../../../js/config/serviceConfig';

    export default {
        name: "GuestForm",
        props: ['guestId', 'activityId','isMain'],
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                description: '',
                headImg: '',
                mail: '',
                name: '',
                phone: '',
                positionTitle: ''
            }
        },
        created() {
            if (this.guestId) {
                this.getFormData();
            }
        },
        methods: {
            getFormData() {
                this.$request.get('/api/admin/HonoredGuest/getHonoredGuestById', {params: {id: this.guestId}}).then(res => {
                    if (res.success) {
                        this.description = res.data.description;
                        this.headImg = res.data.headImg;
                        this.mail = res.data.mail;
                        this.name = res.data.name;
                        this.phone = res.data.phone;
                        this.positionTitle = res.data.positionTitle;
                    }
                })
            },
            handleAvatarSuccess(res) {
                this.headImg = res.data;
            },
            saveData() {
                if (!this.headImg) {
                    this.$message.warning('请上传嘉宾头像');
                    return
                }
                if (!this.name) {
                    this.$message.warning('请输入嘉宾名字');
                    return
                }
                if (!this.positionTitle) {
                    this.$message.warning('请输入嘉宾职位');
                    return
                }

                if (this.guestId) {
                    this.$request.put('/api/admin/HonoredGuest/updateHonoredGuest', {
                        description: this.description,
                        headImg: this.headImg,
                        mail: this.mail,
                        name: this.name,
                        phone: this.phone,
                        positionTitle: this.positionTitle,
                        id: this.guestId,
                        isMain:this.isMain
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('编辑成功');
                            this.$emit('close');
                            this.$emit('refresh');
                        }
                    })
                } else {
                    if (this.activityId) {
                        this.$request.post('/api/admin/HonoredGuest/addHonoredGuestInActivity', {
                            activityId: this.activityId,
                            description: this.description,
                            headImg: this.headImg,
                            mail: this.mail,
                            name: this.name,
                            phone: this.phone,
                            positionTitle: this.positionTitle,
                            isMain:this.isMain
                        }).then(res => {
                            if (res.success) {
                                this.$message.success('添加成功');
                                this.$emit('close');
                                this.$emit('refresh');
                            }
                        })
                    } else {
                        this.$request.post('/api/admin/HonoredGuest/addHonoredGuest', {
                            description: this.description,
                            headImg: this.headImg,
                            mail: this.mail,
                            name: this.name,
                            phone: this.phone,
                            positionTitle: this.positionTitle,
                            isMain:this.isMain
                        }).then(res => {
                            if (res.success) {
                                this.$message.success('添加成功');
                                this.$emit('close');
                                this.$emit('refresh');
                            }
                        })
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
