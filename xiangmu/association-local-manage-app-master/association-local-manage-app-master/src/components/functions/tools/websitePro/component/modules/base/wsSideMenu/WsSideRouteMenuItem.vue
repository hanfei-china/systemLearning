<template>
    <a class="website-pro-side-menu-item" :class="{active}" :style="style"
       :href="menu.index" draggable="false" :target="menu.target">
        <span :style="itemPrefixTextStyle">{{itemPrefixText}}</span>
        <span>{{menu.title}}</span>
        <span :style="itemSuffixTextStyle">{{itemSuffixText}}</span>
    </a>
</template>

<script>

    export default {
        name: "WsSideRouteMenuItem",
        props:{
            menu: Object,
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
                return this.menu.index === this.fullPath || this.menu.id === this.menuId;
            },
            style(){
                return this.active ? this.itemActiveStyle : this.itemStyle;
            }
        },
    }
</script>
