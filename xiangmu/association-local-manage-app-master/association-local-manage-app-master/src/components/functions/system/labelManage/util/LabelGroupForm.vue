<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="120px">
                <el-form-item label="分组名称" required>
                    <el-input placeholder="请输入分组名称" v-model="title"></el-input>
                </el-form-item>
                <el-form-item label="文本长度" required>
                    <el-input-number :min="1" v-model="textLength"></el-input-number>
                </el-form-item>
                <el-form-item label="标签颜色" required>
                    <el-color-picker show-alpha v-model="color"></el-color-picker>
                </el-form-item>
                <el-form-item label="是否多选" required>
                    <el-checkbox v-model="isMultiple"></el-checkbox>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer height="auto" class="text-align-right">
            <el-button size="small" type="danger" @click="$emit('close')">取消返回</el-button>
            <el-button size="small" type="primary" @click="saveData">确定保存</el-button>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "LabelGroupForm",
        props: {
            type: Number,
            seq: Number,
            labelGroupInfo: Object
        },
        data() {
            return {
                title: '',//标题
                textLength: 1,//最大长度
                color: '',//标签颜色
                isMultiple: false,//是否多选
            }
        },
        created() {
            if(this.labelGroupInfo.id){
                this.title = this.labelGroupInfo.title;
                this.textLength = this.labelGroupInfo.textLength;
                this.color = this.labelGroupInfo.color;
                this.isMultiple = this.labelGroupInfo.isMultiple;
            }else {
                this.title = null;
                this.textLength = 1;
                this.color = null;
                this.isMultiple = false;
            }
        },
        methods: {
            saveData(){
                if(!this.title){
                    this.$message.warning('请输入分组名称');
                    return;
                }

                if(!this.color){
                    this.$message.warning('请设置分组标签颜色');
                    return;
                }

                if(this.labelGroupInfo.id){
                    this.$request.put('/api/admin/label/manage/updateLabelGroup',{
                        id: this.labelGroupInfo.id,
                        color: this.color,
                        isMultiple: this.isMultiple,
                        seq: this.labelGroupInfo.seq,
                        textLength: this.textLength,
                        title: this.title,
                        type: this.type
                    }).then(res=> {
                        if(res.success){
                            this.$message.success('编辑成功');
                            this.$emit('close');
                            this.$emit('refresh');
                        }
                    })
                }else {
                    this.$request.post('/api/admin/label/manage/addLabelGroup',{
                        color: this.color,
                        isMultiple: this.isMultiple,
                        seq: this.seq,
                        textLength: this.textLength,
                        title: this.title,
                        type: this.type
                    }).then(res=> {
                        if(res.success){
                            this.$message.success('添加成功');
                            this.$emit('close');
                            this.$emit('refresh');
                        }
                    })
                }

            }
        }
    }
</script>

<style scoped>

</style>