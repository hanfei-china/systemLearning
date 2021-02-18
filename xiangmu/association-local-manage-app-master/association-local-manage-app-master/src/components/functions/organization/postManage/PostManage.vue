<template>
    <el-container style="padding: 16px;" class="absolute-fill-parent background-color-white">
        <el-header class="unset-padding flex" style="padding-bottom: 16px !important;" height="auto">
            <div class="flex-fill-in-the-remaining-space flex">
                <el-input style="width: 300px;" size="small" v-model="title" clearable placeholder="输入职务名称进行搜索"/>
            </div>
            <div >
                <el-button size="small" type="primary" @click="newClass">新增职务</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <el-draggable-table :list="list" :el-table-props="elTableProps" class="custom-el-table header-gray"
                                :options="dragOptions" dragSelector="tbody" @end='sort'>
                <el-table-column class-name="item-un-sort" label="序号" width="50" type="index" align="center"/>
                <el-table-column class-name="item-un-sort" label="职务名称" width="200">
                    <template v-slot="{row}">
                        <el-tooltip v-show="row.isSystem" class="item" effect="dark" content="系统内置职务" placement="top">
                            <i class="el-icon-lock"/>
                        </el-tooltip>
                        {{row.postName}}
                    </template>
                </el-table-column>
                <el-table-column class-name="item-un-sort" label="职务备注" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.postDescription}" />
                    </template>
                </el-table-column>
                <el-table-column class-name="item-un-sort" label="创建时间" width="150px">
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template v-slot="{row}">
                        <el-button class="custom-el-button primary unset-padding item-sort" type="text">排序</el-button>
                        <el-button class="item-un-sort custom-el-button unset-padding" type="text"
                                   @click="editPost(row.id)">编辑</el-button>
                        <el-button class="item-un-sort custom-el-button danger unset-padding" v-show="!row.isSystem" type="text"
                                   @click="deletePost(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-draggable-table>
        </el-main>
        <el-dialog :visible.sync="formVisible" :title="formTitle"
                   append-to-body :close-on-click-modal="false" width="700px">
            <post-form :id="formId" v-if="formVisible" :seq="seq"
                       @refresh-list="getList" @close="formVisible=false"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import PostForm from "./PostForm";
    import ElDraggableTable from "../../../util/elTableDraggable/ElDraggableTable";
    export default {
        name: "PostManage",
        components: {ElDraggableTable, PostForm},
        data(){
            return {
                list:[],
                title:'',

                formVisible:false,
                formTitle:'',
                formId: null,

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
            getList(){
                this.$request.get('/api/admin/post/list',{
                    params:{postName: this.title}
                }).then(res=>{
                    this.list = res.data;
                })
            },
            newClass(){
                this.formId = null;
                this.formTitle = '新增职务';
                this.formVisible = true;
            },
            editPost(id){
                this.formId = id;
                this.formTitle = '编辑职务';
                this.formVisible = true;
            },
            deletePost(row){
                this.$msgbox.confirm('该操作将删除此职务，并将已拥有该职务的会员的职务变更为系统默认职务，此操作不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/post',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.getList();
                            this.$message.success(`【${row.postName}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            },
            sort(){
                let idList = [];
                for(let item of this.list){
                    idList.push(item.id);
                }

                this.$request.post('/api/admin/post/orderPost',idList).then(()=>{
                    this.$message.success("分类排序成功");
                })
            },
        },
        computed:{
            seq(){
                return this.list.length;
            }
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
