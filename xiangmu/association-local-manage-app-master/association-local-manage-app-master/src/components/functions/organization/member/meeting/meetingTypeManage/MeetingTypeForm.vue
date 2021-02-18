<template>
    <el-container>
        <el-main class="unset-padding"  style="overflow: hidden;">
            <el-form size="small" label-width="100px">
                <el-form-item label="类型名称" required>
                    <el-input v-model="meetingTypeEntity.title" placeholder="请输入类型名称，50字以内" :maxLength="50"/>
                </el-form-item>
                <el-form-item label="会员职务" required>
                    <member-post-choose style="width: 100%;" v-model="meetingTypeEntity.postIds" multiple/>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer height="auto" class="flex flex-column flex-center unset-padding">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="save">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import MemberPostChoose from "../../../../util/member/MemberPostChoose";
    export default {
        name: "MeetingTypeForm",
        components: {MemberPostChoose},
        props:{
            meetingType: Object,
            seq: Number
        },
        data(){
            return {
                meetingTypeEntity: Object.assign({
                    title: '',
                    postIds: []
                },this.meetingType)
            }
        },
        methods:{
            save(){
                if(!this.meetingTypeEntity.title){
                    this.$message.warning('请输入类型名称');
                    return;
                }

                if(!this.meetingTypeEntity.postIds || this.meetingTypeEntity.postIds.length<1){
                    this.$message.warning('请选择会员职务');
                    return;
                }

                if(this.meetingType){
                    this.$request.put('/api/admin/meeting/updateMeetingClass',{...this.meetingTypeEntity,id : this.meetingType.id,seq:this.meetingTypeEntity.seq}).then(()=>{
                        this.$message.success('会议类型修改成功');
                        this.$emit('close');
                        this.$emit('refresh');
                    })
                }else{
                    this.$request.post('/api/admin/meeting/addMeetingClass',{...this.meetingTypeEntity,seq:this.seq}).then(()=>{
                        this.$message.success('会议类型修改成功');
                        this.$emit('close');
                        this.$emit('refresh');
                    })
                }
            }
        }
    }
</script>

