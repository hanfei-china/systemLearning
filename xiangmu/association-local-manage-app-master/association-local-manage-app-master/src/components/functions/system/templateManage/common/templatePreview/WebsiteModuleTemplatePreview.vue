<template>
    <div class="website-pro-absolute-fill-parent">
        <vue-scroll class="flex-fill-in-the-remaining-space website-pro-flex column">
            <component :is="module.name" :ref="module.id" :module="module"/>
        </vue-scroll>
    </div>
</template>

<script>
    import {moduleBuilder} from "../../../../tools/websitePro/js/modules/moduleBuilder";
    import {addEvent, removeEvent} from "../../../../tools/websitePro/js/util/dom";
    import Vue from "vue";

    import WsButton from "../../../../tools/websitePro/component/modules/frequently/wsButton/WsButton";
    import WsText from "../../../../tools/websitePro/component/modules/frequently/wsText/WsText";
    import WsImage from "../../../../tools/websitePro/component/modules/frequently/wsImage/WsImage";
    import WsFillContainer from "../../../../tools/websitePro/component/modules/layout/wsFillContainer/WsFillContainer";
    import WsFreeContainer from "../../../../tools/websitePro/component/modules/layout/wsFreeContainer/WsFreeContainer";
    import WsArticleList from "../../../../tools/websitePro/component/modules/base/wsArticleList/WsArticleList";
    import WsGreatEvents from "../../../../tools/websitePro/component/modules/base/wsGreatEvents/WsGreatEvents";
    import WsMenu from "../../../../tools/websitePro/component/modules/base/wsMenu/WsMenu";
    import WsRichText from "../../../../tools/websitePro/component/modules/base/wsRichText/WsRichText";
    import WsWheelPlanting from "../../../../tools/websitePro/component/modules/base/wsWheelPlanting/WsWheelPlanting";
    import WsBreadcrumb from "../../../../tools/websitePro/component/modules/base/wsBreadcrumb/WsBreadcrumb";

    import WsSideMenu from "../../../../tools/websitePro/component/modules/base/wsSideMenu/WsSideMenu";

    export default {
        name: "WebsiteModuleTemplatePreview",
        props:{
            templateConfig:Object,
            moduleId: String
        },
        components: {
            WsSideMenu,
            WsBreadcrumb,
            WsWheelPlanting,
            WsRichText,
            WsMenu,
            WsGreatEvents,
            WsArticleList,
            WsFreeContainer,
            WsFillContainer, WsImage, WsText, WsButton
        },
        data(){
            return {
                style: {},

                module: {},

                width: window.innerWidth,
            }
        },
        computed:{
            height(){
                let result = 0;
                if(this.module){
                    let {attributes} = this.module;

                    let {top,height} = attributes.layoutGroup.attributes.layout.value;

                    if(top+height > result){
                        result = top + height;
                    }
                }

                return result;
            }
        },
        methods:{
            computeContainerStyle(){
                this.width = window.innerWidth;
                this.style = {
                    width: window.innerWidth+'px',
                    height: window.innerHeight-60+'px'
                };
            },
        },
        created() {
            this.computeContainerStyle();
            addEvent(window,'resize',this.computeContainerStyle);

            this.module = Vue.observable(moduleBuilder(this.moduleId,this.templateConfig));
        },
        beforeDestroy() {
            removeEvent(window,'resize', this.computeContainerStyle);
        },
    }
</script>
