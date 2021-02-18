<template>
    <div class="absolute-fill-parent container-background" style="overflow: hidden;" v-loading="loading">
        <div v-show="isChosen" class="flex flex-column flex-center" style="height: 60px;padding: 0 16px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item class="cursor-pointer-primary" @click.native="clear">全部</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(category,index) of categoryGroup"
                                    :class="{'cursor-pointer-primary': index < categoryGroup.length - 1}" @click.native="back(index)" :key="category.id">{{category.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div ref="container" style="width: 100%;position: relative;overflow: hidden;" :style="style">
            <div class="flex flex-center flex-column absolute-fill-parent category-container">
                <div>
                    <el-carousel :height="height" :indicator-position="isChosen ? 'none' : 'outside'">
                        <el-carousel-item v-for="(children,index) of list2d" :key="index">
                            <album-category-item-group :item-small="isChosen" :row-size="rowSize"
                                                       :album-categories="children" @change-category="changeCategory"/>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </div>
        <div class="albums-container position-relative" :style="albumsStyle">
            <album-list v-if="albumCategory.id" :category-id="albumCategory.id" :albums-height="albumsHeight"/>
        </div>
    </div>
</template>

<script>
    import {addListener, removeListener} from 'resize-detector';
    import AlbumCategoryItemGroup from "./components/AlbumCategoryItemGroup";
    import AlbumList from "./components/AlbumList";
    export default {
        name: "AcademyList",
        components: {AlbumList, AlbumCategoryItemGroup},
        data(){
            return {
                list: [],
                rootList: [],
                height: '400px',
                rowSize: 4,
                row: 2,
                rowRemainder: 0,
                isChosen: false,
                albumCategory: {},
                categoryGroup: [],
                loading: true
            }
        },
        mounted(){
            this.getList();
            this.resize();
            addListener(this.$refs.container,this.resize);
        },
        computed:{
            style(){
                if(this.list.length > 0){
                    if(this.isChosen){
                        return {
                            height: '90px',
                        }
                    }else{
                        return {
                            height:  window.innerHeight + 'px'
                        }
                    }
                }else{
                    return {
                        height: 0
                    }
                }
            },
            albumsStyle(){
                if(this.isChosen){
                    return {
                        height: (window.innerHeight - 150)+'px',
                        opacity: 1
                    }
                }else{
                    return {
                        height:  0,
                        opacity: 0
                    }
                }
            },
            albumsHeight(){
                if(this.isChosen){
                    return window.innerHeight - 150;
                }else{
                    return 0;
                }
            },
            pageSize(){
                return this.rowSize * this.row;
            },
            list2d(){
                let pageSize = this.pageSize;
                let array_2d = [];
                for (let index = 0; index < this.list.length; index += pageSize) {
                    let temp = this.list.slice(index, index + pageSize);
                    array_2d.push(JSON.parse(JSON.stringify(temp)));
                }
                return array_2d;
            },
        },
        methods: {
            getList(){
                this.$request.get('/api/common/group/anon/getGroup',{params: {type: 2}}).then(res => {

                    let result = res.data.filter(item => {
                        return item.otherType !== 0
                    });

                    this.list = result;
                    this.rootList = JSON.parse(JSON.stringify(result));
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            resize(){
                let width = window.innerWidth;
                if(this.isChosen){
                    this.row = 1;
                    this.rowSize = Math.floor((width-100)/170);
                    this.height = '90px';
                }else{
                    let height = this.isChosen ? 200 : this.$refs.container.clientHeight;

                    let rowHeight = 196;


                    let row = Math.floor(height/rowHeight);
                    let rowRemainder = height % rowHeight;
                    this.rowRemainder = rowRemainder;

                    if(rowRemainder > 100){
                        row = row - 1;
                    }else{
                        row = row - 2;
                    }

                    if(row < 1){
                        row = 1;
                    }

                    this.row = row;

                    let diff = 100;

                    if(width <= 1680 + diff){
                        this.rowSize = 4;
                    }else if(width > 1680 + diff && width < 2016){
                        this.rowSize = 5;
                    }else{
                        this.rowSize = 6;
                    }

                    this.height = (this.row * 200)+'px';
                }

            },
            changeCategory(albumCategory){
                this.isChosen = true;
                this.list = albumCategory.children;
                this.albumCategory = albumCategory;
                this.categoryGroup.push(albumCategory);
            },
            clear(){
                this.isChosen = false;
                this.albumCategory = {};
                this.categoryGroup = [];
                this.list = JSON.parse(JSON.stringify(this.rootList));
            },
            back(index){
                let albumCategory = this.categoryGroup[index];
                this.albumCategory = JSON.parse(JSON.stringify(albumCategory));
                this.list = JSON.parse(JSON.stringify(albumCategory.children));
                this.categoryGroup = this.categoryGroup.slice(0,index+1);
            }
        },
        beforeDestroy() {
            removeListener(this.$refs.container,this.resize);
        },
        watch:{
            isChosen(){
                this.resize();
            },
            categoryId(){
                this.getGroupList();
            },
        }
    }
</script>
<style lang="less">
    .category-container{
        transition: all 1s;
    }

    .albums-container{
        transition: all 1s;
        overflow: hidden;
    }
</style>
