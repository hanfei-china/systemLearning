<template>
    <el-container>
        <el-header class="unset-padding flex" height="auto">
            <div class="flex-fill-in-the-remaining-space flex">
                <el-input style="width: 300px;" size="small" clearable v-model="title" placeholder="输入标签名称进行搜索"></el-input>
            </div>
            <div >
                <el-button size="small" type="primary" @click="newLabel">新增标签</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding" style="padding-top: 16px !important;">
            <el-table size="small" height="400px" border stripe class="custom-el-table header-gray" :data="list">
                <el-table-column label="序号" width="50">
                    <template v-slot="{$index}">
                        <div class="text-align-center">
                            {{$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="标签名称" prop="title" show-tooltip-when-overflow/>
                <el-table-column label="创建时间" width="150px">
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template v-slot="{row}">
                        <el-button class="custom-el-button unset-padding" type="text"
                                   @click="editLabel(row.id)">编辑</el-button>
                        <el-button class="custom-el-button danger unset-padding" type="text"
                                   @click="deleteLabel(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :visible.sync="labelFormVisible" :title="labelFormTitle"
                   append-to-body :close-on-click-modal="false" width="700px">
            <content-label-form v-if="labelFormVisible" :id="labelFormId" :seq="list.length" :class-id="classId"
                                @refresh-list="getList" @close="labelFormVisible=false"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import ContentLabelForm from "./ContentLabelForm";
    export default {
        name: "ContentLabelManage",
        components: {ContentLabelForm},
        props:{
            classId: String
        },
        data(){
            return {
                title: '',
                list: [],

                labelFormVisible: false,
                labelFormId: null,
                labelFormTitle: ''
            }
        },
        methods:{
            getList(){
                if(this.classId){
                    this.$request.get('/api/admin/contentLabel/list',{
                        params:{title: this.title,classId: this.classId}
                    }).then(res=>{
                        this.list = res.data;
                    })
                }
            },
            newLabel(){
                this.labelFormId = null;
                this.labelFormTitle = '新增标签';
                this.labelFormVisible = true;
            },
            editLabel(id){
                this.labelFormId = id;
                this.labelFormTitle = '编辑标签';
                this.labelFormVisible = true;
            },
            deleteLabel(row){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/contentLabel',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.getList();
                            this.$message.success(`【${row.title}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            }
        },
        created(){
            this.getList();
        },
        watch:{
            title(){
                this.getList();
            },
            classId(){
                this.getList();
            }
        }
    }
</script>
