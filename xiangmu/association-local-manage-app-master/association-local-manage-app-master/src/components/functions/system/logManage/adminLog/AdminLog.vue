<template>
    <common-table :logType="adminLog"></common-table>
</template>

<script>
    import CommonTable from "../commonUtil/CommonTable";
    export default {
        name: "AdminLog",
        components: {CommonTable},
        data(){
            return {
                adminLog: 'adminLog'
            }
        }
    }
</script>

<style scoped>

</style>