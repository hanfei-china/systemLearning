<template>
    <div class="website-pro-article-list-style1-container" :style="containerStyle">
        <div class="website-pro-article-list-style1-left website-pro-flex column" :style="dateContainerOuterStyle">
            <div class="website-pro-article-list-style1-time-container" :style="dateContainerStyle">
                <div class="website-pro-article-list-style1-time-month" :style="monthStyle">
                    {{month}}
                </div>
                <div class="website-pro-article-list-style1-time-day" :style="dayStyle">
                    {{day}}
                </div>
                <div :style="dayDividingLineStyle"></div>
                <div class="website-pro-article-list-style1-time-year" :style="yearStyle">
                    {{year}}
                </div>
            </div>
        </div>
        <div class="website-pro-article-list-style1-right">
            <div class="flex-fill-in-the-remaining-space">
                <div :style="titleStyle">
                    <a draggable="false" class="website-pro-article-list-style1-info-title" :href="itemHref" :target="itemTarget">
                        {{titleFormat(imageText.title)}}
                    </a>
                </div>
                <div :style="abstractStyle" class="website-pro-article-list-style1-info-content-abstract">
                    {{abstractFormat(imageText.contentAbstract)}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {formatDate} from "../../../../../../../../../../js/util/utilFunction";
    import {articleClick} from "../../../../../../js/util/util";

    export default {
        name: "Style1Item",
        props:{
            imageText: Object,
            design: Boolean,
            itemClick: Object,
            containerStyle: Object,
            dateContainerOuterStyle: Object,
            dateContainerStyle: Object,
            yearStyle: Object,
            monthStyle: Object,
            dayStyle: Object,
            dayDividingLineStyle: Object,
            titleStyle: Object,
            abstractStyle: Object,
            abstractFormat: Function,
            titleFormat: Function,
            dateStyle: String,
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
            year(){
                if(this.dateStyle === 'style2'){
                    return formatDate(new Date(this.imageText.publishTime), 'yyyy.MM');
                }

                if(this.dateStyle === 'style3'){
                    return formatDate(new Date(this.imageText.publishTime), 'yyyy');
                }

                return formatDate(new Date(this.imageText.publishTime), 'yyyy/MM');
            },
            month(){
                return formatDate(new Date(this.imageText.publishTime), 'MM月');
            },
            day(){
                return formatDate(new Date(this.imageText.publishTime), 'dd');
            }
        }
    }
</script>
