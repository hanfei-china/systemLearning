<template>
    <el-select placeholder="下拉选择分会类型" size="small" v-model="copyValue" clearable>
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="item.name">
            <i class="el-icon-lock" v-show="!item.isUsed"></i>{{item.name}}
        </el-option>
    </el-select>
</template>

<script>
    export default {
        name: "BranchTypeChoose",
        props:['value'],
        data(){
            return {
                copyValue: this.value,
                list: []
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
        methods:{
            getList(){
                this.$request.get('/api/admin/branchType/getBranchTypeInfos').then(res=>{
                    if (res.success) {
                        this.list = res.data;
                    }
                })
            },
        },
        created() {
            this.getList();
        }
    }
</script>
