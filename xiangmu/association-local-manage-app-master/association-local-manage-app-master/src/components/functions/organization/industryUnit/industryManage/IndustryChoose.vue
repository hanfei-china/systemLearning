<template>
    <el-select placeholder="下拉选择行业" size="small" :collapse-tags="collapseTags" multiple filterable v-model="copyValue" clearable>
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="item.title"/>
    </el-select>
</template>

<script>
    export default {
        name: "IndustryChoose",
        props:['value','collapseTags'],
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
                this.$request.get('/api/admin/organization/category/listOrganizationCategory').then(res=>{
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
