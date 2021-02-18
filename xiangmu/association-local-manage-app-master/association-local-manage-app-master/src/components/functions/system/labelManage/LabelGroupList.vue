<template>
    <el-container v-if="!labelPageVisible" class="absolute-fill-parent">
        <el-header height="auto" class="text-align-right" style="padding: 16px;">
            <el-button size="small" type="primary" @click="createLabelGroup">创建分组</el-button>
        </el-header>
        <el-main style="padding: 0 16px 16px;">
            <el-table :data="list" height="100%" class="custom-el-table header-gray" size="small" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="分组名称" prop="title" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="多选">
                    <template v-slot="{row}">
                        <span v-if="row.isMultiple">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="标签文本长度" prop="textLength"></el-table-column>
                <el-table-column label="标签颜色">
                    <template v-slot="{row}">
                        <el-tag size="mini" :color="row.color" style="color: #ffffff;">颜色</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240px">
                    <template v-slot="{row}">
                        <el-button size="small" type="text" class="unset-padding item-sort">排序</el-button>
                        <el-button size="small" type="text" class="unset-padding" @click="editLabelGroup(row)">编辑</el-button>
                        <el-button size="small" type="text" class="unset-padding custom-el-button danger" @click="deleteLabelGroup(row.id)">删除</el-button>
                        <el-button size="small" type="text" class="unset-padding" @click="viewLabels(row)">查看标签</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :title="labelGroupTitle" :visible.sync="labelGroupVisible" append-to-body
                   :close-on-click-modal="false"
                   width="800px">
            <label-group-form v-if="labelGroupVisible" :type="labelClassType" :seq="labelGroupSeq" :labelGroupInfo="labelGroupInfo"
                              @close="labelGroupVisible = false" @refresh="refresh"></label-group-form>
        </el-dialog>
    </el-container>
    <label-list v-else :labelGroupInfo="viewLabelGroupInfo" @closeLabelList="labelPageVisible = false"></label-list>
</template>

<script>
    import Sortable from 'sortablejs';
    import LabelGroupForm from "./util/LabelGroupForm";
    import LabelList from "./LabelList";

    export default {
        name: "LabelGroupList",
        components: {LabelList, LabelGroupForm},
        props: {
            labelClassId: String,
            labelClassType: Number
        },
        data() {
            return {
                list: [],//列表
                labelGroupSeq: 0,//标签分组排序

                labelGroupTitle: '创建分组',
                labelGroupVisible: false,
                labelGroupInfo: {},//分组信息
                labelPageVisible: false,//查看标签
                viewLabelGroupInfo: {},//查看的标签分组
            }
        },
        watch: {
            labelClassId: {
                handler: function () {
                    this.getList();
                },
                immediate: true
            }
        },
        mounted() {
            this.drag();
        },
        methods: {
            //获取标签分组列表
            getList(sort) {
                this.$request.get('/api/admin/label/manage/getLabelGroupAndLabelByLabelClass', {params: {labelClassId: this.labelClassId}}).then(res => {
                    if (res.success) {
                        this.list = res.data;
                        this.labelGroupSeq = res.data.length;
                        if(sort){
                            this.sortFields();
                        }
                    }
                })
            },
            //创建标签分组
            createLabelGroup(){
                this.labelGroupInfo = {};
                this.labelGroupVisible = true;
                this.labelGroupTitle = '创建分组'
            },
            //编辑标签分组
            editLabelGroup(row) {
                this.labelGroupInfo = row;
                this.labelGroupVisible = true;
                this.labelGroupTitle = '编辑分组'
            },
            //删除标签分组
            deleteLabelGroup(id){
                this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.delete('/api/admin/label/manage/deleteLabelGroup',{params: {labelGroupId: id}}).then(res => {
                        if(res.success){
                            this.$message.success('标签分组已删除');
                            this.refresh();
                        }
                    })
                }).catch(()=>{})
            },
            //刷新
            refresh() {
                this.getList(true);
            },
            //标签分组排序
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

                let groupList = fieldList.map(item => {
                    return item.id;
                });

                if(groupList.length > 0){
                    this.$request.post('/api/admin/order/orderFields', {idList: groupList, tableName: 'association_label_group'}).then(data => {
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
            //查看标签
            viewLabels(row){
                this.viewLabelGroupInfo = row;
                this.labelPageVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>