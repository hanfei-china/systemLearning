<template>
  <div class="statistic" ref="statistic">
    <div class="head">
      <div class="head-left">校友数据统计</div>
      <div class="head-right">
        <div class="selectSession">
          <span style="marginRight:7px;">选择校友届别:</span>
          <select-time type="year" @pickerTime="pickerAllTime"></select-time>
        </div>
        <div class="fullScreen" @click="fullScreen">
          <span
            v-if="!ifFullScreen"
            style="fontSize:12px;marginRight:7px;"
            class="iconfont icon-fangda"
          ></span>
          <span v-else style="fontSize:12px;marginRight:7px;" class="iconfont icon-suoxiao"></span>
          <span>{{ifFullScreen?'退出全屏':'全屏'}}</span>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="body-one">
        <div class="body-one__left">
          <div class="body-one__left__top">
            <!-- 校友总数 -->
            <div ref="alumnicAllNum" class="body-one__left__top__num card">
              <div class="card-top">
                <div>校友总数</div>
                <data-tool
                  class="dataTool"
                  @refresh="getAlumnicNum"
                  :useList="['refrensh']"
                  el="alumnicAllNum"
                ></data-tool>
              </div>
              <div class="card-time">
                <select-time
                  :parentTime="alumnicSession"
                  type="year"
                  @pickerTime="pickerAlumnicNumTime"
                ></select-time>
              </div>
              <div ref="alumnicAllNumCard" class="body-one__left__top__num__body">{{alumniTotal | numFormat}}</div>
            </div>
            <!-- ------------- -->

            <!-- 校友注册总数 -->
            <div ref="registerNum" class="body-one__left__top__num card">
              <div class="card-top">
                <div>注册校友总数</div>
                <data-tool
                  class="dataTool"
                  @refresh="getRegisterNum"
                  :useList="['refrensh']"
                  el="registerNum"
                ></data-tool>
              </div>
              <div class="card-time">
                <select-time
                  :parentTime="alumnicSession"
                  type="year"
                  @pickerTime="pickerRegisterNumTime"
                ></select-time>
              </div>
              <div
                ref="registerNumCard"
                class="body-one__left__top__num__body"
              >{{registerAlumniTotal | numFormat}}</div>
            </div>
            <!-- -------------- -->
          </div>
          <!-- 校友注册情况表 -->
          <div ref="registerAlumnic" class="body-one__left__bot card">
            <div class="card-top">
              <div>校友注册情况表</div>
              <data-tool
                class="dataTool"
                @enlarge="echartsRegister"
                :condition="registerAlumnicCondition"
                :url="registerUrl"
                exportType="GET"
                :sort="[{name:'注册学历',cord:'register'},{name:'注册数量',cord:'num'}]"
                el="registerAlumnic"
                :useList="['export','refrensh','enlarge']"
                @refresh="getRegisterAlumnicData"
              ></data-tool>
            </div>
            <div class="card-time">
              <select-time
                :parentTime="alumnicSession"
                type="year"
                @pickerTime="pickerRegisterTime"
              ></select-time>
            </div>
            <div class="card-bot">
              <el-table
                :height="registerEnlarge?registerTableHiehgt:260"
                :data="registerAlumnicData"
                border
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item,index) in registerAlumnicList"
                  :key="index"
                  :prop="item.prop"
                  align="center"
                >
                  <template slot="header" slot-scope="scope">
                    <div style="cursor: pointer;" @click="registerTableClick(item.prop)">
                      <span style="marginRight:5px;">{{item.title}}</span>
                      <!-- <span
                        v-if="registerTableCondition[item.prop]==0"
                        class="el-icon-d-caret"
                        style="fontSize:16px;color:#428bca;"
                      ></span>
                      <span
                        v-if="registerTableCondition[item.prop]==1"
                        class="el-icon-caret-bottom"
                        style="fontSize:16px;color:#428bca;"
                      ></span>
                      <span
                        v-if="registerTableCondition[item.prop]==2"
                        class="el-icon-caret-top"
                        style="fontSize:16px;color:#428bca;"
                      ></span>-->
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <span v-if="item.prop=='rate'">{{scope.row[item.prop] | persent}}</span>
                    <span v-else>{{scope.row[item.prop]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- ---------------------- -->
        </div>
        <!-- 校友学历分布 -->
        <div ref="alumnicEducation" class="body-one__right card">
          <div class="card-top">
            <div>校友学历分布</div>
            <data-tool
              class="dataTool"
              @enlarge="echartsEducation"
              @refresh="getEducationData"
              el="alumnicEducation"
              :sort="[{name:'分布学历',cord:'education'},{name:'分布数量',cord:'num'}]"
              :useList="['refrensh','enlarge']"
            ></data-tool>
          </div>
          <div class="card-time">
            <select-time :parentTime="alumnicSession" type="year" @pickerTime="pickerEducationTime"></select-time>
          </div>
          <div class="card-bot">
            <div
              v-if="!educationEcharts"
              ref="alumnicEducationEcharts"
              class="body-one__right__charts"
            ></div>
            <div v-else ref="alumnicEducationEcharts2" class="body-one__right__charts"></div>
          </div>
        </div>
        <!-- ---------------- -->
      </div>
      <!-- 校友学院学历分布 -->
      <div class="body-two card" ref="collegeEducation">
        <div class="card-top">
          <div>校友学院学历分布</div>
          <data-tool
            class="dataTool"
            @enlarge="echartsCollege"
            @refresh="getCollegeEducation"
            el="collegeEducation"
            :sort="[{name:'学院',cord:'education'},{name:'分布数量',cord:'num'}]"
            :useList="['refrensh','enlarge']"
          ></data-tool>
        </div>
        <div class="card-time">
          <select-time :parentTime="alumnicSession" type="year" @pickerTime="pickerCollegeTime"></select-time>
        </div>
        <div class="card-bot">
          <div v-if="!collegeEcharts" ref="collegeEducationEcharts" class="body-two__charts"></div>
          <div v-else ref="collegeEducationEcharts2" class="body-two__charts"></div>
        </div>
      </div>
      <!-- ------------------------------- -->

      <!-- 各学院注册校友统计表 -->
      <div class="body-three card" ref="registerCollegeAlumnic">
        <div class="card-top">
          <div>各学院注册校友统计表</div>
          <data-tool
            class="dataTool"
            :url="registerCollegeUrl"
            :condition="registerCollegeCondition"
            exportType="GET"
            :sort="[{name:'注册学院',cord:'registerCollege'},{name:'注册数量',cord:'num'}]"
            el="registerCollegeAlumnic"
            :useList="['export','refrensh','enlarge']"
            @refresh="refrenshRegisterCollege"
            @enlarge="enlargeRegisterCollege"
          ></data-tool>
        </div>
        <div class="card-time">
          <select-time
            :parentTime="alumnicSession"
            type="year"
            @pickerTime="pickerRegisterCollegeTime"
          ></select-time>
        </div>
        <div class="card-bot">
          <el-table
            :height="registerCollegeEnlarge?registerCollegeTableHiehgt:330"
            :data="registerCollegeAlumnicData"
            border
            style="width: 100%"
          >
            <el-table-column
              v-for="(item,index) in registerCollegeList"
              :key="index"
              :prop="item.prop"
              :row-style="{'height':'80px'}"
              align="center"
            >
              <template slot="header" slot-scope="scope">
                <div style="cursor: pointer;" @click="registerCollegeTableClick(item.prop)">
                  <span style="marginRight:5px;">{{item.title}}</span>
                  <!-- <span
                    v-if="registerCollegeTableCondition[item.prop]==0"
                    class="el-icon-d-caret"
                    style="fontSize:16px;color:#428bca;"
                  ></span>
                  <span
                    v-if="registerCollegeTableCondition[item.prop]==1"
                    class="el-icon-caret-bottom"
                    style="fontSize:16px;color:#428bca;"
                  ></span>
                  <span
                    v-if="registerCollegeTableCondition[item.prop]==2"
                    class="el-icon-caret-top"
                    style="fontSize:16px;color:#428bca;"
                  ></span>-->
                </div>
              </template>
              <template slot-scope="scope">
                <span>{{scope.row[item.prop]}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="body-three__bot">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="registerCollegePage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="registerCollegeLimit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="registerCollegeTotal"
          ></el-pagination>
        </div>
      </div>
      <!-- ------------------------------------ -->
    </div>
  </div>
</template>

<script>
import "../tool/iconfont/iconfont.css";
import dataTool from "../tool/tool";
import echarts from "echarts";
import selectTime from "../tool/time";
export default {
  name: "dataStatistics",
  components: { dataTool, selectTime },
  data() {
    return {
      alumnicSession: [],
      ifFullScreen: false,
      alumnicNumForm: {
        startTime: "",
        endTime: ""
      },
      alumniTotal: 0,
      registerNumForm: {
        startTime: "",
        endTime: ""
      },
      registerAlumniTotal: 0,
      // 校友注册情况
      registerEnlarge: false,
      registerUrl: "/api/admin/member/v2/downloadDataStatistics",
      registerForm: {
        startTime: "",
        endTime: ""
      },
      registerTableHiehgt:0,
      registerAlumnicList: [
        { prop: "education", title: "校友类型" },
        { prop: "total", title: "校友总库" },
        { prop: "registerTotal", title: "注册校友" },
        { prop: "rate", title: "有效联系率" }
      ],
      registerTableCondition: {
        education: 0,
        total: 0,
        registerTotal: 0,
        rate: 0
      },
      registerAlumnicData: [],
      //校友学历分布情况
      educationEcharts: false,
      educationHeight: 0,
      educationForm: {
        startTime: "",
        endTime: ""
      },
      alumnicEducationList: [],
      //校友学院学历分布情况
      collegeEcharts: false,
      collegeEducationForm: {
        startTime: "",
        endTime: ""
      },
      collegeEducationType: [],
      collegeEducationList: [],
      collegeEducationHeight: 0,
      //各学院注册校友
      registerCollegeForm: {
        startTime: "",
        endTime: ""
      },
      registerCollegeList: [],
      registerCollegeTableCondition: {},
      registerCollegeAlumnicData: [],
      registerCollegeTotal: 0,
      registerCollegePage: 1,
      registerCollegeLimit: 10,
      registerCollegeEnlarge: false,
      registerCollegeTableHiehgt: 0,
      registerCollegeUrl: "/api/admin/member/v2/downloadDataStatistics"
    };
  },
  computed: {
    registerAlumnicCondition() {
      var obj1 = this.registerForm;
      var obj2 = { selectType: 3 };
      var obj = Object.assign(obj1, obj2);
      return obj;
    },
    registerCollegeCondition() {
      var obj1 = this.registerCollegeForm;
      var obj2 = { selectType: 6 };
      var obj = Object.assign(obj1, obj2);
      return obj;
    }
  },
  mounted() {
    this.getEducationData();
    this.registerAndCollege();
  },
  created() {
    this.getAlumnicNum();
    this.getRegisterNum();
    this.getRegisterAlumnicData();
  },
  methods: {
    getAlumnicNum() {
      var params = {
        selectType: 1,
        startTime: this.alumnicNumForm.startTime,
        endTime: this.alumnicNumForm.endTime
      };
      this.$request
        .get("/api/admin/member/v2/getStatisticalAnalysis", { params })
        .then(res => {
          this.alumniTotal = res.data.alumniTotal;
        });
    },
    getRegisterNum() {
      var params = {
        selectType: 2,
        startTime: this.registerNumForm.startTime,
        endTime: this.registerNumForm.endTime
      };
      this.$request
        .get("/api/admin/member/v2/getStatisticalAnalysis", { params })
        .then(res => {
          this.registerAlumniTotal = res.data.registerAlumniTotal;
        });
    },
    getRegisterAlumnicData() {
      var params = {
        selectType: 3,
        startTime: this.registerForm.startTime,
        endTime: this.registerForm.endTime
      };
      this.$request
        .get("/api/admin/member/v2/getStatisticalAnalysis", { params })
        .then(res => {
          this.registerAlumnicData = res.data.alumniInformationSheet;
        });
    },
    getEducationData() {
      var params = {
        selectType: 4,
        startTime: this.educationForm.startTime,
        endTime: this.educationForm.endTime
      };
      this.$request
        .get("/api/admin/member/v2/getStatisticalAnalysis", { params })
        .then(res => {
          var arr = [];
          res.data.alumniInformationSheet.forEach(item => {
            var obj = {
              product: item.education,
              校友总数: item.total,
              注册校友总数: item.registerTotal
            };
            arr.push(obj);
          });
          this.alumnicEducationList = arr;
          var el1 = this.$refs.alumnicEducationEcharts;
          var height = this.$refs.alumnicEducation.offsetHeight - 20 - 25;
          this.educationHeight = height * 0.9;
          this.initAlumnicEducation(el1);
        });
    },
    getCollegeEducationType() {
      return new Promise(resolve => {
        this.$request
          .get("/api/common/associator/historyCollege/educations")
          .then(res => {
            var arr = [];
            res.data.forEach(item => {
              arr.push(item.title);
            });
            this.collegeEducationType = arr;
            resolve();
          });
      });
    },
    getCollegeEducation() {
      var that = this;
      var params = {
        selectType: 5,
        startTime: this.collegeEducationForm.startTime,
        endTime: this.collegeEducationForm.endTime
      };
      this.$request
        .get("/api/admin/member/v2/getStatisticalAnalysis", { params })
        .then(res => {
          var arr = [];
          res.data.alumniAll.forEach(item => {
            var obj = {};
            obj["product"] = item.currentCollege;
            that.collegeEducationType.forEach(type => {
              obj[type] = item[type];
            });
            arr.push(obj);
          });
          this.collegeEducationList = arr;
          var el2 = this.$refs.collegeEducationEcharts;
          var height = this.$refs.collegeEducation.offsetHeight - 20 - 25;
          this.collegeEducationHeight = height * 0.9;
          this.initAlumnicCollege(el2);
        });
    },
    getRegisterCollegeAlumnicData() {
      var params = {
        startTime: this.registerCollegeForm.startTime,
        endTime: this.registerCollegeForm.endTime,
        limit: this.registerCollegeLimit,
        offset: (this.registerCollegePage - 1) * this.registerCollegeLimit
      };
      this.$request
        .get("/api/admin/member/v2/anon/getStatisticalAnalysisPage", { params })
        .then(res => {
          var arr = [];
          arr.push({ prop: "currentCollege", title: "现属学院" });
          arr.push({ prop: "num", title: "校友总数" });
          this.collegeEducationType.forEach(item => {
            arr.push({ prop: item, title: item });
          });
          this.registerCollegeList = arr;
          this.registerCollegeTotal = res.data.total;
          this.registerCollegeAlumnicData = res.data.list;
          //   this.registerCollegeAlumnicData = res.data.alumniInformationSheet;
        });
    },
    async registerAndCollege() {
      // 先执行这个请求,是因为表格的种类关系到后面两个函数内部的执行
      await this.getCollegeEducationType();
      this.getRegisterCollegeAlumnicData();
      this.getCollegeEducation();
    },
    fullScreen() {
      var el = this.$refs.statistic;
      if (this.ifFullScreen) {
        //   退出全屏
        this.ifFullScreen = false;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else {
        //   全屏
        this.ifFullScreen = true;
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
      }
    },
    pickerAllTime(time) {
      this.alumnicSession = time;
      this.getEducationData();
      this.registerAndCollege();
      this.getAlumnicNum();
      this.getRegisterNum();
      this.getRegisterAlumnicData();
    },
    //echarts表格放大后要初始化一下,因为宽高希望能够跟随变化
    echartsEducation(isEnlarge) {
      this.educationEcharts = isEnlarge;
      if (isEnlarge) {
        this.$nextTick(() => {
          var el = this.$refs.alumnicEducationEcharts2;
          var height = this.$refs.alumnicEducation.offsetHeight - 20 - 25;
          this.educationHeight = height * 0.9;
          this.initAlumnicEducation(el);
        });
      } else {
        this.$nextTick(() => {
          var el = this.$refs.alumnicEducationEcharts;
          var height = this.$refs.alumnicEducation.offsetHeight - 20 - 25;
          this.educationHeight = height * 0.9;
          this.initAlumnicEducation(el);
        });
      }
    },
    //初始化校友学历数据
    initAlumnicEducation(el) {
      //   var el = this.$refs.alumnicEducationEcharts;
      var arr = this.alumnicEducationList;
      var options = {
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ["product", "校友总数", "注册校友总数"],
          source: arr
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [{ type: "bar" }, { type: "bar" }]
      };
      var myChart = echarts.init(el);
      myChart.resize({ height: this.educationHeight });
      myChart.setOption(options);
    },
    //初始化校友学院学历数据
    initAlumnicCollege(el) {
      //   var el = this.$refs.alumnicEducationEcharts;
      var len = this.collegeEducationType.length;
      var series = [];
      for (let i = 0; i < len; i++) {
        var obj = { type: "bar" };
        series.push(obj);
      }
      var that = this;
      var options = {
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ["product", ...that.collegeEducationType],
          source: that.collegeEducationList
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: series
      };
      var myChart = echarts.init(el);
      myChart.resize({ height: this.collegeEducationHeight });
      myChart.setOption(options);
    },
    echartsCollege(isEnlarge) {
      this.collegeEcharts = isEnlarge;
      if (isEnlarge) {
        this.$nextTick(() => {
          var el = this.$refs.collegeEducationEcharts2;
          var height = this.$refs.collegeEducation.offsetHeight - 20 - 25;
          this.collegeEducationHeight = height * 0.9;
          this.initAlumnicCollege(el);
        });
      } else {
        this.$nextTick(() => {
          var el = this.$refs.collegeEducationEcharts;
          var height = this.$refs.collegeEducation.offsetHeight - 20 - 25;
          this.collegeEducationHeight = height * 0.9;
          this.initAlumnicCollege(el);
        });
      }
    },
    echartsRegister(isEnlarge) {
      this.registerEnlarge = isEnlarge;
      if (isEnlarge) {
        this.registerTableHiehgt =
          this.$refs.registerAlumnic.offsetHeight - 150;
      }
    },
    //用于排序的
    registerTableClick(prop) {
      var registerTableCondition = JSON.parse(
        JSON.stringify(this.registerTableCondition)
      );
      if (registerTableCondition[prop] == 2) {
        registerTableCondition[prop] = 0;
      } else {
        registerTableCondition[prop]++;
      }
      this.registerTableCondition = registerTableCondition;
    },
    //用于排序的
    registerCollegeTableClick(prop) {
      var registerCollegeTableCondition = JSON.parse(
        JSON.stringify(this.registerCollegeTableCondition)
      );
      if (registerCollegeTableCondition[prop] == 2) {
        registerCollegeTableCondition[prop] = 0;
      } else {
        registerCollegeTableCondition[prop]++;
      }
      this.registerCollegeTableCondition = registerCollegeTableCondition;
    },
    handleSizeChange(size) {
      this.registerCollegeLimit = size;
      this.getRegisterCollegeAlumnicData();
    },
    handleCurrentChange(page) {
      this.registerCollegePage = page;
      this.getRegisterCollegeAlumnicData();
    },
    // registerSort(sort) {
    //   console.log("这是校友注册情况表的排序");
    // },
    // educationSort(sort) {
    //   console.log("这是校友学历分布的排序");
    // },
    pickerAlumnicNumTime(time) {
      this.alumnicNumForm = time;
      if ((time.endTime&&time.startTime) || (!time.endTime&&!time.startTime)) {
        this.getAlumnicNum();
      }
    },
    pickerRegisterNumTime(time) {
      this.registerNumForm = time;
      if ((time.endTime&&time.startTime) || (!time.endTime&&!time.startTime)) {
        this.getRegisterNum();
      }
    },
    pickerRegisterTime(time) {
      this.registerForm = time;
      if ((time.endTime&&time.startTime) || (!time.endTime&&!time.startTime)) {
        this.getRegisterAlumnicData();
      }
    },
    pickerEducationTime(time) {
      this.educationForm = time;
      if ((time.endTime&&time.startTime) || (!time.endTime&&!time.startTime)) {
        this.getEducationData();
      }
    },
    // collegeSort(sort) {
    //   console.log("这是校友学院学历分布的排序");
    // },
    pickerCollegeTime(time) {
      this.collegeEducationForm = time;
      if ((time.endTime&&time.startTime) || (!time.endTime&&!time.startTime)) {
        this.getCollegeEducation();
      }
    },
    // registerCollegeSort(sort) {},
    refrenshRegisterCollege() {
      this.registerCollegePage = 1;
      this.getRegisterCollegeAlumnicData();
    },
    pickerRegisterCollegeTime(time) {
      this.registerCollegeForm = time;
      if ((time.endTime&&time.startTime) || (!time.endTime&&!time.startTime)) {
        this.refrenshRegisterCollege();
      }
    },
    enlargeRegisterCollege(enlarge) {
      this.registerCollegeEnlarge = enlarge;
      if (enlarge) {
        this.registerCollegeTableHiehgt =
          this.$refs.registerCollegeAlumnic.offsetHeight - 150;
      }
    }
  }
};
</script>

<style lang="less">
.statistic {
  background-color: #f8fafa;
  padding-bottom: 15px;
  min-width: 1630px;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 0 !important;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e4e4;
  width: 100%;
  box-sizing: border-box;
}
.head-left {
  padding: 0 10px;
  border-left: 3px solid #03f;
  font-size: 16px;
  font-weight: 700;
}
.head-right {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.selectSession {
  display: flex;
  align-items: center;
}
.fullScreen {
  margin-left: 20px;
  cursor: pointer;
  color: #4b8bc2;
}
.card {
  border: 1px solid #f2f2f2;
  background-color: #fff;
  padding: 10px 15px;
  box-sizing: border-box;
  box-shadow: 0 2px 6px 0 rgba(84, 48, 132, 0.1);
  &:hover {
    box-shadow: 0 6px 14px 0 rgba(84, 48, 132, 0.15);
    .dataTool {
      display: block;
    }
  }
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  height: 25px;
  line-height: 25px;
  .dataTool {
    display: none;
  }
}
.card-time {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.card-bot {
  flex: 1;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-table__row {
  height: 40px;
}
.body-one {
  display: flex;
  justify-content: space-between;
  margin: 10px;
  .body-one__left {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    width: 665px;
    .body-one__left__top {
      display: flex;
      justify-content: space-between;
      .body-one__left__top__num {
        width: 330px;
        height: 180px;
        display: flex;
        flex-direction: column;
        .body-one__left__top__num__body {
          font-size: 45px;
          font-weight: 700;
          height: 145px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .body-one__left__bot {
      height: 380px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
    }
  }
  .body-one__right {
    flex: 1;
    height: 570px;
    display: flex;
    flex-direction: column;
    .body-one__right__charts {
      height: 90%;
      width: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.body-two {
  height: 380px;
  margin: 0 10px 10px 10px;
  display: flex;
  flex-direction: column;
  .body-two__charts {
    // height: 90%;
    // width: 90%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.body-three {
  height: 500px;
  margin: 0 10px 0 10px;
  display: flex;
  flex-direction: column;
}
.body-three__bot {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>