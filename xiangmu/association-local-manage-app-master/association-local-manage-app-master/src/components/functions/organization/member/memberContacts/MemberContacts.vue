<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside width="200px" class="position-relative border-right">
            <static-group-list v-model="queryCondition.groupId" all-group="所有联系人" group-type="5" type-name="分组"/>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-center flex-column"  style="padding: 0 16px;">
                    <div class="flex">
                        <div style="width: 300px;">
                            <el-input size="small" v-model="queryCondition.keyword" clearable prefix-icon="el-icon-search" placeholder="请输入联系人姓名或单位名称进行搜索"></el-input>
                        </div>
                        <div class="flex-fill-in-the-remaining-space flex flex-end">
                            <div>
                                <el-button size="small" type="primary" icon="el-icon-plus" @click="addContacts">添加联系人</el-button>
                                <el-button style="position: relative;" type="primary" icon="el-icon-download" size="small">
                                    <span style="opacity: 0;">导出联系人</span>
                                    <a style="color: inherit;padding-left: 29px;text-align: left;" class="absolute-fill-parent flex flex-column flex-center" :href="downloadUrl">导出联系人</a>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-header>
                <el-main style="padding: 0 16px;" v-loading="loading">
                    <el-table class="custom-el-table header-gray lrd-el-table" size="small" height="100%"
                              style="min-width: 400px;" stripe highlight-current-row border
                              :data="list" @selection-change="handleSelectionChange">
                        <el-table-column v-if="queryCondition.groupId" type="selection" align="center" fixed></el-table-column>
                        <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
                        <el-table-column label="姓名" prop="name" min-width="150"></el-table-column>
                        <el-table-column label="手机号" prop="phone" min-width="150"></el-table-column>
                        <el-table-column label="邮箱" prop="email" min-width="150"></el-table-column>
                        <el-table-column label="座机" prop="landline" min-width="150"></el-table-column>
                        <el-table-column label="传真" prop="fax" min-width="150"></el-table-column>
                        <el-table-column label="所在单位" prop="memberName" min-width="150"></el-table-column>
                        <el-table-column label="所在单位职务" prop="post" min-width="150"></el-table-column>
                        <el-table-column label="操作" width="220px" align="center" fixed="right">
                            <template v-slot="{row}">
                                <el-button size="small" type="text" @click="updateContacts(row)">修改信息</el-button>
                                <el-button size="small" type="text" class="custom-el-button unset-padding danger" @click="deleteContacts(row)">删除联系人</el-button>
                                <el-button size="small" type="text" v-show="queryCondition.groupId" class="custom-el-button unset-padding danger" @click="unbinding(row)">取消关联</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer class="unset-padding" height="auto">
                    <div class="flex" style="padding: 16px;">
                        <div>
                            <batch-operation title="更多操作" v-show="queryCondition.groupId">
                                <li>
                                    <el-button size="small" type="text" class="unset-padding" icon="el-icon-connection"
                                               @click="bindingVisible=true" >关联用户</el-button>
                                </li>

                                <li>
                                    <el-button size="small" :disabled="selections.length < 1"
                                               type="text" class="custom-el-button danger unset-padding" icon="el-icon-delete"
                                               @click="unbinding(null)">批量取消关联</el-button>
                                 </li>
                            </batch-operation>
                        </div>
                        <div class="flex-fill-in-the-remaining-space text-align-right">
                            <el-pagination :current-page="page.currentPage" background
                                           :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                           :total="total" :pager-count="5"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           @current-change="pageChange"
                                           @size-change="sizeChange">
                            </el-pagination>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
        <el-dialog :title="formTitle" :visible.sync="formVisible" width="700px" append-to-body :close-on-click-modal="false">
            <member-contacts-form v-if="formVisible" :group-id="queryCondition.groupId" :contacts="formContacts" @close="formVisible=false" @refresh="refreshList"/>
        </el-dialog>
        <el-dialog title="关联单位联系人" :visible.sync="bindingVisible" width="700px" append-to-body :close-on-click-modal="false">
            <member-contacts-choose v-if="bindingVisible" style="width: 100%;" placeholder="请选择要关联的联系人" multiple v-model="bindingContacts"/>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="bindingVisible=false">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="binding">确定</el-button>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>
    import StaticGroupList from "../../../util/group/staticGroup/StaticGroupList";
    import BatchOperation from "../../../../util/BatchOperation";
    import MemberContactsForm from "./MemberContactsForm";
    import MemberContactsChoose from "./MemberContactsChoose";
    import {requestBaseUrl} from "../../../../../js/config/serviceConfig";
    export default {
        name: "MemberContacts",
        components: {MemberContactsChoose, MemberContactsForm, BatchOperation, StaticGroupList},
        data(){
            return {
                queryCondition:{
                    keyword: '',
                    groupId: null
                },
                loading: true,
                list: [],

                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total: 0,

                selections: [],

                formVisible: false,
                formTitle: '新增联系人',
                formContacts: null,

                bindingVisible: false,
                bindingContacts: []
            }
        },
        computed:{
            condition(){
                return {
                    ...this.queryCondition,
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1) * this.page.pageSize
                }
            },
            downloadUrl(){
                return `${requestBaseUrl}/api/admin/member/contacts/download${this.queryCondition.groupId ? `/${this.queryCondition.groupId}` : ''}`;
            }
        },
        methods:{
            handleSelectionChange(selections){
                this.selections = selections;
            },
            refreshList(){
                this.page.currentPage = 1;
                this.getList();
            },
            getList(){
                this.selections = [];
                this.loading = true;
                this.$request.get('/api/admin/member/contacts/list',{params:this.condition}).then(res=>{
                    let {list,total} =res.data;
                    this.list = list;
                    this.total = total;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
            },
            addContacts(){
                this.formVisible = true;
                this.formTitle = '新增联系人';
                this.formContacts = null;
            },
            updateContacts(row){
                this.formVisible = true;
                this.formTitle = '编辑联系人信息';
                this.formContacts = row;
            },
            deleteContacts(row){
                this.$msgbox.confirm('删除不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('api/admin/member/contacts',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.refreshList();
                            this.$message.success(`【${row.name}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            },
            unbinding(row){
                let contactsIds = [];
                if(row){
                    contactsIds = [row.id];
                }else{
                    if(this.selections.length<1){
                        this.$message.warning(`请选择要取消关联的联系人`);
                        return;
                    }
                    this.selections.forEach(item=>{
                        contactsIds.push(item.id);
                    })
                }

                this.$request.put('/api/admin/member/contacts/unbinding',{contactsIds,groupId:this.queryCondition.groupId}).then(()=>{
                    this.$message.success(`已取消关联`);
                    this.refreshList();
                })
            },
            binding(){
                if(this.bindingContacts.length<1){
                    this.$message.warning(`请选择要关联的联系人`);
                    return;
                }
                this.$request.put('/api/admin/member/contacts/binding',{contactsIds:this.bindingContacts,groupId:this.queryCondition.groupId}).then(()=>{
                    this.$message.success(`已成功关联联系人`);
                    this.refreshList();
                    this.bindingContacts = [];
                    this.bindingVisible = false;
                })
            }
        },
        created() {
            this.getList();
        },
        watch:{
            condition(){
                this.getList();
            }
        }
    }
</script>

