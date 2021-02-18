<template>
    <el-select v-model="copyValue" :clearable="showClear" size="small"
               :placeholder="placeholder">
        <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.title"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "LabelClassChoose",
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
                        placeholder: '请选择标签类型'
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

                return '请选择标签类型';
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
                list: []
            }
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            }
        },
        created() {
            this.getList();
        },
        methods: {
            //获取标签分类列表
            getList(){
                this.$request.get('/api/admin/label/manage/listLabels',{params: {limit: 1000,offset: 0}}).then(res => {
                    if(res.success){
                        this.list = res.data.list;
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>