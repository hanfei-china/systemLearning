<template>
    <el-container style="height: 400px">
        <el-main class="unset-padding" >
            <el-form label-width="100px" size="small">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            查询名称：
                        </div>
                    </template>
                    <el-input v-model="queryTitle" placeholder="请输入查询名称，20字以内" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            查询字段：
                        </div>
                    </template>
                    <el-transfer class="custom-el-transfer" v-model="queryConfig"
                                 target-order="push" :titles="transfer.titles" :props="transfer.props" :data="fields"/>
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
        name: "StatisticsQueryForm",
        props:{
            id: String
        },
        data(){
            return {
                loading: false,
                fields: [],

                queryTitle: '',
                queryConfig: [],

                transfer:{
                    titles: ['可选字段','已选字段'],
                    props:{
                        key: 'code',
                        label: 'name'
                    }
                }
            }
        },
        methods:{
            getFields(){
                this.$request.get('/api/admin/associator/getFieldsInfo',{params:{topicTypes:[2,3,6,8]}}).then(resp=>{
                    this.fields = resp.data.concat([
                        {
                            code: "status",
                            name: "激活状态",
                            parameter: '{"options":[{"key":"1","title":"已激活","optionType":0},{"key":"0","title":"未激活","optionType":0}]}',
                            topicType: 2
                        },
                        {
                            code: "registerMode",
                            name: "注册方式",
                            parameter: '{"options":[{"key":"1","title":"后台导入","optionType":0},{"key":"0","title":"用户注册","optionType":0},{"key":"2","title":"活动导入","optionType":0}]}',
                            topicType: 2
                        },
                        {
                            code: 'memberTypeId',
                            name: '会员类型',
                            topicType: 2,
                        },
                        {
                            code: 'branch',
                            name: '分会',
                            topicType: 2,
                        },
                        {
                            code: 'label',
                            name: '标签',
                            topicType: 8,
                        }]);
                });
            },
            submitData(){
                if(!this.queryTitle){
                    this.$message.warning("请输入查询名称");
                    return;
                }

                if(this.queryConfig.length < 1){
                    this.$message.warning("请选择查询字段");
                    return;
                }

                let data = {
                    queryTitle: this.queryTitle,
                    queryConfig: this.queryConfig,
                }

                if(this.id){
                    data.id = this.id;
                    this.$request.put('/api/admin/member/statistics/query',data).then(()=>{
                        this.$message.success("查询修改成功");
                        this.$emit('refresh-list');
                        this.$emit('close');
                    })
                }else{
                    this.$request.post('/api/admin/member/statistics/query',data).then(()=>{
                        this.$message.success("查询新增成功");
                        this.$emit('refresh-list');
                        this.$emit('close');
                    })
                }
            },
            getQueryInfo(){
                if(this.id){
                    this.$request.get('/api/admin/member/statistics/query',{
                        params: {id: this.id}
                    }).then(res=>{
                        let {queryTitle,queryConfig} = res.data;
                        this.queryTitle = queryTitle;
                        this.queryConfig = JSON.parse(queryConfig);
                    })
                }
            }
        },
        created() {
            this.getFields();
            this.getQueryInfo();
        }
    }
</script>

