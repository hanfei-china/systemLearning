<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-center flex-column"  style="padding: 0 16px;">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space"></div>
                <div style="width: 300px;">
                    <el-input size="small" v-model="queryCondition.keyword" prefix-icon="el-icon-search" placeholder="请输入登录名或手机号进行搜索"></el-input>
                </div>
                <div class="flex" style="padding-left: 16px;">
                    <div class="flex">
                        <div class="flex flex-center flex-column" style="color: #909399;">账号状态：</div>
                        <div>
                            <el-select size="small" v-model="queryCondition.userStatus" clearable collapse-tags>
                                <el-option label="正常" value="0"></el-option>
                                <el-option label="冻结" value="1"></el-option>
                                <el-option label="注销" value="2"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="flex" style="padding-left: 16px;">
                    <div class="flex">
                        <div class="flex flex-center flex-column" style="color: #909399;">资料认证状态：</div>
                        <div>
                            <el-select size="small" v-model="queryCondition.materialStatus" clearable collapse-tags>
                                <el-option label="未认证" value="0"></el-option>
                                <el-option label="认证中" value="1"></el-option>
                                <el-option label="已认证" value="2"></el-option>
                                <el-option label="️认证未通过" value="3"></el-option>
                                <el-option label="信息变更中" value="4"></el-option>
                                <el-option label="信息变更失败" value="5"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
        </el-header>
        <el-main style="padding: 0 16px;">
            <el-table class="custom-el-table header-gray lrd-el-table" size="small" height="100%"
                      style="min-width: 400px;" stripe highlight-current-row border
                      :data="list">
<!--                <el-table-column type="selection" align="center" fixed></el-table-column>-->
                <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
                <el-table-column label="会员" prop="name"></el-table-column>
                <el-table-column label="账号" prop="account"></el-table-column>
                <el-table-column label="手机号" prop="phone"></el-table-column>
                <el-table-column label="账号状态" width="120px">
                    <template v-slot="{row}">
                        <span style="font-size: 12px;" :class="row.userStatus | userStatusType">{{row.userStatus | userStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="资料认证状态" width="120px">
                    <template v-slot="{row}">
                        <span style="font-size: 12px;" :class="row.materialStatus | materialStatusType">{{row.materialStatus | materialStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" width="130px">
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" fixed="right">
                    <template v-slot="{row}">
                        <el-button size="small" type="text" @click="openModifyPassword(row)">修改密码</el-button>
                        <el-button size="small" type="text" v-if="row.userStatus === '0'" @click="freezeAccount(row,'1')" class="custom-el-button unset-padding danger">账号封禁</el-button>
                        <el-button size="small" type="text" v-if="row.userStatus === '1'" @click="freezeAccount(row,'0')" class="custom-el-button unset-padding">账号解禁</el-button>
                        <el-button size="small" type="text" class="custom-el-button unset-padding danger" @click="deleteAccount(row)">删除账号</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="flex" style="padding: 16px;">
                <div>

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
        <el-dialog title="修改密码" :visible.sync="passwordForm.visible" width="600px" append-to-body :close-on-click-modal="false">
            <el-input v-model="passwordForm.password" size="small" type="password" placeholder="请输入修改后的密码，20位以内" :maxLength="20"></el-input>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="passwordForm.visible=false">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="modifyPassword">确定</el-button>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>
    export default {
        name: "MemberAccount",
        data(){
            return {
                queryCondition:{
                    keyword: '',
                    materialStatus: '',
                    userStatus:''
                },
                loading: true,
                list: [],

                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total: 0,

                handleRow: null,

                passwordForm:{
                    visible: false,
                    password: ''
                }
            }
        },
        filters:{
            userStatus(value){
                switch (value) {
                    case '0':
                        return '正常';
                    case '1':
                        return '冻结';
                    case '2':
                        return '注销';
                    default:
                        return '';
                }
            },
            userStatusType(value){
                switch (value) {
                    case '0':
                        return 'success-tip';
                    case '1':
                    case '2':
                        return 'danger-tip';
                    default:
                        return '';
                }
            },
            materialStatus(value){
                switch (value) {
                    case '0':
                        return '未认证';
                    case '1':
                        return '认证中';
                    case '2':
                        return '已️认证';
                    case '3':
                        return '️认证未通过';
                    case '4':
                        return '信息变更中';
                    case '5':
                        return '信息变更失败';
                    default:
                        return '';
                }
            },
            materialStatusType(value){
                switch (value) {
                    case '0':
                    case '3':
                    case '5':
                        return 'danger-tip';
                    case '4':
                    case '1':
                        return 'primary-tip';
                    case '2':
                        return 'success-tip';
                    default:
                        return '';
                }
            },
        },
        computed:{
            condition(){
                return {
                    ...this.queryCondition,
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1) * this.page.pageSize
                }
            }
        },
        methods:{
            getList(){
                this.loading = true;
                this.$request.get('/api/admin/member/account/list',{params:this.condition}).then(res=>{
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
            freezeAccount(row, freezeFlag) {
                this.$msgbox.confirm(`此操作将${freezeFlag === '1' ? '封禁' : '解禁'}，请确认是否继续此操作？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确定'
                }).then(() => {
                    this.$request.post('/api/admin/branchManage/freezeMemberAccount', {
                        userId: row.id, freezeFlag
                    }).then(() => {
                        this.$message.success(`${row.name}已${freezeFlag === '1' ? '封禁' : '解禁'}`);
                        this.getList();
                    })
                })
            },
            deleteAccount(row) {
                this.$confirm('此操作将删除该账号的所有信息且不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.put('/api/admin/member/account/delete', {userId: row.id}).then(res => {
                        if (res.success) {
                            this.$message.success('账号已删除');
                            this.page.currentPage = 1;
                            this.getList();
                        }
                    })
                })
            },
            openModifyPassword(row){
                this.handleRow = row;
                this.passwordForm.visible = true;
            },
            modifyPassword(){
                if(!this.passwordForm.password){
                    this.$message.warning('请输入新密码');
                    return;
                }
                this.$request.put('/api/admin/member/account/modPassword', {userId: this.handleRow.id,password:this.passwordForm.password}).then(res => {
                    if (res.success) {
                        this.$message.success('账号密码已修改');
                        this.handleRow = null;
                        this.passwordForm.visible = false;
                        this.passwordForm.password = '';
                        this.getList();
                    }
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
