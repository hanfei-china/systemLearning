<template>
    <div :style="containerStyle">
        <component v-for="child of module.modules" :is="child.name" :key="child.id" :module="child"/>
    </div>
</template>

<script>
    import WsPDFField from "../wsPDFField/WsPDFField";
    import WsPDFText from "../wsPDFText/WsPDFText";
    import WsPDFImage from "../wsPDFImage/WsPDFImage";
    export default {
        name: "WsPDFPage",
        components: {WsPDFImage, WsPDFText, WsPDFField},
        props:{
            module: Object,
        },
        computed:{
            containerStyle(){
                let style = {};

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.styleGroup.attributes.background.value;

                if(backgroundImage){
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if(backgroundColor){
                    style.backgroundColor = backgroundColor;
                }

                if(backgroundPositionX){
                    style.backgroundPositionX = backgroundPositionX;
                }

                if(backgroundPositionY){
                    style.backgroundPositionY = backgroundPositionY;
                }

                if(backgroundSize){
                    style.backgroundSize = backgroundSize;
                }

                if(backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat';
                }

                if(backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-x';
                }

                if(!backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-y';
                }

                if(!backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'no-repeat';
                }

                style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
                style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                style.left = 0;
                style.right = 0;
                style.margin = '0 auto';
                style.position = 'absolute';
                return style;
            },
        },
        data(){
            return {
                htmlTemplate: {
                    fields: [],
                    template: ''
                },
            }
        },
        mounted() {
            this.changeTemplate();
        },
        methods:{
            changeTemplate(){
                if(this.$el){
                    let fields = [];
                    for(let module of this.module.modules){
                        let {name,attributes} = module;
                        if(name === 'wsPDFField'){
                            fields.push({...attributes.fieldGroup.attributes.field.value})
                        }
                    }
                    this.htmlTemplate.fields = fields;
                    this.htmlTemplate.template = this.$el.outerHTML;
                }
            }
        },
        watch:{
            module:{
                deep: true,
                immediate: true,
                handler(){
                    this.$nextTick(()=>{
                        this.changeTemplate();
                    });
                }
            },
            htmlTemplate:{
                deep: true,
                handler(val){
                    this.$emit('template-change',JSON.stringify(val));
                }
            }
        }
    }
</script>
