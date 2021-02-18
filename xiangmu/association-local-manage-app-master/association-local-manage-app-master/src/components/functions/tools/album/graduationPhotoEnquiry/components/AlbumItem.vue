<template>
    <div class="album-item">
        <div class="album-item-cover">
            <div class="album-item-skin">
                <div class="album-item-image" :style="img">
                    <div class="album-item-image-text flex flex-center flex-column">
                        <div class="album-item-image-text-content" :style="img">MEMORY IS FOREVER</div>
                    </div>
                </div>
            </div>
            <div class="album-item-base-info">
                <div class="album-item-title">{{album.title}}</div>
                <div class="album-item-time">
                    <span>{{album.createTime | yyyyMMdd}}</span>
                </div>
            </div>
        </div>
        <viewer style="z-index:2000;overflow:hidden;" @click.native="toAlbumList" class="absolute-fill-parent" :images="photoList">
            <img :src="album.coverUrl" v-if="photoList.length < 1" :alt="album.title" style="opacity: 0;"/>
            <img v-for="(image,index) of photoList" :key="image.id" :src="image.photoUrl" :alt="album.title+'-'+(index+1)" style="opacity: 0;"/>
        </viewer>
    </div>
</template>

<script>
    export default {
        name: "AlbumItem",
        props:{
            album: Object,
        },
        data(){
            return {
                limit: 500,
                currentPage: 1,
                photoList: [],
                showPhotoList: false
            }
        },
        computed:{
            img(){
                return {
                    backgroundImage: `url(${this.album.coverUrl})`
                }
            }
        },
        methods:{
            toAlbumList(){

                this.showPhotoList = true;

                if(this.photoList.length < 1){
                    this.getPhotoList();
                }
                // const body = document.querySelector("body");
                // if (body.append) {
                //     body.append(this.$refs.viewer.$el);
                // } else {
                //     body.appendChild(this.$refs.viewer.$el);
                // }
            },
            getPhotoList() {
                this.$request.get('/api/member/photoAlbum/anon/getPhotosByAlbumId', {
                    params: {
                        albumId: this.album.id,
                        limit: this.limit,
                        offset: (this.currentPage - 1) * this.limit,
                        fileType:1
                    }
                }).then(res => {
                    this.photoList = this.photoList.concat(res.data.list);
                    let total = res.data.total;
                    if (this.limit * this.currentPage < total) {
                        this.currentPage = this.currentPage + 1;
                        this.getPhotoList();
                    }
                })
            },
        }
    }
</script>

<style lang="less">
    .album-item{
        position: relative;
        width: 210px;
        height: 300px;
        border-radius: 5px 15px 15px 5px;

        /*overflow: hidden;*/
        /*background-color: #cc4b48;*/
        background-image: url("../../../../../../assets/gold.jpeg");
        cursor: pointer;
        user-select: none;
        transition: all .3s;
        box-shadow: 8px 6px 8px rgba(0, 0, 0, .8), 0 0 6px rgba(0, 0, 0, .04);

        &:not(:last-child){
            margin-right: 32px;
        }

        &-cover{
            position: absolute !important;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background-color: rgba(0,0,0,.1);
            border-radius: 5px 15px 15px 5px;
            z-index: 10;
            transition: .5s linear;

        }

        &-skin{
            height: 100px;
            background: #e8e8e0;
            margin-top: 100px;
            font-size: 12px;
            position: relative;
            z-index: 10;
            color: #222;
            text-align: left;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        &-image{
            background-size: cover;
            background-position: center;
            background-repeat: repeat;
            width: 100%;
            height: 100%;
            transition: all .3s;
            z-index: 1;

            &-text{
                background-color: rgba(255,255,255,.25);
                width: 100%;
                height: 100%;
                transition: all .3s;
                z-index: 1;

                &-content{
                    font-size: 30px;
                    background-image: url("../../../../../../assets/gold.jpeg");
                    -webkit-text-stroke: 1px #cc4b48;
                    -webkit-text-fill-color:transparent;
                    -webkit-background-clip: text;
                    font-family: "Times New Roman";
                    padding-left: 4px;
                }
            }
        }

        &-base-info{
            position: absolute;
            bottom: 20px;
            width: 100%;
            z-index: 101;
        }

        &-title{
            padding: 0 16px;
            text-align: right;
            font-size: 14px;
            color: #e9ecf0;
            font-family: "微软雅黑", "楷体";
        }

        &-time{
            padding: 0 16px;
            text-align: right;
            font-size: 12px;
            color: #e9ecf0;
            position: relative;
            height: 20px;

            &>span{
                display: inline-block;
                transform: scale(0.8);
                position: absolute;
                right: 10px;
            }
        }
    }
</style>
