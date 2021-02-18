<template>
    <el-container class="absolute-fill-parent background-color-white" style="z-index: 3;padding: 0 16px;">
        <el-header class="flex flex-column flex-center unset-padding">
            <div class="flex" v-if="donationInfo">
                <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                    <div class="flex">
                        <el-button class="unset-padding" type="text" @click="$emit('close')">
                            <i class="iconfont icon-back-parent"></i>
                        </el-button>
                        <div>{{`【${donationInfo.title}】受捐明细`}}</div>
                    </div>
                </div>
                <div class="flex">
                    <span class="lrd-util-style-donation-item">
                        <span>目标金额:</span>
                        <span class="lrd-util-style-donation-item-highlight-area" style="color:#409EFF;font-size: 20px;">{{donationInfo.targetAmount | currency}}</span><span>/元</span>
                      </span>
                    <span class="lrd-util-style-donation-item">
                        <span>已筹集金额:</span>
                        <span class="lrd-util-style-donation-item-highlight-area" style="color:#67C23A;font-size: 20px;">{{(donationInfo.raiseAmount || 0) | currency}}</span><span>/元</span>
                      </span>
                    <span class="lrd-util-style-donation-item">
                        <span>已捐赠人次:</span>
                        <span class="lrd-util-style-donation-item-highlight-area" style="color:#F56C6C;font-size: 20px;">{{donationInfo.donationCount || 0}}</span><span>/次</span>
                      </span>
                </div>
            </div>
        </el-header>
        <el-main class="position-relative unset-padding">
            <el-table size="small" :data="list" class="custom-el-table header-gray" height="100%" border stripe>
                <el-table-column label="捐赠人" width="200">
                    <template v-slot="{row}">
                        <span v-if="row.groupName!=null&&row.groupName!=''" class="content-title">{{row.groupName}}</span>
                        <span v-else class="content-title">{{ (row.isAnonymous||(!row.donationName)) ? "匿名用户" : row.donationName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠金额/元" width="200">
                    <template v-slot="{row}">
                        <span>{{ row.donationAmount | currency}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠时间" width="200">
                    <template v-slot="{row}">
                        <span>{{ row.createTime | yyyyMMddHHmm }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="留言">
                    <template v-slot="{row}">
                        <span>{{ row.comments }}</span>
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
</template>

<script>
    export default {
        name: "OneDonationRecordList",
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
                donationInfo: null
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
                    id: this.donationId,
                    title: this.title,
                    limit: this.page.pageSize,
                    offset: (this.page.pageNum - 1) * this.page.pageSize,
                };
                this.$request.get('/api/admin/onlineDonation/onlineDonationRecord/list', {params}).then((resp) => {
                    let {data} = resp;
                    this.list = data.list;
                    this.total = data.total;
                    this.donationInfo = data.donationInfo;
                })
            },
        },
        created() {
            this.refreshList();
        }
    }
</script>
