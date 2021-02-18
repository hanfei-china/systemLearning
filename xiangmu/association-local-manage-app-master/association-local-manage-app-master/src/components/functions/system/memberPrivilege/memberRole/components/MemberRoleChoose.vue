<template>
    <el-select v-model="copyValue" :size="size" :placeholder="placeholder" >
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="item.name"/>
    </el-select>
</template>

<script>
    export default {
        name: "MemberRoleChoose",
        props: {
            value: String,
            placeholder:{
                type: String,
                default: '请选择角色'
            },
            size: String,
            propsRoles: Array
        },
        data(){
            return {
                list: [],
                copyValue: this.value || []
            }
        },
        model:{
            prop:'value',
            event: 'change'
        },
        methods:{
            getList(){
                if(this.propsRoles && this.propsRoles.length>0){
                    this.list = this.propsRoles;
                }else{
                    this.$request.get('/api/admin/group/getGroup', {params: {type: '8'}}).then(res => {
                        this.list = res.data;
                    });
                }
            }
        },
        created() {
            this.getList();
        },
        watch:{
            copyValue(val){
                this.$emit('change',val);
            },
            value(val){
                if(!this.copyValue){
                    this.copyValue = val;
                }
            }
        }
    }
</script>
