<template>
    <el-container class="absolute-fill-parent" style="background-color: #f5f5f5;z-index: 2;">
        <el-header height="auto" style="padding: 20px;background-color: #fff;" class="border-bottom flex">
            <div class="flex-fill-in-the-remaining-space">
                <el-page-header @back="goBack" content="活动详情"/>
            </div>
            <div v-if="operateVisible">
                <el-button size="small" type="primary" @click="agree">同意</el-button>
                <el-button size="small" type="danger" @click="reject">拒绝</el-button>
            </div>
        </el-header>
        <el-main class="position-relative unset-padding" style="margin-top: 16px;">
            <div class="absolute-fill-parent addActive-wrap">
                <vue-scroll>
                    <div class="setting-wrap" style="width: 1000px;">
                        <div class="basic-setting setting" style="padding-top: 60px;">
                            <div style="position: absolute;left: 0;top: 8px;">
                                <img src="../../../../../assets/label.png" class="title-area-img">
                                <div class="setting-title">基本信息</div>
                            </div>
                            <el-form class="basic-form" label-width="120px" style="padding-left: 40px;">
                                <el-form-item label="活动主题：">{{detailForm.theme}}</el-form-item>
                                <el-form-item label="活动类型">{{detailForm.activityCategoryName}}
                                </el-form-item>
                                <el-form-item label="举办时间：">{{detailForm.beginTime | yyyyMMddHHmmss}} -
                                    {{detailForm.endTime | yyyyMMddHHmmss}}
                                </el-form-item>
                                <el-form-item label="报名截止时间：">{{detailForm.signUpEndTime | yyyyMMddHHmmss}}
                                </el-form-item>
                                <el-form-item label="活动地点：">{{detailForm.address}}</el-form-item>
                                <el-form-item label="活动海报：">
                                    <div style="width: 280px;height: 150px;">
                                        <img style="width: 100%;height: 100%;" :src="detailForm.posterUrl"/>
                                    </div>
                                </el-form-item>
                                <el-form-item label="发布到：">
                                    <span v-if="detailForm.publishAddress === '0'">活动大厅</span>
                                    <span v-if="detailForm.publishAddress === '1'">仅本会</span>
                                </el-form-item>
                                <el-form-item label="报名限制：">
                                    <span v-if="detailForm.signUpLimit === '0'">无限制</span>
                                    <span v-if="detailForm.signUpLimit === '1'">本会会员</span>
                                    <span v-if="detailForm.signUpLimit === '2'">所有会员</span>
                                </el-form-item>
                                <el-form-item label="是否需要审核：">
                                    <span v-if="detailForm.verify">是</span>
                                    <span v-else>否</span>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="richtext-setting setting" style="padding-top: 80px;">
                            <div style="position: absolute;left: 0;top: 8px;">
                                <img src="../../../../../assets/label.png" class="title-area-img">
                                <div class="setting-title">活动详情</div>
                            </div>
                            <div v-html="detailForm.details"></div>
                        </div>
                        <div class="form-setting setting" style="padding-top: 80px;">
                            <div style="position: absolute;left: 0;top: 8px;">
                                <img src="../../../../../assets/label.png" class="title-area-img">
                                <div class="setting-title">报名表单</div>
                            </div>
                            <div class="container">
                                <div class="table-header flex">
                                    <div class="text-align-center flex-fill-in-the-remaining-space">报名项名称</div>
                                    <div class="flex flex-center flex-column">
                                        <el-divider direction="vertical"/>
                                    </div>
                                    <div class="text-align-center" style="flex: 0 0 200px;">是否必填</div>
                                </div>
                                <div class="table-body">
                                    <ul ref="sortList">
                                        <li style="padding: 8px 0;height: 64px;" v-for="(field,index) in activityFields" :key="index"
                                            :style="{borderBottom:index===activityFields.length-1?'':'1px solid #d7dde4'}">
                                            <detail-fields :field="field"/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import DetailFields from "./util/DetailFields";

    export default {
        name: "ActiveDetail",
        components: {DetailFields},
        props: ['detailId', "operateVisible"],
        data() {
            return {
                detailForm: {},
                activityFields: []
            }
        },
        created() {
            this.getDetailForm();
            this.getDetailFields()
        },
        methods: {
            goBack() {
                this.$emit("openVisible")
            },
            getDetailForm() {
                this.$request.get('/api/common/activityCommonInfo/getActivityInfoById', {
                    params: {
                        activityId: this.detailId
                    }
                }).then(res => {
                    if (res.success) {
                        this.detailForm = res.data;
                    }
                })
            },
            getDetailFields() {
                this.$request.get('/api/common/activity/getActivityFieldsInfo', {
                    params: {
                        activityId: this.detailId
                    }
                }).then(res => {
                    if (res.success) {
                        this.activityFields = res.data;
                    }
                })
            },
            agree() {
                let operateVal = {
                    status: "1",
                    id: this.detailId
                };
                this.$emit("operateAct", operateVal)
            },
            reject() {
                let operateVal = {
                    status: "2",
                    id: this.detailId
                };
                this.$emit("operateAct", operateVal)
            }
        },
    }
</script>

<style scoped>

</style>
