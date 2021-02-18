<template>
    <el-container>
        <el-main class="unset-padding" v-loading="loading">
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
                        <el-form-item style="margin-left: 16px;" class="flex-fill-in-the-remaining-space">
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
                    <el-form-item style="margin-left: 16px;" class="flex-fill-in-the-remaining-space">
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
                        <el-input size="small" placeholder="请输入减免金额" v-model="reducePrice" :maxlength="16"/>
                    </el-form-item>
                    <el-form-item style="margin-left: 16px;" class="flex-fill-in-the-remaining-space">
                        <template v-slot:label>
                            <div class="custom-el-form-item-label required">
                                财务年：
                            </div>
                        </template>
                        <div>{{paymentYear | yyyy}}年</div>
                    </el-form-item>
                </div>
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
    export default {
        name: "DuesReduce",
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
                standardPrice: 0,
                reducePrice: 0,
                paymentPrice: '',
                paymentDate: new Date(),
                remarks: '',
                loading: true
            }
        },
        methods:{
            getRefreshData(){
                Promise.all([this.$request.get('/api/admin/dues/standard/anon/postDuesStandard',{params:{duesTypeId: this.memberInfo.duesStandardType,branchId: this.targetBranchId}})
                ]).then(([standardPriceRes])=>{
                    this.standardPrice = standardPriceRes.data;
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

                if(!temp.test(this.reducePrice)){
                    this.$message.error('请输入正确的会费减免金额');
                    return;
                }

                if(this.reducePrice <= 0){
                    this.$message.error('减免金额应大于0元');
                    return;
                }

                if(this.reducePrice > this.standardPrice){
                    this.$message.error(`减免金额不能大于标准额：${this.standardPrice}元`);
                    return;
                }


                let data = {
                    memberId: this.memberInfo.id,
                    targetBranchId: this.targetBranchId,
                    reducePrice: this.reducePrice,
                    standardPrice: this.standardPrice,
                    paymentYear: this.paymentYear,
                    remarks: this.remarks
                };

                this.$request.post('/api/admin/dues/payment/duesReduce',data).then(()=>{
                    this.$message.success('已成功减免本年费用');
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


