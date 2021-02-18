<template>
    <div class="flex flex-center" style="height: 100%;width: 100%;">
        <div class="flex flex-center flex-column">
            <div class="flex album-category-item-group" v-for="(children,index) of list2d" :key="index">
                <album-category-item :item-small="itemSmall" @change-category="changeCategory"
                                     v-for="item in children" :key="item.id" :album-category="item"/>
            </div>
        </div>
    </div>
</template>

<script>
    import AlbumCategoryItem from "./AlbumCategoryItem";
    export default {
        name: "AlbumCategoryItemGroup",
        components: {AlbumCategoryItem},
        props:{
            albumCategories: Array,
            row: Number,
            rowSize: Number,
            itemSmall: Boolean
        },
        computed:{
            list2d(){
                let array_2d = [];
                for (let index = 0; index < this.albumCategories.length; index += this.rowSize) {
                    let temp = this.albumCategories.slice(index, index + this.rowSize);
                    array_2d.push(JSON.parse(JSON.stringify(temp)));
                }
                return array_2d;
            },
        },
        methods:{
            changeCategory(albumCategory){
                this.$emit('change-category', albumCategory);
            },
        }
    }
</script>
<style lang="less">
    .album-category-item-group{

        &:not(:last-child){
            margin-bottom: 16px;
        }
    }
</style>

