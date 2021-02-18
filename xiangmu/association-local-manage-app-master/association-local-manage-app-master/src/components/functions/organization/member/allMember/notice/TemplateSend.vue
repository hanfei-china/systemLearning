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
    import MemberVirtualGroupMultiTree from "../../../../util/group/memberGroup/MemberVirtualGroupMultiTree";

    export default {
        name: "TemplateSend",
        components: {MemberVirtualGroupMultiTree},
        props: {
            receiverList: Array,
            virtualGroups: Array
        },
        data() {
            return {
                templateList: [],
                templateId: '',
                groupIds: [],
                conditions: ''
            }
        },
        created() {
            this.getTemplateList()
        },
        methods: {
            getTemplateList() {
                this.$request.get('/admin/communication/template/getTemplate', {
                    params: {
                        objectType: 0,
                        templateType: 0
                    }
                }).then(res => {
                    this.templateList = res.data
                })
            },
            sendMessage() {
                if (!this.templateId) {
                    this.$message.warning('请选择邮件模板');
                    return
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

                this.$request.post('/api/admin/message/sendMessageWithTemplate', {
                    templateId: this.templateId,
                    receivers: this.receiverList,
                    assembleSql: this.conditions,
                    allFlag: false
                }).then(res => {
                    if (res.success) {
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