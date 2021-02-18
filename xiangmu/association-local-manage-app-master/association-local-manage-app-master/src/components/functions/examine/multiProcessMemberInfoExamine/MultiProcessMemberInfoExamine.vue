<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 16px;">
        <el-main class="unset-padding">
            <el-table class="custom-el-table header-gray" height="100%" :data="list" border stripe size="small" v-loading="loading">
                <el-table-column label="序号" width="50" show-tooltip-when-overflow>
                    <template v-slot="{$index}">
                        <div class="text-align-center">
                            {{$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="会员账号" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <el-button class="custom-el-button unset-padding" type="text" @click="detailShow(row)">{{row.phone | encryptedPhone}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="会员姓名" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <el-button class="custom-el-button unset-padding" type="text" @click="detailShow(row)">
                            <json-parse-var :record="row.record">
                                <template v-slot="{record}">{{record.name}}</template>
                            </json-parse-var>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="申请类型" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.recordType | memberInfoUpdateType}}
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.status | memberInfoUpdateStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="申请提交时间" width="140px" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template v-slot="{row}">
                        <el-button class="custom-el-button unset-padding" type="text" @click="detailShow(row)">详情查看</el-button>
                        <el-button v-show="row.status === '0'" class="custom-el-button danger unset-padding" type="text" @click="openReasonDialog(row)">拒绝</el-button>
                        <el-button v-show="row.status === '0'" class="custom-el-button success unset-padding" type="text" @click="agree(row)">同意</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="flex" style="padding: 16px 0 0 0;">
                <div class="flex-fill-in-the-remaining-space text-align-right">
                    <el-pagination :current-page="page.currentPage" background
                                   :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                   :total="total"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   @current-change="pageChange"
                                   @size-change="sizeChange">
                    </el-pagination>
                </div>
            </div>
        </el-footer>
        <member-examine-info v-if="detailInfoVisible" :visible.sync="detailInfoVisible" :update-record="record">
            <template v-slot:custom-handlers v-if="detailInfoVisible && record.status === '0'">
                <el-button size="mini" type="danger" @click="openReasonDialog(record)">拒绝</el-button>
                <el-button size="mini" type="primary"  @click="agree(record)">同意</el-button>
            </template>
        </member-examine-info>
        <el-dialog title="拒绝原因" :visible.sync="reasonDialogShow" width="600px" :close-on-click-modal="false" append-to-body>
            <el-input type="textarea" v-model="reason" :rows="5" :maxlength="200" resize="none" palceholder="拒绝原因，200字以内"/>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="reasonDialogShow=false">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="disAgree">确定</el-button>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>
    import JsonParseVar from "../../../util/JsonParseVar";
    import MemberExamineInfo from "../memberExamine/MemberExamineInfo";
    export default {
        name: "MultiProcessMemberInfoExamine",
        components: {MemberExamineInfo, JsonParseVar},
        computed: {
            condition() {
                let condition = {};

                if (this.branchId) {
                    condition.branch = this.branchId;
                }
                condition.onlyShipBranch = true;
                condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
                condition.limit = this.page.pageSize;
                return condition;
            },
            branchId(){
                return this.$store.state.branchId;
            }
        },
        data(){
            return {
                list:[],
                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total:0,
                record: null,
                detailInfoVisible: false,

                reason: null,
                reasonDialogShow: false,

                editId: '',
                editRecord: null,
                loading: false
            }
        },
        methods:{
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
                this.getList();
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
                this.getList();
            },
            getList(){
                this.loading = true;
                this.$request.get('/api/admin/branchManage/getVerifyMaterialsXieHui',{params:this.condition}).then(resp=>{
                    this.list = resp.data.list;
                    this.total = resp.data.total;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            reloadList(){
                this.page.currentPage = 1;
                this.getList();
            },
            detailShow(row){
                this.record = row;
                this.detailInfoVisible = true;
            },
            agree(record){
                this.$request.put('/api/admin/branchManage/verifyMaterials',{
                    materialsId: record.id,
                    status: '1'
                }).then(()=>{
                    this.detailInfoVisible = false;
                    this.$message.success('申请处理成功');
                    record.status = '1';
                })
            },
            openReasonDialog(record){
                this.editRecord = record;
                this.editId = record.id;
                this.reasonDialogShow =true;
            },
            disAgree(){
                if(!this.reason){
                    this.$message.warning('请输入拒绝原因');
                    return;
                }

                this.$request.put('/api/admin/branchManage/verifyMaterials',{
                    content: this.reason,
                    materialsId: this.editId,
                    status: '2'
                }).then(()=>{
                    this.detailInfoVisible = false;
                    this.reasonDialogShow = false;
                    this.$message.success('申请处理成功');
                    this.editRecord.status = '2';
                })
            }
        },
        created() {
            this.getList();
        },
    }
</script>
