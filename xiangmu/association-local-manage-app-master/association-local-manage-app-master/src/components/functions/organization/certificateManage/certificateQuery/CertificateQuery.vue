<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class=" flex flex-column flex-center">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space">
                    <el-input style="width: 450px;" size="small" v-model="search.name" placeholder="请输入单位名称进行搜索"/>
                </div>
            </div>
        </el-header>
        <el-main style="padding: 0 16px;" v-loading="loading">
            <el-table class="custom-el-table header-gray" height="100%"
                       border :data="list" size="small" stripe
                       @selection-change="handleSelectionChange">
                <el-table-column label="序号" width="50" fixed type="selection" align="center"/>
                <el-table-column label="序号" width="50" fixed type="index" align="center"/>
                <el-table-column label="单位名称" prop="name" align="center" show-tooltip-when-overflow/>
                <el-table-column label="会员编号" prop="memberNumber" align="center" show-tooltip-when-overflow/>
                <el-table-column label="颁发日期" align="center">
                    <template v-slot="{row}">
                        {{row.startTime | yyyyMMdd}}
                    </template>
                </el-table-column>
                <el-table-column label="失效日期" align="center">
                    <template v-slot="{row}">
                        {{row.endTime | yyyyMMdd}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px" fixed="right" align="center">
                    <template v-slot="{row}">
                        <el-link target="_blank" :href="`${requestBaseUrl}/api/admin/memberCertificate/previewMemberCertificate/${row.memberId}`" type="primary">预览</el-link>
                        <el-link style="margin-left: 4px;" :href="`${requestBaseUrl}/api/admin/memberCertificate/downloadMemberCertificate/${row.memberId}`" type="primary">下载</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="unset-padding flex flex-center flex-column">
            <div class="flex" style="padding: 0 16px;">
                <div>
                    <batch-operation title="批量操作">
                        <li>
                            <a :href="batchDownload">批量下载证书</a>
                        </li>
                    </batch-operation>
                </div>
                <div class="flex-fill-in-the-remaining-space text-align-right">
                    <el-pagination :current-page="page.currentPage" background
                                   :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                   :total="page.total"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   @current-change="pageChange"
                                   @size-change="sizeChange">
                    </el-pagination>
                </div>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from "../../../../../js/config/serviceConfig";
    import BatchOperation from "../../../../util/BatchOperation";
    import Qs from 'qs';

    export default {
        name: "CertificateQuery",
        components: {BatchOperation},
        data(){
            return {
                search: {
                    name,
                },

                list: [],
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                loading: false,
                selection: [],
                requestBaseUrl
            }
        },
        computed:{
            memberIds(){
                let memberIds = [];
                this.selection.map(info=>{
                    memberIds.push(info.memberId);
                })

                if(memberIds.length>0){
                    return Qs.stringify({memberIds}, {arrayFormat: 'repeat', allowDots: true});
                }else{
                    return 'memberIds='
                }
            },
            batchDownload(){
                return requestBaseUrl+'/api/admin/memberCertificate/batchDownloadMemberCertificate?'+this.memberIds;
            }
        },
        methods:{
            getList(){
                this.loading = true;

                let condition = {
                    name: this.search.name,
                    offset: (this.page.currentPage - 1) * this.page.pageSize,
                    limit:  this.page.pageSize
                }

                this.$request.get('/api/admin/memberCertificate/list',{params:condition}).then(({data})=>{
                    this.list = data.list;
                    this.page.total = data.total;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
                this.getList();
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
                this.getList();
            },
            handleSelectionChange(selection){
                this.selection = selection;
            }
        },
        created() {
            this.getList();
        },
        watch:{
            'search.name'(){
                this.page.currentPage = 1;
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>
