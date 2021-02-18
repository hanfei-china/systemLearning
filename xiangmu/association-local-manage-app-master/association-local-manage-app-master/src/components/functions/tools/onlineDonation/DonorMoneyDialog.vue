<template>
  <el-dialog :title="dialogName" :visible.sync="donorMoneyVisible" append-to-body class="donor-money-visible" width="500px" :before-close="cancelAddDonorMoney"> 
      <el-form :model="addMoneyForm">
          <el-form-item :label="dialogName" label-width="120" required>
          <el-input v-model="addMoneyForm.amount"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddDonorMoney" size="small">取 消</el-button>
          <el-button type="primary" @click="confirmAddDonorMoney('1')" size="small" v-if="dialogName=='添加金额'">保存并继续</el-button>
          <el-button type="primary" @click="confirmAddDonorMoney('2')" size="small">确 定</el-button>
      </div>
  </el-dialog>
</template>
<script>
export default {
  props:['donationId','dialogName','donorMoneyVisible','donorAmountObject'],
  data(){
    return{
      addMoneyForm:{
          amount:""
      },
    }
  },
  watch:{
    donorMoneyVisible(nval){
      if(nval==true){
        if(this.dialogName=='编辑金额'){
          this.addMoneyForm.amount = this.donorAmountObject.amount;
        }
      }
    }
  },
  methods:{
    cancelAddDonorMoney(){
        this.addMoneyForm.amount = '';
        this.$emit('closeDonorMoneydialog')
    },
    confirmAddDonorMoney(type){
      if(this.addMoneyForm.amount==''){
          this.$message.warning('请输入需要添加的金额！');
      }else{
        if(this.dialogName=='添加金额'){
          this.$request.post('/api/admin/onlineDonation/amountSetting',{
            amount: this.addMoneyForm.amount,
            id: this.donationId,
          }).then(res=>{
              if(res.success){
                  this.$message.success('金额添加成功！');
                  this.addMoneyForm.amount = '';
                  if(type=='2'){
                      this.$emit('closeDonorMoneydialog')
                  }
              }
          })
        }else{
          this.$request.put('/api/admin/onlineDonation/amountSetting',{
            amount: this.addMoneyForm.amount,
            id: this.donorAmountObject.id,
          }).then(res=>{
              if(res.success){
                  this.$message.success('金额修改成功！');
                  this.addMoneyForm.amount = '';
                  if(type=='2'){
                      this.$emit('closeDonorMoneydialog')
                  }
              }
          })
        }
      }
    },
  }
}
</script>