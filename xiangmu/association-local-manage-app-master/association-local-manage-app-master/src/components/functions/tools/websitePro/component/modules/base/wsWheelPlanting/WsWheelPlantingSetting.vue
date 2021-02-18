<template>
    <setting-container ref="setting" :width="parentWidth"
                       :height.sync="module.attributes.layoutGroup.attributes.layout.value.height"
                       :left="module.attributes.layoutGroup.attributes.layout.value.left"
                       :top.sync="module.attributes.layoutGroup.attributes.layout.value.top"
                       :z-index.sync="module.attributes.layoutGroup.attributes.layout.value.zIndex"
                       :handles="['bm','tm']" left-zero style="position: absolute;right: 0;" :title="module.title" inner :can-delete="canDelete"
                       @setting="settingModule(module)" @delete="$emit('delete')"
                       @setting-if-setting="settingIfSetting(module)" @refLineParams="getRefLineParams">
        <ws-wheel-planting :module="module" design/>
    </setting-container>
</template>

<script>
    import SettingContainer from "../../SettingContainer";
    import WsWheelPlanting from "./WsWheelPlanting";

    export default {
        name: "WsWheelPlantingSetting",
        components: {WsWheelPlanting, SettingContainer},
        props:{
            module: Object,
            parentWidth: Number,
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
