<template>
    <div>
        <div v-for="notice of list" :key="notice.id" class="flex notice-item">
            <div style="margin-right: 4px;">
                <i :class="notice.targetTable | noticeIcon(notice.targetType)" style="font-size: 16px;"></i>
            </div>
            <div class="flex-fill-in-the-remaining-space" >
                <div style="margin-bottom: 4px;color: #333333;" class="flex">
                    <div class="flex-fill-in-the-remaining-space text-overflow flex flex-column flex-center">{{notice.title}}</div>
                    <div class="flex flex-column flex-center" style="font-size: 12px;color:#8f8f8f;">{{notice.createTime | yyyyMMddHHmm}}</div>
                </div>
                <div v-show="notice.content">
                    <pre style="font-size: 14px;color:rgba(0,0,0,.45);" v-html="notice.content"></pre>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PortalCellNoticeList",
        props:{
            module: Object,
            currentPage: Number
        },
        filters:{
            noticeIcon(tableId,type){
                if(tableId === 0){
                    if(type === 9){
                        return 'iconfont icon-notice-notice color-primary';
                    }
                    return 'iconfont icon-notice-examine'
                }else if(tableId === 1){
                    return 'iconfont icon-notice-dues-payment color-warning'
                }else if(tableId === 2){
                    return 'iconfont icon-notice-dues-payment color-warning'
                }else{
                    return 'el-icon-message-solid color-primary';
                }
            }
        },
        computed:{
            funcGroup(){
                return this.module.attributes.funcGroup.attributes;
            },
            pageSize(){
                return this.funcGroup.pageSize.value;
            },
            listParams(){
                return {
                    limit: this.pageSize,
                    offset: (this.currentPage - 1) * this.pageSize,
                }
            }
        },
        data(){
            return {
                list: [],
            }
        },
        methods:{
            getList(){
                this.$emit('loading-change',true);
                this.$request.get('/api/admin/notice/list', {params:this.listParams}).then((resp) => {
                    let {data} = resp;
                    this.list = data.list;
                    this.$emit('total-change',data.total);
                    this.$emit('loading-change',false);
                });
            }
        },
        mounted() {
            this.getList();
        },
        watch:{
            listParams(){
                this.getList();
            }
        }
    }
</script>
<style scoped lang="less">
    .notice-item{
        cursor: pointer;
        padding: 12px;
        &:not(:last-child){
            border-bottom: 1px solid #f0f0f0;
        }

        &:hover {
            background: #e6f7ff;
        }
    }
</style>
