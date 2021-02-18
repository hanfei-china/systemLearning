<template>
    <div v-if="isFirst">
        <el-table :data="list" height="100%" size="small" class="custom-el-table header-gray" border
                  stripe>
            <el-table-column fixed type="index" width="55" align="center" label="序号"></el-table-column>
            <el-table-column label="章节名称" prop="name" show-tooltip-when-overflow></el-table-column>
            <el-table-column label="免费试看">
                <template v-slot="{row}">
                    <span v-if="row.free">免费</span>
                    <span v-else>收费</span>
                </template>
            </el-table-column>
            <el-table-column label="查看详情">
                <template v-slot="{row}">
                    <a :href="row.resource" target="_blank">点击查看</a>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div v-else>
        <el-card v-for="(item, index) of list" :key="index" style="margin-top: 6px">
            <div slot="header">
                {{item.name}}
            </div>
            <el-table :data="item.items" height="100%" size="small" class="custom-el-table header-gray" border
                      stripe>
                <el-table-column fixed type="index" width="55" align="center" label="序号"></el-table-column>
                <el-table-column label="章节名称" prop="name" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="免费试看">
                    <template v-slot="{row}">
                        <span v-if="row.free">免费</span>
                        <span v-else>收费</span>
                    </template>
                </el-table-column>
                <el-table-column label="查看详情">
                    <template v-slot="{row}">
                        <a :href="row.resource" target="_blank">点击查看</a>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "CatalogList",
        props: {list: Array},
        computed: {
            isFirst(){
                if(this.list && this.list.length>0 && this.list[0].items){
                    return false;
                }else {
                    return true;
                }
            }
        }
    }
</script>

<style scoped>

</style>
