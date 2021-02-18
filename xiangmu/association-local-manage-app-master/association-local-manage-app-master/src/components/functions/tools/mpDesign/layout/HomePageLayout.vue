<template>
    <div class="home-page-layout-container" style="overflow:auto;">
        <el-container class="absolute-fill-parent" style="min-width:1360px;">
            <el-header class="unset-padding" v-if="hasHeader" :height="headerHeight" style="box-shadow: 0 1px 4px 0 rgba(0,0,0,0.15);">
                <slot name="header"></slot>
            </el-header>
            <el-main class="unset-padding" :style="{backgroundColor}">
                <div class="absolute-fill-parent">
                    <slot></slot>
                </div>
            </el-main>
            <el-footer class="unset-padding" v-if="hasFooter" :height="footerHeight">
                <slot name="footer"></slot>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "HomePageLayout",
        computed:{
            hasHeader(){
                return this.$slots.header != undefined;
            },
            hasFooter(){
                return this.$slots.footer != undefined;
            },
        },
        props:{
            headerHeight: {
                type: String,
                default: '60px'
            },
            footerHeight: {
                type: String,
                default: '60px'
            },
            backgroundColor:{
                type: String,
                default:'#f2f3f5'
            }

        }
    }
</script>
