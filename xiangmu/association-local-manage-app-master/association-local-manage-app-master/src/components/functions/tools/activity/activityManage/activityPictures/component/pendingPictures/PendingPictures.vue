<template>
    <el-container class="absolute-fill-parent">
        <el-main>
            <vue-scroll>
                <div class="flex flex-wrap">
                    <pending-picture-item v-for="(image,index) of pictureList" :key="image.id" @delete-item="deleteItem(index)" :picture="image"/>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    import PendingPictureItem from "./PendingPictureItem";
    export default {
        name: "PendingPictures",
        components: {PendingPictureItem},
        data(){
            return {
                pageSize: 500,
                offset: 1,
                pictureList: [],
                listCount: 0,
            }
        },
        computed:{
            activityId(){
                return this.$route.params.activityId;
            },
        },
        methods:{
            getPictureList() {
                this.pictureList = [];
                this.$request.post('/api/admin/photoAlbum/manage/viewPhotoApply', {
                    albumId: this.activityId,
                    limit: this.pageSize,
                    offset: (this.offset - 1) * this.pageSize,
                    state: 0
                }).then(res => {
                    if (res.success) {
                        this.pictureList = this.pictureList.concat(res.data.list);
                        this.listCount = res.data.total;

                        if (this.limit * this.offset < this.listCount) {
                            this.offset = this.offset + 1;
                            this.getPictureList();
                        }else{
                            for (let i = 0; i < this.pictureList.length; i++) {
                                this.$set(this.pictureList[i], 'checked', false);
                            }
                        }
                    }
                })
            },
            deleteItem(index){
                this.pictureList.splice(index,1);
            }
        },
        mounted() {
            this.getPictureList();
        }
    }
</script>
