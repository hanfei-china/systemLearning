<template>
  <el-form class="basic-form" label-width="120px">
    <el-form-item label="活动主题：" required>
      <el-input
        placeholder="请输入活动主题"
        clearable
        class="basic-input-long"
        v-model="activityBaseInfo.theme"
        maxlength="256"
      />
    </el-form-item>
    <el-form-item label="活动类型：" required>
      <el-select
        placeholder="请选择活动类型"
        clearable
        class="basic-input-long"
        v-model="activityBaseInfo.activityCategoryId"
      >
        <el-option
          v-for="item in activityCategoryList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <div class="flex">
      <el-form-item label="举办时间：" required>
        <el-date-picker
          type="datetimerange"
          placeholder="选择日期时间"
          v-model="activityBaseInfo.activityTimes"
          class="basic-input-middle"
          range-separator="至"
          format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="报名截止：" required>
        <el-date-picker
          type="datetime"
          class="basic-input-short"
          :picker-options="pickerOptions"
          v-model="activityBaseInfo.signUpEndTime"
          format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
    </div>
    <el-form-item label="活动地点：" required>
      <b-map v-model="activityBaseInfo.address" :address-config="activityBaseInfo.addressConfig" />
    </el-form-item>
    <el-form-item label="活动海报：" required>
      <upload-activity-poster v-model="activityBaseInfo.posterUrl" />
    </el-form-item>
    <!-- <el-form-item label="发布到：" required>
            <el-radio-group v-model="activityBaseInfo.publishAddress">
                <el-radio v-for="item in publishAddresses" :key="item.label" :label="item.label">
                    {{item.value}}
                </el-radio>
            </el-radio-group>
    </el-form-item>-->
    <el-form-item label="报名限制：" required>
            <el-radio-group v-model="activityBaseInfo.signUpLimit">
                <el-radio v-for="item in signUpLimits" :key="item.label" :label="item.label">
                    {{item.value}}
                </el-radio>
            </el-radio-group>
    </el-form-item>
    <el-form-item label="其他设置：" required>
      <el-checkbox v-model="activityBaseInfo.verify">开启报名审核</el-checkbox>
      <el-checkbox v-model="activityBaseInfo.signUpOnSite">
        开启现场报名
        <el-tooltip placement="top" content="开启现场报名后，用户可以通过扫描签到二维码进行报名和签到">
          <i class="el-icon-question" />
        </el-tooltip>
      </el-checkbox>
    </el-form-item>
    <el-form-item label="是否添加积分：" required>
      <el-switch v-model="activityBaseInfo.addIntegral" active-text="是" inactive-text="否"></el-switch>
    </el-form-item>
    <el-form-item v-if="activityBaseInfo.addIntegral" label="积分规则：" required>
      <el-select v-model="activityBaseInfo.integralRuleId">
        <el-option v-for="item in actRules" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import BMap from "./BMap";
import UploadActivityPoster from "./UploadActivityPoster";

export default {
  name: "BasicForm",
  components: { UploadActivityPoster, BMap },
  props: {
    activityBaseInfo: {
      type: Object,
      default() {
        return {
          //活动主题
          theme: "",
          //活动类型
          activityCategoryId: "",
          //输入的地图地点
          address: "",
          //发布到
          publishAddress: "0",
          //报名限制
          signUpLimit: "0",
          //报名截止时间
          signUpEndTime: null,
          //是否需要审核
          verify: true,
          postUrl: "",
          activityTimes: [new Date(), new Date()],
          details: "",
          addressConfig: {
            lng: 0,
            lat: 0,
            province: "",
            city: ""
          },
          signUpOnSite: false,
          addIntegral: false
        };
      }
    },
    branchId: {
      type: String
    }
  },
  data() {
    return {
      activityCategoryList: [],
      mapHide: false, //地图显示隐藏
      publishAddresses: [
        {
          label: "0",
          value: "活动大厅"
        },
        {
          label: "1",
          value: "仅本会"
        }
      ],
      signUpLimits: [
        {
          label: "0",
          value: "无限制"
        },
        // {
        //   label: "1",
        //   value: "本会校友"
        // },
        {
          label: "2",
          value: "所有校友"
        }
      ],
      actRules: [],
      isMain: true
    };
  },
  computed: {
    pickerOptions() {
      let that = this;
      return {
        disabledDate(date) {
          if (
            that.activityBaseInfo.activityTimes &&
            that.activityBaseInfo.activityTimes.length === 2
          ) {
            let time = null;
            let endTime = that.activityBaseInfo.activityTimes[1];
            try {
              time = endTime.getTime();
            } catch (e) {
              time = endTime;
            }
            return date.getTime() > time;
          }
        }
      };
    }
  },
  watch: {
    branchId(val) {
      this.init();
    }
  },
  created() {
      this.init();
  },
  methods: {
    getActivityCategoryList() {
      this.$request
        .get("/api/admin/group/getCategoryNameAndIdByName", {
          params: {
            type: 3,
            isMain: this.isMain
          }
        })
        .then(res => {
          this.activityCategoryList = res.data;
        });
    },
    getRules() {
      this.$request.get("/api/admin/integral/activityRules").then(res => {
        this.actRules = res.data;
      });
    },
    init() {
    //   console.log("....", this.branchId);
      if (this.branchId == "all" || !this.branchId) {
        // console.log("总会进入");
        this.activityBaseInfo.publishAddress = "0";
        this.activityBaseInfo.signUpLimit = "2";
      } else {
        // console.log("分会进入");
        this.activityBaseInfo.publishAddress = "1";
        this.activityBaseInfo.signUpLimit = "1";
        this.isMain = false;
        this.signUpLimits=[
          {
            label: "0",
            value: "无限制"
          },
          {
            label: "1",
            value: "本会校友"
          },
          {
            label: "2",
            value: "所有校友"
          }
        ]
      }
      this.getActivityCategoryList();
      this.getRules();
    }
  }
};
</script>
