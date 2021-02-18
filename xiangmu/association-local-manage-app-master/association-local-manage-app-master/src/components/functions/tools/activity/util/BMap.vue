<template>
    <div class="basic-input-long position-relative">
        <el-input placeholder="输入地点名称查询" ref="search"
                  v-model="keyword" @focus="mapShow = true">
            <el-button slot="append" :icon="keyword === '' ? 'el-icon-aim' : 'el-icon-check'"
                       style="color: #48a6d6;background-color: #FFFFFF;border:unset;position: relative;top: 1px;height: 37px;">
                {{address === '' ? '标记地图位置' : '已标记'}}
            </el-button>
        </el-input>
        <div class="position-absolute unset-padding background-color-white box-shadow-card"
             style="z-index: 999;width: 400px;height: 300px;border-radius: 4px;" v-show="searchPanelShow && mapShow && searchFocus">
            <vue-scroll>
                <div style="padding: 6px 0 0 0;">
                    <div class="address-item" v-for="address of searchResult" :key="address.id" @click="setAddress(address)" >
                        <span>{{address.title}} {{address.type | addressType}}</span>
                        <span style="color: #999999;padding-left: 6px;">{{address.province}}{{address.province === address.city ? '' : '-'+address.city}}</span>
                    </div>
                </div>
            </vue-scroll>
        </div>
        <transition>
            <bai-du-map class="bai-du-map" :class="{hidden: !mapShow}" :center="center" :ak="ak" style="height: 400px;width: 1042px;margin-top: 10px;"
                        :zoom="zoom" :scroll-wheel-zoom="true">
                <local-search :keyword="searchWord" auto-viewport :panel="false" @searchcomplete="setSearchResult"/>
                <!--左下角定位-->
                <geolocation anchor="BMAP_ANCHOR_BOTTOM_LEFT" show-address-bar auto-location/>
<!--                右上角缩放-->
                <navigation anchor="BMAP_ANCHOR_TOP_RIGHT" enable-geolocation show-zoom-info/>

                <local-marker :position="pointer" animation="BMAP_ANIMATION_BOUNCE" />
            </bai-du-map>
        </transition>
    </div>
</template>

<script>
    import BaiDuMap from 'vue-baidu-map/components/map/Map.vue'

    import LocalSearch from 'vue-baidu-map/components/search/LocalSearch';
    import Geolocation from 'vue-baidu-map/components/controls/Geolocation';
    import Navigation from 'vue-baidu-map/components/controls/Navigation';
    import LocalMarker from 'vue-baidu-map/components/overlays/Marker';

    export default {
        name: "BMap",
        components:{
            BaiDuMap,LocalSearch,Geolocation,Navigation,LocalMarker
        },
        filters:{
            addressType(val){
                switch (val) {
                    case 0:
                        return '';
                    case 1:
                        return '-公交车站';
                    case 3:
                        return '-地铁站';
                    default:
                        return '';
                }
            }
        },
        props: {
            address: String,
            addressConfig: {
                type: Object,
                default(){
                    return {
                        lng: 0,
                        lat: 0,
                        province: '',
                        city: ''
                    }
                }
            }
        },
        data(){
            return{
                ak: 'Zb61ShsX6bl3MQGrazjn8vCG2iOCRONK',
                //百度地图初始化数据
                center: {lng: 116.404, lat: 39.915},
                pointer: {lng: 116.404, lat: 39.915},
                zoom: 15,
                searchResult: [],
                keyword: this.address,
                mapShow: false,
                searchPanelShow: false,
                searchFocus: false,
                searchWord: '',
                searchFirstChanged: false
            }
        },
        model:{
            prop:'address',
            event: 'change'
        },
        methods:{
            setSearchResult(result){
                this.searchResult = [];
                if(result){
                    let ar = result.Ar || result.Br;
                    for(let location of ar){
                        let {title,type,province,city} = location;

                        let resultAddress = '';

                        if(province){
                            if(province === city){
                                resultAddress += province;
                            }else{
                                resultAddress += province + city;
                            }
                        }


                        resultAddress += title;

                        if(type === 1){
                            resultAddress += '-公交车站';
                        }

                        if(type === 3){
                            resultAddress += '-地铁站';
                        }

                        this.searchResult.push({...location,resultAddress})
                    }
                }

                this.searchPanelShow = this.searchResult.length > 0;
            },
            setAddress(address){
                let {city,province,point,resultAddress} = address;

                let {lng,lat} = point;

                this.pointer.lng = lng;
                this.pointer.lat = lat;

                setTimeout(()=>{
                    this.center.lng = lng;
                    this.center.lat = lat;
                },200);

                this.addressConfig.city = city;
                this.addressConfig.province = province;
                this.addressConfig.lng = lng;
                this.addressConfig.lat = lat;

                this.keyword = resultAddress;
                this.searchPanelShow = false;
                this.searchFocus = false;
            }
        },
        watch:{
            keyword(val){
                if(this.searchFirstChanged){
                    this.searchFocus = this.$refs.search.focused;
                    this.searchWord = val;
                    this.$emit('change',val);
                    if(!val){
                        this.searchResult = [];
                    }
                }else{
                    this.searchFirstChanged = true;
                }
            },
            address(val){
                if(!this.keyword){
                    this.keyword = val;
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .address-item{
        font-size: 12px;
        height: 28px;
        line-height: 28px;
        padding:  0 16px;
        cursor: pointer;

        &:hover{
            background-color: #e9f4ff;
        }
    }

    .bai-du-map.hidden{
        position: absolute;
        opacity: 0;
        z-index: -100;
    }
</style>
