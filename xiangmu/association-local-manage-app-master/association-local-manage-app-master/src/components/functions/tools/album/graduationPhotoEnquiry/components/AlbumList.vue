<template>
    <div ref="container" class="flex flex-center flex-column absolute-fill-parent category-container"
         v-loading.fullscreen="loading"  element-loading-text="拼命加载中..."
         element-loading-background="rgba(0, 0, 0, .2)" element-loading-spinner="el-icon-loading">
        <div v-show="albumList.length>0 && !loading">
            <el-carousel :autoplay="false" :loop="false" :height="albumsHeight+'px'" indicator-position="outside">
                <el-carousel-item v-for="(children,index) of list2d" :key="index">
                    <album-item-group :row-size="rowSize" :albums="children" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <no-data v-show="albumList.length <= 0  && !loading">
            <div class="text-align-center" style="color: #666666;padding-top: 10px;">暂无相册</div>
        </no-data>
    </div>
</template>

<script>
    import {addListener, removeListener} from 'resize-detector';
    import AlbumItemGroup from "./AlbumItemGroup";
    import NoData from "../../../../../util/noData/NoData";
    export default {
        name: "AlbumList",
        components: {NoData, AlbumItemGroup},
        props:{
            categoryId: String,
            albumsHeight: Number
        },
        data(){
            return {
                albumList: [],
                albumTotal: 0,
                limit: 500,
                pageIndex: 1,

                rowSize: 4,
                row: 2,
                rowRemainder: 0,
                loading: true
            }
        },
        computed:{
            pageSize(){
                return this.rowSize * this.row;
            },
            list2d(){
                let pageSize = this.pageSize;
                let array_2d = [];
                for (let index = 0; index < this.albumList.length; index += pageSize) {
                    let temp = this.albumList.slice(index, index + pageSize);
                    array_2d.push(JSON.parse(JSON.stringify(temp)));
                }

                return array_2d;
            },
        },
        mounted(){
            this.resize();
            this.getAlbumList();
            addListener(this.$refs.container,this.resize);
        },
        methods:{
            getAlbumList() {
                if(this.categoryId){
                    this.$request.get('/api/member/photoAlbum/anon/getPhotoAlbums', {
                        params: {
                            categoryId: this.categoryId,
                            limit: this.limit,
                            offset: this.limit * (this.pageIndex - 1)
                        }
                    }).then(res => {
                        this.albumList = this.albumList.concat(res.data.list);
                        this.albumTotal = res.data.total;
                        if(this.limit * this.pageIndex < this.albumTotal){
                            this.pageIndex = this.pageIndex + 1;
                            this.getAlbumList();
                        }else{
                            this.$nextTick(()=>{ this.loading = false; })
                        }
                    })
                }
            },
            resize(){

                let height = this.albumsHeight;
                let rowHeight = 316;


                let row = Math.floor(height/rowHeight);
                this.rowRemainder = height % rowHeight;

                if(row < 1){
                    row = 1;
                }

                if(row > 2){
                    row = 2;
                }

                this.row = row;

                this.height = (this.row * 200)+'px';
            },
        },
        beforeDestroy() {
            removeListener(this.$refs.container,this.resize);
        },
        watch:{
            categoryId(){
                this.loading = true;
                this.albumList = [];
                this.getAlbumList();
            }
        }
    }
</script>
