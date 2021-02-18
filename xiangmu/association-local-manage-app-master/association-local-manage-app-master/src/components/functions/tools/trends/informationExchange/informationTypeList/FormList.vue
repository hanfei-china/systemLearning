<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item label="类型名称：" :rules="{required:true,message:'请输入类型名称',trigger:'blur'}">
                    <el-input v-model="title"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model="descriptions"></el-input>
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
        name: "FormList",
        props: ["editInfo", 'seq'],
        data() {
            return {
                descriptions: '',//描述
                isUsed: false,//是否启用
                title: '',//标题
                classId: '',//编辑的id
            }
        },
        created() {
            this.getEditInfo();
        },
        methods: {
            //获取要编辑的信息
            getEditInfo() {
                if (this.editInfo) {
                    this.descriptions = this.editInfo.descriptions;
                    this.isUsed = this.editInfo.isUsed;
                    this.title = this.editInfo.title;
                    this.classId = this.editInfo.id;
                }
            },
            //保存
            saveData() {
                if (!this.title) {
                    this.$message.warning("请输入类型名称");
                    return;
                }

                if (this.classId) {
                    this.$request.put('/api/admin/informationExchangeClass/updateInformationExchangeClass', {
                        descriptions: this.descriptions,
                        isUsed: this.isUsed,
                        title: this.title,
                        classId: this.classId
                    }).then(res => {
                        if (res.success) {
                            this.$message.success("修改成功");
                            this.$emit("refresh");
                            this.$emit("close")
                        }
                    })
                } else {
                    this.$request.post('/api/admin/informationExchangeClass/addInformationExchangeClass', {
                        descriptions: this.descriptions,
                        isUsed: this.isUsed,
                        title: this.title,
                        seq: this.seq
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('添加成功');
                            this.$emit("refresh");
                            this.$emit("close")
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>