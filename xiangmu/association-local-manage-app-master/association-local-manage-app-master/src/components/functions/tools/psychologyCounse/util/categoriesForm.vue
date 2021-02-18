<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
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
                <el-button icon="el-icon-success" type="primary" size="small" @click="saveData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "categoriesForm",
        props: ["editInfo", "seq"],
        data() {
            return {
                title: '',
                description: '',
                isUsed: false,
            }
        },
        created() {
            this.getEditInfo();
        },
        methods: {
            getEditInfo() {
                if (this.editInfo) {
                    this.title = this.editInfo.title;
                    this.description = this.editInfo.description;
                    this.isUsed = this.editInfo.isUsed;
                }
            },
            //保存信息
            saveData() {
                if (!this.title) {
                    this.$message.warning('请输入分类名称');
                    return;
                }

                let data = {
                    title: this.title,
                    description: this.description,
                    isUsed: this.isUsed,
                    seq: this.seq
                };

                if (this.editInfo) {
                    this.$request.put("/api/admin/counsel/category/updateCounselCategory", {
                        categoryId: this.editInfo.id,
                        description: this.description,
                        isUsed: this.isUsed,
                        title: this.title
                    }).then(res => {
                        if (res.success) {
                            this.$message.success("修改成功");
                            this.$emit('refresh');
                            this.$emit('close');
                        }
                    })
                } else {
                    this.$request.post('/api/admin/counsel/category/addCounselCategory', data).then(res => {
                        if (res.success) {
                            this.$message.success("添加分类成功");
                            this.$emit('refresh');
                            this.$emit('close');
                        }
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>