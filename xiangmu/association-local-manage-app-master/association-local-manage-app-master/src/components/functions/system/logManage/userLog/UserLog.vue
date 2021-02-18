<template>
    <common-table :logType="userLog"></common-table>
</template>

<script>
    import CommonTable from "../commonUtil/CommonTable";
    export default {
        name: "UserLog",
        components: {CommonTable},
        data(){
            return {
                userLog: 'userLog'
            }
        }
    }
</script>

<style scoped>

</style>