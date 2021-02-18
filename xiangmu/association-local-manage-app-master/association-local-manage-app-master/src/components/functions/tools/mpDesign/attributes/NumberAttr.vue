<template>
    <attr-container :title="title" :required="required">
        <el-input-number :min="min" :max="max" v-model="copyValue" size="small" />
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "NumberAttr",
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
                        min: 2,
                        max: 10
                    }
                }
            },
            value: {
                type: Number,
                default: 0
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
            max(){
                if(this.attributes && this.attributes.max != undefined && this.attributes.max != null){
                    return this.attributes.max;
                }

                return 10;
            },
            min(){
                if(this.attributes && this.attributes.min != undefined && this.attributes.min != null){
                    return this.attributes.min;
                }

                return 4;
            },
        },
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

<style scoped>

</style>