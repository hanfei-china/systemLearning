<template>
    <div class="position-absolute background-color-white" style="top:16px;right:16px;left:16px;bottom:16px;">
        <el-table :data="branchList" size="small" height="100%" border stripe>
            <el-table-column label="序号" type="index" align="center" fixed/>
            <el-table-column label="分会名称" show-tooltip-when-overflow prop="branchName"/>
            <el-table-column label="分会职务" show-tooltip-when-overflow>
                <template v-slot="{row}">
                    {{row.postName || '普通会员'}}
                </template>
            </el-table-column>
<!--            <el-table-column label="会籍分会" show-tooltip-when-overflow>-->
<!--                <template v-slot="{row}">-->
<!--                    {{row.isMemberShipBranch ? '是' : '否'}}-->
<!--                </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="会费标准" show-tooltip-when-overflow>-->
<!--                <template v-slot="{row}">-->
<!--                    {{row.isMemberShipBranch ? row.duesStandardTypeName : ''}}-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column label="加入时间" width="140" show-tooltip-when-overflow>
                <template v-slot="{row}">
                    {{row.updateTime | yyyyMMddHHmm}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template v-slot="{row}">
                    <div v-show="!branchId || branchId === row.branchId">
                        <el-button type="text" @click="bindPost(row)"
                                   class="custom-el-button unset-padding" size="small">
                            职务变更
                        </el-button>
<!--                        <el-button v-show="row.isMemberShipBranch" type="text" @click="bindPost(row.branchId)"-->
<!--                                   class="custom-el-button unset-padding" size="small">-->
<!--                            会费标准变更-->
<!--                        </el-button>-->
                        <el-button type="text" @click="quitBranch(row)"
                                   class="custom-el-button danger unset-padding" size="small">
                            从该会移除
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="职务变更" append-to-body :close-on-click-modal="false" :visible.sync="bindPostVisible" width="600px">
            <bind-post v-if="bindPostVisible" :default-post="defaultPost" :branchId="handleBranch" :memberId="memberId" @refresh="getMemberJoinBranches" @close="bindPostVisible = false"/>
        </el-dialog>
    </div>
</template>

<script>
    import BindPost from "../../memberManage/BindPost";
    export default {
        name: "JoinBranches",
        components: {BindPost},
        props:{
            memberId: String,
            showBranchOperate: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {
                branchList: [],
                defaultPost: '',
                bindPostVisible: false,
                bindMemberDuesTypeVisible: false,
                handleBranch: ''
            }
        },
        computed:{
            branchId(){
                return this.$store.state.branchId;
            }
        },
        methods:{
            getMemberJoinBranches() {
                if(this.memberId){
                    this.$request.get('/api/admin/member/getMemberJoinBranches', {params: {memberId: this.memberId}}).then(res => {
                        this.branchList = res.data;
                    })
                }else{
                    this.branchList = [];
                }
            },
            quitBranch(row) {
                this.$msgbox.confirm('移除操作是不可逆的，请确认是否继续此操作？', '提示', {
                    type: 'warning',
                    confirmButtonText: '继续移除'
                }).then(() => {
                    this.$request.post('/api/admin/branchManage/quitBranchByAdmin', {
                        memberId: this.memberId,
                        quitBranchId: row.branchId
                    }).then((data) => {
                        if (data.success) {
                            this.$message.success(`该会员已从${row.branchName}中移除`);
                            this.getMemberJoinBranches();
                        }
                    })
                }).catch(() => {
                });
            },
            bindPost(row){
                this.handleBranch = row.branchId;
                this.defaultPost = row.postId;
                this.bindPostVisible = true;
            }
        },
        created() {
            this.getMemberJoinBranches();
        },
        watch:{
            memberId(){
                this.getMemberJoinBranches();
            }
        }
    }
</script>
