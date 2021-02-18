<template>
    <el-select v-model="copyValue" style="width: 100%;" placeholder="请选择标签分组">
        <el-option v-for="item in labelList" :key="item.id" :value="item.id" :label="item.title"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "LabelFieldChoose",
        props: {
            value: String,
            labelList: Array,
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        data(){
            return {

                copyValue: this.value
            }
        },
        watch: {
            value(val){
                this.copyValue = val;
            },
            copyValue(val){
                this.$emit('change', val);
            }
        },
    }
</script>

<style scoped>

</style>
