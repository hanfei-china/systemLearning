<template>
    <el-container class="absolute-fill-parent" style="padding: 16px;">
        <el-header height="auto" style="padding-bottom: 16px;" class="text-align-right">
            <el-button size="small" type="primary" @click="addRecord">新增产品</el-button>
        </el-header>
        <el-main class="unset-padding">
            <vue-scroll>
                <div style="padding: 0 0 10px;width: 100%;height: auto;" v-for="item in list" :key="item.id">
                    <el-card>
                        <div class="flex">
                            <el-image style="width: 160px;height: 120px;" :src="item.posterUrl"></el-image>
                            <div class="flex-fill-in-the-remaining-space"
                                 style="line-height: 27px;color: #666;padding-left: 20px;">
                                <el-tooltip effect="dark" :content="item.title" placement="top"
                                            style="margin-top: 6px;">
                                    <p class="text-overflow" style="color: #4A4A4A;">{{item.title}}</p>
                                </el-tooltip>
                                <el-tooltip effect="dark" :content="item.brief" placement="top"
                                            style="margin-top: 6px;">
                                    <p class="text-overflow" style="color: #4A4A4A;">{{item.brief}}</p>
                                </el-tooltip>
                                <div>
                                    {{item.contactPerson}}： {{item.contactPhone}}
                                </div>
                                <div class="text-align-right">
                                    <el-button type="text" size="small" class="unset-padding"
                                               @click="editRecord(item.id)">
                                        编辑
                                    </el-button>
                                    <el-button type="text" size="small" class="unset-padding custom-el-button danger"
                                               @click="deleteRecord(item.id)">删除
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </vue-scroll>
        </el-main>
        <el-footer height="auto" style="padding: 16px 0 0;">
            <div class="text-align-right">
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
        <el-dialog :visible.sync="productFormVisible" :title="productFormTitle"
                   append-to-body :close-on-click-modal="false" width="800px">
            <product-form v-if="productFormVisible" :productId="productId" :unitInfo="unitInfo"
                          @close="productFormVisible = false" @refresh="refresh"></product-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import ProductForm from "./ProductForm";

    export default {
        name: "UnitProduct",
        components: {ProductForm},
        props: {
            unitInfo: {
                type: Object
            }
        },
        data() {
            return {
                list: [],
                page: {
                    pageSize: 20,
                    currentPage: 1,
                    total: 0
                },
                productFormVisible: false,
                productFormTitle: '新增企业产品',
                productId: {}
            }
        },
        created() {
            this.getList();
        },
        methods: {
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList();
            },

            getList() {
                this.$request.get('/api/admin/organization/server/getOrganizationServerList', {
                    params: {
                        organizationId: this.unitInfo.id,
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1)
                    }
                }).then(res => {
                    if (res.success) {
                        this.list = res.data.list;
                        this.page.total = res.data.total;
                    }
                })
            },
            addRecord() {
                this.productFormVisible = true;
                this.productFormTitle = '新增产品服务';
                this.productId = '';
            },
            editRecord(id) {
                this.productFormVisible = true;
                this.productFormTitle = '编辑产品服务';
                this.productId = id;
            },
            deleteRecord(id) {
                this.$confirm('此操作将删除这项服务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/organization/server/deleteOrganizationServer', {
                        params: {serverId: id}
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('此产品服务已删除');
                            this.getList();
                        }
                    })
                }).catch(() => {
                })
            },
            refresh() {
                this.page.currentPage = 1;
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>