<template>
    <el-select ref="container" v-model="copyValue" :clearable="showClear" size="mini"
               :placeholder="placeholder">
        <el-option v-for="item in list" :key="item.id" :value="item.shortId" :label="item.title"/>
    </el-select>
</template>

<script>
    export default {
        name: "PageChoose",
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
                        placeholder: '请选择跳转的页面'
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

                return '请选择跳转的页面';
            },
            showClear() {
                if (this.attributes && this.attributes.showClear !== undefined && this.attributes.showClear !== null) {
                    return this.attributes.showClear;
                }

                return true;
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
                this.$request.get('/api/admin/website/pageMain/list').then(res=>{
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
            }
        }
    }
</script>
