<template>
    <el-select placeholder="下拉选择分会" size="small" v-model="copyValue" filterable clearable>
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="`${item.name}（${item.branchType === 1 ? '总会' : item.branchClassName}）`"/>
    </el-select>
</template>

<script>
    export default {
        name: "BranchChoose",
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
            getList(){
                this.$request.get('/api/common/branch/branchList',{params:{needMain:true}}).then(data=>{
                    let list = data.data.list;

                    if(this.forDeliver){
                        if(this.adminType === 1){
                            list = list.filter(branch=>{
                                return branch.branchType === 2;
                            })
                        }else{
                            list = list.filter(branch=>{
                                return branch.branchType === 1;
                            })
                        }
                    }

                    if(this.excludeId){
                        list = list.filter(branch=>{
                            return branch.id !== this.excludeId;
                        })
                    }

                    this.list = list;
                })
            },
        },
        created() {
            this.getList();
        }
    }
</script>
