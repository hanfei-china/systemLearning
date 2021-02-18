<template>
    <div class="position-relative" style="width: 600px;height: 100%;">
        <div class="flex border-bottom" style="padding: 16px;">
            <p class="flex-fill-in-the-remaining-space" style="font-size: 16px;">讲师ID:{{basicInfo.id}}</p>
            <p>
                <span class="cursor-pointer" style="margin-right: 20px;" @click="lecturerFormDialog = true">编辑</span>
                <span class="cursor-pointer" @click="deleteLecturer">删除</span>
            </p>
        </div>
        <div style="padding: 0 16px;">
            <div class="flex" style="padding: 16px 0;">
                <el-avatar :size="40" :src="basicInfo.avatar"></el-avatar>
                <div style="margin-left: 16px;">
                    <p style="height: 24px;">{{basicInfo.name}}</p>
                    <p style="font-size: 12px;color: #909399;height: 16px;">讲师ID：{{basicInfo.id}}</p>
                </div>
            </div>
            <div style="padding-bottom: 0px;">
<!--                <el-button size="mini" type="primary">发送短信</el-button>-->
                <el-button size="mini" type="primary" @click="operateLecturer(true)">启用</el-button>
                <el-button size="mini" type="warning" @click="operateLecturer(false)">禁用</el-button>
            </div>
        </div>
        <el-menu :default-active="tabIndex" mode="horizontal" @select="handleSelect">
            <el-menu-item index="basic">基本信息</el-menu-item>
            <el-menu-item index="record">课程记录</el-menu-item>
        </el-menu>
        <div class="position-relative" style="width: 100%;height: calc(100% - 215px);">
            <div class="absolute-fill-parent">
                <vue-scroll>
                    <div style="padding: 0 16px;">
                        <div v-show="tabIndex === 'basic'">
                            <el-form size="mini" label-width="68px">
                                <el-form-item label="姓名：">{{basicInfo.name}}</el-form-item>
                                <el-form-item label="讲师ID：">{{basicInfo.id}}</el-form-item>
                                <el-form-item label="手机号：">{{basicInfo.phone}}</el-form-item>
                                <el-form-item label="简介：">
                                    <p>{{basicInfo.introduction}}</p>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div v-show="tabIndex === 'record'">
                            <div class="flex" style="padding: 16px 0;">
                                <div class="flex-fill-in-the-remaining-space">
                                    <p style="font-size: 16px;font-weight: bold;line-height: 24px;">{{basicInfo.courseNum}}</p>
                                    <p style="font-size: 12px;color: #909399;">共参与授课数量</p>
                                </div>
<!--                                <div class="flex-fill-in-the-remaining-space">-->
<!--                                    <p style="font-size: 16px;font-weight: bold;line-height: 24px;">23</p>-->
<!--                                    <p style="font-size: 12px;color: #909399;">所授课成交订单总量</p>-->
<!--                                </div>-->
                            </div>
                            <el-timeline>
                                <el-timeline-item v-for="item of courseList" :key="item.id" :timestamp="item.createTime | yyyyMMdd" placement="top">
                                    <el-card>
                                        <h4 style="font-weight: bold;padding: 6px 0;">{{item.title}}</h4>
                                        <div v-if="item.type === 0 || item.type === 1">
                                            <el-image style="width: 320px;height: 200px;" :src="item.resource"></el-image>
                                        </div>
                                        <div v-if="item.type === 2">
                                            <catalog-list :list="JSON.parse(item.catalog)"></catalog-list>
                                        </div>
                                    </el-card>
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </div>
                </vue-scroll>
            </div>
        </div>
        <!--编辑讲师-->
        <el-dialog width="800px" :visible.sync="lecturerFormDialog" :title="lecturerFormTitle" append-to-body
                   :close-on-click-modal="false">
            <lecturer-form v-if="lecturerFormDialog" :id="basicInfo.id" @close="lecturerFormDialog = false" @refresh="getInfo"></lecturer-form>
        </el-dialog>
    </div>
</template>

<script>
    import LecturerForm from "./LecturerForm";
    import CatalogList from "../courseManage/courseDetail/CatalogList";
    export default {
        name: "LecturerDetail",
        components: {CatalogList, LecturerForm},
        props: {
            id: String
        },
        data() {
            return {
                tabIndex: 'basic',
                basicInfo: {},//基本信息
                courseList: [],

                lecturerFormDialog: false,
                lecturerFormTitle: '编辑讲师'
            }
        },
        created(){
            this.getInfo();
        },
        methods: {
            getInfo(){
                this.$request.get('/api/admin/onlineCourse/Lecturer/' + this.id).then(res=>{
                    if(res.success){
                        this.basicInfo = res.data;
                        this.courseList = res.data.courses;
                    }
                })
            },
            handleSelect(val) {
                this.tabIndex = val;
            },
            deleteLecturer(){
                this.$confirm('此操作将永久删除该讲师, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/onlineCourse/Lecturer/' + this.basicInfo.id).then(res=>{
                        if(res.success){
                            this.$message.success('讲师已删除');
                            this.$emit("close");
                            this.$emit("refresh");
                        }
                    })
                }).catch(() => {});
            },
            operateLecturer(event){
                if(event){
                    this.$request.put('/api/admin/onlineCourse/Lecturer/enable/' + this.basicInfo.id)
                }else {
                    this.$request.put('/api/admin/onlineCourse/Lecturer/disable/' + this.basicInfo.id)
                }
            },
        }
    }
</script>

<style scoped>

</style>
