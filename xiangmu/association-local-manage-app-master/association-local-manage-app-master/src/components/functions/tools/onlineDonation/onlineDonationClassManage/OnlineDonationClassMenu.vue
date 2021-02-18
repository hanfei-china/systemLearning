<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">所有分类</div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                    <el-menu @select="setChosenClass" class="border-right-unset custom-el-menu" :default-active="chosenClass">
                        <el-menu-item v-for="contentClass of list" :index="contentClass.id" :key="contentClass.id">
                            <div class="text-overflow" style="width: 160px;">{{contentClass.title}}</div>
                        </el-menu-item>
                    </el-menu>
                </vue-scroll>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "OnlineDonationClassMenu",
        data(){
            return {
                list: [],
                chosenClass:'',
                visible : false,
            }
        },
        methods:{
            getList(){
                this.visible = false;
                this.$request.get('/api/admin/onlineDonationClass/list').then(res=>{
                    this.list = res.data;
                    if(res.data.length > 0){
                        this.chosenClass = res.data[0].id;
                    }else{
                        this.visible = true;
                    }
                })
            },
            setChosenClass(classId){
                this.chosenClass = classId;
            }
        },
        created() {
            this.getList();
        },
        watch:{
            chosenClass(val){
                this.$emit('select',val);
            }
        }
    }
</script>
