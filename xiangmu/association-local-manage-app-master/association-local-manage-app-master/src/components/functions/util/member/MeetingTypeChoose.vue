<template>
    <el-select :disabled="disabled" placeholder="下拉选择会议类型" size="small" v-model="copyValue" clearable filterable>
        <el-option v-for="item of list" :key="item.id" :value="item.id" :label="item.title"/>
    </el-select>
</template>

<script>
    export default {
        name: "MeetingTypeChoose",
        props:{
            value:{
                required: true
            },
            disabled: Boolean,
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
                this.$request.get('/api/admin/meeting/getMeetingClasses',{params:{meetingClassNameSearch:''}}).then(res=>{
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
