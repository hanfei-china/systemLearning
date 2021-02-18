<template>
    <attr-container :required="required" :title="title">
        <el-select v-model="copyValue" size="small" :clearable="showClear"
                   :placeholder="placeholder">
            <el-option v-for="item in items" :key="item.value" :value="item.value" :label="item.title"></el-option>
        </el-select>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "SelectAttr",
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
                        items: [],
                        placeholder: '请选择',
                        showClear: false
                    }
                }
            },
            required: {
                type: Boolean,
                default: true
            },
            value: [String, Number, Boolean, Array],
        },
        computed:{
            title(){
                if(this.attributes && this.attributes.title && this.attributes.title != ''){
                    return this.attributes.title;
                }

                return '属性标题';
            },
            placeholder(){
                if(this.attributes && this.attributes.placeholder && this.attributes.placeholder != ''){
                    return this.attributes.placeholder;
                }

                return '请输入';
            },
            showClear(){
                if(this.attributes && this.attributes.showClear){
                    return this.attributes.showClear;
                }

                return false;
            },
            items(){
                if(this.attributes && this.attributes.items){
                    return this.attributes.items;
                }

                return [];
            }
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