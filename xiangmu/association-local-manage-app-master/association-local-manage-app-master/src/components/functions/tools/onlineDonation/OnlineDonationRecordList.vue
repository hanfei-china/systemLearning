<template>
    <el-container class="absolute-fill-parent background-color-white" style="z-index: 3;padding: 0 16px;">
        <el-header class="flex flex-column flex-center unset-padding">
            <div class="flex">
                <el-input prefix-icon="el-icon-search" clearable v-model="search.title" placeholder="根据项目名称进行搜索" style="width: 200px;" size="small"/>
                <div class="flex" style="margin-left: 10px;">
                    <div class="flex flex-center flex-column">开始日期：</div>
                    <el-date-picker size="small" placeholder="请选择捐赠开始日期" v-model="search.startDate"></el-date-picker>
                </div>
                <div class="flex" style="margin-left: 10px;">
                    <div class="flex flex-center flex-column">结束日期：</div>
                    <el-date-picker size="small" placeholder="请选择捐赠结束日期" v-model="search.endDate"></el-date-picker>
                </div>
            </div>
        </el-header>
        <el-main class="position-relative unset-padding">
            <el-table size="small" :data="list" class="custom-el-table header-gray" height="100%" border stripe>
                <el-table-column label="序号" width="50" type="index" align="center"/>
                <el-table-column label="项目名称" min-width="150" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <el-tooltip  v-if="row.isDelete" content="项目已删除" placement="top">
                            <span class="text-line-through text-italic" style="color: red;">{{row.title}}</span>
                        </el-tooltip>
                        <span v-else>{{row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠人" min-width="150" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-if="row.groupName!=null&&row.groupName!=''" class="content-title">{{row.groupName}}</span>
                        <span v-else class="content-title">{{ (row.isAnonymous||(!row.donationName)) ? "匿名用户" : row.donationName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系方式" width="130" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span>{{ row.phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="学院/单位" width="130" show-tooltip-when-overflow >
                    <template v-slot="{row}">
                        <span v-if="row.schoolRelation==1||row.schoolRelation==4">{{ row.college }}</span>
                        <span v-else>{{ row.workUnit }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="与学校关系" width="150" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-if="row.schoolRelation==1">曾在校学习</span>
                        <span v-else-if="row.schoolRelation==2">爱心人士</span>
                        <span v-else-if="row.schoolRelation==3">现在或曾经在校工作</span>
                        <span v-else-if="row.schoolRelation==4">现在在校学习</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠金额/元" width="100" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span>{{ row.donationAmount | currency}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠时间" width="130" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span>{{ row.createTime | yyyyMMddHHmm }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="留言" prop="comments" min-width="200" show-tooltip-when-overflow/>
                <el-table-column label="捐赠备注" prop="donationNotes" min-width="200" show-tooltip-when-overflow/>
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
</template>

<script>
    export default {
        name: "OnlineDonationRecordList",
        props: {
            donationId: String
        },
        data() {
            return {
                page: {
                    pageSize: 20,
                    pageNum: 1,
                },
                total: 0,
                list: [],

                search:{
                    title: '',
                    startDate: null,
                    endDate: null
                }
            }
        },
        methods: {
            refreshList() {
                this.page.pageNum = 1;
                this.getList();
            },
            sizeChange(size) {
                this.page.pageSize = size;
                this.refreshList();
            },
            currentChange(current) {
                this.page.pageNum = current;
                this.getList();
            },
            getList() {
                let params = {
                    ...this.search,
                    limit: this.page.pageSize,
                    offset: (this.page.pageNum - 1) * this.page.pageSize,
                };
                if(params.startDate==null){
                    delete params.startDate
                }
                if(params.endDate==null){
                    delete params.endDate
                }
                this.$request.get('/api/admin/onlineDonation/onlineDonationRecord/list', {params}).then((resp) => {
                    let {data} = resp;
                    this.list = data.list;
                    this.total = data.total;
                })
            },
        },
        created() {
            this.refreshList();
        },
        watch:{
            search:{
                deep: true,
                handler(){
                    this.refreshList();
                }
            }
        }
    }
</script>
