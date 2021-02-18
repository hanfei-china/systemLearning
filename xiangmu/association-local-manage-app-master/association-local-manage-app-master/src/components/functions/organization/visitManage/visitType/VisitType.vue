<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 0 16px 16px 16px;">
        <el-header class="flex flex-center flex-column unset-padding">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space"></div>
                <div>
                    <el-button type="primary" size="small" @click="addType">增加类型</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border stripe
                      row-key="id">
                <el-table-column label="序号" type="index" width="55px" align="center"/>
                <el-table-column label="名称" prop="name" show-tooltip-when-overflow/>
                <el-table-column label="描述" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.description}" />
                    </template>
                </el-table-column>
                <el-table-column label="是否启用" width="80px" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.isUsed">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否为线上" width="120px" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.isOnline">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px" align="center">
                    <template slot-scope="{row}">
                        <el-button size="small" type="text" class="unset-padding item-sort">排序</el-button>
                        <el-button size="small" type="text" class="unset-padding" @click="editType(row)">编辑</el-button>
                        <el-button size="small" type="text" class="unset-padding custom-el-button danger"
                                   @click="deleteItem(row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :visible.sync="typeVisible" :title="title" width="760px" :close-on-click-modal="false"
                   append-to-body>
            <type-form v-if="typeVisible" :form="typeDetail" :seq="seq" @close="typeVisible = false"
                       @refresh="refresh"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import TypeForm from "./TypeForm";
    import Sortable from 'sortablejs';

    export default {
        name: "VisitType",
        components: {TypeForm},
        data() {
            return {
                list: [],
                typeVisible: false,
                title: '新增跟踪类型',
                typeDetail: null,
            }
        },
        created() {
            this.getList();
        },
        mounted() {
            this.drag();
        },
        methods: {
            getList(sort) {
                this.$request.get('/api/admin/visit/visitType/getVisitTypes').then(res => {
                    if (res.success) {
                        this.list = res.data;
                        if (sort) {
                            this.sortFields();
                        }
                    }
                })
            },
            refresh() {
                this.getList(true);
            },
            addType() {
                this.typeVisible = true;
                this.title = "新增跟踪类型";
                this.typeDetail = null;
            },
            editType(row) {
                this.typeVisible = true;
                this.title = "编辑跟踪类型";
                this.typeDetail = row;
            },
            deleteItem(row) {
                this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/visit/visitType/deleteVisitType', {params: {id: row.id}}).then(res => {
                        if (res.success) {
                            this.$message.success("删除成功");
                            this.getList(true);
                        }
                    })
                }).catch(() => {})
            },
            //排序
            drag() {
                let table = document.querySelector('.el-table__body-wrapper tbody');
                Sortable.create(table, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.list));

                        if (oldIndex < newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex + 1, 0, oldItem);
                            copyValue.splice(oldIndex, 1);
                            this.sortFields(copyValue, true);
                        }

                        if (oldIndex > newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex, 0, oldItem);
                            copyValue.splice(oldIndex + 1, 1);
                            this.sortFields(copyValue, true);
                        }
                    }
                });
            },
            sortFields(fieldList, refresh) {
                if (!fieldList) {
                    fieldList = this.list;
                }

                let orderList = fieldList.map(item => {
                    return item.id;
                });

                if (orderList.length > 0) {
                    this.$request.post('/api/admin/visit/visitType/visitTypeOrder', null, {
                        params: {idList: orderList}
                    }).then(data => {
                        if (data.success) {
                            if (refresh) {
                                this.$message.success("修改顺序成功");
                                this.list = [];
                                setTimeout(() => {
                                    this.getList();
                                }, 1);
                            }
                        }
                    })
                }

            },
        },
        computed: {
            seq: function () {
                return this.list.length;
            }
        }
    }
</script>

<style scoped>

</style>
