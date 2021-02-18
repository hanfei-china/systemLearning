<template>
    <el-checkbox v-model="initValue">
        {{attribute.content}}
    </el-checkbox>
</template>

<script>
    export default {
        name: "CheckboxSetting",
        props:{
            attribute: Object,
            value: Boolean
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
