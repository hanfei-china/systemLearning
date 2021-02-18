<template>
    <el-select :multiple="multiple" placeholder="下拉选择会费标准" size="small" v-model="copyValue" clearable filterable>
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="item.name"/>
    </el-select>
</template>

<script>
    export default {
        name: "DuesTypeChoose",
        props:{
            value:{
                required: true
            },
            multiple: {
                type: Boolean,
                default: false
            },
        },
        data(){
            return {
                copyValue: this.value,
                list: [],
            }
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        methods:{
            getList(){
                this.$request.get('/api/admin/group/getCategoryNameAndIdByName', {
                    params: {
                        type: 7
                    }
                }).then(res => {
                    if (res.success) {
                        this.list = res.data;
                    }
                })
            },
        },
        watch:{
            copyValue(val){
                this.$emit('change',val);
            },
            value(val){
                this.copyValue = val;
            }
        },
        created() {
            this.getList();
        }
    }
</script>
