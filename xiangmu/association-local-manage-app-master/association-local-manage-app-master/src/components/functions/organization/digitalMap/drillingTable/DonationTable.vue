<template>
    <el-container class="background-color-white" style="height: 500px;">
        <el-main class="position-relative unset-padding">
            <el-table size="small" :data="list" class="custom-el-table header-gray" height="100%" border stripe>
                <el-table-column label="序号" type="index" align="center" fixed/>
                <el-table-column label="捐赠项目">
                    <template v-slot="{row}">
                        <span class="content-title">{{ row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠人" width="100">
                    <template v-slot="{row}">
                        <span class="content-title">{{ !row.isAnonymous ? row.name : '匿名用户' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠金额/元" width="150">
                    <template v-slot="{row}">
                        <span>{{ row.donationAmount | currency}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="捐赠时间" width="150">
                    <template v-slot="{row}">
                        <span>{{ row.createTime | yyyyMMddHHmm }}</span>
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
        name: "DonationTable",
        props: ["condition"],
        data() {
            return {
                page: {
                    pageSize: 20,
                    pageNum: 1,
                },
                total: 0,
                list: [],
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
                    province: this.condition.value,
                    columnName: this.condition.columnName,
                    limit: this.page.pageSize,
                    offset: (this.page.pageNum - 1) * this.page.pageSize,
                };
                this.$request.get('/api/admin/onlineDonation/onlineDonationRecord/areaList', {params}).then((resp) => {
                    let {data} = resp;
                    this.list = data.list;
                    this.total = data.total;
                })
            },
        },
        created() {
            this.refreshList();
        }
    }
</script>
