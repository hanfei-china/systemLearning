<template>
    <el-select placeholder="下拉选择缴费方式" size="small" v-model="copyValue" clearable>
        <el-option v-for="(item,index) of list" :key="index" :value="index" :label="item"/>
    </el-select>
</template>

<script>
    import {duesPaymentType} from "../../../../js/util/constantStore";

    export default {
        name: "DuesPaymentTypeChoose",
        props:['value'],
        data(){
            return {
                copyValue: this.value,
                list: duesPaymentType
            }
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        watch:{
            copyValue(val){
                this.$emit('change',val);
            },
            value(val){
                this.copyValue = val;
            }
        }
    }
</script>
