<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside class="unset-padding position-relative border-right" width="200px" v-if="!classId">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-column flex-center border-bottom">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">所有分类
                        </div>
                    </div>
                </el-header>
                <el-main class="unset-padding position-relative">
                    <div class="absolute-fill-parent">
                        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                            <el-menu @select="setChosenId" class="border-right-unset custom-el-menu"
                                     :default-active="chosenId">
                                <el-menu-item v-for="item of classList" :index="item.id" :key="item.id">
                                    <div class="text-overflow" style="width: 160px;">{{item.title}}</div>
                                </el-menu-item>
                            </el-menu>
                        </vue-scroll>
                    </div>
                </el-main>
            </el-container>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <label-group-list :labelClassId="classId || chosenId" :labelClassType="labelClassType"></label-group-list>
        </el-main>
    </el-container>
</template>

<script>
    import LabelGroupList from "./LabelGroupList";
    export default {
        name: "LabelManage",
        components: {LabelGroupList},
        data() {
            return {
                classId: null,//标签类型,有值则显示侧边栏
                classList: [],
                chosenId: null,//选中的分类
                labelClassType: null,//分类的type值
            }
        },
        created() {
            if (this.$route.params.classId) {
                this.classId = this.$route.params.classId;
                this.$request.get('/api/admin/label/manage/listLabels',{params: {limit: 1000,offset: 0}}).then(res => {
                    if(res.success){
                        let typeItem = res.data.list.filter(item => {
                            if(item.id === this.classId){
                                return item
                            }
                        });
                        this.labelClassType = typeItem[0].type;
                    }
                })
            }else {
                this.getList();
            }
        },
        methods: {
            //获取标签分类列表
            getList(){
                this.$request.get('/api/admin/label/manage/listLabels',{params: {limit: 1000,offset: 0}}).then(res => {
                    if(res.success){
                        this.classList = res.data.list;
                        this.chosenId = res.data.list[0].id;
                        this.labelClassType = res.data.list[0].type;
                    }
                })
            },
            //选中分类
            setChosenId(id) {
                this.chosenId = id;
                let typeItem = this.classList.filter(item => {
                    if(item.id === id){
                        return item
                    }
                });
                this.labelClassType = typeItem[0].type;
            }
        }
    }
</script>

<style scoped>

</style>
