<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside v-if="!branchId" width="200px" class="border-right unset-padding position-relative">
            <branch-menu @select="setChosenBranchId"/>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container style="padding: 16px;" class="absolute-fill-parent">
                <el-header class="unset-padding flex" height="auto">
                    <div class="flex-fill-in-the-remaining-space flex" style="padding: 0;width: 194px;">
                        <div class="flex">
                            <div class="flex">
                                <div class="flex flex-column flex-center"><div>财务年：</div></div>
                                <div><el-date-picker style="width: 150px" :clearable="false" format="yyyy年" size="small" v-model="year" type="year" placeholder="选择年"/></div>
                            </div>
                            <div class="flex" style="margin-left: 16px;">
                                <div class="flex flex-column flex-center"><div>会员职务：</div></div>
                                <div>
                                    <el-select placeholder="下拉选择会员职务" size="small" v-model="post" clearable filterable>
                                        <el-option v-for="item of postList" :key="item.id" :value="item.id" :label="item.postName"/>
                                    </el-select>
                                </div>
                            </div>
                            <div class="flex" style="margin-left: 16px;">
                                <div class="flex flex-column flex-center"><div>已缴费会员数：</div></div>
                                <div class="flex flex-column flex-center">{{paidMember}}</div>
                            </div>
                            <div class="flex" style="margin-left: 16px;">
                                <div class="text-align flex flex-column flex-center"><div>未缴费会员数：</div></div>
                                <div class="flex flex-column flex-center">{{allMember - paidMember}}</div>
                            </div>
                        </div>
                        <div class="flex-fill-in-the-remaining-space text-align-right">
                            <el-button type="primary" size="small" icon="el-icon-setting" @click="duesSettingShow=true">会费标准变更</el-button>
                        </div>
                    </div>
                </el-header>
                <el-main style="padding: 16px 0 0 0 !important;" v-loading="loading">
                    <el-table class="custom-el-table header-gray" height="100%"
                              border :data="memberList" size="small" stripe
                              @selection-change="handleSelectionChange">
                        <el-table-column label="序号" width="50" fixed type="selection" align="center"/>
                        <el-table-column label="序号" width="50" fixed type="index" align="center"/>
                        <el-table-column label="会员" prop="name" width="150" align="center"/>
                        <el-table-column label="会员职务" prop="postName" width="150" align="center">
                            <template v-slot="{row}">
                                {{row.postName || '--'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="标准额(¥)" width="120" align="right">
                            <template v-slot="{row}">
                                {{(row.standardPrice || row.rStandardPrice) | currency}}
                            </template>
                        </el-table-column>
                        <el-table-column label="减免额(¥)" width="120" align="right">
                            <template v-slot="{row}">
                                {{(row.reducePrice || row.rReducePrice) | currency}}
                            </template>
                        </el-table-column>
                        <el-table-column label="应缴额(¥)" width="120" align="right">
                            <template v-slot="{row}">
                                {{(row.standardPrice ? row.standardPrice - row.reducePrice : row.rStandardPrice ?  row.rStandardPrice - row.rReducePrice: null) | currency}}
                            </template>
                        </el-table-column>
                        <el-table-column label="实缴额(¥)" width="120" align="right">
                            <template v-slot="{row}">
                                {{row.paymentPrice | currency}}
                            </template>
                        </el-table-column>
                        <el-table-column label="是否缴费" align="center">
                            <template v-slot="{row}">
                                <temp-var :isPayment="row.paymentPrice !== null && row.paymentPrice !== undefined">
                                    <template v-slot="{isPayment}">
                                        <span :class="{'success-tip':isPayment,'danger-tip':!isPayment}" style="font-size: 12px;">{{isPayment ? '是' : '否'}}</span>
                                    </template>
                                </temp-var>
                            </template>
                        </el-table-column>
                        <el-table-column label="缴费日期" width="120" align="center">
                            <template v-slot="{row}">
                                {{row.paymentDate | yyyyMMdd}}
                            </template>
                        </el-table-column>
                        <el-table-column label="录入时间" width="150" align="center">
                            <template v-slot="{row}">
                                {{row.createTime | yyyyMMddHHmm}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150px" fixed="right" align="center">
                            <template v-slot="{row}">
                                <temp-var :isPayment="!!(row.standardPrice)" :isReduce="!!(row.rStandardPrice)">
                                    <template v-slot="{isPayment,isReduce}">
                                        <el-button :disabled="isReduce || isPayment" class="unset-padding" size="small" type="text" @click="openDuesReduce(row)">减免</el-button>
                                        <el-button :disabled="isPayment" class="unset-padding" size="small" type="text" @click="openDuesPayment(row)">录入</el-button>
                                        <el-button :disabled="isPayment" class="unset-padding" size="small" type="text" @click="duesUrge(row)">催缴</el-button>
                                    </template>
                                </temp-var>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer class="unset-padding" height="auto">
                    <div class="flex" style="padding: 16px 0 0 0;">
                        <div>
                            <batch-operation title="批量操作">
                                <li @click="duesUrge(null)"> 催缴 </li>
                            </batch-operation>
                        </div>
                        <div class="flex-fill-in-the-remaining-space text-align-right">
                            <el-pagination :current-page="page.currentPage" background
                                           :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                           :total="memberTotal"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           @current-change="pageChange"
                                           @size-change="sizeChange">
                            </el-pagination>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
        <el-dialog :visible.sync="duesSettingShow" width="600px" title="会费标准变更" :close-on-click-modal="false" append-to-body>
            <dues-setting v-if="duesSettingShow" :dues-type-list="duesTypeList" @close="duesSettingShow = false"/>
        </el-dialog>
        <el-dialog :visible.sync="reduceShow" width="800px" title="减免" :close-on-click-modal="false" append-to-body>
            <dues-reduce v-if="reduceShow"
                          :member-info="handleMember" :target-branch-id="targetBranchId" :payment-year="year"
                          @close="reduceShow=false" @refresh="reloadMembers"/>
        </el-dialog>
        <el-dialog :visible.sync="paymentShow" width="800px" title="录入" :close-on-click-modal="false" append-to-body>
            <dues-payment v-if="paymentShow"
                          :member-info="handleMember" :target-branch-id="targetBranchId" :payment-year="year"
                          @close="paymentShow=false" @refresh="reloadMembers"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import DuesPayment from "./handlers/DuesPayment";
    import DuesSetting from "./DuesSetting";
    import BranchMenu from "../branchManage/util/BranchMenu";
    import TempVar from "../../../util/TempVar";
    import DuesReduce from "./handlers/DuesReduce";
    import BatchOperation from "../../../util/BatchOperation";
    export default {
        name: "DuesManage",
        components: {BatchOperation, DuesReduce, TempVar, BranchMenu, DuesSetting, DuesPayment},
        computed: {
            condition() {
                let condition = {};

                condition.year = this.year;
                condition.postId = this.post;
                condition.targetBranch = this.chosenBranchId || this.branchId;
                condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
                condition.limit = this.page.pageSize;
                return condition;
            },
            branchId(){
                return this.$store.state.branchId;
            },
            targetBranchId(){
                return this.branchId || this.chosenBranchId;
            }
        },
        data(){
            return {
                memberList:[],
                allMember: 0,
                paidMember: 0,
                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                memberTotal:0,

                year: new Date(new Date().getFullYear(), 0),

                duesSettingShow: false,
                handleMember: null,
                selection: [],
                reduceShow: false,
                paymentShow: false,
                paymentListShow: false,

                postList: [],
                post: '',

                duesTypeList: [],

                chosenBranchId: '',
                loading: true
            }
        },
        methods:{
            handleSelectionChange(selection) {
                this.selection = selection;
            },
            setChosenBranchId(branchId){
                this.chosenBranchId = branchId;
            },
            getPostList(){
                this.$request.get('/api/admin/post/list').then(res=>{
                    this.postList = res.data;
                })
            },
            getDuesTypeList() {
                this.$request.get('/api/admin/group/getCategoryNameAndIdByName', {
                    params: {
                        type: 7
                    }
                }).then(res => {
                    if (res.success) {
                        this.duesTypeList = res.data;
                        this.seq = res.data.length;
                    }
                })
            },
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
                this.loadMembers();
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
                this.loadMembers();
            },
            loadMembers(){
                if((this.branchId || this.chosenBranchId) && this.year){
                    this.loading = true;
                    this.$request.post('/api/admin/dues/payment/duesPaymentListForBranch',this.condition).then(res=>{
                        let {list,total,allMember,paidMember} = res.data;
                        this.memberList = list;
                        this.memberTotal = total;
                        this.allMember = allMember;
                        this.paidMember = paidMember;
                        this.$nextTick(()=>{this.$nextTick(()=>{ this.loading = false; })})
                    });
                }
            },
            duesUrge(row){
                let memberIds = [];
                if(row){
                    memberIds.push(row.id);
                }else{
                    if(this.selection.length<1){
                        this.$message.warning(`请选择要催缴的会员`);
                        return;
                    }
                    for(let _row of this.selection){
                        let isPayment = _row.paymentPrice !== null && _row.paymentPrice !== undefined;
                        if(!isPayment){
                            memberIds.push(_row.id);
                        }
                    }

                    if(memberIds.length<1){
                        this.$message.warning(`当前所选会员均已缴纳【${this.year.getFullYear()}年度】会费，不能发送催缴通知.`);
                        return;
                    }
                }

                this.$request.post('/api/admin/dues/payment/duesUrge',{memberIds,paymentYear:this.year}).then(()=>{
                    this.reloadMembers();
                    this.$message.success(`已发送会费催缴通知`);
                })


            },
            openDuesReduce(row){
                if(!row.duesStandardType){
                    this.$message.warning("请先设置该会员的会费标准");
                    return;
                }
                this.handleMember = row;
                this.reduceShow = true;
            },
            openDuesPayment(row){
                if(!row.duesStandardType){
                    this.$message.warning("请先设置该会员的会费标准");
                    return;
                }
                this.handleMember = row;
                this.paymentShow = true;
            },
            openDuesPaymentList(row){
                this.handleMember = row;
                this.paymentListShow = true;
            },
            reloadMembers(){
                this.page.currentPage = 1;
                this.loadMembers();
            }
        },
        created() {
            this.getPostList();
            this.getDuesTypeList();
            this.loadMembers();
        },
        watch: {
            condition() {
                this.page.currentPage = 1;
                this.loadMembers();
            }
        }
    }
</script>
