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
                <el-table-column label="会员姓名" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <el-button class="custom-el-button unset-padding" type="text" @click="detailShow(row)">{{row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="申请分会" prop="branchName" show-tooltip-when-overflow/>
                <el-table-column label="申请提交时间" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.updateTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.status | memberApplyBranchStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160px">
                    <template v-slot="{row}">
                        <el-button v-if="row.status === '0'" class="custom-el-button danger unset-padding" type="text" @click="openReasonDialog(row)">拒绝</el-button>
                        <el-button v-if="row.status === '0'" class="custom-el-button unset-padding" type="text" @click="agree(row)">同意</el-button>
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
        <member-info-by-id title="会员信息" v-if="detailInfoVisible" :visible.sync="detailInfoVisible" :member-id="detailInfo.memberId">
            <template v-slot:custom-handlers v-if="detailInfoVisible && detailInfo.status === '0'">
                <el-button size="mini" type="danger" @click="openReasonDialog(detailInfo)">拒绝</el-button>
                <el-button size="mini" type="primary"  @click="agree(detailInfo)">同意</el-button>
            </template>
        </member-info-by-id>
        <el-dialog title="拒绝原因" :visible.sync="reasonDialogShow" width="600px" :close-on-click-modal="false" append-to-body>
            <el-input type="textarea" v-model="reason" :rows="5" :maxlength="200" resize="none" palceholder="拒绝原因，200字以内"></el-input>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="reasonDialogShow=false">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="disAgree">确定</el-button>
            </template>
        </el-dialog>
    </el-container>
</template>

<script>
    import MemberInfoById from "../../organization/member/common/MemberInfoById";
    export default {
        name: "BranchApply",
        components: {MemberInfoById},
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
            },
            adminType(){
                return this.$store.state.adminType;
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
                detailInfo: {},
                detailInfoVisible: false,

                reason: null,
                reasonDialogShow: false,

                agreeDialogShow: false,
                isMemberShip: false,
                memberPost: '',

                deliverDialogShow: false,
                deliverBranchId: '',

                editId: '',
                editApply: null,
                loading: true
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
                this.$request.get('/api/admin/branchManage/getBranchApplies',{params:this.condition}).then(resp=>{
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
                this.detailInfo = row;
                this.detailInfoVisible = true;
            },
            agree(apply){
                this.$request.post('/api/admin/branchManage/approvalApply',{
                    isMemberShip: this.isMemberShip,
                    status: '1',
                    updateRecordId: apply.id,
                    post: this.memberPost
                }).then(()=>{
                    this.detailInfoVisible = false;
                    this.agreeDialogShow = false;
                    this.$message.success('申请处理成功');
                    apply.status = '1';
                })
            },
            openReasonDialog(apply){
                this.editId = apply.id;
                this.editApply = apply;
                this.reasonDialogShow =true;
            },
            disAgree(){
                if(!this.reason){
                    this.$message.warning('请输入拒绝原因');
                    return;
                }

                this.$request.post('/api/admin/branchManage/approvalApply',{
                    content: this.reason,
                    status: '2',
                    updateRecordId: this.editId
                }).then(()=>{
                    this.detailInfoVisible = false;
                    this.reasonDialogShow = false;
                    this.$message.success('申请处理成功');
                    this.editApply.status = '2';
                })
            },
        },
        created() {
            this.getList();
        },
    }
</script>
