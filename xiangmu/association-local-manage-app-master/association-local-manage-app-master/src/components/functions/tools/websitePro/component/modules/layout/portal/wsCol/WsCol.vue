<template>
   <div class="website-pro-module-col website-pro-flex" :style="moduleStyle" style="position: relative;">
       <component v-for="child of module.modules" :is="child.name" :key="child.id" :module="child"/>
   </div>
</template>

<script>

    import WsPortalNotice from "../wsPortalNotice/WsPortalNotice";
    import WsPortalButton from "../wsPortalButton/WsPortalButton";
    import WsPortalChart from "../wsPortalChart/WsPortalChart";
    import WsPortalRichText from "../wsPortalRichText/WsPortalRichText";
    export default {
        name: "WsCol",
        components: {
            WsPortalRichText,
            WsPortalChart,
            WsPortalButton,
            WsPortalNotice,
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
                let style = {
                    flex: this.module.attributes.layoutGroup.attributes.width.value,
                    marginTop: this.module.attributes.layoutGroup.attributes.margin.value.top + 'px',
                    marginBottom: this.module.attributes.layoutGroup.attributes.margin.value.bottom + 'px',
                    marginLeft: this.module.attributes.layoutGroup.attributes.margin.value.left + 'px',
                    marginRight: this.module.attributes.layoutGroup.attributes.margin.value.right + 'px',
                };

                if(this.isHasRow){
                    style.flexDirection= 'column';
                }
                return style;
            },
        },
    }
</script>
