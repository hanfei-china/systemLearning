<template>
    <el-container>
        <el-main style="padding: 16px 0;">
            <el-form label-width="120px" size="small">
                <el-form-item label="分类名称">
                    <el-input placeholder="请输入分类名称，20字以内" v-model="name"></el-input>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding text-align-right">
            <el-button size="small" type="danger" @click="$emit('close')">取消返回</el-button>
            <el-button size="small" type="primary" @click="saveData">确定保存</el-button>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "CourseTypeForm",
        props: {
            id: String,//编辑的分类id
            parentId: String,//二级分类的父级分类
            type: Number,//判断一级分类还是二级分类
            seq: Number,
        },
        data(){
            return {
                name: '',
                editSeq: null
            }
        },
        created(){
            if(this.id){
                this.getInfo();
            }
        },
        methods: {
            getInfo(){
                this.$request.get('/api/admin/group/getGroup',{params: {
                        id: this.id,
                        maxLevel: 1,
                        operate: 0,
                        type: 9
                    }}).then(res=>{
                        if(res.success){
                            this.name = res.data[0].name;
                            this.editSeq = res.data[0].seq;
                        }
                })
            },
            saveData(){
                if(this.id){
                    this.$request.put('/api/admin/group/updateGroup',{
                        groupType: 0,
                        isFolder: this.type === 2?false:true,
                        name: this.name,
                        parentId: this.type === 2?this.parentId: null,
                        seq: this.editSeq,
                        type: 9,
                        id: this.id
                    }).then(res=>{
                        if(res.success){
                            this.$message.success('分类添加成功');
                            this.$emit("close");
                            this.$emit("refresh");
                        }
                    })
                }else {
                    this.$request.post('/api/admin/group/addGroup',{
                        groupType: 0,
                        isFolder: this.type === 2?false:true,
                        name: this.name,
                        parentId: this.type === 2?this.parentId: null,
                        seq: this.seq,
                        type: 9
                    }).then(res=>{
                        if(res.success){
                            this.$message.success('分类添加成功');
                            this.$emit("close");
                            this.$emit("refresh");
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
