<template>
    <el-container class="lrd-card-container">
        <el-header class="unset-padding" height="50px" style="border-bottom: 1px dashed #e6e7ec;" v-if="hasTitle">
            <slot name="title"></slot>
        </el-header>
        <el-header height="50px" v-else-if="title">
            <div class="lrd-card-container-built-in-title">{{title}}</div>
        </el-header>
        <el-main class="unset-padding">
            <slot></slot>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "LrdCard",
        computed:{
            hasTitle(){
                return this.$slots.title != undefined;
            }
        },
        props:{
            title: {
                type: String,
                default: null
            }
        }
    }
</script>
