<template>
    <el-select v-model="copyValue" filterable remote reserve-keyword @change="change"
               placeholder="请输入内容名称进行搜索" :remote-method="getData" :loading="loading">
        <el-option v-for="item in contentList" :key="item.id" :label="item.title"
                   :value="item.id">
            {{'【' + item.classTitle + '】' + item.title}}
        </el-option>
    </el-select>
</template>

<script>
    export default {
        name: "ContentList",
        data() {
            return {
                contentList: [],
                loading: false,
                copyValue: this.value
            }
        },
        props: {
            value: null,
        },
        computed: {
            branchId(){
                return this.$store.state.branchId;
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        methods: {
            change(value) {
                this.$emit('change', value);
            },
            getData(value) {
                if (value && value !== '') {
                    this.loading = true;
                    let params = {
                        branchId: this.branchId,
                        title: value,
                    };
                    this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                        let {data} = resp;
                        if(data.list.length > 0){
                            this.contentList = data.list;
                            this.total = data.total;
                        }
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                } else {
                    this.$nextTick(()=>{ this.loading = false; })
                }
            },
        },
        watch:{
            value(val){
                if(val){
                    if(!this.copyValue){
                        this.copyValue = val;
                        let params = {
                            id: val,
                            branchId: this.branchId,
                        };
                        this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                            let {data} = resp;
                            this.contentList = data.list;
                            this.total = data.total;
                        })
                    }
                }
            }
        }
    }
</script>
