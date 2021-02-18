<template>
    <div>
        <img :src="config[0]" class="image-list-1c" v-if="config.length == 1"/>
        <div v-else>
            <div v-for="(image,index) in config" :key="index" :class="imageClass" class="image-preview"
                 :style="imageStyle(image)"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "imageListContent",
        props: {
            config: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        computed: {
            imageClass() {
                let length = this.config.length;
                if (length >= 2) {
                    return 'image-list-2c';
                } else {
                    return 'image-list-' + length + 'c';
                }
            }
        },
        methods: {
            imageStyle(image) {
                return {
                    backgroundImage: 'url("' + image + '")'
                }
            }
        }
    }
</script>

<style scoped>
    .image-preview {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    .image-list-1c {
        max-width: 135px;
        max-height: 207px;
    }

    .image-list-2c {
        width: 109px;
        height: 110px;
        display: inline-block;
        margin-right: 8px;
        margin-bottom: 4px;
        line-height: 1;
        font-size: 0;
    }

    .image-list-2c:nth-child(3n+3) {
        margin-right: 0;
    }

</style>
