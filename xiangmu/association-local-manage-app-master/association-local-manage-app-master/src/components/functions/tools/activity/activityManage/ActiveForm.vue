<template>
    <black-side-functions-layout @title-click="$router.push('/console/tools/activityManage')" title-hover
                                 :title="`${systemName}-${theme}`">
        <!-- <template v-slot:header>
            <div style="color: #ffffff;height: 100%;line-height: 40px;font-size: 16px;">{{theme}}</div>
        </template> -->
        <template v-slot:sideFunctions>
            <el-menu :default-openeds="['/activeForm/:activityId/messageManage']" class="console-menu" @select="handleSelect"
                     :default-active="$route.name">
                <el-menu-item index="/activeForm/:activityId/editActivity">
                    <i class="console-menu-icon el-icon-setting"></i>
                    <span>活动编辑</span>
                </el-menu-item>
                <!-- <el-menu-item index="/activeForm/:activityId/activityDesign">
                    <i style="font-size: 14px;" class="console-menu-icon iconfont icon-design-2"/>
                    <span>页面设计</span>
                </el-menu-item> -->
                <el-menu-item index="/activeForm/:activityId/orderList">
                    <i class="console-menu-icon el-icon-s-data"></i>
                    <span>参与人员</span>
                </el-menu-item>
                <el-menu-item index="/activeForm/:activityId/activitySignIn">
                    <i class="console-menu-icon iconfont icon-activity-signIn"></i>
                    <span>活动签到</span>
                </el-menu-item>
                <el-menu-item index="/activeForm/:activityId/qrCode">
                    <i class="console-menu-icon iconfont icon-activity-qrcode"></i>
                    <span>活动二维码</span>
                </el-menu-item>
                <!-- <el-menu-item index="/activeForm/:activityId/guestManage">
                    <i class="console-menu-icon iconfont icon-activity-guest"></i>
                    <span>活动嘉宾</span>
                </el-menu-item> -->
                <el-menu-item index="/activeForm/:activityId/activityComments">
                    <i class="console-menu-icon iconfont icon-comment"></i>
                    <span>留言管理</span>
                </el-menu-item>
                <!-- <el-menu-item index="/activeForm/:activityId/activityPictures">
                    <i class="console-menu-icon el-icon-camera"></i>
                    <span>活动掠影</span>
                </el-menu-item> -->
                <!-- <el-submenu index="/activeForm/:activityId/messageManage">
                    <template slot="title">
                        <i style="font-size: 14px;" class="console-menu-icon el-icon-info"></i>
                        <span>活动通知</span>
                    </template>
                    <el-menu-item index="/activeForm/:activityId/messageManage/sendMessage">发送通知</el-menu-item>
                    <el-menu-item index="/activeForm/:activityId/messageManage/configurationMessage">配置信息</el-menu-item>
                </el-submenu> -->
            </el-menu>
        </template>
        <template>
            <router-view/>
        </template>
    </black-side-functions-layout>
</template>

<script>
    import BlackSideFunctionsLayout from "../../../../layout/BlackSideFunctionsLayout";
    import Vue from 'vue';

    export default {
        name: "activeForm",
        components: {BlackSideFunctionsLayout},
        data() {
            return {
                theme: '',
                activityInfo:{}
            }
        },
        provide(){
            let provideData = Vue.observable({theme:''});
            this.activityInfo = provideData;
            return {
                activityInfo: provideData
            }
        },
        computed: {
            activityId() {
                return this.$route.params.activityId;
            },
            systemName(){
                return this.$store.state.systemSetting.systemName;
            }
        },
        created(){
          this.getTheme()
        },
        methods: {
            handleSelect(index) {
                let path = index.replace(':activityId', this.activityId);
                this.$router.push(path);
            },
            getTheme() {
                this.$request.get('/api/common/activityCommonInfo/getActivityInfoById', {
                    params: {
                        activityId: this.activityId,
                        userId: ''
                    }
                }).then(
                    res => {
                        if (res.success) {
                            this.theme = res.data.theme;
                            this.activityInfo.theme = res.data.theme;
                        }
                    }
                )
            }
        },
    }
</script>

<style scoped>

</style>
