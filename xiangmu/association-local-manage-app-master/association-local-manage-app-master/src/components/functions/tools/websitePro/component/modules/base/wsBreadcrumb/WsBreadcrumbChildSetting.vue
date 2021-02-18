<template>
    <div class="website-pro-menu-item-manage-item-container">
        <div class="website-pro-menu-item-manage-item">
            <div class="website-pro-menu-item-manage-item-title website-pro-text-overflow">
                <span>{{module.title}}</span>
            </div>
            <div class="website-pro-menu-item-manage-item-handle">
                <el-tooltip content="新增项" placement="top">
                    <el-button size="mini" icon="el-icon-plus" type="text" class="ui-sortable-handle1" @click="$emit('new-item')"></el-button>
                </el-tooltip>
                <el-tooltip content="设置" placement="top">
                    <el-button size="mini" icon="el-icon-setting" type="text" @click="$emit('setting-item')"/>
                </el-tooltip>
                <el-tooltip content="排序" placement="top">
                    <el-button size="mini" icon="el-icon-rank" type="text" class="ui-sortable-handle website-pro-pro-cursor-move"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                    <el-button size="mini" icon="el-icon-delete" type="text" @click="$emit('delete-item')"></el-button>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "WsBreadcrumbChildSetting",
        props:{
            module: Object
        },
    }
</script>
