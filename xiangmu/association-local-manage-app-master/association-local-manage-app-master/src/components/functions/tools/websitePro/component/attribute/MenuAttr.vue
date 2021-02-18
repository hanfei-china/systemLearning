<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <el-popover placement="bottom-start" width="300" trigger="manual" v-model="visible">
                <el-input slot="reference" size="mini" readonly clearable :value="name" placeholder="请选择系统菜单"
                          @click.native.stop="valueClick"
                          @blur="blur"/>
                <div class="menu-choose-tree-panel" v-show="visible">
                    <vue-scroll>
                        <el-tree highlight-current ref="tree"
                                 :filter-node-method="filterNode" :data="menus" node-key="id" :expand-on-click-node="false">
                            <template v-slot="{data}">
                                <div class="el-custom-tree-node flex-fill-in-the-remaining-space"
                                     :class="{disabled: data.disabled}" style="width: 100%;" @click="handleNodeClick(data)">
                                    {{data.menuTitle}}
                                </div>
                            </template>
                        </el-tree>
                    </vue-scroll>
                </div>
            </el-popover>

        </div>
    </div>
</template>

<script>
    import {compare, menuTranslator} from "../../../../system/setting/menuSetting/js/util";

    export default {
        name: "MenuAttr",
        props:{
            attribute: Object
        },
        data(){
            return {
                searchId: `ocs_${new Date().getMilliseconds()}`,
                menus: [],
                visible: false,
            }
        },
        computed:{
            saveMenus(){
                return this.$store.state.allPrivileges;
            },
            showTitle(){
                return this.attribute.showTitle;
            },
            title(){
                return this.attribute.title;
            },
            attributes(){
                return this.attribute.attributes || {};
            },
            titleStyle(){
                return this.attributes.titleStyle || {};
            },
            clearable(){
                return this.attributes.clearable !== false;
            },
            show(){
                if(this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            },
            domIds(){
                return [this.searchId, this.searchId+'_cancel', this.searchId+'_sure', this.searchId+'_clean']
            },
            name: {
                get() {
                    let id = this.attribute.value;
                    for(let menu of this.saveMenus){
                        let {menuTitle,id: menuId} = menu;
                        if(id === menuId){
                            return menuTitle;
                        }
                    }

                    return '';
                }
            },
        },
        methods:{
            valueClick() {
                this.visible = !this.visible;
            },
            blur(event) {
                let {relatedTarget} = event;
                if (relatedTarget) {
                    let {id, classList} = relatedTarget;
                    if (this.domIds.indexOf(id) <= -1 && classList.contains('el-tree-node') !== true) {
                        this.visible = false;
                    }

                } else {
                    this.visible = false;
                }
            },
            handleNodeClick(data) {
                if(!data.disabled){
                    this.attribute.value = data.id;
                    this.visible = false;
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.menuTitle.indexOf(value) !== -1;
            },
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target);
            },
            setTreeDisabledNodes(nodes) {
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].children && nodes[i].children.length > 0) {
                        this.$set(nodes[i], "disabled", true);
                        this.setTreeDisabledNodes(nodes[i].children);
                    }
                }
            },
            getMenus(){
                let allPrivilege = JSON.parse(JSON.stringify(this.saveMenus));
                allPrivilege.sort(compare);

                let parents = allPrivilege.filter(privilege => {
                    return !privilege.parentId;
                });

                let children = allPrivilege.filter(privilege => {
                    return privilege.parentId;
                });

                menuTranslator(parents, children);
                this.setTreeDisabledNodes(parents);
                this.menus = parents;
            },
        },
        created() {
            this.getMenus();
        },
        watch:{
            'attribute.value'(val){
                if(this.attribute.syncChange){
                    this.attribute.syncChange(val);
                }
            }
        }
    }
</script>
<style lang="less">
    .menu-choose-tree-panel{
        height: 300px;
        background-color: #fff;
        padding: 10px;
        overflow: hidden;
    }

    .el-custom-tree-node.disabled {
        color: #A7A8AA;
    }

    .el-custom-tree-node.disabled:hover {
        background: transparent;
        cursor: not-allowed;
        color: #A7A8AA;
    }
</style>
