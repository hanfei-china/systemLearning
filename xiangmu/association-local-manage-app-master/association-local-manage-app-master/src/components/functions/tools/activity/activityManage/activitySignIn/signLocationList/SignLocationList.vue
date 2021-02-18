<template>
    <el-container class="absolute-fill-parent">
        <el-header class="border-bottom text-align-right" style="padding: 14px 20px;">
            <el-button type="primary" size="small" @click="addSignLocation">新增签到点</el-button>
        </el-header>
        <el-main v-show="list.length > 0">
            <vue-scroll>
                <div class="flex flex-wrap">
                    <div style="width: 500px;margin-bottom: 16px;margin-right: 16px;" v-for="item in list"
                         :key="item.id">
                        <sign-location-card :sign-location="item" @sign-data="$emit('sign-data',item)"
                                            @start-sign-in="$emit('start-sign-in',item)" @refresh="refresh"/>
                    </div>
                </div>
            </vue-scroll>
        </el-main>
        <el-main v-show="list.length <= 0" class="position-relative unset-padding">
            <no-data>
                <div style="margin-top: 18px;">该活动还没有创建签到点，点击右上角的【新增签到点】按钮创建签到点吧</div>
            </no-data>
        </el-main>
        <el-dialog title="新增签到点" :visible.sync="setDialog" :close-on-click-modal="false" append-to-body
                   width="600px">
            <sign-location-form v-if="setDialog" :activityId="activityId" :signLocationForm="signLocationForm"
                                @refresh="refresh" @close="setDialog = false"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import SignLocationForm from './SignLocationForm';
    import NoData from "../../../../../../util/noData/NoData";
    import SignLocationCard from "./SignLocationCard";

    export default {
        name: "SignLocationList",
        components: {SignLocationCard, NoData, SignLocationForm},
        data() {
            return {
                setDialog: false,//签到点添加/修改
                list: [],//活动地点列表
                signLocationForm: '',//要修改的签到点
            }
        },
        computed:{
            activityId(){
                return this.$route.params.activityId;
            },
        },
        created() {
            if (this.activityId) {
                this.getList()
            }
        },
        watch: {
            activityId() {
                this.getList()
            }
        },
        methods: {
            //获取活动地点列表
            getList() {
                this.$request.get('/api/admin/activity/address/getAddressesByActivityId', {
                    params: {
                        activityId: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        this.list = res.data;
                    }
                })
            },
            //新增签到点
            addSignLocation() {
                this.setDialog = true;
                this.signLocationForm = '';
            },
            updateSignLocation(item) {
                this.setDialog = true;
                this.signLocationForm = item;
            },
            //刷新
            refresh() {
                this.setDialog = false;
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>
