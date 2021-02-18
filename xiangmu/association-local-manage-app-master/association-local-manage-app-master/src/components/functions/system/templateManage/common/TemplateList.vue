<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space">
                    <el-input size="small" style="width:300px;" v-model="templateName" prefix-icon="el-icon-search" placeholder="请输入模版名称进行搜索"/>
                </div>
                <div>
                    <el-button size="small" type="primary" @click="newTemplate">新增模版</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative" v-loading="loading">
            <vue-scroll v-if="list.length > 0">
                <div class="flex flex-wrap" style="padding: 16px;">
                    <template-item v-for="item of list" :key="item.id" :template-info="item"
                                   @edit="editTemplate" @delete="deleteTemplate"/>
                </div>
            </vue-scroll>
            <no-data v-else/>
        </el-main>
        <el-footer class="flex flex-column flex-center border-top">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space">

                </div>
                <div>
                    <el-pagination background :total="total" :page-size="page.pageSize" :current-page="page.pageNum"
                                   layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,50]"
                                   @size-change="sizeChange" @current-change="currentChange"/>
                </div>
            </div>
        </el-footer>
        <el-dialog :visible.sync="templateDialogVisible" :title="templateDialogTitle"
                   :close-on-click-modal="false" append-to-body width="760px">
            <template-form v-if="templateDialogVisible" :template-type="templateType" :module-id="moduleId"
                           :template-id="templateFormId" :seq="seq" :template-config="templateConfig"
                           @close="templateDialogVisible=false" @refresh="refreshList"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import TemplateForm from "./TemplateForm";
    import TemplateItem from "./TemplateItem";
    import NoData from "../../../../util/noData/NoData";
    export default {
        name: "TemplateList",
        components: {NoData, TemplateItem, TemplateForm},
        props:{
            templateType: Number,
            moduleId: String,
            templateConfig: String
        },
        data(){
            return {
                templateName: '',
                total: 0,
                page: {
                    pageSize: 20,
                    pageNum: 1
                },
                list: [],
                seq: 0,
                templateFormId: null,
                templateDialogVisible: false,
                templateDialogTitle: '新增模版',
                loading: true
            }
        },
        methods:{
            sizeChange(val){
                this.page.pageSize = val;
                this.page.pageNum = 1;
                this.getList();
            },
            currentChange(val){
                this.page.pageNum = val;
                this.getList();
            },
            getList(){
                this.loading = true;
                let params = {
                    limit: this.page.pageSize,
                    offset: this.page.pageSize * (this.page.pageNum - 1),
                    templateType: this.templateType,
                    moduleId: this.moduleId,
                    templateName: this.templateName
                };

                this.$request.post('/api/common/designTemplate/list',params).then(res=>{
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            newTemplate(){
                this.templateFormId = null;
                this.templateDialogTitle = '新增模版';
                this.templateDialogVisible = true;
            },
            editTemplate(templateId){
                this.templateFormId = templateId;
                this.templateDialogTitle = '编辑模版';
                this.templateDialogVisible = true;
            },
            deleteTemplate(id){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/designTemplate',{
                        params:{id}
                    }).then(()=>{
                        this.refreshList();
                        this.$message.success('模版已删除');
                    })

                }).catch(()=>{});
            },
            refreshList(){
                this.page.pageNum = 1;
                this.getList();
            }
        },
        created() {
            this.getList();
        },
        watch:{
            templateName(){
                this.refreshList();
            },
            moduleId(){
                this.refreshList();
            },
            templateType(){
                this.refreshList();
            },
        }
    }
</script>
