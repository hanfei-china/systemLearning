<template>
    <attr-container :title="title" :required="required">
        <el-select v-model="copyValue" :clearable="showClear" size="small"
                   :placeholder="placeholder" filterable>
            <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.title"></el-option>
        </el-select>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "CounselClassAttr",
        components: {
            AttrContainer
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        props: {
            attributes: {
                type: Object,
                default() {
                    return {
                        title: '咨询分类选择',
                        showClear: false,
                        placeholder: '请选择咨询分类'
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

                return '咨询分类选择';
            },
            placeholder(){
                if (this.attributes && this.attributes.placeholder && this.attributes.placeholder !== '') {
                    return this.attributes.placeholder;
                }

                return '请选择咨询分类';
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
                this.$request.get('/api/admin/counsel/messageCategory/getCounselMessageCategories').then(res=>{
                    this.list = res.data.list;
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
