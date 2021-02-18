<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 20px;">
        <el-header height="auto" class="flex" style="padding: 0 0 20px;">
            <div class="flex-fill-in-the-remaining-space flex">
                <div style="width: 150px;margin-right: 16px;">
                    <el-input placeholder="请输入申请人姓名" size="small" v-model="searchContent" clearable/>
                </div>
                <div style="width: 150px;margin-right: 16px;">
                    <el-select placeholder="请选择申请状态" size="small" v-model="status" clearable>
                        <el-option v-for="item in applyStatusList" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </div>
                <div style="width: 240px;">
                    <el-date-picker v-model="timeRange" type="daterange" size="small" clearable
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <el-button size="small" type="primary" @click="applyMountVisible = true">建会上限</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" size="small" border stripe class="custom-el-table header-gray"
                      @selection-change="handleSelectionChange">
                <el-table-column fixed type="selection" width="55" align="center"/>
                <el-table-column fixed type="index" width="55" align="center" label="序号"/>
                <el-table-column label="分会名称" prop="name" show-tooltip-when-overflow/>
                <el-table-column label="分会类型" prop="branchClassName" show-tooltip-when-overflow/>
                <el-table-column label="分会所在地" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.address | cascadeArray }}
                    </template>
                </el-table-column>
                <el-table-column label="分会联系人" prop="contactPerson" show-tooltip-when-overflow/>
                <el-table-column label="分会联系电话" prop="contactPhone" show-tooltip-when-overflow/>
                <el-table-column label="分会介绍" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.introduce}" />
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="180" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" width="90px" align="center">
                    <template v-slot="{row}">
                        <span v-if="row.status === 0">待审核</span>
                        <span v-if="row.status === 1">已通过</span>
                        <span v-if="row.status === 2">未通过</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px" align="center">
                    <template v-slot="{row}">
                        <div v-if="row.status === 0">
                            <el-button size="small" class="custom-el-button primary unset-padding" type="text"
                                       @click="operateApply(row.id, 1)">通过
                            </el-button>
                            <el-button size="small" class="custom-el-button danger unset-padding" type="text"
                                       @click="operateApply(row.id, 2)">拒绝
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="建会申请上限" :visible.sync="applyMountVisible" append-to-body
                       :close-on-click-modal="false" width="500px">
                <apply-mount-form v-if="applyMountVisible" @close="applyMountVisible = false"></apply-mount-form>
            </el-dialog>
        </el-main>
        <el-footer height="auto" style="padding: 20px 0 0;">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space">
                    <batch-operation>
                        <li @click="operateApplyList(1)">通过</li>
                        <li @click="operateApplyList(2)">拒绝</li>
                    </batch-operation>
                </div>
                <div class="flex-fill-in-the-remaining-space text-align-right">
                    <el-pagination size="small" background @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="page.currentPage" :page-sizes="[10,20,50,100]"
                                   :page-size="page.pageSize"
                                   layout="total, sizes, prev, pager, next, jumper" :total="page.total"/>
                </div>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import BatchOperation from "../../../util/BatchOperation";
    import ApplyMountForm from "./ApplyMountForm";

    export default {
        name: "CreateBranchApplyExamine",
        components: {ApplyMountForm, BatchOperation},
        data() {
            return {
                searchContent: '',//搜索框内容
                applyStatusList: [
                    {
                        label: '申请中',
                        value: 0
                    },
                    {
                        label: '已通过',
                        value: 1
                    },
                    {
                        label: '已拒绝',
                        value: 2
                    }
                ],//申请状态列表
                status: '',//申请状态
                timeRange: [],//申请时间段
                list: [],//创建分会申请列表
                page: {
                    total: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                selectList: [],
                applyMountVisible: false,//申请上限
            }
        },
        created() {
            this.getList();
        },
        watch: {
            searchContent: function () {
                this.getList();
            },
            status: function () {
                this.getList();
            },
            timeRange: function () {
                this.getList();
            }
        },
        methods: {
            handleSelectionChange(list) {
                this.selectList = [];
                for (let item of list) {
                    this.selectList.push(item.id);
                }
            },
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
                let params = {
                    limit: this.page.pageSize,
                    offset: this.page.pageSize * (this.page.currentPage - 1),
                    searchContent: this.searchContent,
                    status: this.status,
                    timeRange: this.timeRange
                };
                this.$request.post('/api/admin/branch/listBranchApply', params).then(res => {
                    if (res.success) {
                        this.list = res.data.list;
                        this.page.total = res.data.total
                    }
                })
            },

            //批量审批
            operateApplyList(status) {
                if (this.selectList && this.selectList.length === 0) {
                    this.$message.closeAll();
                    this.$message.warning('请选择要操作的项');
                    return;
                }
                this.$request.post('/api/admin/branch/dealBranchCreateApply', {
                    applyIds: this.selectList,
                    operate: status
                }).then(res => {
                    if (res.success) {
                        this.$message.success('操作成功');
                        this.getList();
                    }
                })
            },
            operateApply(id, status) {
                this.$request.post('/api/admin/branch/dealBranchCreateApply', {
                    applyIds: [id],
                    operate: status
                }).then(res => {
                    if (res.success) {
                        this.$message.success('操作成功');
                        this.getList();
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
