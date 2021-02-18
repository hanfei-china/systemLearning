<template>
    <un-resize-setting-container style="flex:1;" ref="setting" :title="module.title"
                                 @setting="settingModule(module)" @delete="$emit('delete')"
                                 @setting-if-setting="settingIfSetting(module)">
        <ws-portal-button :module="module" design/>
    </un-resize-setting-container>
</template>

<script>
    import UnResizeSettingContainer from "../../../UnResizeSettingContainer";
    import WsPortalButton from "./WsPortalButton";
    export default {
        name: "WsPortalButtonSetting",
        components: {WsPortalButton, UnResizeSettingContainer},
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
        },
    }
</script>
