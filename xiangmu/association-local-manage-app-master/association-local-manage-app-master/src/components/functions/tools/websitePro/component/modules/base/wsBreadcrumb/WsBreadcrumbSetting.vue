<template>
    <setting-container ref="setting" :width.sync="module.attributes.layoutGroup.attributes.layout.value.width"
                       :height.sync="module.attributes.layoutGroup.attributes.layout.value.height"
                       :left.sync="module.attributes.layoutGroup.attributes.layout.value.left"
                       :top.sync="module.attributes.layoutGroup.attributes.layout.value.top"
                       :z-index.sync="module.attributes.layoutGroup.attributes.layout.value.zIndex"
                       :title="module.title" :handles="handles" :class="alignClasses"
                       :left-zero="module.attributes.layoutGroup.attributes.layout.value.position === 'relative'"
                       :style="containerStyle" :can-delete="canDelete"
                       @setting="settingModule(module)" @delete="$emit('delete')"
                       @setting-if-setting="settingIfSetting(module)" @refLineParams="getRefLineParams">
        <ws-breadcrumb ref="module" class="lrd-dom-drag" :module="module" design/>
    </setting-container>
</template>

<script>
    import SettingContainer from "../../SettingContainer";
    import WsBreadcrumb from "./WsBreadcrumb";
    export default {
        name: "WsBreadcrumbSetting",
        components: {WsBreadcrumb, SettingContainer},
        props:{
            module: Object,
            canDelete: {
                type: Boolean,
                default: true
            },
        },
        computed:{
            handles(){
                let {position} = this.module.attributes.layoutGroup.attributes.layout.value;

                if(position === 'absolute'){
                    return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
                }else{
                    return ['bm','tm'];
                }
            },
            alignClasses(){

                let {position,align} = this.module.attributes.layoutGroup.attributes.layout.value;

                if(position === 'relative'){

                    if(align === 'left'){
                        return 'website-pro-container-align-left';
                    }

                    if(align === 'right'){
                        return 'website-pro-container-align-right';
                    }

                    if(align === 'center'){
                        return 'website-pro-container-align-center';
                    }
                }

                return '';
            },
            containerStyle(){
                let position = this.module.attributes.layoutGroup.attributes.layout.value.position;
                if(position === 'relative'){
                    return {
                        position: 'absolute',
                        right: 0,
                    }
                }else{
                    return {
                        position: 'absolute',
                    }
                }
            },
        },
        methods:{
            settingModule(module){
                this.$emit('setting',module);
            },
            settingIfSetting(module){
                this.$emit('setting-if-setting',module);
            },
            getRefLineParams (params) {
                this.$emit('refLineParams', params);
            }
        },
        watch:{
            'module.attributes.styleGroup.attributes.padding.value.right'(){
                this.$refs.module.setWidth();
            },
        }
    }
</script>

