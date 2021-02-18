<template>
    <el-select :disabled="!!accountField" v-model="copyValue" :size="size" :placeholder="placeholder" >
        <el-option v-for="field of fields" :key="field.code" :value="field.code" :label="accountField === field.code ? `(账号字段)${field.name}` : field.name"/>
    </el-select>
</template>

<script>
    export default {
        name: "AllMemberFieldChoose",
        props: {
            value: String,
            placeholder:{
                type: String,
                default: '请选择唯一项'
            },
            size: String,
            accountField: String
        },
        data(){
            return {
                fields: [],
                copyValue: this.value || []
            }
        },
        model:{
            prop:'value',
            event: 'change'
        },
        methods:{
            getFields(){
                this.$request.get('/api/admin/associator/getFieldsInfo',{params:{topicTypes:[0]}}).then(resp=>{
                    this.fields = resp.data;
                })
            }
        },
        created() {
            this.getFields();
        },
        watch:{
            copyValue(val){
                this.$emit('change',val);
            },
            value(val){
                if(!this.copyValue){
                    this.copyValue = val;
                }
            }
        }
    }
</script>
