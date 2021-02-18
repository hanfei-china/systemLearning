<template>
    <el-container class="background-color-white absolute-fill-parent" style="padding: 20px;">
        <el-header height="auto" style="padding: 0 0 16px;" class="flex">
            <div class="flex-fill-in-the-remaining-space flex">
                <div style="padding-right: 16px;">
                    <el-select size="small" clearable placeholder="请选择校友企业" v-model="organizationId">
                        <el-option v-for="item in unitList" :key="item.organizationId" :value="item.organizationId"
                                   :label="item.organizationName"></el-option>
                    </el-select>
                </div>
                <div style="padding-right: 16px;">
                    <el-input size="small" placeholder="请输入消费用户" v-model="consumeName"></el-input>
                </div>
                <div>
                    <el-date-picker
                            size="small"
                            type="daterange"
                            v-model="timeRange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <el-button size="small" type="primary" @click="addRecord">新增消费记录</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" width="100%"
                      class="custom-el-table header-gray" size="small" border stripe
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="{row}">
                        <sales-goods :serversInfo="row.serversInfo" :remark="row.remark"></sales-goods>
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index" width="55px" align="center"></el-table-column>
                <el-table-column label="企业单位" prop="organizationName" show-overflow-tooltip></el-table-column>
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
        <el-footer height="auto" class="flex" style="padding: 16px 0 0;">
            <div class="flex-fill-in-the-remaining-space">
                <batch-operation>
                    <li @click="exportRecord('1')">导出所有记录</li>
                    <li @click="exportRecord('2')" v-if="organizationId && list.length > 0">导出当前企业记录</li>
                    <li @click="exportRecord('3')" v-if="selectIdList.length > 0">导出所选（{{selectIdList.length}}）条记录</li>
                </batch-operation>
            </div>
            <div class="flex-fill-in-the-remaining-space text-align-right">
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
        <el-dialog :visible.sync="salesRecordVisible" :title="salesRecordTitle"
                   append-to-body :close-on-click-modal="false" width="800px">
            <sales-record-form v-if="salesRecordVisible" :salesInfo="salesInfo"
                               @close="salesRecordVisible = false" @refresh="refresh"></sales-record-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import SalesRecordForm from "./SalesRecordForm";
    import SalesGoods from "./SalesGoods";
    import BatchOperation from "../../../../util/BatchOperation";
    import {exportExcel} from "../../../../../js/util/exportFile";

    export default {
        name: "UnitSales",
        components: {BatchOperation, SalesGoods, SalesRecordForm},
        data() {
            return {
                unitList: [],
                organizationId: '',
                timeRange: [],
                consumeName: '',

                list: [],
                page: {
                    pageSize: 20,
                    currentPage: 1,
                    total: 0
                },
                salesRecordVisible: false,
                salesInfo: {},
                salesRecordTitle: '新增消费记录',

                selectIdList: []
            }
        },
        created() {
            this.getUnitList();
            this.getList();
        },
        watch: {
            organizationId() {
                this.getList();
            },
            timeRange() {
                this.getList();
            },
            consumeName() {
                this.getList();
            }
        },
        methods: {
            getUnitList() {
                this.$request.get('/api/admin/organization/listOrganizationForSelect').then(res => {
                    if (res.success) {
                        this.unitList = res.data;
                    }
                })
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
            handleSelectionChange(list) {
                this.selectIdList = [];
                for (let item of list) {
                    this.selectIdList.push(item.recordId);
                }
            },
            getList() {
                this.selectIdList = [];
                this.$request.post('/api/admin/organization/server/getOrganizationServerDetails',
                    {
                        organizationId: this.organizationId,
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1),
                        consumeName: this.consumeName,
                        timeRange: this.timeRange
                    }
                ).then(res => {
                    if (res.success) {
                        this.list = res.data.list;
                        this.page.total = res.data.total;
                    }
                })
            },
            addRecord() {
                this.salesRecordVisible = true;
                this.salesRecordTitle = '新增消费记录';
                this.salesInfo = {};
            },
            editRecord(row) {
                this.salesRecordVisible = true;
                this.salesRecordTitle = '编辑消费记录';
                this.salesInfo = row;
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
            exportRecord(status) {
                this.$request.post('/api/admin/organization/server/exportOrganizationServerConsumeRecord',
                    {
                        allFlag: status === '1' ? true : false,
                        organizationId: status === '2' ? this.organizationId : '',
                        recordIds: status === '3' ? this.selectIdList : [],
                    }, {
                        responseType: 'blob',
                    }).then(resp => {
                    exportExcel(resp);
                });
            },
            refresh() {
                this.organizationId = '';
                this.timeRange = [];
                this.consumeName = '';
                this.page.currentPage = 1;
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>