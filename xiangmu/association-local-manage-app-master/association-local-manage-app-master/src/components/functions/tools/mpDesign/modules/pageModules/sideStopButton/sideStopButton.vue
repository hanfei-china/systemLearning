<template>
    <div class="btn-label">
        <div class="btn-icon">
            <img class="btn-icon-img" :src="icon"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "sideStopButton",
        props: {
            module: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        computed:{
            attributes() {
                return this.module.attributes;
            },
            icon() {
                return this.attributes.icon.value;
            },
        }
    }
</script>

<style scoped>

    .btn-icon {
        width: 50px;
        text-align: center;
        line-height: 1;
    }

    .btn-icon-img {
        width: 46px;
        height: 46px;
        display: block;
        margin: 0 auto;
    }
</style>
