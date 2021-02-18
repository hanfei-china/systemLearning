<template>
    <el-container class="absolute-fill-parent" style="padding: 16px;">
        <el-header height="auto" style="padding-bottom: 16px;" class="text-align-right">
            <el-button size="small" type="primary" @click="addRecord">新增服务记录</el-button>
        </el-header>
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" width="100%"
                      class="custom-el-table header-gray" size="small" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="{row}">
                        <expense-goods :serversInfo="row.serversInfo" :remark="row.remark"></expense-goods>
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index" width="55px" align="center"></el-table-column>
                <el-table-column label="消费用户" prop="memberName" show-overflow-tooltip></el-table-column>
                <el-table-column label="消费时间" width="100px">
                    <template v-slot="{row}">
                        <span>{{row.consumeTime | yyyyMMdd}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系人" prop="contactPerson" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系电话" prop="contactPhone" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="90px">
                    <template v-slot="{row}">
                        <el-button size="small" type="text" class="unset-padding" @click="editRecord(row)">编辑
                        </el-button>
                        <el-button size="small" type="text" class="unset-padding custom-el-button danger"
                                   @click="deleteRecord(row.recordId)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer height="auto" style="padding: 16px 0 0;">
            <div class="text-align-right">
                <el-pagination
                        size="small" background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-sizes="[20, 50, 100, 200]"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                </el-pagination>
            </div>
        </el-footer>
        <el-dialog :visible.sync="expenseRecordVisible" :title="expenseRecordTitle"
                   append-to-body :close-on-click-modal="false" width="800px">
            <expense-record-form v-if="expenseRecordVisible" :expenseInfo="expenseInfo" :unitInfo="unitInfo"
                                 @close="expenseRecordVisible = false" @refresh="refresh"></expense-record-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import ExpenseRecordForm from "./expenseRecordForm";
    import ExpenseGoods from "./ExpenseGoods";

    export default {
        name: "UnitExpenseRecords",
        components: {ExpenseGoods, ExpenseRecordForm},
        props: ['unitInfo'],
        data() {
            return {
                list: [],
                page: {
                    pageSize: 20,
                    currentPage: 1,
                    total: 0
                },
                expenseRecordVisible: false,
                expenseInfo: {},
                expenseRecordTitle: '新增消费记录'
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
                this.$request.post('/api/admin/organization/server/getOrganizationServerDetails', {
                        organizationId: this.unitInfo.id,
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1)
                    }
                ).then(res => {
                    if (res.success) {
                        this.list = res.data.list;
                        this.page.total = res.data.total;
                    }
                })
            },
            addRecord() {
                this.expenseRecordVisible = true;
                this.expenseRecordTitle = '新增消费记录';
                this.expenseInfo = {};
            },
            editRecord(row) {
                this.expenseRecordVisible = true;
                this.expenseRecordTitle = '编辑消费记录';
                this.expenseInfo = row;
            },
            deleteRecord(id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/organization/server/deleteOrganizationServerRecord', {
                        params: {
                            recordId: id
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
            refresh() {
                this.page.currentPage = 1;
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>