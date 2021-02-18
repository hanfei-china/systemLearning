<template>
    <el-container class="absolute-fill-parent">
        <el-header height="auto" class="flex" style="padding: 16px;">
            <div class="flex-fill-in-the-remaining-space" style="height: 32px;">
                <el-page-header style="line-height: 32px;" @back="backtoLabelGroup" :content="labelGroupInfo.title"></el-page-header>
            </div>
            <div>
                <el-button size="small" type="primary" @click="createLabel">创建标签</el-button>
            </div>
        </el-header>
        <el-main style="padding: 0 16px 16px;">
            <el-table :data="list" height="100%" class="custom-el-table header-gray" size="small" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="标签名称" prop="title" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="操作" width="240px">
                    <template v-slot="{row}">
                        <el-button size="small" type="text" class="unset-padding item-sort">排序</el-button>
                        <el-button size="small" type="text" class="unset-padding" @click="editLabel(row)">编辑</el-button>
                        <el-button size="small" type="text" class="unset-padding custom-el-button danger" @click="deleteLabel(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :title="labelFormTitle" :visible.sync="labelFormVisible" append-to-body :close-on-click-modal="false"
                   width="800px">
            <label-form v-if="labelFormVisible" :labelInfo="labelInfo" :labelGroupId="labelGroupId"
                        :labelLength="labelLength" :seq="seq"
                        @close="labelFormVisible = false" @refresh="getList(true)"></label-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import Sortable from 'sortablejs';
    import LabelForm from "./util/LabelForm";
    export default {
        name: "LabelList",
        components: {LabelForm},
        props: {
            labelGroupInfo: Object
        },
        data(){
            return {
                list: [],//标签列表
                labelGroupId: null,//标签分组id

                labelFormTitle: '创建标签',
                labelFormVisible: false,
                labelInfo: {},//标签信息
                labelLength: '',//标签长度
                seq: 0,//排序
            }
        },
        watch: {
            labelGroupInfo: {
                handler: function () {
                    this.labelGroupId = this.labelGroupInfo.id;
                    this.labelLength = this.labelGroupInfo.textLength
                    this.getList();
                },
                immediate: true
            }
        },
        mounted() {
            this.drag();
        },
        methods: {
            getList(sort){
                this.$request.get('/api/admin/label/manage/getGroupAndLabels',{params: {labelGroupId: this.labelGroupId}}).then(res => {
                    if(res.success){
                        this.list = res.data;
                        this.seq = res.data.length;
                        if(sort){
                            this.sortFields();
                        }
                    }
                })
            },
            //创建标签
            createLabel(){
                this.labelFormTitle = '创建标签';
                this.labelFormVisible = true;
                this.labelInfo = {}
            },
            //编辑标签
            editLabel(row){
                this.labelFormTitle = '编辑标签';
                this.labelFormVisible = true;
                this.labelInfo = row;
            },
            //删除标签
            deleteLabel(id){
                this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.delete('/api/admin/label/manage/deleteLabel',{params: {labelId: id}}).then(res=>{
                        if(res.success){
                            this.$message.success('标签已删除');
                            this.getList(true);
                        }
                    })
                })
            },
            backtoLabelGroup(){
                this.$emit('closeLabelList')
            },
            //标签排序
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

                let labelList = fieldList.map(item => {
                    return item.id;
                });

                if(labelList.length > 0){
                    this.$request.post('/api/admin/order/orderFields', {idList: labelList, tableName: 'association_label'}).then(data => {
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

<style scoped>

</style>