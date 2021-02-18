<template>
    <el-container class="background-color-white absolute-fill-parent">
        <el-aside width="200px" class="border-right position-relative">
            <group-list :operable="false" v-model="chosenGroup" :type-name="typeName" group-type="9"></group-list>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent" style="padding: 16px;">
                <el-header height="auto" class="flex" style="padding: 0 0 16px;">
                    <div class="flex-fill-in-the-remaining-space flex">
                        <div style="width: 250px;margin-right: 16px;">
                            <el-input size="small" prefix-icon="el-icon-search" placeholder="订单编号/课程标题/用户姓名"></el-input>
                        </div>
                        <div style="width: 160px;margin-right: 16px;">
                            <el-select size="small" placeholder="请选择课程状态"></el-select>
                        </div>
                        <div style="width: 160px;margin-right: 16px;">
                            <el-select size="small" placeholder="请选择支付方式"></el-select>
                        </div>
                    </div>
                    <div>
                        <el-button size="small">导出</el-button>
                    </div>
                </el-header>
                <el-main class="unset-padding">
                    <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border stripe>
                        <el-table-column fixed type="selection" width="55" align="center"></el-table-column>
                        <el-table-column fixed type="index" width="55" align="center" label="序号"></el-table-column>
                        <el-table-column label="订单编号" sortable></el-table-column>
                        <el-table-column label="金额/人民币(元)" sortable></el-table-column>
                        <el-table-column label="课程"></el-table-column>
                        <el-table-column label="用户"></el-table-column>
                        <el-table-column label="支付方式"></el-table-column>
                        <el-table-column label="时间" width="180px"></el-table-column>
                        <el-table-column label="状态">
                            <template>
                                <span style="color: #909399;">已退款</span>
                                <!--                                <span style="color: #67C23A;">已完成</span>-->
                                <!--                                <span style="color: #F56C6C;">待支付</span>-->
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" fixed="right" width="120px">
                            <el-tooltip effect="dark" content="原因" placement="top-start">
                                <el-button type="text" size="small" class="unset-padding" icon="el-icon-info"></el-button>
                            </el-tooltip>
                            <el-button type="text" size="small" class="unset-padding custom-el-button danger">退款
                            </el-button>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer height="auto" style="padding: 16px 0 0;" class="flex">
                    <div>
                        <batch-operation title="批量操作">
                            <li>已选(num/num)</li>
                            <li>退款</li>
                        </batch-operation>
                    </div>
                    <div class="flex-fill-in-the-remaining-space text-align-right">
                        <el-pagination :current-page="page.currentPage" background
                                       :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                       :total="page.total" layout="total, sizes, prev, pager, next, jumper"
                                       @current-change="handleCurrentChange" @size-change="handleSizeChange">
                        </el-pagination>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import BatchOperation from "../../../../util/BatchOperation";
    import GroupList from "../../../util/group/GroupList";

    export default {
        name: "CourseOrderManage",
        components: {GroupList, BatchOperation},
        data() {
            return {
                typeName: '分组',
                chosenGroup: {},
                chosenGroupId: '',

                list: [{id: 0}],
                page: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                },
            }
        },
        methods: {
            getList(){},
            handleCurrentChange(val){
                this.page.currentPage = val;
                this.getList();
            },
            handleSizeChange(val){
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>
