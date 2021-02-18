<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-aside class="border-right position-relative" style="width: 400px;">
      <div class="memberListContainer">
        <!-- 顶部搜索模块 -->
        <div class="memberListSearch">
          <div class="memberListSearchTerm">
            <el-input class="memberList-SearchInput" placeholder="搜索姓名/手机号" prefix-icon="el-icon-search" v-model="searchContent" size="small" clearable></el-input>
          </div>
        </div>
        <!-- 顶部操作模块 -->
        <div class="memberListTop">
          <div class="itemCheckIf" style="paddingLeft:20px;cursor:pointer;marginRight:20px;" @click.stop="selectAllClick">
            <div class="itemSelect" v-if="!selectAllIf"></div>
            <div v-else class="itemCancleSelect"><img src="./image/select.png" alt /></div>
            <div>全选</div>
          </div>
          <div style="paddingRight:10px;">
            <el-button @click="examinePictures(1,idList)" class="memberListTopTwo">通过</el-button>
            <el-button @click="clickNoPass(userIds,idList)" class="memberListTopTwo" style="marginLeft:0;">不通过</el-button>
          </div>
        </div>
        <!-- 中部待办会员申请 -->
        <ul class="memberListItems">
          <li v-for="(item,index) in list" :key="item.id" class="memberListItem" :class="{'leftSeletOne':curentIndex===index}">
            <div class="itemCheckIf">
              <div class="itemSelect" v-if="!item.checked" @click.stop="checkItem(item)"></div>
              <div @click.stop="item.checked=false;selectAllIf=false" v-else class="itemCancleSelect"><img src="./image/select.png" alt /></div>
            </div>
            <!-- 信息展示 -->
            <div class="itemShowInfo" @click="leftSelectItem = item;curentIndex=index">
              <div class="itemShowInfoTop">
                <img :src="item.headImg" />
                <div class="itemShowInfoTop-right">
                  <div class="itemShowInfoTop-right__top">
                    <div style="display:flex;alignItems:center;">
                      <div style="fontSize:14px;color:#222222;marginRight:10px;fontWeight:700;">{{item.name}}</div>
                    </div>
                    <div>{{item.createTime | friendlyTime}}</div>
                  </div>
                </div>
              </div>
              <div class="itemShowInfoMid">
                <div class="imgall">
                  <div class="imgbox" v-for="(it,idx) in item.photoList" :key="idx" v-if="idx<4">
                    <img v-if="it.fileType==1" :src="it.photoUrl" alt="">
                    <img v-if="it.fileType==2" src="./image/videoPlay.png" alt="">
                    <span class="imgcount" v-if="idx==3&&item.photoList.length>4">+{{item.photoList.length-4}}</span>
                  </div>
                </div>
                <div class="albumname">相册名称：{{item.title}}</div>
              </div>
              <div style="marginTop:7px;">
                <el-button size="mini" @click.stop="examinePictures(1,item.photoList.map(item=>item.id))" class="plainBtnClass">通过</el-button>
                <el-button size="mini" class="plainBtnClass" @click.stop="clickNoPass([item.createUser],item.photoList.map(item=>item.id))">不通过</el-button>
              </div>
            </div>
          </li>
        </ul>
        <!-- 底部分页功能 -->
        <div class="memberListBottom">
          <el-pagination style="width:80%" :pager-count="5" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </el-aside>
    <el-main class="position-relative unset-padding" v-if="leftSelectItem">
      <el-container class="absolute-fill-parent album-wrap album-examine-wrap">
        <el-header height="158px">
          <div class="elhead">
            <h5>校友申请上传的照片</h5>
          </div>
          <div class="userbox">
            <img class="userhead" :src="leftSelectItem.headImg" alt="">
            <div class="userinfo">
              <div><span v-if="leftSelectItem.weChatContent">{{JSON.parse(leftSelectItem.weChatContent).nickName}}</span><span v-if="leftSelectItem.name">（{{leftSelectItem.name}}）</span></div>
              <p>申请时间：{{leftSelectItem.createTime|yyyyMMdd}}</p>
            </div>
          </div>
        </el-header>
        <el-main class="tableWrap">
          <vue-scroll>
            <div class="picture-table-wrap">
              <div class="innerhead">
                <div class="uploadalbumname">上传到相册：{{leftSelectItem.title}}</div>
                <div class="uploadcount">上传照片合计：共上传<span>{{leftSelectItem.photoList.length}}</span>张 通过<span>{{passLen}}</span>张 不通过<span>{{noPassLen}}</span>张</div>
              </div>
              <div class="describe"><span style="fontWeight:700;">描述: </span>{{leftSelectItem.photoList[0].photoDescribe}}</div>
              <div class="innerhead">
                <div class="uploadalbumname">待处理</div>
              </div>
              <div class="picture-table-inner flex flex-wrap">
                <div class="picWrap" v-for="item in todoList" :key="item.id">
                  <el-image v-if="item.fileType==1" fit="cover" style="width: 100%; height: 100%" :src="item.photoUrl" :preview-src-list="[item.photoUrl]"></el-image>
                  <img v-if="item.fileType==2" @click="playVideo(item.photoUrl)" src="./image/videoPlay.png" style="width:100%;height:100%;">
                  <el-button size="mini" @click="examinePictures(1,[item.id])" class="primaryBtnClass passbtn">通过</el-button>
                  <el-button size="mini" @click="clickNoPass([item.createUser],[item.id])" class="plainBtnClass nopassbtn">不通过</el-button>
                </div>
              </div>

              <div class="innerhead" style="margin-top:20px;"><div class="uploadalbumname">已处理</div></div>
              <div class="picture-table-inner flex flex-wrap" style="padding-bottom:20px;">
                <div class="picWrap" v-for="item in processedList" :key="item.id">
                  <el-image v-if="item.fileType==1" fit="cover" style="width: 100%; height: 100%" :src="item.photoUrl" :preview-src-list="[item.photoUrl]"></el-image>
                  <img v-if="item.fileType==2" @click="playVideo(item.photoUrl)" src="./image/videoPlay.png" alt="">
                  <img class="passstatus" v-if="item.state==2" src="./image/nopass.png" alt="">
                  <img class="passstatus" v-if="item.state==1" src="./image/pass.png" alt="">
                </div>
              </div>
            </div>
          </vue-scroll>
        </el-main>
      </el-container>
    </el-main>
    <el-dialog title="驳回意见" :visible.sync="rejectVisible" width="600px" append-to-body :close-on-click-modal="false" class="collegedia">
      <el-form label-width="100px">
        <el-form-item label="驳回意见" size="small">
          <el-input type="textarea" v-model="reason" :autosize="{ minRows: 3, maxRows:6 }" placeholder="请输入驳回意见"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="el-icon-error" type="danger" size="small" @click="rejectVisible = false">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="examinePictures(2,applyIds)">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="视频播放" :visible.sync="videoVisible" width="600px" append-to-body :close-on-click-modal="false" class="collegedia">
      <div style="width:100%;height:600px;display:flex;alignItems:center;justifyContent: center;">
        <video :src="videoUrl" controls="controls" preload="preload" width="500px" height="400px" style="border:3px solid #222;"></video>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: "PictureExamine",
  data() {
    return {
      leftSelectItem: null, //左边选中的唯一的那个待办项
      curentIndex:0,
      searchContent: "", //搜索内容
      page: {
        currentPage: 1,
        pageSize: 3,
        total: 0,
      },
      list: [], //照片列表
      selectAllIf: false,
      loading: true,
      rejectVisible:false,
      applyIds:[],
      selectUserIds:[],
      reason:'',
      videoVisible:false,
      videoUrl:''
    };
  },
  computed:{
    // 0是正在审核1 是 通过 2 是不通过
    todoList(){
      if(this.leftSelectItem){
        return this.leftSelectItem.photoList.filter(item=>item.state==0)
      }else{return []}
    },
    processedList(){
      if(this.leftSelectItem){
        return this.leftSelectItem.photoList.filter(item=>item.state!=0)
      }else{return []}
    },
    passLen(){
      if(this.leftSelectItem){
        return (this.leftSelectItem.photoList.filter(item=>item.state==1)).length
      }else{return 0}
    },
    noPassLen(){
      if(this.leftSelectItem){
        return (this.leftSelectItem.photoList.filter(item=>item.state==2)).length
      }else{return 0}
    },
    checkedList(){
      return this.list.filter(item=>item.checked)
    },
    idList(){
      if(this.checkedList.length){
        var list = []
        for (const item of this.checkedList) {
          list = list.concat(item.photoList)
        }
        return list.map(item=>item.id)
      }else{return []}
    },
    userIds(){
      var arr=[];
      this.list.forEach(item=>{
        if (item.checked) {
          arr.push(item.createUser);
        }
      });
      let set=new Set(arr);
      return Array.from(set);
    }
  },
  created() {
    this.getList();
  },
  watch: {
    searchContent() {
      this.getList();
    },
  },
  methods: {
    playVideo(url){
      this.videoVisible=true;
      this.videoUrl=url;
    },
    checkItem(item){
      item.checked=true;
      if(this.list.every(item=>item.checked)){
        this.selectAllIf = true
      }
    },
    //全选或全不选
    selectAllClick() {
      this.selectAllIf = !this.selectAllIf;
      if (this.selectAllIf) {
        this.list.map((item) => { item.checked = true });
      } else {
        this.list.map((item) => { item.checked = false });
      }
    },
    //获取照片审批列表
    getList() {
      this.list = [];
      this.selectAllIf = false;
      this.loading = true;
      this.$request.post("/api/admin/photoAlbum/manage/getPhotoApplyPage", {
        searchContent: this.searchContent,
        limit: this.page.pageSize,
        offset: this.page.pageSize * (this.page.currentPage - 1),
      }).then((res) => {
        if (res.success) {
          var list = res.data.list;
          list.map((item) => { this.$set(item, "checked", false); });
          this.list = list;
          this.page.total = res.data.total;
          if(this.list.length>0){
            // 暂且通过创建时间作为唯一值
            if( this.leftSelectItem&&this.list[this.curentIndex]&&(this.leftSelectItem.createTime==this.list[this.curentIndex].createTime) ){
              this.leftSelectItem=this.list[this.curentIndex]
            }else{
              this.leftSelectItem=this.list[0]
              this.curentIndex = 0
            }
          }else{
            this.leftSelectItem = null
          }
        }
        this.$nextTick(()=>{ this.loading = false; })
      });
    },
    clickNoPass(userIds,applyIds){
      this.applyIds=applyIds;
      this.selectUserIds=userIds;
      this.rejectVisible=true;
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    //审核通过/不通过
    examinePictures(state,idList) {
      if(idList.length==0){
        this.$message({ message: "请先勾选要操作的申请项", type: "warning" });
        return false;
      }
      var params={
        state: state,
        photoIds: idList?idList:this.idList,
      };
      if (state==2) {
        params.userIds=this.selectUserIds;
        params.reason=this.reason;
      }
      this.$request.put("/api/admin/photoAlbum/manage/dealPhotoApply", params).then((res) => {
        if (res.success) {
          this.$message.success("审批完成");
          this.getList();
          this.rejectVisible=false;
          this.reason='';
        }
      });
    },
  },
};
</script>


<style lang="less" scoped>
// @import "../../../../../css/common.less";
.memberListContainer {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  position: relative;
  height: 100%;
  .memberListTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    background-color: #fff;
    width: 100%;
    border-bottom: 1px solid #e8e8e8;
    .memberListTopTwo {
      border: 1px solid #3fa1b6;
      color: #3fa1b6;
      font-size: 14px;
      margin-right: 10px;
      padding: 9px 16px;
    }
  }
  .memberListSearch {
    padding: 10px 15px;
    border-bottom: 1px solid #e6e6e6;
    .memberListSearchTerm {
      display: flex;
      .memberList-SearchInput {
        width: 100%;
      }
      .memberList-SearchSelect {
        width: 45%;
      }
    }
    .memberListSearchShow {
      display: flex;
      margin-top: 10px;
      align-items: center;
      .searchItem {
        padding: 5px 10px;
        border: 1px dashed rgb(0, 102, 255);
        color: rgb(0, 102, 255);
      }
    }
  }
  .memberListItems {
    flex: 1;
    padding-bottom: 70px;
    overflow-y: auto;
    .memberListItem {
      border-bottom: 1px solid #e8e8e8;
      &:hover {
        background-color: #f9f9f9;
      }
      display: flex;
      padding: 20px;
      box-sizing: border-box;
      // margin-bottom: 10px;
      .itemShowInfo {
        flex: 1;
        .itemShowInfoTop {
          display: flex;
          font-size: 13px;
          color: #888888;
          align-items: center;
          img {
            width: 42px;
            height: 42px;
            margin-right: 8px;
            border-radius: 50%;
          }
          .itemShowInfoTop-right {
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
            .itemShowInfoTop-right__top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 7px;
            }
          }
        }
        .itemShowInfoMid {
          margin-top: 18px;
          background: #F9F9F9;
          padding: 8px;
          .imgall{
            display: flex;
          }
          .imgbox{
            width: 70px;
            height: 56px;
            margin-left: 15px;
            position: relative;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .imgcount{
              position: absolute;
              right: -8px;
              top: -8px;
              background: #222222;
              border-radius: 2px;
              opacity: 0.79;
              color: white;
              padding: 0 5px;
              line-height: 18px;
            }
          }
          .imgbox:first-child{
            margin-left: 0;
          }
          .albumname{
            font-size: 14px;
            color: #222222;
            line-height: 20px;
            margin-top: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

      }
    }
  }
  .memberListBottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #f9f9f9;
  }
}
.leftSeletOne {
  background-color: #f9f9f9;
  position: relative;
}
.itemCheckIf {
  display: flex;
  align-items: center;
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


.elhead {
  display: flex;
  align-items: center;
  height: 50px;
  h5 {
    font-size: 14px;
    color: #222222;
    padding-left: 11px;
    line-height: 16px;
    height: 16px;
    border-left: 3px solid #28394b;
  }
}
.userbox {
  display: flex;
  height: 107px;
  align-items: center;
  border-bottom: 1px dashed #e6e6e6;
  .userhead {
    width: 76px;
    height: 76px;
    border-radius: 50%;
  }
  .userinfo {
    margin-left: 22px;
    div {
      font-size: 14px;
      color: #222222;
      line-height: 30px;
    }
    p {
      font-size: 12px;
      color: #888888;
      line-height: 28px;
    }
  }
}

.tableWrap {
  box-sizing: border-box;
  padding: 0 0;
  .picture-table-wrap {
    // width: 100%;
    overflow-x: hidden;
    padding: 0 20px;
    .innerhead {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      div {
        font-size: 14px;
        color: #222222;
        line-height: 20px;
      }
      .uploadcount{
        word-spacing: 5px;
        span{
          color: #F55858;
          margin: 0 5px;
        }
      }
    }
    .picture-table-inner {
      width: calc(100% + 15px);
      .picWrap {
        width: 190px;
        height: 140px;
        margin: 18px 16px 0 0;
        overflow: hidden;
        position: relative;
        button {
          position: absolute;
          top: 104px;
        }
        .passbtn {
          left: 30px;
        }
        .nopassbtn {
          left: 96px;
        }
        .passstatus {
          width: 56px;
          height: 56px;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
  }
}

/deep/.el-image-viewer__close {
  color: white;
}
.describe{
  padding: 10px 0;
  background-color: #f9f9f9;
  color: #222;
  margin-top: 10px;
}
</style>
