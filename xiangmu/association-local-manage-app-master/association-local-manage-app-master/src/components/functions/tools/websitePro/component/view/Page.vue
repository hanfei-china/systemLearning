<template>
    <div class="website-pro-fixed-fill-parent website-pro website-pro-flex column" :style="style">
        <page-view style="z-index: 2;" :module-id="module.otherSetting.pageHeaderId"
                   v-if="module.otherSetting.fixedHeader && module.otherSetting.pageHeaderId" type="header"/>
        <vue-scroll class="flex-fill-in-the-remaining-space">
            <page-view style="z-index: 2;" :module-id="module.otherSetting.pageHeaderId"
                       v-if="!module.otherSetting.fixedHeader && module.otherSetting.pageHeaderId" type="header"/>
            <page-view style="z-index: 1;" :module-id="moduleId" v-if="moduleId" type="main" :prop-module="module" :request="false"/>
            <page-view style="z-index: 2;" :module-id="module.otherSetting.pageFooterId" v-if="module.otherSetting.pageFooterId" type="footer"/>
        </vue-scroll>
    </div>
</template>

<script>
    import PageMain from '../../js/modules/page/pageMain';
    import {addEvent,removeEvent} from "../../js/util/dom";
    import PageView from "./PageView";

    export default {
        name: "Page",
        components: {PageView},
        data(){
            return {
                style: {},
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
                loading: false
            }
        },
        computed:{
            moduleId(){
                return this.$route.params.moduleId;
            },
            systemName(){
                return this.$store.state.systemSetting.systemName;
            },
            pageTitle(){
                if(this.module && this.module && this.module.otherSetting){
                    return this.module.otherSetting.pageTitle || this.systemName;
                }else{
                    return this.systemName;
                }
            },
            keywords(){
                if(this.module && this.module && this.module.otherSetting){
                    return this.module.otherSetting.keywords;
                }

                return null;
            },
            systemFavicon(){
                return this.$store.state.systemSetting.systemFavicon;
            }
        },
        metaInfo(){
            return {
                title: this.pageTitle,
                link: [{
                    rel: 'icon',
                    href: this.systemFavicon
                }],
                meta: [{
                    name: 'keywords',
                    content: this.keywords
                }]
            }
        },
        methods:{
            computeContainerStyle(){
                this.style = {
                    width: window.innerWidth+'px',
                    height: window.innerHeight+'px'
                };
            },
            getModuleInfo(){
                if(this.moduleId){
                    this.loading = true;
                    this.$request.get('/api/admin/website/anon/pageMain',{
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

                        this.module = new PageMain(obj);
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }
            },
        },
        created() {
            this.computeContainerStyle();
            addEvent(window,'resize',this.computeContainerStyle);
            this.getModuleInfo();
        },
        beforeDestroy() {
            removeEvent(window,'resize',this.computeContainerStyle);
        },
        watch:{
            moduleId(){
                this.getModuleInfo();
            }
        }
    }
</script>
