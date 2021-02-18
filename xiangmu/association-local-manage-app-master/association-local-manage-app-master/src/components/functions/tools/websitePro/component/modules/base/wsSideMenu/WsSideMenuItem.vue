<template>
    <a class="website-pro-side-menu-item" :class="{active}" :style="style" :href="href" draggable="false" :target="target">
        <span :style="itemPrefixTextStyle">{{itemPrefixText}}</span>
        <span>{{module.title}}</span>
        <span :style="itemSuffixTextStyle">{{itemSuffixText}}</span>
    </a>
</template>

<script>
    import {commonLink} from "../../../../js/util/util";

    export default {
        name: "WsSideMenuItem",
        props:{
            design: Boolean,
            module: Object,
            itemStyle: Object,
            itemActiveStyle: Object,
            fullPath: String,
            itemPrefixText: String,
            itemPrefixTextStyle: Object,
            itemSuffixText: String,
            itemSuffixTextStyle: Object,
            menuId: String
        },
        computed: {
            active(){
                return this.href === this.fullPath || this.module.id === this.menuId || (this.routeId && this.menuId === this.routeId);
            },
            style(){
                return this.active ? this.itemActiveStyle : this.itemStyle;
            },
            href(){
                return commonLink(this.$router,this.module.attributes.linkGroup.attributes.linkConfig.value,this.design);
            },
            target(){
                if(this.design || this.href === 'javascript:;'){
                    return '_self';
                }
                return this.module.attributes.linkGroup.attributes.linkConfig.value.target;
            },
            routeId(){
                return this.module.attributes.otherGroup.attributes.routeId.value;
            }
        },
    }
</script>
