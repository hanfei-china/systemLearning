<template>
    <el-container class="absolute-fill-parent background-color-white">
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
            </div>
        </el-header>
        <el-main style="padding: 0 16px 16px 16px;">
            <el-table class="custom-el-table header-gray" height="100%"
                      border :data="list" size="small">
                <el-table-column type="index" width="50" label="序号" align="center"/>
                <el-table-column label="附件" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <a v-show="row.billUrl" :href="`${row.billUrl}?attname=${encodeURI(row.fileName)}`" target="_blank"
                           class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{row.fileName}}</a>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="年份" prop="billYear" align="center"/>
                <el-table-column width="100" label="月份" prop="billMonth" align="center"/>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>

    export default {
        name: "LedgerQuery",
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

                query:{
                    yearSearch: new Date().getFullYear()+'',
                    monthSearch: new Date().getMonth()+1
                },
                list:[],
                loading: false,
            }
        },
        computed:{
            chosenBranchId(){
                return this.$store.state.branchId;
            }
        },
        methods:{
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
