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
            <el-draggable-table :list="list" :el-table-props="elTableProps" dragSelector="tbody" @end='sort'
                                class="custom-el-table header-gray" :options="dragOptions" >
                <el-table-column label="序号" width="50" align="center" type="index" class-name="item-un-sort"/>
                <el-table-column label="分类名称" prop="title" show-tooltip-when-overflow class-name="item-un-sort"/>
                <el-table-column class-name="item-un-sort" label="分类备注" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.description}" />
                    </template>
                </el-table-column>
                <el-table-column class-name="item-un-sort" label="会员权限校验" width="150px">
                    <template v-slot="{row}">
                        {{row.isOpenMemberPrivilege ? '已开启' : '未开启'}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="150px">
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template v-slot="{row}">
                        <el-button class="custom-el-button primary unset-padding item-sort" type="text">排序</el-button>
                        <el-button class="custom-el-button unset-padding" type="text"
                                   @click="editClass(row.id)">编辑</el-button>
                        <el-button class="custom-el-button danger unset-padding" type="text"
                                   @click="deleteClass(row)">删除</el-button>
                        <el-button class="custom-el-button unset-padding" type="text"
                                   @click="labelManage(row.id)">标签管理</el-button>
                    </template>
                </el-table-column>
            </el-draggable-table>
        </el-main>
        <el-dialog :visible.sync="classFormVisible" :title="classFormTitle"
                   append-to-body :close-on-click-modal="false" width="700px">
            <content-class-form v-if="classFormVisible" :id="classFormId" :seq="list.length"
                                @refresh-list="getList" @close="classFormVisible=false"/>
        </el-dialog>
        <el-dialog :visible.sync="labelManageVisible" title="标签管理"
                   append-to-body :close-on-click-modal="false" width="800px">
            <content-label-manage :class-id="labelClassId" v-if="labelManageVisible"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import ContentClassForm from "./ContentClassForm";
    import ContentLabelManage from "../contentLabelManage/ContentLabelManage";
    import ElDraggableTable from "../../../../util/elTableDraggable/ElDraggableTable";
    export default {
        name: "ContentClassManage",
        components: {ElDraggableTable, ContentLabelManage, ContentClassForm},
        data(){
            return {
                list:[],
                title:'',

                classFormVisible:false,
                classFormTitle:'',
                classFormId: null,

                labelClassId: null,
                labelManageVisible: false,

                elTableProps:{
                    height: "100%",
                    size: "small",
                    border: true,
                    stripe: true
                },
                dragOptions: {
                    filter: '.item-un-sort',
                    draggable: '.el-table__row',
                    animation: 150
                },
            }
        },
        methods:{
            getList(){
                this.$request.get('/api/admin/contentClass/list',{
                    params:{title: this.title}
                }).then(res=>{
                    this.list = res.data;
                })
            },
            newClass(){
                this.classFormId = null;
                this.classFormTitle = '新增分类';
                this.classFormVisible = true;
            },
            editClass(id){
                this.classFormId = id;
                this.classFormTitle = '编辑分类';
                this.classFormVisible = true;
            },
            deleteClass(row){
                this.$msgbox.confirm('删除操作将删除此分组及该分组下的所有内容，且此操作不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/contentClass',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.getList();
                            this.$message.success(`【${row.title}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            },
            labelManage(id){
                this.labelClassId = id;
                this.labelManageVisible = true;
            },
            sort(){
                let ids = [];
                for(let item of this.list){
                    ids.push(item.id);
                }

                this.$request.put('/api/admin/contentClass/sort',{ids}).then(()=>{
                    this.$message.success("分类排序成功");
                })
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
