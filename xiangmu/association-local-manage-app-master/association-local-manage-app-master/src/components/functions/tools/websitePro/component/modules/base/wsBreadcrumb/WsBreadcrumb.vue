<template>
    <div class="website-pro-absolute-fill-parent website-pro-breadcrumb website-pro-flex" :class="[customClasses,alignClasses]" :style="style">
        <div ref="container">
            <div class="website-pro-flex">
                <div class="flex flex-center flex-column" v-show="preContent" :style="itemStyle">
                    <span>{{preContent}}</span>
                </div>
                <div class="flex flex-center flex-column" style="white-space:nowrap;">
                    <el-breadcrumb v-if="dataSrc === 1" class="flex" separator-class="el-icon-arrow-right" style="white-space:nowrap;">
                        <ws-breadcrumb-item :item-style="itemStyle" v-for="child of module.modules" :key="child.id" :design="design" :module="child"/>
                    </el-breadcrumb>
                    <el-breadcrumb v-else class="flex" separator-class="el-icon-arrow-right" style="white-space:nowrap;">
                        <ws-breadcrumb-item :item-style="itemStyle" v-for="child of module.prefixModules" :key="child.id" :design="design" :module="child"/>
                        <el-breadcrumb-item :style="itemStyle" v-for="menu of viewMenu" :key="menu.id">
                            <a :href="menu.index" draggable="false" :target="menu.target">{{menu.title}}</a>
                        </el-breadcrumb-item>
                        <ws-breadcrumb-item :item-style="itemStyle" v-for="child of module.suffixModules" :key="child.id" :design="design" :module="child"/>
                    </el-breadcrumb>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PageHeader from '../../../../js/modules/page/pageHeader';
    import Vue from 'vue';

    import {commonLink} from "../../../../js/util/util";
    import WsBreadcrumbItem from "./WsBreadcrumbItem";
    import {addListener, removeListener} from 'resize-detector';

    export default {
        name: "WsBreadcrumb",
        components: {WsBreadcrumbItem},
        props:{
            module: Object,
            design: Boolean
        },
        computed:{
            alignClasses(){

                let {position,align} = this.module.attributes.layoutGroup.attributes.layout.value;

                if(position === 'relative'){

                    if(align === 'left'){
                        return 'website-pro-container-align-left';
                    }

                    if(align === 'right'){
                        return 'website-pro-container-align-right';
                    }

                    if(align === 'center'){
                        return 'website-pro-container-align-center';
                    }
                }

                return '';
            },
            customClasses(){
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            isPage() {
                let path = this.$route.name;
                return path === 'page';
            },
            preContent(){
                return this.module.attributes.extendsGroup.attributes.preContent.value;
            },
            defaultActive() {
                if (this.isPage) {
                    return this.$route.params.moduleId;
                }
                return '';
            },
            style(){
                let style = {
                    paddingTop: this.module.attributes.styleGroup.attributes.padding.value.top + 'px',
                    paddingBottom: this.module.attributes.styleGroup.attributes.padding.value.bottom + 'px',
                    paddingLeft: this.module.attributes.styleGroup.attributes.padding.value.left + 'px',
                    paddingRight: this.module.attributes.styleGroup.attributes.padding.value.right + 'px',
                };

                if(!this.design){
                    style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
                    style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                    style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
                    style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                    style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                    style.position = 'absolute';

                    let position = this.module.attributes.layoutGroup.attributes.layout.value.position;
                    if(position === 'relative'){
                        style.right = 0;
                    }
                }

                return style;
            },
            dataSrc(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.dataSrc;
            },
            pageHeader(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.pageHeader;
            },
            fullPath(){
                return '#'+this.$route.fullPath;
            },
            menuId(){
                return this.$route.query.menuId;
            },
            viewMenu(){
                let item = [];
                for(let menu of this.menus){
                    for(let menuItem of menu.modules){
                        let {index,modules} = menuItem;

                        if(index === this.fullPath){
                            item.push(menuItem) ;
                            return item;
                        }else{
                            for(let child of modules){
                                let {index:subIndex} = child;

                                if(subIndex === this.fullPath){
                                    item.push(menuItem);
                                    item.push(child);
                                    return item;
                                }
                            }
                        }
                    }
                }

                if(this.menuId){
                    for(let menu of this.menus){
                        for(let menuItem of menu.modules){
                            let {id,modules} = menuItem;

                            if(id === this.menuId){
                                item.push(menuItem) ;
                                return item;
                            }else{
                                for(let child of modules){
                                    let {id:subIndex} = child;

                                    if(subIndex === this.menuId){
                                        item.push(menuItem);
                                        item.push(child);
                                        return item;
                                    }
                                }
                            }
                        }
                    }
                }

                return item;
            },
            itemStyle(){
                return {
                    color: this.module.attributes.fontGroup.attributes.font.value.color,
                    fontFamily: this.module.attributes.fontGroup.attributes.font.value.fontFamily,
                    fontSize: this.module.attributes.fontGroup.attributes.font.value.fontSize,
                    textDecoration: this.module.attributes.fontGroup.attributes.font.value.textDecoration ? 'underline' : 'none',
                    fontStyle: this.module.attributes.fontGroup.attributes.font.value.italic ? 'italic' : 'normal',
                    fontWeight: this.module.attributes.fontGroup.attributes.font.value.bold ? 'bold' : 'normal',
                }
            },
        },
        methods:{
            getPageModuleInfo(){
                if(this.pageHeader){
                    this.$request.get('/api/admin/website/anon/pageHeader',{
                        params:{
                            id: this.pageHeader
                        }
                    }).then(res=>{
                        let {data} = res;
                        let modules= JSON.parse(data.modules);
                        let obj = {
                            title: data.title,
                            id: data.id,
                            modules,
                            otherSetting: JSON.parse(data.otherSetting)
                        };

                        this.pageHeaderInfo = Vue.observable(new PageHeader(obj));

                        this.menus = this.getMenus([]);
                    })
                }
            },
            getLink(linkConfig){
                return commonLink(this.$router,linkConfig);
            },
            getTarget(href,target){
                if(href === 'javascript:;'){
                    return '_self';
                }
                return target;
            },
            getMenus(menus,modules){
                if(!modules){
                    modules = this.pageHeaderInfo.modules;
                }

                for(let module of modules){
                    let {name, modules: children} = module;
                    if(name === 'wsMenu'){
                        let temp = {...module};
                        for(let menu of temp.modules){
                            let linkConfig = menu.attributes.linkGroup.attributes.linkConfig.value;
                            let href = this.getLink(linkConfig);
                            menu.index = href;
                            menu.target = this.getTarget(href,linkConfig.target);
                            for(let child of menu.modules){
                                let childLinkConfig = child.attributes.linkGroup.attributes.linkConfig.value;
                                let childHref = this.getLink(childLinkConfig);
                                child.index = childHref;
                                child.target = this.getTarget(childHref,childLinkConfig.target);
                            }
                        }
                        menus.push(temp);
                    }

                    if(name === 'wsFillContainer' || name === 'wsFreeContainer'){
                        this.getMenus(menus,children);
                    }
                }

                return menus;
            },
            setWidth(){
                this.width = this.$refs.container.clientWidth + this.module.attributes.styleGroup.attributes.padding.value.right;
            }
        },
        data(){
            return {
                pageHeaderInfo:{
                    modules: [],
                    title: '',
                    otherSetting:{
                        customCss: '',
                        pageHeaderId: '',
                        pageFooterId: ''
                    }
                },
                menus: [],
                width: 0
            }
        },
        created(){
            this.getPageModuleInfo();
        },
        mounted() {
            this.setWidth();
            addListener(this.$refs.container, this.setWidth);
        },
        beforeDestroy() {
            removeListener(this.$refs.container, this.setWidth);
        },
        watch:{
            pageHeader(){
                this.getPageModuleInfo();
            },
            width(val){
                if(val){
                    this.module.attributes.layoutGroup.attributes.layout.value.width = val;
                }
            },
        }
    }
</script>

