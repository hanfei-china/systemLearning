<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item label="签到点名称：">
                    <el-input v-model="address" placeholder="请输入签到点名称,20字以内" :maxlength="20"/>
                </el-form-item>
                <el-form-item label="签到点设置：">
                    <el-checkbox v-model="muchSign">多次签到</el-checkbox>
                    <el-checkbox v-model="showSignUp">显示报名信息</el-checkbox>
                    <el-checkbox v-model="canEdit" v-show="showSignUp">报名信息可编辑</el-checkbox>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex flex-center flex-column unset-padding" height="auto"
                   style="padding-top: 16px !important;">
            <div class="flex flex-end">
                <el-button icon="el-icon-error" :disabled="disabled" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" :disabled="disabled"  type="primary" size="small" @click="signLocation">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "SignLocationForm",
        props: ['activityId','signLocationForm'],
        data(){
            return{
                address: '',//签到地点
                addressConfig: "{}",//签到地址配置信息
                muchSign: false,//是否多次签到
                showSignUp: false, //签到成功后是否显示报名信息
                disabled: false,
                canEdit: false
            }
        },
        created(){
            if(this.signLocationForm){
                this.address = this.signLocationForm.address;
                this.addressConfig = this.signLocationForm.addressConfig;
                this.muchSign = this.signLocationForm.muchSign;
                this.showSignUp = this.signLocationForm.showSignUp;
                this.canEdit = this.signLocationForm.canEdit;
            }
        },
        methods: {
            signLocation(){
                if(!this.address){
                    this.$message.warning('请输入签到点名称');
                    return;
                }
                this.disabled = true;
                if(this.signLocationForm === ''){
                    this.$request.post('/api/admin/activity/address/addAddress',{
                        activityId: this.activityId,
                        address: this.address,
                        addressConfig: this.addressConfig,
                        muchSign: this.muchSign,
                        showSignUp: this.showSignUp,
                        canEdit: this.canEdit,
                    }).then(res => {
                        if(res.success){
                            this.$message.success('添加签到点成功');
                            this.$emit("refresh");
                            this.$emit('close');
                            this.disabled = false;
                        }
                    }).catch(()=>{
                        this.disabled = false;
                    })
                }else {
                    this.$request.put('/api/admin/activity/address/updateAddress',{
                        id: this.signLocationForm.id,
                        address: this.address,
                        addressConfig: this.addressConfig,
                        muchSign: this.muchSign,
                        showSignUp: this.showSignUp,
                        canEdit: this.canEdit,
                    }).then(res => {
                        if(res.success){
                            this.$message.success('修改签到点成功');
                            this.$emit("refresh");
                            this.$emit('close');
                            this.disabled = false;
                        }
                    }).catch(()=>{
                        this.disabled = false;
                    })
                }


            }
        }
    }
</script>
