<template>
    <el-container>
        <el-main class="unset-padding" style="overflow: hidden;" v-loading="loading">
            <el-form label-width="120px" size="small">
                <div>
                    <div class="flex">
                        <el-form-item class="flex-fill-in-the-remaining-space">
                            <template v-slot:label>
                                <div class="custom-el-form-item-label required">
                                    会员姓名：
                                </div>
                            </template>
                            <div class="text-overflow" style="width: 260px;">{{memberInfo.name}}</div>
                        </el-form-item>
                        <el-form-item class="flex-fill-in-the-remaining-space">
                            <template v-slot:label>
                                <div class="custom-el-form-item-label required">
                                    会费标准：
                                </div>
                            </template>
                            <div>{{memberInfo.duesStandardTypeName}}</div>
                        </el-form-item>
                    </div>
                </div>

                <div class="flex">
                    <el-form-item class="flex-fill-in-the-remaining-space">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                标准金额(¥)：
                            </div>
                        </template>
                        <div>{{standardPrice | currency}}</div>
                    </el-form-item>
                    <el-form-item class="flex-fill-in-the-remaining-space">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                应缴金额(¥)：
                            </div>
                        </template>
                        <div>{{(standardPrice-reducePrice)|currency}}</div>
                    </el-form-item>
                </div>

                <div class="flex">
                    <el-form-item class="flex-fill-in-the-remaining-space">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                减免金额(¥)：
                            </div>
                        </template>
                        <div>{{reducePrice | currency}}</div>
                    </el-form-item>
                    <el-form-item class="flex-fill-in-the-remaining-space">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                实缴金额(¥)：
                            </div>
                        </template>
                        <el-input size="small" placeholder="请输入实缴金额" v-model="paymentPrice" :maxlength="16"/>
                    </el-form-item>
                </div>
                <div class="flex">
                    <el-form-item class="flex-fill-in-the-remaining-space">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                财务年：
                            </div>
                        </template>
                        <div>{{paymentYear | yyyy}}年</div>
                    </el-form-item>
                    <el-form-item class="flex-fill-in-the-remaining-space">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                缴费日期：
                            </div>
                        </template>
                        <el-date-picker style="width: 100%;" type="date" format="yyyy-MM-dd" v-model="paymentDate"/>
                    </el-form-item>
                </div>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            缴费人：
                        </div>
                    </template>
                    <member-contacts-choose style="width: 100%;" :member-id="memberInfo.id" v-model="relationId" placeholder="请选择缴费人"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            备注：
                        </div>
                    </template>
                    <el-input v-model="remarks" :maxlength="200" placeholder="备注信息，200字以内"
                              type="textarea" resize="none" :rows="5"/>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right" style="padding-top: 16px">
                <el-button icon="el-icon-error" type="danger" @click="$emit('close')" size="small">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import MemberContactsChoose from "../../member/memberContacts/MemberContactsChoose";
    export default {
        name: "DuesPayment",
        components: {MemberContactsChoose},
        props: {
            memberInfo:{
                type: Object,
                default(){
                    return null;
                }
            },
            targetBranchId: String,
            paymentYear: Date
        },
        data(){
            return {
                standardPrice: '',
                reducePrice: 0,
                paymentPrice: '',
                paymentDate: new Date(),
                remarks: '',
                loading: true,
                relationId: null
            }
        },
        methods:{
            getRefreshData(){
                Promise.all([this.$request.get('/api/admin/dues/standard/anon/postDuesStandard',{params:{duesTypeId: this.memberInfo.duesStandardType,branchId: this.targetBranchId}}),
                    this.$request.post('/api/admin/dues/payment/anon/duesReduce',{memberId: this.memberInfo.id, branchId: this.targetBranchId, paymentYear:this.paymentYear})
                ]).then(([standardPriceRes,duesReduceRes])=>{
                    this.standardPrice = standardPriceRes.data;
                    this.reducePrice = duesReduceRes.data ? duesReduceRes.data.reducePrice : 0;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            submitData(){
                if(!this.memberInfo.id){
                    this.$message.error('会员id为空');
                    return;
                }

                if(!this.targetBranchId){
                    this.$message.error('分会id为空');
                    return;
                }


                let temp = /((^[1-9]\d*)|^0)(\.\d{0,2})?$/;

                if(!temp.test(this.paymentPrice)){
                    this.$message.error('请输入正确的实缴金额');
                    return;
                }

                if(!this.paymentDate){
                    this.$message.error('请选择会费缴纳日期');
                    return;
                }


                let data = {
                    memberId: this.memberInfo.id,
                    targetBranchId: this.targetBranchId,
                    standardPrice: this.standardPrice,
                    reducePrice: this.reducePrice,
                    paymentPrice: this.paymentPrice,
                    paymentDate: this.paymentDate,
                    paymentYear: this.paymentYear,
                    relationId: this.relationId,
                    remarks: this.remarks
                };

                this.$request.post('/api/admin/dues/payment/duesPayment',data).then(()=>{
                    this.$message.success('会费缴费信息记录成功');
                    this.$emit('refresh');
                    this.$emit('close');
                })

            },
        },
        created() {
            this.getRefreshData();
        }
    }
</script>


