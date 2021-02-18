<template>
    <div class="website-pro-absolute-fill-parent">
        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
            <div :style="containerStyle" v-html="content"></div>
        </vue-scroll>
    </div>
</template>

<script>
    export default {
        name: "WsPortalRichText",
        props:{
            module: Object,
        },
        computed:{
            containerGroup(){
                return this.module.attributes.containerGroup.attributes;
            },
            containerStyle(){
                let {padding} = this.containerGroup;

                return {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                }
            },
            contentGroup(){
                return this.module.attributes.contentGroup.attributes;
            },
            content(){
                return this.contentGroup.content.value;
            }
        }
    }
</script>
