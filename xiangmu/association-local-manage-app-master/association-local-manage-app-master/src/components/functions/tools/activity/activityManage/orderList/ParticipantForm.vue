<template>
    <el-container>
        <el-main class="unset-padding" style="height: 450px;">
            <vue-scroll>
                <el-form size="small">
                    <el-form-item v-for="item in fileList" :key="item.id" :label="item.name+ '：'" :required="item.necessary">
                        <field-item :field="item" v-model="signUpInfo[item.code]"/>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer class="flex flex-center flex-column unset-padding" height="auto"
                   style="padding-top: 16px !important;">
            <div class="flex flex-end">
                <el-button size="small" icon="el-icon-error" type="danger" @click="$emit('close')">取消返回</el-button>
                <el-button size="small" icon="el-icon-success" type="primary" @click="saveData">确 定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import FieldItem from "./util/FieldItem";
    export default {
        name: "ParticipantForm",
        components: {FieldItem},
        props: {
            activityId: String,
            relationId: String
        },
        data(){
            return {
                fileList: [],//字段列表
                signUpInfo: {},
            }
        },
        created(){
            this.getFileList(()=>{
                this.getData();
            });
        },
        methods: {
            getFileList(callback){
                this.$request.get('/api/common/activity/getActivityFieldsInfo',{params: {
                        activityId: this.activityId
                    }}).then(res => {
                    this.fileList = res.data;
                    callback && callback();
                })
            },
            getData(){
                if(this.relationId){
                    this.$request.get('/api/admin/activityInfo/getSignUpInfoById',{params:{relationId:this.relationId}}).then(res=>{
                        this.signUpInfo = res.data;
                    })
                }
            },
            getValue(array){
                this.$set(this.signUpInfo,array[0],array[1]);
            },
            saveData(){
                // for (let item of this.fileList){
                //     let code = item.code;
                //     if(item.necessary){
                //         if(!this.signUpInfo[code]){
                //             this.$message.warning('请输入'+item.name);
                //             return;
                //         }
                //     }
                // }

                if(this.relationId){
                    this.$request.post('/api/admin/activityInfo/editSignUpInfo',{
                        relationId: this.relationId,
                        newSignUpInfo: JSON.stringify(this.signUpInfo)
                    }).then(res => {
                        if(res.success){
                            this.$emit("close");
                            this.$emit("refresh");
                        }
                    })
                }else{
                    this.$request.post('/api/admin/activityInfo/addActivitySignUp',{
                        activityId: this.activityId,
                        signUpInfo: JSON.stringify(this.signUpInfo)
                    }).then(res => {
                        if(res.success){
                            this.$emit("close");
                            this.$emit("refresh");
                        }
                    })
                }
            }
        }
    }
</script>
