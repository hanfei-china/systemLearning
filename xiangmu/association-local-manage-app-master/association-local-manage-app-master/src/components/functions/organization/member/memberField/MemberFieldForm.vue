<template>
  <el-container>
    <el-main class="unset-padding position-relative">
      <el-form v-if="data" size="small" label-width="100px">
        <el-form-item label="字段名称：">
          <el-input placeholder="字段名称，20字以内" v-model="data.name" :maxlength="20"></el-input>
          <!--单选项/多选项在此增加项目-->
          <div class="field-option-group"
            v-if="(topicType===2 || topicType===3)&&!data.parentId"
            style="max-height: 200px;overflow-y: scroll;margin-top: 10px;"
          >
            <div
              class="field-option flex"
              v-for="(option,index) in data.parameter.options"
              :key="index"
            >
              <div class="field-option-key">{{option.optionType === 0 ? `选项${index+1}：` : '其它项：'}}</div>
              <div class="field-option-value">
                <el-input v-model="option.title"></el-input>
              </div>
              <!-- <div class="field-option-value" style="margin-left: 16px;">
                <branch-choose-2 v-model="option.branchId" :list="branchList" />
              </div> -->
              <div class="field-option-handle" style="margin-left: 16px;">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  type="text"
                  style="padding: 0;height: 32px; line-height: 32px;font-size: 16px;"
                  v-if="option.optionType===0"
                  @click="addOption(index)"
                ></el-button>
                <el-button
                  icon="el-icon-remove-outline"
                  type="text"
                  @click="deleteOption(option,index)"
                  style="padding: 0;height: 32px; line-height: 32px;font-size: 16px;"
                ></el-button>
              </div>
            </div>
            <div class="common_group" v-show="!hasOther">
              <el-button type="text" @click="addOtherOption">+ 添加【其它】项</el-button>
            </div>
          </div>
          <!-- <div class="common_group" v-if="topicType===13">
            <el-upload
              class="upload-demo"
              :show-file-list="true"
              accept=".xls, .xlsx"
              :on-success="importFile"
              with-credentials
              :action="requestBaseUrl+'/api/admin/member/poi/analyticalTemplate'"
            >
              <el-button type="text">导入关系表</el-button>
            </el-upload>
          </div> -->

          <div class="field-option-group" v-if="topicType===15" style="max-height: 200px;overflow-y: scroll;margin-top: 10px;">
            <div class="field-option flex" v-for="(option,index) in memberTypeList" :key="index">
              <div class="field-option-key">{{`类型${index+1}：`}}</div>
              <div class="field-option-value">
                <el-input v-if="option.isedit" v-model="option.typeName"></el-input>
                <span v-else>{{option.typeName}}</span>
              </div>
              <div class="field-option-handle" style="margin-left: 16px;">
                <el-button icon="el-icon-remove-outline" type="text" @click="deleteMember(option,index)" style="padding: 0;height: 32px; line-height: 32px;font-size: 16px;"></el-button>
                <el-button v-if="option.isedit" icon="el-icon-circle-check" type="text" @click="saveMember(option,index)" style="padding: 0;height: 32px; line-height: 32px;font-size: 16px;"></el-button>
                <el-button v-else icon="el-icon-edit" type="text" @click="option.isedit=true" style="padding: 0;height: 32px; line-height: 32px;font-size: 16px;"></el-button>
              </div>
            </div>
            <div class="common_group">
              <el-button type="text" @click="addMember">+ 添加会员类型</el-button>
            </div>
          </div>

        </el-form-item>
        <el-form-item label="选项：" v-if="topicType===8">
          <el-select style="width:150px" v-model="data.parameter.enumId" placeholder="请选择">
            <el-option
              v-for="(dic,index) in enumDictionaryList"
              :key="index"
              :label="dic.title"
              :value="String(dic.enumId)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段描述：">
          <el-input
            type="textarea"
            :rows="4"
            resize="none"
            placeholder="请输入字段描述，200字以内"
            :maxlength="200"
            v-model="data.description"
          />
        </el-form-item>
        <template v-if="topicType===5">
          <el-form-item label="日期类型：">
            <el-select v-model="data.parameter.dateType" style="width: 220px;" :disabled="data.parentId">
              <el-option value="year" label="年份" />
              <el-option value="date" label="日期" />
              <!--                            <el-option value="datetime" label="日期时间"/>-->
            </el-select>
          </el-form-item>
          <el-form-item label="最小日期：">
            <el-date-picker
              placeholder="最小日期"
              :default-value="new Date('1900')"
              v-model="data.parameter.minDate"
              :type="data.parameter.dateType"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最大日期：">
            <el-date-picker
              placeholder="最大日期"
              :default-value="new Date()"
              v-model="data.parameter.maxDate"
              :type="data.parameter.dateType"
            ></el-date-picker>
          </el-form-item>
        </template>
        <template v-if="topicType===6">
          <el-form-item label="地区级别：">
            <el-select v-model="data.parameter.cityType" style="width: 220px;">
              <el-option value="province" label="省" />
              <el-option value="city" label="市" />
              <!--                            <el-option value="area" label="区/县"/>-->
            </el-select>
          </el-form-item>
        </template>
        <el-form-item v-if="topicType === 0" label="账号字段：">
          <el-checkbox v-model="data.isAccountField">作为账号字段</el-checkbox>
        </el-form-item>
        <el-form-item v-if="topicType === 0 && data.isAccountField" label="账号后缀：">
          <el-input placeholder="账号后缀，10字以内" v-model="data.accountSuffix" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item v-if="topicType===9 && data.id" label="其它设置：">
          <div style="padding: 8px 16px;background-color: #f2f2f2;border-radius: 4px;">
            <div>
              <!--                            <el-checkbox v-model="data.enabled" style="margin-right: 16px;">启用字段</el-checkbox>-->
            </div>
            <div>
              <!-- <el-checkbox v-model="data.isMultiple" style="margin-right: 16px;">允许增加多条数据</el-checkbox> -->
              <el-button type="text" @click="manageDetailTable">
                <span style="padding-left: 14px;" class="border-left-black">管理明细表字段</span>
              </el-button>
            </div>
            <!-- <div v-if="topicType!==9">
              <el-checkbox v-model="data.necessary">字段必填</el-checkbox>
              <el-checkbox v-model="data.noRepeatable" v-show="tableName === '0'">不可重复</el-checkbox>
              <el-checkbox v-model="data.selfModify">允许会员自行修改</el-checkbox>
              <el-checkbox v-model="data.onlyAdmin">仅管理员可见</el-checkbox>
              <el-checkbox v-model="data.privacy">隐私字段(用户自己和管理员可见)</el-checkbox>
            </div> -->
          </div>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer height="auto">
      <div class="text-align-right" style="padding-top: 16px;">
        <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="save">确定</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import {requestBaseUrl} from "../../../../../js/config/serviceConfig.js";
import BranchChoose2 from "../../../util/branch/BranchChoose2";
export default {
  name: "MemberFieldForm",
  components: { BranchChoose2 },
  props: {
    data: Object,
    tableName: String,
    seq: Number
  },
  data() {
    return {
      enumDictionaryList: [],
      branchList: [],
      fileList: [], //上传学院关系表
      requestBaseUrl,
      memberTypeList:[]
    };
  },
  computed: {
    hasOther() {
      if (this.data.parameter && this.data.parameter.options) {
        let arr = this.data.parameter.options.filter(item => {
          return item.optionType === 1;
        });
        return arr && arr.length > 0;
      } else {
        return false;
      }
    },
    remainOneLeast() {
      if (this.data.parameter && this.data.parameter.options) {
        let arr = this.data.parameter.options.filter(item => {
          return item.optionType === 0;
        });

        return arr && arr.length === 1;
      } else {
        return false;
      }
    },
    topicType() {
      return this.data.topicType;
    }
  },
  methods: {
    deleteMember(option,index){
      if(option.id){
        this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
          this.$request.delete('/api/admin/memberType/deleteMemberType',{ params:{memberTypeId:option.id} }).then(()=>{
            this.memberTypeList.splice(index,1)
            this.$message.success('删除成功');
          })
        }).catch(()=>{});
      }else{
        this.memberTypeList.splice(index,1)
      }
    },
    addMember(){
      for(var i=0;i<this.memberTypeList.length;i++){
        if(this.memberTypeList[i].isedit){
          this.$message.warning('请先保存上一会员类型');
          return
        }
      }
      this.memberTypeList.push({typeName: "",isedit:true})
    },
    saveMember(item,index){
      console.log(item)
      if(!item.typeName){
        this.$message.warning('请输入类型名称');
        return;
      }
      let data = {
        typeDescription : "",
        typeName: item.typeName,
        nature: 0
      };
      if(item.id){
        data.typeId = item.id;
        this.$request.put('/api/admin/memberType/updateMemberType',data).then(()=>{
          this.$message.success('会员类型修改成功');
          this.memberTypeList[index].isedit = false;
        })
      }else{
        this.$request.post('/api/admin/memberType/addMemberType',data).then((res)=>{
          this.$message.success('会员类型新增成功');
          this.memberTypeList[index].id = res.data.id;
          this.memberTypeList[index].isedit = false;
        })
      }
    },
    getEnumDictionaries() {
      this.$request.get("/api/admin/associator/getEnumInfos").then(data => {
        if (data.success) {
          this.enumDictionaryList = data.data;
        }
      });
    },
    manageDetailTable() {
      this.$emit("manage-detail-table", ["-1", this.data.id]);
    },
    save() {
      let condition = {
        name: this.data.name,
        code: this.data.code,
        enabled: this.data.enabled,
        isDefault: this.data.isDefault,
        selfModify: this.data.selfModify,
        onlyAdmin: this.data.onlyAdmin,
        privacy: this.data.privacy || false,
        topicType: this.topicType,
        description: this.data.description,
        noRepeatable: this.data.noRepeatable,
        necessary: this.data.necessary,
        isAccountField: this.data.isAccountField,
        accountSuffix: this.data.accountSuffix,
        seq: this.seq
      };
      if (this.topicType !== 9) {
        condition.noRepeatable = this.data.noRepeatable;
      } else {
        condition.isMultiple = this.data.isMultiple;
      }

      if (this.topicType === 5) {
        condition.dateType = this.data.parameter.dateType;
        condition.maxDate = this.data.parameter.maxDate;
        condition.minDate = this.data.parameter.minDate;
      }

      if (this.topicType === 6) {
        condition.cityType = this.data.parameter.cityType;
      }

      //单选 多选 分会
      if (this.topicType === 2 || this.topicType === 3) {
        let itemList = [];
        if(this.data.parameter.options){
          for (let i = 0; i < this.data.parameter.options.length; i++) {
            itemList.push({ ...this.data.parameter.options[i] });
          }
        }
        condition.itemList = itemList;
      }
      if (this.topicType === 8) {
        condition.enumId = this.data.parameter.enumId;
      }
      if (this.tableName !== "0") {
        condition.detailId = this.tableName;
      }

      if (this.data.id) {
        this.updateField(condition);
      } else {
        this.addField(condition);
      }
    },
    addField(condition) {
      this.$request
        .post("/api/admin/associator/addField", condition)
        .then(data => {
          if (data.success) {
            this.$emit("created-fields");
            this.$message.success("字段新增成功");
            this.$emit("close");
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    updateField(condition) {
      condition.id = this.data.id;
      this.$request
        .put("/api/admin/associator/updateField", condition)
        .then(data => {
          if (data.success) {
            this.$message.success("字段修改成功");
            this.$emit("updated-fields");
            this.$emit("close");
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    addOption(index) {
      this.data.parameter.options.splice(index + 1, 0, {
        optionType: 0,
        title: ""
      });
    },
    deleteOption(item, index) {
      if (this.remainOneLeast && item.optionType === 0) {
        this.$message.warning("至少保留一个非其他选项");
        return;
      }
      this.data.parameter.options.splice(index, 1);
    },
    addOtherOption() {
      this.data.parameter.options.push({ optionType: 1, title: "其它" });
    },
    //导入就读学院的文件
    importFile(res) {
      console.log(res);
    }
  },
  created() {
    if (this.topicType === 8) {
      this.getEnumDictionaries();
    }
    if(this.topicType == 15){
      this.$request.get('/api/admin/memberType/getMemberTypes').then(res=>{
        this.memberTypeList = res.data;
        for(var i=0;i<this.memberTypeList.length;i++){
          this.$set(this.memberTypeList[i],"isedit",false)
        }
      })
    }
  }
};
</script>
