<template>
    <div class="album-category-item" :class="{small:itemSmall}" @click="toAlbumList">
        <div class="album-category-item-image-container" style="width:100%;height: 100%;">
            <div class="album-category-item-image" :style="img"/>
        </div>
        <div class="album-category-item-cover">
            <div class="album-category-item-name">
                <div>{{albumCategory.name}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AlbumCategoryItem",
        props:{
            albumCategory: Object,
            itemSmall: Boolean
        },
        computed:{
            img(){
                let {photoAlbumUrls,defaultCoverUrl} = this.albumCategory;

                if(photoAlbumUrls && photoAlbumUrls.length > 0){
                    return {
                        backgroundImage: `url(${photoAlbumUrls[0]})`
                    };
                }else{
                    return {
                        backgroundImage: `url(${defaultCoverUrl})`
                    };
                }
            }
        },
        methods:{
            toAlbumList(){
                this.$emit('change-category', {...this.albumCategory});
            },
        }
    }
</script>

<style lang="less">
    .album-category-item{
        position: relative;
        width: 320px;
        height: 180px;
        border-radius: 4px;
        overflow: hidden;
        background-color: #fff;
        cursor: pointer;
        user-select: none;
        transition: all .3s;

        &.small{
            width: 160px;
            height: 90px;
        }

        &:not(:last-child){
            margin-right: 16px;
        }

        &:hover{
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            .album-category-item-image{
                transform: scale(1.2);
            }
        }

        &-cover{
            position: absolute !important;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            border-radius: 4px;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, .1) 70%, rgba(0, 0, 0, .5) 100%);
        }
        &-image{
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            width: 100%;
            height: 100%;
            transition: all .3s;
        }

        &-name{
            padding: 10px;
            color: #ffffff;
            font-size: 14px;
        }
    }
</style>
