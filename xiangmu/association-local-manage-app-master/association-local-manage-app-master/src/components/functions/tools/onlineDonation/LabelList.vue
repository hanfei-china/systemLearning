<template>
    <el-container class="absolute-fill-parent">
        <el-header height="auto" class="flex" style="padding: 16px;">
            <div class="flex-fill-in-the-remaining-space" style="height: 32px;">
                <el-page-header style="line-height: 32px;" @back="backtoLabelGroup" :content="donationMoneyInfo.title"></el-page-header>
            </div>
            <div>
                <el-button size="small" type="primary" @click="createLabel">添加金额</el-button>
            </div>
        </el-header>
        <el-main style="padding: 0 16px 16px;">
            <el-table :data="list" height="100%" class="custom-el-table header-gray" size="small" border stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="金额额度" prop="amount" show-tooltip-when-overflow></el-table-column>
                <el-table-column label="是否默认金额" show-tooltip-when-overflow>
                   <template v-slot="{row}">{{row.choice?"是":"否"}}</template> 
                </el-table-column>
                <el-table-column label="操作" width="240px">
                    <template v-slot="{row}">
                        <!-- <el-button size="small" type="text" class="unset-padding item-sort">排序</el-button> -->
                        <el-button size="small" type="text" class="unset-padding" @click="editLabel(row)">编辑</el-button>
                        <el-button size="small" type="text" class="unset-padding custom-el-button danger" @click="deleteLabel(row.id)">删除</el-button>
                        <el-button size="small" v-if="!row.choice" type="text" class="unset-padding" @click="setDefault(row.id,true)">设为默认</el-button>
                        <el-button size="small" v-else type="text" class="unset-padding custom-el-button danger" @click="setDefault(row.id,false)">取消默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <donor-money-dialog :dialogName="dialogName" :donorMoneyVisible="donorMoneyVisible" :donationId="donationId" :donorAmountObject="donorAmountObject" @closeDonorMoneydialog="closeDonorMoneydialog"></donor-money-dialog>
    </el-container>
</template>

<script>
    import Sortable from 'sortablejs';
    import DonorMoneyDialog from "./DonorMoneyDialog";
    // import LabelForm from "./util/LabelForm";
    export default {
        name: "LabelList",
        components: {DonorMoneyDialog},
        props: {
            donationMoneyInfo: Object
        },
        data(){
            return {
                list: [],//标签列表
                labelGroupId: null,//标签分组id

                labelFormTitle: '创建标签',
                labelFormVisible: false,
                labelInfo: {},//标签信息
                labelLength: '',//标签长度
                seq: 0,//排序

                donorMoneyVisible:false,
                donationId:'',
                donorAmountObject:"",
                dialogName:"",
            }
        },
        watch: {
            donationMoneyInfo: {
                handler: function () {
                    this.labelGroupId = this.donationMoneyInfo.id;
                    this.labelLength = this.donationMoneyInfo.textLength
                    this.getList();
                },
                immediate: true
            }
        },
        mounted() {
            // this.drag();
        },
        methods: {
            getList(sort){
                this.$request.get('/api/admin/onlineDonation/amountSetting',{params: {id: this.labelGroupId}}).then(res => {
                    if(res.success){
                        this.list = res.data;
                        this.seq = res.data.length;
                        // if(sort){
                        //     this.sortFields();
                        // }
                    }
                })
            },
            setDefault(id,bol){
                this.$request.put('/api/admin/onlineDonation/choice',{
                    choice: bol,id,donationId:this.donationMoneyInfo.id
                }).then((r)=>{
                    this.getList()
                })
            },
            //添加金额
            createLabel(){
              this.donorMoneyVisible = true;
              this.donationId = this.labelGroupId;
              this.dialogName = '添加金额';
            },
            //编辑金额
            editLabel(row){
                this.donorMoneyVisible = true;
                this.donationId = this.labelGroupId;
                this.donorAmountObject = row;
                this.dialogName = '编辑金额';
            },
            closeDonorMoneydialog(){
                this.donorMoneyVisible = false;
                this.getList();
            },
            //删除标签
            deleteLabel(id){
                this.$confirm('此操作将永久删除该金额, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$request.delete('/api/admin/onlineDonation/amountSetting',{params: {id: id}}).then(res=>{
                        if(res.success){
                            this.$message.success('该金额已删除');
                            this.getList();
                        }
                    })
                })
            },
            backtoLabelGroup(){
                this.$emit('closeLabelList')
            },
            //标签排序
            drag() {
                let table = document.querySelector('tbody');
                Sortable.create(table, {
                    disabled: false,
                    handle: '.item-sort',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '');
                    },
                    onEnd: (evt) => {
                        let {oldIndex, newIndex} = evt;
                        let copyValue = JSON.parse(JSON.stringify(this.list));

                        if (oldIndex < newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex + 1, 0, oldItem);
                            copyValue.splice(oldIndex, 1);
                            this.sortFields(copyValue, true);
                        }

                        if (oldIndex > newIndex) {
                            let oldItem = copyValue[oldIndex];
                            copyValue.splice(newIndex, 0, oldItem);
                            copyValue.splice(oldIndex + 1, 1);
                            this.sortFields(copyValue, true);
                        }
                    }
                });
            },
            sortFields(fieldList, refresh) {
                if (!fieldList) {
                    fieldList = this.list;
                }

                let labelList = fieldList.map(item => {
                    return item.id;
                });

                if(labelList.length > 0){
                    this.$request.post('/api/admin/order/orderFields', {idList: labelList, tableName: 'association_label'}).then(data => {
                        if (data.success) {
                            if (refresh) {
                                this.$message.success("修改顺序成功");
                                this.list = [];
                                setTimeout(() => {
                                    this.getList();
                                }, 1);
                            }
                        }
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>