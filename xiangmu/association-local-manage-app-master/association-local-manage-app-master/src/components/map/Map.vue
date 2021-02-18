<template>
  <div class="page">
    <div class="head">
      <span @click="changeTab(index)" v-for="(item,index) in btnList" :class="index==activeIndex?'active':''" :key="index">{{item}}</span>
    </div>
    <div class="content">
      <div id="container" class="ybcontainer"></div>
    </div>

    <!-- 点击树木弹框 -->
    <van-popup v-model="showTree">
      <div v-if="treeObj.pledgeStatus" class="pledged">
        <div class="pledgedBox">
          <h5>重庆邮电大学认养纪念碑</h5>
          <div class="infobox">
            <div class="leftpart" v-if="treeObj.type">树种:{{treeMap[treeObj.type].name}}</div>
            <div class="rightpart" v-if="treeObj.record">
              <div class="rows">认 捐 人：{{treeObj.record.userName}}</div>
              <div class="rows">认养时间：{{treeObj.record.createTime|fullDate}}</div>
            </div>
          </div>
          <div class="norow">编号NO.{{treeObj.id}}</div>
        </div>
      </div>
      <div v-else class="nopledge">
        <img :src="treeObj.picture">
        <div class="info" v-if="treeObj.type">
          <h5>{{treeMap[treeObj.type].name}}<span style="font-weight: normal;font-size: 14px;">({{treeObj.id}})</span></h5>
          <p>{{treeMap[treeObj.type].desc}}</p>
        </div>
        <div class="btnbox"><van-button type="warning" @click="toclaim" size="small">去认养</van-button></div>
      </div>
    </van-popup>

  <!-- 表单处理 -->
    <van-dialog v-model="claimDialog" title="请输入认养信息" close-on-popstate :show-confirm-button="false">
      <van-form ref="vanform">
        <van-field v-if="checkStudentNo" v-model="formobj.studentNum" required label="认养人学号" placeholder="认养人学号" :rules="[{ required: true, message: '请填写认养人学号' }]"/>
        <van-field v-model="formobj.userName" required label="认养人" placeholder="认养人" :rules="[{ required: true, message: '请填写认养人' }]"/>
        <van-field v-model="formobj.userPhone" type="tel" required label="联系方式" placeholder="联系方式" :rules="[{ validator, message: '请填写正确联系方式' }]"/>
        <van-field readonly clickable required :value="chooseYear" label="认养年限" placeholder="点击选择认养年限" @click="showYearPicker=true" :rules="[{ required: true, message: '请选择认养年限' }]"/>
        <van-field v-model="claimTime" readonly label="认养时间"/>
        <van-field v-model="claimMoney"  readonly label="认养金额"/>
        <van-field readonly clickable label="寄语选择" :value="chooseMessage" placeholder="点击选择认养寄语" @click="showMessagePicker=true"/>
        <van-field v-show="chooseMessage=='自定义'" v-model="formobj.message" label="认养寄语" placeholder="请输入认养寄语" type="textarea" maxlength="20" show-word-limit/>
      </van-form>
      <div slot="default" class="btngroup">
        <van-button type="warning" @click="claimDialog=false" size="small">取 消</van-button>
        <van-button type="primary" @click="confirmClaim" size="small">确 定</van-button>
      </div>
    </van-dialog>
    <!-- 年限选择 -->
    <van-popup v-model="showYearPicker" position="bottom">
      <van-picker show-toolbar :columns="years" value-key="year" @confirm="confirmYear" @cancel="showYearPicker = false"/>
    </van-popup>
    <!-- 寄语选择 -->
    <van-popup v-model="showMessagePicker" position="bottom">
      <van-picker show-toolbar :columns="messages" value-key="year" @confirm="confirmMessage" @cancel="showMessagePicker = false"/>
    </van-popup>
    <!-- 证书 -->
    <van-popup v-model="showCertificate" class="newpop">
      <div class="certificateBox">
        <h5>认养证书</h5>
        <div class="team"><span v-if="treeObj.record">{{treeObj.record.userName}}</span>（班级/团队）</div>
        <p class="tributes">恭喜您们成为 <span v-if="treeObj.type">{{treeMap[treeObj.type].name}}</span> 认养者，感谢您们为重庆邮电大学教育事业发展做出的积极贡献，我们对此表示诚挚的感谢。认养一颗树木，留下一份眷恋，把根植在母校，让爱永留心间。</p>
        <p class="schoolName">重庆邮电大学教育基金会</p>
        <p class="time" v-if="treeObj.record">{{getYear(treeObj.record.createTime)}}年<span>{{getMonth(treeObj.record.createTime)}}</span>月</p>
      </div>
    </van-popup>
    <!-- 其它树种认捐弹框 -->
    <van-popup v-model="otherTreeTip" class="othertreepop">
      <p class="tt">名贵树种的认养达到了一定额度（捐赠5万元以上），需线下捐赠，我们会在第一时间与您联系。或者请随时与重庆邮电大学教育基金会联系，诚挚的感谢您的关心与支持。</p>
      <p>电话：023-62471900 </p>
      <p>地址：重庆市南岸区崇文路2号重庆邮电大学新行政楼1017室</p>
    </van-popup>
    <!-- 悬浮按钮 -->
    <span class="guidebtn" @click="guideTip=true"><van-icon name="question" color="white" size="0.5rem"/></span>
    <span class="guidebtn zsbtn" @click="zsTip=true" v-if="zslist.length>0"><van-icon name="medal" color="white" size="0.5rem"/></span>
    <van-popup v-model="guideTip" class="guidebox">
      <img src="https://cyxyzj.cqupt.edu.cn/group1/M00/00/08/ysor7l7DvWGAXrP-AAPBwe81e4k184.jpg" alt="树木认养指引">
    </van-popup>
    <van-popup v-model="zsTip" class="guidebox zsbox">
      <h5>环保证书</h5>
      <div class="zslist">
        <div v-for="item in zslist" :key="item.id" class="zsitem" @click="showZs(item.treeId)" :class="'tree'+item.treeType"><span>{{treeMap[item.treeType].name}}</span></div>
      </div>
    </van-popup>
    <div class="arrowleft" v-show="guideTip" @click="guideTip=false"><van-icon name="arrow-left" size="0.5rem"/></div>
    <!-- 背景音乐 -->
    <audio id="bgmusic" loop controls="controls" src="https://cyxyzj.cqupt.edu.cn/group1/M00/00/0E/ysor7l7F4haAJVMUAEbhavUVICQ693.mp3"></audio>
  </div>
</template>
<script>
var deviceWidth = document.documentElement.clientWidth;
if(deviceWidth > 750) deviceWidth = 750;
document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
window.onresize=function(){
  var deviceWidth = document.documentElement.clientWidth;
  if(deviceWidth > 750) deviceWidth = 750;
  document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
}
var nowYear=new Date().getFullYear();
var nowMonth=new Date().getMonth()+1;
export default {
  data () {
    return {
      characterList:["〇","一","二","三","四","五","六","七","八","九","十","十一","十二"],
      btnList:["腾飞门","运动场","二教","紫竹园","南部校区"],
      treeMap:{
        "1":{name:"栾树",desc:"一年能占十月春。此树春季枝叶繁茂秀丽，叶片嫩红可爱；夏季树叶渐绿，而黄花满树，实为金碧辉煌；秋来夏花落尽，即有蒴果挂满枝头，如盏盏灯笼，绚丽多彩。如此佳木，实为上等绿化风景树。"},
        "2":{name:"榕树",desc:"榕树叶茂如盖，四季常青，枝干壮实，不畏寒暑，傲然挺立，象征着开拓进取、奋发向上的精神。"},
        "3":{name:"枫香树",desc:"喜温暖湿润气候，性喜光，幼树稍耐阴，耐干旱瘠薄土壤，萌生力极强。枧香树的秋色非常 迷人，树叶呈獨红色到深红色。"},
        "4":{name:"银杏树",desc:"银杏树又名白果树、公孙树，曾是仅遗存于我国的珍稀树种之一，素有“活化石”之称。它以其苍劲的体魄，独特的性格，清奇的风骨，较高的观赏价值和经济价值而受到世人的钟爱和青睐。"},
        "5":{name:"樱花树",desc:"樱花是早春重要的观花树种，被广泛用于园林观赏。盛开时节花繁艳丽，满树烂漫，如云似霞，极为壮观。花语为生命，此外还有幸福，热烈，纯洁，高尚和精神之美的含义。"},
        "6":{name:"棕榈树",desc:"喜温暖湿润气候，喜光。耐寒性极强，稍耐阴，抗大气污染能力强。棕榈树枝有希望与和平的寓意。"},
        "7":{name:"梧桐树",desc:"梧桐有青桐、碧梧、青玉、庭梧之名称。是我国有诗文记载的最早的著名树种之一，古诗中有象征高洁美好品格之意。"},
        "8":{name:"香樟树",desc:"香樟树形雄伟壮观，四季常绿，树冠开展，枝叶繁茂，浓荫覆地，枝叶秀丽而有香气，有长寿、吉祥如意的寓意。"},
        "9":{name:"松树",desc:"以松柏象征坚贞。松枝傲骨峥嵘，柏树庄重肃穆，且四季长青，历严冬而不衰。"},
        "10":{name:"旱莲木",desc:"又称喜树是中国所特有的一种高大落叶乔木，是一种速生丰产的优良树种，有吉祥喜庆之寓意。"},
        "11":{name:"黄葛树",desc:"黄葛树是高大的落叶乔木,枝繁叶茂,是生活中常见的一种植物,它的茎干粗壮,树形奇特,叶片有光亮绿。常被当做希望之树,给人带来正能量,它的寿命较长,还有健康长寿的寓意在其中。"},
        "12":{name:"广玉兰",desc:"广玉兰的花语是生生不息,代表着万物的延续,叶阔浓郁花朵冰清玉洁,也有着美丽高洁以芬芳纯洁的寓意,不染世俗独自开放。"},
        "13":{name:"楝树",desc:"楝树开花的时候正处在粮食丰收时，农民们就开始纷纷出去收割庄稼，是一种很好的寓意，虽然此时劳作较忙，但是忙碌后能收获粮食，寓意为丰收和美满，给人带来丰收的喜悦，使整个家庭都心情愉悦。"},
        "14":{name:"石头",desc:"石头"},
        "15":{name:"长椅",desc:"长椅"},
        "16":{name:"紫荆花",desc:"象征意义是：亲情、兄弟和睦团结难分离，紫荆花的叶子有一种韧性，无论风吹雨打，它从不轻易飘落，挺立在风雪中有着傲雪斗霜的性格。"}
      },
      years:[{key:"1",year:"1年"},{key:"2",year:"3年"},{key:"3",year:"5年"},{key:"4",year:"10年"}],
      messages:["情系重邮，感恩母校","我与母校共成长","认养一棵树，寄托一份情","认养母校一棵树，留下学子一片情","认养校友树，感恩母校情","樱为邮您，心怀感激","十年树木，百年树人","献一份爱心，增一份春色","呵护每一棵树木，灿烂每一张笑脸","守望相助、共创美好","我和小树一起成长","认养一份绿意，成就一份未来。","深情为土，友情予树，祝福为露，芳华常驻","自定义"],
      activeIndex:-1,
      map:null,
      markersArray:[],
      showTree: false,
      treeList:[],
      treeObj:{ pledgeStatus:true,record:null },
      claimDialog:false,
      showYearPicker:false,
      showMessagePicker:false,
      chooseYear:"",
      chooseMessage:"",
      claimTime:"",
      claimMoney:"",
      formobj:{
        userName:"",
        userPhone:"",
        type:"",
        message:"",
        studentNum:""
      },
      userInfo:null,
      showCertificate:false,
      ismoving:false,
      checkStudentNo:true,
      otherTreeTip:false,
      guideTip:false,
      zsTip:false,
      zslist:[]
    }
  },
  watch:{
    "formobj.type":{
      handler(newVal, oldVal) {
        if(newVal=="1"){
          this.claimTime = nowYear+"年"+nowMonth+"月到"+(nowYear+1)+"年"+nowMonth+"月";
          this.claimMoney = this.treeObj.amountForOneYear+"元";
        }else if(newVal=="2"){
          this.claimTime = nowYear+"年"+nowMonth+"月到"+(nowYear+3)+"年"+nowMonth+"月";
          this.claimMoney = this.treeObj.amountForThreeYear+"元";
        }else if(newVal=="3"){
          this.claimTime = nowYear+"年"+nowMonth+"月到"+(nowYear+5)+"年"+nowMonth+"月";
          this.claimMoney = this.treeObj.amountForFiveYear+"元";
        }else if(newVal=="4"){
          this.claimTime = nowYear+"年"+nowMonth+"月到"+(nowYear+10)+"年"+nowMonth+"月";
          this.claimMoney = this.treeObj.amountForTenYear+"元";
        }
      },
    },
    showCertificate(val){
      if(!val&&this.$route.query.treeid){this.showTree = true;}
    }
  },
  filters:{
    fullDate(val){
      var times=new Date(val);
      return times.getFullYear()+"年"+(times.getMonth()+1)+"月"+times.getDate()+"日"
    }
  },
  methods:{
    getMonth(val){
      return this.characterList[new Date(val).getMonth()+1] 
    },
    getYear(val){
      var year = new Date(val).getFullYear();
      var shi = Number(String(year).slice(2,3));
      var ge = Number(String(year).slice(3));
      return "二〇"+this.characterList[shi]+this.characterList[ge]
    },
    validator(val) {
      return /1\d{10}/.test(val);
    },
    confirmMessage(e){
      this.chooseMessage = e;
      if(e=="自定义"){
        this.formobj.message = "";
      }else{
        this.formobj.message = e;
      }
      this.showMessagePicker = false;
    },
    confirmYear(e){
      this.chooseYear = e.year;
      this.formobj.type = e.key;
      this.showYearPicker = false;
    },
    toclaim(){
      this.showTree = false;
      this.claimDialog=true;
      this.formobj.userName = "";
      this.formobj.userPhone = "";
      this.formobj.type = "";
      this.formobj.message = "";
      this.formobj.studentNum = "";
      this.chooseYear = "";
      this.claimTime = "";
      this.claimMoney = "";
      this.chooseMessage = "";
    },
    confirmClaim(){
      this.$refs.vanform.validate().then(r=>{
        var obj=Object.assign({},this.formobj);
        obj.avatar = this.userInfo.headImg;
        obj.memberUserId = this.userInfo.id;
        obj.treeId = this.treeObj.id;
        // obj.title = "认养标题";
        this.$request.post('/api/member/anon/tree/prePledge',obj).then((r)=>{
          this.claimDialog = false;
          if(this.treeObj.type=="5"){
            wx.miniProgram.redirectTo({
              url: '/package/onlineGiving/pages/donationList/donationList?fromMap=true&donationId='+r.data.id
            });
          }else{
            this.otherTreeTip = true;
          }
        })
      }).catch(()=>{});
    },
    changeTab(index){
      if(index!=this.activeIndex){
        this.activeIndex = index;
        if(this.activeIndex==0){
          this.map.panTo(new qq.maps.LatLng(-13.667338259654947, -133.76953125))
        }if(this.activeIndex==1){
          this.map.panTo(new qq.maps.LatLng(-5.00339434502215, -71.3671875))
        }if(this.activeIndex==2){
          this.map.panTo(new qq.maps.LatLng(-33.72433966174759, -49.921875))
        }if(this.activeIndex==3){
          this.map.panTo(new qq.maps.LatLng(8.407168163601074, 11.07421875))
        }if(this.activeIndex==4){
          this.map.panTo(new qq.maps.LatLng(4.740675384778373, 107.05078125))
        }
      }
    },
    createMarker(list,zoom){
      var that=this;
      if(zoom==5){
        if(this.markersArray.length>0){
          for (var i = 0; i < this.markersArray.length; i++) {
            this.markersArray[i].setVisible(true);
          }
        }else{
          for (const item of list) {
            var marker=new qq.maps.Marker({
              position:new qq.maps.LatLng(item.lat, item.lng),
              map:this.map
            });
            this.markersArray.push(marker);
            if(item.type==1){
              var size = new qq.maps.Size(27, 56);
              var origin = new qq.maps.Point(6, 4);
              var anchor = new qq.maps.Point(13, 56);
            }else if(item.type==2){
              var size = new qq.maps.Size(50, 56);
              var origin = new qq.maps.Point(48, 2);
              var anchor = new qq.maps.Point(25, 56);
            }else if(item.type==3){
              var size = new qq.maps.Size(44, 57);
              var origin = new qq.maps.Point(103, 3);
              var anchor = new qq.maps.Point(22, 57);
            }else if(item.type==4){
              var size = new qq.maps.Size(31, 58);
              var origin = new qq.maps.Point(163, 0);
              var anchor = new qq.maps.Point(15, 58);
            }else if(item.type==5){
              var size = new qq.maps.Size(35, 48);
              var origin = new qq.maps.Point(214, 9);
              var anchor = new qq.maps.Point(17, 48);
            }else if(item.type==6){
              var size = new qq.maps.Size(36, 47);
              var origin = new qq.maps.Point(270, 11);
              var anchor = new qq.maps.Point(18, 47);
            }else if(item.type==7){
              var size = new qq.maps.Size(44, 50);
              var origin = new qq.maps.Point(318, 7);
              var anchor = new qq.maps.Point(22, 50);
            }else if(item.type==8){
              var size = new qq.maps.Size(33, 56);
              var origin = new qq.maps.Point(4, 90);
              var anchor = new qq.maps.Point(16, 56);
            }else if(item.type==9){
              var size = new qq.maps.Size(27, 56);
              var origin = new qq.maps.Point(58, 90);
              var anchor = new qq.maps.Point(13, 56);
            }else if(item.type==10){
              var size = new qq.maps.Size(41, 47);
              var origin = new qq.maps.Point(105, 98);
              var anchor = new qq.maps.Point(20, 47);
            }else if(item.type==11){
              var size = new qq.maps.Size(34, 56);
              var origin = new qq.maps.Point(163, 91);
              var anchor = new qq.maps.Point(17, 56);
            }else if(item.type==12){
              var size = new qq.maps.Size(21, 50);
              var origin = new qq.maps.Point(223, 96);
              var anchor = new qq.maps.Point(10, 50);
            }else if(item.type==13){
              var size = new qq.maps.Size(32, 45);
              var origin = new qq.maps.Point(268, 100);
              var anchor = new qq.maps.Point(16, 45);
            }else if(item.type==14){
              var size = new qq.maps.Size(43, 43);
              var origin = new qq.maps.Point(317, 102);
              var anchor = new qq.maps.Point(21, 43);
            }else if(item.type==15){
              var size = new qq.maps.Size(46, 26);
              var origin = new qq.maps.Point(0, 192);
              var anchor = new qq.maps.Point(23, 26);
            }else if(item.type==16){
              var size = new qq.maps.Size(26, 40);
              var origin = new qq.maps.Point(69, 179);
              var anchor = new qq.maps.Point(13, 40);
            }
            var scaleSize = new qq.maps.Size(362, 219);
            var url = "https://xyh.huiyixing.com/group1/M00/01/55/CgIlOl66cjuAOL8PAACXGGqg_AQ330.png";
            if(item.pledgeStatus){
              url = "https://xyh.huiyixing.com/group1/M00/01/55/CgIlOl66eJmAB1RGAACh4b4TxV0272.png";
            }
            var icon = new qq.maps.MarkerImage( url,size,origin,anchor,scaleSize);
            marker.setIcon(icon);  
            marker.cusObj = item;
            qq.maps.event.addListener(marker, 'mouseup', function(e) {
              if(that.ismoving){return}
              // e.preventDefault(); 
              that.$request.get('/api/member/anon/tree/'+this.cusObj.id).then((r)=>{
                that.treeObj = r.data;
                that.showTree = true;
                if(that.treeObj.type==5){
                  that.years=[{key:"1",year:"1年"},{key:"2",year:"3年"},{key:"3",year:"5年"}]
                }else{
                  that.years=[{key:"2",year:"3年"},{key:"3",year:"5年"},{key:"4",year:"10年"}]
                }
              })
            });
          }

        }
      }else{
        for (var i = 0; i < this.markersArray.length; i++) {
          this.markersArray[i].setVisible(false);
        }
      }

    },
    showZs(treeid){
      this.$request.get('/api/member/anon/tree/'+treeid).then((r)=>{
        this.treeObj = r.data;
        this.showCertificate = true;
      })
    }
  },
  mounted () {
    var audio = document.getElementById('bgmusic');
    audio.play();    
    document.addEventListener("WeixinJSBridgeReady", function () { audio.play(); }, false);

    if(this.$route.query.id){
      this.$request.get('/api/member/account/anon/userInfo',{params:{memberUserId:this.$route.query.id}}).then((r)=>{
        this.userInfo = r.data;
      })
      this.$request.get('/api/member/anon/tree/pledgeRecords',{params:{memberUserId:this.$route.query.id}}).then((r)=>{
        this.zslist = r.data;
      })
    }
    if(this.$route.query.treeid){
      this.$request.get('/api/member/anon/tree/'+this.$route.query.treeid).then((r)=>{
        this.map.panTo(new qq.maps.LatLng(r.data.lat, r.data.lng));
        this.treeObj = r.data;
        this.showCertificate = true;
      })
    }
    this.$request.get('/api/member/anon/tree/isCheckoutStudentNo').then(res=>{
      this.checkStudentNo = res.data;
    })
    function pad(num, n) {
      return Array(n - ('' + num).length + 1).join(0) + num;
    }
    // 获取本地瓦片
    var _getloaclTileUrl = function(index, zoom) {
      var tileUrl = 'images3/{z}/image_{index}.jpg';
      tileUrl = tileUrl.replace(/\{index\}/, index);
      tileUrl = tileUrl.replace(/\{z\}/, zoom);
      return tileUrl;
    }
    // 替换指定层级、指定坐标的瓦片从本地加载
    var tailUrl = function(tile, zoom) {
      if (zoom == 2) {
        var _x = 0, _y = 0;
        var _p = 1;
        if (tile.x >= _x && tile.x < _x + 2**_p && tile.y >= _y && tile.y < _y + 2**_p) {
          var index = (tile.y - _y) * 2**_p + (tile.x - _x) + 1; 
          return _getloaclTileUrl(pad(index, 2), zoom);
        }
      }
      if (zoom == 3) {
        var _x = 0, _y = 0;
        var _p = 2;
        if (tile.x >= _x && tile.x < _x + 2**_p && tile.y >= _y && tile.y < _y + 2**_p) {
          var index = (tile.y - _y) * 2**_p + (tile.x - _x) + 1; 
          return _getloaclTileUrl(pad(index, 2), zoom);
        }
      }
      if (zoom == 4) {
        var _x = 0, _y = 0;
        var _p = 3;
        if (tile.x >= _x && tile.x < _x + 2**_p && tile.y >= _y && tile.y < _y + 2**_p) {
          var index = (tile.y - _y) * 2**_p + (tile.x - _x) + 1; 
          return _getloaclTileUrl(pad(index, 2), zoom);
        }
      }
      if (zoom == 5) {
        var _x = 0, _y = 0;
        var _p = 4;
        if (tile.x >= _x && tile.x < _x + 2**_p && tile.y >= _y && tile.y < _y + 2**_p) {
          var index = (tile.y - _y) * 2**_p + (tile.x - _x) + 1; 
          return _getloaclTileUrl(pad(index, 2), zoom);
        }
      }
      return 'images3/3/image_01.jpg';
    }
    //新建一个ImageMapType，实现ImageMapTypeOptions规范
    var earthlayer = new qq.maps.ImageMapType({
      name: '重庆邮电认养树木地图',
      alt: '重庆邮电认养树木地图',
      tileSize: new qq.maps.Size(512, 512),
      minZoom: 3,
      maxZoom: 5,
      getTileUrl: tailUrl
    });
    this.map = new qq.maps.Map(document.getElementById("container"), {
      // 地图的中心地理坐标。
      center: new qq.maps.LatLng(4.258768357307995, -54.9755859375),
      zoom: 5,
      mapTypeId: 'coordinate',
      backgroundColor: "#3B6432",
      mapTypeControlOptions: {
        mapTypeIds: ['earth']
      },
      boundary: new qq.maps.LatLngBounds(new qq.maps.LatLng(-62.69430959366317, -178.9892578125), new qq.maps.LatLng(62.71446210149774, 179.1650390625)),
      mapTypeControl:false,
      // zoomControl:false
    });
    this.map.mapTypes.set('earth', earthlayer);
    this.map.setMapTypeId('earth');
    var n = 0;
    var that = this;
    
    qq.maps.event.addListener(this.map, 'zoom_changed', function(event) {
      that.createMarker(that.treeList,that.map.getZoom())
    })
    qq.maps.event.addListener(this.map, 'click', function(event) {
      console.log(event)
      if(that.map.getZoom()!=5){
        that.map.zoomTo(5);
        that.map.setCenter(event.latLng)
      }
    })
    qq.maps.event.addListener(this.map, 'dragstart', function(event) {
      that.ismoving=true;
    })
    qq.maps.event.addListener(this.map, 'dragend', function(event) {
      setTimeout(()=>{
        that.ismoving=false;
      },100)
    })
  
    this.$request.get('/api/member/anon/tree/simple/list',{params:{enabled:true,limit:2000,offset:0}}).then((r)=>{
      this.treeList = r.data.list;
      this.createMarker(this.treeList,this.map.getZoom())
    })
    

  }
}
</script>
<style lang="less" scoped>
.page{
  width: 100%;
  height: 100vh;
}
.head{
  height: 32px;
  padding: 4px;
  white-space: nowrap;
  overflow-x: auto;
}
.head::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: #f5f5f5;
}
.head span{
  line-height: 32px;
  font-size: 16px;
  display: inline-block;
  padding: 0 15px;
  border-radius: 16px;
}
.head span.active{
  background: #a88d60;
  color: white;
}


.content{
  height: calc(100% - 40px);
  position: relative;
}
#container{
  height: 100%;
}

.nopledge{
  width: 5.5rem;
  img{
    width: 100%;
  }
  .info{
    padding: 0.1rem 0.2rem;
    h5{
      font-size: 16px;
      font-weight: 700;
      line-height: 30px;
    }
    p{
      font-size: 12px;
      color: #666;
    }
  }
  .btnbox{
    text-align: center;
    padding-bottom: 10px;
  }
}
.btngroup{
  margin-top: 20px;
  padding-bottom: 20px;
  text-align: right;
  button{
    margin-right: 16px;
  }

}


.newpop{
  background: transparent;
  .certificateBox{
    box-sizing: border-box;
    padding: 0.38rem 0.6rem;
    width: 5rem;
    height: 7.58rem;
    position: relative;
    background: transparent url(https://xyh.huiyixing.com/group1/M00/01/56/CgIlOl688YWAaY5BAABYFxuR9LE626.png) no-repeat;
    background-size: cover;
    h5{
      font-size: 0.56rem;
      color: #396305;
      text-align: center;
      letter-spacing: 0.1rem;
      line-height: 1.52rem;
    }
    .team{
      font-size: 0.28rem;
      line-height: 0.48rem;
      margin-bottom: 0.29rem;
      span{
        text-decoration: underline;
      }
    }
    .tributes{
      font-size: 0.24rem;
      line-height: 0.38rem;
      text-indent: 2em;
      span{
        text-decoration: underline;
      }
    }
    .schoolName{
      font-size: 0.26rem;
      line-height: 0.4rem;
      position: absolute;
      right: 0.58rem;
      bottom: 1.65rem;
    }
    .time{
      font-size: 0.26rem;
      line-height: 0.4rem;
      position: absolute;
      right: 1.05rem;
      bottom: 1.25rem;
      span{
        margin: 0 0.05rem;
      }
    }
  }
}

.pledged{
  padding: 0.1rem;
  background: #225246;
  width: 5rem;
  .pledgedBox{
    border: 0.05rem solid white;
    padding: 0.1rem 0.14rem;
    color: white;
    h5{
      font-size: 0.32rem;
      line-height: 0.6rem;
      text-align: center;
    }
    .infobox{
      margin-top: 0.1rem;
      display: flex;
      font-size: 0.18rem;
      .leftpart{
        width: 1.5rem;
      }
      .rightpart{
        border-left: 0.03rem solid white;
        padding-left: 0.15rem;
        .rows{
          line-height: 0.36rem;
        }
      }
    }
    .norow{
      font-size: 0.18rem;
      text-align: right;
      margin-top: 0.3rem;
      line-height: 0.4rem;
    }
  }
}

.othertreepop{
  padding: 15px;
  border-radius: 5px;
  width: 85%;
  font-size: 14px;
  box-sizing: border-box;
  p{
    line-height: 24px;
    text-indent: -3em;
    padding-left: 3em;
    color: #666;
  }
  .tt{
    margin-bottom: 5px;
    padding-left: 0;
    text-indent: 0;
    color: #333;
    font-size: 15px;
  }
}
.guidebtn{
  position: fixed;
  right: 10px;
  bottom: 40px;
  border: 2px solid #3F78AC;
  border-radius: 50%;
  width: 0.7rem;
  height: 0.7rem;
  text-align: center;
  padding-top: 0.06rem;
  box-sizing: border-box;
  background: #71B2F6;
}
.guidebox{
  width: 100%;
  img{
    width: 100%;
  }
}
.arrowleft{
  position: fixed;
  left: 10px;
  top: 10px;
  z-index: 20000;
}


.zsbtn{
  bottom: 80px;
}
.zsbox{
  width: 80%;
  background: transparent;
  padding-top: 15px;
  h5{
    text-align: center;
    font-size: 16px;
    width: 3.5rem;
    color: white;
    background: #88c756;
    line-height: 30px;
    border-radius: 15px;
    position: absolute;
    left: 50%;
    margin-left: -1.75rem;
    top: 0;
  }
  .zslist{
    background: white;
    border-radius: 0.25rem;
    display: flex;
    flex-wrap: wrap;
    padding: 0.4rem 0;
    .zsitem{
      border:3px solid #f9d358;
      width: 1.48rem;
      height: 0.48rem;
      border-radius: 50%;
      margin: 0.2rem;
      padding-top: 1rem;
      span{
        background: #f9e272;
        line-height: 0.42rem;
        text-align: center;
        display: block;
        color: #a26026;
      }
    }
    .tree1{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RCOiAQGhbAAAgtTBAamg152.png) no-repeat center;
      background-size: 0.8rem 1.26rem; 
    }
    .tree2{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RCbeAdu1qAAAz8Sl0rQg718.png) no-repeat center;
      background-size: 1.08rem 1.26rem; 
    }
    .tree3{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RCguAF3RQAAAuRgTWBAA596.png) no-repeat center;
      background-size: 0.97rem 1.23rem; 
    }
    .tree4{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RCnKACS35AAAh1Jg5Tv8351.png) no-repeat center;
      background-size: 0.7rem 1.26rem; 
    }
    .tree5{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RCsKAEYWrAAAuTYZb8n0263.png) no-repeat center;
      background-size: 0.85rem 1.07rem; 
    }
    .tree6{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RCwGAOBEYAAA3nqKSRg4134.png) no-repeat center;
      background-size: 0.94rem 1.12rem; 
    }
    .tree7{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RC1KADKg3AAAoeRnlH2M757.png) no-repeat center;
      background-size: 0.93rem 1.12rem; 
    }
    .tree8{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RC5OADBe6AAAr_fG6SgI847.png) no-repeat center;
      background-size: 0.81rem 1.25rem; 
    }
    .tree9{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RC-eAS-KrAAAqGMORR8g336.png) no-repeat center;
      background-size: 0.76rem 1.28rem; 
    }
    .tree10{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RDCSAMgkSAAAr6RIAPPw212.png) no-repeat center;
      background-size: 0.98rem 1.1rem; 
    }
    .tree11{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RDFeAIdIlAAAmiOooz-s966.png) no-repeat center;
      background-size: 0.76rem 1.16rem; 
    }
    .tree12{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RDI-AL1wSAAAZh3UTLiE849.png) no-repeat center;
      background-size: 0.57rem 1.15rem; 
    }
    .tree13{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RDMqAOUWaAAAlMxBdDpM738.png) no-repeat center;
      background-size: 0.7rem 1.01rem; 
    }
    .tree16{
      background: url(https://cyxyzj.cqupt.edu.cn/group1/M00/00/1D/ysor7l7RDQ2AedAJAAAsxTfN_O8024.png) no-repeat center;
      background-size: 0.83rem 0.92rem; 
    }
  }
}
</style>

<style>
.ybcontainer a[title="到腾讯地图查看此区域"]{
  display: none!important;
}
</style>