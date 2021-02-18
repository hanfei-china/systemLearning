<template>
    <div class="entry-item">
        <div class="entry-icon" v-if="attributes.icon.value">
            <img :src="attributes.icon.value"/>
        </div>
        <div class="entry-name">{{attributes.title.value}}</div>
        <div class="entry-arrow">></div>
    </div>
</template>

<script>
    export default {
        name: "entry",
        props: {
            module: Object
        },
        computed: {
            attributes(){
                return this.module.attributes;
            }
        }
    }
</script>

<style scoped>
    .entry-item {
        height: 22px;
        padding: 13px 16px;
        display: flex;
        line-height: 22px;
    }

    .entry-item:not(:last-child) {
        border-bottom: 1px solid #eaeaea;
    }

    .entry-icon {
        width: 22px;
        margin-right: 10px;
    }

    .entry-icon > img {
        width: 22px;
        height: 22px;
        display: block;
    }

    .entry-name {
        flex: 1;
        font-size: 15px;
    }

    .entry-new-item-count {
        margin-left: 10px;
        font-size: 12px;
    }

    .entry-arrow {
        margin-left: 10px;
        color: #D0D0D0;
    }
</style>
