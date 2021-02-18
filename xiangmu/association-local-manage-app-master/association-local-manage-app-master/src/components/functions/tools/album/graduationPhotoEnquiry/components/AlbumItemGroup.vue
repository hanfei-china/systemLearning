<template>
    <div class="flex flex-center" style="height: 100%;width: 100%;">
        <div class="flex flex-center flex-column">
            <div class="flex album-item-group" v-for="(children,index) of list2d" :key="index">
                <album-item v-for="item in children" :key="item.id" :album="item"/>
            </div>
        </div>
    </div>
</template>

<script>
    import AlbumItem from "./AlbumItem";
    export default {
        name: "AlbumItemGroup",
        components: {AlbumItem},
        props:{
            albums: Array,
            row: Number,
            rowSize: Number,
            itemSmall: Boolean
        },
        computed:{
            list2d(){
                let array_2d = [];
                for (let index = 0; index < this.albums.length; index += this.rowSize) {
                    let temp = this.albums.slice(index, index + this.rowSize);
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
    .album-item-group{

        &:not(:last-child){
            margin-bottom: 16px;
        }
    }
</style>

