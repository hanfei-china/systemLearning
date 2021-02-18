<template>
    <black-main-layout :title-hover="titleHover" @title-click="$emit('title-click')">
        <template v-slot:header>
            <slot name="header"/>
        </template>
        <template>
            <el-container class="absolute-fill-parent">
                <el-aside class="unset-padding position-relative console-menu-container" width="200px">
                    <div class="absolute-fill-parent">
                        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                           <slot name="sideFunctions"/>
                        </vue-scroll>
                    </div>
                </el-aside>
                <el-main class="unset-padding position-relative console-main">
                    <div class="absolute-fill-parent ovauto">
                        <slot/>
                    </div>
                </el-main>
            </el-container>
        </template>
    </black-main-layout>
</template>

<script>
    import BlackMainLayout from "./BlackMainLayout";
    export default {
        name: "BlackSideFunctionsLayout",
        components: {BlackMainLayout},
        props:{
            titleHover: Boolean
        }
    }
</script>
