<template>
    <setting-container ref="setting" :width.sync="module.attributes.layoutGroup.attributes.layout.value.width"
                       :height.sync="module.attributes.layoutGroup.attributes.layout.value.height"
                       :left.sync="module.attributes.layoutGroup.attributes.layout.value.left"
                       :top.sync="module.attributes.layoutGroup.attributes.layout.value.top"
                       :z-index.sync="module.attributes.layoutGroup.attributes.layout.value.zIndex"
                       :title="module.title" :can-delete="canDelete"
                       @setting="settingModule(module)" @delete="$emit('delete')"
                       @setting-if-setting="settingIfSetting(module)" @refLineParams="getRefLineParams">
        <ws-p-d-f-image v-if="module.attributes.srcGroup.attributes.src.value" class="lrd-dom-drag" :module="module" design/>
        <div v-else class="website-pro-image-upload-tip website-pro-flex column center lrd-dom-drag" v-show="!module.attributes.src">
            <div class="website-pro-text-center lrd-dom-drag" style="font-size: 12px;color: #EEEEEE;">
                点击上传图片
            </div>
        </div>
    </setting-container>
</template>

<script>
    import SettingContainer from "../../SettingContainer";
    import WsPDFImage from "./WsPDFImage";
    export default {
        name: "WsPDFImageSetting",
        components: {WsPDFImage, SettingContainer},
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

