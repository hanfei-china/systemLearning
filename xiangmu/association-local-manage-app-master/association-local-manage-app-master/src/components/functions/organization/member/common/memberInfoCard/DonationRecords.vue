<template>
    <el-container class="absolute-fill-parent" style="top:16px;right:16px;left:16px;bottom:0;">
        <el-main class="unset-padding">
            <el-table size="small" :data="list" class="custom-el-table header-gray" height="100%" border stripe>
                <el-table-column label="序号" width="50" type="index" align="center"/>
                <el-table-column label="项目名称" min-width="150" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <el-tooltip  v-if="row.isDelete" content="项目已删除" placement="top">
                            <span class="text-line-through text-italic" style="color: red;">{{row.title}}</span>
                        </el-tooltip>
                        <span v-else>{{row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠金额/元" width="100" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span>{{ row.donationAmount | currency}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠时间" width="130" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span>{{ row.createTime | yyyyMMddHHmm }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="留言" prop="comments" min-width="200" show-tooltip-when-overflow/>
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
        name: "DonationRecords",
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
                    this.$request.get('/api/admin/onlineDonation/onlineDonationRecord/list',
                        {
                            params:{
                                limit: this.pageSize,
                                offset: this.pageSize * (this.currentPage - 1),
                                memberId: this.userId,
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

<style scoped>

</style>
