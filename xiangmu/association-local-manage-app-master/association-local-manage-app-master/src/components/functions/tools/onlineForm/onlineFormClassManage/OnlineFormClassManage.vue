<template>
    <el-container style="padding: 0 16px 16px;" class="absolute-fill-parent background-color-white">
        <el-header class="unset-padding flex flex-column flex-center" >
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex">
                    <el-input style="width: 300px;" size="small" v-model="title" clearable placeholder="输入分类名称进行搜索"/>
                </div>
                <div >
                    <el-button size="small" type="primary" @click="newClass">新增分类</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <el-draggable-table :list="list" :el-table-props="elTableProps" class="custom-el-table header-gray"
                                :options="dragOptions" dragSelector="tbody" @end='sort'>
                <el-table-column class-name="item-un-sort" type="index" align="center" label="序号" width="50"/>
                <el-table-column class-name="item-un-sort" label="分类名称" prop="title" show-tooltip-when-overflow/>
                <el-table-column class-name="item-un-sort" label="分类备注" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.description}" />
                    </template>
                </el-table-column>
                <el-table-column class-name="item-un-sort" label="创建时间" width="150px">
                    <template slot-scope="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="{row}">
                        <el-button class="custom-el-button unset-padding item-un-sort" type="text"
                                   @click="editClass(row)">编辑</el-button>
                        <el-button class="custom-el-button danger unset-padding item-un-sort" type="text"
                                   @click="deleteClass(row)" v-if="row.deletePower">删除</el-button>
                        <el-button class="custom-el-button unset-padding item-sort" type="text" >排序</el-button>
                    </template>
                </el-table-column>

            </el-draggable-table>
        </el-main>
        <el-dialog :visible.sync="classFormVisible" :title="classFormTitle"
                   append-to-body :close-on-click-modal="false" width="700px">
            <online-form-class-form v-if="classFormVisible" :class-info="classFormInfo" :seq="list.length"
                                @refresh-list="getList" @close="classFormVisible=false"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import OnlineFormClassForm from "./OnlineFormClassForm";
    import ElDraggableTable from "../../../../util/elTableDraggable/ElDraggableTable";
    export default {
        name: "OnlineFormClassManage",
        components: {ElDraggableTable, OnlineFormClassForm},
        data(){
            return {
                list:[],
                title:'',

                classFormVisible:false,
                classFormTitle:'',
                classFormInfo: {
                    title: '',
                    description: '',
                    id: ''
                },
                dragOptions: {
                    filter: '.item-un-sort',
                    draggable: '.el-table__row',
                    animation: 150
                },
                elTableProps:{
                    height: "100%",
                    size: "small",
                    border: true,
                    stripe: true
                }
            }
        },
        methods:{
            sort(){
                let ids = [];
                for(let item of this.list){
                    ids.push(item.id);
                }

                this.$request.put('/api/admin/onlineFormClass/sort',{ids}).then(()=>{
                    this.$message.success("分类排序成功");
                })
            },
            getList(){
                this.$request.get('/api/admin/onlineFormClass/list',{
                    params:{title: this.title}
                }).then(res=>{
                    this.list = res.data;
                })
            },
            newClass(){
                this.classFormInfo = {
                    title: '',
                    description: '',
                    id: ''
                };
                this.classFormTitle = '新增分类';
                this.classFormVisible = true;
            },
            editClass(row){
                this.classFormInfo = {
                    title: row.title,
                    description: row.description,
                    id: row.id
                };
                this.classFormTitle = '编辑分类';
                this.classFormVisible = true;
            },
            deleteClass(row){
                this.$msgbox.confirm('删除不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/onlineFormClass',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.getList();
                            this.$message.success(`【${row.title}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            },
        },
        created(){
            this.getList();
        },
        watch:{
            title(){
                this.getList();
            }
        }
    }
</script>
