<template>
    <el-container class="absolute-fill-parent background-color-white" style="z-index: 20000;">
        <el-header class="border-bottom flex flex-column flex-center">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                    {{!id ? '新增分会' : '修改分会'}}
                </div>
                <div>
                    <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('update:visible',false)">取消返回</el-button>
                    <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">{{id ? '确认修改' : '确认新增'}}</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent">
                <vue-scroll>
                    <div style="padding: 25px;">
                        <el-form size="small" label-width="120px" style="max-width: 750px;" :model="branchModel"  :rules="rules" ref="branchForms" >
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        分会名称：
                                    </div>
                                </template>
                                <el-input v-model="branchModel.name" placeholder="请输入分会名称，50字以内" :maxlength="50"/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label required">
                                        分会类型：
                                    </div>
                                </template>
                                <branch-type-choose style="width: 100%;" v-model="branchModel.branchClass"/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        分会所在地：
                                    </div>
                                </template>
                                <city-choose v-model="branchModel.address" show-city/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        分会联系人：
                                    </div>
                                </template>
                                <el-input v-model="branchModel.contactPerson" placeholder="请输入分会联系人"/>
                            </el-form-item>
                            <el-form-item prop="contactPhone">
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        分会联系电话：
                                    </div>
                                </template>
                                <el-input v-model="branchModel.contactPhone" placeholder="请输入分会联系电话" @blur="changPhone()"/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        分会简介：
                                    </div>
                                </template>
                                <el-input type="textarea" :rows="8" resize="none" v-model="branchModel.introduce" placeholder="请输入分会简介，500字以内" :maxlength="500"/>
                            </el-form-item>
                            <el-form-item>
                                <template v-slot:label>
                                    <div class="custom-el-form-item-label">
                                        分会详情：
                                    </div>
                                </template>
                                <editor v-model="branchModel.content"></editor>
                            </el-form-item>
                        </el-form>
                    </div>
                </vue-scroll>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import BranchTypeChoose from "./branchType/BranchTypeChoose";
    import CityChoose from "../../util/city/CityChoose";
    import Editor from "@/components/util/editor/Editor";
    export default {
        name: "BranchForm",
        components: {CityChoose, BranchTypeChoose,Editor},
        props:{
            visible: {
                type: Boolean,
                default: false
            },
            id:{
                type: String,
                default: null
            },
            seq: Number
        },
        data(){
            var checkPhone = (rule, value, callback) => {
               var reg = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
               if(!value){
                   callback();
               }else{
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的手机号'));
                    } else {
                        callback();
                    }
               }
                
            };
            return {
                branchModel:{
                    name: '',
                    introduce: '',
                    contactPerson: '',
                    contactPhone: '',
                    branchClass: '',
                    address: [],
                    content:''
                },
                rules:{
                    contactPhone:[
                        { validator: checkPhone, trigger:['blur', 'change'] }
                    ]
                }
            }
        },
        methods:{
            changPhone(){
                // var reg = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
                // if (!reg.test(this.contactPhone)) {
                //     this.$message.success('请输入正确的手机号');
                // } 
            },
            getBranchInfo(){
                if(this.id){
                    this.$request.get('/api/common/branch/anon/branchInfo',{
                        params:{id: this.id}
                    }).then(resp=>{
                        let {data} = resp;
                        this.branchModel.name = data.name;
                        this.branchModel.introduce = data.introduce;
                        this.branchModel.contactPerson = data.contactPerson;
                        this.branchModel.contactPhone = data.contactPhone;
                        this.branchModel.branchClass = data.branchClass;
                        this.branchModel.address = JSON.parse(data.address);
                        this.branchModel.content = data.content;
                    })
                }
            },
            checkData(){
                return new Promise((resolve, reject) => {

                    if(!this.branchModel.name){
                        reject(new Error('请输入分会名称'));
                        return;
                    }

                    if(!this.branchModel.branchClass){
                        reject(new Error('请选择分会类型'));
                        return;
                    }

                    resolve({
                        name: this.branchModel.name,
                        introduce: this.branchModel.introduce,
                        contactPerson: this.branchModel.contactPerson,
                        contactPhone: this.branchModel.contactPhone,
                        branchClass: this.branchModel.branchClass,
                        address: JSON.stringify(this.branchModel.address),
                        seq: this.seq,
                        content:this.branchModel.content
                    });

                })
            },
            submitData(){
                this.$refs.branchForms.validate((valid) => {
                    if (valid) {
                         this.checkData().then(params=>{
                            if(this.id){
                                params.id = this.id;
                                this.$request.put('/api/admin/branch',params).then(()=>{
                                    this.emitParent();
                                    this.$message.success('分会信息修改成功');
                                })
                            }else{
                                this.$request.post('/api/admin/branch',params).then(()=>{
                                    this.emitParent();
                                    this.$message.success('分会新增成功');
                                })

                            }
                        }).catch(e=>{
                            this.$message.warning(e.message);
                        });
                    } else {
                        return false;
                    }
                });
               
            },
            emitParent(){
                this.$emit('refresh');
                this.$emit('update:visible',false);
            }
        },
        created() {
            this.getBranchInfo();
        }
    }
</script>
