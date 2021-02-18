<template>
    <el-container class="background-color-white absolute-fill-parent" style="padding: 0 20px;">
        <el-header class="text-align-right" style="padding: 14px 0 0;">
            <el-button size="small" type="primary" @click="addClass">添加分类</el-button>
        </el-header>
        <el-main style="padding:0 0 10px;">
            <el-table size="small" :data="list" class="custom-el-table header-gray" height="100%" border stripe
                      row-key="id">
                <el-table-column label="序号" type="index" width="55px" align="center"/>
                <el-table-column label="名称" prop="title" show-tooltip-when-overflow/>
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
                <el-table-column label="操作" width="150px" align="center">
                    <template slot-scope="{row}">
                        <el-button size="small" type="text" class="unset-padding item-sort">排序</el-button>
                        <el-button size="small" type="text" class="unset-padding" @click="editClass(row)">编辑</el-button>
                        <el-button size="small" type="text" class="unset-padding custom-el-button danger"
                                   @click="deleteItem(row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body
                   :close-on-click-modal="false" width="400px">
            <class-form v-if="dialogVisible" :seq="seq" :itemInfo="itemInfo" @close="closeDialog"
                        @refresh="refresh"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import ClassForm from './ClassForm';
    import Sortable from 'sortablejs';

    export default {
        name: "TypeManage",
        components: {ClassForm},
        data() {
            return {
                list: [],//分类列表
                dialogVisible: false,//弹窗
                title: '添加分类',//弹窗名称
                seq: 0,//排序
                itemInfo: {},//分类信息
            }
        },
        created() {
            this.getList();
        },
        mounted() {
            this.drag();
        },
        methods: {
            addClass() {
                this.title = '添加分类';
                this.dialogVisible = true;
                this.itemInfo = '';
            },
            editClass(item) {
                this.title = '编辑分类';
                this.dialogVisible = true;
                this.itemInfo = item;
            },
            //获取分类列表
            getList(sort) {
                this.$request.get('/api/admin/counsel/messageCategory/getCounselMessageCategories').then(res => {
                    if (res.success) {
                        this.list = res.data.list;
                        this.seq = res.data.list.length;
                        if (sort) {
                            this.sortFields();
                        }
                    }
                })
            },
            //删除
            deleteItem(item) {
                this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/counsel/messageCategory/deleteCounselMessageCategory', {
                        params: {
                            categoryId: item.id
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.getList(true);
                        }
                    })
                }).catch(()=>{})
            },
            //关闭弹窗
            closeDialog() {
                this.dialogVisible = false;
            },
            //刷新
            refresh() {
                this.getList(true);
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
                    this.$request.post('/api/admin/counsel/messageCategory/counselMessageCategoryOrder', null, {
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
        }
    }
</script>
