<template>
    <el-input v-model="initValue"
              :maxlength="attribute.maxLength" :placeholder="attribute.placeholder"/>
</template>

<script>
    export default {
        name: "InputSetting",
        props:{
            attribute: Object,
            value: String
        },
        data(){
            return {
                initValue: this.value
            }
        },
        model:{
            prop:'value',
            event: 'change'
        },
        watch:{
            initValue(val){
                this.$emit('change',val);
            }
        }
    }
</script>
