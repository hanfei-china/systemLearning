<template>
    <el-select placeholder="下拉选择单位" size="small" v-model="copyValue" filterable clearable :remote-method="getList">
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="`${item.organizationName}`"/>
    </el-select>
</template>

<script>
    export default {
        name: "UnitChoose",
        props:{
            value:String,
            forDeliver:{
                type: Boolean,
                default: false
            },
            excludeId: String
        },
        computed:{
            adminType(){
                return this.$store.state.adminType;
            }
        },
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
            getList(value){
                let params = {
                    orderWay: 1,
                    limit: 10000000,
                    offset: 0,
                    searchContent: value
                };
                this.$request.get('/api/admin/organization/listOrganizationByCondition',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                })
            },
        },
        created() {
            this.getList();
        }
    }
</script>
