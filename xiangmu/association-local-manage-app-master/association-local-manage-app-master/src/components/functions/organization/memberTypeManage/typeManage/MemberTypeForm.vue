<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="120px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            类型名称：
                        </div>
                    </template>
                    <el-input v-model="typeName" placeholder="请输入类型名称，20字以内" :maxlength="20"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            类型属性：
                        </div>
                    </template>
                    <el-radio-group v-model="nature">
                        <el-radio :label="0">个人会员</el-radio>
                        <el-radio :label="1">团体会员</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            类型描述：
                        </div>
                    </template>
                    <el-input placeholder="类型描述，100字以内" type="textarea" :maxlength="100" :rows="3"
                              resize="none" v-model="typeDescription"/>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex flex-center flex-column unset-padding" height="auto" style="padding-top: 16px !important;">
            <div class="flex flex-end">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "MemberTypeForm",
        props:{
            typeId: String,
        },
        data(){
            return {
                typeDescription: '',
                typeName: '',
                nature: 0
            }
        },
        methods:{
            submitData(){
                if(!this.typeName){
                    this.$message.warning('请输入类型名称');
                    return;
                }

                let data = {
                    typeDescription : this.typeDescription,
                    typeName: this.typeName,
                    nature: this.nature
                };

                if(this.typeId){
                    data.typeId = this.typeId;
                    this.$request.put('/api/admin/memberType/updateMemberType',data).then(()=>{
                        this.$message.success('会员类型修改成功');
                        this.$emit('refresh');
                        this.$emit('close');
                    })
                }else{
                    this.$request.post('/api/admin/memberType/addMemberType',data).then(()=>{
                        this.$message.success('会员类型新增成功');
                        this.$emit('refresh');
                        this.$emit('close');
                    })
                }
            },
            getFormInfo(){
                if(this.typeId){
                    this.$request.get('/api/admin/memberType/getMemberTypeInfoById',{
                        params:{
                            memberTypeId: this.typeId
                        }
                    }).then(res=>{
                        let {data} = res;
                        this.typeDescription = data.typeDescription;
                        this.typeName = data.typeName;
                        this.nature = data.nature;
                    })
                }
            }
        },
        created() {
            this.getFormInfo();
        }
    }
</script>
