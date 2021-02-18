<template>
    <div>
        <span v-for="(item, index) in showLabelList" :key="index" style="margin: 0 5px 5px 0;">
            <el-tag size="small" :color="item.color" style="border: none;color: #ffffff;">
                {{item.title}}
            </el-tag>
        </span>
    </div>
</template>

<script>
    export default {
        name: "MemberLabelInfo",
        props: {
            labelList: Array,
            showLabels: String
        },
        computed:{
            showLabelList(){
                let showLabelList = [];
                if(this.showLabels !== 'null'){
                    let labels = JSON.parse(this.showLabels)
                    for (let label of labels) {
                        for (let item of this.labelList) {
                            if (label.labelId === item.id) {
                                showLabelList.push(item)
                            }
                        }
                    }
                }

                return showLabelList;
            }
        },
    }
</script>
