<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 0 16px;">
        <el-header class="flex flex-column flex-center unset-padding">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex" style="color: #606266;">
                    <div style="width: 200px;margin-right: 24px;">
                        <el-input prefix-icon="el-icon-search" size="small" v-model="selectForm.memberName" placeholder="输入校友姓名进行搜索" clearable></el-input>
                    </div>
                    <div class="flex" style="margin-right: 24px;">
                        <span style="line-height: 32px;">跟踪类型：</span>
                        <div style="width: 200px;">
                            <visit-type-select placeholder="选择跟踪类型进行搜索" v-model="selectForm.visitType"/>
                        </div>
                    </div>
                    <div class="flex">
                        <span style="line-height: 32px;">跟踪时间：</span>
                        <div style="width: 300px;">
                            <el-date-picker
                                    v-model="visitDate"
                                    type="daterange"
                                    format="yyyy-MM-dd"
                                    size="small"
                                    style="width: 100%"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div>
                    <el-button type="primary" size="small" @click="addRecords">增加跟踪记录</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border stripe
                      row-key="id">
                <el-table-column label="序号" type="index" width="55px" align="center"/>
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
                <el-table-column label="目标会员" prop="targetMemberName" width="120px" show-tooltip-when-overflow/>
                <el-table-column label="事件地点" prop="address" show-tooltip-when-overflow/>
                <el-table-column label="详细说明" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.description}" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px" align="center">
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
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </el-footer>
        <el-dialog :visible.sync="formVisible" :title="title" width="760px" :close-on-click-modal="false"
                   append-to-body>
            <record-form v-if="formVisible" :formId="formId" @close="formVisible = false"
                         @refresh="refresh"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import RecordForm from "./RecordForm";
    import VisitTypeSelect from "./util/visitTypeSelect";

    export default {
        name: "VisitRecord",
        components: {VisitTypeSelect, RecordForm},
        data() {
            return {
                selectForm: {
                    memberName: '',
                    visitType: null,
                    startDate: null,
                    endDate: null,
                },
                visitDate: [],

                formVisible: false,
                title: '增加跟踪记录',
                formId: '',
                currentPage: 1,
                pageSize: 20,
                total: 0,
                list: []
            }
        },
        created() {
            this.getList();
        },
        watch: {
            selectForm: {
                deep: true,
                handler: function () {
                    this.getList();
                }
            },
            visitDate(val) {
                if(val){
                    this.selectForm.startDate = val[0];
                    this.selectForm.endDate = val[1];
                }else {
                    this.selectForm.startDate = null;
                    this.selectForm.endDate = null;
                }
            }
        },
        methods: {
            getVisitType(val) {
                this.selectForm.visitType = val;
            },
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
                this.$request.post('/api/admin/visit/memberVisit/getVisits',
                    {
                        limit: this.pageSize,
                        offset: this.pageSize * (this.currentPage - 1),
                        memberName: this.selectForm.memberName,
                        visitType: this.selectForm.visitType,
                        startDate: this.selectForm.startDate,
                        endDate: this.selectForm.endDate
                    }
                ).then(res => {
                    if (res.success) {
                        this.total = res.data.total;
                        this.list = res.data.list;
                    }
                })
            },
            addRecords() {
                this.formId = '';
                this.title = '增加跟踪记录';
                this.formVisible = true;
            },
            editRecords(row) {
                this.formId = row.id;
                this.title = '编辑跟踪记录';
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
        }
    }
</script>
