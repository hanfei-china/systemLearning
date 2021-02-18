<template>
  <form-field ref="container" v-model="field.title" @delete="$emit('delete')">
    <template>
      <el-form class="custom-el-form set-item-small-margin" size="mini" label-width="110px">
        <el-form-item label="字段必填：">
          <el-checkbox v-model="field.isRequire">字段必填</el-checkbox>
        </el-form-item>
        <el-form-item label="选项设置：">
          <div v-for="(item,index) of field.typeConfig.list" class="flex" :key="item.code">
            <div v-if="!item.isDelete" class="flex" style="padding-bottom: 10px;">
              <radio-icon />
              <el-input v-model="item.content" placeholder="请输入选项内容" />
              <div style="padding-left: 16px;">
                <el-tooltip class="item" effect="dark" content="删除选项" placement="top">
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteItem(index)"
                    class="custom-el-button danger unset-padding"
                  >
                    <i class="el-icon-remove" style="font-size: 16px;"></i>
                  </el-button>
                </el-tooltip>
              </div>
              <el-button :type="selectLinkIndex===index?'success':'primary'" size="mini" @click="linkShowIF(index)" style="margin-left:20px;">设置关联字段</el-button>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="addItem">新增单选项</el-button>
          </div>
        </el-form-item>
        <!-- <el-form-item label="关联字段设置：">
          <el-button type="primary" size="mini" @click="drawerShow=true">设置</el-button>
        </el-form-item> -->
      </el-form>
      <el-drawer
        title="关联字段设置"
        :visible.sync="drawerShow"
        :before-close="handleClose"
        append-to-body
      >
        <link-text-design v-if="textLinkIF" :field="field.typeConfig.list[selectLinkIndex].linkAttribute.linkTo" :parentID="field.id" @saveLinkText="savelinkItem" :selectIndex="selectLinkIndex" @close="closeLinkTextDesign" :allfields="allInfoList" @updataInfo="moveUpdata"/>
      </el-drawer>
    </template>
  </form-field>
</template>

<script>
import linkTextDesign from './linkTextDesign'
import FormField from "./FormField";
import RadioIcon from "../util/RadioIcon";
export default {
  name: "linkText",
  components: { RadioIcon, FormField ,linkTextDesign},
  props: {
    field: {
      type: Object,
      required: true
    },
    allInfoList:{
        type:Object,
        required:true
    }
  },
  data() {
    return {
      drawerShow: false,
      selectLinkIndex:0,
      textLinkIF:false  //用于手动控制这个子组件的销毁与否
    };
  },
  watch:{
      drawerShow(){
          if (this.drawerShow) {
              this.textLinkIF=true;
          }
      }
  },
  methods: {
    deleteItem(index) {
      this.$msgbox
        .confirm("删除操作是不可逆的，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除"
        })
        .then(() => {
          this.field.typeConfig.deleteItem(index);
        })
        .catch(() => {});
    },
    addItem() {
      this.field.typeConfig.addItem();
    },
    handleClose() {
    },
    //打开关联字段设置
    linkShowIF(index){
        this.drawerShow=true
        this.selectLinkIndex=index
    },
    //设置关联字段的子组件点击保存
    savelinkItem(index,fieldInfo){
        // this.field.typeConfig.list[index].linkItem=JSON.parse(JSON.stringify(fieldInfo));
        this.allInfoList.fields.splice(index+1);
        this.allInfoList.fields.push(...fieldInfo);
        this.textLinkIF=false;
    },
    //关闭子组件
    closeLinkTextDesign(){
      this.drawerShow=false;
      //这一步主要是为了控制子组件的销毁
      this.textLinkIF=false;
    },
    //更新数据
    moveUpdata(newVal){
      var list=JSON.parse(JSON.stringify(newVal))
      this.$emit('updataInfo',list);
      // list.fields.forEach((item,index)=>{
      //   this.allInfoList.splice(index,1,item);
      //   this.allInfoList.fields[index].belongAttribute=JSON.parse(JSON.stringify(item.belongAttribute));
      // })
    }
    
  }
};
</script>
