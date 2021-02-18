<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex" style="line-height: 60px;">
            <div class="flex-fill-in-the-remaining-space" style="font-size: 16px;">信息对接类型</div>
            <div>
                <el-button icon="el-icon-s-grid" type="text" @click="typeListVisible = true">管理</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <vue-scroll>
                <el-menu class="border-right-unset custom-el-menu" @select="setChosenType" :default-active="chosenType">
                    <el-menu-item index="-1">
                        <span class="text-overflow" style="width: 160px;">全部</span>
                    </el-menu-item>
                    <el-menu-item v-for="item in tableData" :key="item.id" :index="item.id">
                        <i class="iconfont icon-suo" v-if="!item.isUsed"></i>
                        <span class="text-overflow" style="width: 160px;">{{item.title}}</span>
                    </el-menu-item>
                </el-menu>
            </vue-scroll>
        </el-main>
        <!--类型列表弹窗-->
        <el-dialog title="信息对接类型管理" :visible.sync="typeListVisible" :close-on-click-modal="false" append-to-body
                   width="800px"
                   @open="init()">
            <div class="text-align-right">
                <el-button icon="el-icon-plus" size="small" type="primary" plain style="margin-bottom: 20px;"
                           @click="toAdd">添加类型
                </el-button>
            </div>
            <el-table :data="tableData" size="small" class="custom-el-table header-gray" border stripe height="400px"
                      row-key="id">
                <el-table-column label="类型名称" align="center" prop="title" show-tooltip-when-overflow width="120px"/>
                <el-table-column label="描述" align="center" prop="descriptions" show-overflow-tooltip/>
                <el-table-column label="创建时间" align="center" width="130px">
                    <template slot-scope="{row}">
                        <span>{{row.createTime | yyyyMMddHHmm}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否启用" align="center" width="90px">
                    <template slot-scope="{row}">
                        <span v-if="row.isUsed">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150px">
                    <template slot-scope="{row}">
                        <el-button type="text" size="small" class="unset-padding item-sort">排序</el-button>
                        <el-button type="text" size="small" class="unset-padding" @click="toEdit(row)">编辑</el-button>
                        <el-button type="text" size="small" class="unset-padding custom-el-button danger"
                                   @click="toDelete(row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!--编辑添加类型-->
        <el-dialog v-if="formVisible" :title="formTitle" :visible.sync="formVisible" :close-on-click-modal="false"
                   append-to-body
                   width="400px">
            <form-list :seq="seq" :editInfo="editInfo" @refresh="refresh" @close="close"></form-list>
        </el-dialog>
    </el-container>
</template>

<script>
    import FormList from './FormList';
    import Sortable from 'sortablejs';

    export default {
        name: "InformationTypeList",
        components: {FormList},
        data() {
            return {
                chosenType: '-1',//选择的项
                typeListVisible: false,//列表弹窗
                tableData: [],//列表数据
                formVisible: false,//添加编辑弹窗
                formTitle: '添加类型',//添加编辑标题
                seq: 0,//排序
                editInfo: {},//要编辑的信息
            }
        },
        created() {
            this.getDataList();
        },
        watch: {
            chosenType(val) {
                if (val) {
                    let chosenType = {};
                    for (let type of this.tableData) {
                        if (type.id === val) {
                            chosenType = {...type};
                        }
                    }
                    this.$emit('chosen-type', chosenType);
                }
            }
        },
        methods: {
            //获取列表
            getDataList(sort) {
                this.$request.get('/api/admin/informationExchangeClass/getInformationExchangeClasses').then(res => {
                    if (res.success) {
                        this.tableData = res.data;
                        this.seq = this.tableData.length;
                        if (sort) {
                            this.sortFields();
                        }
                    }
                })
            },
            //
            setChosenType(index) {
                this.chosenType = index;
            },
            //添加
            toAdd() {
                this.formVisible = true;
                this.formTitle = '添加类型'
            },
            //编辑
            toEdit(editInfo) {
                this.editInfo = editInfo;
                this.formVisible = true;
                this.formTitle = '编辑类型'
            },
            //删除
            toDelete(val) {
                this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/informationExchangeClass/deleteInformationExchangeClass', {params: {classId: val}}).then(res => {
                        if (res.success) {
                            this.$message.success("删除成功");
                            this.getDataList(true)
                        }
                    })
                }).catch(()=>{})
            },
            //排序
            init() {
                this.$nextTick(function () {
                    this.drag();//拖拽排序
                })
            },
            drag() {
                let table = document.querySelector('.el-dialog__body .el-table__body-wrapper tbody');
                Sortable.create(table, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.tableData));

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
                    fieldList = this.tableData;
                }

                let orderList = fieldList.map(item => {
                    return item.id;
                });

                this.$request.post(
                    '/api/admin/informationExchangeClass/orderFields',
                    {idList: orderList}
                ).then(data => {
                    if (data.success) {
                        if (refresh) {
                            this.$message.success("修改顺序成功");
                            this.tableData = [];
                            setTimeout(() => {
                                this.getDataList();
                            }, 1);
                        }
                    }
                })
            },

            //刷新
            refresh() {
                this.getDataList(true)
            },
            //关闭添加编辑弹窗
            close() {
                this.formVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>
