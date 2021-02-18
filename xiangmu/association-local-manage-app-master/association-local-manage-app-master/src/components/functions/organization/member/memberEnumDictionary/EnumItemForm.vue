<template>
    <el-container style="height: 316px;">
        <el-header style="padding-bottom: 16px !important;" height="auto" class="unset-padding">
            温馨提示：换行输入，可批量添加
        </el-header>
        <el-main class="unset-padding position-relative">
            <el-input size="small" v-model="nodes" type="textarea" :rows="10" resize="none" placeholder="枚举标题之间换行输入，可批量添加。
例如：
信息科学技术学院
艺术学院
旅游学院"/>
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
    export default {
        name: "EnumItemForm",
        data(){
          return {
              nodes:''
          }
        },
        methods:{
            save(){
                if(!this.nodes || !this.nodes.trim()){
                    this.$message.warning("请至少输入一个节点名称");
                    return;
                }

                let nodes = this.nodes.split("\n");
                this.$emit('add-nodes',nodes);
            }
        }
    }
</script>
