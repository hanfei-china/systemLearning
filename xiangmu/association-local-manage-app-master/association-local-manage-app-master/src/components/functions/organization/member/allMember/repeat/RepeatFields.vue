<template>
    <el-container>
        <el-main class="unset-padding">
            <el-container v-if="!repeatItemsVisible">
                <el-main>
                    <el-checkbox-group v-model="checkedIdList">
                        <el-checkbox v-for="item in fieldsList" :key="item.id" :label="item.code">{{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-main>
                <el-footer class="flex flex-column flex-center">
                    <div class="text-align-right">
                        <el-button size="small" type="danger" icon="el-icon-circle-close" @click="$emit('close')">取消
                        </el-button>
                        <el-button size="small" type="primary" icon="el-icon-search"
                                   :disabled="checkedIdList.length === 0" @click="getRepeatItems">查询
                        </el-button>
                    </div>
                </el-footer>
            </el-container>
            <el-container v-else>
                <el-header class="text-align-right" height="auto" style="padding: 0 0 16px;">
                    <el-page-header @back="repeatItemsVisible = false" content="重复数据"/>
                </el-header>
                <el-main class="unset-padding">
                    <el-table :data="repeatItems" height="361px" class="custom-el-table header-gray lrd-el-table" stripe border
                              size="small">
                        <el-table-column type="index" label="序号" width="55" align="center" fixed/>
                        <el-table-column width="55" align="center" fixed label="数量" prop="count"/>
                        <el-table-column v-for="item in checkedList" :key="item.id" :label="item.name"
                                         :prop="item.code" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="操作" width="80px" fixed="right" align="center">
                            <template v-slot="{row}">
                                <el-button type="text" size="small" class="unset-padding" @click="toDetail(row)">立即处理
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer class="flex flex-column flex-center" height="auto" style="padding: 10px 0 0;">
                    <div class="text-align-right">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="page.currentPage"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="page.pageSize" background size="small"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="page.total">
                        </el-pagination>
                    </div>
                </el-footer>
            </el-container>
            <el-dialog title="选择待合并数据" append-to-body :close-on-click-modal="false" :show-close="false"
                       :visible.sync="repeatDataVisible" width="800px">
                <repeat-list v-if="repeatDataVisible" :repeatInfo="repeatInfo" :memberFieldList="memberFieldList"
                             @close="repeatDataVisible = false" @refresh="getRepeatItems"/>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import RepeatList from "./RepeatList";

    export default {
        name: "RepeatFields",
        components: {RepeatList},
        props: ['memberFieldList'],
        data() {
            return {
                fieldsList: [],
                checkedList: [],
                checkedIdList: [],

                repeatItemsVisible: false,
                repeatItems: [],
                page: {
                    pageSize: 20,
                    currentPage: 1,
                    total: 0
                },

                repeatInfo: {},
                repeatDataVisible: false,
            }
        },
        created() {
            this.getFields();
        },
        methods: {
            getFields() {
                this.$request.get('/api/admin/member/getMemberFieldsExceptDetailTable').then(res => {
                    if (res.success) {
                        this.fieldsList = res.data;
                    }
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getRepeatItems();
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getRepeatItems();
            },
            getRepeatItems() {
                this.repeatItemsVisible = true;
                this.checkedList = [];

                for (let item of this.checkedIdList) {
                    for (let field of this.fieldsList) {
                        if (item === field.code) {
                            this.checkedList.push(field);
                        }
                    }
                }

                this.$request.get('/api/admin/member/getRepeatMemberDataByRepeatItems', {
                    params: {
                        codes: this.checkedIdList,
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1)
                    }
                }).then(res => {
                    if (res.success) {
                        this.repeatItems = res.data.list;
                        this.page.total = res.data.total;
                    }
                })
            },
            toDetail(row) {
                this.repeatDataVisible = true;
                this.repeatInfo = row;
            },
        }
    }
</script>
