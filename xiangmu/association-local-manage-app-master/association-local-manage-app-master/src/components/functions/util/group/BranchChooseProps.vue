<template>
    <el-select placeholder="下拉选择分会" size="small" v-model="copyValue" filterable clearable>
        <el-option-group v-for="group of list" :key="group.id" :label="group.name">
            <el-option v-for="item of group.branchList" :key="item.id" :value="item.id" :label="item.name"/>
        </el-option-group>
    </el-select>
</template>

<script>
    export default {
        name: "BranchChooseProps",
        props:{
            value:String,
            list: Array
        },
        data(){
            return {
                copyValue: this.value,
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
