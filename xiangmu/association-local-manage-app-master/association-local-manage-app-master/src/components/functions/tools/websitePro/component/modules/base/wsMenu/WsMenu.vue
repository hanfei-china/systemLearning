<template>
    <div class="website-pro-absolute-fill-parent website-pro-menu" :class="[customClasses,hoverClass,backgroundTransparentClass]" :style="style">
        <el-menu mode="horizontal" :default-active="defaultActive" :class="[dragClass,backgroundTransparentClass]"
            :background-color="menuBackgroundColor" :text-color="menuTextColor" :active-text-color="menuActiveTextColor">
            <ws-menu-item :custom-classes="customClasses" :hover-class="hoverClass" v-for="menuItem of this.module.modules" :key="menuItem.id" :design="design" :module="menuItem"/>
        </el-menu>
    </div>
</template>

<script>
    import WsMenuItem from "./WsMenuItem";
    export default {
        name: "WsMenu",
        components: {WsMenuItem},
        props:{
            module: Object,
            design: Boolean
        },
        computed:{
            customClasses(){
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            dragClass(){
                if(this.design){
                    return 'lrd-dom-drag';
                }

                return '';
            },
            isPage() {
                let path = this.$route.name;
                return path === 'page';
            },
            defaultActive() {
                if (this.isPage) {
                    return '#' + this.$route.fullPath;
                }
                return '';
            },
            style(){
                let style = {};

                if(!this.design){
                    style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
                    style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                    style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
                    style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                    style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                    style.position = 'absolute';
                }

                return style;
            },
            menuBackgroundColor(){
                return this.module.attributes.viewGroup.attributes.menuBackgroundColor.value;
            },
            menuTextColor(){
                return this.module.attributes.viewGroup.attributes.menuTextColor.value;
            },
            menuActiveTextColor(){
                return this.module.attributes.viewGroup.attributes.menuActiveTextColor.value;
            },
            hoverClass(){
                let isUserHover = this.module.attributes.viewGroup.attributes.isUserHover.value;
                return isUserHover ? '' : 'close-hover';
            },
            backgroundTransparentClass(){
                let isOpenBackgroundTransparent = this.module.attributes.viewGroup.attributes.isOpenBackgroundTransparent.value;
                return isOpenBackgroundTransparent ? 'background-transparent' : '';
            }
        }
    }
</script>
