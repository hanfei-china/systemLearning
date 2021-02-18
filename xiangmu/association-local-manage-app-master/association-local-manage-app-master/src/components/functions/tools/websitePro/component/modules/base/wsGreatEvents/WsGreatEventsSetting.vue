<template>
    <setting-container ref="setting" :width="module.attributes.layoutGroup.attributes.layout.value.width"
                       :height="module.attributes.layoutGroup.attributes.layout.value.height"
                       :left="module.attributes.layoutGroup.attributes.layout.value.left"
                       :top.sync="module.attributes.layoutGroup.attributes.layout.value.top"
                       :z-index.sync="module.attributes.layoutGroup.attributes.layout.value.zIndex"
                       :handles="[]" left-zero style="position: absolute;right: 0;width: auto;"  :title="module.title" inner :can-delete="canDelete"
                       @setting="settingModule(module)" @delete="$emit('delete')"
                       @setting-if-setting="settingIfSetting(module)" @refLineParams="getRefLineParams">
        <ws-great-events class="lrd-dom-drag" :module="module" design/>
    </setting-container>
</template>

<script>
    import SettingContainer from "../../SettingContainer";
    import WsGreatEvents from "./WsGreatEvents";
    export default {
        name: "WsGreatEventsSetting",
        components: {WsGreatEvents, SettingContainer},
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

