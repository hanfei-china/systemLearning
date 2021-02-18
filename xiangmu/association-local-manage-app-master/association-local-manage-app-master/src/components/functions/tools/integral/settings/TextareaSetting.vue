<template>
    <el-input type="textarea" resize="none" :row="4" v-model="initValue"
              :maxlength="attribute.maxLength" :placeholder="attribute.placeholder"/>
</template>

<script>
    export default {
        name: "TextareaSetting",
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
