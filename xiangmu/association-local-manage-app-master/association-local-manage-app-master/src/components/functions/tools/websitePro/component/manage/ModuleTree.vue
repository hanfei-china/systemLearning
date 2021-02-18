<template>
    <div class="website-pro-absolute-fill-parent">
        <vue-scroll>
            <div style="padding: 10px 16px 10px 10px;">
                <el-tree :draggable="draggable" class="website-pro-manage-tree" highlight-current ref="tree"
                         :data="module.modules" node-key="id" default-expand-all :expand-on-click-node="false"
                         :allow-drag="allowDrag" :allow-drop="allowDrop"
                         @node-drop="handleDrop" @node-click="nodeClick">
                    <div class="website-pro-manage-tree-custom-tree-node" slot-scope="{data,node}">
                        <div class="website-pro-manage-tree-custom-tree-node-title">{{ data.title }}</div>
                        <div style="padding-right: 10px;">
                            <el-button type="text" icon="el-icon-setting" size="mini" @click="$emit('setting',data)"/>
                            <el-button type="text" icon="el-icon-delete" class="custom-el-button danger" size="mini" @click="deleteModule(node,data)"/>
                        </div>
                    </div>
                </el-tree>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    import {addEvent,removeEvent} from "../../js/util/dom";

    export default {
        name: "ModuleTree",
        props: {
            module: Object,
            draggable: {
                type: Boolean,
                default: true
            },
            dragDropProps:{
                type: Object,
                default(){
                    return {
                        allowDrop(draggingNode, dropNode,dropType) {
                            let draggingData = draggingNode.data;
                            let dropData = dropNode.data;

                            let {name: draggingName} = draggingData;
                            let {name: dropName} = dropData;

                            if(draggingName === 'wsFillContainer'){
                                return dropName === 'wsFillContainer' && dropType !== 'inner';
                            }

                            return dropNode.data.name === 'wsFillContainer' || dropNode.data.name === 'wsFreeContainer' || dropType !== 'inner';
                        },
                        allowDrag() {
                            return true;
                        },
                    }
                }
            }
        },
        data(){
            return {
                settingModule: null
            }
        },
        methods:{
            allowDrop(draggingNode, dropNode,dropType) {
                return this.dragDropProps.allowDrop(draggingNode, dropNode,dropType);
            },
            allowDrag(draggingNode) {
                return this.dragDropProps.allowDrag(draggingNode);
            },
            handleDrop(draggingNode,dropNode,dropType) {
                if(dropType === 'inner'){
                    draggingNode.data.setPosition({top:0,left:0});
                }
            },
            windowDragOver(event) {
                event.preventDefault();
            },
            nodeClick(data,node){
                this.$emit('node-click',node);
            },
            setCurrentKey(key){
                this.$refs.tree.setCurrentKey(key);
            },
            deleteModule(node,data){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    let parentNode = node.parent;
                    let level = parentNode.level;
                    if(level > 0){
                        let parentModule = parentNode.data;
                        let parentModules = parentModule.modules;
                        let index = -1;
                        for(let i in parentModules){
                            let module = parentModules[i];
                            if(module.id === data.id){
                                index = i;
                                break;
                            }
                        }
                        if(parentModule && parentModule.deleteModule){
                            if(index > -1){
                                parentModule.deleteModule(index);
                                this.$emit('deleted');
                            }
                        }
                    }else{
                        this.$emit('delete-module',data);
                    }
                }).catch(()=>{});
            }
        },
        created() {
            addEvent(window, 'dragover', this.windowDragOver);
        },
        beforeDestroy() {
            removeEvent(window, 'dragover', this.windowDragOver);
        }

    }
</script>
