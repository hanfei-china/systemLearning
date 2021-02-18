<template>
    <attr-container :title="title" :required="required">
        <group-tree v-model="copyValue" :is-multiple="false" size="small"
                    :group-type="groupType" :placeholder="`请选择上级${typeName}`" :max-level="maxLevel"/>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';
    import GroupTree from "../../../util/group/GroupTree";

    export default {
        name: "CommonGroupAttr",
        components: {
            GroupTree,
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
                        maxLevel: null,
                        groupType: '4',
                        typeName: '',
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
            maxLevel(){
                return this.attributes.maxLevel;
            },
            groupType(){
                return this.attributes.groupType;
            },
            typeName(){
                return this.attributes.typeName;
            }
        },
        data(){
            return {
                copyValue: [this.value]
            }
        },
        watch:{
            copyValue(value){
                if(value){
                    this.$emit('change', value[0]);
                }else{
                    this.$emit('change', value);
                }
            },
            value(val){
                if(!this.copyValue || this.copyValue.length < 1 || !this.copyValue[0]){
                    this.copyValue = [val];
                }
            }
        }
    }
</script>
