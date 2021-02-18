<template>
    <div class="website-pro-article-list-style7-container" :style="containerStyle">
        <div class="website-pro-article-list-style7-left website-pro-flex column" :style="serialNumberContainerStyle">
            <div class="website-pro-article-list-style7-serial-number-container website-pro-flex column center" :style="serialNumberStyle">
                <div>{{index+1}}</div>
            </div>
        </div>
        <div class="website-pro-article-list-style7-right" :style="contentContainerStyle">
            <div class="flex-fill-in-the-remaining-space">
                <div>
                    <a draggable="false" :style="titleStyle" class="website-pro-article-list-style7-info-title" :href="itemHref" :target="itemTarget">
                        {{imageText.title}}
                    </a>
                    <span :style="dateStyle">{{date}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {formatDate} from "../../../../../../../../../../js/util/utilFunction";
    import {articleClick} from "../../../../../../js/util/util";

    export default {
        name: "Style7Item",
        props:{
            imageText: Object,
            design: Boolean,
            itemClick: Object,

            containerStyle: Object,
            serialNumberContainerStyle: Object,
            serialNumberFirstStyle: Object,
            serialNumberSecondStyle: Object,
            serialNumberThirdStyle: Object,
            serialNumberOtherStyle: Object,
            index: Number,
            contentContainerStyle: Object,
            titleStyle: Object,
            dateStyle: Object,
            carryRouterMenuId: String,
        },
        computed:{
            serialNumberStyle(){
                if(this.index === 0){
                    return this.serialNumberFirstStyle;
                }else if(this.index === 1){
                    return this.serialNumberSecondStyle;
                }else if(this.index === 2){
                    return this.serialNumberThirdStyle;
                }else{
                    return this.serialNumberOtherStyle;
                }
            },
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
