<template>
    <el-container style="height: 450px;" v-loading="loading">
        <el-main class="unset-padding position-relative">
            <vue-scroll @handle-scroll="click">
                <el-form ref="form" size="small" class="custom-el-form column">
                    <el-form-item v-for="field in fields" :key="field.code">
                        <template v-slot:label v-if="field.type!==9">
                                <span class="custom-el-form-item-label" :class="{required: field.isRequire}">
                                    {{field.title}}：
                                </span>
                        </template>
                        <online-form-edit-field :ref="field.code" :code="field.code" :config="field" v-model="field.value"/>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer height="auto" class="unset-padding">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="save">{{submitId ? '确认修改':'确定添加'}}</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import {formatDate} from "../../js/settingStore";
    import OnlineFormEditField from "../fields/OnlineFormEditField";
    export default {
        name: "OnlineSubmitForm",
        components: {OnlineFormEditField},
        props: {
            submitId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                originalInfo: null,
                fields: [],
                loading: false,
            }
        },
        computed: {
            formId() {
                return this.$route.params.formId;
            },
        },
        methods: {
            click(){
                for(let ref in this.$refs){
                    let item = this.$refs[ref];
                    if(Array.isArray(item)){
                        if(item[0]){
                            item[0].hidden();
                        }
                    }
                }
            },
            save() {
                let fieldRelation = {};
                for(let field of this.fields){
                    let {value,code,type,} = field;
                    if(type === 5 || type === 6 || type === 7){
                        if(value){
                            value = JSON.stringify(value);
                        }
                    }

                    if(type === 3 && value){
                        value = formatDate(new Date(value),'yyyy-MM-dd HH:mm');
                    }

                    fieldRelation[code] = value;
                }

                if(this.submitId){
                    this.$request.put(`/api/admin/onlineForm/poi/submit/${this.formId}/${this.submitId}`,fieldRelation).then(()=>{
                        this.$message.success("修改成功");
                        this.$emit('refresh');
                        this.$emit('close');
                    });
                }else{
                    this.$request.post(`/api/admin/onlineForm/poi/submit/${this.formId}`,fieldRelation).then(()=>{
                        this.$message.success("添加成功");
                        this.$emit('refresh');
                        this.$emit('close');
                    });
                }
            },
            getFields() {
                this.loading = true;
                if(this.submitId){
                    Promise.all([this.$request.get('/api/admin/onlineForm', {params: {id: this.formId}}),
                        this.$request.get(`/api/admin/onlineForm/poi/submit/${this.formId}/${this.submitId}`)]).then(([fields,submitInfo])=>{
                            if(fields.success && submitInfo.success){
                                fields = JSON.parse(fields.data.fields);
                                this.fields = fields.filter(field => {
                                    let {code,type} = field;
                                    let value = submitInfo.data[code];

                                    if(type === 5 || type === 6 || type === 7){
                                        if(value){
                                            value = JSON.parse(value);
                                        }
                                    }

                                    field.value = value;


                                    return type !== 8;
                                });

                                this.$nextTick(()=>{ this.loading = false; })
                            }
                    })

                }else{
                    this.$request.get('/api/admin/onlineForm', {params: {id: this.formId}}).then(fields=>{
                        fields = JSON.parse(fields.data.fields);
                        this.fields = fields.filter(field => {
                            field.value = null;
                            let {type} = field;
                            console.log(1);
                            if (field.type===9&&field.isRequire) {
                                // console.log(field.typeConfig.IDRule)
                                field.value=field.typeConfig.IDRule
                            }

                            return type !== 8;
                        });

                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }
            }
        },
        created() {
            this.getFields();
        }
    }
</script>
