<template>
    <el-select :placeholder="placeholder" size="small" :multiple="multiple" v-model="copyValue" filterable :remote-method="getList" clearable>
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="`${item.memberName}-${item.name}`"/>
    </el-select>
</template>

<script>
    export default {
        name: "MemberContactsChoose",
        props:{
            value:[String,Array],
            placeholder:{
                type: String,
                default: '下拉选择联系人'
            },
            memberId: String,
            multiple:{
                type: Boolean,
                default: false
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
                let ids = [];
                if(this.value){
                    if(typeof this.value === 'string'){
                        ids = [this.value];
                    }else{
                        ids = this.value;
                    }
                }
                this.$request.get('/api/admin/member/contacts/list',
                    {params:{keyword,ids,limit:200,offset:0,
                            memberId:this.memberId}}).then(data=>{
                    this.list = data.data.list;
                })
            },
        },
        created() {
            this.getList();
        }
    }
</script>
