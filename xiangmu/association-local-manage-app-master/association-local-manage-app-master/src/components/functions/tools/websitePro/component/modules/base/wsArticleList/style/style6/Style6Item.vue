<template>
    <div class="website-pro-article-list-style6-container" :class="itemClass" :style="containerStyle">
        <a :href="itemHref" :target="itemTarget" class="website-pro-background-image-style website-pro-article-list-style6-poster"
             :style="{backgroundImage:`url(${imageText.poster})`}">
            <div class="website-pro-article-list-style6-triangle" :style="triangleStyle"></div>
        </a>
        <div class="website-pro-article-list-style6-content" :style="textContainerStyle">
            <div class="website-pro-article-list-style6-label-container" v-show="resultLabels.length>0" :style="labelContainerStyle">
                <a draggable="false" :href="label.href" :style="labelStyle" :target="labelTarget" class="website-pro-article-list-style6-label"
                   v-for="label of resultLabels" :key="label.id">
                    {{label.title}}
                </a>
            </div>
            <a draggable="false" class="website-pro-article-list-style6-title" :style="titleStyle" :href="itemHref" :target="itemTarget">
                {{titleFormat(imageText.title)}}
            </a>
            <a draggable="false" class="website-pro-article-list-style6-abstract" :style="abstractStyle" :href="itemHref" :target="itemTarget">
                {{abstractFormat(imageText.contentAbstract)}}
            </a>
        </div>
    </div>
</template>

<script>
    import {articleClick, moreLink} from "../../../../../../js/util/util";
    import {formatDate} from "../../../../../../../../../../js/util/utilFunction";

    export default {
        name: "Style6Item",
        props:{
            imageText: Object,
            labels: {
                type: Array,
                default() {
                    return [];
                }
            },
            itemClick: Object,
            labelClick: Object,
            classId: String,
            design: Boolean,
            triangleStyle: Object,
            containerStyle: Object,
            textContainerStyle: Object,
            labelContainerStyle: Object,
            labelStyle: Object,
            titleStyle: Object,
            titleFormat: Function,
            abstractStyle: Object,
            abstractFormat: Function,
            index: Number,
            childIndex: Number,
            carryRouterMenuId: String,
        },
        computed:{
            itemClass(){
                return  `item-${this.index*2+this.childIndex}`;
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
            labelTarget(){
                if(this.design || !this.pagePath){
                    return '_self';
                }
                return this.labelClick.target;
            },
            date(){
                return formatDate(new Date(this.imageText.publishTime), 'yyyy-MM-dd');
            },
            resultLabels() {
                let array = [];
                let labels = JSON.parse(this.imageText.contentLabels);
                for (let label of this.labels) {
                    let {id} = label;
                    if (labels.indexOf(id) > -1) {
                        array.push({
                            ...label,
                            href: this.labelHref(id)
                        });
                    }

                }
                return array;
            },
        },
        methods:{
            labelHref(labelId) {
                return moreLink(this.$router,this.labelClick,this.classId,labelId,this.design);
            }
        }
    }
</script>

