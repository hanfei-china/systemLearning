<template>
    <div class="website-pro-article-list-style3-container" :style="containerStyle">
        <div class="website-pro-article-list-style3-top" :style="titleContainerStyle">
            <div class="website-pro-article-list-style3-left website-pro-text-overflow" :style="titleStyle">
                <a draggable="false" class="website-pro-article-list-style3-info-title"
                   :href="itemHref" :target="itemTarget">
                    {{imageText.title}}
                </a>
            </div>
            <div class="website-pro-article-list-style3-right" :style="timeStyle">
                <div class="website-pro-article-list-style3-time">
                    {{date}}
                </div>
            </div>
        </div>
        <div class="website-pro-article-list-style3-bottom" :style="abstractStyle" v-if="imageText.contentAbstract && imageText.contentAbstract !== ''">
            {{abstractFormat(imageText.contentAbstract)}}
        </div>
    </div>
</template>

<script>
    import {formatDate} from "../../../../../../../../../../js/util/utilFunction";
    import {articleClick} from "../../../../../../js/util/util";

    export default {
        name: "Style3Item",
        props:{
            imageText: Object,
            design: Boolean,
            itemClick: Object,
            containerStyle: Object,
            titleContainerStyle: Object,
            titleStyle: Object,
            timeStyle: Object,
            abstractStyle: Object,
            abstractFormat: Function,
            carryRouterMenuId: String,
        },
        computed:{
            itemHref(){
                return articleClick(this.$router,this.itemClick,this.imageText,this.design,this.carryRouterMenuId);
            },
            itemTarget(){
                if(this.design || this.itemHref === 'javascript:;'){
                    return '_self';
                }
                return this.itemClick.target;
            },
            date(){
                return formatDate(new Date(this.imageText.publishTime), 'yyyy-MM-dd');
            },
        }
    }
</script>
