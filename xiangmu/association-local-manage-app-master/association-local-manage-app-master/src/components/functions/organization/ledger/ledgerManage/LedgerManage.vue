<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside class="border-right unset-padding position-relative" width="200px">
            <branch-menu @select="setChosenBranchId" @branch="setChosenBranch"/>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-column flex-center">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space">
                            <div class="flex">
                                <div class="flex">
                                    <div class="flex flex-column flex-center">年份：</div>
                                    <el-date-picker v-model="query.yearSearch" :clearable="false" type="year" size="small" value-format="yyyy"/>
                                </div>
                                <div class="flex" style="margin-left: 16px;">
                                    <div class="flex flex-column flex-center">月份：</div>
                                    <el-select v-model="query.monthSearch" clearable size="small" placeholder="下拉选择年份">
                                        <el-option :key="month.value" clearable v-for="month of monthOptions" :value="month.value" :label="month.label"/>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <el-button size="small" type="primary" @click="addLedger">新增台账</el-button>
                        </div>
                    </div>
                </el-header>
                <el-main style="padding: 0 16px 16px 16px;">
                    <el-table class="custom-el-table header-gray" height="100%"
                              border :data="list" size="small">
                        <el-table-column type="index" width="50" label="序号" align="center"/>
                        <el-table-column label="分会" width="200" show-tooltip-when-overflow>
                            {{chosenBranch ? chosenBranch.name : ''}}
                        </el-table-column>
                        <el-table-column label="附件" show-tooltip-when-overflow>
                            <template v-slot="{row}">
                                <a v-show="row.billUrl" :href="`${row.billUrl}?attname=${encodeURI(row.fileName)}`" target="_blank"
                                   class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{row.fileName}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" label="年份" prop="billYear" align="center"/>
                        <el-table-column width="100" label="月份" prop="billMonth" align="center"/>
                        <el-table-column label="操作" width="100px" align="center">
                            <template v-slot="{row}">
                               <el-button type="text" @click="deleteBill(row)" class="custom-el-button danger unset-padding" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-main>
        <el-drawer class="custom-el-drawer" append-to-body :visible.sync="form.visible" :title="form.title"
                   :close-on-click-modal="false" direction="rtl" size="450px">
            <ledger-form :branch-id="chosenBranchId" :branch="chosenBranch" :month-options="monthOptions" @refresh="getList"
                         :original-entity="form.entity" v-if="form.visible" @close="form.visible = false"/>
        </el-drawer>
    </el-container>
</template>

<script>
    import BranchMenu from "../../branchManage/util/BranchMenu";
    import LedgerForm from "./LedgerForm";
    export default {
        name: "LedgerManage",
        components: {LedgerForm, BranchMenu},
        data(){
            return {
                monthOptions:[
                    {value: 1, label: '一月'},
                    {value: 2, label: '二月'},
                    {value: 3, label: '三月'},
                    {value: 4, label: '四月'},
                    {value: 5, label: '五月'},
                    {value: 6, label: '六月'},
                    {value: 7, label: '七月'},
                    {value: 8, label: '八月'},
                    {value: 9, label: '九月'},
                    {value: 10, label: '十月'},
                    {value: 11, label: '十一月'},
                    {value: 12, label: '十二月'},
                ],
                chosenBranchId: '',
                chosenBranch: null,
                query:{
                    yearSearch: new Date().getFullYear()+'',
                    monthSearch: new Date().getMonth()+1
                },
                list:[],
                loading: false,

                form:{
                    visible: false,
                    title: '新增台账',
                    entity: null
                }
            }
        },
        methods:{
            setChosenBranchId(chosenBranchId){
                this.chosenBranchId = chosenBranchId;
            },
            setChosenBranch(chosenBranch){
                this.chosenBranch = chosenBranch;
            },
            getList(){
                if(this.chosenBranchId){
                    let params = {
                        branchSearch: this.chosenBranchId,
                        offset: 0,
                        limit: 12,
                        ...this.query
                    }
                    this.$request.get('/api/admin/branch/bill/getBills',{params}).then(res=>{
                        this.list = res.data.list;
                    })
                }
            },
            addLedger(){
                this.form.title = '新增台账';
                this.form.entity = null;
                this.form.visible = true;
            },
            deleteBill(row){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/branch/bill/deleteBranchBill',{
                        params:{id:row.id}
                    }).then(()=>{
                        this.$message.success(`${this.chosenBranch.name}【${row.billYear}年${row.billMonth}月】台账已删除`);
                        this.getList();
                    })
                }).catch(()=>{});
            }
        },
        created() {
            this.getList();
        },
        watch:{
            chosenBranchId(){
                this.getList();
            },
            query:{
                deep:true,
                handler(){
                    this.getList();
                }
            }
        }
    }
</script>
