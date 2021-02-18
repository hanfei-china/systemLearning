<template>
    <el-breadcrumb-item :style="itemStyle" :class="dragClass">
        <a :href="href" draggable="false" :target="target" :class="dragClass">{{module.title}}</a>
    </el-breadcrumb-item>
</template>

<script>
    import {commonLink} from "../../../../js/util/util";

    export default {
        name: "WsBreadcrumbItem",
        props:{
            design: Boolean,
            module: Object,
            itemStyle: Object
        },
        computed: {
            dragClass(){
                if(this.design){
                    return 'lrd-dom-drag';
                }

                return '';
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
