<template>
    <el-container style="padding: 0 16px 16px;" class="absolute-fill-parent background-color-white">
        <el-header class="unset-padding flex flex-column flex-center" >
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex">
                    <el-input style="width: 300px;" size="small" v-model="title" clearable placeholder="输入行业名称进行搜索"></el-input>
                </div>
                <div >
                    <el-button size="small" type="primary" @click="newIndustry">新增行业</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <el-draggable-table :list="list" :el-table-props="elTableProps" class="custom-el-table header-gray"
                                :options="dragOptions" dragSelector="tbody" @end='sort'>
                <el-table-column class-name="item-un-sort" label="序号" width="50" type="index" align="center"/>
                <el-table-column class-name="item-un-sort" label="行业名称" prop="title" show-tooltip-when-overflow/>
                <el-table-column class-name="item-un-sort" label="创建时间" width="150px">
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template v-slot="{row}">
                        <el-button class="custom-el-button unset-padding item-un-sort" type="text"
                                   @click="editIndustry(row)">编辑</el-button>
                        <el-button class="custom-el-button danger unset-padding item-un-sort" type="text"
                                   @click="deleteIndustry(row)">删除</el-button>
                        <el-button class="custom-el-button unset-padding item-sort" type="text" >排序</el-button>
                    </template>
                </el-table-column>

            </el-draggable-table>
        </el-main>
        <el-dialog :visible.sync="industryFormVisible" :title="industryFormTitle"
                   append-to-body :close-on-click-modal="false" width="700px">
            <industry-form v-if="industryFormVisible" :industry-info="industryFormInfo" :seq="list.length"
                                    @refresh-list="getList" @close="industryFormVisible=false"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import ElDraggableTable from "../../../../util/elTableDraggable/ElDraggableTable";
    import IndustryForm from "./IndustryForm";
    export default {
        name: "IndustryManage",
        components: {IndustryForm, ElDraggableTable},
        data(){
            return {
                list:[],
                title:'',

                industryFormVisible:false,
                industryFormTitle:'',
                industryFormInfo: {
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
                let idList = [];
                for(let item of this.list){
                    idList.push(item.id);
                }

                this.$request.post('/api/admin/organization/category/orderFields',{idList}).then(()=>{
                    this.$message.success("行业排序成功");
                })
            },
            getList(){
                this.$request.get('/api/admin/organization/category/listOrganizationCategory',{
                    params:{searchTitle: this.title}
                }).then(res=>{
                    this.list = res.data;
                })
            },
            newIndustry(){
                this.industryFormInfo = {
                    title: '',
                    id: ''
                };
                this.industryFormTitle = '新增行业';
                this.industryFormVisible = true;
            },
            editIndustry(row){
                this.industryFormInfo = {
                    title: row.title,
                    id: row.id
                };
                this.industryFormTitle = '编辑行业';
                this.industryFormVisible = true;
            },
            deleteIndustry(row){
                this.$msgbox.confirm('删除不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/organization/category/deleteOrganizationCategory',{
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
