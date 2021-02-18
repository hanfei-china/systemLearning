<template>
    <setting-container ref="setting" :width.sync="module.attributes.layoutGroup.attributes.layout.value.width"
                       :height.sync="module.attributes.layoutGroup.attributes.layout.value.height"
                       :left.sync="module.attributes.layoutGroup.attributes.layout.value.left"
                       :top.sync="module.attributes.layoutGroup.attributes.layout.value.top"
                       :z-index.sync="module.attributes.layoutGroup.attributes.layout.value.zIndex"
                       :title="module.title" :can-delete="canDelete"
                       @setting="settingModule(module)" @delete="$emit('delete')"
                       @setting-if-setting="settingIfSetting(module)" @refLineParams="getRefLineParams">
        <ws-menu class="lrd-dom-drag" :module="module" design/>
    </setting-container>
</template>

<script>
    import SettingContainer from "../../SettingContainer";
    import WsMenu from "./WsMenu";
    export default {
        name: "WsMenuSetting",
        components: {WsMenu, SettingContainer},
        props:{
            module: Object,
            canDelete: {
                type: Boolean,
                default: true
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
        }
    }
</script>

