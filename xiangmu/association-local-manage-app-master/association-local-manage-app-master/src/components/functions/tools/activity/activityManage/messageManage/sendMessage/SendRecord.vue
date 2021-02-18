<template>
    <el-container class="absolute-fill-parent" style="padding: 20px;">
        <el-header class="flex" height="auto" style="padding: 0 0 20px;">
            <div class="flex-fill-in-the-remaining-space" style="line-height: 32px;">记录查看</div>
            <div>
                <el-button size="small" type="primary" @click="$emit('close')">返回发送页</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <el-table class="custom-el-table header-gray lrd-el-table" height="100%"
                      stripe size="small" border :data="list">
                <el-table-column fixed type="index" width="55" align="center" label="序号"/>
                <el-table-column label="接收邮箱" prop="receiveDevice" width="300px"
                                 show-tooltip-when-overflow></el-table-column>
                <el-table-column label="邮件内容" prop="content" show-overflow-tooltip></el-table-column>
                <el-table-column label="发送时间" width="220px">
                    <template v-slot="{row}">
                        <span>{{row.createTime | yyyyMMddHHmmss}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer height="auto" class="text-align-right" style="padding-top: 10px;">
            <el-pagination size="small" :page-sizes="[10,20,50,100]" background
                           layout="total, sizes, prev, pager, next, jumper"
                           :page-size="page.pageSize" :current-page="page.currentPage" :total="page.total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "SendRecord",
        props: {
            activityId: {
                type: String
            }
        },
        data() {
            return {
                page: {
                    pageSize: 20,
                    currentPage: 1,
                    total: 0
                },
                list: []
            }
        },
        created() {
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
                this.$request.get('/api/admin/message/listMessages', {
                    params: {
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1),
                        objectType: 1,
                        templateType: 0,
                        activityId: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        this.list = res.data.list;
                        this.page.total = res.data.total;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>