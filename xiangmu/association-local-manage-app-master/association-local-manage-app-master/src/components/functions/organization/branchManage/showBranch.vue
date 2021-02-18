<template>
  <div class="addBranch">
    <div class="addBranchHeader">
      <div class="addBranchHeader-left">查看分会</div>
      <div>
        <el-button size="small" @click="$emit('close')">关闭</el-button>
      </div>
    </div>
    <!-- 分会基本信息 -->
    <div class="addBranchForm">
      <div class="addBranchForm-header">基本信息</div>
      <div class="addBranchForm-info">
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">
            <span style="color:red;marginRight:3px;">*</span>分会类型：
          </div>
          <div class="addBRanchForm-info__itemRight">{{showBranchList}}</div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">
            <span style="color:red;marginRight:3px;">*</span>分会名称：
          </div>
          <div class="addBRanchForm-info__itemRight">{{showBranchInfo.name}}</div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">分会所在地：</div>
          <div
            v-if="showBranchInfo.address&&JSON.parse(showBranchInfo.address).length>0"
            class="addBRanchForm-info__itemRight"
          >{{JSON.parse(showBranchInfo.address)[0]+'-'+JSON.parse(showBranchInfo.address)[1]}}</div>
          <div v-else class="addBRanchForm-info__itemRight"></div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">分会负责人：</div>
          <div class="addBRanchForm-info__itemRight">{{showBranchInfo.responsibility}}</div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">联系电话：</div>
          <div class="addBRanchForm-info__itemRight">{{showBranchInfo.contactPhone}}</div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">分会联系人：</div>
          <div class="addBRanchForm-info__itemRight">{{showBranchInfo.contactPerson}}</div>
        </div>
        <!-- <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">所属院系：</div>
          <div class="addBRanchForm-info__itemRight">院系</div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">所属行业：</div>
          <div class="addBRanchForm-info__itemRight">行业</div>
        </div>-->
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">分会管理员：</div>
          <div class="addBRanchForm-info__itemRight">
            <span v-for="item in showBranchInfo.managers" :key="item.id">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分会介绍 -->
    <div class="addBranchForm">
      <div class="addBranchForm-header">分会介绍</div>
      <div class="addBranchForm-textarea">
        <div class="addBranchForm-textarea__item">
          <div class="addBRanchForm-textarea__itemLeft">分会简介：</div>
          <el-input
            disabled
            type="textarea"
            resize="none"
            rows="6"
            class="addBRanchForm-textarea__itemRight"
            v-model="showBranchInfo.introduce"
          ></el-input>
        </div>
      </div>
      <div class="addBranchForm-textarea">
        <div class="addBranchForm-textarea__item">
          <div class="addBRanchForm-textarea__itemLeft">分会宣传文案：</div>
          <div class="addBRanchForm-textarea__itemRich" v-html="showBranchInfo.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "showBranch",
  props: ["showBranchInfo"],
  data() {
    return {
      branchList: [],
      showBranchList: "",
      managerList: []
    };
  },
  created() {
    this.getBranchList();
  },
  methods: {
    //获取分会类型
    getBranchList() {
      this.$request
        .get("/api/common/branch/branchListAndBranchType")
        .then(res => {
          this.branchList = JSON.parse(JSON.stringify(res.data));
          res.data.some(item => {
            if (item.id === this.showBranchInfo.branchClass) {
              this.showBranchList = item.name;
              return true;
            }
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.addBranch {
  height: 100%;
  .addBranchHeader {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;
    .addBranchHeader-left {
      font-size: 16px;
      color: #222222;
      padding-left: 6px;
      border-left: 3px solid #28394b;
      height: 16px;
      line-height: 16px;
    }
  }
  .addBranchForm {
    padding: 0 20px;
    border-bottom: 1px dashed #e6e6e6;
    padding-bottom: 20px;
    .addBranchForm-header {
      padding: 20px 0;
      font-size: 14px;
      line-height: 14px;
      font-weight: 600;
    }
    .addBranchForm-info {
      //   padding-left: 20px;
      display: flex;
      flex-wrap: wrap;
      width: 900px;
      .addBRanchForm-info__item {
        margin-right: 100px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        &:nth-child(2n) {
          margin-right: 0;
        }
        .addBRanchForm-info__itemLeft {
          width: 120px;
          text-align: right;
        }
        .addBRanchForm-info__itemRight {
          width: 215px;
        }
        .addBRanchForm-textarea__itemIcon {
          font-size: 16px;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
    .addBranchForm-textarea {
      width: 900px;
      .addBranchForm-textarea__item {
        display: flex;
        margin-bottom: 20px;
        .addBRanchForm-textarea__itemLeft {
          width: 120px;
          text-align: right;
        }
        .addBRanchForm-textarea__itemRight {
          width: 650px;
        }
        .addBRanchForm-textarea__itemRich {
          width: 650px;
          min-height: 138px;
          display: block;
          padding: 5px 15px;
          line-height: 1.5;
          box-sizing: border-box;
          font-size: inherit;
          color: #606266;
          background-color: #fff;
          background-image: none;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          overflow-x:hidden ;
        }
      }
    }
  }
}
.searchNoManager {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
}

.addManagerForm {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>