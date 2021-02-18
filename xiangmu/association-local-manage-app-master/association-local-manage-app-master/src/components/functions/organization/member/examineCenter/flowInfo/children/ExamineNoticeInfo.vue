<template>
    <el-container class="absolute-fill-parent">
        <el-header height="auto" style="min-height: 60px;padding-top: 8px;padding-bottom: 8px;" class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div style="margin-right: 4px;">公告标题：</div>
                <div class="flex-fill-in-the-remaining-space">{{recordJson.title}}</div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                <div class="notice-content" style="padding: 16px;" v-html="recordJson.content"></div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "ExamineNoticeInfo",
        props:{
            record: String,
        },
        computed:{
            recordJson(){
                return JSON.parse(this.record);
            }
        }
    }
</script>
<style lang="less">
    .notice-content{
        img{
            max-width: 100%;
        }
    }
</style>
