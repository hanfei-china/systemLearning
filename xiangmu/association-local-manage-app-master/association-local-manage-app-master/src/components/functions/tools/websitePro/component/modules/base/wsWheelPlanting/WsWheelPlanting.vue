<template>
    <div class="website-pro-module-container website-pro-wheel-planting" :style="style">
        <el-carousel v-if="reloading" :autoplay="autoplay" :indicator-position="indicator"
                     :height="module.attributes.layoutGroup.attributes.layout.value.height+'px'" :arrow="arrow" style="position: relative;width: 100%;height: 100%;">
            <el-carousel-item v-for="content of contentList" :key="content.contentId">
                <ws-wheel-planting-item :content="content" :design="design" :classId="classId" :labels="labelList"
                                        :show-content="module.attributes.viewGroup.attributes.showContent.value"
                                        :item-click="module.attributes.linkGroup.attributes.itemClickConfig.value"
                                        :label-click="module.attributes.linkGroup.attributes.moreConfig.value"
                                        :background-color="module.attributes.viewGroup.attributes.itemBackgroundColor.value"/>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    import WsWheelPlantingItem from "./WsWheelPlantingItem";
    export default {
        name: "WsWheelPlanting",
        components: {WsWheelPlantingItem},
        props:{
            module: Object,
            design: Boolean
        },
        computed:{
            dragClass(){
                if(this.design){
                    return 'lrd-dom-drag';
                }

                return '';
            },
            customClasses(){
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            style(){
                let style = {};

                if(!this.design){
                    style.width = 'auto';
                    style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                    style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
                    style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                    style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                    style.position = 'absolute';
                    style.right = 0;
                }

                return style;
            },
            indicator(){
                return this.module.attributes.viewGroup.attributes.pageable.value ? null : 'none';
            },
            arrow(){
                return this.module.attributes.viewGroup.attributes.navigable.value ? 'hover' : 'never';
            },
            autoplay(){
                return this.module.attributes.viewGroup.attributes.autoplay.value;
            },
            classId(){
                let {dataSrc,classId} = this.module.attributes.dataSrcGroup.attributes.dataSrc.value;

                if(dataSrc === 1){
                    return classId;
                }

                if(dataSrc === 2){
                    return this.$route.query.classId;
                }

                return '';
            },
            labelId(){
                let {dataSrc,labelId} = this.module.attributes.dataSrcGroup.attributes.dataSrc.value;
                if(dataSrc === 1){
                    return labelId;
                }

                if(dataSrc === 2){
                    return  this.$route.query.labelId;
                }

                return '';
            },
            pageSize(){
                return this.module.attributes.viewGroup.attributes.page.value.pageSize;
            },
        },
        data(){
            return {
                contentList: [],
                labelList: [],
                total: 0,
                reloading: true
            }
        },
        methods:{
            getContentList() {
                if (this.classId) {
                    let params = {
                        filterUnPublish: true,
                        classId: this.classId,
                        labelId: this.labelId,
                        limit: this.pageSize,
                        topModel: true,
                        offset: 0,
                    };
                    this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                        let {data} = resp;
                        this.labelList = data.labelList;
                        this.contentList = data.list;
                        this.total = data.total;

                        if(this.module.attributes.dataSrcGroup.attributes.dataSrc.value.dataSrc === 2){
                            this.module.attributes.titleGroup.attributes.title.value = data.classTitle;
                        }
                    });
                }
            },
            reloadList() {
                this.getContentList();
            },
            setHeight(){
                this.module.attributes.layoutGroup.attributes.layout.value.height = this.$refs.contentList.clientHeight > 0 ? this.$refs.contentList.clientHeight : 20;
            }
        },
        created(){
            this.reloadList();
        },
        watch:{
            classId(){
                this.reloadList();
            },
            labelId(){
                this.reloadList();
            },
            pageSize(){
                this.reloadList();
            },
            autoplay(){
                this.reloading = false;
                setTimeout(()=>{
                    this.reloading = true;
                },10);
            },
        },
    }
</script>
