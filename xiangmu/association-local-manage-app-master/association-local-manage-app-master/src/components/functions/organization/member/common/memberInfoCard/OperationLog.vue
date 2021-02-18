<template>
    <el-container class="position-absolute"
                  style="top:16px;right:16px;left:16px;bottom:0;">
        <el-main class="unset-padding">
            <el-table :data="operationList" size="small" height="100%" border stripe>
                <el-table-column label="序号" type="index" align="center"/>
                <el-table-column label="模块标题" show-tooltip-when-overflow prop="title"/>
                <el-table-column label="操作类型"  width="70px" align="center">
                    <template slot-scope="{row}">
                        {{row.operateType | logType}}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="125px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作状态" width="70px" align="center">
                    <template v-slot="{row}">
                        <span v-if="row.states">成功</span>
                        <span v-else>失败</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="flex flex-column flex-center">
            <div class="text-align-right">
                <el-pagination background
                               size="small"
                               @current-change="handleCurrentChange"
                               :current-page="page.currentPage"
                               :page-size="page.pageSize"
                               layout="total, prev, pager, next, jumper"
                               :total="operationCount">
                </el-pagination>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "OperationLog",
        props:{
            userId: String
        },
        data(){
            return {
                operationList: [],
                page: {
                    pageSize: 20,
                    currentPage: 1,
                },
                operationCount: 0,
            }
        },
        methods:{
            getMemberOperations() {
                if (this.userId) {
                    this.$request.post('/api/admin/log/getMemberLogs', {
                        limit: this.page.pageSize,
                        offset: (this.page.currentPage - 1) * this.page.pageSize,
                        userId: this.userId
                    }).then(res => {
                        this.operationList = res.data.list;
                        this.operationCount = res.data.total;
                    })
                }else{
                    this.operationList = [];
                    this.operationCount = 0;
                }
            },
            handleCurrentChange(currentPage) {
                this.page.currentPage = currentPage;
                this.getMemberOperations();
            },
        },
        created(){
            this.handleCurrentChange(1);
        },
        watch:{
            userId(){
                this.handleCurrentChange(1);
            }
        }
    }
</script>
