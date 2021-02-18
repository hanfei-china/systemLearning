<template>
  <el-container class="absolute-fill-parent border-right" style="padding: 0 16px;">
    <el-header class="unset-padding flex" height="auto" style="margin-bottom: 16px;">
      <div class="flex-fill-in-the-remaining-space">
        <el-alert show-icon :closable="false" title="温馨提示：各字段可拖曳排序" type="info" />
      </div>
      <div style="padding-left: 16px;">
        <el-button size="small" type="primary" @click="associatedFields = true">关联字段</el-button>
      </div>
    </el-header>
    <el-main class="position-relative unset-padding">
      <div class="absolute-fill-parent">
        <vue-scroll>
          <draggable
            v-model="showFieldList"
            v-bind="{animation: 500,handle:'.item-sort'}"
            @sort="sort"
          >
            <div v-for="(item,index) in showFieldList" :key="item.id" class="member-field-simple-infobox">
              <div class="member-field-simple-infocus flex">
                <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow" >
                  <span class="topic-index">{{index+1}}、</span>
                  <span class="txt_show">{{item.name}}</span>
                </div>
                <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow" >
                  <span class="type_txt">({{fieldType[item.topicType]}})</span>
                </div>
                <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow" style="flex: 1 0 36%">
                    <div class="member-field-switches" v-if="item.topicType === 9">
                        允许增加多条数据： <el-switch v-model="item.isMultiple" @change="editField(item, 'isMultiple')"></el-switch>
                    </div>
                    <div class="member-field-switches" v-else>
                        字段必填： <el-switch v-model="item.necessary" @change="editField(item, 'necessary')"></el-switch>
                        <template v-if="item.topicType !== 14">
                          不可重复： <el-switch v-model="item.noRepeatable" @change="editField(item, 'noRepeatable')"></el-switch>
                          允许会员自行修改: <el-switch v-model="item.selfModify" @change="editField(item, 'selfModify')"></el-switch>
                        </template>
                        隐私字段: <el-switch v-model="item.privacy" @change="editField(item, 'privacy')"></el-switch>
                    </div>
                </div>
                <div class="member-field-simple-info-handle" style="padding-left: 16px;">
                  <el-button class="custom-el-button item-sort" type="text">排序</el-button>
                  <el-button class="custom-el-button danger" type="text" @click="deleteField(item.id)">
                    取消关联</el-button>
                </div>
              </div>
              
              <div v-if="item.topicType==13">
                <div class="member-field-simple-infozuhe flex" v-for="(item,index) in item.detailList" :key="index">
                    <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
                        <span class="txt_show">{{item.name}}</span>
                    </div>
                    <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
                        <span class="type_txt">({{fieldType[item.topicType]}})</span>
                    </div>
                </div>
              </div>

            </div>
          </draggable>
        </vue-scroll>
      </div>
    </el-main>
    <el-dialog
      title="关联字段"
      :visible.sync="associatedFields"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
    >
      <field-form
        v-if="associatedFields"
        :memberTypeId="memberType.id"
        :fieldListLength="fieldsList.length"
        :associatedFields="associatedFields"
        @change="getAssociatedFields"
        @refresh="refresh"
      ></field-form>
    </el-dialog>
  </el-container>
</template>

<script>
import FieldForm from "./FieldForm";
import { fieldType } from "../../../../../js/util/constantStore";
import draggable from "vuedraggable";

export default {
  name: "MemberTypeFieldManage",
  props: {
    memberType: {
      type: Object,
      required: true
    }
  },
  components: { FieldForm, draggable },
  data() {
    return {
      fieldType,
      associatedFields: false, //关联字段弹窗
      fieldsList: [], //字段
      showFieldList: [], //展示字段
      groupList: [] //组合字段
    };
  },
  created() {
    this.getAllFieldByMemberType();
  },
  watch: {
    "memberType.id"() {
      this.getAllFieldByMemberType();
    }
  },
  methods: {
    //获取字段
    getAllFieldByMemberType(isSort) {
      this.groupList = [];
      if (this.memberType) {
        this.$request
          .get("/api/admin/memberType/getAllFieldByMemberType", {
            params: { memberTypeId: this.memberType.id }
          })
          .then(res => {
            if (res.success) {
              //   this.fieldsList = res.data.fieldsInfo;
              //下面的针对有组合字段的处理方式
              this.fieldsList = JSON.parse(JSON.stringify(res.data.fieldsInfo));
              this.showFieldList = JSON.parse(
                JSON.stringify(res.data.fieldsInfo)
              );
              var num = 0;
              var a = 0;
              res.data.fieldsInfo.forEach((item, index) => {
                if (item.isGroup) {
                  num++;
                  this.groupList.splice(index, 1, item);
                  a = index;
                }
              });
              if (num > 0) {
                var obj = {
                  isGroup: true,
                  name: this.groupList[0].name + "-" + this.groupList[1].name,
                  code: "组合",
                  memberTypeFieldBindingId:
                    this.groupList[0].memberTypeFieldBindingId +
                    "," +
                    this.groupList[1].memberTypeFieldBindingId
                };
                this.showFieldList.splice(a - num + 1, num, obj);
              }
              //有排序功能
              if (isSort) {
                this.sort();
              }
            }
          });
      }
    },
    editField(field, propName) {
        this.$request.put('/api/admin/memberType/updateMemberTypeField', {
            memberTypeFieldBindingIds: [
                field.memberTypeFieldBindingId
            ],
            [propName]: field[propName]
        }).then(res => {
            if (res.success) {
                this.$message.success('修改成功')
            }
        })
    },
    //取消关联
    deleteField(val) {
      this.$confirm("确定取消关联该项？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // console.log(typeof val);
        if (typeof val === "string") {
          this.$request
            .post("/api/admin/memberType/unBindingField", {
              fieldId: val,
              memberTypeId: this.memberType.id
            })
            .then(res => {
              if (res.success) {
                this.$message.success("删除成功");
                this.getAllFieldByMemberType(true);
              }
            });
        } else {
          //组合字段的取消关联
          // console.log(val);
          this.$request
            .post("/api/admin/memberType/unBindingGroupField", {
              fieldIds: val,
              memberTypeId: this.memberType.id
            })
            .then(res => {
              if (res.success) {
                this.$message.success("删除成功");
                this.getAllFieldByMemberType(true);
              }
            });
        }
      });
    },
    getAssociatedFields(val) {
      this.associatedFields = val;
    },
    //刷新
    refresh() {
      this.getAllFieldByMemberType(true);
    },
    //排序
    sort(isTip) {
      let idList = [];

      for (let filed of this.showFieldList) {
        idList.push(filed.memberTypeFieldBindingId);
      }
      // console.log(idList);
      var arr = [];
      var num = 0;
      var isGroup = false;
      idList.forEach((item, index) => {
        if (item.indexOf(",") > 0) {
          // console.log(item);
          arr = item.split(",");
          num = index;
          isGroup = true;
        }
      });
      if (isGroup) {
        // console.log(idList);
        idList.splice(num, 1, ...arr);
        // console.log(idList);
      }
      this.$request
        .post("/api/admin/memberType/orderFields", { idList: idList })
        .then(() => {
          if (isTip) {
            this.$message.success("字段已排序");
          }
          this.getAllFieldByMemberType();
        });
    }
  }
};
</script>

<style scoped lang="less">
.member-field-switches .el-switch{
    margin-right: 20px;
}
.container {
  background-color: #ffffff;
  border-radius: 4px;
  font-size: 14px;
  color: #333333;
  border: 1px solid #d7d7d7;
  padding: 0 34px 0 12px;
  //   height: 37px;
  line-height: 37px;
  display: flex;
  align-items: center;
  .containerTop {
    flex: 1;
    display: flex;
    flex-direction: column;
    .showItem {
      display: flex;
    }
  }
  .containerBet {
    flex: 2;
    padding-left: 20%;
  }
  .containerBom {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
  }
}


.member-field-simple-infobox{
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    margin-bottom: 16px;
    .member-field-simple-infocus{
        font-size: 14px;
        color: #333333;
        padding: 0 12px;
        height: 37px;
        line-height: 37px;
    }
    .member-field-simple-infozuhe{
        background-color: #eee;
        border-radius: 4px;
        font-size: 12px;
        color: #333333;
        border: 1px solid #d7d7d7;
        padding: 0 12px;
        height: 30px;
        line-height: 30px;
        margin: 5px 10px;
    } 
}
.member-field-simple-infobox:last-child{
  margin-bottom: 0;
}
</style>
