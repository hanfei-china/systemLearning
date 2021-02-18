<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="120px">
                <el-form-item label="标签内容" required>
                    <el-input placeholder="请输入标签内容" v-model="title" :maxlength="labelLength" show-word-limit></el-input>
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
        name: "LabelForm",
        props: {
            labelInfo: Object,
            labelGroupId: String,
            labelLength: Number,
            seq: Number
        },
        data(){
            return {
                title: null,//标签标题
            }
        },
        created() {
            if(this.labelInfo.id){
                this.title = this.labelInfo.title;
            }else {
                this.title = null;
            }
        },
        methods: {
            saveData(){
                if(!this.title){
                    this.$message.warning('请输入标签内容')
                }
                if(this.labelInfo.id){
                    this.$request.put('/api/admin/label/manage/updateLabel',{
                        groupId: this.labelGroupId,
                        seq: this.seq,
                        title: this.title,
                        id: this.labelInfo.id
                    }).then(res=>{
                        if(res.success){
                            this.$message.success('标签添加成功');
                            this.$emit('close');
                            this.$emit('refresh');
                        }
                    })
                }else {
                    this.$request.post('/api/admin/label/manage/addLabel',{
                        groupId: this.labelGroupId,
                        seq: this.seq,
                        title: this.title
                    }).then(res=>{
                        if(res.success){
                            this.$message.success('标签添加成功');
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