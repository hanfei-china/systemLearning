<template>
    <attr-container :required="required" :title="title">
        <el-date-picker v-model="copyValue" size="small"
                :type="type" :clearable="showClear" :placeholder="placeholder">
        </el-date-picker>
    </attr-container>
</template>

<script>
    import AttrContainer from "./AttrContainer";
    export default {
        name: "DateAttr",
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
                        type: 'datetime',
                        placeholder: '请选择',
                        showClear: false
                    }
                }
            },
            required: {
                type: Boolean,
                default: true
            },
            value: [String, Number, Boolean, Array, Date],
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

                return '请选择';
            },
            showClear(){
                if(this.attributes && this.attributes.showClear){
                    return this.attributes.showClear;
                }

                return false;
            },
            type(){
                if(this.attributes && this.attributes.items){
                    return this.attributes.items;
                }

                return 'datetime';
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

<style scoped>

</style>
