<template>
  <div class="memberInfoContainer">
    <!-- 顶部操作栏 -->
    <!-- <div class="memberInfoTop">
      <div @click="ifPass(1,[showItemInfo.taskId])">通过</div>
      <div style="borderRight:1px solid #ccc;" @click="ifPass(2,[showItemInfo.taskId])">不通过</div>
      <div @click="changeItem(1)">首个</div>
      <div @click="changeItem(2)">上一个</div>
      <div @click="changeItem(3)">下一个</div>
      <div @click="changeItem(4)">末个</div>
    </div>-->
    <div class="memberInfoShow">
      <!-- 上面的信息展示栏 -->
      <div class="memberInfoMiddle">
        <div class="middleTop">
          <div>校友注册信息</div>
          <!-- <div style="paddingBottom:2px;">申请人：{{showInfo.name}}</div>
          <div style="paddingBottom:2px;">
            申请时间：
            <span>{{showInfo.createTime | yyyyMMddHHmmss}}</span>
          </div>-->
        </div>
        <div class="middleItemShow">
          <div class="simpleInfo" v-if="Object.keys(showItemInfo).length>0">
            <img :src="showItemInfo.userHeadImg" />
            <div style="fontSize:14px;color:#222222;marginBottom:18px;">{{showItemInfo.userNickName}}</div>
            <div style="fontSize:12px;color:#888888;marginBottom:40px;">{{showItemInfo.createTime | yyyyMMddHHmmss}}</div>
            <div class="tagsShow">
              <div class="tagsShow-left">{{showItemInfo.groupName}}</div>
              <div class="tagsShow-right">{{showItemInfo.authWayName}}</div>
            </div>
          </div>
          <div v-if="Object.keys(showItemInfo).length>0" style="height:237px;width:1px;backgroundColor: #E8E8E8;marginRight:30px;"></div>
          <div style="flex:1">
            <ul class="memberInfoShowItem">
              <li v-for="item in showItemInfo.formData" :key="item.key">
                <div class="itemTitle">{{item.title}}：</div>
                <!-- 证件类型模板 -->
                <div v-if="item.key==='cardType'" style="flex:1;textAlign:left;">{{item.parameter.options[0].title}}</div>
                <!-- 图片模板 -->
                <div v-else-if="item.topicType===4">
                  <el-image class="imgShow" v-for="url in item[item.key]" :key="url" style="cursor:pointer;flex:1;textAlign:left;marginRight:10px;" :src="url" title="点击查看大图" :preview-src-list="item[item.key]"></el-image>
                  <!-- <el-image
                    class="imgShow"
                    :src="url"
                    :preview-src-list="srcList"
                  ></el-image>-->
                </div>
                <div v-else-if="item.topicType===6">
                  <span v-if="item.currentCity&&JSON.parse(item.currentCity)">{{transData(item.currentCity,item)}}</span>
                  <span v-else></span>
                </div>
                <div v-else style="width:200px;textAlign:left;">{{item[item.key]}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 下面的信息展示栏 -->
      <div class="memberInfoBottom">
        <div class="bottomInfoTop">
          <div>校友库匹配信息</div>
          <div style="paddingBottom:2px;">
            匹配到
            <span style="color:red;">{{similerItems.length}}</span> 条相似数据，请确认是否是同一人
          </div>
        </div>
        <!-- 教职工 -->
        <div class="bottomInfoBottom" v-if="showItemInfo&&showItemInfo.memberType=='1'">
          <el-table key="1" :data="similerList" height="344" style="border:1px solid #E8E8E8;borderBottom:0;width:100%">
            <el-table-column align="center" type="index" label="序号"></el-table-column>
            <template v-for="field in showTeacherFieldListNew">
              <el-table-column :key="field.code" show-overflow-tooltip :label="field.name" :prop="field.code" min-width="150">
                <template slot-scope="{ row }">
                  <span v-if="field.code=='name'" class="canClick" @click="editMember(row)">{{transData(row[field.code], field)}}</span>
                  <span v-else>{{transData(row[field.code], field)}}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column align="center" width="100" fixed="right" label="是否同一人">
              <template v-slot="{ row }">
                <el-checkbox v-model="row.checked"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 学生 -->
        <div class="bottomInfoBottom" v-else>
          <el-table key="0" :data="similerList" height="344" style="border:1px solid #E8E8E8;borderBottom:0;width:100%">
            <el-table-column align="center" type="index" label="序号"></el-table-column>
            <template v-for="field in showFieldListNew">
              <el-table-column :key="field.code" show-overflow-tooltip :label="field.name" :prop="field.code" min-width="150">
                <template slot-scope="{ row }">
                  <span v-if="field.code=='name'" class="canClick" @click="editMember(row)">{{transData(row[field.code], field)}}</span>
                  <span v-else>{{transData(row[field.code], field)}}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column align="center" width="100" fixed="right" label="是否同一人">
              <template v-slot="{ row }">
                <el-checkbox v-model="row.checked"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 图片展示大图 -->
      <el-dialog title="毕业照/学位照" :visible.sync="bigImgShowVisible" append-to-body width="500px">
        <div style="display:flex;justifyContent:center;padding:20px 0 50px 0;">
          <img :src="showBigImgUrl" alt style="height:250px;object-fit: contain;" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "memberInfo",
  props: ["showItemInfo"],
  data() {
    return {
      bigImgShowVisible: false,
      showBigImgUrl: "",
      showInfo: {}, //当前选择项的简单信息---用于头部展示
      similerForm: {
        id: "",
        limit: 1000,
        offset: 0,
      },
      currentPage: 1,
      similerList: [], //相似信息列表
      similerItemInfo: {}, //相似项的展示信息
      similerItems: [], //用于切换的列表展示
      similerTotal: 0,
      selectOneSimiler: "", //选中的相似项
      showFieldListNew: [],
      showTeacherFieldListNew: []
    };
  },
  watch: {
    showItemInfo(val) {
      //这一步的目的是为了更新左边的数据，以便右边的“上一个、下一个”等功能不失效
      this.$emit("changeItem", 0);
      //1. 获取简单展示信息
      val.formData.forEach((item) => {
        if (item.key === "name") {
          this.$set(this.showInfo, "name", item[item.key]);
        }
      });
      this.$set(this.showInfo, "createTime", val.createTime);
      //2. 根据ID 获取相似匹配信息
      this.similerForm.id = val.id;
      this.getSimilerList();
    },
    selectOneSimiler(val) {
      this.similerList.some((item) => {
        if (item.id === val) {
          this.similerItemInfo = JSON.parse(JSON.stringify(item));
          return true;
        }
      });
    },
  },
  filters: {
    timeFileter(str) {
      return str.split("-")[0];
    },
  },
  created() {
    let me = this;
    me.$request.get("/api/admin/member/archive/getAllFields?type=0").then(r=>{
      r.data.forEach(item=>{
        if(null==item.parameter){
          item.parameter={};
        }
      })
      me.showFieldListNew = r.data;
    });
    me.$request.get("/api/admin/member/archive/getAllFields?type=1").then(r=>{
      r.data.forEach(item=>{
        if(null==item.parameter){
          item.parameter={};
        }
      })
      me.showTeacherFieldListNew = r.data;
    });
  },
  methods: {
    transData(val, field) {
      if (field.topicType == 2) {
        let { options } = field.parameter;
        if(options){
          if (options.length != 0) {
            for (let option of options) {
              if (option.key === val) {
                return option.title;
              }
            }
          } else {
            return val;
          }
        }else{
          return val
        }
      }
      // if (field.topicType === 5) {
      //   if (val) {
      //     if(field.parameter&&field.parameter.dateType=="year"){
      //       return formatDate(new Date(val), "yyyy");
      //     }else{
      //       return formatDate(new Date(val), "yyyy-MM-dd");
      //     }
      //   } else {
      //     return "";
      //   }
      // }
      if (field.topicType === 6) {
        let str = "";
        let valueObj;
        if (typeof val === "string") {
          try {
            valueObj = JSON.parse(val);
          } catch (e) {
            return val;
          }
        } else {
          valueObj = val;
        }
        if (valueObj) {
          if (valueObj.country) {str += valueObj.country + "-"}
          if (valueObj.province) {
            str += valueObj.province + "-";
          }
          if (valueObj.city) {
            str += valueObj.city+"-";
          }
          str=str.slice(0, -1)
        }
        return str;
      }
      return val;
    },
    viewBigImg(url) {
      this.bigImgShowVisible = true;
      this.showBigImgUrl = url;
    },
    //改变当前选择项
    changeItem(data) {
      this.$emit("changeItem", data);
    },
    //获取相似数据
    getSimilerList() {
      var url="/api/admin/flow/getMemberApprovalRelationInfo";
      if(this.showItemInfo&&this.showItemInfo.memberType=='1'){
        url="/api/admin/flow/getMemberTeacherApprovalRelationInfo";
      }
      this.$request.get( url,{
        params:{id:this.similerForm.id,limit:this.similerForm.limit,offset:this.similerForm.offset}
      }).then((res) => {
          this.similerItems = [];
          res.data.list.forEach((item) => {
            var obj = {
              name: item.name,
              id: item.id,
            };
            this.similerItems.push(obj);
          });
          this.selectOneSimiler = this.similerItems.length > 0 ? this.similerItems[0].id : "";
          this.similerList = JSON.parse(JSON.stringify(res.data.list));
          this.similerItemInfo = this.similerList[0] || {};
          this.similerTotal = res.data.total;
        });
    },
    //选中其中一条相似项目
    selectSimilerItem(id) {
      this.selectOneSimiler = id;
    },
    //分页效果
    changeImilerPage(data) {
      var totalPage = Math.ceil(this.similerTotal / this.similerForm.limit);
      if (data) {
        //下一页
        if (this.currentPage === totalPage) {
          console.log("已经是最后一页了");
          return false;
        }
        this.currentPage++;
        this.similerForm.offset =
          (this.currentPage - 1) * this.similerForm.limit;
        this.getSimilerList();
      } else {
        if (this.currentPage === 1) {
          console.log("已经是第一页了");
          return false;
        }
        this.currentPage--;
        this.similerForm.offset =
          (this.currentPage - 1) * this.similerForm.limit;
        this.getSimilerList();
      }
    },
    //点击通过或不通过按钮
    ifPass(result, taskIds) {
      this.$request
        .post("/api/admin/flow/approve", {
          result,
          taskIds,
        })
        .then((res) => {
          // console.log(res);
          if (res.success) {
            this.getList();
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.memberInfoContainer {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  .memberInfoTop {
    display: flex;
    justify-content: flex-end;
    padding: 15px 0;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    padding-right: 10px;
    div {
      padding: 0 15px;
      cursor: pointer;
    }
  }
  .memberInfoShow {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    overflow-y: auto;
    .memberInfoMiddle {
      padding: 0 10px;
      margin-bottom: 30px;
      // max-height: 60%;
      .middleTop {
        // padding: 15px;
        padding-bottom: 15px;
        display: flex;
        font-size: 14px;
        color: rgb(102, 102, 102);
        align-items: flex-end;
        // border-bottom: 1px solid #ccc;
        // margin-top: 10px;
        div {
          font-size: 16px;
          font-weight: 700;
          color: #222222;
          line-height: 16px;
          &:first-child {
            padding: 0 10px;
            border-left: 3px solid #28394b;
          }
          margin-right: 35px;
        }
      }
    }
    .imgShow {
      // object-fit: contain;
      object-fit: cover;
      width: 100px;
      height: 100px;
    }
    .memberInfoBottom {
      // background-color: rgb(249, 249, 249);
      // flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 10px;
      border-radius: 6px;
      .bottomInfoTop {
        font-size: 14px;
        color: rgb(102, 102, 102);
        display: flex;
        justify-content: space-between;
        padding: 10px 0 15px 0;
        align-items: flex-end;
        div {
          &:first-child {
            font-size: 16px;
            line-height: 16px;
            color: black;
            font-weight: 700;
            padding: 0 10px;
            border-left: 3px solid black;
            margin-right: 20px;
          }
        }
      }
      .bottomInfoMiddle {
        display: flex;
        padding: 0 20px;
        border-bottom: 1px solid #ccc;
        justify-content: space-between;
        .leftSimilerItems {
          display: flex;
          .similerItems {
            padding: 10px 25px;
            font-size: 16px;
            color: black;
            margin: 0 15px;
            cursor: pointer;
            font-weight: 200;
            box-sizing: border-box;
          }
          .clickBottomInfo {
            color: #409eff;
            border-bottom: 4px solid #409eff;
          }
        }
      }
    }
  }
}
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.middleItemShow {
  min-height: 350px;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
}
.simpleInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 60px;
  img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    margin-bottom: 32px;
  }
}
.memberInfoShowItem {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-height: 238px;
  overflow-y: auto;
  li {
    // width: 50%;
    margin-right: 50px;
    display: flex;
    font-size: 14px;
    box-sizing: border-box;
    font-size: 14px;
    color: #222222;
    .itemTitle {
      margin-bottom: 15px;
      width: 8em;
      text-align: right;
    }
    // &:nth-child(2n) {
    //   .itemTitle {
    //     width: 35%;
    //   }
    // }
  }
}
.bottomInfoBottom {
  height: 344px;
  width: 100%;
  // width: calc( 75vw - 200px);
}
.tagsShow {
  font-size: 12px;
  width: 170px;
  display: flex;
}
.tagsShow-left {
  color: #eca038;
  background-color: #faeedd;
  border-radius: 2px;
  padding: 5px 0;
  width: 80px;
  margin-right: 10px;
  text-align: center;
}
.tagsShow-right {
  color: #6dc9cd;
  background-color: #e8f5f6;
  border-radius: 2px;
  padding: 5px 0;
  width: 80px;
  text-align: center;
}
</style>
