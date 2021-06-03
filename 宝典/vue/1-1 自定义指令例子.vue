<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="position-relative unset-padding">
      <vue-scroll class="absolute-fill-parent">
        <div style="height: 380px;padding: 20px;" v-if="setting">
          <el-form label-width="130px" size="small">
            <el-form-item label="入会审核：">
              <el-checkbox v-model="setting.openVerify">开启入会审核</el-checkbox>
            </el-form-item>
            <el-form-item label="最大入会数量：">
              <el-input-number
                :min="0"
                v-model="setting.maxJoinBranchNum"
                controls-position="right"
              />
              <el-button style="marginLeft:15px;" @click="setList=true">设置白名单</el-button>
            </el-form-item>
            <!-- <el-form-item label="加入总会：">
                            <el-checkbox v-model="setting.autoJoinMainBranch">自动加入总会</el-checkbox>
                        </el-form-item>
                        <el-form-item label="关联分会：">
                            <el-checkbox v-model="setting.autoJoinAcademicBranch">自动加入关联分会</el-checkbox>
            </el-form-item>-->
            <el-form-item label="分会LOGO：">
              <image-upload unrestricted :attributes="logoAttributes" v-model="setting.branchLogo">
                <span style="font-size: 12px;">
                  点击分会系统LOGO，
                  <span style="color: red;">图片应小于200Kb</span>
                </span>
              </image-upload>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="saveSetting"
              >&nbsp;&nbsp;&nbsp;保存配置&nbsp;&nbsp;&nbsp;</el-button>
            </el-form-item>
          </el-form>
        </div>
      </vue-scroll>
    </el-main>
    <el-dialog
      title="入会白名单"
      :visible.sync="setList"
      append-to-body
      width="700px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form label-width="120px">
        <el-form-item label="入会白名单">
          <el-select
            v-model="list"
            multiple
            filterable
            remote
            :remote-method="search"
            placeholder="请选择"
            style="width:400px;"
            v-loadmore="touchBottom"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="display:flex;justifyContent:flex-end;alignItems:center;">
        <el-button type="primary" @click="setWhiteList">确定</el-button>
        <el-button @click="setList=false">取消</el-button>
      </div>
    </el-dialog>
    <div class="asdf"></div>
  </el-container>
</template>

<script>
const document = window.document;

import ImageUpload from "../../../../../util/ImageUpload";
export default {
  name: "BranchSetting",
  components: { ImageUpload },
  data() {
    return {
      setting: null,
      logoAttributes: {
        width: 100,
        height: 100,
        uploadBtnText: "上传LOGO",
        maxSize: 200 * 1024,
        isContain: true
      },
      limit: 20,
      offset: 0,
      page: 1,
      setList: false,
      list: [],
      memberList: [],
      options: [],
      whiteList: [],
      searchContent: ""
    };
  },
  directives: {
    loadmore: {
      inserted: function(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );

        SELECTWRAP_DOM.addEventListener("scroll", function() {
          const CONDITION =
            this.scrollHeight - this.scrollTop <= this.clientHeight;

          if (CONDITION) {
            //触底时触发指令传入的函数
            binding.value();
          }
        });
      }
    }
  },
  watch: {
    setList(val) {
      if (val) {
        this.page = 1;
        this.list = [];
        this.memberList = [];
        this.options = [];
        this.whiteList = [];
        this.getList();
        this.getMemberList();
      }
    }
  },
  methods: {
    saveSetting() {
      let setting = { ...this.setting };
      this.$request
        .post("/api/admin/settings/manage/branchSetting", setting)
        .then(() => {
          this.$message.success("分会设置已更新");
        });
    },
    getSetting() {
      this.$request
        .get("/api/common/setting/anon/getCommonSetting", {
          params: { type: 0 }
        })
        .then(res => {
          this.setting = res.data;
        });
    },
    getMemberList(ifClear) {
      this.$request
        .get("/api/admin/branch/whiteMemberList", {
          params: {
            isWhiteList: false,
            searchContent: this.searchContent,
            limit: this.limit,
            offset: this.limit * (this.page - 1),
            isPage: true
          }
        })
        .then(res => {
          // console.log(res);
          if (ifClear) {
            this.memberList = [];
          }
          for (const item of res.data.page.list) {
            this.memberList.push({
              id: item.id,
              name: item.name
            });
          }
          this.options = JSON.parse(JSON.stringify(this.memberList));
          this.options.unshift(...this.whiteList);
        });
    },
    getList() {
      this.list = [];
      this.$request
        .get("/api/admin/branch/whiteMemberList?isWhiteList=true")
        .then(res => {
          // console.log(res);
          for (const item of res.data.members) {
            this.list.push(item.id);
            this.whiteList.push({
              id: item.id,
              name: item.name
            });
          }
          this.options.unshift(...this.whiteList);
        });
    },
    setWhiteList() {
      this.$request
        .put("/api/admin/branch/updateMemberWhiteList", {
          ids: this.list
        })
        .then(res => {
          this.setList = false;
        });
    },
    touchBottom() {
      this.page++;
      this.getMemberList(false);
    },
    search(str) {
      document.querySelector(".el-select-dropdown .el-select-dropdown__wrap").scrollTop=0;
      if (!str) {
        this.page = 1;
        this.searchContent = "";
        this.getMemberList(true);
      } else {
        this.loading = true;
        setTimeout(() => {
          this.$nextTick(()=>{ this.loading = false; })
          this.page = 1;
          this.searchContent = str;
          this.getMemberList(true);
        }, 200);
      }
    }
  },
  created() {
    this.getSetting();
  }
};
</script>
