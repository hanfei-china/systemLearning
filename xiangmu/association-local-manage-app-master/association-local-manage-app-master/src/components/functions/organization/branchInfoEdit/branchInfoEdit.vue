<template>
  <div class="branchInfoEdit">
    <div class="branchInfoEdit-header">
      <el-upload :action="action" :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" accept="image/png,image/jpeg,image/gif,image/jpg" class="posirela">
        <img v-if="branchInfo.logo" :src="branchInfo.logo" alt />
        <img v-else src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="">
        <span class="upicon"><img src="../branchEditView/icon/album.png" alt=""></span>
      </el-upload>
      <div class="branchInfoEdit-header__showInfo">
        <div class="branchInfoEdit-header__showInfo__one">{{branchInfo.name}}</div>
        <span class="branchInfoEdit-header__showInfo__two">{{branchInfo.branchClassName}}</span>
      </div>
    </div>
    <div class="branchInfoEdit-Info">
      <div class="branchInfoEdit-InfoHeader">基本信息</div>
      <div class="branchInfoEdit-InfoList">
        <ul>
          <li>
            <div style="color:rgb(153, 153, 153);marginBottom:10px;">分会名称：</div>
            <div>{{branchInfo.name}}</div>
          </li>
          <li>
            <div style="color:rgb(153, 153, 153);marginBottom:10px;">分会所在地：</div>
            <div style="display:flex;alignItems:center;">
              <div
                  v-if="!isEdit.address&&branchInfo.address&&branchInfo.address.length===4"
              >{{branchInfo.address[0]}}-{{branchInfo.address[1]}}-{{branchInfo.address[2]}}-{{branchInfo.address[3]}}</div>
              <div
                  v-if="!isEdit.address&&branchInfo.address&&branchInfo.address.length===3"
              >{{branchInfo.address[0]}}-{{branchInfo.address[1]}}-{{branchInfo.address[2]}}</div>
              <div
                v-if="!isEdit.address&&branchInfo.address&&branchInfo.address.length===2"
              >{{branchInfo.address[0]}}-{{branchInfo.address[1]}}</div>
              <div
                v-if="!isEdit.address&&branchInfo.address&&branchInfo.address.length===1"
              >{{branchInfo.address[0]}}</div>
              <div v-else></div>
              <div
                v-if="!isEdit.address"
                class="el-icon-edit"
                style="fontSize:16px;color:#ccc;marginLeft:10px;cursor:pointer;"
                @click="editClick('address')"
              ></div>
              <div v-if="isEdit.address">
                <el-cascader
                  v-model="editBranchInfo.address"
                  placeholder="请选择所在地"
                  separator="-"
                  :props="lazyAreas"
                  size="small"
                  style="width:180px;marginRight:10px;"
                  clearable
                ></el-cascader>
                <el-button type="text" size="mini" style="color:red;" @click="cancleClick('address')">取消</el-button>
                <el-button type="text" size="mini" style="color:#3fa1b6;" @click="sureClick('address')">确认</el-button>
              </div>
            </div>
          </li>
          <li>
            <div style="color:rgb(153, 153, 153);marginBottom:10px;">联系人：</div>
            <div v-if="!isEdit.contactPerson" style="display:flex;alignItems:center;">
              <div>{{branchInfo.contactPerson}}</div>
              <div
                v-if="!isEdit.contactPerson"
                class="el-icon-edit"
                style="fontSize:16px;color:#ccc;marginLeft:10px;cursor:pointer;"
                @click="editClick('contactPerson')"
              ></div>
            </div>
            <div v-if="isEdit.contactPerson">
                <el-input v-model="editBranchInfo.contactPerson" placeholder="请输入联系人" size="small" style="width:180px;marginRight:10px;"></el-input>
                <el-button type="text" size="mini" style="color:red;" @click="cancleClick('contactPerson')">取消</el-button>
                <el-button type="text" size="mini" style="color:#3fa1b6;" @click="sureClick('contactPerson')">确认</el-button>
            </div>
          </li>
          <li>
            <div style="color:rgb(153, 153, 153);marginBottom:10px;">联系方式：</div>
            <div style="display:flex;alignItems:center;" v-if="!isEdit.contactPhone">
              <div>{{branchInfo.contactPhone}}</div>
              <div
                class="el-icon-edit"
                style="fontSize:16px;color:#ccc;marginLeft:10px;cursor:pointer;"
                @click="editClick('contactPhone')"
              ></div>
            </div>
            <div v-if="isEdit.contactPhone">
                <el-input v-model="editBranchInfo.contactPhone" placeholder="请输入联系人" size="small" style="width:180px;marginRight:10px;"></el-input>
                <el-button type="text" size="mini" style="color:red;" @click="cancleClick('contactPhone')">取消</el-button>
                <el-button type="text" size="mini" style="color:#3fa1b6;" @click="sureClick('contactPhone')">确认</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="branchInfoEdit-Info">
      <div class="branchInfoEdit-InfoHeader">
          <div>分会简介</div>
          <div v-if="!isEdit.introduce" @click="editClick('introduce')" style="fontSize:14px;cursor:pointer;">编辑<span class="el-icon-edit"></span></div>
          <div v-else>
                <el-button type="text" size="mini" style="color:red;" @click="cancleClick('introduce')">取消</el-button>
                <el-button type="text" size="mini" style="color:#3fa1b6;" @click="sureClick('introduce')">确认</el-button>
          </div>
      </div>
      <div class="branchInfoEdit-InfoList">
        <div v-if="!isEdit.introduce" class="branchInfoEdit-InfoList__discription">{{branchInfo.introduce}}</div>
        <el-input v-else v-model="editBranchInfo.introduce" size="small" style="maxWidth:1000px;" resize="none" type="textarea" :rows="16" placeholder="请输入分会简介"></el-input>
      </div>
    </div>
    <div class="branchInfoEdit-Info">
      <div class="branchInfoEdit-InfoHeader">
          <div>分会宣传文案</div>
          <div v-if="!isEdit.content" @click="editClick('content')" style="fontSize:14px;cursor:pointer;">编辑<span class="el-icon-edit"></span></div>
          <div v-else>
                <el-button type="text" size="mini" style="color:red;" @click="cancleClick('content')">取消</el-button>
                <el-button type="text" size="mini" style="color:#3fa1b6;" @click="sureClick('content')">确认</el-button>
          </div>
      </div>
      <div class="branchInfoEdit-InfoList">
        <div v-if="!isEdit.content" class="branchInfoEdit-InfoList__discription" v-html="branchInfo.content"></div>
        <editor v-else style="maxWidth:1000px;" v-model="editBranchInfo.content" ref="editor"></editor>
      </div>
    </div>
  </div>
</template>

<script>
import editor from '../../../util/editor/Editor'
import cities from "../branchManage/util/city";
import {requestBaseUrl} from '@/js/config/serviceConfig';
export default {
  name: "branchInfoEdit",
  components:{editor},
  data() {
    return {
      action: requestBaseUrl + '/api/common/anon/uploadFile',//图片上传地址
      branchInfo: {},
      isEdit:{
          address: false,
          contactPerson:false,
          contactPhone:false,
          introduce:false,
          content:false
      },
      editBranchInfo: {
        address: [],
        contactPerson:'',
        contactPhone:'',
        introduce:'',
        content:''
      },
      cities:[],
      timer:null
    };
  },
  computed: {
    lazyAreas() {
      return{
        checkStrictly: this.checkStrictly,
        lazy: true,
        lazyLoad: this.lazyLoad,
      }
    },
  },
  created() {
    this.getBranchInfo();
    this.cities=cities;
  },
  methods: {
    lazyLoad(node, resolve) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getArea(node, resolve)
      },500)
    },
    getArea(node, resolve) {
      let params = {};
      if(node.level === 0){
        params.level = 0
      }else{
        params.parentId = node.data.parentId
      }
      this.$request.get('/api/common/anon/worldArea',{
        params:params
      }).then(res => {
        if(res.success){
          const nodes = res.data.map(item => ({
            value: item.name,
            label: item.name,
            parentId:item.id,
            leaf: node.level >= 2
          }))
          resolve(nodes)
        }

      })
    },
    beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!');
        return false
      }
    },
    handleAvatarSuccess(res, file) {
      this.branchInfo.logo = file.response.data;
      this.branchInfo.address=JSON.stringify(this.branchInfo.address);
      this.$request.put('/api/admin/branch/updateBranchInfo',this.branchInfo).then(res=>{
        if (res.success) {
          this.getBranchInfo();
        }
      })
    },
    getBranchInfo() {
      Promise.all([
        this.$request.post("/api/admin/branch/getBranchInfo"),
        this.$request.get("/api/common/branch/branchListAndBranchType")
      ]).then(([branchInfo, branchType]) => {
        // console.log(branchInfo);
        // console.log(branchType);
        if (branchInfo.success) {
          this.branchInfo = JSON.parse(JSON.stringify(branchInfo.data));
          if (this.branchInfo.address) {
            this.branchInfo.address = JSON.parse(this.branchInfo.address);
          }
        }
        if (branchType.success) {
          this.branchType = JSON.parse(JSON.stringify(branchType.data));
        }
        this.branchType.forEach(item => {
          if (this.branchInfo.branchType === item.seq) {
            this.branchInfo.branchTypeName = item.name;
          }
        });
      });
    },
    //点击编辑按钮
    editClick(item){
        this.isEdit[item]=true;
        this.editBranchInfo[item]=this.branchInfo[item];
    },
    //点击取消按钮
    cancleClick(item){
        this.isEdit[item]=false;
        this.editBranchInfo[item]=null;
    },
    //点击确认按钮
    sureClick(item){
        if (item==='contactPhone') {
            var reg=/^1[3456789]\d{9}$/;
            if (!reg.test(this.editBranchInfo[item])) {
                this.$message({
                    message: '手机号码的格式不正确',
                    type: 'warning'
                });
               return
            }
        }
        this.branchInfo[item]=this.editBranchInfo[item];
        this.branchInfo.address=JSON.stringify(this.branchInfo.address);
        this.isEdit[item]=false;
        this.$request.put('/api/admin/branch/updateBranchInfo',this.branchInfo).then(res=>{
            // console.log(res);
            if (res.success) {
                this.getBranchInfo();
            }
        })
    }
  }
};
</script>

<style lang="less" scoped>
.branchInfoEdit {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 50px;
  font-size: 14px;
  overflow-y: auto;
  .branchInfoEdit-header {
    display: flex;
    padding: 30px 0;
    .posirela{
      position: relative;
      margin-right: 30px;
      flex-shrink: 0;
      cursor: pointer;
      .upicon{
        width: 31px;
        height: 31px;
        border-radius: 50%;
        position: absolute;
        right: 0;
        bottom: 0;
        background: rgb(242, 242, 242);
        text-align: center;
        padding-top: 7px;
        box-sizing: border-box;
        img{
          width: 18px;
          height: 16px;
          border-radius: 0;
        }
      }
    }
    img {
      height: 92px;
      width: 92px;
      border-radius: 50%;
    }
    .branchInfoEdit-header__showInfo {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      .branchInfoEdit-header__showInfo__one {
        color: rgb(12, 25, 44);
        font-size: 20px;
        font-weight: 700;
      }
      .branchInfoEdit-header__showInfo__two {
        margin-top: 15px;
        color: #fff;
        font-size: 12px;
        line-height: 12px;
        background-color: #3fa1b6;
        padding: 6px 25px;
        border-radius: 18px;
      }
    }
  }
  .branchInfoEdit-Info {
    margin-bottom: 40px;
    .branchInfoEdit-InfoHeader {
      color: #3fa1b6;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      max-width: 1000px;
    }
    .branchInfoEdit-InfoList {
      ul {
        display: flex;
        li {
          // flex:1;
          width: 300px;
          display: flex;
          flex-direction: column;
        }
      }
      .branchInfoEdit-InfoList__discription {
        box-sizing: border-box;
        border-radius: 4px;
        border: 1px solid rgb(228, 228, 228);
        padding: 15px;
        max-width: 1000px;
        min-height: 400px;
      }
    }
  }
}
</style>
