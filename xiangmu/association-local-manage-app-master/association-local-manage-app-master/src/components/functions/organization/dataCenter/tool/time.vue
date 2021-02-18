<template>
  <div class="selectTime">
    <!-- 日期选择 -->
    <el-date-picker
      v-if="type=='day'"
      v-model="dayTime"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :picker-options="pickerDayOptions"
      size="mini"
      style="width:205px;"
      @change="selectTime"
    ></el-date-picker>
    <!-- ------------------------- -->

    <!-- 月份选择 -->
    <el-date-picker
      v-if="type=='month'"
      v-model="monthTime"
      type="monthrange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份"
      size="mini"
      style="width:205px;"
      value-format="yyyy-MM"
      :picker-options="pickerMonthOptions"
      @change="selectTime"
    ></el-date-picker>
    <!-- ------------------------- -->

    <!-- 年份选择 -->
    <div v-if="type=='year'">
      <el-date-picker
        value-format="yyyy"
        size="mini"
        v-model="yearTime1"
        type="year"
        placeholder="开始年份"
        style="width:110px;"
        @change="selectTime"
      ></el-date-picker>
      <span style="margin:0 10px;fontSize:12px;">至</span>
      <el-date-picker
        value-format="yyyy"
        size="mini"
        v-model="yearTime2"
        type="year"
        placeholder="结束年份"
        style="width:110px;"
        @change="selectTime"
      ></el-date-picker>
    </div>
    <!-- --------------------------------- -->
  </div>
</template>

<script>
export default {
  name: "selectTime",
  props: ["type", "parentTime"],
  data() {
    return {
      dayTime: [],
      pickerDayOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      monthTime: [],
      pickerMonthOptions: {
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              picker.$emit("pick", [new Date(), new Date()]);
            }
          },
          {
            text: "今年至今",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      yearTime1: "",
      yearTime2: ""
    };
  },
  watch: {
    parentTime(val) {
      if (this.type != "year") {
          this.selectTime([val.startTime,val.endTime]);
      }else{
          this.yearTime1=val.startTime;
          this.yearTime2=val.endTime;
          this.selectTime();
      }
    }
  },
  methods: {
    selectTime(val) {
      if (this.type != "year") {
        var time = {
          startTime: val[0],
          endTime: val[1]
        };
        this.$emit("pickerTime", time);
      } else {
        var time = {
          startTime: this.yearTime1,
          endTime: this.yearTime2
        };
        this.$emit("pickerTime", time);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.selectTime {
  margin: 5px 0;
}
</style>