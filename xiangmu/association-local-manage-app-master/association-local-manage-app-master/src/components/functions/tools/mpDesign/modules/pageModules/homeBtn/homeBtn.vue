<template>
    <div class="home-btn-container" :class="homeBtnContainerStyle">
        <div class="home-btn-label">
            <div class="home-btn-icon">
                <img class="home-btn-icon-img" :src="icon"/>
            </div>
            <div class="home-btn-title">{{title}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "homeBtn",
        props: {
            module: Object,
            rowBtnCount: {
                type: Number,
                default: 4
            }
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            title() {
                return this.attributes.title.value;
            },
            icon() {
                return this.attributes.icon.value;
            },
            homeBtnContainerStyle() {
                return `row-${this.rowBtnCount}-home-btn`
            }
        }
    }
</script>

<style scoped>
    .home-btn-container {
        display: inline-block;
        width: 80px;
        padding: 5px 2px;
    }

    .home-btn-container.row-2-home-btn {
        width: 160px;
    }

    .home-btn-container.row-3-home-btn {
        width: 108px;
    }

    .home-btn-label {
        display: flex;
        flex-direction: column;
    }

    .home-btn-icon {
        text-align: center;
        height: 46px;
    }

    .home-btn-icon-img {
        width: 46px;
        height: 46px;
        display: inline-block;
    }

    .home-btn-title {
        font-size: 12px;
        text-align: center;
    }
</style>
