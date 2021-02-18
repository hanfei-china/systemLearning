<template>
    <div class="website-pro-article-list-style8-container flex" :style="containerStyle">
        <a class="website-pro-article-list-style8-info-poster" :href="itemHref" :target="itemTarget"
             :style="{...posterStyle,backgroundImage:`url(${imageText.poster})`}"></a>
        <div class="flex-fill-in-the-remaining-space">
            <div class="website-pro-article-list-style8-top">
                <div class="website-pro-article-list-style8-left website-pro-text-overflow" :style="titleStyle">
                    <a draggable="false" class="website-pro-article-list-style8-info-title"
                       :href="itemHref" :target="itemTarget">
                        {{imageText.title}}
                    </a>
                </div>
                <div class="website-pro-article-list-style8-right" :style="timeStyle">
                    <div class="website-pro-article-list-style8-time">
                        {{date}}
                    </div>
                </div>
            </div>
            <div class="website-pro-article-list-style8-bottom" :style="abstractStyle" v-if="imageText.contentAbstract && imageText.contentAbstract !== ''">
                {{abstractFormat(imageText.contentAbstract)}}
            </div>
        </div>
    </div>
</template>

<script>
    import {articleClick} from "../../../../../../js/util/util";
    import {formatDate} from "../../../../../../../../../../js/util/utilFunction";

    export default {
        name: "Style8Item",
        props:{
            imageText: Object,
            design: Boolean,
            itemClick: Object,
            containerStyle: Object,
            posterStyle: Object,
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

