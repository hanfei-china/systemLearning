<template>
    <attr-container :title="title" :required="required">
        <el-color-picker size="small" v-model="copyValue" :show-alpha="showAlpha" :class="clearPickClass" :predefine="predefine"/>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "ColorAttr",
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
                        showAlpha: true,
                        showClear: true,
                        showPick: true,
                        predefine: []
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
        computed:{
            title(){
                if(this.attributes && this.attributes.title && this.attributes.title !== ''){
                    return this.attributes.title;
                }

                return '属性标题';
            },
            showAlpha(){
                if(this.attributes && this.attributes.showAlpha !== undefined && this.attributes.showAlpha !== null){
                    return this.attributes.showAlpha;
                }

                return true;
            },
            clearPickClass(){
                let styleClass = {};

                if(this.attributes && this.attributes.showClear === false){
                    styleClass['hide-clear'] = true;
                }

                if(this.attributes && this.attributes.showPick === false){
                    styleClass['hide-pick'] = true;
                }

                return styleClass;
            },
            predefine(){
                if(this.attributes && this.attributes.predefine){
                    return this.attributes.predefine;
                }

                return [];
            }
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
