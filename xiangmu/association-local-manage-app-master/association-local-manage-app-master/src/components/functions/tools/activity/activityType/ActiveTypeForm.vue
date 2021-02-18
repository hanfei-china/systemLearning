<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item label="类型名称：" required>
                    <el-input :maxlength="20" placeholder="类型名称，20字以内" v-model="name"></el-input>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "ActiveTypeForm",
        props: ['copySeq','id','isMain'],
        data(){
            return {
                name: "",
                seq: this.copySeq
            }
        },
        created() {
            if(this.id){
                this.getData();
            }
        },
        methods: {
            getData(){
                this.$request.get('/api/admin/group/getGroup',{params: {
                        id: this.id,
                        operate: 0,
                        type: 3
                    }}).then(res => {
                        this.name = res.data[0].name;
                        this.seq = res.data[0].seq;
                })
            },
            submitData(){
                if(this.id){
                    this.$request.put('/api/admin/group/updateGroup',{
                        id: this.id,
                        name: this.name,
                        seq: this.seq,
                        type: 3,
                        isMain:this.isMain
                    }).then(res => {
                        if(res.success){
                            this.$message.success('编辑类型成功');
                            this.$emit('close');
                            this.$emit('refresh');
                        }
                    })
                }else {
                    this.$request.post('/api/admin/group/addGroup',{
                        name: this.name,
                        seq: this.seq,
                        type: 3,
                        isFolder: false,
                        groupType: 0,
                        isMain:this.isMain
                    }).then(res => {
                        if(res.success){
                            this.$message.success('添加类型成功');
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
