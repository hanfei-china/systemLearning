<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 16px;">
        <el-header height="auto" style="padding: 0 0 16px;" class="flex">
            <el-select size="small" placeholder="请选择校友企业" clearable v-model="organizationId" style="margin-right: 16px;">
                <el-option v-for="item in unitList" :key="item.organizationId" :value="item.organizationId"
                           :label="item.organizationName"></el-option>
            </el-select>
            <el-select size="small" placeholder="请选择订单状态" clearable v-model="status" style="margin-right: 16px;">
                <el-option value="1" label="未使用"></el-option>
                <el-option value="2" label="已使用"></el-option>
            </el-select>
            <el-input size="small" placeholder="请输入优惠券编号/用户手机号/优惠券名称进行搜索" clearable v-model="searchContent" style="width: 340px;"></el-input>
        </el-header>
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" width="100%" @selection-change="handleSelectionChange"
                      class="custom-el-table header-gray" size="small" border stripe>
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="优惠券名称" prop="name" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="优惠券编号" show-tooltip-when-overflow prop="id"></el-table-column>
                <el-table-column label="企业单位" prop="organizationName" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="领取用户" prop="userName"></el-table-column>
                <el-table-column label="用户手机号" prop="userPhone"></el-table-column>
                <el-table-column label="实付积分" prop="integral"></el-table-column>
                <el-table-column label="领取时间">
                    <template v-slot="{row}">
                        <span>{{row.createTime | yyyyMMddHHmm}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态">
                    <template v-slot="{row}">
                        <span v-if="row.status === '1'">未使用</span>
                        <span v-if="row.status === '2'">已使用</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="90px">
                    <template v-slot="{row}">
                        <el-button size="small" type="text" @click="writeOffRecord(row.id)" :disabled="row.status === '2'">核销</el-button>
                        <el-button size="small" type="text" class="custom-el-button danger" @click="deleteRecord(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer height="auto" class="flex" style="padding: 16px 0 0;">
            <div class="flex-fill-in-the-remaining-space">
                <batch-operation>
                    <li @click="writeOffRecords">核销</li>
                    <li @click="deleteRecords">删除记录</li>
                </batch-operation>
            </div>
            <div>
                <el-pagination
                        size="small" background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-sizes="[20, 50, 100, 200]"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                </el-pagination>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import BatchOperation from "../../../../util/BatchOperation";
    export default {
        name: "CouponRecords",
        components: {BatchOperation},
        data(){
            return {
                unitList: [],
                organizationId: '',//校友企业id
                searchContent: '',//搜索词
                status: '',//状态
                list: [],
                page: {
                    total: 0,
                    pageSize: 20,
                    currentPage: 1
                },
                selectIds: []
            }
        },
        watch: {
            organizationId(){
                this.getList();
            },
            searchContent(){
                this.getList();
            },
            status(){
                this.getList();
            }
        },
        created(){
            this.getUnitList();
            this.getList();
        },
        methods: {
            getUnitList() {
                this.$request.get('/api/admin/organization/listOrganizationForSelect').then(res => {
                    if (res.success) {
                        this.unitList = res.data;
                    }
                })
            },
            getList(){
                this.$request.get('/api/admin/organization/coupon/record',{params: {
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1),
                        organizationId: this.organizationId,
                        searchContent: this.searchContent,
                        status: this.status
                    }}).then(res=>{
                        if(res.success){
                            this.list = res.data.list;
                            this.page.total = res.data.total;
                        }
                })
            },
            handleSizeChange(val){
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val){
                this.page.currentPage = val;
                this.getList();
            },
            handleSelectionChange(val) {
                this.selectIds = [];
                for (let item of val) {
                    this.selectIds.push(item.id);
                }
            },
            writeOffRecord(id){
                this.$confirm('此操作将核销此记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.put('/api/admin/organization/coupon/writeOffRecord',null,{params: {couponRecordIds: [id]}}).then(res=>{
                        if(res.success){
                            this.$message.success('当前记录已核销');
                            this.getList();
                        }
                    })
                }).catch(()=>{})
            },
            deleteRecord(id){
                this.$confirm('此操作将删除当前记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/organization/coupon/record',{params: {couponRecordIds: [id]}}).then(res => {
                        if (res.success) {
                            this.$message.success('当前记录已删除');
                            this.getList();
                        }
                    })
                }).catch(() => {})
            },
            writeOffRecords(){
                if (this.selectIds && this.selectIds.length === 0) {
                    this.$message.warning('请选择要核销的项');
                    return
                }
                this.$confirm('此操作将核销当前选择的所有记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.put('/api/admin/organization/coupon/writeOffRecord',null,{params: {couponRecordIds: this.selectIds}}).then(res=>{
                        if(res.success){
                            this.$message.success('当前选择的所有记录已核销');
                            this.getList();
                        }
                    })
                }).catch(()=>{})
            },
            deleteRecords(){
                if (this.selectIds && this.selectIds.length === 0) {
                    this.$message.warning('请选择要删除的项');
                    return
                }
                this.$confirm('此操作将删除当前选择的所有记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/organization/coupon/record',{params: {couponRecordIds: this.selectIds}}).then(res => {
                        if (res.success) {
                            this.$message.success('当前选择的所有记录已删除');
                            this.getList();
                        }
                    })
                }).catch(() => {})
            },
        }
    }
</script>

<style scoped>

</style>
