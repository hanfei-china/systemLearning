<template>
    <el-container class="absolute-fill-parent background-color-white memberTypeContainer">
        <el-aside class="border-right" width="200px">
            <member-type-manage @chosen-type="setChosenType"/>
        </el-aside>
        <el-main class="position-relative unset-padding">
            <el-container class="absolute-fill-parent">
                <el-header class="unset-padding header">
                    <span v-for="item in navList" :key="item.label" class="nav-item" @click="navItem = item.label"
                          :class="{active:navItem === item.label}">{{item.value}}</span>
                </el-header>
                <el-main class="position-relative unset-padding">
                    <component :is="navItem" v-if="chosenType" :member-type="chosenType"/>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import MemberTypeManage from "./typeManage/MemberTypeManage";
    import MemberTypeFieldManage from "./fieldsManage/MemberTypeFieldManage";
    import MemberTypeApplicationFormManage from "./applicationForm/MemberTypeApplicationFormManage";
    export default {
        name: "MemberTypeContainer",
        components: {MemberTypeApplicationFormManage, MemberTypeFieldManage, MemberTypeManage},
        data(){
            return{
                navList:[
                    {
                        label:'memberTypeFieldManage',
                        value:'字段管理'
                    },
                    // {
                    //     label:'memberTypeApplicationFormManage',
                    //     value:'申请表'
                    // }
                ],
                navItem:'memberTypeFieldManage',//导航栏默认项
                chosenType:null
            }
        },
        methods:{
            setChosenType(type){
                this.chosenType = type;
            }
        }
    }
</script>

