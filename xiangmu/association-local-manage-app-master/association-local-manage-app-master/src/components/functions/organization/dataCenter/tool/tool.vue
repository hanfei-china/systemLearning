<template>
  <div class="dataCenterTool">
    <el-tooltip
      v-if="useList.indexOf('export')>=0"
      class="toolItem"
      effect="dark"
      content="导出"
      placement="bottom"
    >
      <span @click="exportData" class="iconfont icon-daochu"></span>
    </el-tooltip>
    <el-tooltip
      v-if="useList.indexOf('refrensh')>=0"
      class="toolItem"
      effect="dark"
      content="刷新"
      placement="bottom"
    >
      <span @click="$emit('refresh')" class="iconfont icon-refresh"></span>
    </el-tooltip>
    <el-tooltip
      v-if="useList.indexOf('sort')>=0"
      class="toolItem"
      effect="dark"
      content="排序"
      placement="bottom"
    >
      <span class="iconfont icon-paixu" @click="clickSort"></span>
    </el-tooltip>
    <el-tooltip
      v-if="useList.indexOf('enlarge')>=0"
      class="toolItem"
      effect="dark"
      :content="isEnlarge?'缩小':'放大'"
      placement="bottom"
    >
      <span v-if="!isEnlarge" @click="enlarge" class="iconfont icon-fangda"></span>
      <span v-else @click="narrow" class="iconfont icon-suoxiao"></span>
    </el-tooltip>
    <el-dialog append-to-body width="600px" title="排序规则设置" :visible.sync="sortVisible">
      <div class="sortBox">
        <ul>
          <li v-for="item in sort" :key="item.cord" class="sortItem">
            <div>{{item.name}}</div>
            <div class="sortType">
              <div
                :class="{'sortTypeItem':true,'sortActive':sortInfo[item.cord]==typeItem.type}"
                v-for="typeItem in sortType"
                :key="typeItem.type"
                @click="selectSort(item.cord,typeItem.type)"
              >{{typeItem.title}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureSort">排 序</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "./iconfont/iconfont.css";
import { exportExcel } from "../../../../../js/util/exportFile";
import { requestBaseUrl } from "../../../../../js/config/serviceConfig";
export default {
  name: "dataCenterTool",
  //el用于确定父组件,然后进行放大;condition和url用于进行导出操作;
  //userlist用于确定父组件要使用哪些操作;全部操作:['refrensh','enlarge','export','sort']
  //sort用于确定排序的种类,如[{name:'注册学历',cord:'register'},{name:'注册数量',cord:'num'}]
  //exportType是导出请求的请求方式
  props: ["el", "condition", "url", "useList", "sort", "exportType"],
  data() {
    return {
      isEnlarge: false,
      title: "",
      exportVisible: false,
      memberTotal: 0,
      sortVisible: false,
      sortType: [
        { title: "默认", type: 0 },
        { title: "升序", type: 1 },
        { title: "降序", type: 2 }
      ],
      sortInfo: {}
    };
  },
  methods: {
    enlarge() {
      this.isEnlarge = true;
      var el = this.$parent.$refs[this.el];
      el.style.position = "fixed";
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.left = "0";
      el.style.top = "0";
      el.style.zIndex = "6666";
      el.style.margin = "0";
      this.$emit("enlarge", true);
    },
    narrow() {
      this.isEnlarge = false;
      var el = this.$parent.$refs[this.el];
      el.style = {};
      this.$emit("enlarge", false);
    },
    exportData() {
      var obj = JSON.parse(JSON.stringify(this.condition));
      var url = this.url;
      var type = this.exportType.toLocaleUpperCase();
      if (type == "GET") {
        /*这里接口回传直接是一个文件,没有请求结果的判断标识,所以被拦截器直接拦截到失败的部分中去了.然后去到catch部分
            所以这里不能使用$request.get或者$request.post.只能直接用a标签下载了.当然,实在不行可以直接使用ajax
        */
        var exportUrl = `${requestBaseUrl}${url}?selectType=${obj.selectType}&startTime=${obj.startTime}&endTime=${obj.endTime}`;
        // window.open(exportUrl);
        var a=document.createElement('a');
        a.href=exportUrl;
        // a.download=true;
        a.style.display='none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    clickSort() {
      this.sortVisible = true;
      this.sort.forEach(item => {
        this.sortInfo[item.cord] = 0;
      });
    },
    selectSort(cord, type) {
      var sortInfo = JSON.parse(JSON.stringify(this.sortInfo));
      if (type) {
        for (const key in sortInfo) {
          if (key == cord) {
            sortInfo[key] = type;
          } else {
            sortInfo[key] = 0;
          }
        }
      } else {
        sortInfo[cord] = 0;
      }
      this.sortInfo = sortInfo;
    },
    sureSort() {
      this.sortVisible = false;
      this.$emit("sortSure", this.sortInfo);
    }
  }
};
</script>

<style lang="less" scoped>
.dataCenterTool {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toolItem {
  margin-right: 15px;
  font-size: 14px;
  color: #4b8bc2;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
}
.el-dialog__body {
  border: 1px solid #e9e9e9;
}
.sortBox {
  height: 300px;
  padding: 0 15px;
}
.sortItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
}
.sortType {
  display: flex;
  align-items: center;
}
.sortTypeItem {
  height: 30px;
  line-height: 28px;
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  background-color: #f4f4f4;
  cursor: pointer;
  &:nth-child(2n) {
    border-right: 0;
    border-left: 0;
  }
}
.sortActive {
  border-color: #0db3a6;
  background-color: #0db3a6;
  color: #fff;
}
</style>