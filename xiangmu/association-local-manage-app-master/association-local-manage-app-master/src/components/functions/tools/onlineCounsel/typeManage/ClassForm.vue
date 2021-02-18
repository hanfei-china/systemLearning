<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form label-width="100px" size="small">
                <el-form-item label="分类名称：" :rules="{required:true,message:'请输入主题名称',trigger:'blur'}">
                    <el-input v-model="title"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model="description"></el-input>
                </el-form-item>
                <el-form-item label="启用：">
                    <el-switch active-color="#13ce66" v-model="isUsed"></el-switch>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex flex-center flex-column unset-padding" height="auto"
                   style="padding-top: 16px !important;">
            <div class="flex flex-end">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="saveClass">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "ClassForm",
        props: ['seq','itemInfo'],
        data(){
            return {
                description: '',//描述
                isUsed: false,//是否启用
                title: '',//名称
            }
        },
        created(){
            if(this.itemInfo){
                this.description = this.itemInfo.description;
                this.isUsed = this.itemInfo.isUsed;
                this.title = this.itemInfo.title;
            }
        },
        methods: {
            //新增分类
            saveClass(){
                if(this.itemInfo){
                    this.$request.put('/api/admin/counsel/messageCategory/updateCounselMessageCategory',{
                        categoryId: this.itemInfo.id,
                        description: this.description,
                        isUsed: this.isUsed,
                        title: this.title
                    }).then(res =>{
                        if(res.success){
                            this.$message.success('修改成功');
                            this.$emit('close');
                            this.$emit('refresh')
                        }
                    })
                }else {
                    this.$request.post('/api/admin/counsel/messageCategory/addCounselMessageCategory',{
                        description: this.description,
                        isUsed: this.isUsed,
                        title: this.title,
                        seq: this.seq
                    }).then(res => {
                        if(res.success){
                            this.$message.success('添加成功');
                            this.$emit('close');
                            this.$emit('refresh')
                        }
                    })
                }

            }
        }
    }
</script>

<style scoped>

</style>