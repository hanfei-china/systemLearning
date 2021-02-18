<template>
    <div style="background-color: #FFFFFF;">
        <function-title :title="title" :color="titleColor" :icon="titleIcon" style="padding: 8px 16px;"
                        :icon-position="titleIconPosition" v-if="isShowTitle"/>
        <home-btn-layout :list="children" />
    </div>
</template>

<script>
    import FunctionTitle from "../../../common/FunctionTitle";
    import HomeBtnLayout from "./homeBtnLayout";
    export default {
        name: "homeBtnArea",
        components: {HomeBtnLayout, FunctionTitle},
        props: {
            module: Object,
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            isShowTitle() {
                return this.attributes.isShowTitle.value;
            },
            title() {
                return this.attributes.title.value;
            },
            titleColor() {
                return this.attributes.titleColor.value;
            },
            titleIcon() {
                return this.attributes.titleIcon.value;
            },
            titleIconPosition() {
                return this.attributes.titleIconPosition.value;
            },
            children() {
                return this.module.children;
            },
        }
    }
</script>

<style scoped>

</style>