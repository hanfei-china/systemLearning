<template>
    <attr-container :title="title" :required="required">
        <el-checkbox size="small" v-model="copyValue">{{content}}</el-checkbox>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "CheckboxAttr",
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
                        title: '属性标题',
                        content: '文字描述'
                    }
                }
            },
            value: {
                type: Boolean,
                default: true
            },
            required: {
                type: Boolean,
                default: true
            }
        },
        computed:{
            title(){
                if(this.attributes && this.attributes.title && this.attributes.title != ''){
                    return this.attributes.title;
                }

                return '属性标题';
            },
            content(){
                if(this.attributes && this.attributes.content && this.attributes.content != ''){
                    return this.attributes.content;
                }

                return '文字描述';
            }
        },
        // model:{
        //   prop: 'value',
        //   event: 'change'
        // },
        data(){
            return {
                copyValue: this.value
            }
        },
        watch:{
            copyValue(value){
                this.$emit('change', value);
            }
        }
    }
</script>