<template>
    <attr-container :title="title" :required="required">
        <el-select v-model="copyValue" filterable remote :clearable="showClear" size="small"
                   :placeholder="placeholder" :remote-method="getData">
            <el-option v-for="content in list" :key="content.id" :value="content.id" :label="getMixTitle(content)"/>
        </el-select>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "ContentAttr",
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
                        title: '单个图文选择',
                        showClear: false,
                        placeholder: '请输入内容标题进行搜索'
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

                return '单个图文选择';
            },
            placeholder() {
                if (this.attributes && this.attributes.placeholder && this.attributes.placeholder !== '') {
                    return this.attributes.placeholder;
                }

                return '请输入内容标题进行搜索';
            },
            showClear() {
                if (this.attributes && this.attributes.showClear != undefined && this.attributes.showClear !== null) {
                    return this.attributes.showClear;
                }

                return false;
            },
            branchId(){
                return this.$store.state.branchId;
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
            getMixTitle(item) {
                return `【${item.classTitle}】${item.title}`;
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
                        this.list = data.list;
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                } else {
                    this.list = [];
                    this.$nextTick(()=>{ this.loading = false; })
                }
            }
        },
        created(){
            if(this.copyValue && this.copyValue !== ''){
                let params = {
                    id: this.copyValue,
                    branchId: this.branchId,
                };
                this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                })
            }
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            }
        }
    }
</script>
