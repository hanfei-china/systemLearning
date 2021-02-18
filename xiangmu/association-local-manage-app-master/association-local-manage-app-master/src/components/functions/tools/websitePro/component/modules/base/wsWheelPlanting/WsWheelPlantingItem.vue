<template>
    <a class="website-pro-absolute-fill-parent website-pro-wheel-planting-item" draggable="false"
         :style="computedSlideStyle" :href="itemHref" :target="itemTarget">
        <div class="website-pro-absolute-fill-parent website-pro-wheel-planting-item-content" v-show="showContent">
            <temp-var :labels="getLabels(content.contentLabels)">
                <div slot-scope="{labels}" class="website-pro-wheel-planting-item-label-container">
                    <a draggable="false" class="website-pro-wheel-planting-item-label" :href="labelHref(label.id)" :tagert="labelTarget"
                         v-for="label of labels" :key="label.labelId">
                        {{label.title}}
                    </a>
                </div>
            </temp-var>
            <a draggable="false" class="website-pro-wheel-planting-item-title" :href="itemHref" :target="itemTarget">
                {{content.title}}
            </a>
            <a draggable="false" class="website-pro-wheel-planting-item-abstract" :href="itemHref" :target="itemTarget">
                {{content.contentAbstract}}
            </a>
        </div>
    </a>
</template>

<script>
    import TempVar from "../../../../../../../util/TempVar";
    import {articleClick,moreLink} from "../../../../js/util/util";
    export default {
        name: "WsWheelPlantingItem",
        components: {TempVar},
        props: {
            content: Object,
            labels: {
                type: Array,
                default() {
                    return [];
                }
            },
            showContent: Boolean,
            itemClick: Object,
            labelClick: Object,
            classId: String,
            design: Boolean,
            backgroundColor: String
        },
        computed: {
            computedSlideStyle(){
                let style = {};
                if(this.content.poster){
                    style.backgroundImage = `url(${this.content.poster})`
                }else{
                    style.backgroundColor = this.backgroundColor;
                }
                return style;
            },
            itemTarget(){
                if(this.design || this.itemHref === 'javascript:;'){
                    return '_self';
                }
                return this.itemClick.target;
            },
            labelTarget(){
                if(this.design || this.itemHref === 'javascript:;'){
                    return '_self';
                }
                return this.labelClick.target;
            },
            dragClass(){
                if(this.design){
                    return 'lrd-dom-drag';
                }

                return '';
            },
            itemHref(){
                return articleClick(this.$router,this.itemClick,this.content,this.design);
            },
        },
        methods:{
            getLabels(labels) {
                let array = [];
                labels = JSON.parse(labels);
                for (let label of this.labels) {
                    let {id} = label;
                    if (labels.indexOf(id) > -1) {
                        array.push(label);
                    }

                }
                return array;
            },
            labelHref(labelId) {
                return moreLink(this.$router,this.labelClick,this.classId,labelId,this.design);
            }
        }
    }
</script>
