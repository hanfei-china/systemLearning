<template>
    <el-select v-model="copyValue" filterable remote :clearable="showClear" size="small"
               :placeholder="placeholder" :remote-method="getData">
        <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.formTitle"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "OnlineFormChoose",
        model:{
            prop: 'value',
            event: 'change'
        },
        props: {
            attributes: {
                type: Object,
                default() {
                    return {
                        title: '在线表单选择',
                        showClear: false,
                        placeholder: '请输入在线表单标题进行搜索'
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
            title() {
                if (this.attributes && this.attributes.title && this.attributes.title !== '') {
                    return this.attributes.title;
                }

                return '在线表单选择';
            },
            placeholder() {
                if (this.attributes && this.attributes.placeholder && this.attributes.placeholder !== '') {
                    return this.attributes.placeholder;
                }

                return '请输入在线表单标题进行搜索';
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
            getData(value) {
                let params = {
                    formTitle: value,
                };
                this.$request.get('/api/admin/onlineForm/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
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
