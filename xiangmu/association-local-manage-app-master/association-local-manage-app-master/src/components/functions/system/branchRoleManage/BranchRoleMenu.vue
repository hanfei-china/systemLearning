<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">{{nowPrivilege ? nowPrivilege.menuTitle : '系统角色'}}</div>
                <div class="flex flex-column flex-center">
                    <el-button icon="el-icon-plus" size="medium" type="text" @click="createRole" class="unset-padding">新增角色</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                    <el-menu @select="setChosenRole" class="border-right-unset custom-el-menu" :default-active="chosenRole">
                        <el-menu-item v-for="role of list" :index="role.id" :key="role.id">
                            <div class="text-overflow" style="width: 160px;">{{role.roleName}}</div>
                        </el-menu-item>
                    </el-menu>
                </vue-scroll>
            </div>
        </el-main>
        <el-dialog :title="roleFormTitle" :visible.sync="roleFormVisible" width="600px" append-to-body :close-on-click-modal="false">
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
                <el-button icon="el-icon-error" type="danger" size="small" @click="roleFormVisible=false">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>
    export default {
        name: "BranchRoleMenu",
        data(){
            return {
                list: [],
                chosenRole:'',
                roleType: 2,

                roleFormVisible: false,
                roleFormTitle: '',
                roleFormId: '',
                roleName:''
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
        methods:{
            getList(){
                this.$request.get('/api/admin/privilege/roleList',{
                    params: {roleType: this.roleType}
                }).then(res=>{
                    this.list = res.data;
                    if(res.data.length > 0){
                        this.chosenRole = res.data[0].id;
                    }
                })
            },
            setChosenRole(roleId){
                this.chosenRole = roleId;
            },
            createRole(){
                this.roleFormTitle = '新增角色';
                this.roleFormId = '';
                this.roleName = '';
                this.roleFormVisible = true;
            },
            submitData(){
                if(!this.roleName){
                    this.$message.warning("请输入角色名称");
                    return;
                }

                this.$request.post("/api/admin/privilege/role",{
                    roleName: this.roleName,
                    roleType: this.roleType
                }).then(()=>{
                    this.getList();
                    this.roleFormVisible = false;
                    this.$message.success("角色创建成功");
                })
            }
        },
        created() {
            this.getList();
        },
        watch:{
            chosenRole(val){
                let role = this.list.find(item=>item.id === val);
                this.$emit('select',role);
            }
        }
    }
</script>
