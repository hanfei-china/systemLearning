<template>
    <el-container>
        <el-main>
            <el-form size="small" label-width="120px">
                <el-form-item label="邮件模板：" required>
                    <el-select placeholder="请选择邮件模板" v-model="templateId">
                        <el-option v-for="item in templateList" :key="item.template.id" :value="item.template.id"
                                   :label="item.template.title"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="allFlag">发送给全部活动人员</el-checkbox>
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
    export default {
        name: "TemplateSend",
        props: ['activityId','receiverList'],
        data() {
            return {
                templateList: [],
                templateId: '',
                allFlag: false
            }
        },
        created() {
            this.getTemplateList()
        },
        methods: {
            getTemplateList() {
                this.$request.get('/admin/communication/template/getTemplate', {
                    params: {
                        objectId: this.activityId,
                        objectType: 1,
                        templateType: 0
                    }
                }).then(res => {
                    this.templateList = res.data
                })
            },
            sendMessage(){
                if(!this.templateId){
                    this.$message.warning('请选择邮件模板');
                    return
                }

                if(!this.allFlag && this.receiverList.length === 0){
                    this.$message.warning('请选择邮件接收者');
                    return;
                }

                this.$request.post('/api/admin/message/sendMessageWithTemplate',{
                    allFlag: this.allFlag,
                    templateId: this.templateId,
                    receivers: this.receiverList
                }).then(res => {
                    if(res.success){
                        this.$message.success('发送成功');
                        this.$emit("close")
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>