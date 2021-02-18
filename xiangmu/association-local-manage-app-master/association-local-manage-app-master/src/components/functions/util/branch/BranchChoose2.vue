<template>
    <el-select placeholder="下拉选择分会" size="small" v-model="copyValue" filterable clearable>
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="`${item.name}（${item.branchType === 1 ? '总会' : item.branchClassName}）`"/>
    </el-select>
</template>

<script>
    export default {
        name: "BranchChoose2",
        props:{
            value:String,
            list: Array
        },
        data(){
            return {
                copyValue: this.value
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
        },
    }
</script>
