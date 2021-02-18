<template>
    <div class="tab-bar-container" :style="tabBarContainerStyle">
      <div class="tab-container" :key="index" v-for="(tab,index) in tabBar.list"
           :style="tabContainerStyle(index)" @click.stop="tabChange(index)">
        <div class="tab-icon" v-show="tab.attributes.iconPath.value &&  tab.attributes.selectedIconPath.value">
          <img :src="index == activeTabIndex ? tab.attributes.selectedIconPath.value : tab.attributes.iconPath.value"/>
        </div>
        <div class="tab-text">{{tab.attributes.text.value}}</div>
      </div>
    </div>
</template>

<script>

  export default {
    name: "TabBarPreview",
    props:{
      tabBar:{
        type: Object,
        default(){
          return null;
        }
      },
      activeTabIndex:{
        type: Number,
        default(){
          return 0;
        }
      },
    },
    computed:{
      tabBarContainerStyle(){
        return {
          backgroundColor : this.tabBar.attributes.backgroundColor.value
        }
      }
    },
    methods:{
      tabContainerStyle(index){
        if(index == this.activeTabIndex){
          return {
            color : this.tabBar.attributes.selectedColor.value
          }
        }else{
          return {
            color : this.tabBar.attributes.color.value
          }
        }
      },
      tabChange(index){
          this.$emit('tab-change',index);
      },
    }
  }
</script>

<style scoped>
.tab-bar-container{
  display: flex;
  height: 100%;
}

.tab-container{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
  cursor: pointer;
}

.tab-icon>img{
  width: 26px;
  height: 26px;
  display: block;
  margin: 0 auto;
}

.tab-text{
  font-size: 10px;
}
</style>
