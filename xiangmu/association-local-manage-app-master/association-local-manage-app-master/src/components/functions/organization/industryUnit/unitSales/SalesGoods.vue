<template>
    <div style="font-size: 14px;line-height: 18px;">
        <div class="flex">
            <div>消费详情：</div>
            <div class="flex-fill-in-the-remaining-space flex flex-wrap">
                <div v-for="item in serversInfo" :key="item.id" style="width: 160px;padding: 0 10px 10px 0;">
                    <el-card :body-style="{ padding: '0px' }">
                        <div style="width: 100%;height: 120px;margin-right: 10px;">
                            <el-image style="width: 100%;height: 100%;" fit="cover"
                                      :src="item.posterUrl"></el-image>
                        </div>
                        <div style="padding: 10px;">{{item.title}}</div>
                    </el-card>
                </div>
            </div>
        </div>
        <div>消费备注：{{remark | formatNull}}</div>
    </div>
</template>

<script>
    export default {
        name: "SalesGoods",
        props: {
            serversInfo: {
                type: Array
            },
            remark: {
                type: String
            }
        },
        filters: {
            formatNull(val){
                if(!val || val === 'null'){
                    return '-'
                }else {
                    return val;
                }
            }
        },
    }
</script>

<style scoped>

</style>