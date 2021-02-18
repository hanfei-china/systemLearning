<template>
    <el-container style="padding: 16px;">
        <el-main class="unset-padding" style="overflow: hidden;height: 420px;">
            <vue-scroll>
                <el-form size="small" label-width="120px">
                    <el-form-item label="优惠券名称">
                        <el-input v-model="form.name" placeholder="请输入优惠券名称"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券个数" required>
                        <el-input v-model="form.num" placeholder="请输入优惠券个数"></el-input>
                    </el-form-item>
                    <el-form-item label="优惠券类型" required>
                        <el-select v-model="form.type" placeholder="请选择优惠券类型" style="width: 100%;">
                            <el-option value="1" label="折扣券"></el-option>
                            <el-option value="2" label="代金券"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="折扣力度" required v-if="form.type === '1'">
                        <div class="flex">
                            <el-input v-model="form.discount" placeholder="请输入折扣力度"></el-input>
                            <span style="padding: 0 16px;line-height: 32px;">折</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="优惠金额" required v-if="form.type === '2'">
                        <div class="flex">
                            <el-input v-model="form.discount" placeholder="请输入优惠金额"></el-input>
                            <span style="padding: 0 16px;line-height: 32px;">元</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="兑换所需积分" required>
                        <el-input v-model="form.integral" placeholder="请输入兑换所需积分"></el-input>
                    </el-form-item>
                    <el-form-item label="过期类型" required>
                        <el-select v-model="form.overdueType"  placeholder="请选择过期类型" style="width: 100%;">
                            <el-option value="1" label="指定时间段内有效"></el-option>
                            <el-option value="2" label="指定天数内有效"></el-option>
                            <el-option value="3" label="一直有效"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="有效天数" v-if="form.overdueType === '2'">
                        <el-input v-model="form.effectiveDays" placeholder="请输入有效天数"></el-input>
                    </el-form-item>
                    <el-form-item label="生效时间" v-if="form.overdueType === '1'">
                        <el-date-picker v-model="form.beginTime" type="date" placeholder="请选择生效时间" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="失效时间" v-if="form.overdueType === '1'">
                        <el-date-picker v-model="form.endTime" type="date" placeholder="请选择失效时间" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="5" resize="none" v-model="form.remark" placeholder="请输入备注信息"></el-input>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer height="auto" style="padding-top: 16px;">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "CouponForm",
        props: {
            couponId: {
                type: String
            },
            unitInfo: {
                type: Object
            }
        },
        created(){
            if(this.couponId){
                this.getInfo();
            }
        },
        data() {
            return {
                form: {
                    type: '',//优惠券类型
                    discount: '',//折扣百分比
                    integral: '',//消耗积分
                    num: '',//优惠券个数
                    overdueType: '',//过期类型

                    organizationId: this.unitInfo.id,//校友企业id
                    // deleted: false,//是否删除
                    // enabled: false,//是否启用

                    name: '',//优惠券名称
                    effectiveDays: '',//有效天数
                    beginTime: '',//生效时间
                    endTime: '',//失效时间
                    remark: '',//备注
                }
            }
        },
        methods: {
            getInfo(){
                this.$request.get('/api/admin/organization/coupon/'+ this.couponId).then(res=>{
                    if(res.success){
                        this.form = res.data;
                    }
                })
            },
            submitData() {
                if(!this.couponId){
                    this.form.discount = Number(this.form.discount);
                    this.form.effectiveDays = Number(this.form.effectiveDays);
                    this.form.integral = Number(this.form.integral);
                    this.form.num = Number(this.form.num);
                    this.$request.post('/api/admin/organization/coupon',this.form).then(res=>{
                        if(res.success){
                            this.$message.success('优惠券已添加');
                            this.$emit("refresh");
                            this.$emit("close");
                        }
                    })
                }else {
                    this.form.discount = Number(this.form.discount);
                    this.form.effectiveDays = Number(this.form.effectiveDays);
                    this.form.integral = Number(this.form.integral);
                    this.form.num = Number(this.form.num);
                    this.form.id = this.couponId;
                    this.$request.put('/api/admin/organization/coupon',this.form).then(res=>{
                        if(res.success){
                            this.$message.success('优惠券信息已更新');
                            this.$emit("refresh");
                            this.$emit("close");
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
