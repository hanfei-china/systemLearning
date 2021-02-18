<template>
    <div class="website-pro-menu-item-manage-item-container">
        <div class="website-pro-menu-item-manage-item">
            <div class="website-pro-menu-item-manage-item-title website-pro-text-overflow">
                <i :class="{'el-icon-arrow-down' : collapse,'el-icon-arrow-right':!collapse}"
                   v-show="module.modules.length > 0" @click="collapse = !collapse"
                   style="padding-right: 4px;cursor: pointer" ></i>
                <span>{{module.title}}</span>
            </div>
            <div class="website-pro-menu-item-manage-item-handle">
                <el-tooltip content="新增菜单项" placement="top">
                    <el-button size="mini" icon="el-icon-plus" type="text" class="ui-sortable-handle1" @click="$emit('new-item')"></el-button>
                </el-tooltip>
                <el-tooltip content="新增子菜单项" placement="top">
                    <el-button size="mini" icon="el-icon-finished" type="text" @click="newSubItem()"></el-button>
                </el-tooltip>
                <el-tooltip content="菜单项设置" placement="top">
                    <el-button size="mini" icon="el-icon-setting" type="text" @click="$emit('setting-item')"/>
                </el-tooltip>
                <el-tooltip content="菜单项排序" placement="top">
                    <el-button size="mini" icon="el-icon-rank" type="text" class="ui-sortable-handle website-pro-pro-cursor-move"></el-button>
                </el-tooltip>
                <el-tooltip content="删除菜单项" placement="top">
                    <el-button size="mini" icon="el-icon-delete" type="text" @click="$emit('delete-item')"></el-button>
                </el-tooltip>
            </div>
        </div>
        <draggable v-show="module.modules.length > 0 && collapse" class="website-pro-menu-item-manage-item-sub-menu-item-container" tag="div"
                   handle=".ui-sortable-handle1" :animation="300" v-model="module.modules">
            <div class="website-pro-menu-item-manage-item sub-item" v-for="(item,index) in module.modules" :key="item.id">
                <div class="website-pro-menu-item-manage-item-title website-pro-text-overflow">
                    <span>{{item.title}}</span>
                </div>
                <div class="website-pro-menu-item-manage-item-handle">
                    <el-tooltip content="子菜单项设置" placement="top">
                        <el-button size="mini" icon="el-icon-setting" type="text" @click="$emit('setting-child',{item:module,child:item})"></el-button>
                    </el-tooltip>
                    <el-tooltip content="子菜单项排序" placement="top">
                        <el-button size="mini" icon="el-icon-rank" type="text" class="ui-sortable-handle1 website-pro-pro-cursor-move"></el-button>
                    </el-tooltip>
                    <el-tooltip content="子删除菜单项" placement="top">
                        <el-button size="mini" icon="el-icon-delete" type="text" @click="deleteSubItem(index)"></el-button>
                    </el-tooltip>
                </div>
            </div>
        </draggable>
    </div>
</template>

<script>
    export default {
        name: "WsMenuChildSetting",
        props:{
            module: Object
        },
        data(){
            return {
                collapse: true
            }
        },
        methods:{
            newSubItem(){
                this.module.addModule();
            },
            deleteSubItem(index){
                this.module.deleteModule(index);
            },
        }
    }
</script>
