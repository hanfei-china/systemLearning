<template>
    <el-container class="absolute-fill-parent background-color-white memberTypeContainer">
        <el-main class="position-relative unset-padding">
            <el-container class="absolute-fill-parent">
                <MemberTypeApplicationFormManage />
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import MemberTypeApplicationFormManage from "./applicationForm/MemberTypeApplicationFormManage";
    export default {
        name: "MemberTypeContainer",
        components: {MemberTypeApplicationFormManage},
        data(){
            return{
                navItem:'memberTypeApplicationFormManage',//导航栏默认项
                chosenType:null
            }
        },
        methods:{
        }
    }
</script>

