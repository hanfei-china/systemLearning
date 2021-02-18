<template>
    <el-container style="height: 306px;">
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent">
                <el-form ref="form" size="small" label-width="100px" :model="dictionary" :rules="rules">
                    <el-form-item label="字典名称：" prop="title">
                        <el-input placeholder="字典名称，20字以内" v-model="dictionary.title" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="字典层级：" prop="layerCount">
                        <el-select v-model="dictionary.layerCount" :disabled="!!dictionary.enumId">
                            <el-option :value="1" label="1级"/>
                            <el-option :value="2" label="2级"/>
                            <el-option :value="3" label="3级"/>
                            <el-option :value="4" label="4级"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字典描述：">
                        <el-input placeholder="字典简介，100字以内" type="textarea" :maxlength="100" :rows="3"
                                  resize="none"
                                  v-model="dictionary.description"/>
                    </el-form-item>
                    <el-form-item label="启用字典：">
                        <el-switch active-color="#13ce66" v-model="dictionary.enabled"/>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
        <el-footer height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button size="small" @click="$emit('close')">取消</el-button>
                <el-button size="small" type="primary" @click="save">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>


    export default {
        name: "DictionaryForm",
        props: {
            data: Object
        },
        data() {
            return {

                rules: {
                    title: [
                        {required: true, message: '请输入字典名称', trigger: 'blur'}
                    ],
                    layerCount: [
                        {required: true, message: '请选择字典层级', trigger: 'blur'}
                    ],
                },
                dictionary: {...this.data}
            }
        },
        methods:{
            save(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        if(this.dictionary.enumId){
                            this.updateDictionary();
                        }else{
                            this.addDictionary();
                        }
                    }
                })
            },
            addDictionary(){
                this.$request.post('/api/admin/associator/addEnumInfo',{...this.dictionary}).then(()=>{
                    this.$message.success('已成功添加枚举字典');
                    this.$emit('refresh-list');
                    this.$emit('close');
                })
            },
            updateDictionary(){
                this.$request.put('/api/admin/associator/updateEnumInfo',{...this.dictionary}).then(()=>{
                    this.$message.success('已成功修改枚举字典');
                    this.$emit('refresh-list');
                    this.$emit('close');
                })
            }
        }
    }
</script>
