<template>
    <div class="website-pro-flex website-pro-absolute-fill-parent" :style="moduleStyle">
        <component v-for="child of module.modules" :is="child.name" :key="child.id" :module="child"/>
    </div>
</template>

<script>

    import WsPortalNotice from "../wsPortalNotice/WsPortalNotice";
    import WsPortalButton from "../wsPortalButton/WsPortalButton";
    import WsPortalChart from "../wsPortalChart/WsPortalChart";
    import WsPortalRichText from "../wsPortalRichText/WsPortalRichText";
    export default {
        name: "WsCellTabPane",
        components: {
            WsPortalRichText,
            WsPortalChart,
            WsPortalButton,
            WsPortalNotice,
            WsCol: () => import('../wsCol/WsCol'),
            WsRow: () => import('../wsRow/WsRow'),
            WsCellTitleContainer: () => import('../wsCellTitleContainer/WsCellTitleContainer'),
        },
        props:{
            module: Object,
        },
        computed:{
            isHasRow(){
                for(let module of this.module.modules){
                    let {name} = module;
                    if(name === 'wsRow'){
                        return true;
                    }
                }
                return false;
            },
            moduleStyle(){
                let style = {};

                if(this.isHasRow){
                    style.flexDirection= 'column';
                }
                return style;
            },
        },
    }
</script>
