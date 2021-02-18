<template>
    <el-container>
        <el-main class="unset-padding" >
            <el-form label-width="100px" size="small">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            方案名称：
                        </div>
                    </template>
                    <el-input v-model="queryTitle" placeholder="请输入方案名称，20字以内" :maxlength="20"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            关键词：
                        </div>
                    </template>
                    <el-input type="textarea" :rows="8" resize="none" v-model="queryConfig" placeholder="输入校友姓名，使用空格、换行、逗号可监控多个校友信息"/>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "MatchQueryForm",
        props:{
            id: String
        },
        data(){
            return {
                queryTitle: '',
                queryConfig: '',
            }
        },
        methods:{
            submitData(){
                if(!this.queryTitle){
                    this.$message.warning("请输入方案名称");
                    return;
                }

                if(!this.queryConfig){
                    this.$message.warning("请输入方案内容");
                    return;
                }

                let data = {
                    queryTitle: this.queryTitle,
                    queryConfig: this.queryConfig,
                };

                if(this.id){
                    data.id = this.id;
                    this.$request.put('/api/admin/member/match/query',data).then(()=>{
                        this.$message.success("方案修改成功");
                        this.$emit('refresh-list');
                        this.$emit('close');
                    })
                }else{
                    this.$request.post('/api/admin/member/match/query',data).then(()=>{
                        this.$message.success("方案新增成功");
                        this.$emit('refresh-list');
                        this.$emit('close');
                    })
                }
            },
            getQueryInfo(){
                if(this.id){
                    this.$request.get('/api/admin/member/match/query',{
                        params: {id: this.id}
                    }).then(res=>{
                        let {queryTitle,queryConfig} = res.data;
                        this.queryTitle = queryTitle;
                        this.queryConfig = queryConfig;
                    })
                }
            }
        },
        created() {
            this.getQueryInfo();
        }
    }
</script>

