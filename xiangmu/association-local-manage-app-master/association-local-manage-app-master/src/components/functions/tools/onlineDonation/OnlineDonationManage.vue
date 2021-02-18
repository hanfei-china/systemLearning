<template>
    <el-container v-if="!donationMoneyVisible" class="absolute-fill-parent background-color-white">
        <el-aside v-if="!routeClassId" class="border-right unset-padding position-relative" width="200px">
            <online-donation-class-menu @select="setChosenClass"/>
        </el-aside>
        <el-main class="unset-padding position-relative" v-show="classId || routeClassId">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-column flex-center">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                            <div class="flex">
                                <el-input style="max-width: 450px;" v-model="title" clearable placeholder="请输入项目标题进行搜索" size="small"/>
                            </div>
                        </div>
                        <div>
                            <el-button type="primary" size="small" @click="createOnlineDonation">新建捐赠项目</el-button>
                        </div>
                    </div>
                </el-header>
                <el-main class="position-relative unset-vertical-padding">
                    <el-table size="small" :data="list" row-key="id" height="100%" class="custom-el-table header-gray" border stripe>
                        <el-table-column label="序号" width="50" type="index" align="center"/>
                        <el-table-column label="项目名称(元)" prop="title" show-tooltip-when-overflow/>
                        <el-table-column label="目标金额" width="200">
                            <template v-slot="{row}">
                                {{row.targetAmount | currency}}
                            </template>
                        </el-table-column>
                        <el-table-column label="项目开始日期" width="140">
                            <template v-slot="{row}">
                                <span>{{ row.startTime | yyyyMMdd }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="项目结束日期" width="140">
                            <template v-slot="{row}">
                                <span>{{ row.endTime | yyyyMMdd }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="更多操作" width="340">
                            <template v-slot="{row}">
                                <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="updateDonation(row.id)">编辑</el-button>
                                <el-button class="custom-el-button unset-padding danger" type="text" size="mini" @click="deleteDonation(row)">删除</el-button>
                                <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="donationRecordList(row.id)">受捐明细</el-button>
                                <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="addDonationMoney(row.id)">添加金额</el-button>
                                 <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="viewDonationMoney(row)">查看金额</el-button>
                                <el-button class="custom-el-button unset-padding" type="text" size="mini" @click="viewQrCode(row)">查看二维码</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer height="auto" class="unset-padding">
                    <div style="padding-bottom: 16px;padding-top: 16px;" class="flex">
                        <div class="flex-fill-in-the-remaining-space">

                        </div>
                        <div>
                            <el-pagination background :total="total" :page-size="page.pageSize" :current-page="page.pageNum"
                                           layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,50]"
                                           @size-change="sizeChange" @current-change="currentChange"/>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
        <online-donation-form :prop-class-id="classId" :donation-id="donationId" v-if="formVisible" @close="formVisible = false" @refresh="refreshList"/>
        <one-donation-record-list :donation-id="donationId" v-if="recordListVisible" @close="recordListVisible = false"/>
        
        <donor-money-dialog :dialogName="dialogName" :donorMoneyVisible="donorMoneyVisible" :donationId="donationId" @closeDonorMoneydialog="closeDonorMoneydialog"></donor-money-dialog>

        <el-dialog title="项目二维码" :visible.sync="qrCodeVisible" append-to-body class="donor-money-visible" width="250px" :before-close="CloseQrCodeVisible"> 
            <img :src="ewmSrc" alt="" width="200">
            <!-- <div  ref="qrCode" class="qrcode"></div> -->
        </el-dialog>
    </el-container>
    <label-list v-else :donationMoneyInfo="viewDonationMoneyInfo" @closeLabelList="donationMoneyVisible = false"></label-list>
</template>

<script>
    import OnlineDonationForm from "./OnlineDonationForm";
    import OnlineDonationClassMenu from "./onlineDonationClassManage/OnlineDonationClassMenu";
    import OneDonationRecordList from "./OneDonationRecordList";
    import DonorMoneyDialog from "./DonorMoneyDialog";
    import LabelList from "./LabelList";
    import QRCode from 'qrcodejs2';
    import Sortable from 'sortablejs';
    export default {
        name: "OnlineDonationManage.vue",
        components: {OneDonationRecordList, OnlineDonationClassMenu, OnlineDonationForm,DonorMoneyDialog,LabelList},
        data(){
            return {
                page:{
                    pageSize: 20,
                    pageNum: 1,
                },
                title: '',
                total: 0,
                list:[],

                formVisible: false,
                donationId: null,

                recordListVisible: false,
                donorMoneyVisible:false,
                qrCodeVisible:false,
                // addMoneyForm:{
                //     amount:""
                // },
                classId: '',
                ewmSrc:"",
                viewDonationMoneyInfo:{},
                donationMoneyVisible:false,
                dialogName:'添加金额'
            }
        },
        computed:{
            branchId(){
                return this.$store.state.branchId;
            },
            routeClassId(){
                return this.$route.params.classId;
            }
        },
        mounted() {
            this.rowDrop()
        },
        methods:{
            //行拖拽
            rowDrop() {
                const tbody = document.querySelector('.el-table__body-wrapper tbody')
                const _this = this
                Sortable.create(tbody, {
                    onEnd({ newIndex, oldIndex }) {
                        const currRow = _this.list.splice(oldIndex, 1)[0]
                        _this.list.splice(newIndex, 0, currRow)
                        _this.sortList(_this.list)
                    }
                })
            },
            sortList(list){
                let ids = [];
                list.map(item=>{
                    ids.push(item.id)
                })
                // data.ids = ids;
                this.$request.put('/api/admin/onlineDonation/sort',{ids}).then(()=>{
                    // this.$message.success('分会信息修改成功');
                })
            },
            setChosenClass(classId){
                this.classId = classId;
            },
            createOnlineDonation(){
                this.donationId = null;
                this.formVisible = true;
            },
            refreshList(){
                this.page.pageNum = 1;
                this.getList();
            },
            sizeChange(size){
                this.page.pageSize =size;
                this.refreshList();
            },
            currentChange(current){
                this.page.pageNum = current;
                this.getList();
            },
            getList(){
                let params = {
                    title: this.title,
                    limit: this.page.pageSize,
                    offset: (this.page.pageNum - 1) * this.page.pageSize,
                    classId: this.classId || this.routeClassId
                };
                this.$request.get('/api/admin/onlineDonation/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                    this.total = data.total;
                })
            },
            updateDonation(id){
                this.donationId = id;
                this.formVisible = true;
            },
            donationRecordList(id){
                this.donationId = id;
                this.recordListVisible = true;
            },
            addDonationMoney(id){
                this.donationId = id;
                this.donorMoneyVisible = true;
            },
            closeDonorMoneydialog(){
                this.donorMoneyVisible = false;
            },
            viewDonationMoney(row){
                this.viewDonationMoneyInfo = row;
                this.donationMoneyVisible = true;
            },
            viewQrCode(row){
                this.$request.get('/api/common/qrcode/donationCode',{params:{donationId: row.id }}).then((resp)=>{
                    this.ewmSrc = resp.data;
                    this.qrCodeVisible = true;
                })
                // this.qrCodeVisible = true;
                // this.qrcode(row);
            },
            qrcode(row) {
                this.$nextTick(() => {
                    let qrcode = new QRCode(this.$refs.qrCode, {
                        width: 200,  
                        height: 200,
                        text: 'https://apidebug.huiyixing.com/association-manage?givingdetail='+row.id+'&'+row.title, // 二维码地址
                    })
                })
            },
            CloseQrCodeVisible(){
                // this.$refs.qrCode.innerHTML = "";
                this.qrCodeVisible = false;
            },
         
            deleteDonation(row){
                this.$msgbox.confirm('删除不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/onlineDonation',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.getList();
                            this.$message.success(`【${row.title}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            }
        },
        created(){
            this.refreshList();
        },
        watch:{
            title(){
                this.refreshList();
            },
            classId(){
                this.refreshList();
            }
        }
    }
</script>
<style>
.donor-money-visible .el-dialog .el-dialog__body .el-form-item{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 32px;
    line-height: 32px;
}
.donor-money-visible .el-dialog .el-dialog__body .el-form-item .el-form-item__content{
    display: flex;
    flex: 1;
}
.donor-money-visible .el-dialog .el-dialog__body .el-form-item .el-form-item__content .el-input .el-input__inner{
    height: 32px;
}
</style>