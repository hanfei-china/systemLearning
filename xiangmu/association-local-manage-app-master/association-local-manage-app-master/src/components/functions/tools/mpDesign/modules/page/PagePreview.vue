<template>
    <el-container
            style="width: 375px;background-color: #F1F1F1;margin: 0 auto;height: 650px;"
            class="position-relative"
            v-if="pageConfig">
        <el-header height="50px" class="unset-padding page-title" style="text-align: center;line-height: 50px;"
                   :style="titleStyle"
                   v-show="hasTitle">
            {{pageConfig.attributes.title.value}}
        </el-header>
        <el-main class="unset-padding position-relative flow-hidden"
                 :class="{'is-has-title': hasTitle}">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel : {scrollingX : false}}">
                    <modules-preview :page-config="pageConfig" :is-design="isDesign"
                                     @module-setting="settingModule" @close-setting="$emit('close-setting')"/>
                </vue-scroll>
                <div class="position-absolute" style="bottom: 10px;z-index: 100;right: 10px;">
                    <side-stop-button v-for="(button,index) of pageConfig.sideStopButtons" :key="index" :module="button"/>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import ModulesPreview from '../pageModules/_moduleCommon/ModulesPreview';
    import sideStopButton from '../pageModules/sideStopButton/sideStopButton';

    export default {
        name: "PagePreview",
        components: {ModulesPreview,sideStopButton},
        props: {
            pageConfig: {
                type: Object,
                default() {
                    return null;
                }
            },
            isDesign: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            hasTitle() {
                // return this.pageConfig.attributes.isShowTitle.value && this.pageConfig.attributes.title.value && this.pageConfig.attributes.title.value != '';
                return true;
            },
            titleStyle() {
                return {
                    color: this.pageConfig.attributes.titleColor.value,
                    backgroundColor: this.pageConfig.attributes.titleBackgroundColor.value
                }
            }
        },
        methods: {
            settingModule(module) {
                this.$emit('module-setting', module);
            },
        }
    }
</script>
