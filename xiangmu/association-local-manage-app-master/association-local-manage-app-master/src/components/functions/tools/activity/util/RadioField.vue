<template>
    <div class="singleList">
        <div class="zu" v-for="(item,index) in itemList" :key="index">
            <i class="iconfont icon-danxuan danxuan"></i>
            <el-input size="small" v-model="item.title" clearable />
            <i class="iconfont icon-jianshao reduce"
               v-if="itemList.length>2"
               @click="reduceItem(index)"></i>
        </div>
        <div class="zu">
            <el-button plain size="mini" icon="el-icon-plus"
                       @click="addItem"></el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RadioField",
        props:["itemList"],
        methods:{
            addItem() {
                let newItem = {key: this.itemList.length + 1, title: '请输入新选项', optionType: 0};
                this.itemList.push(newItem);
            },
            reduceItem(index) {
                this.itemList.splice(index, 1);

            },
        }
    }
</script>
