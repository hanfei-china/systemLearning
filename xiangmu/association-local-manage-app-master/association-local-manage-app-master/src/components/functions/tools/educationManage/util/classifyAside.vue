<template>
    <div>
        <vue-scroll>
            <el-tree :data="classifyData" :props="defaultProps"></el-tree>
        </vue-scroll>
    </div>
</template>

<script>
    export default {
        name: "classifyAside"
    }
</script>

<style scoped>

</style>