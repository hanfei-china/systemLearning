<template>
    <el-container class="absolute-fill-parent" style="top:16px;right:16px;left:16px;bottom:0;">
        <el-header height="auto" class="flex flex-column flex-center unset-padding">
            <div class="flex" style="padding-bottom: 16px;">
                <div class="flex-fill-in-the-remaining-space flex"></div>
                <div>
                    <el-button type="primary" size="small" @click="addRecords">增加跟踪记录</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border stripe
                      row-key="id">
                <el-table-column label="序号" type="index" fixed width="55px" align="center"/>
                <el-table-column label="跟踪类型" prop="visitTypeName" width="120px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span>{{(row.isOnline ? '（线上）' : '（线下）') + row.visitTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="跟踪时间" width="130px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span>{{row.time | yyyyMMddHHmm}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="事件地点" prop="address" show-tooltip-when-overflow/>
                <el-table-column label="详细说明" prop="description" show-tooltip-when-overflow/>
                <el-table-column label="操作" width="120px" align="center" fixed="right">
                    <template slot-scope="{row}">
                        <el-button size="small" type="text" class="unset-padding" @click="editRecords(row)">编辑
                        </el-button>
                        <el-button size="small" type="text" class="unset-padding custom-el-button danger"
                                   @click="deleteItem(row)">删除
                        </el-button>
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
        <el-dialog :visible.sync="formVisible" :title="formTitle" width="760px" :close-on-click-modal="false"
                   append-to-body>
            <record-form v-if="formVisible" :formId="formId" :member-id="memberId"
                         @close="formVisible = false" @refresh="refresh"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import RecordForm from "../../../visitManage/visitRecord/RecordForm";
    export default {
        name: "VisitRecords",
        components: {RecordForm},
        props: {
            memberId: String
        },
        data() {
            return {
                formVisible: false,
                formTitle: '增加跟踪记录',
                formId: '',
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
                if(this.memberId){
                    this.$request.post('/api/admin/visit/memberVisit/getVisits',
                        {
                            limit: this.pageSize,
                            offset: this.pageSize * (this.currentPage - 1),
                            memberId: this.memberId,
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
            addRecords() {
                this.formId = '';
                this.formTitle = '增加跟踪记录';
                this.formVisible = true;
            },
            editRecords(row) {
                this.formId = row.id;
                this.formTitle = '编辑跟踪记录';
                this.formVisible = true;
            },
            deleteItem(row) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/visit/memberVisit/deleteVisits', {
                        params: {
                            ids: [row.id]
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('记录删除成功');
                            this.refresh();
                        }
                    })
                }).catch(()=>{})
            },
            refresh() {
                this.currentPage = 1;
                this.getList();
            },
        },
        watch:{
            memberId(){
                this.refresh();
            }
        }
    }
</script>
