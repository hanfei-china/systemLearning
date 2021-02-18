<template>
    <div class="image-container" style="background-color: #FFFFFF;">
        <div class="image-wrapper" :style="wrapperStyle">
            <div>
                <div class="func-title" :style="titleColorStyle">{{title}}</div>
                <div class="func-describe" :style="describeColorStyle">{{describe}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "homeRowImageBtn",
        props: {
            module: Object
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            title(){
                return this.attributes.title.value;
            },
            titleColor(){
                return this.attributes.titleColor.value;
            },
            describe(){
                return this.attributes.describe.value;
            },
            describeColor(){
                return this.attributes.describeColor.value;
            },
            image(){
                return this.attributes.image.value;
            },
            wrapperStyle() {
                return {
                    backgroundImage: 'url(' + this.image + ')'
                };
            },
            titleColorStyle() {
                return {
                    color: this.titleColor
                }
            },
            describeColorStyle() {
                return {
                    color: this.describeColor
                }
            }
        }
    }
</script>

<style scoped>
    .image-container {
        height: 132px;
        padding: 10px;
        position: relative;
    }

    .image-wrapper {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 10px;
    }

    .func-title {
        font-size: 16px;
    }

    .func-describe {
        font-size: 14px;
        padding-top: 5px;
    }

</style>
