<template>
    <attr-container :required="required" :title="title">
        <el-input type="textarea" :rows="rows" size="small" resize="none"
                  :placeholder="placeholder" :maxlength="maxLength"
                  v-model="copyValue"></el-input>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "TextareaAttr",
        components: {AttrContainer},
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
                        maxLength: 50,
                        placeholder: '请输入',
                        rows: 4
                    }
                }
            },
            required: {
                type: Boolean,
                default: true
            },
            value: {
                type: String,
                default: ''
            },
        },
        computed:{
            title(){
                if(this.attributes && this.attributes.title && this.attributes.title != ''){
                    return this.attributes.title;
                }

                return '属性标题';
            },
            maxLength(){
                if(this.attributes && this.attributes.maxLength){
                    return this.attributes.maxLength;
                }

                return 50;
            },
            placeholder(){
                if(this.attributes && this.attributes.placeholder && this.attributes.placeholder != ''){
                    return this.attributes.placeholder;
                }

                return '请输入';
            },
            rows() {
                if (this.attributes && this.attributes.rows) {
                    return this.attributes.rows;
                }

                return 4;
            },
        },
        data() {
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