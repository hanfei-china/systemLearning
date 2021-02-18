<template>
    <setting-container ref="setting" :width.sync="module.attributes.layoutGroup.attributes.layout.value.width"
                       :height.sync="module.attributes.layoutGroup.attributes.layout.value.height"
                       :left.sync="module.attributes.layoutGroup.attributes.layout.value.left"
                       :top.sync="module.attributes.layoutGroup.attributes.layout.value.top"
                       :z-index.sync="module.attributes.layoutGroup.attributes.layout.value.zIndex"
                       :title="module.title" inner :can-delete="canDelete"
                       @setting="settingModule(module)" @delete="$emit('delete')"
                       @setting-if-setting="settingIfSetting(module)" @refLineParams="getRefLineParams"
                       @resize-stop="resizeStop" >
        <ws-rich-text class="lrd-dom-drag" ref="module" :module="module" design/>
    </setting-container>
</template>

<script>
    import SettingContainer from "../../SettingContainer";
    import WsRichText from "./WsRichText";
    export default {
        name: "WsRichTextSetting",
        components: {WsRichText, SettingContainer},
        props:{
            module: Object,
            canDelete: {
                type: Boolean,
                default: true
            },
        },
        methods:{
            resizeStop(){
                this.$refs.module.setHeight();
            },
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
    }
</script>

