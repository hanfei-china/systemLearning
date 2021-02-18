<template>
  <component v-show="isShow && type && type !== ''" :is="type"
             :required="required" :attributes="attributes" v-model="copyValue" :educationList="educationList" :collegeList="collegeList" :majorList="majorList" />
</template>

<script>
  import CheckboxAttr from './CheckboxAttr';
  import ColorAttr from './ColorAttr';
  import ContentAttr from './ContentAttr';
  import ContentClassAttr from './ContentClassAttr';

  import FuncTypeAttr from './FuncTypeAttr';
  import ImageAttr from './ImageAttr';
  import MpPageChooseAttr from './MpPageChooseAttr';
  import NumberAttr from './NumberAttr';
  import OnlineFormAttr from './OnlineFormAttr';
  import SelectAttr from './SelectAttr';
  import TextareaAttr from './TextareaAttr';
  import TextAttr from './TextAttr';
  import CounselClassAttr from './CounselClassAttr';
  import CommonGroupAttr from "./CommonGroupAttr";
  import AlbumTypeAttr from "./AlbumTypeAttr";
  import MemberQueryBuilderAttr from "./memberQueryBuilder/MemberQueryBuilderAttr";
  import PrivilegeAttr from "./PrivilegeAttr";
  import DateAttr from "./DateAttr";

  export default {
    name: "Attribute",
    components:{
      PrivilegeAttr,
      MemberQueryBuilderAttr,
      AlbumTypeAttr,
      CommonGroupAttr,
      CheckboxAttr, ColorAttr, ContentAttr, ContentClassAttr, FuncTypeAttr,
      ImageAttr, MpPageChooseAttr, NumberAttr, OnlineFormAttr, SelectAttr, TextareaAttr, TextAttr,
      CounselClassAttr, DateAttr
    },
    model:{
      prop: 'value',
      event: 'change'
    },
    props:{
      educationList:Array,
      collegeList:Array,
      majorList:Array,
      attributes:{
        type: Object,
        default(){
          return null;
        }
      },
      value:{
        default(){
          return null;
        }
      },
      required: {
        type: Boolean,
        default: true
      },
      type:{
        type: String,
        default: undefined
      },
      show:{
        type: Function
      }
    },
    data() {
      return {
        copyValue: this.value
      }
    },
    computed:{
      isShow(){
        if(this.show){
         return this.show();
        }
        return true;
      }
    },
    watch:{
      copyValue(value){
        this.$emit('change', value);
      }
    }

  }
</script>
