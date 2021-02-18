<template>
    <el-select ref="select" v-model="copyValue" :clearable="showClear" size="mini"
               :placeholder="placeholder">
        <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.title"/>
    </el-select>
</template>

<script>

    export default {
        name: "PageHeaderAttr",
        model:{
            prop: 'value',
            event: 'change'
        },
        props: {
            attributes: {
                type: Object,
                default() {
                    return {
                        showClear: false,
                        placeholder: '请选择页头'
                    }
                }
            },
            value: {
                type: String,
                default: ''
            },
            required: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            placeholder(){
                if (this.attributes && this.attributes.placeholder && this.attributes.placeholder !== '') {
                    return this.attributes.placeholder;
                }

                return '请选择页头';
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
                initComplete: false,

                list: []
            }
        },
        methods: {
            getData() {
                this.loading = true;
                this.$request.get('/api/admin/website/pageHeader/list').then(res=>{
                    let {data} = res;
                    this.list = data;
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
            },
            value(val){
                this.copyValue = val;
            }
        }
    }
</script>
