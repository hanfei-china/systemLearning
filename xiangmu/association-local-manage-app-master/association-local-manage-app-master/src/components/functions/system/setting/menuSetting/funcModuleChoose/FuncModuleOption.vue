<template>
    <el-option-group v-if="item.children && item.children.length > 0"
                     :label="item.moduleTitle" :value="item.id">
        <el-option v-for="child of item.children" :key="child.id" :label="child.moduleTitle" :value="child.id"/>
    </el-option-group>
    <el-option :label="item.moduleTitle" :value="item.id" v-else></el-option>
</template>

<script>
    export default {
        name: "FuncModuleOption",
        props:{
            item: Object
        }
    }
</script>

