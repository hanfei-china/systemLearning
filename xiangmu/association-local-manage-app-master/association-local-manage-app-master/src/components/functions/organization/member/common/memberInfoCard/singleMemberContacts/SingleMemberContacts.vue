
<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex flex-center flex-column"  style="padding: 0 16px;">
            <div class="flex">
                <div style="width: 300px;">
                    <el-input size="small" v-model="queryCondition.keyword" clearable prefix-icon="el-icon-search" placeholder="请输入联系人姓名或单位名称进行搜索"></el-input>
                </div>
                <div class="flex-fill-in-the-remaining-space flex flex-end">
                    <div>
                        <el-button size="small" type="primary" icon="el-icon-plus" @click="addContacts">添加联系人</el-button>
                    </div>
                </div>
            </div>
        </el-header>
        <el-main style="padding: 0 16px;" v-loading="loading">
            <el-table class="custom-el-table header-gray lrd-el-table" size="small" height="100%"
                      style="min-width: 400px;" stripe highlight-current-row border :data="list">
                <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
                <el-table-column label="姓名" prop="name" min-width="150" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="手机号" prop="phone" min-width="150" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="邮箱" prop="email" min-width="150" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="座机" prop="landline" min-width="150" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="传真" prop="fax" min-width="150" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="职务" prop="post" min-width="150" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="操作" width="150px" align="center" fixed="right">
                    <template v-slot="{row}">
                        <el-button size="small" type="text" @click="updateContacts(row)">修改信息</el-button>
                        <el-button size="small" type="text" class="custom-el-button unset-padding danger" @click="deleteContacts(row)">删除联系人</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="flex" style="padding: 16px;">
                <div></div>
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
        <el-dialog :title="formTitle" :visible.sync="formVisible" width="700px" append-to-body :close-on-click-modal="false">
            <single-member-contacts-form v-if="formVisible" :member-id="memberId" :contacts="formContacts" @close="formVisible=false" @refresh="refreshList"/>
        </el-dialog>
    </el-container>
</template>

<script>

    import SingleMemberContactsForm from "./SingleMemberContactsForm";
    export default {
        name: "SingleMemberContacts",
        components: {SingleMemberContactsForm},
        props:{
            memberId: String
        },
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

                formVisible: false,
                formTitle: '新增联系人',
                formContacts: null,
            }
        },
        computed:{
            condition(){
                return {
                    memberId: this.memberId,
                    ...this.queryCondition,
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1) * this.page.pageSize
                }
            },
        },
        methods:{
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

