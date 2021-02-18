<template>
    <el-container v-if="role" class="absolute-fill-parent">
        <el-header class="flex flex-center flex-column">
            <div class="flex">
                <div class="flex flex-fill-in-the-remaining-space">
                    <div class="flex flex-center flex-column">
                        <div class="flex">
                            <div class="flex flex-center flex-column">
                                <i style="height: 19px;line-height: 19px;font-size: 18px;" class="el-icon-user-solid"></i>
                            </div>
                            <div class="flex flex-center flex-column">{{role.roleName}}</div>
                        </div>
                    </div>
                    <div class="flex flex-center flex-column" style="padding-left: 16px;">
                        <div>
                            <el-button size="medium" icon="el-icon-edit-outline" @click="openEditRole" type="text">编辑</el-button>
                            <el-button size="medium" icon="el-icon-s-check" @click="menuSettingVisible=true" type="text">授权</el-button>
                            <el-button size="medium" icon="el-icon-delete" class="custom-el-button danger" @click="deleteRole" type="text">删除</el-button>
                        </div>
                    </div>
                </div>
                <div class="flex flex-center flex-column">
                    <div class="flex">
                        <el-input v-model="keyword" style="width: 300px;" size="small" placeholder="请输入账号名称进行搜索"/>
                        <div style="padding-left: 16px;" class="flex flex-center flex-column">
                            <div>
                                <el-button size="medium" type="text" class="unset-padding" icon="el-icon-connection"
                                           @click="relevantFormVisible=true" >关联用户</el-button>
                                <el-button size="medium" :disabled="selections.length < 1"
                                           type="text" class="custom-el-button danger unset-padding" icon="el-icon-delete"
                                           @click="cancelLink(null)">批量取消关联</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-header>
        <el-main class="unset-vertical-padding position-relative">
            <el-table class="custom-el-table header-gray lrd-el-table" height="100%" @selection-change="handleSelectionChange" size="small" border :data="userList" stripe>
                <el-table-column type="selection" width="55" fixed/>
                <el-table-column label="序号" width="50" fixed>
                    <template v-slot="{$index}">
                        <div class="text-align-center">
                            {{$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="账号名称" prop="name"/>
                <el-table-column label="登录账号" prop="loginName"/>
                <el-table-column label="账号类型">
                    <template v-slot="{row}">
                        {{row.adminType | adminType}}
                    </template>
                </el-table-column>
                <el-table-column label="关联分会" prop="branchName"/>
                <el-table-column label="关联时间" width="180">
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template v-slot="{row}">
                        <el-button class="custom-el-button danger unset-padding" type="text" @click="cancelLink(row)">取消关联</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog title="编辑角色" :visible.sync="roleFormVisible" width="600px" append-to-body :close-on-click-modal="false">
            <el-form size="small" label-width="120px" style="max-width: 750px;">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            角色名称：
                        </div>
                    </template>
                    <el-input v-model="roleName" placeholder="请输入角色名称，20字以内" :maxlength="20"/>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="roleFormVisible=false">取消返回
                </el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="updateRole">确定</el-button>
            </template>
        </el-dialog>
        <el-dialog title="关联用户" :visible.sync="relevantFormVisible" width="600px" append-to-body :close-on-click-modal="false">
            <branch-role-relevant-admin-user-list v-if="relevantFormVisible" :role-id="role.id"
                                           @close="relevantFormVisible = false" @refresh="getUsers"/>
        </el-dialog>
        <el-dialog title="权限设置" :visible.sync="menuSettingVisible" width="790px" append-to-body :close-on-click-modal="false">
            <system-role-menu-manage v-if="menuSettingVisible" :role-id="role.id"
                                           @close="menuSettingVisible = false"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import SystemRoleMenuManage from "../systemRoleManage/SystemRoleMenuManage";
    import BranchRoleRelevantAdminUserList from "./BranchRoleRelevantAdminUserList";
    export default {
        name: "BranchRoleUserManage",
        components: {BranchRoleRelevantAdminUserList, SystemRoleMenuManage},
        props: {
            role: Object
        },
        data() {
            return {
                roleFormVisible: false,
                roleName: '',

                keyword:'',

                relevantFormVisible: false,
                userList: [],

                selections:[],

                menuSettingVisible:false
            }
        },
        methods: {
            openEditRole() {
                this.roleName = this.role.roleName;
                this.roleFormVisible = true;
            },
            deleteRole(){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/privilege/role',{
                        params:{id: this.role.id}
                    }).then(()=>{
                        this.$message.success(`角色【${this.role.roleName}】已成功删除`);
                        this.$emit('refresh-roles');
                    })
                }).catch(()=>{});
            },
            updateRole() {
                if (!this.roleName) {
                    this.$message.warning("请输入角色名称");
                    return;
                }

                this.$request.put("/api/admin/privilege/role", {
                    roleName: this.roleName,
                    id: this.role.id
                }).then(() => {
                    this.role.roleName = this.roleName;
                    this.roleFormVisible = false;
                    this.$message.success("角色修改成功");
                })
            },
            getUsers(){
                if(this.role){
                    this.$request.get('/api/admin/privilege/associatedAdminUserList',{
                        params:{
                            keyword: this.keyword,
                            roleId: this.role.id
                        }
                    }).then((res)=>{
                        this.userList = res.data;
                    })
                }
            },
            handleSelectionChange(selections){
                this.selections = selections;
            },
            cancelLink(row){
                this.$msgbox.confirm('取消关联操作是不可逆的，是否继续？','提示',{type: 'warning',confirmButtonText:'继续'}).then(()=>{
                    let adminBranchKeys = [];
                    if(row){
                        adminBranchKeys = [{
                            adminId:row.id,
                            branchId: row.branchId
                        }];
                    }else{
                        this.selections.map(item=>{
                            adminBranchKeys.push({
                                adminId: item.id,
                                branchId: item.branchId
                            });
                        })
                    }
                    this.$request.put('/api/admin/privilege/adminLinkRole',{
                        adminBranchKeys,
                        roleId: this.role.id
                    }).then(()=>{
                        this.getUsers();
                        this.$message.success("已取消关联");
                    })
                }).catch(()=>{});
            }
        },
        created() {
            this.getUsers();
        },
        watch:{
            role(){
                this.getUsers();
            },
            keyword(){
                this.getUsers();
            }
        }
    }
</script>
