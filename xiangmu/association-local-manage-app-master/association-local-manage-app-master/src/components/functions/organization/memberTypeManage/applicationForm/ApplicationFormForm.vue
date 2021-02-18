<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="120px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            申请单名称：
                        </div>
                    </template>
                    <el-input v-model="applicationFormName" placeholder="请输入申请单名称，20字以内" :maxlength="20"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            申请单描述：
                        </div>
                    </template>
                    <el-input placeholder="申请单描述，100字以内" type="textarea" :maxlength="100" :rows="3"
                              resize="none" v-model="applicationFormDescription"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">关联会员：</div>
                    </template>
                    <el-select v-model="memberTypeId" placeholder="请选择会员">
                        <el-option v-for="item in memberTypeList" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            其它设置：
                        </div>
                    </template>
                    <el-checkbox v-model="isMatchingModes">开启匹配</el-checkbox>
                    <div>
                        <el-checkbox v-model="isNeedExamine">开启人工审核</el-checkbox>
                        <el-popover placement="top-start" width="340" trigger="hover">
                            <div>
                                <div>1 开启后，未匹配成功的用户将进入身份认证审核状态;</div>
                                <div>2 关闭后，未匹配成功的用户将直接添加成为新的用户;</div>
                            </div>
                            <i class="el-icon-question" slot="reference"></i>
                        </el-popover>
                    </div>

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
        name: "ApplicationFormForm",
        props:{
            formId: String
        },
        data(){
            return {
                memberTypeList:[],
                memberTypeId:"",
                applicationFormDescription: '',
                applicationFormName: '',
                isMatchingModes: true,
                isNeedExamine: true,
                canFaceIdentification: false,//是否开启人脸认证
            }
        },
        methods:{
            submitData(){
                if(!this.applicationFormName){
                    this.$message.warning('请输入申请单名称');
                    return;
                }
                if(!this.memberTypeId){
                    this.$message.warning('请选择会员');
                    return;
                }

                let data = {
                    applicationFormDescription : this.applicationFormDescription,
                    applicationFormName: this.applicationFormName,
                    isMatchingModes: this.isMatchingModes,
                    isNeedExamine: this.isNeedExamine,
                    memberTypeId: this.memberTypeId,
                    canFaceIdentification: this.canFaceIdentification
                }

                if(this.formId){
                    data.applicationId = this.formId;
                    this.$request.put('/api/admin/applicationForm/updateApplicationForm',data).then(()=>{
                        this.$message.success('申请表修改成功');
                        this.$emit('refresh');
                        this.$emit('close');
                    })
                }else{
                    this.$request.post('/api/admin/applicationForm/addApplicationForm',data).then(()=>{
                        this.$message.success('申请表新增成功');
                        this.$emit('refresh');
                        this.$emit('close');
                    })
                }
            },
            getFormInfo(){
                if(this.formId){
                    this.$request.get('/api/admin/applicationForm/getApplicationFormInfoById',{
                        params:{
                            applicationFormId: this.formId
                        }
                    }).then(res=>{
                        let {data} = res;
                        this.applicationFormName = data.applicationFormName;
                        this.applicationFormDescription = data.applicationFormDescription;
                        this.isMatchingModes = data.isMatchingModes;
                        this.isNeedExamine = data.isNeedExamine;
                        this.canFaceIdentification = data.canFaceIdentification;
                        this.memberTypeId = (data.memberTypeId&&(data.memberTypeId!=="system"))?data.memberTypeId:""
                    })
                }
            }
        },
        created() {
            this.$request.get('/api/admin/memberType/getMemberTypes').then(res=>{
                this.memberTypeList = res.data;
                this.getFormInfo();
            })
        }
    }
</script>

