<template>
    <el-submenu :popper-class="popperClass" :class="hoverClass" v-if="module.modules && module.modules.length > 0" :index="index">
        <template slot="title">
            <span style="opacity: 0;">{{module.title}}</span>
            <a draggable="false" class="website-pro-absolute-fill-parent" style="padding: 0 20px;color: inherit;" :href="href" :target="target">
                {{module.title}}
            </a>
        </template>
        <ws-menu-item :design="design" :hover-class="hoverClass" v-for="child in module.modules" :module="child" :key="child.id"/>
    </el-submenu>
    <el-menu-item :class="hoverClass" :index="index" v-else>
        <span style="opacity: 0;">{{module.title}}</span>
        <a draggable="false" class="website-pro-absolute-fill-parent" style="padding: 0 20px;color: inherit;" :href="href" :target="target">
            {{module.title}}
        </a>
    </el-menu-item>
</template>

<script>
    import {commonLink} from "../../../../js/util/util";

    export default {
        name: "WsMenuItem",
        props:{
            design: Boolean,
            module: Object,
            hoverClass: String,
            customClasses: String
        },
        computed: {
            popperClass(){
                let _className = 'website-pro-menu-popper';
                if(this.customClasses){
                    _className += ' '+this.customClasses;
                }

                return _className;
            },
            dragClass(){
                if(this.design){
                    return 'lrd-dom-drag';
                }

                return '';
            },
            index(){
                if(this.href === 'javascript:;'){
                    return this.module.id;
                }else{
                    return this.href;
                }
            },
            href(){
                return commonLink(this.$router,this.module.attributes.linkGroup.attributes.linkConfig.value,this.design);
            },
            target(){
                if(this.href === 'javascript:;'){
                    return '_self';
                }
                return this.module.attributes.linkGroup.attributes.linkConfig.value.target;
            },
        },
    }
</script>
