<template>
    <div class="enter-group">
        <entry v-for="(entry,index) in module.list" :key="index" :module="entry"></entry>
    </div>
</template>

<script>
    import entry from '../entry/entry';

    export default {
        name: "entryGroup",
        components: {
            entry
        },
        props: {
            module: Object
        },
    }
</script>

<style scoped>
    .enter-group {
        background-color: #FFFFFF;
        min-height: 43px;
    }
</style>
