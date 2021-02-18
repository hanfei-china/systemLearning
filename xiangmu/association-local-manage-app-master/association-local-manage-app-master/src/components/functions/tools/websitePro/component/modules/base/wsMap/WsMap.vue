<template>
  <div :style="style" class="branch-container">
    <div v-show="!detailShow" :id="mapId" class="branch-map-container" :style="mapStyle">
    </div>
    <div v-show="!detailShow" class="branch-list-container">
      <div class="branch-tags">
        <div v-for="item in branchTypeList"
          :key="item.id"
          @click="branchTypeId = item.id"
          class="branch-type-tag"
          :class="{active: branchTypeId === item.id}">
          {{item.name}}
        </div>
      </div>
      <div class="branch-list">
        <div
          v-for="item in branchList"
          :key="item.id"
          class="branch-list-item">
          <el-button 
            type="text"
            @click="openBranchDetail(item)"
            class="branch-link-btn">
            {{item.name}}
          </el-button>
        </div>
        <div style="clear:both"></div>
      </div>
    </div>
    <div v-show="detailShow" class="branch-detail-container">
      <div class="branch-detail-title">
        {{branchDetail.name}}
        <div class="back-to-map">
          <el-button type='primary' size="small" @click="detailShow = false" plain round>
            返回分会地图
          </el-button>
        </div>
      </div>
      <div v-html="branchDetail.content" class="branch-detail-content"></div>
    </div>
  </div>
</template>
<script>
import loadBMap from './loadBMap'
import {cities} from "@/js/config/echartConfigs";
const API_KEY = 'OA952gEjEbKBnmoqn4nW6wQVFfnGHhrf'

export default {
  props: {
    module: Object,
    design: Boolean,
  },
  data () {
    return {
      // apiKey: '',
      apiKey: API_KEY,
      mapHeight: 0,
      mapId: 'BMap-' + parseInt(Date.now() + Math.random()),
      map: null,
      branchTypeList: [], // 分会分类列表
      branchTypeId: '', // 当前分类 id
      detailShow: false,
      branchId: '',
      branchDetail: {}
    }
  },
  computed: {
    style() {
      let style = {
      };

      if (!this.design) {
        style.width = 
          this.module.attributes.layoutGroup.attributes.layout.value.width +
          "px";
        style.height =
          this.module.attributes.layoutGroup.attributes.layout.value.height +
          "px";
        style.overflow = 'auto';
        // style.height = 'auto';
        // style.left =
        //   this.module.attributes.layoutGroup.attributes.layout.value.left +
        //   "px";
        // style.top =
        //   this.module.attributes.layoutGroup.attributes.layout.value.top + "px";
        // style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
        // style.position = "absolute";
      }

      return style;
    },
    mapStyle () {
      return {
        height: this.mapHeight + 'px'
      }
    },
    listStyle () {
    },
    branchList () {
      // 当前分会分类下的分会列表
      if (this.branchTypeId) {
        return this.branchTypeList.find(item => item.id === this.branchTypeId).branchList;
      } else {
        return []
      }
    }
  },
  created () {
    let attributes = this.module.attributes;
    let mapData = attributes.mapDataGroup.attributes.mapData;
    // this.apiKey = mapData.value.apiKey;
    this.mapHeight = mapData.value.mapHeight || 360;
  },
  mounted () {
    Promise.all([this.initMap(), this.loadBranchList()]).then(() => {
      this.createBranchMarkers();
    })
  },
  methods: {
    initMap () {
      return loadBMap(this.apiKey).then(() => {
        this.map = new BMap.Map(this.mapId);
        this.map.centerAndZoom(new BMap.Point(105.403119, 38.028658), 5);  // 初始化地图,设置中心点坐标和地图级别
        this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        this.map.addControl(new BMap.NavigationControl());    
        this.map.addControl(new BMap.ScaleControl());    
        this.map.addControl(new BMap.OverviewMapControl());  
        return;
      })
    },
    loadBranchList () {
      return this.$request.get('/api/common/branch/branchListAndBranchType')
        .then(res => {
          this.branchTypeList = res.data
          if(this.branchTypeList.length) {
            this.branchTypeId = this.branchTypeList[0].id
          }
        })
    },
    createBranchMarkers () {
      if (!this.map) {
        return false
      }
      let map = this.map;
      let myGeo = new BMap.Geocoder(); 
      // 将地址解析结果显示在地图上，并调整地图视野    
      let that = this;
      this.branchList.forEach(branch => {
        if (branch.address) {
          let addressArray = JSON.parse(branch.address);
          if (Array.isArray(addressArray)) {
            let address = addressArray.join('');
            let orgPoint = null;
            if (addressArray[0]) {
              let province = cities.find(item => item.name == addressArray[0])
              if (addressArray[1]) {
                let city = province.children.find(item => item.name == addressArray[1])
                
                orgPoint = new BMap.Point(city.lng, city.lat);
              } else {
                orgPoint = new BMap.Point(province.lng, province.lat);
              }
            }
            if (orgPoint) {
              let convertor = new BMap.Convertor();
              convertor.translate([orgPoint], 1, 5, data => {
                 if(data.status === 0) {
                    let point = data.points[0]
                    let marker = new BMap.Marker(point);
                    marker.addEventListener('click', ({type, target}) => {
                      if (branch.branchInvitationCode) {
                        that.initInfoWindow(target.point, branch, address);
                      } else {
                        that.$request.get('/api/common/branch/invitationCode?branchId=' + branch.id).then(res => {
                          branch.branchInvitationCode = res.data;
                          that.initInfoWindow(target.point,branch, address);
                        })
                      }
                    })
                    map.addOverlay(marker);      
                 }
              })
            }
          }
        }
      });
    },
    initInfoWindow (point, branch, address) {
      let detailUrl = '';
      let infoWindowOpts = {
        width: 280,
        height: 0,
        maxHeight: 280,
        offset: new BMap.Size(0, -30),
        enableMessage: false,
      }
      let infoDom = `
        <div class="branch-info-title">
          <a href="#" target="_blank">
            ${branch.name}
          </a>
        </div>
        <div class="branch-info-top">
          <p><label>联系人：</label>${branch.contactPerson || ''}</p>
          <p><label>联系电话：</label>${branch.contactPhone || ''}</p>
          <p><label>地址：</label>${address}</p>
          <div class="branch-info-codeimg">
            ${branch.branchInvitationCode ? '<img src="' + branch.branchInvitationCode + '"/>': ''}
          </div>
        </div>
        <div class="branch-info-introduce">
          <label>协会介绍：</label>
          ${branch.introduce || ''}
        </div>
      `
      let infoWindow = new BMap.InfoWindow(infoDom, infoWindowOpts)
      this.map.openInfoWindow(infoWindow, point);
    },
    openBranchDetail (branch) {
      this.branchId = branch.id;
      this.$request.get('/api/common/branch/anon/branchInfo?id=' + this.branchId).then(res => {
        this.branchDetail = res.data;
        this.detailShow = true;
      })
    }
  },
  watch: {
    branchList () {
      if (this.map) {
        this.map.clearOverlays();
        this.createBranchMarkers();
      }
    }
  }
}
</script>
<style scoped>
.branch-container {
  position: relative;
  margin: 0 auto;
}
.branch-map-container,
.branch-list-container {
  margin: 20px auto 0;
}
.branch-list-container .branch-tags {
  display: flex;
  justify-content: center;
  border-bottom: 3px solid #fca326;
}
.branch-tags .branch-type-tag {
  position: relative;
  height: 40px;
  line-height: 40px;
  margin-right: 30px;
  margin-bottom: 20px;
  padding: 0 18px;
  border-radius: 3px;
  color: #409EFF;
  background: #ecf5ff;
  border-color: #b3d8ff;
  cursor: pointer;
}
.branch-tags .branch-type-tag:last-of-type {
  margin-right: 0;
}
.branch-tags .branch-type-tag.active {
  color: #fff;
  background-color: #409EFF;
}
.branch-tags .branch-type-tag.active::after {
  content: ' ';
  position: absolute;
  height: 0;
  width: 0;
  left: 50%;
  bottom: -8px;
  margin-left: -8px;
  border-top: 8px solid #409EFF;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
}
.branch-list-item {
  float: left;
  width: 16.66%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  padding: 20px 10px 2px;
  box-sizing: border-box;
}
.branch-link-btn {
  padding: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
  line-height: 20px;
}
.branch-detail-container {
  width: 900px;
  margin: 0 auto;
}
.branch-detail-title {
  position: relative;
  margin-bottom: 20px;
  padding: 20px 100px 20px 0;
  font-size: 30px;
  color: #222;
  line-height: 40px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}
.branch-detail-title .back-to-map {
  position: absolute;
  top: 50%;
  right: 20px;
  line-height: 32px;
  margin-top: -19px;
}
</style>
<style>
.branch-info-title a{
  font-weight: bold;
  text-decoration: underline;
}
.branch-info-top {
  margin-top: 5px;
  padding-right: 80px;
  min-height: 80px;
  position: relative;
}
.branch-info-top p {
  margin: 0;
}
.branch-info-top .branch-info-codeimg {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.branch-info-top .branch-info-codeimg img{
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.branch-info-introduce {
  margin-top: 5px;
  white-space: normal;
  word-break: break-all;
}
</style>