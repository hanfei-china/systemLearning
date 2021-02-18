<template>
    <el-select :multiple="multiple" placeholder="下拉选择会员职务" size="small" v-model="copyValue" clearable filterable :filter-method="getList">
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="item.postName"/>
    </el-select>
</template>

<script>
    export default {
        name: "MemberPostChoose",
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
            getList(postName){
                this.$request.get('/api/admin/post/list',{
                    params:{postName}
                }).then(res=>{
                    this.list = res.data;
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
