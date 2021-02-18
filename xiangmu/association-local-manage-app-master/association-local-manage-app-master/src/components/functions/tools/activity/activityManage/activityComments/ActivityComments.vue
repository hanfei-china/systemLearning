<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-main>
            <el-table :data="list" height="100%" class="custom-el-table header-gray" size="small" border stripe
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
                <el-table-column label="评论者" prop="userName" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="评论内容" prop="content" show-overflow-tooltip></el-table-column>
                <el-table-column label="评论状态" width="100px">
                    <template v-slot="{row}">
                        <span>{{row.status | statusText}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="评论时间" width="150px">
                    <template v-slot="{row}">
                        <span>{{row.createTime | yyyyMMddHHmmss}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="190px">
                    <template v-slot="{row}">
                        <el-button type="text" size="small" class="unset-padding custom-el-button danger"
                             v-if="row.status==0"     @click="rejectComment(row.id)">拒绝
                        </el-button>
                        <el-button type="text" size="small" class="unset-padding custom-el-button"
                              v-if="row.status==0"     @click="passComment(row.id)">通过
                        </el-button>
                        <el-button type="text" size="small" class="unset-padding custom-el-button danger"
                                   @click="deleteComment(row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="flex flex-column flex-center">
            <div class="flex">
                <div>
                    <batch-operation>
                        <li @click="deleteSelect">删除所选</li>
                        <li @click="rejectSelect">拒绝所选</li>
                        <li @click="passSelect">通过所选</li>
                    </batch-operation>
                </div>
                <div class="flex-fill-in-the-remaining-space text-align-right">
                    <el-pagination size="small" :page-sizes="[10,20,50,100]"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :page-size="page.pageSize" :current-page="page.currentPage" :total="page.total"
                                   background
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import BatchOperation from "../../../../../util/BatchOperation";

    export default {
        name: "ActivityComments",
        components: {BatchOperation},
        data() {
            return {
                page: {
                    pageSize: 20,
                    currentPage: 1,
                    total: 0
                },
                list: [],
                activityId: '',
                ids: []
            }
        },
        filters:{
            statusText(val){
                if(val==0){
                    return "待审核"
                }else if(val==1){
                    return "已通过"
                }else if(val==2){
                    return "已拒绝"
                }
            }
        },
        created() {
            this.activityId = this.$route.params.activityId;
            this.getList();
        },
        methods: {
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList();
            },
            getList() {
                this.$request.get('/api/admin/comment/listComments', {
                    params: {
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1),
                        objectId: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        this.list = res.data.list;
                        this.page.total = res.data.total;
                    }
                })
            },
            deleteComment(id) {
                this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/comment/deleteComment', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.getList();
                        }
                    })
                }).catch(() => {
                })
            },
            batchVerifyComments(ids,pass,mess){
                this.$request.put('/api/admin/comment/batchVerifyComments',null, {
                    params: {ids,pass}
                }).then(res => {
                    if (res.success) {
                        this.$message.success(mess);
                        this.getList();
                    }
                })
            },
            passComment(id) {
                this.batchVerifyComments([id],true,"审核通过")
            },
            rejectComment(id){
                this.batchVerifyComments([id],false,"审核拒绝")
            },
            handleSelectionChange(val) {
                this.ids = []
                for (let item of val) {
                    this.ids.push(item.id);
                }
            },
            rejectSelect(){
                if (this.ids && this.ids.length === 0) {
                    this.$message.warning('请选择要拒绝的项');
                    return
                }
                this.batchVerifyComments(this.ids,false,"审核拒绝")
            },
            passSelect(){
                if (this.ids && this.ids.length === 0) {
                    this.$message.warning('请选择要通过的项');
                    return
                }
                this.batchVerifyComments(this.ids,true,"审核通过")
            },
            deleteSelect() {
                if (this.ids && this.ids.length === 0) {
                    this.$message.warning('请选择要删除的项');
                    return
                }

                this.$confirm('此操作将永久删除所选评论, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/comment/batchDeleteComments', {params: {ids: this.ids}}).then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.getList();
                        }
                    })
                }).catch(() => {
                })
            }
        }
    }
</script>

<style scoped>

</style>
