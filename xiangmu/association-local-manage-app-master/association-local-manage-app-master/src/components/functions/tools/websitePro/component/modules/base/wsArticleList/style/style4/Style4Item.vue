<template>
    <div class="website-pro-article-list-style4-container" :style="containerStyle">
        <a :href="itemHref" :target="itemTarget" class="website-pro-background-image-style website-pro-article-list-style4-poster"
             :style="{backgroundImage:`url(${imageText.poster})`,...posterStyle}"></a>
        <div class="website-pro-article-list-style4-label-container" v-show="resultLabels.length>0" :style="labelContainerStyle">
            <a draggable="false" :href="label.href" :style="labelStyle" :target="labelTarget" class="website-pro-article-list-style4-label"
               v-for="label of resultLabels" :key="label.id">
                {{label.title}}
            </a>
        </div>
        <a class="website-pro-article-list-style4-title" :href="itemHref" :target="itemTarget" :style="titleStyle">
            {{titleFormat(imageText.title)}}
        </a>
    </div>
</template>

<script>
    import {articleClick, moreLink} from "../../../../../../js/util/util";
    import {formatDate} from "../../../../../../../../../../js/util/utilFunction";
    export default {
        name: "Style4Item",
        props:{
            imageText: Object,
            design: Boolean,
            itemClick: Object,
            labelClick: Object,
            containerStyle: Object,
            posterStyle: Object,
            labelContainerStyle: Object,
            labelStyle: Object,
            titleStyle: Object,
            titleFormat: Function,
            timeStyle: Object,
            labels: Array,
            classId: String,
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
