<template>
    <el-container class="absolute-fill-parent background-color-white onlineMall">
        <el-main class="unset-padding">
            <el-container class="absolute-fill-parent" v-if="!onlineMallFormVisible" style="padding: 0 20px;">
                <el-header class="flex unset-padding" style="line-height: 60px;">
                    <div class="flex-fill-in-the-remaining-space">
                        <el-input size="small" placeholder="请输入商品名称进行搜索" style="width: 450px;" v-model="searchContent"
                                  @change="getGoodsList" clearable prefix-icon="el-icon-search"></el-input>
                    </div>
                    <div>
                        <el-button size="small" type="primary" @click="addGoods">新增商品</el-button>
                    </div>
                </el-header>
                <el-main v-if="goodsList.length>0" class="unset-padding">
                    <vue-scroll>
                        <div class="tableWrap">
                            <div class="flex flex-wrap tableInner">
                                <div class="goodsItem" v-for="item in goodsList" :key="item.id">
                                    <div class="picWrap">
                                        <el-image :src="item.posterUrl" fit="cover"
                                                  style="width: 234px;height: 220px;"></el-image>
                                    </div>
                                    <div class="goodsDesc">
                                        <div class="price flex">
                                            <p class="position-relative" style="color: #f40;padding-left: 15px;">
                                                <span class="position-absolute" style="left: 0;">￥</span>
                                                <span style="font-size: 20px;">{{item.price | currency}}</span>
                                            </p>
                                            <p class="position-relative" v-if="item.integral > 0">
                                                <span style="font-size: 20px;padding: 0 0 0 5px;color: #999999;"> + {{item.integral}}</span>
                                                <span class="iconfont icon-jifen position-absolute" style="color: #ffd700;"></span>
                                            </p>
                                        </div>
                                        <el-tooltip class="item" effect="dark" :content="item.goodsName"
                                                    placement="top-start">
                                            <p class="title text-overflow">{{item.goodsName}}</p>
                                        </el-tooltip>
                                        <p class="gooodsNum">库存<span style="color: #646fb0;">{{item.goodsNum-item.soldNum}}/{{item.goodsNum}}</span>件
                                        </p>
                                        <div class="operate flex">
                                            <div class="flex-fill-in-the-remaining-space">
                                                <el-button type="text" class="unset-padding" @click="editGoods(item)">
                                                    编辑
                                                </el-button>
                                                <el-button type="text" class="unset-padding" style="color:red;" @click="deleteGoods(item.id)">
                                                    删除
                                                </el-button>
                                            </div>
                                            <div style="color: rgb(161, 165, 170);">
                                                启用
                                                <el-switch size="small" v-model="item.isShelves"
                                                           @change="updateShelves(item.isShelves,item.id)"></el-switch>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </vue-scroll>
                </el-main>
                <el-main v-else class="position-relative unset-padding">
                    <div class="position-absolute nodata_image">
                        <img src="../../../../../assets/nodata.png" style="width: 100%;height: 100%;"/>
                    </div>
                </el-main>
                <el-footer class="text-align-right unset-padding" style="padding-top: 14px;">
                    <el-pagination
                            size="small"
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 50, 200]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalCount">
                    </el-pagination>
                </el-footer>
            </el-container>
            <goods-form v-if="onlineMallFormVisible" :formTitle="formTitle" :goodsInfo="goodsInfo"
                        @closeAdd="onlineMallFormVisible = false" @refresh="refresh"></goods-form>
        </el-main>
    </el-container>
</template>

<script>
    import GoodsForm from './GoodsForm';
import { SET_FROMHOMEPAGE } from "@/js/store/mutation-types";
    export default {
        name: "GoodsManage",
        components: {GoodsForm},
        data() {
            return {
                searchContent: '',//搜索内容
                goodsList: [],//列表
                currentPage: 1,//第几页
                pageSize: 20,//每页条数
                totalCount: 0,//总量
                onlineMallFormVisible: false,//显示编辑页面
                formTitle: '新增商品',
                goodsInfo: {},//商品信息
            }
        },
        created() {
            this.getGoodsList();//获取商品列表
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getGoodsList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getGoodsList();
            },
            //获取商品列表
            getGoodsList() {
                this.$request.get('/api/admin/goods/listGoodsInfoForAdmin', {
                    params: {
                        limit: this.pageSize,
                        offset: (this.currentPage - 1) * this.pageSize,
                        searchContent: this.searchContent
                    }
                }).then(res => {
                    if (res.success) {
                        this.goodsList = res.data.list;
                        this.totalCount = res.data.total;
                    }
                })
            },
            //商品上架、下架
            updateShelves(val, id) {
                this.$request.post('/api/admin/goods/updateShelves', null, {params: {id}}).then()
            },
            //添加新商品
            addGoods() {
                this.onlineMallFormVisible = true;
                this.formTitle = '新增商品';
                this.goodsInfo = '';
            },
            //变更商品信息
            editGoods(val) {
                this.onlineMallFormVisible = true;
                this.formTitle = '编辑商品';
                this.goodsInfo = val;
            },
            //刷新
            refresh() {
                this.onlineMallFormVisible = false;
                this.getGoodsList();
            },
            //删除商品
            deleteGoods(id){
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$request.delete('/api/admin/goods/deleteGoods',{params:{id}}).then(res=>{
                            if (res.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                                this.getGoodsList();
                            }else{
                                this.$message({
                                    type: 'warning',
                                    message: '删除失败!'
                                })
                                this.getGoodsList();
                            }
                        })
                })
            }

        },
        mounted(){
          var fromHomePageType = this.$store.state.fromHomePageType;
          if(fromHomePageType=="addGoods"){
            this.addGoods()
          }
          this.$store.commit(SET_FROMHOMEPAGE,"");
        }
    }
</script>

<style scoped>

</style>
