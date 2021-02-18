<template>
    <el-container class="absolute-fill-parent background-color-white" style="z-index: 100;" v-if="visible">
        <el-header class="border-bottom flex flex-center flex-column">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-center flex-column" style="font-size: 14px;">
                    {{containerTitle}}
                </div>
                <div class="flex">
                    <el-button icon="el-icon-success" size="small" type="primary" @click="save">保存</el-button>
                    <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding"  style="overflow: hidden;">
            <vue-scroll>
                <div style="margin: 0 auto;max-width: 800px;padding: 16px 0;">
                    <el-form size="small" label-width="100px">
                        <el-form-item label="会议名称" required>
                            <el-input v-model="meetingEntity.title" placeholder="请输入会议名称，50字以内" :maxLength="50"/>
                        </el-form-item>
                        <div class="flex">
                            <el-form-item class="flex-fill-in-the-remaining-space" label="会议时间" required>
                                <el-date-picker type="datetime" v-model="meetingEntity.meetingTime"></el-date-picker>
                            </el-form-item>
                            <el-form-item class="flex-fill-in-the-remaining-space" label="会议类型" required>
                                <meeting-type-choose :disabled="!!meeting" v-model="meetingEntity.classId" style="width: 100%;"/>
                            </el-form-item>
                        </div>
                        <el-form-item label="会议地址" required>
                            <el-input v-model="meetingEntity.meetingAddress" type="textarea" :rows="5" resize="none" placeholder="请输入会议地址，200字以内" :maxLength="200"/>
                        </el-form-item>
                        <el-form-item label="会议内容" required>
                            <editor v-model="meetingEntity.meetingContent"/>
                        </el-form-item>
                    </el-form>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>

    import Editor from "../../../../../util/editor/Editor";
    import MeetingTypeChoose from "../../../../util/member/MeetingTypeChoose";
    export default {
        name: "MeetingForm",
        components: {MeetingTypeChoose, Editor},
        props:{
            meeting: Object,
            visible: Boolean
        },
        data(){
            return {
                meetingEntity: this.meeting ? {
                    classId: this.meeting.classId,
                    title: this.meeting.title,
                    meetingAddress: this.meeting.meetingAddress,
                    meetingContent: this.meeting.meetingContent,
                    meetingTime: this.meeting.meetingTime,
                } : {
                    classId: '',
                    title: '',
                    meetingAddress: '',
                    meetingContent: '',
                    meetingTime: new Date(),
                }
            }
        },
        computed:{
            containerTitle(){
                let title = '新建会议';
                if(this.meeting){
                    title = '编辑会议内容';
                }
                return title;
            }
        },
        methods:{
            save(){
                if(!this.meetingEntity.title){
                    this.$message.warning('请输入会议名称');
                    return;
                }

                if(!this.meetingEntity.meetingTime){
                    this.$message.warning('请选择会议时间');
                    return;
                }

                if(!this.meetingEntity.classId){
                    this.$message.warning('请选择会议类型');
                    return;
                }

                if(!this.meetingEntity.meetingAddress){
                    this.$message.warning('请输入会议地址');
                    return;
                }

                if(!this.meetingEntity.meetingContent){
                    this.$message.warning('请输入会议内容');
                    return;
                }


                if(this.meeting){
                    this.$request.put('/api/admin/meeting/updateMeeting',{...this.meetingEntity,id : this.meeting.id,seq:0}).then(()=>{
                        this.$message.success('会议信息编辑成功');
                        this.$emit('close');
                        this.$emit('refresh');
                    })
                }else{
                    this.$request.post('/api/admin/meeting/addMeeting',{...this.meetingEntity,seq:0}).then(()=>{
                        this.$message.success('会议新建成功');
                        this.$emit('close');
                        this.$emit('refresh');
                    })
                }
            }
        }
    }
</script>

