<template>
    <el-container style="height: 416px;">
        <el-header class="unset-padding text-align-right" height="46px">
            <el-button size="small" @click="addType"> + 添加类型</el-button>
        </el-header>
        <el-main class="unset-padding position-relative">
            <el-table class="custom-el-table header-gray" stripe ref="table" :data="branchTypes" height="352px" border size="small">
                <el-table-column label="序号" width="50">
                    <template v-slot="{$index}">
                        <div class="text-align-center">
                            {{$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="类型名称" prop="name" width="140px"></el-table-column>
                <el-table-column label="描述" prop="description"></el-table-column>
                <el-table-column label="是否启用" width="100px">
                    <template slot-scope="{row}">
                        {{row.isUsed ? '已启用' : '未启用'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220px">
                    <template slot-scope="{row}">
                        <el-button size="mini"
                                   class="item-sort">排序
                        </el-button>
                        <el-button size="mini"
                                   @click="edit(row)">编辑
                        </el-button>
                        <el-button size="mini" type="danger"
                                   @click="deleteType(row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>

        <el-dialog :title="dialogTitle" :visible.sync="dialogShow" append-to-body :close-on-click-modal="false" width="640px">
            <branch-type-form v-if="dialogShow" :data="branchType"
                              @close="dialogShow = false" @refresh-types="getBranchTypes"></branch-type-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import Sortable from 'sortablejs';
    import BranchTypeForm from './BranchTypeForm';


    export default {
        name: "BranchTypeManage",
        components: {BranchTypeForm},
        data() {
            return {
                branchTypes: [],
                dialogShow: false,
                branchType: undefined
            }
        },
        computed: {
            dialogTitle() {
                if (this.branchType) {
                    return '编辑类型'
                } else {
                    return '新增类型'
                }
            }
        },
        methods: {
            getBranchTypes() {
                this.$request.get('/api/admin/branchType/getBranchTypeInfos').then(res=>{
                    if (res.success) {
                        this.branchTypes = res.data;
                        this.drag();
                    }
                })
            },
            drag() {
                let el = this.$refs.table.$el.querySelectorAll('table > tbody')[0];
                Sortable.create(el, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.branchTypes));

                        if (oldIndex < newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex + 1, 0, oldItem);
                            copyValue.splice(oldIndex, 1);
                            this.submitSort(copyValue);
                        }

                        if (oldIndex > newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex, 0, oldItem);
                            copyValue.splice(oldIndex + 1, 1);
                            this.submitSort(copyValue);
                        }
                    }
                });
            },
            submitSort(types) {
                let idList = [];
                for (let i = 0; i < types.length; i++) {
                    idList.push(types[i].id);
                }

                this.$request.post('/api/admin/branchType/orderTypeList',null,{params:{idList}}).then(res=>{
                    if (res.success) {
                        this.$message.success("排序成功");
                        this.branchTypes= [];
                        this.getBranchTypes();
                    }
                })
            },
            addType() {
                this.branchType = undefined;
                setTimeout(() => {
                    this.dialogShow = true;
                }, 10);
            },
            edit(row) {
                this.branchType = row;
                setTimeout(() => {
                    this.dialogShow = true;
                }, 10);

            },
            deleteType(row) {
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/branchType/deleteBranchType',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.$message.success(`${row.name}已删除`);
                            this.getBranchTypes();
                        }
                    })
                }).catch(()=>{});
            },
        },
        created() {
            this.getBranchTypes();
        }
    }
</script>
