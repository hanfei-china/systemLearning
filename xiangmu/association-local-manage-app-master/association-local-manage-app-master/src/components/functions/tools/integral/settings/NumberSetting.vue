<template>
    <el-input-number v-model="initValue" :placeholder="attribute.placeholder"
        :max="attribute.max" :min="attribute.min"/>
</template>

<script>
    export default {
        name: "NumberSetting",
        props:{
            attribute: Object,
            value: Number
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
