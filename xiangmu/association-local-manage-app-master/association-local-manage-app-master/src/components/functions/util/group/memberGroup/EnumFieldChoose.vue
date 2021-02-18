<template>
    <el-select v-model="copyValue" style="width: 100%;" placeholder="请选择枚举字段">
        <el-option v-for="item in fieldList" :key="item.id" :value="item.id" :label="item.name"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "EnumFieldChoose",
        props: {
            value: String,
            fieldList: Array
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
