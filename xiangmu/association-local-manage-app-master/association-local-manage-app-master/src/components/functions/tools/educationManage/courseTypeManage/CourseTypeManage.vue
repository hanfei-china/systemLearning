<template>
    <el-container class="background-color-white absolute-fill-parent">
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent flex" style="padding: 16px;">
                <el-aside class="flex-fill-in-the-remaining-space unset-padding position-relative"
                          style="margin-right: 16px;">
                    <el-container class="absolute-fill-parent">
                        <el-header height="auto" class="text-align-right" style="padding: 0 0 16px;">
                            <el-button size="small" type="primary" @click="addCourseType(1)">添加一级分类</el-button>
                        </el-header>
                        <el-main class="unset-padding">
                            <el-table :data="firstList" height="100%" size="small" class="custom-el-table header-gray"
                                      border stripe>
                                <el-table-column label="一级分类" show-tooltip-when-overflow>
                                    <template v-slot="{row}">
                                        <p class="cursor-pointer" @click="getSecondList(row.id)">{{row.name}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="120px">
                                    <template v-slot="{row}">
                                        <el-button type="text" size="small" class="unset-padding" @click="editCourseType(1,row.id)">编辑</el-button>
                                        <el-button type="text" size="small" :disabled="row.children.length > 0" @click="deleteCourseType(row.id)"
                                                   class="unset-padding custom-el-button danger">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-aside>
                <el-main class="flex-fill-in-the-remaining-space unset-padding position-relative">
                    <el-container class="absolute-fill-parent">
                        <el-header height="auto" class="text-align-right" style="padding: 0 0 16px;">
                            <el-button size="small" type="primary" @click="addCourseType(2)">添加二级分类</el-button>
                        </el-header>
                        <el-main class="unset-padding">
                            <el-table :data="secondList" height="100%" size="small" class="custom-el-table header-gray"
                                      border stripe>
                                <el-table-column label="二级分类" prop="name" show-tooltip-when-overflow></el-table-column>
                                <el-table-column label="操作" align="center" width="120px">
                                    <template v-slot="{row}">
                                        <el-button type="text" size="small" class="unset-padding" @click="editCourseType(2,row.id)">编辑</el-button>
                                        <el-button type="text" size="small" @click="deleteCourseType(row.id)"
                                                   class="unset-padding custom-el-button danger">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-main>
            </el-container>
        </el-main>
        <el-dialog :title="courseTypeTitle" :visible.sync="courseTypeDialog" append-to-body
                   :close-on-click-modal="false" width="650px">
            <course-type-form v-if="courseTypeDialog" :id="typeId" :type="courseType"
                              :seq="courseType === 1?firstSeq:secondSeq" :parent-id="parentId"
                              @close="courseTypeDialog = false" @refresh="refresh"></course-type-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import CourseTypeForm from "./CourseTypeForm";

    export default {
        name: "CourseTypeManage",
        components: {CourseTypeForm},
        data() {
            return {
                firstList: [],//一级分组
                secondList: [],//二级分组

                courseType: 1,
                parentId: '',//添加二级分类的父级id
                firstSeq: 0,
                secondSeq: 0,
                typeId: '',//编辑的id
                courseTypeTitle: '添加一级分类',
                courseTypeDialog: false,//添加分类弹窗
            }
        },
        created() {
            this.getFirstList();
        },
        methods: {
            addCourseType(status) {
                this.courseType = status;
                if (status === 1) {
                    this.typeId = '';
                    this.courseTypeTitle = '添加一级分类';
                } else {
                    this.typeId = '';
                    this.courseTypeTitle = '添加二级分类';
                }
                this.courseTypeDialog = true;
            },
            editCourseType(status, id){
                this.courseType = status;
                if (status === 1) {
                    this.typeId = id;
                    this.courseTypeTitle = '编辑一级分类';
                } else {
                    this.typeId = id;
                    this.courseTypeTitle = '编辑二级分类';
                }
                this.courseTypeDialog = true;
            },
            deleteCourseType(id){
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.delete('/api/admin/group/deleteGroup',{params: {id: id}}).then(res=>{
                        if(res.success){
                            this.$message.success('分类已删除');
                            this.getFirstList();
                        }
                    })
                }).caych(()=>{})
            },
            //获取一级分类
            getFirstList() {
                this.$request.get('/api/admin/group/getGroup', {
                    params: {
                        maxLevel: 2,
                        type: 9
                    }
                }).then(res => {
                    if (res.success) {
                        this.firstList = res.data;
                        this.firstSeq = res.data.length;
                        if (res.data.length > 0) {
                            this.getSecondList(res.data[0].id);
                        }
                    }
                })
            },
            getSecondList(id) {
                this.parentId = id;
                this.$request.get('/api/admin/group/getGroup', {
                    params: {
                        maxLevel: 2,
                        type: 9,
                        id: id,
                        operate: 1
                    }
                }).then(res => {
                    if (res.success) {
                        this.secondList = res.data[0].children;
                        this.secondSeq = res.data[0].children.length;
                    }
                })
            },
            refresh() {
                this.getFirstList()
            },
        }
    }
</script>

<style scoped>

</style>
