<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside v-if="!routeClassId" class="border-right unset-padding position-relative" width="200px">
            <online-form-class-menu @select="setChosenClass"/>
        </el-aside>
        <el-main class="unset-padding position-relative" v-show="classId || routeClassId">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-column flex-center">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                            <div class="flex">
                                <el-input style="max-width: 450px;" v-model="title" clearable placeholder="请输入表单标题进行搜索" size="small"/>
                            </div>
                        </div>
                        <div>
                            <el-button type="primary" size="small" @click="createOnlineForm" v-if="!isFixed">新建表单</el-button>
                        </div>
                    </div>
                </el-header>
                <el-main class="position-relative unset-vertical-padding">
                    <el-table size="small" :data="list" height="100%" class="custom-el-table header-gray" border stripe>
                        <el-table-column label="序号" width="50">
                            <template v-slot="{$index}">
                                <div class="text-align-center">
                                    {{$index+1}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="表单标题" prop="formTitle" width="200"/>
                        <el-table-column label="备注" show-tooltip-when-overflow>
                            <template v-slot="{row}">
                                <span v-hyperlink="{innerHtml:row.formDescription}" />
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" width="140">
                            <template v-slot="{row}">
                                <span>{{ row.createTime | yyyyMMddHHmm }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="更多操作" width="240">
                            <template v-slot="{row}">
                                <el-button class="custom-el-button danger unset-padding" type="text" size="mini" @click="deleteOnlineForm(row)" v-if="!isFixed">删除</el-button>
                                <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="updateOnlineForm(row)">编辑</el-button>
                                <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="designOnlineForm(row.id)">设计表单</el-button>
                                <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="onlineFormDataManage(row.id)">数据管理</el-button>
                                <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="shareData(row.id)">分享</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer height="auto" class="unset-padding">
                    <div style="padding-bottom: 16px;padding-top: 16px;" class="flex">
                        <div class="flex-fill-in-the-remaining-space">

                        </div>
                        <div>
                            <el-pagination background :total="total" :page-size="page.pageSize" :current-page="page.pageNum"
                                           layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,50]"
                                           @size-change="sizeChange" @current-change="currentChange"/>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
        <el-dialog :visible.sync="formDialogVisible" :title="formDialogTitle" width="650px"
                   append-to-body :close-on-click-modal="false">
            <el-form size="small" label-width="120px" style="max-width: 750px;" v-if="formDialogVisible">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            表单名称：
                        </div>
                    </template>
                    <el-input v-model="formTitle" placeholder="请输入表单名称，20字以内" :maxlength="20"/>
                </el-form-item>
                <el-form-item v-show="!routeClassId">
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            表单分类：
                        </div>
                    </template>
                    <online-form-class-choose style="width: 100%;" v-model="formClassId"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            备注：
                        </div>
                    </template>
                    <el-input v-model="formDescription" placeholder="请输入备注，200字以内" type="textarea" :rows="6" resize="none" :maxlength="200"/>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="formDialogVisible=false">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </template>
        </el-dialog>
        <el-dialog :visible.sync="shareVisible" title="表单分享" width="650px"
                   append-to-body :close-on-click-modal="false">
            <el-input v-model="shareFormLink" disabled size="small" ref="copyValue">
                <el-button slot="append" icon="el-icon-document-copy" @click="copyLink">复制链接</el-button>
            </el-input>
        </el-dialog>
    </el-container>
</template>

<script>
    import OnlineFormClassMenu from "./onlineFormClassManage/OnlineFormClassMenu";
    import OnlineFormClassChoose from "./onlineFormClassManage/OnlineFormClassChoose";
    export default {
        name: "OnlineFormList",
        components: {OnlineFormClassChoose, OnlineFormClassMenu},
        data(){
            return {
                formDialogVisible: false,
                formDialogTitle:'',
                formId: null,
                formTitle: '',
                formDescription: '',

                page:{
                    pageSize: 20,
                    pageNum: 1,
                },
                title: '',
                total: 0,
                list:[],
                classId: '',
                formClassId:'',

                shareVisible: false,
                shareFormLink: '',
                isFixed:false        //判断是否为固定表单---内部表单不可删除、添加
            }
        },
        computed:{
            branchId(){
                return this.$store.state.branchId;
            },
            routeClassId(){
                return this.$route.params.classId;
            }
        },
        methods:{
            setChosenClass(classId,isFixed){
                this.classId = classId;
                this.isFixed=isFixed;
            },
            createOnlineForm(){
                this.formId = null;
                this.formTitle = '';
                this.formDescription = '';
                this.formClassId = this.classId;
                this.formDialogTitle = '新建表单';
                this.formDialogVisible = true;
            },
            deleteOnlineForm(row){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/onlineForm',{
                        params: {id: row.id}
                    }).then(()=>{
                        this.refreshList();
                        this.$message.success("表单已删除");
                    })
                }).catch(()=>{});
            },
            updateOnlineForm(row){
                this.formId = row.id;
                this.formTitle = row.formTitle;
                this.formDescription = row.formDescription;
                this.formClassId = row.classId;
                this.formDialogTitle = '修改表单';
                this.formDialogVisible = true;
            },
            submitData(){
                if(!this.formTitle){
                    this.$message.warning('请输入表单名称');
                    return;
                }

                let data = {
                    formTitle: this.formTitle,
                    formDescription: this.formDescription,
                    classId: this.formClassId || this.routeClassId
                };

                if(!this.formId){
                    this.$request.post('/api/admin/onlineForm',data).then(()=>{
                        this.refreshList();
                        this.formDialogVisible = false;
                        this.$message.success("表单新建成功");
                    })
                }else{
                    data.id = this.formId;
                    this.$request.put('/api/admin/onlineForm',data).then(()=>{
                        this.refreshList();
                        this.formDialogVisible = false;
                        this.$message.success("表单修改成功");
                    })
                }

            },
            refreshList(){
                this.page.pageNum = 1;
                this.getList();
            },
            sizeChange(size){
                this.page.pageSize =size;
                this.refreshList();
            },
            currentChange(current){
                this.page.pageNum = current;
                this.getList();
            },
            getList(){
                let params = {
                    formTitle: this.title,
                    limit: this.page.pageSize,
                    offset: (this.page.pageNum - 1) * this.page.pageSize,
                    classId: this.classId || this.routeClassId
                };
                this.$request.get('/api/admin/onlineForm/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                    this.total = data.total;
                })
            },
            designOnlineForm(formId){
                window.open(this.$router.resolve(`/onlineForm/${formId}/design`).href,'_blank');
            },
            onlineFormDataManage(formId){
                window.open(this.$router.resolve(`/onlineForm/${formId}/dataManage`).href,'_blank');
            },
            shareData(formId){
                this.shareVisible = true;
                this.shareFormLink = window.location.origin + window.location.pathname + '#/formPage/' + formId;
            },
            copyLink(){
                let copyValue = document.createElement('input');
                copyValue.value = this.shareFormLink;
                document.body.appendChild(copyValue);
                copyValue.select();
                document.execCommand('Copy');
                this.$message.success('复制成功');
                copyValue.remove();
            }
        },
        created() {
            this.refreshList();
        },
        watch:{
            title(){
                this.refreshList();
            },
            classId(){
                this.refreshList();
            }
        }
    }
</script>
