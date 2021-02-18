<template>
    <div class="website-pro-absolute-fill-parent" :style="style">
        <div class="website-pro-absolute-fill-parent website-pro-flex column">
            <div class="website-pro-unset-padding website-pro-position-relative flex-fill-in-the-remaining-space">
                <div class="website-pro-absolute-fill-parent website-pro website-pro-flex column">
                    <vue-scroll class="flex-fill-in-the-remaining-space">
                        <component v-for="child of module.modules" :is="child.name" :ref="child.id" :key="child.id" :module="child"/>
                    </vue-scroll>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {addEvent,removeEvent} from "../../../../tools/websitePro/js/util/dom";
    import PageMain from "../../../../tools/websitePro/js/modules/page/pageMain";

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
        name: "WebsitePageTemplatePreview",
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
        props:{
            templateConfig: Object,
        },
        data(){
            return {
                style: {},
                provideData: null,

                module: {
                    modules: [],
                    title: '',
                    otherSetting:{
                        customCss: '',
                        pageHeaderId: '',
                        pageFooterId: '',
                        fixedHeader: false
                    }
                },
                loading: true,
                shortId: '',

                width: window.innerWidth,

                styleElement:null
            }
        },
        computed:{
            height(){
                let result = 0;
                if(this.module){
                    for(let module of this.module.modules){
                        let {attributes} = module;

                        let {top,height} = attributes.layoutGroup.attributes.layout.value;

                        if(top+height > result){
                            result = top + height;
                        }

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

            let obj = {
                title: '',
                id: 'main',
                modules: this.templateConfig.modules,
                otherSetting: {
                    customCss: this.templateConfig.otherSetting.customCss
                }
            };

            this.module = Vue.observable(new PageMain(obj));
        },
        mounted(){
            let style = document.createElement('style');
            style.innerHTML = this.module.otherSetting.customCss;
            if(document.body.append){
                document.body.append(style);
            }else{
                document.body.appendChild(style);
            }
            this.styleElement = style;
        },
        beforeDestroy() {
            removeEvent(window,'resize', this.computeContainerStyle);
        },
        watch:{
            'module.otherSetting.customCss'(val){
                if(this.styleElement){
                    this.styleElement.innerHTML = val;
                }else{
                    let style = document.createElement('style');
                    style.innerHTML = val;
                    if(document.body.append){
                        document.body.append(style);
                    }else{
                        document.body.appendChild(style);
                    }
                    this.styleElement = style;
                }
            },
        }
    }
</script>
