<template>
    <div class="module-container" style="background-color: #FFFFFF;">
        <function-title :title="title" :color="titleColor" :icon="titleIcon" style="padding: 8px 16px;"
                        :icon-position="titleIconPosition" v-if="isShowTitle" has-more/>
        <div class="flex album-container" :style="{paddingTop: isShowTitle ? '0px' : '10px'}">
            <div class="album-item" v-for="album of albums" :style="{backgroundImage: `url(${album.coverUrl})`}"
                 :key="album.id">
                <div class="absolute-fill-parent album-item-cover">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space">{{album.title}}</div>
                        <div><i class="el-icon-picture"></i>{{album.photoNum}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import FunctionTitle from "../../../common/FunctionTitle";
    export default {
        name: "Album",
        components: {FunctionTitle},
        props: {
            module: Object,
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            isShowTitle() {
                return this.attributes.isShowTitle.value;
            },
            title() {
                return this.attributes.title.value;
            },
            titleColor() {
                return this.attributes.titleColor.value;
            },
            titleIcon() {
                return this.attributes.titleIcon.value;
            },
            titleIconPosition() {
                return this.attributes.titleIconPosition.value;
            },
            albumType() {
                return this.attributes.albumType.value;
            },
            dataMaxCount() {
                return this.attributes.dataMaxCount.value;
            },
        },
        data(){
            return {
                albums: []
            }
        },
        methods:{
            getAlbums(){
                this.$request.get('/api/admin/photoAlbum/manage/getPhotoAlbums',{
                    params:{
                        categoryId: this.albumType,
                        inUsed: true,
                        limit: this.dataMaxCount,
                        offset: 0
                    }
                }).then(res=>{
                    this.albums = res.data.list;
                })
            }
        },
        created() {
            this.getAlbums();
        },
        watch:{
            albumType(){
                this.getAlbums();
            },
            dataMaxCount(){
                this.getAlbums();
            }
        }
    }
</script>
<style scoped lang="less">
    .album-container{
        padding: 0 16px 10px 16px;
        overflow: hidden;
    }
    .album-item{
        position: relative;
        border-radius: 4px;
        border: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        height: 90px;
        flex: 0 0 160px;
        margin-right: 10px;
        background-size: cover;
        background-position: center;
        color: #ffffff;
        font-size: 12px;
        overflow: hidden;

        &-cover{
            padding: 5px;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 20%, rgba(0, 0, 0, 0) 100%);
        }
    }
</style>
