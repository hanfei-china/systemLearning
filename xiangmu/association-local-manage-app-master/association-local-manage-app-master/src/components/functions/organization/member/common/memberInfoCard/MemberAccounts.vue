<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-main style="padding: 16px;">
            <el-table :data="accounts" size="small" height="100%" border stripe>
                <el-table-column label="序号" type="index" align="center" fixed/>
                <el-table-column label="账号" show-tooltip-when-overflow prop="account"/>
                <el-table-column label="账号角色" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.roleInfo ? row.roleInfo.name : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="手机号" show-tooltip-when-overflow prop="phone"/>
                <el-table-column label="邮箱" show-tooltip-when-overflow prop="email"/>
                <el-table-column label="创建时间" width="140" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "MemberAccounts",
        props:{
            accounts: Array
        }
    }
</script>

<style scoped>

</style>
