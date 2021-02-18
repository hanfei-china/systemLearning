<template>
    <el-container class="absolute-fill-parent box-shadow" style="width: 800px;margin: 16px auto;padding: 16px;">
        <el-header class="unset-padding flex flex-column flex-center">
            <div class="flex">
                <el-input v-model="menuTitle" size="small" placeholder="输入菜单名称进行搜索"/>
                <el-button size="small" style="margin-left: 12px;" @click="newMenu" type="primary" icon="el-icon-plus" >新增菜单</el-button>
                <el-popover placement="top" title="菜单设置规则" width="300" trigger="hover">
                    <div style="padding-bottom: 8px;">
                        1、包含子菜单的父级菜单不能删除
                    </div>
                    <div style="padding-bottom: 8px;">
                        2、包含子菜单的父级菜单关联的功能不会生效
                    </div>
                    <div slot="reference" style="line-height: 32px;padding-left: 4px;">
                        <i class="el-icon-question"/>
                    </div>
                </el-popover>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <vue-scroll class="absolute-fill-parent">
                <div>
                    <el-tree highlight-current :default-expanded-keys="expandNodes" ref="tree" draggable :allow-drop="allowDrop" @node-drop="handleDrop"
                             :filter-node-method="filterNode" :data="menus" node-key="id" :expand-on-click-node="false">
                        <template v-slot="{data}">
                            <div class="flex" style="width: 100%;">
                                <div class="flex flex-center flex-column" style="width: 100%;">
                                    <div class="flex">
                                        <div class="flex-fill-in-the-remaining-space">{{data.menuTitle}}</div>
                                        <div style="padding-right: 12px;">
                                            <el-button icon="el-icon-plus" @click.stop="newSubMenu(data)" class="unset-padding" size="small" type="text"/>
                                            <el-button icon="el-icon-setting" class="unset-padding" @click.stop="settingMenu(data)" size="small" type="text"/>
                                            <el-button icon="el-icon-delete" class="custom-el-button danger unset-padding" @click.stop="deleteMenu(data)"
                                                       :disabled="data.children && data.children.length >0" size="small" type="text"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </vue-scroll>
        </el-main>
        <member-menu-setting-form v-if="formVisible" :visible.sync="formVisible" :menu="menu" @refresh="getMenus"/>
    </el-container>
</template>

<script>
    import {menuTranslator,compare} from "./js/util";
    import MemberMenuSettingForm from "./MemberMenuSettingForm";
    export default {
        name: "MemberMenuManage",
        components: {MemberMenuSettingForm},
        props:{
            roleId: String
        },
        data(){
            return {
                menus: [],
                menuTitle:'',

                formVisible: false,
                menu: null,
                expandNodes:[]
            }
        },
        methods:{
            allowDrop(draggingNode, dropNode, type) {
                return dropNode.level < 3 || type !== 'inner';
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.menuTitle.indexOf(value) !== -1;
            },
            settingMenu(menu){
                this.menu = menu;
                this.formVisible = true;
            },
            newMenu(){
                this.menu = {
                    id:null,
                    roleId: this.roleId,
                    menuIcon:null,
                    menuPath:null,
                    menuTitle:'',
                    moduleId:'',
                    modulePath: '',
                    parentId:null,
                    isSystemModule: true,
                    isSelf: true,
                    menuSort: this.menus.length,
                    moduleParam: '',
                    extConfig: null
                };
                this.formVisible = true;
            },
            newSubMenu(parent){
                this.menu = {
                    id:null,
                    roleId: this.roleId,
                    menuIcon:null,
                    menuPath:null,
                    menuTitle:'',
                    moduleId:'',
                    modulePath: '',
                    parentId: parent.id,
                    isSystemModule: true,
                    isSelf: true,
                    menuSort: parent.children ? parent.children.length : 0,
                    moduleParam: '',
                    extConfig: null
                };
                this.formVisible = true;
            },
            deleteMenu(menu){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/memberMenuSetting',{
                        params:{id: menu.id}
                    }).then(()=>{
                        this.getMenus();
                        this.$message.success(`菜单【${menu.menuTitle}】已删除`);
                    })
                }).catch(()=>{});
            },
            handleDrop(draggingNode, dropNode, dropType) {
                let {data:draggingData} = draggingNode;
                let {data:dropData,level:dropLevel} = dropNode;

                //after before inner

                let data = {};
                let ids = [];

                let expandNodes = [];

                if(dropType === 'inner'){
                    //移动到了节点内部
                    data.menuId = draggingData.id;
                    data.parentId = dropData.id;

                    expandNodes = [dropData.id];

                    for(let menu of dropData.children){
                        ids.push(menu.id);
                    }
                }else{
                    //after before
                    if(dropLevel === 1){
                        //移出到了一级
                        data.menuId = draggingData.id;
                        data.parentId = null;

                        for(let menu of dropNode.parent.data){
                            ids.push(menu.id);
                        }
                    }else{
                        //其他级次变更
                        data.menuId = draggingData.id;
                        data.parentId = dropData.parentId;

                        expandNodes = [dropData.id];
                        for(let menu of dropNode.parent.data.children){
                            ids.push(menu.id);
                        }
                    }

                }
                data.ids = ids;

                this.$request.put('/api/admin/memberMenuSetting/sortMenu',data).then(()=>{
                    this.getMenus(()=>{
                        this.expandNodes = expandNodes;
                    });
                    this.$message.success({message:'排序成功',duration:1500});
                })
            },
            getMenus(callback){
                this.$request.get(`/api/admin/memberMenuSetting/menuList`,{params:{roleId:this.roleId}}).then(res=>{
                    let allPrivilege = res.data;
                    allPrivilege.sort(compare);

                    let parents = allPrivilege.filter(privilege => {
                        return !privilege.parentId;
                    });

                    let children = allPrivilege.filter(privilege => {
                        return privilege.parentId;
                    });

                    menuTranslator(parents, children);
                    this.menus = parents;
                    callback && callback();
                })
            },
        },
        created() {
            this.getMenus();
        },
        watch: {
            menuTitle(val) {
                this.$refs.tree.filter(val);
            },
            roleId(){
                this.getMenus();
            }
        },
    }
</script>
