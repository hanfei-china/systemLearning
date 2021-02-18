<template>
    <el-container class="background-color-white absolute-fill-parent">
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent" style="padding: 16px;">
                <el-header height="auto" class="flex" style="padding: 0 0 16px;">
                    <div class="flex-fill-in-the-remaining-space flex">
                        <div style="width: 210px;margin-right: 16px;">
                            <el-input size="small" prefix-icon="el-icon-search" v-model="searchContent" placeholder="搜索讲师ID/姓名"></el-input>
                        </div>
                        <div style="margin-right: 16px;">
                            <el-select size="small" placeholder="请选择讲师状态" v-model="enabled">
                                <el-option :value="true">已启用</el-option>
                                <el-option :value="false">未启用</el-option>
                            </el-select>
                        </div>
                    </div>
                    <div>
                        <el-button size="small" type="primary" @click="addLecturer">新增讲师</el-button>
<!--                        <el-button size="small">导入</el-button>-->
<!--                        <el-button size="small">导出</el-button>-->
                    </div>
                </el-header>
                <el-main class="unset-padding">
                    <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border stripe @selection-change="handleSelectionChange">
                        <el-table-column fixed type="selection" width="55" align="center"></el-table-column>
                        <el-table-column fixed type="index" width="55" align="center" label="序号"></el-table-column>
                        <el-table-column label="讲师ID" show-tooltip-when-overflow>
                            <template v-slot="{row}">
                                <el-button type="text" size="small" class="unset-padding"
                                           @click="getLecturerDetail(row.id)">{{row.id}}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="头像" width="70">
                            <template v-slot="{row}">
                                <div style="height: 28px;overflow: hidden;">
                                <el-avatar :size="28" :src="row.avatar"></el-avatar></div>
                            </template>
                        </el-table-column>
                        <el-table-column label="姓名" prop="name"></el-table-column>
                        <el-table-column label="手机号" prop="phone"></el-table-column>
                        <el-table-column label="简介" prop="introduction" show-tooltip-when-overflow></el-table-column>
                        <el-table-column label="课程数量" prop="courseNum"></el-table-column>
                        <el-table-column label="创建时间" width="120px">
                            <template v-slot="{row}">
                                <span>{{row.createTime | yyyyMMddHHmm}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="启用" width="70px">
                            <template v-slot="{row}">
                                <el-switch v-model="row.enabled" active-color="#13ce66" @change="operateLecturer($event,row.id)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" fixed="right" width="120px">
                            <template v-slot="{row}">
                                <el-button type="text" size="small" class="unset-padding" @click="editLecturer(row.id)">编辑
                                </el-button>
                                <el-button type="text" size="small" class="unset-padding custom-el-button danger" @click="deleteLecturer(row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer height="auto" style="padding: 16px 0 0;" class="flex">
                    <div>
                        <batch-operation title="批量操作">
                            <li>已选({{selectList.length}}/{{page.total}})</li>
                            <li @click="operateAll(true)">启用</li>
                            <li @click="operateAll(false)">禁用</li>
                            <li @click="deleteAll">删除</li>
                        </batch-operation>
                    </div>
                    <div class="flex-fill-in-the-remaining-space text-align-right">
                        <el-pagination :current-page="page.currentPage" background
                                       :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                       :total="page.total" layout="total, sizes, prev, pager, next, jumper"
                                       @current-change="handleCurrentChange" @size-change="handleSizeChange">
                        </el-pagination>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
        <!--新增讲师-->
        <el-dialog width="800px" :visible.sync="lecturerFormDialog" :title="lecturerFormTitle" append-to-body
                   :close-on-click-modal="false">
            <lecturer-form v-if="lecturerFormDialog" :id="editLecturerId" @close="lecturerFormDialog = false" @refresh="getList"></lecturer-form>
        </el-dialog>
        <!--讲师详情-->
        <el-drawer :visible.sync="lecturerDetailVisible" :show-close="false" append-to-body size="600px"
                   custom-class="lecturerDetail">
            <lecturer-detail v-if="lecturerDetailVisible" :id="lecturerDetailId" @close="lecturerDetailVisible = false" @refresh="getList"></lecturer-detail>
        </el-drawer>
    </el-container>
</template>

<script>
    import BatchOperation from "../../../../util/BatchOperation";
    import LecturerDetail from "./LecturerDetail";
    import LecturerForm from "./LecturerForm";

    export default {
        name: "LecturerManage",
        components: {LecturerForm, LecturerDetail, BatchOperation},
        data() {
            return {
                searchContent: '',
                enabled: '',
                list: [],
                page: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                },
                editLecturerId: '',//编辑的讲师id
                lecturerFormDialog: false,//讲师弹窗
                lecturerFormTitle: '新增讲师',
                lecturerDetailId: '',//查看详情id
                lecturerDetailVisible: false,//讲师详情弹窗
                selectList: []
            }
        },
        created(){
            this.getList();
        },
        watch: {
            searchContent(){
                this.getList()
            },
            enabled(){
                this.getList()
            }
        },
        methods: {
            getList() {
                this.$request.get('/api/admin/onlineCourse/Lecturer',{params: {
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1),
                        searchContent: this.searchContent,
                        enabled: this.enabled
                    }}).then(res=>{
                        if(res.success){
                            this.list = res.data.list;
                            this.page.total = res.data.total;
                        }
                })
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getList();
            },
            operateLecturer(event,id){
                if(event){
                    this.$request.put('/api/admin/onlineCourse/Lecturer/enable/'+id)
                }else {
                    this.$request.put('/api/admin/onlineCourse/Lecturer/disable/'+id)
                }
            },
            deleteLecturer(id){
                this.$confirm('此操作将永久删除该讲师, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.$request.delete('/api/admin/onlineCourse/Lecturer/'+id).then(res=>{
                       if(res.success){
                           this.$message.success('讲师已删除');
                           this.getList();
                       }
                   })
                }).catch(() => {});
            },
            addLecturer(){
                this.editLecturerId = '';
                this.lecturerFormDialog = true;
                this.lecturerFormTitle = '新增讲师';
            },
            editLecturer(id){
                this.editLecturerId = id;
                this.lecturerFormDialog = true;
                this.lecturerFormTitle = '编辑讲师';
            },
            handleSelectionChange(list){
                this.selectList = [];
                for(let item of list){
                    this.selectList.push(item.id)
                }
            },
            operateAll(status){
                if(this.selectList.length === 0){
                    this.$message.warning('请选择要操作的项');
                    return;
                }
                if(status){
                    this.$request.put('/api/admin/onlineCourse/Lecturer/enable', null, {params: {lecturerIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选讲师已启用');
                            this.getList();
                        }
                    })
                }else {
                    this.$request.put('/api/admin/onlineCourse/Lecturer/disable',null, {params: {lecturerIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选讲师已禁用');
                            this.getList();
                        }
                    })
                }
            },
            deleteAll(){
                if(this.selectList.length === 0){
                    this.$message.warning('请选择要删除的项');
                    return;
                }
                this.$confirm('此操作将永久删除所选讲师, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.delete('/api/admin/onlineCourse/Lecturer',{params: {lecturerIds: this.selectList}}).then(res=>{
                        if(res.success){
                            this.$message.success('所选讲师已删除');
                            this.selectList = [];
                            this.getList();
                        }
                    })
                }).catch(()=>{})
            },
            getLecturerDetail(id){
                this.lecturerDetailId = id;
                this.lecturerDetailVisible = true;
            }
        }
    }
</script>

<style lang="less">
    .lecturerDetail {
        color: #555555;

        .el-drawer__header {
            padding: 0;
            margin: 0;
        }
    }
</style>
