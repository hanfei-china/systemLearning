<template>
  <el-container>
    <el-main class="unset-padding">
      <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px">
        <el-form-item label="相册名称：" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入相册名称" />
        </el-form-item>
        <el-form-item label="相册主题：" prop="categoryId">
          <group-tree v-model="ruleForm.categoryId" :editable="chosenGroup.otherType !== 0" :only-save-activity="chosenGroup.otherType === 0" :disabled-nodes="disabledNodes" :is-multiple="false" group-type="2"
            placeholder="请选择相册主题" :clearable="true" />
        </el-form-item>
        <el-form-item label="相册封面：" prop="coverUrl">
          <div class="flex">
            <div class="imageWrap">
              <el-image v-if="ruleForm.coverUrl" fit="cover" style="width: 100%;height: 100%;" :src="ruleForm.coverUrl" />
            </div>
            <div class="flex flex-column flex-end">
              <div style="color: red;font-size: 12px;">
                上传封面大小限制在2M以内
              </div>
              <el-upload :action="action" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <el-button type="primary" size="small">点击上传</el-button>
              </el-upload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="相册描述：" prop="descriptions">
          <el-input type="textarea" :rows="5" resize="none" v-model="ruleForm.descriptions" />
        </el-form-item>
        <el-form-item label="小程序端访问权限设置：" prop="rightType">
          <el-select v-model="ruleForm.rightType" placeholder="请选择" style="width:100%;">
            <el-option label="对所有人公开" :value="0"></el-option>
            <el-option label="凭密码即可访问" :value="1"></el-option>
            <el-option label="符合条件者即可访问" :value="2"></el-option>
            <el-option label="符合条件者凭密码访问" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访问密码：" prop="password" v-if="ruleForm.rightType==1||ruleForm.rightType==3">
          <el-input v-model="ruleForm.password" placeholder="请输入访问密码" />
        </el-form-item>
        <el-form-item label="访问者条件：" prop="conditions" v-if="ruleForm.rightType==2||ruleForm.rightType==3">
          <div v-for="(item,index) in ruleForm.conditions" :key="index" class="conditionrow">
            <el-select v-model="ruleForm.conditions[index].field" placeholder="请选择">
              <el-option :disabled="choosedConditionField.includes(item.value)" v-for="item in conditionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span>等于</span>
            <el-input v-model="ruleForm.conditions[index].value" placeholder="请输入"></el-input>
            <div class="operatebox">
              <i @click="addCondition(index)" v-if="index==ruleForm.conditions.length-1" class="el-icon-circle-plus-outline"></i>
              <i @click="deleteCondition(index)" v-if="ruleForm.conditions.length>1" class="el-icon-remove-outline"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="其他设置：">
          <div style="padding: 8px 16px;background-color: #f2f2f2;border-radius: 4px;">
            <el-checkbox v-model="ruleForm.inUsed">启用相册</el-checkbox>
            <el-checkbox v-model="ruleForm.allowUpload">允许校友上传照片到相册</el-checkbox>
            <el-checkbox :disabled="!ruleForm.allowUpload" v-model="ruleForm.verify">校友上传照片需要审核</el-checkbox>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="flex flex-center flex-column unset-padding" height="auto" style="padding-top: 16px !important;">
      <div class="flex flex-end">
        <el-button size="small" icon="el-icon-error" type="danger" @click="$emit('close')">取消返回</el-button>
        <el-button size="small" icon="el-icon-success" type="primary" @click="saveAlbum">确 定</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import { requestBaseUrl } from "../../../../../../js/config/serviceConfig";
import GroupTree from "../../../../util/group/GroupTree";

export default {
  name: "AlbumForm",
  components: { GroupTree },
  props: {
    albumId: String,
    defaultGroupId: String,
    chosenGroup: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed:{
    choosedConditionField(){
      var choosedCondition = this.ruleForm.conditions.filter(item=>item.field)
      var choosedConditionField = choosedCondition.map(item=>item.field)
      return choosedConditionField
    }
  },
  data() {
    return {
      action: requestBaseUrl + "/api/common/anon/uploadFile", //图片上传地址
      conditionList:[
        {value:"college",label:"学院"},
        {value:"major",label:"专业"},
        {value:"cless",label:"班级"},
        {value:"entranceDate",label:"入学年"},
        {value:"graduationDate",label:"毕业年"}
      ],
      ruleForm: {
        title: "",
        categoryId: this.defaultGroupId&&this.defaultGroupId!=0?[this.defaultGroupId]:[],
        coverUrl: "",
        descriptions: "",
        rightType: 0,
        password:"",
        conditions: [{field:"",value:""}],
        allowUpload: true, //允许会员上传照片到相册
        inUsed: true, //是否启用
        verify: false, //会员上传的照片是否需要审核
      },
      rules: {
        title: [ { required: true, message: "请输入相册名称", trigger: "blur" } ],
        categoryId: [ { required: true, message: "请选择相册主题", trigger: "change" } ],
        coverUrl: [ { required: true,message: "请上传相册封面",trigger: "change"} ],
        rightType: [ { required: true,message: "请选择访问权限",trigger: "change"} ],
        password: [ { required: true, message: "请输入访问密码", trigger: "blur" } ],
        conditions: [ { required: true, message: "请添加访问者条件", trigger: "change",validator:(rule, value, callback) => {
          if (!value[this.ruleForm.conditions.length-1].field||!value[this.ruleForm.conditions.length-1].value) {
            callback(new Error('请添加访问者条件'));
          } else { callback() }
        } }]
      },
    };
  },
  created() {
    if (this.albumId) {
      this.getAlbumInfo();
    }
  },
  methods: {
    addCondition(index){
      if(!this.ruleForm.conditions[index].field||!this.ruleForm.conditions[index].value){
        this.$message.warning("请先补全条件")
        return
      }
      this.ruleForm.conditions.push({field:"",value:""})
    },
    deleteCondition(index){
      if(this.ruleForm.conditions.length>1){
        this.ruleForm.conditions.splice(index,1)
      }
    },
    //获取相册详情
    getAlbumInfo() {
      this.$request.get("/api/admin/photoAlbum/manage/getPhotoAlbumDetailById", { params: { id: this.albumId } }).then((res) => {
        if (res.success) {
          this.ruleForm.title = res.data.title;
          this.ruleForm.categoryId = [res.data.categoryId];
          this.ruleForm.coverUrl = res.data.coverUrl;
          this.ruleForm.descriptions = res.data.descriptions;
          this.ruleForm.rightType = res.data.rightType;
          this.ruleForm.password = res.data.password;
          this.ruleForm.conditions = res.data.conditions?JSON.parse(res.data.conditions):[{field:"",value:""}];
          this.ruleForm.inUsed = res.data.inUsed;
          this.ruleForm.verify = JSON.parse(res.data.setting).verify;
          this.ruleForm.allowUpload = JSON.parse(res.data.setting).allowUpload;
        }
      });
    },
    //上传图片
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.coverUrl = file.response.data;
    },
    //保存
    saveAlbum() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          var obj = JSON.parse(JSON.stringify(this.ruleForm))
          obj.categoryId = obj.categoryId[0]
          obj.conditions = JSON.stringify(obj.conditions)
          if (this.albumId) {
            obj.photoAlbumId = this.albumId
            this.$request.put("/api/admin/photoAlbum/manage/updatePhotoAlbum", obj).then((res) => {
              if (res.success) {
                this.$message.success("编辑成功");
                this.$emit("close");
                this.$emit("refresh");
              }
            });
          } else {
            this.$request.post("/api/admin/photoAlbum/manage/addPhotoAlbum", obj).then((res) => {
              if (res.success) {
                this.$message.success("创建成功");
                this.$emit("close");
                this.$emit("refresh");
              }
            });
          }
        }
      });
    },
    //分组
    disabledNodes(nodes) {
      this.filterNodes(nodes, this.id, false);
    },
    filterNodes(nodes, deleteId, disabled) {
      for (let node of nodes) {
        let { children, id, personsNum } = node;
        if (disabled) {
          node.disabled = true;
        } else {
          if (deleteId === id || personsNum > 0) {
            node.disabled = true;
            this.filterNodes(children, deleteId, true);
          } else {
            this.filterNodes(children, deleteId, false);
          }
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.imageWrap {
  width: 259px;
  height: 148px;
  border-radius: 2px;
  background-color: #888888;
  margin-right: 10px;
}
.conditionrow{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  span{
    flex-shrink: 0;
    margin: 0 20px;
  }
  .operatebox{
    width: 68px;
    flex-shrink: 0;
  }
  i{
    cursor: pointer;
    margin-left: 20px;
  }
}
</style>
