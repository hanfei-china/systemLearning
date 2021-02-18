<template>
    <el-container>
        <el-main>
            <el-form size="small" label-width="95px">
                <el-form-item label="邮件主题：" required>
                    <el-input v-model="subject" placeholder="请输入邮件主题"/>
                </el-form-item>
                <el-form-item label="邮件内容：" required>
                    <div class="el-textarea el-input--small">
                        <label>
                            <textarea autocomplete="off" v-model="content" rows="5" placeholder="请输入邮件内容" class="el-textarea__inner" style="resize: none; min-height: 31px;"/>
                        </label>
                    </div>
                </el-form-item>
                <el-form-item label="上传附件：">
                    <multiple-upload :before-upload="beforeUpload" v-model="attachPaths" tip="单个文件应小于100M"/>
                </el-form-item>
                <el-form-item label="会员分组：" v-if="receiverList && receiverList.length === 0">
                    <member-virtual-group-multi-tree v-model="groupIds" :virtualGroup="virtualGroups" :conditions.sync='conditions'></member-virtual-group-multi-tree>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="sendMessage">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from '../../../../../../js/config/serviceConfig';
    import MultipleUpload from "../../../../util/upload/MultipleUpload";
    import MemberVirtualGroupMultiTree from "../../../../util/group/memberGroup/MemberVirtualGroupMultiTree";

    export default {
        name: "NotTemplateSend",
        components: {MemberVirtualGroupMultiTree, MultipleUpload},
        props: {
            receiverList: Array,
            virtualGroups: Array
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',//图片上传地址
                subject: '',//邮件主题，当消息类型为邮件时上传此字段
                content: '',//消息内容
                attachPaths: [],//附件
                groupIds: [],//分组id
                conditions: ''
            }
        },
        methods: {
            beforeUpload(file) {
                if (file.size > 100 * 1024 * 1024) {
                    this.$message.warning(`【${file.name}】上传失败，文件大小应不大于100M`);
                    return false;
                }
                return true;
            },
            sendMessage() {
                if (!this.content) {
                    this.$message.warning("请输入邮件内容")
                }
                if (!this.subject) {
                    this.$message.warning("请输入邮件主题")
                }

                if (this.receiverList.length === 0 && this.groupIds.length === 0) {
                    this.$message.warning('请选择邮件接收者');
                    return;
                }

                if(this.conditions){
                    this.conditions = ` and ${this.conditions}`;
                }

                if(this.receiverList.length === 0 && !this.conditions){
                    this.conditions = ' 1=1 ';
                }

                this.$request.post('/api/admin/message/sendMessageNoTemplate', {
                    attachPaths: JSON.stringify(this.attachPaths),//附件
                    content: this.content,//消息内容
                    messageType: 0,//消息类型：0-邮件
                    objectType: 0,//发送对象：0-会员；1-活动人员
                    subject: this.subject,//邮件主题，当消息类型为邮件时上传此字段
                    receivers: this.receiverList,//用户列表
                    assembleSql: this.conditions,
                    allFlag: false
                }).then(res => {
                    if (res.success) {
                        this.$message.success("发送成功");
                        this.$emit("close")
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
