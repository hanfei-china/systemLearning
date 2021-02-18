<template>
    <el-container class="absolute-fill-parent" style="top:16px;right:16px;left:16px;bottom:0;">
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border stripe
                      row-key="id">
                <el-table-column label="序号" type="index" fixed width="55px" align="center"/>
                <el-table-column label="活动名称" prop="theme" width="120px" show-tooltip-when-overflow/>
                <el-table-column label="活动地点" prop="address" show-tooltip-when-overflow/>
                <el-table-column label="报名时间" width="130px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span>{{row.signInTime | yyyyMMddHHmm}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="flex flex-column flex-center unset-padding">
            <div class="text-align-right">
                <el-pagination
                        size="small" background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "SignInActivities",
        props: {
            userId: String
        },
        data() {
            return {
                currentPage: 1,
                pageSize: 20,
                total: 0,
                list: []
            }
        },
        created(){
            this.refresh();
        },
        methods:{
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            getList() {
                if(this.userId){
                    this.$request.get('/api/admin/member/getActivitiesOfUserJoin',
                        {
                            params:{
                                limit: this.pageSize,
                                offset: this.pageSize * (this.currentPage - 1),
                                userId: this.userId,
                            }
                        }
                    ).then(res => {
                        this.total = res.data.total;
                        this.list = res.data.list;
                    })
                }else{
                    this.total = 0;
                    this.list = [];
                }

            },
            refresh() {
                this.currentPage = 1;
                this.getList();
            },
        },
        watch:{
            userId(){
                this.refresh();
            }
        }
    }
</script>
