<template>
  <el-container style="height: 500px;">
    <el-header class="flex flex-column flex-center unset-padding">
      <div class="flex" style="padding-bottom: 16px;">
        <div class="flex-fill-in-the-remaining-space" style="padding-right: 16px;">
          <el-alert show-icon :closable="false" title="温馨提示：各字段可拖曳排序" type="info" />
        </div>
        <el-button type="primary" size="small" @click="formVisible=true">关联字段</el-button>
      </div>
    </el-header>
    <el-main class="unset-padding position-relative">
      <div
        class="absolute-fill-parent flex flex-center flex-column"
        v-show="!fields || fields.length < 1"
      >
        <div class="text-align-center" style="font-size: 16px;">
          <img width="250" src="../../../../../assets/nodata.png" />
        </div>
      </div>
      <div v-show="fields && fields.length > 0" class="absolute-fill-parent">
        <vue-scroll>
          <div>
            <draggable v-model="fields" v-bind="{animation: 500,handle:'.item-sort'}" @sort="sort">
              <div v-for="(field,index) of fields" :key="field.id">
                <!-- 组合字段 -->
                <div class="container" v-if="field.isGroup===true">
                  <span class>{{index+1}}、</span>
                  <div class="containerTop">
                    <div v-for="(info,ind) in groupList" :key="ind" class="showItem">
                      <div>
                        <span class>{{info.name}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="containerBet">
                    <span class="type_txt">(组合字段)</span>
                  </div>
                  <div
                    class="member-field-simple-info-handle"
                    style="padding-left: 16px;width: 160px;"
                  >
                    <div v-show="field.topicType !== 9">
                      <el-checkbox
                        v-model="groupMatch"
                        @change="fieldMatchChange([groupList[0].applicationFormFieldBindingId,groupList[1].applicationFormFieldBindingId])"
                      >作为匹配字段</el-checkbox>
                      <el-popover placement="top-start" width="340" trigger="hover">
                        <div>开启后，该字段将作为用户绑定的匹配凭证</div>
                        <i class="el-icon-question cursor-pointer" slot="reference"></i>
                      </el-popover>
                    </div>
                  </div>
                  <div
                    class="member-field-simple-info-handle"
                    style="padding-left: 16px;width: 100px;"
                  >
                    <el-button class="custom-el-button item-sort" type="text">排序</el-button>
                    <el-button
                      class="custom-el-button danger"
                      type="text"
                      @click="cancelBinding([groupList[0].id,groupList[1].id])"
                    >取消关联</el-button>
                  </div>
                </div>
                <!-- 组合字段 -->
                <div v-else style="margin-bottom:15px;">
                  <div class="member-field-simple-info flex">
                    <div
                      class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow"
                    >
                      <span class="topic-index">{{index+1}}、</span>
                      <span class="txt_show">{{field.name}}</span>
                    </div>
                    <div
                      class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow"
                    >
                      <span class="type_txt">({{fieldType[field.topicType]}})</span>
                    </div>
                    <div
                      class="member-field-simple-info-handle"
                      style="padding-left: 16px;width: 160px;"
                    >
                      <div v-show="field.topicType !== 9&&field.topicType !== 14">
                        <el-checkbox
                          v-model="field.isMatch"
                          @change="fieldMatchChange(field)"
                        >作为匹配字段</el-checkbox>
                        <el-popover placement="top-start" width="340" trigger="hover">
                          <div>开启后，该字段将作为用户绑定的匹配凭证</div>
                          <i class="el-icon-question cursor-pointer" slot="reference"></i>
                        </el-popover>
                      </div>
                    </div>
                    <div
                      class="member-field-simple-info-handle"
                      style="padding-left: 16px;width: 100px;"
                    >
                      <el-button class="custom-el-button item-sort" type="text">排序</el-button>
                      <el-button
                        class="custom-el-button danger"
                        type="text"
                        @click="cancelBinding(field.id)"
                      >取消关联</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </draggable>
          </div>
        </vue-scroll>
      </div>
    </el-main>
    <el-dialog
      title="关联字段"
      :visible.sync="formVisible"
      append-to-body
      width="600px"
      :close-on-click-modal="false"
    >
      <application-form-field-form
        :seq="fields.length"
        :form-id="formId"
        v-if="formVisible"
        @close="formVisible=false"
        @refresh="refresh"
      />
    </el-dialog>
  </el-container>
</template>

<script>
import ApplicationFormFieldForm from "./ApplicationFormFieldForm";
import { fieldType } from "../../../../../js/util/constantStore";
import draggable from "vuedraggable";

export default {
  name: "ApplicationFormFieldManage",
  components: { ApplicationFormFieldForm, draggable },
  props: {
    formId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formVisible: false,
      fields: [], //展示的字段数据
      realFields: [], //真实的字段数据
      groupList: [], //组合字段数据
      fieldType,
      groupMatch:false    //组合字段是否作为匹配字段
    };
  },
  methods: {
    getFields(callback) {
      this.groupList = [];
      this.$request
        .get("/api/admin/applicationForm/getAllFieldsInfoByApplicationFormId", {
          params: { applicationFormId: this.formId }
        })
        .then(res => {
          this.realFields = res.data.fieldsInfo || [];
          this.fields = JSON.parse(JSON.stringify(this.realFields));
          //对展示数据进行处理---将组合字段合并
          var num = 0;
          var a = 0;
          res.data.fieldsInfo.forEach((item, index) => {
            if (item.isGroup) {
              num++;
              this.groupList.splice(index, 1, item);
              a = index;
            }
          });
          this.groupMatch=this.groupList[0].isMatch;    //提取其是否匹配的信息
          if (num > 0) {
            var obj = {
              isGroup: true,
              name: this.groupList[0].name + "-" + this.groupList[1].name,
              code: "组合",
              id: this.groupList[0].id + "," + this.groupList[1].id,
              applicationFormFieldBindingId:
                this.groupList[0].applicationFormFieldBindingId +
                "," +
                this.groupList[1].applicationFormFieldBindingId,
            };
            this.fields.splice(a - num + 1, num, obj);
          }
          callback && callback();
        });
    },
    refresh() {
      this.getFields(() => {
        this.sort(false);
      });
    },
    sort(isTip) {
      let idList = [];

      for (let filed of this.fields) {
        idList.push(filed.applicationFormFieldBindingId);
      }
      //组合字段情况的排序处理
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
        .post("/api/admin/applicationForm/orderFields", { idList })
        .then(() => {
          if (isTip) {
            this.$message.success("字段已排序");
          }
        });
    },
    fieldMatchChange(field) {
      // 考虑组合字段的情况
      if (field instanceof Array) {
        //组合字段的取消关联
        // console.log(val);
        this.$request
          .put(
            "/api/admin/applicationForm/updateApplicationBindingGroupField",
            {
              ids: field,
              isMatch: this.groupMatch
            }
          )
          .then(() => {
            this.$message.success("字段已更新成功");
            this.getFields();
          });
      } else {
        this.$request
          .put("/api/admin/applicationForm/updateApplicationBindingField", {
            id: field.applicationFormFieldBindingId,
            isMatch: field.isMatch
          })
          .then(() => {
            this.$message.success("字段已更新成功");
            this.getFields();
          });
      }
    },
    cancelBinding(memberTypeFieldId) {
      this.$msgbox
        .confirm("取消关联操作是不可逆的，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除"
        })
        .then(() => {
          // 考虑组合字段的情况
          if (typeof val === "string") {
            this.$request
              .delete("/api/admin/applicationForm/applicationUnBindingField", {
                params: {
                  applicationFormId: this.formId,
                  memberTypeFieldId
                }
              })
              .then(() => {
                this.$message.success("字段取消关联成功");
                this.refresh();
              });
          } else {
            //组合字段的取消关联
            // console.log(val);
            this.$request
              .delete(
                "/api/admin/applicationForm/applicationUnBindingGroupField",
                {
                  params: {
                    applicationFormId: this.formId,
                    memberTypeFieldId
                  }
                }
              )
              .then(res => {
                if (res.success) {
                  this.$message.success("字段取消关联成功");
                  this.refresh();
                }
              });
          }
          //
        })
        .catch(() => {});
    }
  },
  created() {
    this.getFields();
  }
};
</script>

<style lang="less" scoped>
.container {
  background-color: #ffffff;
  border-radius: 4px;
  font-size: 14px;
  color: #333333;
  border: 1px solid #d7d7d7;
  padding: 0 12px 0 12px;
  //   height: 37px;
  line-height: 37px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
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
    padding-left: 12%;
  }
  .containerBom {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
  }
}
</style>
