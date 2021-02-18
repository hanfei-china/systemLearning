<template>
    <el-container class="absolute-fill-parent background-color-white" style="color: #777777;">
        <el-header class="unset-padding">
            <el-menu
                    :default-active="activeIndex"
                    @select="handleSelect"
                    mode="horizontal"
                    text-color="#777777"
                    active-text-color="#3296FA">
                <el-menu-item v-for="item in menuItems" :key="item.value" :index="item.value">{{item.label}}</el-menu-item>
            </el-menu>
        </el-header>
        <el-main class="unset-padding position-relative">
            <component :is="activeIndex" :approveList="list" @pushData="pushData"/>
        </el-main>
    </el-container>
</template>

<script>
    import CreateApproval from './createApproval/CreateApproval';
    import AwaitApproval from './awaitApproval/AwaitApproval';
    import AlreadyApproval from './alreadyApproval/AlreadyApproval';
    import ICreateApproval from './iCreateApproval/ICreateApproval';
    import SendMeApproval from './sendMeApproval/SendMeApproval';
    export default {
        name: "FlowManage",
        components: {CreateApproval, AwaitApproval, AlreadyApproval, ICreateApproval, SendMeApproval},
        data(){
            return {
                menuItems: [
                    {
                        value:'CreateApproval',
                        label: '发起审批'
                    },{
                        value:'AwaitApproval',
                        label: '待我审批的'
                    },{
                        value:'AlreadyApproval',
                        label: '我已审批的'
                    },{
                        value:'ICreateApproval',
                        label: '我发起的'
                    },{
                        value:'SendMeApproval',
                        label: '抄送我的'
                    },
                ],
                activeIndex: 'CreateApproval',
                list: []
            }
        },
        methods: {
            handleSelect(key) {
                this.activeIndex = key;
            },
            pushData(obj){
                this.list.push({
                    id: 1,
                    name: 'admin',
                    item: obj.title,
                    type: obj.name,
                    fileUrl: obj.fileUrl,
                    time: new Date()
                })
            }
        }
    }
</script>

<style scoped>

</style>
