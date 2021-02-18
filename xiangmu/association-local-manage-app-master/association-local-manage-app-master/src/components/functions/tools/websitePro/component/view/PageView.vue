<template>
    <div style="position: relative;" v-if="module">
        <div v-if="design" class="website-pro-absolute-fill-parent website-pro-flex center column" style="z-index: 2;background-color: rgba(0,0,0,.7);">
            <div class="website-pro-text-center" style="font-size: 16px; color: white;">页面设计中</div>
        </div>
        <div :style="{width: width+'px',height:height+'px'}">
            <component v-for="child of resultModule.modules" :is="child.name" :key="child.id" :module="child"/>
        </div>
    </div>
</template>

<script>
    import WsButton from "../../component/modules/frequently/wsButton/WsButton";
    import WsText from "../../component/modules/frequently/wsText/WsText";
    import WsImage from "../../component/modules/frequently/wsImage/WsImage";
    import WsFillContainer from "../../component/modules/layout/wsFillContainer/WsFillContainer";
    import WsFreeContainer from "../../component/modules/layout/wsFreeContainer/WsFreeContainer";
    import WsArticleList from "../../component/modules/base/wsArticleList/WsArticleList";
    import WsFormList from "../../component/modules/base/wsFormList/WsFormList";
    import WsGivingTable from "../../component/modules/base/wsGivingTable/WsGivingTable";
    import WsScrollList from "../../component/modules/base/wsScrollList/WsScrollList";
    import WsGreatEvents from "../../component/modules/base/wsGreatEvents/WsGreatEvents";
    import WsMenu from "../../component/modules/base/wsMenu/WsMenu";
    import WsRichText from "../../component/modules/base/wsRichText/WsRichText";
    import WsWheelPlanting from "../../component/modules/base/wsWheelPlanting/WsWheelPlanting";
    import WsBreadcrumb from "../../component/modules/base/wsBreadcrumb/WsBreadcrumb";
    import WsMap from "../../component/modules/base/wsMap/WsMap";

    import PageFooter from '../../js/modules/page/pageFooter';
    import PageHeader from '../../js/modules/page/pageHeader';
    import PageMain from '../../js/modules/page/pageMain';

    import {addEvent,removeEvent} from "../../js/util/dom";
    import Vue from 'vue';
    import WsSideMenu from "../modules/base/wsSideMenu/WsSideMenu";

    export default {
        name: "PageView",
        components:{
            WsSideMenu,
            WsBreadcrumb,
            WsWheelPlanting,
            WsRichText,
            WsMenu,
            WsGreatEvents,
            WsArticleList,
            WsFormList,
            WsGivingTable,
            WsMap,
            WsScrollList,
            WsFreeContainer,
            WsFillContainer, WsImage, WsText, WsButton
        },
        props:{
            moduleId:String,
            type:{
                type: String,
                default: 'main'
            },
            request:{
                type: Boolean,
                default: true
            },
            propModule: Object,
            design: Boolean
        },
        data() {
            return {
                width: window.innerWidth,
                module: {
                    modules: [],
                    title: '',
                    otherSetting:{
                        customCss: '',
                        pageHeaderId: '',
                        pageFooterId: ''
                    }
                },
                styleElement: null
            }
        },
        computed:{
            resultModule(){
                if(this.request){
                    return this.module;
                }else{
                    return this.propModule;
                }
            },
            height(){
                let result = 0;
                for(let module of this.resultModule.modules){
                    let layout = module.attributes.layoutGroup.attributes.layout.value;

                    let {top,height} = layout;

                    if(top+height > result){
                        result = top + height;
                    }

                }

                return result;
            },
            infoUrl(){
                if(this.type === 'main'){
                    return '/api/admin/website/anon/pageMain';
                }else if(this.type === 'header'){
                    return '/api/admin/website/anon/pageHeader';
                }else if(this.type === 'footer'){
                    return '/api/admin/website/anon/pageFooter';
                }else{
                    return '';
                }
            },
            builder(){
                if(this.type === 'main'){
                    return PageMain;
                }else if(this.type === 'header'){
                    return PageHeader;
                }else if(this.type === 'footer'){
                    return PageFooter;
                }else{
                    return null;
                }
            },
        },
        methods: {
            setWidth(){
                this.width = window.innerWidth;
            },
            getPageModuleInfo(){
                if(this.request && this.moduleId && this.infoUrl){
                    this.$request.get(this.infoUrl,{
                        params:{
                            id:this.moduleId
                        }
                    }).then(res=>{
                        let {data} = res;
                        let obj = {
                            title: data.title,
                            id: data.id,
                            modules: JSON.parse(data.modules),
                            otherSetting: JSON.parse(data.otherSetting)
                        };
                        this.module = Vue.observable(new this.builder(obj));
                    })
                }
            },
        },
        created() {
            this.getPageModuleInfo();
            addEvent(window,'resize',this.setWidth);
            let style = document.createElement('style');
            style.innerHTML = this.resultModule.otherSetting.customCss;
            if(document.body.append){
                document.body.append(style);
            }else{
                document.body.appendChild(style);
            }
            this.styleElement = style;
        },
        watch:{
            moduleId(){
                this.getPageModuleInfo();
            },
            'resultModule.otherSetting.customCss':{
                deep: true,
                handler(val){
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
                }
            }
        },
        beforeDestroy() {
            removeEvent(window,'resize',this.setWidth);
        }
    }
</script>
