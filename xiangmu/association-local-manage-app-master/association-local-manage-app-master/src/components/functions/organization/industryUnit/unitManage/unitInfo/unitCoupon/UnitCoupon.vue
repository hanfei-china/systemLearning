<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 16px;">
        <el-header class="unset-padding text-align-right" height="auto">
            <el-button size="small" type="warning" @click="writeOffRecordVisible = true">核销优惠券</el-button>
            <el-button size="small" type="primary" @click="getRecord">领取记录</el-button>
            <el-button size="small" type="primary" @click="addCoupon">新增优惠券</el-button>
        </el-header>
        <el-main style="padding: 16px 0 0;">
            <vue-scroll>
                <div style="padding: 0 0 16px;" v-for="item of list" :key="item.id">
                    <el-card>
                        <div class="border-bottom">
                            <div class="flex">
                                <p class="flex-fill-in-the-remaining-space">【代金券】{{item.name}}</p>
                                <p>
                                    <span style="font-size: 12px;color: #555;padding-right: 8px;" v-if="item.enabled">取消发布</span>
                                    <span style="font-size: 12px;color: #555;padding-right: 8px;" v-if="!item.enabled">发布</span>
                                    <el-switch v-model="item.enabled" active-color="#13ce66" @change="couponStatusChange($event,item.id)"></el-switch>
                                </p>
                            </div>
                            <p style="font-size: 12px;color: #555;padding: 8px 0;">
                                {{item.remark}}
                            </p>
                            <p style="font-size: 12px;color: #555;padding-bottom: 8px;">
                                <span>有效期：</span>
                                <span v-if="item.overdueType === '1'">{{item.beginTime | yyyyMMdd}} - {{item.endTime | yyyyMMdd}}</span>
                                <span v-if="item.overdueType === '2'">领取之日起{{item.effectiveDays}}天内有效</span>
                                <span v-if="item.overdueType === '3'">长期有效</span>
                            </p>
                        </div>
                        <div class="flex" style="padding-top: 16px;">
                            <div class="flex-fill-in-the-remaining-space">剩余数量：{{item.num - item.recordCount}}/{{item.num}}</div>
                            <div>
                                <el-button type="text" size="small" icon="el-icon-s-order" class="unset-padding custom-el-button warning" @click="getRecord">领取记录（{{item.recordCount}}）</el-button>
                                <el-button type="text" size="small" icon="el-icon-edit" class="unset-padding custom-el-button" @click="editCoupon(item.id)">编辑</el-button>
                                <el-button type="text" size="small" icon="el-icon-delete" class="unset-padding custom-el-button danger" @click="deleteCoupon(item.id)">删除</el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
            </vue-scroll>
        </el-main>
        <el-footer height="auto" class="unset-padding text-align-right">
            <el-pagination background :total="page.total" :page-size="page.pageSize" :current-page="page.currentPage"
                           layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,50]"
                           @size-change="sizeChange" @current-change="currentChange"/>
        </el-footer>
        <el-dialog :visible.sync="couponFormVisible" :title="couponFormTitle"
                   append-to-body :close-on-click-modal="false" width="800px">
            <coupon-form v-if="couponFormVisible" :couponId="couponId" :unitInfo="unitInfo"
                          @close="couponFormVisible = false" @refresh="refresh"></coupon-form>
        </el-dialog>
        <el-dialog :visible.sync="writeOffRecordVisible" title="核销优惠券"
                   append-to-body :close-on-click-modal="false" width="600px">
            <div>
                <el-input size="small" v-model="couponRecordId" placeholder="请输入优惠券编号" clearable></el-input>
            </div>
            <div class="text-align-right" style="padding: 16px 0;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="writeOffRecordVisible = false">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="writeOffRecord">确认核销</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import CouponForm from "./CouponForm";
    export default {
        name: "UnitCoupon",
        components: {CouponForm},
        props: {
            unitInfo: {
                type: Object
            }
        },
        data(){
            return {
                list: [],
                page: {
                    total: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                couponFormVisible: false,
                couponFormTitle: '新增优惠券',
                couponId: '',
                writeOffRecordVisible: false,//核销优惠券
                couponRecordId: '',//核销优惠券的id
            }
        },
        created(){
            this.getList();
        },
        methods: {
            getRecord(){
                this.$router.push({name: 'couponRecords'});
            },
            addCoupon(){
                this.couponFormVisible = true;
                this.couponFormTitle = '新增优惠券';
                this.couponId = '';
            },
            editCoupon(id){
                this.$confirm('未发布状态下才可编辑，是否取消发布继续编辑?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.couponFormVisible = true;
                    this.couponFormTitle = '编辑优惠券';
                    this.couponId = id;
                }).catch(()=>{})
            },
            couponStatusChange(event,id){
                if(event){
                    this.$confirm('此操作将发布优惠券, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.$request.put('/api/admin/organization/coupon/enable/' + id);
                    }).catch(()=>{
                        this.getList();
                    });
                }else {
                    this.$confirm('此操作将取消发布优惠券, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.$request.put('/api/admin/organization/coupon/disable/' + id);
                    }).catch(()=>{
                        this.getList();
                    });
                }
            },
            deleteCoupon(id){
                this.$confirm('此操作将删除此优惠券, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/organization/coupon/' + id).then(res => {
                        if (res.success) {
                            this.$message.success('优惠券已删除');
                            this.getList();
                        }
                    })
                }).catch(() => {
                })
            },
            writeOffRecord(){
                this.$confirm('此操作将核销此优惠券, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.put('/api/admin/organization/coupon/writeOffRecord', null ,{params:{couponRecordIds: [this.couponRecordId]}}).then(res=>{
                        if(res.success){
                            this.$message.success('优惠券已核销');
                            this.couponRecordId = null;
                            this.writeOffRecordVisible = false;
                        }
                    })
                }).catch(()=>{})
            },
            getList(){
                this.$request.get('/api/admin/organization/coupon',{params: {
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1),
                        organizationId: this.unitInfo.id
                    }}).then(res=>{
                        if(res.success){
                            this.list = res.data.list;
                            this.page.total = res.data.total;
                        }
                })
            },
            sizeChange(val){
                this.page.pageSize = val;
                this.currentPage = 1;
                this.getList();
            },
            currentChange(val){
                this.currentPage = val;
                this.getList();
            },
            refresh(){
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>
