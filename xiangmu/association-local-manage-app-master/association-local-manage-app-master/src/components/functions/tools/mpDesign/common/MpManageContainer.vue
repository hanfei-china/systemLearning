<template>
    <home-page-layout>
        <template v-slot:header>
            <el-container class="absolute-fill-parent border-bottom" style="background-color: rgba(46,60,69,0)">
                <el-aside class="unset-padding flex flex-column flex-center" width="auto">
                    <div class="flex">
                        <div style="padding: 0 10px 0 25px;" class="flex"><img style="display: block;" height="40px" :src="systemSetting.systemLogo"></div>
                        <div style="font-size: 20px;letter-spacing: 1px;" class="flex flex-column flex-center">
                            {{mpDesignName}}
                        </div>
                    </div>
                </el-aside>
                <el-main class="unset-padding">
                    <slot name="header"></slot>
                </el-main>
            </el-container>
        </template>
        <template>
            <el-container class="absolute-fill-parent">
                <el-main class="unset-padding position-relative">
                    <slot></slot>
                </el-main>
            </el-container>
        </template>
    </home-page-layout>
</template>

<script>
    import HomePageLayout from '../layout/HomePageLayout';

    export default {
        name: "MpManageContainer",
        components: {HomePageLayout},
        computed:{
            mpDesignName(){
                return this.$store.state.systemSetting.systemName+'-小程序设计';
            },
            systemSetting(){
                return this.$store.state.systemSetting;
            }
        }
    }
</script>
