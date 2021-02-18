<template>
    <div class="home-btn-page">
        <home-btn v-for="(item, index) in data" :key="index" :module="item" :row-btn-count="rowBtnCount"></home-btn>
    </div>
</template>

<script>
    import homeBtn from '../homeBtn/homeBtn';

    export default {
        name: "homeBtnPage",
        components: {
            homeBtn
        },
        props: {
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            rowBtnCount: {
                type: Number,
                default: 4
            }
        }
    }
</script>

<style scoped>
    .home-btn-page {
        padding: 16px 19px 0;
    }
</style>
