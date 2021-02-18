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
                    <el-switch v-model="isUsed" active-color="#13ce66"></el-switch>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex flex-center flex-column unset-padding" height="auto"
                   style="padding-top: 16px !important;">
            <div class="flex flex-end">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="saveData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "GoodsClassForm",
        props: ["seq", "editForm"],
        data() {
            return {
                title: '',//名称
                description: '',//描述
                isUsed: false,//是否启用
            }
        },
        created() {
            if (this.editForm) {
                this.title = this.editForm.title;
                this.description = this.editForm.description;
                this.isUsed = this.editForm.isUsed;
            }
        },
        methods: {
            saveData() {
                if(!this.title){
                    this.$message.warning("请输入分类名称");
                    return;
                }

                if (this.editForm) {
                    let params = {
                        title: this.title,
                        description: this.description,
                        isUsed: this.isUsed,
                        id: this.editForm.id,
                    };
                    this.$request.put('/api/admin/goods/category/updateGoodsCategory',  params).then(res=>{
                        if(res.success){
                            this.$message.success('修改成功');
                            this.$emit("refresh")
                        }
                    })
                } else {
                    this.$request.post('/api/admin/goods/category/addGoodsCategory', {
                        title: this.title,
                        description: this.description,
                        isUsed: this.isUsed,
                        seq: this.seq
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('添加成功');
                            this.$emit("refresh")
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>