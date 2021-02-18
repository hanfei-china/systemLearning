<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-main>
            <component :is="signPage" :activityId="activityId"
                       :signLocationForm="signLocationForm" @start-sign-in="startSignIn" @sign-data="signData" @close="close" />
        </el-main>
    </el-container>
</template>

<script>
    import SignLocationList from './signLocationList/SignLocationList';
    import StartSignIn from './startSignIn/StartSignIn';
    import SignData from './signData/SignData';

    export default {
        name: "ActivitySignIn",
        components: {SignLocationList, StartSignIn, SignData},
        data() {
            return {
                activityId: '',//活动id
                signLocationForm: '',//要修改的签到点
                signPage: 'SignLocationList',//
            }
        },
        created() {
            this.activityId = this.$route.params.activityId;
        },
        methods: {
            startSignIn(item){
                this.signLocationForm = item;
                this.signPage = 'StartSignIn';
            },
            signData(item){
                this.signLocationForm = item;
                this.signPage = 'SignData';
            },
            close(){
                this.signPage = 'SignLocationList';
            }
        }
    }
</script>
