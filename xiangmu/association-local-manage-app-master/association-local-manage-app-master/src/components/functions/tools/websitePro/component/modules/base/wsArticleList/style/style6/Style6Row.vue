<template>
    <div class="website-pro-article-list-style6-row" :class="{'odd': index%2 === 1,'even' : index%2 === 0}">
        <style6-item v-for="(imageText,childIndex) of children" :index="index" :child-index="childIndex"
                     :key="imageText.contentId" :class="{'odd': childIndex%2 === 1,'even' : childIndex%2 === 0}"
                     :image-text="imageText" :labels="labels" :class-id="classId"
                     :item-click="itemClick" :label-click="labelClick" :design="design"
                     :container-style="containerStyle" :triangle-style="triangleStyle"
                     :text-container-style="textContainerStyle"
                     :label-container-style="labelContainerStyle" :label-style="labelStyle"
                     :title-style="titleStyle" :title-format="titleFormat"
                     :abstract-style="abstractStyle" :abstract-format="abstractFormat"
                     :carry-router-menu-id="carryRouterMenuId"/>
    </div>
</template>

<script>
    import Style6Item from "./Style6Item";

    export default {
        name: "Style6Row",
        components: {Style6Item},
        props: {
            labels: Array,
            itemClick: Object,
            labelClick: Object,
            classId: String,
            design: Boolean,
            children: Array,
            index: Number,

            containerStyle: Object,
            textContainerStyle: Object,
            labelContainerStyle: Object,
            labelStyle: Object,
            titleStyle: Object,
            titleFormat: Function,
            abstractStyle: Object,
            abstractFormat: Function,
            triangleConfig: Object,
            carryRouterMenuId: String,
        },
        computed: {
            triangleStyle() {
                let {backgroundColor, height, top, width} = this.triangleConfig;
                let preHeight = Math.floor(height.value /2);
                let style = {
                    borderBottom: `${preHeight}px solid transparent`,
                    borderTop: `${preHeight}px solid transparent`,
                    top: `${top.value}px`
                };
                if(this.index % 2 === 1){
                    style.borderRight = `${width.value}px solid ${backgroundColor.value}`;
                }else{
                    style.borderLeft = `${width.value}px solid ${backgroundColor.value}`;
                }
                return style;
            }
        }
    }
</script>
