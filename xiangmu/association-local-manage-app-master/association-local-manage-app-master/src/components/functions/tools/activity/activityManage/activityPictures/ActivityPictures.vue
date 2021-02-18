<template>
    <el-container class="absolute-fill-parent">
        <el-header class="unset-padding border-bottom" height="61px">
            <el-menu mode="horizontal" @select="select" :default-active="defaultPanel">
                <el-menu-item index="passPictures">
<!--                    <i class="el-icon-camera"></i>-->
                    <span>活动照片</span>
                </el-menu-item>
                <el-menu-item index="pendingPictures">待审核照片</el-menu-item>
                <el-menu-item index="albumSetting">
<!--                    <i class="el-icon-setting"></i>-->
                    <span>相册设置</span>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main class="position-relative unset-padding background-color-white">
            <component :is="defaultPanel"/>
        </el-main>
    </el-container>
</template>

<script>
    import PassPictures from "./component/passPictures/PassPictures";
    import PendingPictures from "./component/pendingPictures/PendingPictures";
    import AlbumSetting from "./component/albumSetting/AlbumSetting";
    export default {
        name: "ActivityPictures",
        components: {AlbumSetting, PendingPictures, PassPictures},
        data(){
            return {
                defaultPanel: 'passPictures'
            }
        },
        methods:{
            select(defaultPanel){
                this.defaultPanel = defaultPanel;
            }
        }
    }
</script>
