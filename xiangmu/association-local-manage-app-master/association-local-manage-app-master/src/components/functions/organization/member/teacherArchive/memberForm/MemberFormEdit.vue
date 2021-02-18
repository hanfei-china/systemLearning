<template>
  <el-container class="absolute-fill-parent border-top cusdia" v-loading="loading">
    <div class="elheader">
      <div class="headtitle">{{userId?"编辑档案":"新建档案"}}</div>
      <div>
        <el-button size="small" type="danger" icon="el-icon-circle-close" @click="$emit('close')">关闭</el-button>
        <el-button size="small" type="success" icon="el-icon-circle-check" @click="saveField">保存</el-button>
      </div>
    </div>
    <el-header height="60px"></el-header>
    <el-main class="unset-padding position-relative">
      <vue-scroll @handle-scroll="click">
        <div style="padding: 20px;">
          <div class="fieldbox">
            <div class="rows">
              <div class="rowpart" v-for="(item,index) in basicFieldList" :key="index">
                <span><i style="color: #f56c6c;margin-right: 4px;" v-if="item.necessary">*</i>{{item.name}}：</span>
                <div>
                  <el-date-picker style="width:100%;" size="mini" v-if="item.topicType==5" v-model="model[item.code]" :type="(item.parameter&&item.parameter.dateType)?item.parameter.dateType:'date'" placeholder="选择日期" :value-format="(item.parameter&&item.parameter.dateType=='year')?'yyyy':'yyyy-MM-dd'"></el-date-picker>
                  <el-select style="width:100%;" v-else-if="item.topicType==2" size="mini" v-model="model[item.code]">
                    <el-option v-for="option of item.parameter.options" :key="option.key" :value="option.title" :label="option.title" />
                  </el-select>
                  <city-choose size="mini" v-else-if="item.topicType==6" v-model="model[item.code]" show-city/>
                  <el-input v-else size="mini" v-model="model[item.code]"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vue-scroll>
    </el-main>
  </el-container>
</template>

<script>
import CityChoose from "../../../../util/city/CityChoose2";
export default {
  name: "MemberForm",
  props: {
    userId: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      loading: false,
      model: {},
      basicFieldList: []
    };
  },
  methods: {
    saveField(code) {
      for (let i = 0; i < this.basicFieldList.length; i++) {
        let item = this.basicFieldList[i];
        if (item.necessary && !this.model[item.code]) {
          this.$message.warning("请输入" + item.name)
          return;
        }
      }
      var fieldValues = JSON.parse(JSON.stringify(this.model));
      delete fieldValues.createTime;
      if (fieldValues.id) {
        this.$request.put("/api/admin/member/teacher/archive", {fieldValues:fieldValues}).then((res) => {
          this.$emit("refresh-members");
          this.$emit("close");
          this.$message.success("修改成功");
        });
      }else{
        this.$request.post("/api/admin/member/teacher/archive", {fieldValues:fieldValues}).then((res) => {
          this.$emit("refresh-members");
          this.$emit("close");
          this.$message.success("添加成功");
        });
      }
    },
    click() {
      for (let ref in this.$refs) {
        let item = this.$refs[ref];
        if (Array.isArray(item)) {
          if (item[0]) {
            item[0].hidden();
          }
        }
      }
    },
    getMemberFields() {
      this.loading = true;
      this.$request.get("/api/admin/member/teacher/archive/" + this.userId).then((memberInfo) => {
        this.model = JSON.parse(JSON.stringify(memberInfo.data));
        if ( !( isNaN(this.model.birthday) && !isNaN(Date.parse(this.model.birthday)) ) ) {
          this.model.birthday = "";
        }
        this.$nextTick(()=>{ this.loading = false; })
      });
    },
  },
  created() {
    let me = this;
    me.loading = true;
    me.$request.get("/api/admin/member/archive/getAllFields?type=1").then(r=>{
      let fields = r.data.sort((a, b) => {
        return a.seq > b.seq;
      });
      fields.forEach(item => {
        if (null == item.parameter) {
          item.parameter = {};
        }else {
          item.parameter = JSON.parse(item.parameter);
        }
      });
      me.basicFieldList = fields;
      me.$nextTick(()=>{ me.loading = false; })
    });
    if (me.userId) {
      me.getMemberFields();
    }
  },
  components:{
    CityChoose
  }
};
</script>
<style lang="less" scoped>
.cusdia {
  background: white;
  .elheader {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    right: 0;
    line-height: 60px;
    padding: 0 20px;
    background: white;
    margin-bottom: 10px;
    font-size: 16px;
    box-shadow: 0 2px 4px 0 hsla(0, 0%, 68%, 0.27);
    display: flex;
    justify-content: space-between;
    .headtitle {
      font-size: 20px;
      color: #465361;
      font-weight: 600;
    }
  }
  .fieldbox {
    margin-bottom: 20px;
    h5 {
      border-radius: 2px;
      background-color: rgb(248, 250, 250);
      border: 1px solid rgb(207, 219, 219);
      line-height: 44px;
      font-size: 16px;
      font-weight: 700;
      font-family: 宋体;
      color: rgb(102, 131, 131);
      padding-left: 20px;
    }
    .dashbox {
      border: 1px dashed rgb(216, 229, 238);
      margin: 20px 0;
      padding: 0 20px;
      position: relative;
      .btnbox {
        position: absolute;
        right: 0;
        bottom: -10px;
        span {
          display: inline-block;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #d8e5ee;
          text-align: center;
          line-height: 38px;
          cursor: pointer;
          margin-right: 10px;
          i {
            color: #0033ff;
          }
        }
      }
    }
    .rows {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 700px;
      padding-left: 50px;
      .rowpart {
        width: 300px;
        margin-bottom: 20px;
        box-sizing: border-box;
        span {
          color: #999;
        }
        div {
          color: #000;
          height: 30px;
          display: flex;
          align-items: center;
          span {
            color: #000;
          }
        }
      }
      .rowpart:nth-of-type(2n) {
        margin-left: auto;
      }
    }
    .newrows {
      margin-top: 20px;
      .flexfield {
        display: flex;
        flex-wrap: wrap;
      }
      .fielditem {
        margin-top: 10px;
        display: flex;
        align-items: center;
        width: 48%;
        margin-right: 3%;
        .custom-el-form-item-label {
          width: 60px;
          flex-shrink: 0;
        }
        div {
          width: 193px;
        }
      }
      .fielditem:nth-of-type(2n) {
        margin-right: 0;
      }
    }
  }

  .flexbox {
    display: flex;
    justify-content: space-between;
    .leftpart {
      width: 52%;
      box-sizing: border-box;
    }
    .rightpart {
      margin-left: 10px;
      flex: 1;
      .rows {
        .rowpart {
          width: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          span {
            color: #999;
          }
          div {
            color: #000;
            height: 30px;
            display: flex;
            align-items: center;
            span {
              color: #000;
            }
          }
        }
      }
    }
    .row1 {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      span {
        width: 8px;
        height: 8px;
        background: #06c;
        border-radius: 50%;
        margin-right: 8px;
      }
      p {
        font-size: 14px;
        font-weight: 700;
        color: #333;
        margin-right: 20px;
      }
      .operatebox {
        margin-left: auto;
      }
    }
    .row2 {
      display: flex;
      width: 100%;
      padding-left: 16px;
      margin-top: 10px;
      div {
        padding: 0 10px;
        font-size: 14px;
        background: #f2f2f2;
        margin-right: 10px;
      }
    }
  }
}
</style>
