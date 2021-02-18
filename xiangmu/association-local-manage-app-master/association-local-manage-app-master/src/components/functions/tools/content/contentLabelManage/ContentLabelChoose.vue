<template>
    <el-select v-model="copyValue" multiple placeholder="最多可选三个标签" style="width: 100%;" @change="change">
        <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id"
                   :disabled="item.disabled"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "ContentLabelChoose",
        props: {
            classId: {
                type: String,
                default() {
                    return null;
                }
            },
            value: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                copyValue: [],
                options: [],
            }
        },
        methods: {
            getContentLabels() {
                this.$request.get('/api/admin/contentLabel/list',{
                    params:{title: this.title,classId: this.classId}
                }).then(res=>{
                    this.options = res.data;
                })
            },
            change(value) {
                if (value.length > 3) {
                    this.options = this.options.map(item => {
                        item.disabled = value.indexOf(item.id) === -1;
                        return item;
                    });
                } else if (value.length === 3) {
                    this.options = this.options.map(item => {
                        item.disabled = value.indexOf(item.id) === -1;
                        return item;
                    });
                    this.$emit('change', value);
                } else {
                    this.options = this.options.map(item => {
                        item.disabled = false;
                        return item;
                    });
                    this.$emit('change', value);
                }
            },
        },
        mounted() {
            this.getContentLabels();
        },
        watch:{
            value(value){
                if(this.copyValue.length < 1){
                    this.copyValue = JSON.parse(JSON.stringify(value));
                }
            }
        }
    }
</script>
