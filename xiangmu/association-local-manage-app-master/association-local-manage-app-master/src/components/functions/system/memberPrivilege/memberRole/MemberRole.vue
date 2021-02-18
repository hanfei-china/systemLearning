<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside width="200px" class="position-relative border-right">
            <static-group-list v-model="queryCondition.roleId" :group-name.sync="queryCondition.roleName"
                               title="所有角色" :has-all="false" all-group="所有角色" group-type="8" type-name="角色"/>
        </el-aside>
        <el-main class="position-relative unset-padding">
            <el-container class="absolute-fill-parent" v-if="queryCondition.roleId">
                <el-header class="unset-padding" height="61">
                    <el-menu style="padding-left: 10px;" :default-active="panel" mode="horizontal" @select="handleSelect">
                        <el-menu-item index="memberMenuManage">
                            <i style="font-size: 18px;width: 18px;" class="el-icon-lock"></i>
                            <span>权限管理</span>
                        </el-menu-item>
                        <el-menu-item index="memberHomepageDesign">
                            <i style="font-size: 14px;margin-right: 5px;" class="iconfont icon-design-2"/>
                            <span>首页设计</span>
                        </el-menu-item>
<!--                        <el-menu-item index="memberNoticeManage">通知权限管理</el-menu-item>-->
                    </el-menu>
                </el-header>
                <el-main class="position-relative unset-padding">
                    <component :is="panel" :role-id="queryCondition.roleId" :role-name="queryCondition.roleName"/>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import StaticGroupList from "../../../util/group/staticGroup/StaticGroupList";
    import MemberMenuManage from "./components/memberMenuManage/MemberMenuManage";
    import MemberHomepageDesign from "./components/MemberHomepageDesign";
    export default {
        name: "MemberRole",
        components: {MemberHomepageDesign, MemberMenuManage, StaticGroupList},
        data(){
            return {
                queryCondition: {
                    roleId: '',
                    roleName: ''
                },
                panel: 'memberMenuManage'
            }
        },
        methods:{
            handleSelect(panel){
                this.panel = panel;
            }
        }
    }
</script>
