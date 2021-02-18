<template>
    <black-main-layout title-hover @title-click="$router.go(0)" @privilege-loaded="privilegeLoaded" @privilege-loading="$emit('privilege-loading')">
        <template v-slot:header>
            <div class="flex flexend">
              上次登录时间：{{loginUser.lastLoginTime|filterTime}}
                <!-- <vue-scroll :ops="ops" class="hidey">


                <el-menu class="border-bottom-unset flex-fill-in-the-remaining-space" mode="horizontal" :default-active="defaultActive" @select="handleSelect">
                    <template v-for="menu of privilegeTree">
                        <el-menu-item v-if="menu.isSystemModule || !menu.menuPath"  :index="menu.id" :key="menu.id">
                            <span >{{menu.menuTitle}}</span>
                        </el-menu-item>
                        <el-menu-item class="position-relative" v-else  :index="menu.id" :key="menu.id">
                            <span style="opacity: 0;" >{{menu.menuTitle}}</span>
                            <a class="absolute-fill-parent" style="padding: 0 20px;" :href="menu.menuPath" :target="menu.isSelf ? '_self' : '_blank'" @click.stop>{{menu.menuTitle}}</a>
                        </el-menu-item>
                    </template>
                </el-menu>

                </vue-scroll> -->
                <!-- <div v-show="adminBranchList && adminBranchList.length > 0" class="flex flex-column flex-center cursor-pointer admin-branch-switch" style="color: #ffffff;">
                    <div style="color: #ffffff;font-size: 14px;white-space: nowrap;" v-if="adminBranchList.length === 1">
                        {{nowBranch}}
                    </div>
                    <el-dropdown v-else>
                        <div class="flex" style="line-height: 40px; cursor: pointer;">
                            <div style="color: #ffffff;font-size: 14px;">{{nowBranch}}</div>
                            <div>
                                <i style="font-weight: 600; color: #ffffff;" class="el-icon-arrow-down el-icon--right"/>
                            </div>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="switchBranch(branch.branchId)" v-for="branch of adminBranchList" :key="branch.branchId">{{branch.branchName || systemAdmin}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div> -->
            </div>
        </template>
        <slot/>
    </black-main-layout>
</template>

<script>
    import BlackMainLayout from "../layout/BlackMainLayout";
    import {formatDate} from "@/js/util/utilFunction";

    export default {
        name: "Functions",
        components: {BlackMainLayout},
        data(){
            return {
                defaultActive: '',
                systemAdmin: '系统管理',

                loading: false,

                ops: {
                    bar: {
                        background: 'rgba(204,204,204,0.5)',
                        size: '3px',
                        onlyShowBarOnScroll:false
                    },
                    // scrollButton: {
                    //     enable: true,
                    //     background: 'red',
                    //     opacity: 1,
                    //     step: 180,
                    //     mousedownStep: 30
                    // },
                }
            }
        },
        computed:{
          loginUser() {
            return this.$store.state.loginUser;
          },
            query(){
                return this.$route.query;
            },
            menuId(){
                return this.$store.state.menuId;
            },
            privilegeTree(){
                return this.$store.getters.privilegeTree;
            },
            privileges(){
                return this.$store.getters.privileges;
            },
            nowPrivilege(){
                let privilegeByPath = this.$store.getters.getPrivilegeByMenuPath(this.$route.path,this.privileges);
                let privilegeById = this.$store.getters.getPrivilegeById(this.menuId,this.privileges);
                return privilegeById || privilegeByPath;
            },
            parentPrivilege(){
                if(this.nowPrivilege){
                    return this.$store.getters.getPrivilegeByParentId(this.nowPrivilege.parentId, this.privileges, this.privilegeTree);
                }else{
                    return null;
                }
            },
            systemName(){
                return this.$store.state.systemSetting.systemName;
            },
            adminBranchList(){
                return this.$store.state.adminBranchList;
            },
            branchId(){
                return this.$store.state.branchId;
            },
            nowBranch(){
                if(!this.branchId){
                    return  this.systemAdmin;
                }
                if(this.adminBranchList && this.adminBranchList.length > 0){
                    for(let branch of this.adminBranchList){
                        let {branchId,branchName} = branch;
                        if(branchId === this.branchId){
                            return branchName || this.systemAdmin;
                        }
                    }
                }

                return '';
            }
        },
        methods:{
            privilegeLoaded(){
                let path = this.$route.path;
                if(!path || path === '' && path === '/'){
                    this.privilegeTree && this.privilegeTree.length > 0 && this.handleSelect(this.privilegeTree[0].id,false);
                }else{
                    this.handleSelectByPath(path);
                }
                this.$emit('privilege-loaded');
            },
            handleSelectByPath(path){
                let privilege = this.$store.getters.getPrivilegeByMenuPath(path, this.privileges);
                if(privilege){
                    let parentPrivilege = this.$store.getters.getPrivilegeByParentId(privilege.parentId, this.privileges, this.privilegeTree);
                    if(parentPrivilege){
                        this.defaultActive = parentPrivilege.id;
                    }else{
                        this.defaultActive = privilege.id;
                    }
                }else{
                    if(this.menuId){
                        this.handleSelect(this.menuId, false);
                    }else{
                        privilege = this.$store.getters.getFirstAvailableMenu;
                        if(privilege){
                            this.handleSelect(privilege.id, false);
                        }
                    }

                }
            },
            recursive(children,isClick){
                let result = false;
                for(let _privilege of children){
                    let {modulePath: _modulePath, children: _children} = _privilege;
                    if(_children && _children.length > 0){
                       result = this.recursive(_children,isClick);
                       if(result){
                           break;
                       }
                    }else{
                        if(_modulePath && _modulePath !== ''){
                            let location = {path:_modulePath,query: this.query};
                            this.$router.push(isClick ? _modulePath : location);
                            result = true;
                            break;
                        }
                    }
                }

                return result;
            },
            handleSelect(id,isClick=true) {
                this.defaultActive = id;
                let privilege = this.$store.getters.getPrivilegeByParentId(id, this.privileges, this.privilegeTree);
                if(privilege){
                    let {modulePath,children} = privilege;
                    if(children && children.length > 0){
                        this.recursive(children,isClick);
                    }else{
                        if(modulePath && modulePath !== ''){
                            this.$router.push(modulePath);
                        }
                    }
                }
            },
            switchBranch(branchId){
                this.loading = true;
                this.$request.get('/api/admin/account/switchBranch',{
                    params:{branchId}
                }).then(()=>{
                    setTimeout(()=>{
                        this.$router.push('/console');
                    },1000);
                })
            }
        },
        watch:{
            parentPrivilege(val){
                if(val){
                    this.defaultActive = val.id;
                }
            },
        },
        created() {
          this.$store.dispatch('setMemberAccountRules');
        },
        filters:{
          filterTime(val){
            if(val){
              return formatDate(new Date(val),'yyyy-MM-dd');
            }else{return ""}
          },
        }
    }
</script>


<style scoped>
.flexend{
  font-size: 12px;
  color: white;
  justify-content: flex-end;
  line-height: 50px;
  padding-right: 10px;
}
</style>
