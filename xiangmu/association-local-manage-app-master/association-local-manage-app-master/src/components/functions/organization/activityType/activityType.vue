<template>
    <el-container style="padding: 0 16px 16px;" class="absolute-fill-parent background-color-white">
        <el-header class="unset-padding flex flex-column flex-center">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex">
                    <el-input style="width: 300px;" size="small" v-model="name" clearable
                              placeholder="输入类型名称进行搜索"></el-input>
                </div>
                <div>
                    <el-button size="small" type="primary" @click="addType">新增类型</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <el-table size="small" border stripe class="custom-el-table header-gray" height="100%" :data="list">
                <el-table-column label="序号" width="50" align="center" type="index"/>
                <el-table-column label="类型名称" prop="name" show-overflow-tooltip/>
                <el-table-column label="操作" width="120px">
                    <template v-slot="{row}">
                        <el-button class="unset-padding" size="small" type="text" @click="editType(row)">编辑</el-button>
                        <el-button class="unset-padding item-sort" size="small" type="text">排序</el-button>
                        <el-button class="custom-el-button danger unset-padding" size="small" type="text" @click="deleteType(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :visible.sync="typeVisible" :title="visibleTitle" append-to-body :close-on-click-modal="false" width="800px">
            <active-type-form v-if="typeVisible" :isMain="isMain" :id="typeId" :copySeq="seq" @close="close" @refresh="refresh"></active-type-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import Sortable from 'sortablejs';
    import ActiveTypeForm from "../../tools/activity/activityType/ActiveTypeForm";
    export default {
        name: "ActivityType",
        components: {ActiveTypeForm},
        data() {
            return {
                list: [],
                name: '',
                visibleTitle: '新增类型',
                typeVisible: false,
                typeId: '',
                seq: 0,
                branchId:'',
                isMain:true
            }
        },
        created() {
            this.branchId=this.$route.params.branchId;
            if (this.branchId!=='all') {
                this.isMain=false;
            }
            this.getList();
        },
        mounted() {
            this.drag();
        },
        watch: {
            name() {
                this.getList();
            }
        },
        methods: {
            getList(sort) {
                this.$request.get('/api/admin/group/getCategoryNameAndIdByName', {
                    params: {
                        name: this.name,
                        type: 3,
                        isMain:this.isMain
                    }
                }).then(res => {
                    if (res.success) {
                        this.list = res.data;
                        this.seq = res.data.length;
                        if(sort){
                            this.sortFields();
                        }
                    }
                })
            },
            addType(){
                this.typeVisible = true;
                this.visibleTitle = '新增类型';
                this.typeId = '';
            },
            editType(row){
                this.typeVisible = true;
                this.visibleTitle = '编辑类型';
                this.typeId = row.id;
            },
            deleteType(id){
                this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.delete('/api/admin/group/deleteGroup',{params: {
                            id: id
                        }}).then(() => {
                        this.$message.success('删除成功');
                        this.getList(true);
                    })
                }).catch(()=>{})
            },
            close(){
                this.typeVisible = false;
            },
            refresh(){
                this.getList(true);
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

                if(orderList.length > 0){
                    this.$request.post('/api/admin/group/orderGroup', null, {params: {ids: orderList}}).then(data => {
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