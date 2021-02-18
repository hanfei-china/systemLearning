<template>
    <div class="top-container" style="background-color: #FFFFFF;" :style="backgroundStyle">
        <div class="logo-container" >
            <div class="logo-wrapper">
                <img :src="logoSrc" :style="{maxHeight: logoMaxHeight+'px'}" v-if="logoSrc && logoSrc != ''"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "topLogoArea",
        props: {
            module: Object
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            logoSrc() {
                return this.attributes.logoSrc.value;
            },
            logoMaxHeight() {
                return this.attributes.logoMaxHeight.value;
            },
            backgroundSrc() {
                return this.attributes.backgroundSrc.value;
            },
            height() {
                return this.attributes.height.value;
            },
            backgroundStyle(){
                let style = {};
                style.backgroundImage = `url(${this.backgroundSrc})`;
                style.height = `${this.height}px`;
                return style;
            }
        }
    }
</script>

<style scoped>
    .top-container {
        display: flex;
        background-position: left center;
        background-size: contain;
        overflow: hidden;
    }

    .logo-container {
        flex: 1;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .logo-wrapper {
        line-height: 1;
        padding-left: 16px;
    }

    .logo-wrapper > img {
        display: block;
    }

    .btns-container {
        width: 60px;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .icon-btn {
        font-size: 20px;
        padding-right: 8px;
        color: #000000;
    }

    .btns-wrapper {
        text-align: right;
    }
</style>
