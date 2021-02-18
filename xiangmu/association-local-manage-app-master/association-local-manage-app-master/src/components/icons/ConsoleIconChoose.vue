<template>
    <el-popover ref="popover" placement="bottom" width="490" trigger="click">
        <el-button style="padding:4px;" slot="reference" size="small">
            <div style="width: 18px;height: 18px;border-radius: 2px;" class="border flex flex-column flex-center">
              <template v-if="copyValue">
                <i v-if="isIcon(copyValue)" :class="copyValue"></i>
                <img v-else style="width:16px;background: #606266;" :src="copyValue" alt="">
              </template>
              <i v-else class="el-icon-close"></i>
            </div>
        </el-button>
        <el-container style="height: 300px">
            <el-header height="auto" class="flex flex-column flex-center unset-padding">
                <div style="padding-bottom:12px;">
                    <el-input size="small" placeholder="输入图标名称进行搜索" v-model="name"></el-input>
                </div>
            </el-header>
            <el-main class="unset-padding">
                <vue-scroll>
                    <div class="flex flex-wrap border-left">
                        <div class="choose-icon-item flex flex-center flex-column cursor-pointer" :class="{chosen: `console-icon ${icon.icon}` === copyValue}" @click="choose(icon.icon)" v-for="icon of showIcons" :key="icon.icon">
                            <div>
                                <div class="text-align-center">
                                    <i class="console-icon" :class="icon.icon"></i>
                                </div>
                                <div class="text-align-center choose-icon-item-name">{{icon.name}}</div>
                            </div>
                        </div>
                    </div>
                </vue-scroll>
            </el-main>
            <el-footer height="auto" class="flex flex-column flex-center unset-padding">
                <div class="flex" style="padding-top: 12px;">
                    <div class="flex-fill-in-the-remaining-space">
                        <el-input size="small" v-model="copyValue" disabled/>
                    </div>
                    <div style="padding-left: 16px;">
                        <el-button type="text" size="small" @click="copyValue = null">清空</el-button>
                    </div>
                </div>
            </el-footer>
        </el-container>
    </el-popover>
</template>

<script>
  import {consoleIcons} from "./console-icon/iconfont";

  export default {
      name: "ConsoleIconChoose",
      props:{
        value: String
      },
      data(){
        return {
          copyValue: this.value,
          name:'',
          showIcons: consoleIcons
        }
      },
      model:{
        prop:'value',
        event:'change'
      },
      methods:{
        choose(icon){
          this.copyValue = `console-icon ${icon}`;
          setTimeout(()=>{
            this.$refs.popover.showPopper = false;
          },100);
        },
        isIcon(val){
          if(val.indexOf("console-icon")==0){
            return true
          }else{
            return false
          }
        }
      },
      watch:{
        copyValue(val){
          this.$emit('change',val);
        },
        name(val){
          if(val){
            this.showIcons = consoleIcons.filter(icon=>{
              return icon.name.indexOf(val) !== -1;
            })
          }else{
            this.showIcons = consoleIcons;
          }
        }
      }
  }
</script>

