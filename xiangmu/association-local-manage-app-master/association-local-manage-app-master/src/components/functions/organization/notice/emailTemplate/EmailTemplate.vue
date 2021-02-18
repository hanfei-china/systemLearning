<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-main class="position-relative unset-padding" v-if="!templateFormVisible">
            <el-container class="absolute-fill-parent" style="padding: 20px;">
                <el-header height="auto" class="flex" style="padding: 0 0 20px;">
                    <div class="flex-fill-in-the-remaining-space" style="line-height: 32px;">配置信息</div>
                    <div>
                        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addTemplate">添加模板</el-button>
                    </div>
                </el-header>
                <el-main class="unset-padding">
                    <el-table :data="list" height="100%" class="custom-el-table header-gray" size="small" border stripe>
                        <el-table-column type="index"/>
                        <el-table-column label="模板名称" width="200" prop="template.title" show-tooltip-when-overflow/>
                        <el-table-column label="邮件主题" width="200" prop="template.subject" show-tooltip-when-overflow/>
                        <el-table-column label="模板内容" prop="showContent" show-tooltip-when-overflow/>
                        <el-table-column label="操作" width="120">
                            <template v-slot="{row}">
                                <el-button size="small" type="text" class="unset-padding custom-el-button" @click="editTemplate(row.template.id)">编辑</el-button>
                                <el-button size="small" type="text" class="unset-padding custom-el-button danger" @click="deleteTemplate(row.template)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-main>
        <el-main class="position-relative unset-padding" v-else>
            <template-form v-if="templateFormVisible" :templateId="templateId" @close="templateFormVisible = false" @refresh="refresh"/>
        </el-main>
    </el-container>
</template>

<script>
    import TemplateForm from "./TemplateForm";
    export default {
        name: "EmailTemplate",
        components: {TemplateForm},
        data(){
            return {
                list: [],
                templateFormVisible: false,
                templateId: '',//编辑的模板id
            }
        },
        created(){
            this.getList();
        },
        methods: {
            getList(){
                this.$request.get('/admin/communication/template/getTemplate',{params: {
                        objectType: 0,
                        templateType: 0
                    }}).then(res => {
                    if (res.success){
                        this.list = res.data;
                    }
                })
            },
            addTemplate(){
                this.templateFormVisible = true;
                this.templateId = '';
            },
            editTemplate(id){
                this.templateFormVisible = true;
                this.templateId = id;
            },
            deleteTemplate(template){
                this.$msgbox.confirm('删除操作不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/admin/communication/template/deleteTemplate',{
                        params:{templateId: template.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.getList();
                            this.$message.success(`【${template.title}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            },
            refresh(){
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>
