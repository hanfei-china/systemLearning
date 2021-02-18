<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside width="200px" class="position-relative border-right">
            <static-group-list :editable="!!!branchId" v-model="queryCondition.groupId" all-group="所有意见反馈" group-type="6" type-name="分组"/>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-center flex-column"  style="padding: 0 16px;">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space"></div>
                        <div style="width: 400px;">
                            <el-input size="small" v-model="queryCondition.titleSearch" clearable prefix-icon="el-icon-search" placeholder="请输入反馈进行搜索"></el-input>
                        </div>
                    </div>
                </el-header>
                <el-main style="padding: 0 16px;" v-loading="loading">
                    <el-table class="custom-el-table header-gray lrd-el-table" size="small"  height="100%"
                              style="min-width: 400px;" stripe highlight-current-row border :data="list">
                        <el-table-column type="index" label="序号" align="center" width="60" fixed></el-table-column>
                        <el-table-column label="标题" min-width="150">
                            <template v-slot="{row}">
                                <el-button @click="openDetail(row)" type="text" class="unset-padding" style="text-decoration: underline;">{{row.opinionInfo.title}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="意见类型" min-width="150">
                            <template v-slot="{row}">
                                {{row.categoryName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="反馈人" min-width="150">
                            <template v-slot="{row}">
                                {{row.opinionInfo.memberUserName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="反馈时间" width="150">
                            <template v-slot="{row}">
                                {{row.opinionInfo.createTime | yyyyMMddHHmm}}
                            </template>
                        </el-table-column>
                        <el-table-column label="回复状态" width="100">
                            <template v-slot="{row}">
                                <span class="flow-state" :class="{'danger-state':!row.hasReply,'success-state':row.hasReply}">{{row.hasReply ? '已回复' : '未回复'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="回复时间" width="150">
                            <template v-slot="{row}">
                                {{(row.opinionReplyInfo ? row.opinionReplyInfo.createTime : '') | yyyyMMddHHmm}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer class="unset-padding" height="auto">
                    <div class="flex" style="padding: 16px;">
                        <div></div>
                        <div class="flex-fill-in-the-remaining-space text-align-right">
                            <el-pagination :current-page="page.currentPage" background
                                           :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                           :total="total" :pager-count="5"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           @current-change="pageChange"
                                           @size-change="sizeChange">
                            </el-pagination>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
        <el-drawer append-to-body :visible.sync="drawerVisible" :close-on-click-modal="false" direction="rtl" size="450px">
            <template v-slot:title>
                <div v-if="drawerVisible" style="color: #333333;position: relative;">
                    <div>{{handleRow.opinionInfo.title}}</div>
                    <div class="flex position-absolute" style="padding-top: 10px;font-size: 12px;">
                        <div><span style="color:#909399;">反馈人：</span>{{handleRow.opinionInfo.memberUserName}}</div>
                        <div style="margin-left: 8px;"><span style="color:#909399;">反馈时间：</span>{{handleRow.opinionInfo.createTime | yyyyMMddHHmm}}</div>
                    </div>
                </div>
            </template>
            <feedback-info  v-if="drawerVisible" :feedback-info="handleRow"
                            @close="drawerVisible=false"  @refresh="getList"></feedback-info>
        </el-drawer>
    </el-container>
</template>

<script>
    import StaticGroupList from "../../../util/group/staticGroup/StaticGroupList";
    import FeedbackInfo from "./FeedbackInfo";
    export default {
        name: "FeedbackManage",
        components: {FeedbackInfo, StaticGroupList},
        computed:{
            branchId(){
                return this.$store.state.branchId;
            },
            condition(){
                return {
                    ...this.queryCondition,
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1) * this.page.pageSize
                }
            },
        },
        data(){
            return {
                queryCondition:{
                    groupId:'',
                    titleSearch: ''
                },
                loading: true,
                list: [],

                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total: 0,

                handleRow: null,
                drawerVisible: false
            }
        },
        methods:{
            getList(){
                this.selections = [];
                this.loading = true;
                this.$request.get('/api/admin/opinion/reply/getOpinions',{params:this.condition}).then(res=>{
                    let {list,total} =res.data;
                    this.list = list;
                    this.total = total;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
            },
            openDetail(row){
                this.handleRow = row;
                this.drawerVisible = true;
            }
        },
        watch:{
            condition(){
                this.getList();
            }
        }
    }
</script>

<style>
    .primary-state.flow-state{
        color: #409EFF;
    }

    .danger-state.flow-state{
        color: #F56C6C;
    }

    .success-state.flow-state{
        color: #67C23A;
    }
</style>
