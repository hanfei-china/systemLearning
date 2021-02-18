<template>
  <div class="wrap">
    <div class="fieldbox">
      <vue-scroll>
        <h4>关联字段</h4>
        <draggable element="ul" :list="fieldList" :group="{ name: 'library', pull:'clone', put: false }" :clone="componentClone" :sort="false" filter=".filtered">
          <li v-for="item in fieldList" :key="item.subtype" v-if="item.topicType!=15" :class="item.choosed?'filtered':''">
            {{ item.name }}
            <template v-if="item.topicType==13" topicType>
              <span class="zuhe" v-for="(item,index) in item.detailList" :key="index">{{item.name}}</span>
            </template>
          </li>
        </draggable>
      </vue-scroll>
    </div>

    <div class="designbox" v-if="applyFormObj">
      <div class="header">{{applyFormObj.applicationForm.applicationFormName}}</div>
      <div class="designview">
        <div class="matchbox" v-if="applyFormObj.applicationForm.isMatchingModes">
          <h5>匹配字段</h5>
          <div class="dragfieldbox">
            <draggable class="dragbox" :list="matchList" handle=".item-sort" :group="{name: 'match', pull: false, put: true}" @add="matchAdd" @update="handleSort(true)" :clone="componentClone">
              <div v-for="(field,index) in matchList" :key="index" style="margin-bottom:10px;">
                <member-field-simple-preview @removeField="removeField" formType="match" :index="index" :data="field" @click.native="handleEdit(field)" :nowField="nowField" />
              </div>
            </draggable>
          </div>
        </div>
        <div class="matchbox">
          <h5>审核字段</h5>
          <div class="dragfieldbox">
            <draggable class="dragbox" :list="checkList" handle=".item-sort" :group="{name: 'match', pull: false, put: true}" @add="checkAdd" @update="handleSort(true)" :clone="componentClone">
              <div v-for="(field,index) in checkList" :key="index" style="margin-bottom:10px;">
                <member-field-simple-preview @removeField="removeField" formType="check" :index="index" :data="field" @click.native="handleEdit(field)" :nowField="nowField"/>
              </div>
            </draggable>
          </div>
        </div>
        <div class="matchbox">
          <h5>补全字段</h5>
          <div class="dragfieldbox">
            <draggable class="dragbox" :list="otherList" handle=".item-sort" :group="{name: 'match', pull: false, put: true}"  @add="otherAdd" @update="handleSort(true)" :clone="componentClone">
              <div v-for="(field,index) in otherList" :key="index" style="margin-bottom:10px;">
                <member-field-simple-preview @removeField="removeField" formType="other" :index="index" :data="field" @click.native="handleEdit(field)" :nowField="nowField" />
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>

    <div class="attrbox">
      <vue-scroll>
        <h4>字段设置</h4>
        <member-field-attr :data="nowField"/>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import MemberFieldSimplePreview from "./MemberFieldSimplePreview";
import MemberFieldAttr from './MemberFieldAttr';
export default {
  name: "ApplyFieldManage",
  components: { Draggable,MemberFieldSimplePreview,MemberFieldAttr },
  data() {
    return {
      applyId: this.$route.params.applyId,
      fieldList: [],
      clonedField:null,
      matchList:[],
      checkList:[],
      otherList:[],
      nowField:null,
      applyFormObj:null
    };
  },
  created() {
    Promise.all([this.$request.get("/api/admin/associator/getFieldsInfo"),this.$request.get("/api/admin/applicationForm/formFields",{params:{formId:this.applyId}})]).then(([fieldList,applyobj])=>{
      this.fieldList = fieldList.data || [];
      if(applyobj.success){
        this.applyFormObj = applyobj.data;
        if(this.applyFormObj.fieldsInfo){
          for(var i=0;i<this.applyFormObj.fieldsInfo.length;i++){
            if(this.applyFormObj.fieldsInfo[i].isMatch){
              this.matchList.push(this.applyFormObj.fieldsInfo[i])
            }else if(this.applyFormObj.fieldsInfo[i].isCheck){
              this.checkList.push(this.applyFormObj.fieldsInfo[i])
            }else{
              this.otherList.push(this.applyFormObj.fieldsInfo[i])
            }
            this.fieldList.find((a,b,c)=>{
              if(a.id==this.applyFormObj.fieldsInfo[i].id){
                this.$set(this.fieldList[b],"choosed",true);
              }
            })
          }
        }
      }
    })
  },
  methods: {
    handleSort(needMessage){
      var idList = this.matchList.map(item=>item.formFieldId).concat(this.checkList.map(item=>item.formFieldId)).concat(this.otherList.map(item=>item.formFieldId))
      this.$request.post("/api/admin/applicationForm/orderFields",{idList} ).then((res) => {
        if(needMessage){this.$message.success("排序成功")}
      }); 
    },
    handleEdit(item){
      this.nowField = item;
    },
    componentClone(item) {
      this.clonedField = item;
    },
    removeField(formtype,index,item){
      this.$request.delete("/api/admin/applicationForm/unBindingField",{params:{formFieldId:item.formFieldId}}).then((res) => {
        if(formtype=="match"){
          this.matchList.splice(index,1)
        }else if(formtype=="check"){
          this.checkList.splice(index,1)
        }else if(formtype=="other"){
          this.otherList.splice(index,1)
        }
        this.fieldList.find((a,b,c)=>{
          if(a.id==item.id){
            this.fieldList[b].choosed=false
          }
        })
        if(item.formFieldId==this.nowField.formFieldId){
          this.nowField = null;
        }
        this.$message.success("移除成功")
      }); 
    },
    matchAdd(e){
      if(this.clonedField.topicType==13){return}
      this.$set(this.clonedField,"choosed",true);
      var params = {
        fieldId:this.clonedField.id,
        formId:this.applyId,
        isMatch: true,
        isCheck:false,
        seq:0
      }
      this.$request.post("/api/admin/applicationForm/applicationBindingField",params).then((res) => {
        this.nowField = JSON.parse(JSON.stringify(this.clonedField));
        for (const key in res.data) {
          if (key=="id") {
            this.nowField.formFieldId = res.data.id
          }else{this.nowField[key] =res.data[key] }
        }
        this.matchList.splice(e.newIndex,0,this.nowField);
        this.handleSort()
      }); 
    },
    checkAdd(e){
      this.$set(this.clonedField,"choosed",true);
      var params = {
        fieldId:this.clonedField.id,
        formId:this.applyId,
        isMatch: false,
        isCheck:true,
        seq:0
      }
      this.$request.post("/api/admin/applicationForm/applicationBindingField",params).then((res) => {
        this.nowField = JSON.parse(JSON.stringify(this.clonedField));
        for (const key in res.data) {
          if (key=="id") {
            this.nowField.formFieldId = res.data.id
          }else{this.nowField[key] =res.data[key] }
        }
        this.checkList.splice(e.newIndex,0,this.nowField);
        this.handleSort()
      }); 
    },
    otherAdd(e) {
      this.$set(this.clonedField,"choosed",true);
      var params = {
        fieldId:this.clonedField.id,
        formId:this.applyId,
        isMatch: false,
        isCheck:false,
        seq:0
      }
      this.$request.post("/api/admin/applicationForm/applicationBindingField",params).then((res) => {
        this.nowField = JSON.parse(JSON.stringify(this.clonedField));
        for (const key in res.data) {
          if (key=="id") {
            this.nowField.formFieldId = res.data.id
          }else{this.nowField[key] =res.data[key] }
        }
        this.otherList.splice(e.newIndex,0,this.nowField);
        this.handleSort()
      }); 
    },
  },
};
</script>

<style scoped lang="less">
.wrap {
  height: 100vh;
  background-color: #f3f6fa;
  display: flex;
  .fieldbox {
    flex: 0 1 280px;
    width: 180px;
    background: #fff;
    box-shadow: 2px 0 5px #ddd;
    position: relative;
    z-index: 5;
    h4 {
      font-size: 16px;
      margin-left: 15px;
      padding-top: 15px;
    }
    li {
      padding: 0 10px;
      line-height: 30px;
      background-color: #f3f6fd;
      margin: 5px 10px 0;
      font-size: 12px;
      overflow: hidden;
      cursor: move;
    }
    li.filtered{
      cursor: not-allowed;
      background-color: #f5f7fa;
      color: #c0c4cc;
    }
    .zuhe{
      display: block;
      line-height: 22px;
      font-size: 12px;
      color: #666;
      padding-left: 10px;
    }
  }


  .designbox {
    flex: 1 1 auto;
    background-color: #cbcbcb;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header{
      background: #fff;
      position: relative;
      text-align: center;
      line-height: 45px;
      font-size: 16px;
    }
    .designview{
      background: white;
      flex-shrink: 0;
      height: calc( 100vh - 45px);
      display: flex;
      flex-direction: column;
      .matchbox{
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        flex: 1;
        h5{
          text-align: left;
          margin-left: 10px;
          line-height: 30px;
        }
        .dragfieldbox{
          border: 1px dashed #ff8e3d;
          margin: 10px;
          flex: 1;
          overflow: auto;
          .dragbox{
            padding: 10px;
            min-height: 100%;
            box-sizing: border-box;
          }
        }
      }
    }
  }


  .attrbox{
    flex: 0 1 220px;
    width: 220px;
    background: #fff;
    padding: 0 10px;
    box-shadow: -2px 0 5px #ddd;
    position: relative;
    z-index: 5;
    box-sizing: border-box;
    h4{
      font-size: 15px;
      line-height: 45px;
      border-bottom: 1px solid #ddd;
    }
  }
}
</style>
