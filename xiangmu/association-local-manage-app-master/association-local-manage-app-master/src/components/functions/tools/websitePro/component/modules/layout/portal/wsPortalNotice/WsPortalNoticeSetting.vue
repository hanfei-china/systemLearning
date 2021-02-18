<template>
    <un-resize-setting-container style="flex:1;" ref="setting" :title="module.title"
                                 @setting="settingModule(module)" @delete="$emit('delete')"
                                 @setting-if-setting="settingIfSetting(module)">
       <ws-portal-notice :module="module"/>
    </un-resize-setting-container>
</template>

<script>
    import UnResizeSettingContainer from "../../../UnResizeSettingContainer";
    import WsPortalNotice from "./WsPortalNotice";
    export default {
        name: "WsPortalNoticeSetting",
        components: {WsPortalNotice, UnResizeSettingContainer},
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
