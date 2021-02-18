<template>
    <el-select :placeholder="placeholder" size="small" v-model="copyValue" filterable :remote-method="getList" clearable>
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="item.name"/>
    </el-select>
</template>

<script>
    export default {
        name: "MemberChoose",
        props:{
            value:String,
            placeholder:{
                type: String,
                default: '下拉选择会员'
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
            getList(keyword){
                this.$request.get('/api/admin/member/commonList',{params:{keyword,id:this.value}}).then(data=>{
                    this.list = data.data;
                })
            },
        },
        created() {
            this.getList();
        }
    }
</script>
