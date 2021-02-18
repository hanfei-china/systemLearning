<template>
    <el-select ref="container" v-model="copyValue" filterable remote size="mini" :disabled="disabled"
               :placeholder="placeholder" :remote-method="getData">
        <el-option v-for="item in list" :key="item.id" :label="item.title"
                   :value="item.id">
            <div class="website-pro-text-overflow" :title="'【' + item.classTitle + '】' + item.title" style="max-width: 400px;">{{'【' + item.classTitle + '】' + item.title}}</div>
        </el-option>
    </el-select>
</template>

<script>
    export default {
        name: "ContentSetting",
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
                        showClear: true,
                        placeholder: '请输入内容标题进行搜索'
                    }
                }
            },
            value: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            placeholder() {
                if (this.attributes && this.attributes.placeholder && this.attributes.placeholder !== '') {
                    return this.attributes.placeholder;
                }

                return '请输入图文标题进行搜索';
            },
            showClear() {
                if (this.attributes && this.attributes.showClear !== undefined && this.attributes.showClear !== null) {
                    return this.attributes.showClear;
                }

                return true;
            },
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
                this.loading = true;
                let params = {
                    filterUnPublish: true,
                    title: value,
                    offset: 0,
                    limit: 100
                };
                this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            }
        },
        created(){
            if(this.value){
                let params = {
                    id: this.value,
                    filterUnPublish: true,
                };
                this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                })
            }else{
                this.getData();
            }
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            }
        }
    }
</script>
