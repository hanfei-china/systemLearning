<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside class="position-relative unset border-right" width="200px">
            <branch-role-menu ref="roles" @select="setChosenRole"/>
        </el-aside>
        <el-main class="position-relative">
            <branch-role-user-manage :role="chosenRole" @refresh-roles="refreshRoles"/>
        </el-main>
    </el-container>
</template>

<script>
    import BranchRoleMenu from "./BranchRoleMenu";
    import BranchRoleUserManage from "./BranchRoleUserManage";
    export default {
        name: "BranchRoleManage",
        components: {BranchRoleUserManage, BranchRoleMenu},
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
            }
        }
    }
</script>
