<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent" style="padding: 20px;" v-if="!sendRecordVisible">
                <el-header class="flex border-bottom" height="auto" style="padding: 0 0 20px;">
                    <div class="flex-fill-in-the-remaining-space" style="line-height: 32px;">{{nowPrivilege ? nowPrivilege.menuTitle :''}}</div>
                    <div>
                        <el-button size="small" type="primary" @click="sendRecordVisible = true">消息日志</el-button>
                    </div>
                </el-header>
                <el-main class="unset-padding border-bottom position-relative">
                    <el-container class="absolute-fill-parent" style="padding-top: 20px;">
                        <el-aside class="border-right-dashed flex flex-column" width="600px">
                            <div class="flex" style="line-height: 32px;padding: 10px;">
                                <span>消息模板</span>
                                <div class="flex-fill-in-the-remaining-space" style="padding: 0 0 0 10px;">
                                    <el-select size="small" v-model="templateId">
                                        <el-option v-for="item in templateList" :key="item.template.id"
                                                   :value="item.template.id"
                                                   :label="item.template.title"></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="flex-fill-in-the-remaining-space flex"
                                 style="line-height: 32px;padding: 10px;">
                                <span>消息预览</span>
                                <div class="flex-fill-in-the-remaining-space" style="padding: 0 0 0 10px;">
                                    <div class="border" style="width: 100%;height: 100%;box-sizing: border-box;">
                                        <vue-scroll>
                                            <div v-html="templateContent"></div>
                                        </vue-scroll>
                                    </div>
                                </div>
                            </div>
                        </el-aside>
                        <el-main class="unset-padding position-relative">
                            <template-export v-model="url"></template-export>
                        </el-main>
                    </el-container>
                </el-main>
                <el-footer height="auto" class="text-align-right" style="padding-top: 20px;">
                    <el-button size="small" type="primary" @click="send">发送</el-button>
                </el-footer>
            </el-container>
            <send-record v-if="sendRecordVisible" @close="sendRecordVisible = false"></send-record>
        </el-main>
    </el-container>
</template>

<script>
    import SendRecord from "./SendRecord";
    import TemplateExport from "./TemplateExport";

    export default {
        name: "EmailNotice",
        components: {TemplateExport, SendRecord},
        data() {
            return {
                sendRecordVisible: false,//查看发送日志

                templateList: [],
                templateId: '',//消息发送模板
                templateContent: '',//展示的内容
                url: ''
            }
        },
        computed:{
            privileges(){
                return this.$store.state.privileges;
            },
            nowPrivilege(){
                return this.$store.getters.getPrivilegeByMenuPath(this.$route.path,this.privileges);
            },
        },
        created() {
            this.getTemplateList()
        },
        watch: {
            templateId(val) {
                for (let item of this.templateList) {
                    if (item.template.id === val) {
                        this.templateContent = item.showContent
                    }
                }
            }
        },
        methods: {
            getTemplateList() {
                this.$request.get('/admin/communication/template/getTemplate', {
                    params: {
                        objectType: 0,
                        templateType: 0
                    }
                }).then(res => {
                    if (res.success) {
                        this.templateList = res.data;
                    }
                })
            },
            send(){
                if(!this.templateId){
                    this.$message.warning('请选择消息模板');
                    return
                }
                if(!this.url){
                    this.$message.warning('请上传文件');
                    return
                }

                this.$request.post('/api/admin/message/sendMessageWithTemplateAndFile',{
                    templateId: this.templateId,
                    url: this.url
                }).then(res => {
                    if(res.success){
                        this.$message.success('邮件已发送')
                    }else {
                        this.$message.error(res.msg);
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
