<template>
  <div class="containerTravel">
    <div class="travelTop">
      <span>长安大学小程序</span>
    </div>
    <div class="travelImg">
      <img src="./image/banner.png" alt />
    </div>
    <div class="travelContent">
      <div class="travelRoute">差旅行程</div>
      <van-cell-group>
        <!-- 出差城市 -->
        <van-cell :value="showSelectCity||'请选择目的地'" is-link @click="cityShowPicker=true">
          <template #title>
            <!-- <span class="iconfont icon-chengshi" style="marginRight:10px;color:#1989fa;"></span> -->
            <!-- <span class="iconfont icon-chengshi" style="marginRight:10px;color:#1989fa;"></span> -->
            <img src="./icon/iconOne.png" class="itemIcon" alt />
            <span class="custom-title">出差城市</span>
          </template>
        </van-cell>
        <van-popup v-model="cityShowPicker" round position="bottom">
          <van-picker
            show-toolbar
            ref="citySelect"
            :columns="cityColumns"
            @cancel="cancelCitySelect"
            @confirm="citySelect"
          />
        </van-popup>

        <!-- 出差时间 -->
        <van-cell :value="showSelectTime||'请选择出差时间'" is-link @click="timeShowPicker=true">
          <template #title>
            <!-- <span class="iconfont icon-rili" style="marginRight:10px;color:#1989fa;"></span> -->
            <img src="./icon/iconTwo.png" class="itemIcon" alt />
            <span class="custom-title">出差时间</span>
          </template>
        </van-cell>
        <van-calendar
          v-model="timeShowPicker"
          type="range"
          title="出差时间"
          color="#1989fa"
          @confirm="selectTravelTime"
        />

        <!-- 人员类型 -->
        <van-cell :value="personShowInfo||'请选择人员类型'" is-link @click="personSelect=true">
          <template #title>
            <!-- <span class="iconfont icon-rili" style="marginRight:10px;color:#1989fa;"></span> -->
            <img src="./icon/person.png" class="itemIcon" alt />
            <span class="custom-title">人员类型</span>
          </template>
        </van-cell>
        <van-action-sheet v-model="personSelect" :actions="personList" @select="onSelectPerson" />

        <!-- 出差档次 -->
        <van-cell :value="showGradeInfo||'请选择标准档次'" is-link @click="onSelectGrade">
          <template #title>
            <!-- <span class="iconfont icon-ziyuan38" style="marginRight:10px;color:#1989fa;"></span> -->
            <img src="./icon/iconThree.png" class="itemIcon" alt />
            <span class="custom-title">标准档次</span>
          </template>
        </van-cell>
        <van-action-sheet v-model="gradeShowSelect" title="国内差旅住宿费标准档次">
          <van-radio-group v-model="selectForm.costGrade">
            <van-cell-group>
              <template v-if="personSelectId==1">
                <van-cell
                  v-for="grade in researchGrade"
                  :key="grade.gradeNum"
                  :title="grade.title"
                  clickable
                  @click="selectCostGrade(grade.gradeNum,grade.title)"
                >
                  <template #right-icon>
                    <van-radio :name="grade.gradeNum" />
                  </template>
                  <template #label>
                    <div>{{grade.mainTitle}}</div>
                    <div v-for="(item,index) in grade.children" :key="index">{{index+1}} . {{item}}</div>
                  </template>
                </van-cell>
              </template>
              <template v-if="personSelectId==2">
                <van-cell
                  v-for="grade in adminGrade"
                  :key="grade.gradeNum"
                  :title="grade.title"
                  clickable
                  @click="selectCostGrade(grade.gradeNum,grade.title)"
                >
                  <template #right-icon>
                    <van-radio :name="grade.gradeNum" />
                  </template>
                  <template #label>
                    <div>{{grade.mainTitle}}</div>
                    <div v-for="(item,index) in grade.children" :key="index">{{index+1}} . {{item}}</div>
                  </template>
                </van-cell>
              </template>
            </van-cell-group>
          </van-radio-group>
        </van-action-sheet>
      </van-cell-group>
    </div>
    <!-- 查询按钮 -->
    <div class="travelSearch">
      <van-button type="info" round block @click="SearchAction">查询</van-button>
    </div>
    <!-- 查询结果 -->
    <van-calendar
      v-model="searchResultShow"
      :formatter="formatter"
      type="range"
      title="查询结果"
      color="#1989fa"
      :show-confirm="false"
      :default-date="searchResult"
      :min-date="minSearchTime"
      :max-date="maxSearchTime"
      @select="selectDate"
    >
      <template #title>
        <span style="marginRight:15px;">查询结果</span>
        <span style="color:#969799;fontSize:14px;">备注：住宿费限额标准（元/人*天）</span>
      </template>
    </van-calendar>
    <div class="collegeLogo">
      <img src="./image/logo.png" alt />
    </div>
  </div>
</template>

<script>
import {
  Cell as vanCell,
  CellGroup as vanCellGroup,
  Popup as vanPopup,
  Picker as vanPicker,
  Calendar as vanCalendar,
  ActionSheet as vanActionSheet,
  RadioGroup as vanRadioGroup,
  Radio as vanRadio,
  Button as vanButton,
  Dialog as vantDialog,
  Toast
} from "vant";
import "./icon/iconfont.css";
import citylist from "./city";
export default {
  name: "travelExpenses",
  components: {
    vanCell,
    vanCellGroup,
    vanPicker,
    vanCalendar,
    vanActionSheet,
    vanRadioGroup,
    vanRadio,
    vanButton
  },
  data() {
    return {
      cityShowPicker: false, //出差城市的选择器
      cityColumns: citylist,
      selectForm: {
        startTime: "",
        endTime: "",
        provinceCode: 0,
        cityCode: 0,
        costGrade: 0
      },
      showSelectCity: "",
      timeShowPicker: false,
      selectTime: [],
      showSelectTime: "",
      gradeShowSelect: false,
      showGradeInfo: "",
      searchResultShow: false,
      searchResult: [],
      minSearchTime: new Date(2000, 1, 0),
      maxSearchTime: new Date(2020, 1, 0),
      selectResultList: {},
      personSelect: false,
      personList: [
        { name: "科研人员", id: 1 },
        { name: "行政人员", id: 2 }
      ],
      personSelectId: 0,
      personShowInfo: "",
      researchGrade: [
        {
          title: "标准档次一",
          gradeNum: 1,
          children: ["院士", "三级及以上管理岗位人员", "二级教授"],
          mainTitle: "一类差旅标准对应人员包括："
        },
        {
          title: "标准档次二",
          gradeNum: 2,
          children: [
            "正高级职称人员",
            "五级及以上管理岗位人员及其他具有高级职称的专业技术人员"
          ],
          mainTitle: "二类差旅标准对应人员包括："
        },
        {
          title: "标准档次三",
          gradeNum: 3,
          children: [],
          mainTitle: "三类差旅标准对应人员指其他人员"
        }
      ],
      adminGrade: [
        {
          title: "标准档次一",
          gradeNum: 1,
          children: ["院士"],
          mainTitle: "一类差旅标准对应人员包括："
        },
        {
          title: "标准档次二",
          gradeNum: 2,
          children: [
            "正高级职称人员",
            "五级及以上其他具有高级职称的专业技术人员",
            "四级及以上人员"
          ],
          mainTitle: "二类差旅标准对应人员包括："
        },
        {
          title: "标准档次三",
          gradeNum: 3,
          children: [],
          mainTitle: "三类差旅标准对应人员指其他人员"
        }
      ]
    };
  },
  created() {
    // var y=new Date().getFullYear();
    // var m=new Date().getMonth();
    // var d=new Date().getDate();
    // this.minSearchTime=new Date(y,m,d);
    // this.maxSearchTime=new Date(y,m+1,30)
  },
  watch: {
    selectTime(val) {
      this.selectForm.startTime = this.selectTimeFilter(val[0]);
      this.selectForm.endTime = this.selectTimeFilter(val[1]);
    }
  },
  methods: {
    //选择城市
    citySelect(value, index) {
      var a = this.$refs.citySelect.getColumnIndex(0);
      var b = this.$refs.citySelect.getColumnIndex(1);
      // console.log(a,b);
      this.selectForm.provinceCode = citylist[a].code - 0;
      //四个直辖市要特殊处理
      if (
        this.selectForm.provinceCode === 11 ||
        this.selectForm.provinceCode === 12 ||
        this.selectForm.provinceCode === 31 ||
        this.selectForm.provinceCode === 50
      ) {
        this.selectForm.cityCode = this.selectForm.provinceCode - 0;
        this.showSelectCity = citylist[a].text;
      } else {
        this.selectForm.cityCode = citylist[a].children[b].code - 0;
        this.showSelectCity =
          citylist[a].text + "  " + citylist[a].children[b].text;
      }
      this.cityShowPicker = false;
    },
    //取消选择
    cancelCitySelect() {
      this.selectForm.provinceCode = 0;
      this.selectForm.cityCode = 0;
      this.cityShowPicker = false;
    },
    //选中时间
    selectTravelTime(date) {
      // console.log(date);
      this.timeShowPicker = false;
      this.selectTime = JSON.parse(JSON.stringify(date));
      this.showSelectTime =
        this.timeFilter(date[0]) + " - " + this.timeFilter(date[1]);
    },
    //展示的时间处理
    timeFilter(time) {
      var date = new Date(time);
      var mm = date.getMonth() + 1;
      if (mm < 10) {
        mm = "0" + mm;
      }
      var day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      var y = date.getFullYear();
      return y + "." + mm + "." + day + " ";
    },
    //查询的时间处理
    selectTimeFilter(time) {
      var date = new Date(time);
      var y = date.getFullYear();
      var mm = date.getMonth() + 1;
      if (mm < 10) {
        mm = "0" + mm;
      }
      var day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      return y + "-" + mm + "-" + day;
    },
    //进行查询
    SearchAction() {
      //1. 进行查询
      //先进行验证
      for (const key in this.selectForm) {
        if (
          !this.selectForm[key] &&
          (key === "provinceCode" || key === "cityCode")
        ) {
          vantDialog.alert({
            message: "请选择出差城市"
          });
          return;
        } else if (
          !this.selectForm[key] &&
          (key === "startTime" || key === "endTime")
        ) {
          vantDialog.alert({
            message: "请选择出差时间"
          });
          return;
        }
        if (!this.selectForm[key] && key === "costGrade") {
          vantDialog.alert({
            message: "请选择出差的标准档次"
          });
          return;
        }
      }
      this.$request
        .post("/common/travel/getTravelCostList", this.selectForm)
        .then(res => {
          res.data.forEach(item => {
            this.$set(this.selectResultList, item.time, item.price);
          });
          return;
        });
      //2. 展示查询结果
      this.searchResultShow = true;
      this.showTime();
    },
    //查询结果在日历中的展示
    formatter(day) {
      var time = this.selectTimeFilter(day.date);
      day.bottomInfo = "￥" + this.selectResultList[time];
      return day;
    },
    //点击选择档次按钮
    onSelectGrade(){
      if (this.personSelectId==0) {
        Toast('请先选择人员类型');
        return
      }
      this.gradeShowSelect=true
    },
    //选择标准档次
    selectCostGrade(date, title) {
      this.selectForm.costGrade = date;
      this.gradeShowSelect = false;
      this.showGradeInfo = title;
    },
    //展示日期设置
    showTime() {
      var startTime = new Date(this.selectTime[0]);
      var endTime = new Date(this.selectTime[1]);
      //设置展示日历的结束范围
      var y1 = endTime.getFullYear();
      var m1 = endTime.getMonth();
      var y2 = startTime.getFullYear();
      var m2 = startTime.getMonth();
      this.maxSearchTime = new Date(y1, m1, 30);
      this.minSearchTime = new Date(y2, m2, 1);
      this.searchResult = [startTime, endTime];
    },
    //在展示结果中选择日期
    selectDate() {
      // console.log('又在选择日期');
      this.showTime();
    },
    //选择人员类型
    onSelectPerson(item) {
      this.personSelect = false;
      this.personShowInfo = item.name;
      this.personSelectId = item.id;
      this.selectForm.costGrade=0;
      this.showGradeInfo='';
    }
  }
};
</script>

<style lang="less" scoped>
.containerTravel {
  width: 100vw;
  height: 100vh;
  .travelTop {
    height: 10%;
    background-color: #1989fa;
    color: white;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .travelImg {
    width: 100%;
    height: 22%;
    // border: 1px solid red;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .travelContent {
    .travelRoute {
      font-size: 14px;
      font-weight: 700;
      padding: 10px 15px;
    }
  }
  .travelSearch {
    padding: 0 15%;
    margin-top: 30px;
  }
}
.itemIcon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  margin-bottom: 5px;
}
.collegeLogo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 26px;
  width: 82px;
  height: 22px;
  img {
    width: 100%;
    height: 100%;
  }
}

/deep/ .van-calendar__day--middle{
  color: #fff!important;
  background-color: rgb(25, 137, 250)!important;
}
/deep/ .van-calendar__day--middle::after{
  content: '';
  background-color: rgb(25, 137, 250)!important;
}
</style>