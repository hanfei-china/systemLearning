<template>
    <el-select v-model="copyValue" :clearable="showClear" size="small"
               :placeholder="placeholder">
        <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.title"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "AdminContentClassResources",
        model:{
            prop: 'value',
            event: 'change'
        },
        props: {
            attributes: {
                type: Object,
                default() {
                    return {
                        showClear: true,
                        placeholder: '请选择内容分类'
                    }
                }
            },
            value: {
                type: String
            },
            required: {
                type: Boolean,
                default: true
            },
            removeClass: {
                type: String,
                default: ''
            },
        },
        computed: {
            placeholder(){
                if (this.attributes && this.attributes.placeholder && this.attributes.placeholder !== '') {
                    return this.attributes.placeholder;
                }

                return '请选择内容分类';
            },
            showClear() {
                if (this.attributes && this.attributes.showClear !== undefined && this.attributes.showClear !== null) {
                    return this.attributes.showClear;
                }

                return false;
            }
        },
        data() {
            return {
                copyValue: this.value,
                loading: false,
                list: []
            }
        },
        methods: {
            getData() {
                this.loading = true;
                this.$request.post('/api/admin/resources/contentClass',{}).then(res=>{
                    if(this.removeClass){
                        this.list = res.data.filter(item=>{
                            return item.id !== this.removeClass;
                        });
                    }else{
                        this.list = res.data;
                    }

                    this.$nextTick(()=>{ this.loading = false; })
                })
            }
        },
        created(){
            this.getData();
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            }
        }
    }
</script>
