<template>
    <div class="list-item">
      <div class="text-area">
        <div class="title">{{data[title]}}</div>
        <div class="label-time">
          <div class="time">{{data[time] | yyyyMMddHHmm}}</div>
          <div class="label">{{data[label] && data[label].length > 0 ? data[label][0] : ''}}</div>
        </div>
      </div>
      <div class="image-area" v-if="data[image]" :style="imageStyle"></div>
    </div>
</template>

<script>
    export default {
      name: "LeftTextRightImage",
      props:{
        data:{
          type: Object,
          default(){
            return null;
          }
        },
        title:{
          type: String,
          default(){
            return 'title';
          }
        },
        label:{
          type: String,
          default(){
            return 'label';
          }
        },
        time:{
          type: String,
          default(){
            return 'time';
          }
        },
        image:{
          type: String,
          default(){
            return 'image';
          }
        }
      },
      computed:{
        imageStyle(){
          return {backgroundImage:'url('+(this.data[this.image])+')'};
        }
      }
    }
</script>

<style scoped>
  .list-item{
    display: flex;
    padding: 14px 16px 19px 16px;
  }

  .list-item:not(:last-child){
    border-bottom: 1px solid #CBCBCB;
  }

  .text-area{
    flex: 1;
  }

  .image-area{
    width: 120px;
    height: 86px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 8px;
    overflow: hidden;
    margin-left: 26px;
  }

  .label-time{
    display: flex;
    padding-top: 14px;
  }

  .label{
    flex: 1;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    text-align: right;
  }

  .title{
    font-size: 16px;
    color: #000000;
    letter-spacing: 0;
    line-height: 28px;
    overflow: hidden;
    height: 56px;
  }

  .time{
    width: 170px;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
  }
</style>
