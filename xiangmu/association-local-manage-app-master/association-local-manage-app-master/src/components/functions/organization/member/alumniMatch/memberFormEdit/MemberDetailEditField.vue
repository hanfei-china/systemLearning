<template>
    <div style="border: 1px solid #f2f2f2;padding: 5px 16px 16px 16px;background-color: #fAfAfA;border-radius: 4px;">
        <div class="lrd-member-detail-el-form-container" v-for="(detail,index) of config.detailList" :key="index">
            <div class="lrd-member-detail-el-form-header flex" v-show="config.isMultiple">
                <div class="lrd-member-detail-el-form-title flex-fill-in-the-remaining-space">{{`明细${index+1}：`}}</div>
                <div class="lrd-member-detail-el-form-handle">
                    <el-button icon="el-icon-delete-solid" style="padding: 0 15px;line-height: 28px;font-size: 14px;"
                               size="medium" type="text" class="custom-el-button danger"
                                @click="deleteDetail(index)"/>
                </div>
            </div>
            <el-form>
                <el-form-item v-for="field of detail" :key="field.code">
                    <template v-slot:label>
                        <span class="custom-el-form-item-label" :class="{required: field.necessary}">
                            {{field.name}}：
                        </span>
                    </template>
                    <member-edit-field :ref="field.code" :code="field.code" :config="field" v-model="field.value"/>
                </el-form-item>
            </el-form>
        </div>
        <el-button style="margin-top: 16px;" type="primary" size="small" v-if="config.isMultiple" @click="addDetail">
            添加数据
        </el-button>
    </div>
</template>

<script>
    import MemberEditField from './MemberEditField';

    export default {
        name: "MemberDetailEditField",
        components: {MemberEditField},
        props: ["config", "code", "value"],
        data() {
            return {
                defaultConfig: []
            }
        },
        created() {
            let array = [];

            this.config.detailList[0].map(detail=>{
                array.push({...detail,value:null});
            });
            this.defaultConfig = array;
        },
        methods: {
            hidden(){
                for(let ref in this.$refs){
                    let item = this.$refs[ref];
                    if(Array.isArray(item)){
                        if(item[0]){
                            item[0].hidden();
                        }
                    }
                }
            },
            addDetail() {
                let array = JSON.parse(JSON.stringify(this.defaultConfig));
                this.config.detailList.push(array);
            },
            deleteDetail(index){
                let array = JSON.parse(JSON.stringify(this.config.detailList));
                array.splice(index,1);

                this.config.detailList = [];
                this.$nextTick(()=>{
                    this.config.detailList = array;
                });

            }
        }
    }
</script>
