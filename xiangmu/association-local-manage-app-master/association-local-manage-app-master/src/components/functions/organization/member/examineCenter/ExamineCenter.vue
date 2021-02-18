<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="unset-padding">
            <el-menu mode="horizontal" :default-active="query.titleType" @select="titleTypeChange">
                <el-menu-item index="0">待我处理</el-menu-item>
                <el-menu-item index="1">我已处理</el-menu-item>
            </el-menu>
        </el-header>
        <el-header class="flex flex-column flex-center">
            <div class="flex">
                <div class="flex">
                    <div class="flex flex-column flex-center">审批类型：</div>
                    <div>
                        <el-select size="small" v-model="query.type">
                            <el-option :value="-1" label="全部"></el-option>
                            <el-option :value="0" label="资料认证"></el-option>
                            <el-option :value="2" label="入会申请"></el-option>
                            <el-option :value="4" label="会籍变更"></el-option>
                            <el-option :value="5" label="退会申请"></el-option>
                            <el-option :value="6" label="退出系统"></el-option>
                            <el-option :value="7" label="资料修改"></el-option>
                            <el-option :value="8" label="加入会籍分会"></el-option>
                            <el-option :value="9" v-show="!branchId" label="公告审核"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="flex" style="margin-left: 16px;" v-show="query.titleType === '1'">
                    <div class="flex flex-column flex-center">审批状态：</div>
                    <div>
                        <el-select size="small" v-model="query.state" clearable>
                            <el-option :value="0" label="待处理"></el-option>
                            <el-option :value="1" label="已通过"></el-option>
                            <el-option :value="2" label="已驳回"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </el-header>
        <el-main style="padding: 0 16px;" v-loading="loading">
            <el-table class="custom-el-table header-gray lrd-el-table font-size" height="100%"
                      style="min-width: 400px;" stripe highlight-current-row
                      :data="list" :row-class-name="tableRowClassName">
                <el-table-column type="index" label="序号" align="center" fixed width="80"></el-table-column>
                <el-table-column label="审批标题" prop="flowTitle" show-tooltip-when-overflow min-width="200">
                    <template v-slot="{row}">
                        <div class="flex">
                            <div class="flow-title-icon">{{row.flowTypeTitle | firstChar}}</div>
                            <div class="flex flex-center flex-column">
                                <el-button @click="openFlow(row)" type="text" style="text-decoration: underline;">{{row.type===2?row.flowTitle+'('+row.branchName+')':row.flowTitle}}</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="发起时间" width="180px"  show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span style="color: #5f6061;">{{row.beginTime | yyyyMMddHHmm}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="完成时间" width="180px"  show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span style="color: #5f6061;">{{row.endTime | yyyyMMddHHmm}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-show="query.titleType === '1'" label="审批结果" width="200px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span class="flow-state">{{row.myState | state}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="流程状态" width="200px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span class="flow-state">{{row.state | state}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="flex" style="padding: 16px;">
                <div>

                </div>
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
        <el-drawer append-to-body :visible.sync="flowVisible" :close-on-click-modal="false" direction="rtl" size="450px">
            <template v-slot:title>
                <div v-if="flowVisible" style="color: #333333;position: relative;">
                    <div>{{handleRow.flowTitle}}</div>
                    <div class="flex position-absolute" style="padding-top: 10px;font-size: 12px;">
                        <div>申请时间：{{handleRow.beginTime | yyyyMMddHHmm}}</div>
                    </div>
                </div>
            </template>
            <flow-info :processable="query.titleType === '0'"  v-if="flowVisible" :flow-info="handleRow" @refresh="getList"></flow-info>
        </el-drawer>
    </el-container>
</template>

<script>
    import FlowInfo from "./flowInfo/FlowInfo";
    export default {
        name: "ExamineCenter",
        components: {FlowInfo},
        data(){
            return {
                query:{
                    titleType: '0',
                    state: null,
                    type: -1
                },

                loading: true,
                list: [],

                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total: 0,

                handleRow: null,
                flowVisible: false
            }
        },
        filters:{
            flowTitle(value){
                switch (value) {
                    case 0:
                    case 1:
                        return '会员资料认证申请';
                    case 2:
                    case 3:
                        return '会员入会申请';
                    case 4:
                        return '会籍分会变更申请';
                    case 5:
                        return '退出分会申请';
                    case 6:
                        return '退出协会申请';
                    case 7:
                        return '会员资料变更申请';
                    case 8:
                        return '加入会籍分会申请';
                    case 9:
                        return '收费公告发布申请';

                }
            },
            firstChar(value){
                if(value){
                    return value.substring(0,1);
                }

                return '';
            },
            state(value){
                switch (value) {
                    case 0:
                        return '待处理';
                    case 1:
                        return '已同意';
                    case 2:
                        return '已拒绝';
                    default:
                        return '';
                }
            }
        },
        computed:{
            branchId(){
                return this.$store.state.branchId;
            },
            resultType(){
                if(this.query.type === -1){
                    return [0,1,2,3,4,5,6,7,8,9];
                }else if(this.query.type === 0){
                    return [0,1]
                }else if(this.query.type === 2){
                    return [2,3]
                }else{
                    return [this.query.type];
                }
            },
            condition(){
                return {
                    titleType: this.query.titleType,
                    state: this.query.state,
                    types: this.resultType,
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1) * this.page.pageSize
                }
            }
        },
        methods:{
            getFlowTitle(value){
                switch (value) {
                    case 0:
                    case 1:
                        return '会员资料认证申请';
                    case 2:
                    case 3:
                        return '会员入会申请';
                    case 4:
                        return '会籍分会变更申请';
                    case 5:
                        return '退出分会申请';
                    case 6:
                        return '退出协会申请';
                    case 7:
                        return '会员资料变更申请';
                    case 8:
                        return '加入会籍分会申请';
                    case 9:
                        return '收费公告发布申请';

                }
            },
            getList(){
                this.handleRow = null;
                this.flowVisible = false;
                this.loading = true;
                this.$request.get('/api/admin/flow/queryApply',{params:this.condition}).then(res=>{
                    let {list,total} =res.data;
                    this.list = list.map(flow=>{
                        let {type} = flow;
                        let res = {...flow};
                        let flowTypeTitle = this.getFlowTitle(type);
                        let flowApplyUser = '';
                        if(type>=0 && type <=8){
                            flowApplyUser = flow.name || flow.account || flow.phone;
                        }else if(type === 9){
                            flowApplyUser = `${flow.branchName}管理员【${flow.adminName}】`;
                        }
                        res.flowApplyUser = flowApplyUser;
                        res.flowTypeTitle = flowTypeTitle;

                        res.flowTitle = `${flowApplyUser} 的 ${flowTypeTitle}`

                        return res;
                    });
                    this.total = total;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            titleTypeChange(titleType){
                this.query.titleType = titleType;
            },
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
            },
            tableRowClassName({rowIndex,row}) {
                let className = [];
                if (rowIndex%3 === 0) {
                    className.push('primary-row');
                } else if (rowIndex%3 === 1) {
                    className.push('warning-row');
                }else if (rowIndex%3 === 2) {
                    className.push('danger-row');
                }

                if(row.state === 0){
                    className.push('primary-state');
                }else if(row.state === 1){
                    className.push('success-state');
                }else if(row.state === 2){
                    className.push('danger-state');
                }

                return className.join(' ');
            },
            openFlow(row){
                this.handleRow = row;
                this.flowVisible = true;
            }
        },
        created() {
            this.getList();
        },
        watch:{
            condition(){
                this.getList();
            }
        }

    }
</script>
<style lang="less">
    .flow-title-icon{
        width: 35px;
        height: 35px;
        min-width: 35px;
        min-height: 35px;
        line-height: 35px;
        border-radius: 20px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        margin-right: 8px;
    }

    .primary-state .flow-state{
        color: #409EFF;
    }

    .danger-state .flow-state{
        color: #F56C6C;
    }

    .success-state .flow-state{
        color: #67C23A;
    }

    .primary-row .flow-title-icon{
        background-color: #409EFF;
    }

    .warning-row .flow-title-icon{
        background-color: #E6A23C;
    }

    .danger-row .flow-title-icon{
        background-color: #F56C6C;
    }
</style>
