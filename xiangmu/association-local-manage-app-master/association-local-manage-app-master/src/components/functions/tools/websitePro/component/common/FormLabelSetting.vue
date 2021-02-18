<template>
    <el-select ref="container" v-model="copyValue" :clearable="showClear" size="mini" :disabled="disabled"
               :placeholder="placeholder">
        <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.formTitle"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "FormLabelSetting",
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
                        placeholder: '请选择表单标签'
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
            },
            classId:{
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            placeholder(){
                if (this.attributes && this.attributes.placeholder && this.attributes.placeholder !== '') {
                    return this.attributes.placeholder;
                }

                return '请选择表单标签';
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
                if(this.classId){
                    this.loading = true;
                    this.$request.get('/api/admin/onlineForm/list',{
                        params:{classId: this.classId}
                    }).then(res=>{
                        this.list = res.data.list;
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }
            }
        },
        created(){
            this.getData();
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            },
            classId(){
                this.copyValue = '';
                this.$emit('change', '');
                this.getData();
            }
        }
    }
</script>
