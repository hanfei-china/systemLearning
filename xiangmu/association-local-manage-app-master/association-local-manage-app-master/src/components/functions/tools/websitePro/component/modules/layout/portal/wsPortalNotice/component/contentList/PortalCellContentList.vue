<template>
    <div>
        <portal-cell-content-item v-for="content of contentList" :content="content" :key="content.id"/>
    </div>
</template>

<script>
    import PortalCellContentItem from "./PortalCellContentItem";
    export default {
        name: "PortalCellContentList",
        components: {PortalCellContentItem},
        props:{
            module: Object,
            currentPage: Number
        },
        computed:{
            funcGroup(){
                return this.module.attributes.funcGroup.attributes;
            },
            contentClass(){
                return this.funcGroup.contentClass.value;
            },
            pageSize(){
                return this.funcGroup.pageSize.value;
            },
            listParams(){
                return {
                    filterUnPublish: true,
                    classId: this.contentClass,
                    limit: this.pageSize,
                    offset: (this.currentPage - 1) * this.pageSize,
                }
            }
        },
        data(){
            return {
                labelList: [],
                contentList: [],
            }
        },
        methods:{
            getList(){
                if(this.contentClass){
                    this.$emit('loading-change',true);
                    this.$request.get('/api/common/content/anon/list', {params:this.listParams}).then((resp) => {
                        let {data} = resp;
                        this.labelList = data.labelList;
                        this.contentList = data.list;
                        this.$emit('total-change',data.total);
                        this.$emit('loading-change',false);
                    });
                }
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
