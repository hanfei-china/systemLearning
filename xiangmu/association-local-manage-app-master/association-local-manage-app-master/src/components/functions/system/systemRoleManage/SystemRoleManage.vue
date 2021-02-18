<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside class="position-relative unset border-right" width="200px">
            <system-role-menu ref="roles" @select="setChosenRole" @openEditRole="openEditRole" @deleteRole="deleteRole"/>
        </el-aside>
        <el-main class="position-relative">
            <system-role-user-manage :role="chosenRole" @refresh-roles="refreshRoles" ref="userManage" />
        </el-main>
    </el-container>
</template>

<script>
    import SystemRoleMenu from "./SystemRoleMenu";
    import SystemRoleUserManage from "./SystemRoleUserManage";
    export default {
        name: "SystemRoleManage",
        components: {SystemRoleUserManage, SystemRoleMenu},
        data(){
            return {
                chosenRole: null
            }
        },
        methods:{
            setChosenRole(val){
                this.chosenRole = val;
            },
            refreshRoles(){
                this.$refs.roles.getList();
            },
            openEditRole(){
                this.$refs.userManage.openEditRole()
            },
            deleteRole(){
                this.$refs.userManage.deleteRole()
            }
        }
    }
</script>
