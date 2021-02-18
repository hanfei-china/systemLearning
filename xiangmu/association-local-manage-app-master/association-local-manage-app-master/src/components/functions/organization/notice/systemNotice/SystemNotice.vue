<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-column flex-center">
            <div class="flex">
                <div class="flex flex-fill-in-the-remaining-space">
                    <div style="width: 300px;">
                        <el-input size="small" v-model="queryCondition.keyword" prefix-icon="el-icon-search" :placeholder="`请输入${routeTitle}标题进行搜索`"></el-input>
                    </div>
                </div>
                <div>
                    <el-button type="primary" size="small" @click="createNotice" icon="el-icon-plus">发布{{routeTitle}}</el-button>
                </div>
            </div>
        </el-header>
        <el-main style="padding: 0 16px;">
            <el-table class="custom-el-table header-gray lrd-el-table font-size" height="100%"
                      style="min-width: 400px;" stripe highlight-current-row
                      :data="list" :row-class-name="tableRowClassName">
                <el-table-column type="index" label="序号" align="center" fixed width="80"></el-table-column>
                <el-table-column label="公告标题" prop="flowTitle" show-tooltip-when-overflow min-width="200">
                    <template v-slot="{row}">
                        <div class="flex">
                            <div class="flex flex-center flex-column">
                                <el-button @click="openFlow(row)" type="text" style="text-decoration: underline;">{{row.record.title}}</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="内容摘要" prop="flowTitle" show-tooltip-when-overflow min-width="200">
                    <template v-slot="{row}">
                        <div class="flex">
                            <div class="flex flex-center flex-column">
                                {{row.record.content | htmlToText | truncation}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="涉及收费项目" prop="flowTitle" show-tooltip-when-overflow min-width="120">
                    <template v-slot="{row}">
                        <div class="flex">
                            <div class="flex flex-center flex-column">
                                {{row.record.isCharge ? '是' : '否'}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="180px"  show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span style="color: #5f6061;">{{row.beginTime | yyyyMMddHHmm}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送时间" width="180px"  show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span style="color: #5f6061;">{{row.endTime | yyyyMMddHHmm}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" width="200px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span class="flow-state">{{row.myState | state}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送状态" width="200px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span class="flow-state">{{row.state | publishState}}</span>
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
        <system-notice-form v-if="systemNoticeForm.visible"
                            :notice-entity="handleRow" :route-title="routeTitle"
                            @refresh="refreshList"  @close="systemNoticeForm.visible = false" />
        <el-drawer append-to-body :visible.sync="flowVisible" :close-on-click-modal="false" direction="rtl" size="500px">
            <template v-slot:title>
                <div v-if="flowVisible" style="color: #333333;position: relative;">
                    <div>{{handleRow.record.title}}</div>
                    <div class="flex position-absolute" style="padding-top: 10px;font-size: 12px;">
                        <div><span style="color:#909399;">创建时间：</span>{{handleRow.beginTime | yyyyMMddHHmm}}</div>
                        <div style="margin-left: 8px;"  v-show="handleRow.endTime"><span style="color:#909399;">发送时间：</span>{{handleRow.endTime | yyyyMMddHHmm}}</div>
                        <div style="margin-left: 8px;color: #F56C6C;" v-show="handleRow.record.isCharge"><i class="el-icon-wallet" style="margin-right: 4px;"></i>收费项目</div>
                    </div>
                </div>
            </template>
            <system-notice-info  v-if="flowVisible" :flow-info="handleRow" @edit="editNotice"/>
        </el-drawer>
    </el-container>
</template>

<script>
    import SystemNoticeForm from "./SystemNoticeForm";
    import SystemNoticeInfo from "./SystemNoticeInfo";
    export default {
        name: "SystemNotice",
        components: {SystemNoticeInfo, SystemNoticeForm},
        computed:{
            privileges(){
                return this.$store.state.privileges;
            },
            nowPrivilege(){
                return this.$store.getters.getPrivilegeByMenuPath(this.$route.path,this.privileges);
            },
            routeTitle(){
                return this.nowPrivilege ? this.nowPrivilege.menuTitle :''
            },
            condition(){
                return {
                    ...this.queryCondition,
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1) * this.page.pageSize
                }
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

                }
            },
            truncation(value){
                if(value){
                    return value.substring(0,50)+'...';
                }

                return '';
            },
            state(value){
                switch (value) {
                    case 0:
                        return '待审核';
                    case 1:
                        return '已通过';
                    case 2:
                        return '已拒绝';
                    default:
                        return '';
                }
            },
            publishState(value){
                switch (value) {
                    case 0:
                        return '待审核';
                    case 1:
                        return '已发送';
                    case 2:
                        return '已拒绝';
                    default:
                        return '';
                }
            }
        },
        data(){
            return {
                queryCondition:{
                    keyword: '',
                },
                loading: true,
                list: [],

                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total: 0,

                handleRow: null,

                systemNoticeForm:{
                    visible: false
                },

                flowVisible: false
            }
        },
        methods:{
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
            getList(){
                this.loading = true;
                this.$request.get('/api/admin/flow/myCreateNoticeList',{params:this.condition}).then(res=>{
                    let {list,total} =res.data;
                    this.list = list.filter(item=>{
                        item.record = JSON.parse(item.record);
                        return true;
                    });
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
            refreshList(){
                this.page.currentPage = 1;
                this.getList();
            },
            createNotice(){
                this.handleRow = null;
                this.systemNoticeForm.visible = true;
            },
            editNotice(handleRow){
                this.handleRow = handleRow;
                this.flowVisible = false;
                this.systemNoticeForm.visible = true;
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
