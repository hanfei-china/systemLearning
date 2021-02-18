<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header style="line-height: 60px;">
            <div class="text-align-right">
                <el-button size="small" type="primary" @click="toAdd">添加分类</el-button>
            </div>
        </el-header>
        <el-main style="padding: 0 20px 20px;">
            <el-table size="small" :data="goodsClassList" class="custom-el-table header-gray" height="100%" border
                      stripe row-key="id">
                <el-table-column label="序号" type="index" width="55px" align="center"/>
                <el-table-column label="名称" prop="title" width="200px" show-overflow-tooltip/>
                <el-table-column label="描述" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.description}" />
                    </template>
                </el-table-column>
                <el-table-column label="是否启用" align="center" width="80px">
                    <template slot-scope="{row}">
                        <span v-if="row.isUsed">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150px">
                    <template slot-scope="{row}">
                        <el-button type="text" size="small" class="unset-padding item-sort">排序</el-button>
                        <el-button type="text" size="small" class="unset-padding" @click="toUpdate(row)">编辑</el-button>
                        <el-button type="text" size="small" class="unset-padding custom-el-button danger"
                                   @click="toDelete(row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :title="dialogTitle" :visible.sync="goodsClassFormDialog" append-to-body
                   :close-on-click-modal="false" width="400px">
            <goods-class-form v-if="goodsClassFormDialog" :seq="seq" :editForm="editForm" @close="closeDialog"
                              @refresh="refresh"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import Sortable from 'sortablejs';
    import GoodsClassForm from './GoodsClassForm';

    export default {
        name: "GoodsClassManage",
        components: {GoodsClassForm},
        data() {
            return {
                goodsClassList: [],//商品分类列表
                goodsClassFormDialog: false,//添加或编辑商品分类
                dialogTitle: '添加分类',//弹窗title
                seq: 0,//排序
                editForm: '',//要编辑的项
            }
        },
        created() {
            this.getGoodsClassList();
            this.$nextTick(function () {
                this.drag();//拖拽排序
            })
        },
        methods: {
            //获取商品分类
            getGoodsClassList(sort) {
                this.$request.get('/api/admin/goods/category/getGoodsCategory').then(res => {
                    if (res.success) {
                        this.goodsClassList = res.data;
                        this.seq = this.goodsClassList.length;
                        if(sort){
                            this.sortFields();
                            // this.getGoodsClassList();
                        }
                    }
                })
            },
            //添加分类
            toAdd() {
                this.goodsClassFormDialog = true;
                this.dialogTitle = '添加分类';
                this.editForm = '';
            },
            //编辑
            toUpdate(val) {
                this.goodsClassFormDialog = true;
                this.dialogTitle = '编辑分类';
                this.editForm = val;
            },
            //删除
            toDelete(val) {
                this.$confirm('确定删除该分类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/goods/category/deleteGoodsCategory', {params: {id: val}}).then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.getGoodsClassList(true);
                        }
                    })
                }).catch(()=>{});
            },
            //关闭弹窗
            closeDialog() {
                this.goodsClassFormDialog = false;
            },
            //刷新
            refresh() {
                this.goodsClassFormDialog = false;
                this.getGoodsClassList(true);
            },
            //排序
            drag() {
                let table = document.querySelector('tbody');
                Sortable.create(table, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.goodsClassList));

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
                    fieldList = this.goodsClassList;
                }

                let orderList = fieldList.map(item => {
                    return item.id;
                });

                if(orderList.length > 0){
                    this.$request.post('/api/admin/goods/category/orderFields', {idList: orderList}).then(data => {
                        if (data.success) {
                            if (refresh) {
                                this.$message.success("修改顺序成功");
                                this.goodsClassList = [];
                                setTimeout(() => {
                                    this.getGoodsClassList();
                                }, 1);
                            }
                        }
                    })
                }

            },
        }
    }
</script>

<style scoped>

</style>
