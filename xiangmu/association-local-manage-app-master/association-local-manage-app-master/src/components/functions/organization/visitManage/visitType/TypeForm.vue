<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form label-width="100px" size="small">
                <el-form-item label="分类名称：" required>
                    <el-input v-model="name" placeholder="请输入分类名称，20字以内" :maxlength="20"/>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" placeholder="请输入描述信息，200字以内" :rows="7" resize="none" v-model="description" :maxlength="200"/>
                </el-form-item>
                <el-form-item label="其他设置：">
                    <el-checkbox v-model="isUsed">启用该分类</el-checkbox>
                    <el-checkbox v-model="isOnline">设为线上跟踪</el-checkbox>
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
        name: "TypeForm",
        props: ['form', 'seq'],
        data() {
            return {
                name: '',
                description: '',
                isUsed: true,
                isOnline: false,
                oldSeq: null
            }
        },
        created(){
            if(this.form){
                this.name = this.form.name;
                this.description = this.form.description;
                this.isUsed = this.form.isUsed;
                this.isOnline = this.form.isOnline;
                this.oldSeq = this.form.seq;
            }
        },
        methods: {
            saveData() {
                if (!this.name) {
                    this.$message.warning('请输入分类名称');
                    return;
                }

                if (!this.form) {
                    this.$request.post('/api/admin/visit/visitType/addVisitType', {
                        description: this.description,
                        isUsed: this.isUsed,
                        name: this.name,
                        seq: this.seq,
                        isOnline: this.isOnline
                    }).then(res => {
                        if (res.success) {
                            this.$message.success("添加成功");
                            this.$emit("refresh");
                            this.$emit("close");
                        }
                    })
                } else {
                    this.$request.put('/api/admin/visit/visitType/updateVisitType', {
                        description: this.description,
                        isUsed: this.isUsed,
                        name: this.name,
                        id: this.form.id,
                        isOnline: this.isOnline,
                        seq: this.oldSeq
                    }).then(res => {
                        if (res.success) {
                            this.$message.success("修改成功");
                            this.$emit("refresh");
                            this.$emit("close");
                        }
                    })
                }
            }
        }
    }
</script>
