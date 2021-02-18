<template>
    <div class="flex" style="font-size: 14px;line-height: 18px;">
        <div class="flex-fill-in-the-remaining-space flex">
            <div>商品明细：</div>
            <div class="flex-fill-in-the-remaining-space">
                <div class="flex" v-for="(item,index) in goodsEntityInExtendsInfos" :key="index" style="margin-bottom: 10px;">
                    <div style="width: 60px;height: 60px;margin-right: 10px;">
                        <el-image style="width: 100%;height: 100%;" fit="cover" :src="item.posterUrl"></el-image>
                    </div>
                    <div class="flex-fill-in-the-remaining-space flex flex-column">
                        <div class="flex-fill-in-the-remaining-space"></div>
                        <div>
                            <p class="overFlow">{{item.goodsName}}</p>
                            <p style="font-size: 12px;color: #999999;">{{item.price}}x{{item.purchaseNum}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-fill-in-the-remaining-space" style="line-height: 30px;">
            <div>收货人：{{JSON.parse(address).deliveryPerson | formatNull}}</div>
            <div>手机号：{{JSON.parse(address).telephone | formatNull}}</div>
            <div>收货地址：{{JSON.parse(address).detailAddress| addressFilter}}</div>
            <div>商品件数：{{amountNum | formatNull}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GoodsInfo",
        props:['extendsInfo'],
        data(){
            return {
                goodsEntityInExtendsInfos:[],//订单中的商品信息
                amountNum:0,//订单中商品的总数量
                address:'',//地址信息
            }
        },
        filters: {
            formatNull(val){
                if(!val || val === 'null'){
                    return '-'
                }else {
                    return val;
                }
            }
        },
        created(){
            this.getInfo();
        },
        methods: {
            getInfo(){
                this.goodsEntityInExtendsInfos = JSON.parse(this.extendsInfo).goodsEntityInExtendsInfos;
                this.amountNum = JSON.parse(this.extendsInfo).amountNum;
                this.address = JSON.parse(this.extendsInfo).address
            }
        }
    }
</script>

<style scoped>
    .overFlow{
        display: -webkit-box;
        -webkit-line-clamp:2;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
    }
</style>
