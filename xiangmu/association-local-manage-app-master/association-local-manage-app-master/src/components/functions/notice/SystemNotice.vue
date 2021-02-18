<template>
    <el-container style="padding: 16px;"  class="absolute-fill-parent background-color-white">
        <el-main class="position-relative unset-padding">
            <div class="absolute-fill-parent">
                <vue-scroll>
                    <div>
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item v-for="notice of list" :key="notice.id" :name="notice.id">
                                <template slot="title">
                                    <div style="width: 100%;" class="flex flex-column flex-center">
                                        <div class="flex">
                                            <div class="flex-fill-in-the-remaining-space">{{notice.title}}</div>
                                            <div style="padding-right: 16px;">{{notice.createTime | yyyyMMddHHmm}}</div>
                                        </div>
                                    </div>
                                </template>
                                <div>{{notice.content}}</div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="flex" style="padding: 16px 0 0 0;">
                <div class="flex-fill-in-the-remaining-space text-align-right">
                    <el-pagination :current-page="page.currentPage" background
                                   :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                   :total="total"
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
    export default {
        name: "SystemNotice",
        data(){
            return {
                list:[],
                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total:0,
                activeName: ''
            }
        },
        computed:{
            condition(){
                let condition = {
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1)*this.page.pageSize
                }

                return condition;
            }
        },
        methods:{
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
                this.loadNotices();
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
                this.loadNotices();
            },
            loadNotices(){
                this.$request.get('/api/admin/branchManage/getAdminNotices',{params: this.condition}).then(res=>{
                    this.list = res.data.list;
                    this.total = res.data.total;
                })
            }
        },
        created() {
            this.loadNotices();
        }
    }
</script>

