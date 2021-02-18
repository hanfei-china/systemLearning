<template>
  <div class="alumniList">
    <div class="alumniList-search">
      <el-input
        placeholder="请输入校友姓名/网页标题"
        prefix-icon="el-icon-search"
        v-model="updataForm.searchContent"
      ></el-input>
    </div>
    <div class="alumniList-result">
      <div>
        发现&nbsp;&nbsp;
        <span>{{alumniTotal}}</span>&nbsp;&nbsp;位校友资讯待更新
      </div>
      <div>
        已更新&nbsp;&nbsp;
        <span>{{addCount}}</span>&nbsp;&nbsp;位，剩余&nbsp;&nbsp;
        <span>{{unConfirmCount}}</span>&nbsp;&nbsp;位待确认
      </div>
    </div>
    <div class="alumniList-operationBtn">
      <div class="itemCheckIf" @click="selectAllIf=!selectAllIf">
        <div class="itemSelect" v-if="!selectAllIf"></div>
        <div v-else class="itemCancleSelect">
          <img src="./image/select.png" alt />
        </div>
        <div>全选</div>
      </div>
      <div style="display:flex;">
        <div class="updataBtn" @click="updata(selectAlumnis,false,1)">更新</div>
        <div class="updataBtn" @click="updata(selectAlumnis,false,2)">不更新</div>
      </div>
    </div>
    <div class="alumniList-memberList">
      <div
        :class="{'alumniItem':true,'active':clickOne.id==item.id}"
        v-for="(item,index) in updataList"
        :key="item.id"
        @click="clickAlumni(item)"
      >
        <div class="itemCheckIf" @click.stop="selectOne(index)">
          <div v-if="selectAlumnis.indexOf(index)>=0" class="itemCancleSelect">
            <img src="./image/select.png" alt />
          </div>
          <div class="itemSelect" v-else></div>
        </div>
        <div style="flex:1;">
          <div class="alumniItem-header">
            <div class="sourceTime">
              <div style="color:#C6C6C6;">
                检索时间：&nbsp;&nbsp;
                <span>{{item.reptileNewContent[0].updateTime | yyyyMMddHHmmss}}</span>
              </div>
            </div>
          </div>
          <div class="alumniItem-middle">
            <img
              v-if="item.reptileNewContent[0].image"
              :src="JSON.parse(item.reptileNewContent[0].image)[0]"
              class="alumniItem-middle__img"
            />
            <img v-else src="../alumniMatch/image/header.png" class="alumniItem-middle__img" />
            <div class="alumniItem-middle__text">
              <div style="display:flex;justifyContent:space-between;">
                <div style="fontSize:16px;fontWeight:700;">
                  姓名：&nbsp;
                  <span>{{item.reptileNewContent[0].alumniName}}</span>
                </div>
                <div style="color:#FF9D00;">
                  来源：&nbsp;
                  <span>{{item.title?item.title.split('-')[1]:''}}</span>
                </div>
              </div>
              <div style="fontSize:16px;display:flex;alignItems:center;fontWeight:700;">
                网页标题：&nbsp;
                <a target="_blank" :href="item.searchUrl">{{item.title}}</a>
              </div>
              <div style="fontSize:12px;color:#C6C6C6;">
                网页最近一次更新时间：&nbsp;
                <span>{{item.reptileNewContent[0].baiduUpdateTime}}</span>
              </div>
            </div>
          </div>
          <div class="alumniItem-footer">
            <div @click.stop="updata([index],true,1)">更新</div>
            <div @click.stop="updata([index],true,2)">不更新</div>
          </div>
        </div>
        <!-- <div class="alumniItem-arrow"></div> -->
      </div>
    </div>
    <div class="alumniList-page">
      <el-pagination
        :pager-count="5"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="updataForm.limit"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "updataList",
  props: ["selectInfoList"],
  data() {
    return {
      updataForm: {
        limit: 10,
        offset: 0,
        searchContent: ""
      },
      selectAllIf: false,
      currentPage: 1,
      total: 100,
      alumniTotal: 0,
      addCount: 0,
      unConfirmCount: 0,
      updataList: [],
      clickOne: {},
      selectAlumnis: []
    };
  },
  watch: {
    "updataForm.searchContent"(newVal) {
      this.updataForm.searchContent = newVal;
      this.updataForm.offset = 0;
      this.getUpdataList();
    },
    selectAllIf(val) {
      this.selectAlumnis = [];
      if (val) {
        this.updataList.forEach((item, index) => {
          this.selectAlumnis.push(index);
        });
      }
    }
  },
  created() {
    this.getUpdataList();
  },
  methods: {
    handleCurrentChange(page) {
      this.updataForm.offset = (page - 1) * this.updataForm.limit;
      this.getUpdataList();
    },
    getUpdataList() {
      this.$request
        .get("/api/admin/reptile/getUpdateAlumni", {
          params: this.updataForm
        })
        .then(res => {
          console.log(res);
          this.alumniTotal = res.data.statistics.alumniTotal;
          this.addCount = res.data.statistics.confirmUpdateCount;
          this.unConfirmCount = res.data.statistics.unConfirmUpdateCount;
          this.total = res.data.result.total;
          if (res.data.result.list.length > 0) {
            this.updataList = JSON.parse(JSON.stringify(res.data.result.list));
            this.clickAlumni(this.updataList[0]);
          } else {
            this.updataList = [];
            this.clickAlumni({});
          }
        });
    },
    clickAlumni(info) {
      this.clickOne = info;
      this.$emit("clickOneAlumni", info);
    },
    selectOne(index) {
      var num = this.selectAlumnis.indexOf(index);
      if (num >= 0) {
        this.selectAlumnis.splice(num, 1);
      } else {
        this.selectAlumnis.push(index);
      }
    },
    updata(arr, ifAll, type) {
      var updateField = {};
      if (ifAll && type == 1) {
        //判断当前点击的更新按钮和当前算则的更新信息是否是同一个
        if (this.updataList[arr[0]].id !== this.clickOne.id) {
          this.$message({
            message: "选择的更新信息与要更新的校友不一致，请重新选择",
            type: "warning"
          });
          return false;
        }
        // var updateField = JSON.parse(JSON.stringify(this.selectInfoList));
        this.selectInfoList.forEach(item => {
          updateField[item.field] = item.value;
        });
      } else if (!ifAll && this.selectAlumnis.length == 0) {
        this.$message({
          message: "请选择要批量操作的校友",
          type: "warning"
        });
        return false;
      }

      var updateAlumniData = [];
      arr.forEach(i => {
        var obj = {
          contentId: this.updataList[i].reptileNewContent[0].id,
          id: this.updataList[i].id,
          memberId: this.updataList[i].memberId
        };
        updateAlumniData.push(obj);
      });

      var params = {
        updateAlumniData,
        type: type,
        updateField
      };
      // console.log(params);
      this.$request.post('/api/admin/reptile/updateAssociateAlumni',params).then(res=>{
        if (res.success) {
          this.getUpdataList();
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.alumniList {
  display: flex;
  flex-direction: column;
}

.alumniList-search {
  padding: 15px 11px;
  box-sizing: border-box;
}

.alumniList-result {
  padding: 8px 15px;
  box-sizing: border-box;
  font-size: 14px;
  //   font-weight: 700;
  color: #626262;
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  span {
    font-size: 14px;
    color: #ff9d00;
  }
}

.alumniList-operationBtn {
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.itemCheckIf {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 20px;
  .itemSelect {
    margin-right: 7px;
    width: 16px;
    height: 16px;
    border: 1px solid #dddddd;
    border-radius: 2px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .itemCancleSelect {
    box-sizing: border-box;
    margin-right: 7px;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    cursor: pointer;
    background-color: #63bcc0;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 9px;
      height: 9px;
    }
  }
}
.updataBtn {
  border: 1px solid #3fa1b6;
  color: #3fa1b6;
  padding: 7px 20px;
  border-radius: 4px;
  margin-left: 15px;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
}

.alumniList-memberList {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
  // padding: 15px;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;
}
.alumniItem {
  background-color: #fff;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  // margin-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  .alumniItem-arrow {
    display: none;
    position: absolute;
    width: 10px;
    height: 10px;
    border-right: 1px solid #3fa1b6;
    border-bottom: 1px solid #3fa1b6;
    transform: rotate(-45deg);
    top: 50%;
    right: -7px;
    background-color: #fff;
    z-index: 10;
  }
  &:hover {
    // border: 1px solid #3fa1b6;
    background-color: #f9f9f9;
    .alumniItem-arrow {
      display: block;
    }
  }
}
.active {
  // border: 1px solid #3fa1b6;
  background-color: #f9f9f9;
  .alumniItem-arrow {
    display: block;
  }
}
.alumniItem-header {
  display: flex;
  align-items: center;
}
.sourceTime {
  // margin-left: 10px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alumniItem-middle {
  margin: 15px 0;
  display: flex;
  align-items: center;
}
.alumniItem-middle__img {
  width: 71px;
  height: 90px;
  margin-right: 10px;
  // border: 1px solid red;
}
.alumniItem-middle__text {
  display: flex;
  height: 90px;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  a {
    text-decoration: underline;
    color: #3fa1b6;
    display: inline-block;
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 400;
  }
}

.alumniItem-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  div {
    padding: 7px 15px;
    border-radius: 4px;
    border: 1px solid #3fa1b6;
    color: #3fa1b6;
    cursor: pointer;
    margin-right: 10px;
    &:first-child {
      background-color: #3fa1b6;
      color: #fff;
      border: 1px solid #3fa1b6;
    }
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      transform: scale(1.02);
    }
  }
}

.alumniList-page {
  width: 100%;
  background-color: #fff;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #f9f9f9;
}
</style>