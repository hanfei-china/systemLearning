<template>
  <div class="memberMergeList">
    <div class="memberMergeList-header">
      <p>请选择重复条件</p>
      <div class="memberMergeList-header__btn">
        <ul>
          <li v-for="item in searchCondition" :key="item.code" :class="{'memberMergeList-header__selectBtn':searchType.indexOf(item.code)>=0}" @click="filterCondition(item.code)">{{item.name}}一样</li>
        </ul>
      </div>
    </div>
    <div class="memberMergeList-list">
      <div class="memberMergeList-list__header">
        <span>已找到</span>
        <span style="color:rgb(204, 153, 0);fontWeight:700;fontSize:18px;">&nbsp;{{total}}&nbsp;</span>
        <span>组</span>
        <!-- <span style="color:rgb(0, 102, 0);fontWeight:700;fontSize:16px;">&nbsp;{{selectName}}&nbsp;</span> -->
        <span>重复数据</span>
        <!-- <span>已处理</span>
        <span style="color:rgb(204, 153, 0);fontWeight:700;fontSize:18px;">&nbsp;2&nbsp;</span>
        <span>组</span>-->
      </div>
      <div class="memberMergeList-list__list">
        <ul>
          <li v-for="(item,index) in list" :key="item.index" @click="seletList=index" :class="{'selectListItem':seletList===index}">
            <div style="marginLeft:15px;">
              <div style="marginBottom:10px;">
                <span style="color:rgb(127, 77, 1);">第{{index+1}}组</span>
                <span style="color:rgb(153, 153, 153);fontSize:13px;">重复数据</span>
                <span style="color:rgb(204, 153, 0);fontSize:13px;">&nbsp;&nbsp;&nbsp;{{item.memberNum}}条</span>
              </div>
              <div>
                <div style="color:rgb(12, 25, 44);fontWeight:700;">
                  <div style="marginBottom:7px;" v-for="(condition,conIndex) in item.fieldValue" :key="conIndex">{{condition}}</div>
                </div>
                <!-- <span
                  style="color:rgb(153, 153, 153);fontSize:13px;"
                >&nbsp;&nbsp;&nbsp;{{selectName}}</span>-->
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="memberMergeList-footer">
      <el-pagination @current-change="handleCurrentChange" :current-page="cureenPage" :page-size="limit" :pager-count="5" :small="true" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "studentMergeList",
  data() {
    return {
      cureenPage: 1,
      total: 0,
      limit: 7,
      offset: 0,
      searchType: ["name"],
      selectName: "姓名",
      list: [],
      seletList: Number,
      searchCondition: []
    };
  },
  watch: {
    searchType(val) {
      this.limit = 7;
      this.offset = 0;
      this.getList();
    },
    seletList(val) {
      // console.log('执行了')
      this.$emit("selectOneList", this.list[val]);
    },
  },
  created() {
    let me = this;
    me.$request.get("/api/admin/member/archive/getAllFields?type=1").then(r=>{
      me.searchCondition = r.data;
    });
    this.getList();
  },
  methods: {
    //获取数据列表
    getList() {
      var params = {
        limit: this.limit,
        offset: this.offset,
        mergeField: this.searchType,
      };
      this.$request
        .get("/api/admin/member/teacher/archive/getMergeMemberArchivePage", {
          params,
        })
        .then((res) => {
          console.log(res);
          if (res.data.list.length === 0) {
            this.list = [];
            this.total = 0;
            this.$emit("selectOneList", {
              fieldValue: "",
              listData: [],
              memberNum: 0,
            });
            return;
          }
          this.list = JSON.parse(JSON.stringify(res.data.list));
          this.total = res.data.total;
          this.list.forEach((item) => {
            item.fieldValue = this.searchConditionFilter(item.fieldValue);
          });
          // this.seletList=this.list[0].fieldValue;//每次获取数据后默认选择第一条
          this.seletList = 0; //每次获取数据后默认选择第一条
          this.$emit("selectOneList", this.list[0]);
        });
    },
    searchConditionFilter(conditions) {
      var arr = conditions.split("&");
      var searchConditionList = [];
      var i = 0;
      while (i < arr.length) {
        if (i % 2 === 0) {
          if (arr[i + 1]) {
            var newArr = arr[i] + "&" + arr[i + 1];
          } else {
            var newArr = arr[i];
          }
          searchConditionList.push(newArr);
          i = i + 2;
        } else {
          i + i + 1;
        }
      }
      return searchConditionList;
    },
    handleCurrentChange(page) {
      this.offset = this.limit * (page - 1);
      this.getList();
    },
    filterCondition(condition) {
      var num = this.searchType.indexOf(condition);
      if (num >= 0) {
        if (this.searchType.length > 1) {
          this.searchType.splice(num, 1);
        } else {
          this.$message({
            message: "至少要选择一条筛选条件",
            type: "warning",
          });
        }
      } else {
        this.searchType.push(condition);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.memberMergeList {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  .memberMergeList-header {
    padding: 0 10px;
    padding-top: 5px;
    color: rgb(102, 102, 102);
    border-bottom: 1px solid rgb(228, 228, 228);
    p {
      padding: 10px 0;
    }
    .memberMergeList-header__btn {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          background-color: rgb(248, 250, 250);
          color: #3fa1b6;
          font-size: 12px;
          text-align: center;
          line-height: 30px;
          width: 80px;
          height: 30px;
          cursor: pointer;
          margin-right: 8px;
          margin-bottom: 15px;
          border-radius: 4px;
          &:nth-child(4n) {
            margin-right: 0;
          }
          &:hover {
            background-color: #3fa1b6;
            color: #fff;
            transform: scale(1.05);
          }
          transition: all 0.3s;
        }
        .memberMergeList-header__selectBtn {
          background-color: #3fa1b6;
          color: #fff;
        }
      }
    }
  }
  .memberMergeList-list {
    // height: 665px;
    flex: 1;
    overflow-y: auto;
    padding: 0 10px;
    padding-top: 5px;
    background-color: #f8fafa;
    .memberMergeList-list__header {
      padding: 10px 0;
      color: rgb(12, 25, 44);
      font-weight: 700;
      font-size: 14px;
    }
    .memberMergeList-list__list {
      ul {
        li {
          height: 75px;
          background-color: #fff;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          cursor: pointer;
          &:hover {
            background-color: rgb(242, 242, 242);
          }
        }
        .selectListItem {
          background-color: rgb(242, 242, 242);
        }
      }
    }
  }
  .memberMergeList-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
  }
}
</style>
