<template>
    <div :style="style" style="overflow: hidden;"
         class="website-pro-module website-pro-absolute-fill-parent website-pro-article-list" :class="customClasses">
        <div :class="{'lrd-dom-drag':design}" ref="contentList">
            <div v-show="showMore || showTitle" ref="title" :style="titleContainerStyle" class="website-pro-flex website-pro-article-list-header"
                 :class="{'lrd-dom-drag':design}">
                <div class="flex-fill-in-the-remaining-space website-pro-article-list-title website-pro-flex column center"
                     :class="{'lrd-dom-drag':design}">
                    <span :style="titleStyle" v-show="showTitle" :class="{'lrd-dom-drag':design}">{{title}}</span>
                </div>
                <a v-show="showMore" :href="moreHref" :target="moreTarget" :class="{'lrd-dom-drag':design}"
                   :style="moreStyle"
                   class="website-pro-article-list-more website-flex column center">{{moreContent}}</a>
            </div>
            <div class="website-pro-article-list-list website-pro-position-relative" ref="list" :style="listContainerStyle">
                <component :is="module.attributes.viewGroup.attributes.listStyle.value.style"
                           :data="contentList" :labels="labelList" :design="design" :classId="classId"
                           :itemClick="module.attributes.linkGroup.attributes.itemClickConfig.value"
                           :labelClick="module.attributes.linkGroup.attributes.moreConfig.value"
                           :styleConfig="module.attributes.viewGroup.attributes.listStyle.value[module.attributes.viewGroup.attributes.listStyle.value.style]"
                           :carry-router-menu-id="carryRouterMenuId"/>
            </div>
            <div class="website-pro-article-list-footer" ref="footer" :class="{'lrd-dom-drag':design}"
                 v-show="module.attributes.viewGroup.attributes.page.value.pageable">
                <el-pagination :class="{'lrd-dom-drag':design}" :current-page="currentPage" small background
                               @current-change="handleCurrentChange"
                               :page-size="module.attributes.viewGroup.attributes.page.value.pageSize"
                               layout="prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Style1 from './style/style1/Style1';
    import Style3 from './style/style3/Style3';
    import Style4 from './style/style4/Style4';
    import Style6 from './style/style6/Style6';
    import Style7 from "./style/style7/Style7";
    import Style8 from "./style/style8/Style8";

    import {addListener, removeListener} from 'resize-detector';
    import {commonLink, moreLink} from "../../../../js/util/util";
    import Vue from "vue";
    import PageHeader from "../../../../js/modules/page/pageHeader";

    export default {
        name: "WsArticleList",
        components: {Style1, Style3, Style4, Style6, Style7, Style8},
        props: {
            module: Object,
            design: Boolean
        },
        computed: {
            customClasses() {
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            boxShadow() {
                let boxShadow = this.module.attributes.styleGroup.attributes.boxShadow.value;
                return `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`
            },
            style() {
                let style = {
                    borderTopLeftRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.leftTop + 'px',
                    borderBottomLeftRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.leftBottom + 'px',
                    borderTopRightRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.rightTop + 'px',
                    borderBottomRightRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.rightBottom + 'px',

                    borderTopColor: this.module.attributes.styleGroup.attributes.border.value.top.borderColor,
                    borderTopStyle: this.module.attributes.styleGroup.attributes.border.value.top.borderStyle,
                    borderTopWidth: this.module.attributes.styleGroup.attributes.border.value.top.borderWidth + 'px',

                    borderBottomColor: this.module.attributes.styleGroup.attributes.border.value.bottom.borderColor,
                    borderBottomStyle: this.module.attributes.styleGroup.attributes.border.value.bottom.borderStyle,
                    borderBottomWidth: this.module.attributes.styleGroup.attributes.border.value.bottom.borderWidth + 'px',

                    borderLeftColor: this.module.attributes.styleGroup.attributes.border.value.left.borderColor,
                    borderLeftStyle: this.module.attributes.styleGroup.attributes.border.value.left.borderStyle,
                    borderLeftWidth: this.module.attributes.styleGroup.attributes.border.value.left.borderWidth + 'px',

                    borderRightColor: this.module.attributes.styleGroup.attributes.border.value.right.borderColor,
                    borderRightStyle: this.module.attributes.styleGroup.attributes.border.value.right.borderStyle,
                    borderRightWidth: this.module.attributes.styleGroup.attributes.border.value.right.borderWidth + 'px',

                    boxShadow: this.boxShadow,

                    paddingTop: this.module.attributes.styleGroup.attributes.padding.value.top + 'px',
                    paddingBottom: this.module.attributes.styleGroup.attributes.padding.value.bottom + 'px',
                    paddingLeft: this.module.attributes.styleGroup.attributes.padding.value.left + 'px',
                    paddingRight: this.module.attributes.styleGroup.attributes.padding.value.right + 'px',
                };

                let {
                    backgroundImage, backgroundColor,
                    backgroundPositionX, backgroundPositionY, backgroundSize,
                    backgroundRepeatX, backgroundRepeatY
                } = this.module.attributes.styleGroup.attributes.background.value;

                if (backgroundImage) {
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if (backgroundColor) {
                    style.backgroundColor = backgroundColor;
                }

                if (backgroundPositionX) {
                    style.backgroundPositionX = backgroundPositionX;
                }

                if (backgroundPositionY) {
                    style.backgroundPositionY = backgroundPositionY;
                }

                if (backgroundSize) {
                    style.backgroundSize = backgroundSize;
                }

                if (backgroundRepeatX && backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat';
                }

                if (backgroundRepeatX && !backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat-x';
                }

                if (!backgroundRepeatX && backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat-y';
                }

                if (!backgroundRepeatX && !backgroundRepeatY) {
                    style.backgroundRepeat = 'no-repeat';
                }

                if (!this.design) {
                    style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
                    style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                    style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
                    style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                    style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                    style.position = 'absolute';
                }

                return style;
            },
            showTitle() {
                return this.module.attributes.titleGroup.attributes.showTitle.value;
            },
            showMore() {
                return this.module.attributes.titleGroup.attributes.showMore.value;
            },
            title() {
                return this.module.attributes.titleGroup.attributes.title.value;
            },
            titleContainerStyle(){
                let {titlePadding,titleBackground,titleBorder,titleBorderRadius} = this.module.attributes.titleGroup.attributes;

                let style = {
                    borderTopLeftRadius: titleBorderRadius.value.leftTop + 'px',
                    borderBottomLeftRadius: titleBorderRadius.value.leftBottom + 'px',
                    borderTopRightRadius: titleBorderRadius.value.rightTop + 'px',
                    borderBottomRightRadius: titleBorderRadius.value.rightBottom + 'px',

                    borderTopColor: titleBorder.value.top.borderColor,
                    borderTopStyle: titleBorder.value.top.borderStyle,
                    borderTopWidth: titleBorder.value.top.borderWidth + 'px',

                    borderBottomColor: titleBorder.value.bottom.borderColor,
                    borderBottomStyle: titleBorder.value.bottom.borderStyle,
                    borderBottomWidth: titleBorder.value.bottom.borderWidth + 'px',

                    borderLeftColor: titleBorder.value.left.borderColor,
                    borderLeftStyle: titleBorder.value.left.borderStyle,
                    borderLeftWidth: titleBorder.value.left.borderWidth + 'px',

                    borderRightColor: titleBorder.value.right.borderColor,
                    borderRightStyle: titleBorder.value.right.borderStyle,
                    borderRightWidth: titleBorder.value.right.borderWidth + 'px',

                    paddingTop: titlePadding.value.top + 'px',
                    paddingBottom: titlePadding.value.bottom + 'px',
                    paddingLeft: titlePadding.value.left + 'px',
                    paddingRight: titlePadding.value.right + 'px',
                };

                let {
                    backgroundImage, backgroundColor,
                    backgroundPositionX, backgroundPositionY, backgroundSize,
                    backgroundRepeatX, backgroundRepeatY
                } = titleBackground.value;

                if (backgroundImage) {
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if (backgroundColor) {
                    style.backgroundColor = backgroundColor;
                }

                if (backgroundPositionX) {
                    style.backgroundPositionX = backgroundPositionX;
                }

                if (backgroundPositionY) {
                    style.backgroundPositionY = backgroundPositionY;
                }

                if (backgroundSize) {
                    style.backgroundSize = backgroundSize;
                }

                if (backgroundRepeatX && backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat';
                }

                if (backgroundRepeatX && !backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat-x';
                }

                if (!backgroundRepeatX && backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat-y';
                }

                if (!backgroundRepeatX && !backgroundRepeatY) {
                    style.backgroundRepeat = 'no-repeat';
                }

                return style;
            },
            titleStyle() {
                let style = {};

                let font = this.module.attributes.titleGroup.attributes.font.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic ? 'italic' : 'normal';
                style.fontWeight = font.bold ? 'bold' : 'normal';

                return style;
            },
            moreContent() {
                return this.module.attributes.titleGroup.attributes.moreContent.value;
            },
            moreStyle() {
                let style = {};

                let font = this.module.attributes.titleGroup.attributes.moreFont.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic ? 'italic' : 'normal';
                style.fontWeight = font.bold ? 'bold' : 'normal';

                return style;
            },
            listContainerStyle(){
                let {listContainerPadding,listContainerBackground,listContainerBorder,listContainerBorderRadius} = this.module.attributes.listContainerGroup.attributes;

                let style = {
                    borderTopLeftRadius: listContainerBorderRadius.value.leftTop + 'px',
                    borderBottomLeftRadius: listContainerBorderRadius.value.leftBottom + 'px',
                    borderTopRightRadius: listContainerBorderRadius.value.rightTop + 'px',
                    borderBottomRightRadius: listContainerBorderRadius.value.rightBottom + 'px',

                    borderTopColor: listContainerBorder.value.top.borderColor,
                    borderTopStyle: listContainerBorder.value.top.borderStyle,
                    borderTopWidth: listContainerBorder.value.top.borderWidth + 'px',

                    borderBottomColor: listContainerBorder.value.bottom.borderColor,
                    borderBottomStyle: listContainerBorder.value.bottom.borderStyle,
                    borderBottomWidth: listContainerBorder.value.bottom.borderWidth + 'px',

                    borderLeftColor: listContainerBorder.value.left.borderColor,
                    borderLeftStyle: listContainerBorder.value.left.borderStyle,
                    borderLeftWidth: listContainerBorder.value.left.borderWidth + 'px',

                    borderRightColor: listContainerBorder.value.right.borderColor,
                    borderRightStyle: listContainerBorder.value.right.borderStyle,
                    borderRightWidth: listContainerBorder.value.right.borderWidth + 'px',

                    paddingTop: listContainerPadding.value.top + 'px',
                    paddingBottom: listContainerPadding.value.bottom + 'px',
                    paddingLeft: listContainerPadding.value.left + 'px',
                    paddingRight: listContainerPadding.value.right + 'px',
                };

                let {
                    backgroundImage, backgroundColor,
                    backgroundPositionX, backgroundPositionY, backgroundSize,
                    backgroundRepeatX, backgroundRepeatY
                } = listContainerBackground.value;

                if (backgroundImage) {
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if (backgroundColor) {
                    style.backgroundColor = backgroundColor;
                }

                if (backgroundPositionX) {
                    style.backgroundPositionX = backgroundPositionX;
                }

                if (backgroundPositionY) {
                    style.backgroundPositionY = backgroundPositionY;
                }

                if (backgroundSize) {
                    style.backgroundSize = backgroundSize;
                }

                if (backgroundRepeatX && backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat';
                }

                if (backgroundRepeatX && !backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat-x';
                }

                if (!backgroundRepeatX && backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat-y';
                }

                if (!backgroundRepeatX && !backgroundRepeatY) {
                    style.backgroundRepeat = 'no-repeat';
                }

                return style;
            },
            classId() {
                let {dataSrc, classId} = this.module.attributes.dataSrcGroup.attributes.dataSrc.value;

                if (dataSrc === 1) {
                    return classId;
                }

                if (dataSrc === 2) {
                    return this.$route.query.classId;
                }

                return '';
            },
            labelId() {
                let {dataSrc, labelId} = this.module.attributes.dataSrcGroup.attributes.dataSrc.value;
                if (dataSrc === 1) {
                    return labelId;
                }

                if (dataSrc === 2) {
                    return this.$route.query.labelId;
                }

                return '';
            },
            hot(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.hot;
            },
            pageSize() {
                return this.module.attributes.viewGroup.attributes.page.value.pageSize;
            },
            moreHref() {
                return moreLink(this.$router, this.module.attributes.linkGroup.attributes.moreConfig.value, this.classId, this.labelId, this.design);
            },
            moreTarget() {
                if (this.moreHref === 'javascript:;') {
                    return '_self';
                }
                return this.module.attributes.linkGroup.attributes.moreConfig.value.target;
            },
            carryRouter(){
                return this.module.attributes.otherGroup.attributes.carryRouter.value;
            },
            pageHeader(){
                return this.module.attributes.otherGroup.attributes.pageHeader.value;
            },
            fullPath(){
                return '#'+this.$route.fullPath;
            },
            nowMenu(){

                for(let menu of this.menus){
                    for(let menuItem of menu.modules){
                        let {index,modules} = menuItem;

                        if(index === this.fullPath){
                            return menuItem;
                        }else{
                            for(let child of modules){
                                let {index:subIndex} = child;

                                if(subIndex === this.fullPath){
                                    return child;
                                }
                            }
                        }
                    }
                }

                return null;
            },
            routerType(){
                return this.module.attributes.otherGroup.attributes.routerType.value;
            },
            menuId(){
                return this.module.attributes.otherGroup.attributes.menuId.value;
            },
            carryRouterMenuId(){
                if(this.carryRouter){
                    if(this.routerType === '1'){
                        return this.nowMenu ? this.nowMenu.id : null;
                    }

                    if(this.routerType === '2'){
                        return this.menuId ? this.menuId : null;
                    }
                }
                return null;
            }
        },
        data() {
            return {
                contentList: [],
                labelList: [],
                total: 0,
                currentPage: 1,
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
            }
        },
        methods: {
            getPageModuleInfo(){
                if(this.pageHeader && this.carryRouter){
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
            getLink(linkConfig){
                return commonLink(this.$router,linkConfig);
            },
            getTarget(href,target){
                if(href === 'javascript:;'){
                    return '_self';
                }
                return target;
            },
            getContentList() {
                if (this.classId || this.hot) {
                    let params = {
                        filterUnPublish: true,
                        classId: this.classId,
                        labelId: this.labelId,
                        hot: this.hot,
                        limit: this.pageSize,
                        offset: (this.currentPage - 1) * this.pageSize,
                    };
                    this.$request.get('/api/common/content/anon/list', {params}).then((resp) => {
                        let {data} = resp;
                        this.labelList = data.labelList;
                        this.contentList = data.list;
                        this.total = data.total;

                        if (this.module.attributes.dataSrcGroup.attributes.dataSrc.value.dataSrc === 2) {
                            this.module.attributes.titleGroup.attributes.title.value = data.classTitle;
                        }
                    });
                }
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getContentList();
            },
            reloadList() {
                this.currentPage = 1;
                this.getContentList();
            },
            setHeight() {
                let height = this.$refs.title.clientHeight + this.$refs.footer.clientHeight + this.$refs.list.clientHeight
                    + this.module.attributes.styleGroup.attributes.border.value.top.borderWidth
                    + this.module.attributes.styleGroup.attributes.border.value.bottom.borderWidth
                    + this.module.attributes.styleGroup.attributes.padding.value.top
                    + this.module.attributes.styleGroup.attributes.padding.value.bottom;
                this.module.attributes.layoutGroup.attributes.layout.value.height = height > 0 ? height : 20;
            }
        },
        watch: {
            classId() {
                this.reloadList();
            },
            labelId() {
                this.reloadList();
            },
            pageSize() {
                this.reloadList();
            },
            hot() {
                this.reloadList();
            },
            'module.attributes.styleGroup.attributes.border.value': {
                deep: true,
                handler() {
                    this.setHeight();
                }
            },
            'module.attributes.styleGroup.attributes.padding.value': {
                deep: true,
                handler() {
                    this.setHeight();
                }
            },
            pageHeader(){
                this.getPageModuleInfo();
            },
        },
        created() {
            this.getPageModuleInfo();
        },
        mounted() {
            this.setHeight();
            addListener(this.$refs.contentList, this.setHeight);
            this.reloadList();
        },
        beforeDestroy() {
            removeListener(this.$refs.contentList, this.setHeight);
        }
    }
</script>
