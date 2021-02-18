<template>
  <el-container class="unset-padding">
    <el-main class="position-relative unset-padding">
      <div style="padding-bottom: 20px;line-height: 30px"
           v-if="createdNoticeDetail.source==='1'||createdNoticeDetail.source==='2'">
        <p>
          <i class="el-icon-warning" style="color: #E6A23C"></i> 提示：从“站群”或“微信公众号”添加的文章，可修改，但不会同步到“站群”或“微信公众号”</p>
      </div>
      <el-form :show-message="false" :model="createdNoticeDetail" label-width="80px">
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="createdNoticeDetail.title" size="small" placeholder="请输入标题内容，50字以内" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="发布时间" prop="createTime" required>
          <el-date-picker v-model="createdNoticeDetail.createTime" size="small" type="datetime" placeholder="请选择发布时间"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="阅读量" prop="views" required>
          <el-input-number v-model="createdNoticeDetail.views" size="small" :min="0"/>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-upload style="margin-right: 10px;margin-bottom: 10px;"
                     accept=".doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                     :show-file-list="false" :action="wordAction" :before-upload="wordBeforeUpload"
                     :on-success="wordUploadSuccess">
            <el-button icon="iconfont icon-word" size="small" type="primary" plain>从word中导入内容</el-button>
            <div slot="tip" style="padding-top: 4px;">
              <span class="danger-tip">推荐使用【.docx】类型文件，【.doc】类型建议另存为【.docx】后进行解析</span>
            </div>
          </el-upload>
          <editor v-loading="loading"
                  v-model="createdNoticeDetail.content"
                  :initialFrameHeight="250"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  element-loading-text="内容解析中..." ref="editor"/>
        </el-form-item>
        <el-form-item label="附件：">
          <multiple-upload v-model="createdNoticeDetail.attachments"/>
        </el-form-item>
      </el-form>
      <el-footer class="unset-padding flex flex-end">
        <el-button class="plainBtnClass" size="small" @click="$emit('close')">取消</el-button>
        <el-button class="primaryBtnClass" size="small" @click="saveNotice">确定</el-button>
      </el-footer>
    </el-main>
  </el-container>
</template>
<script>
import {requestBaseUrl} from "@/js/config/serviceConfig";
import Editor from "@/components/util/editor/Editor";
import MultipleUpload from "@/components/functions/util/upload/MultipleUpload";

export default {
  name: 'editCreatedNotice',
  props: ['editCreatedNoticeId', 'noticeListLength'],
  components: {Editor, MultipleUpload},
  data() {
    return {
      wordAction: requestBaseUrl + '/api/common/parse/word',
      loading: false,
      createdNoticeDetail: {},
    }
  },
  methods: {
    wordUploadSuccess(response) {
      this.$refs.editor.appendContent(response.data);
      this.loading = false;
    },
    wordBeforeUpload() {
      this.loading = true;
    },
    getCreatedNoticeDetail() {
      if (this.editCreatedNoticeId === '') {
        this.createdNoticeDetail = {
          articleTime: '',
          content: '',
          createTime: '',
          creator: '',
          enable: false,
          picture: '',
          seq: this.noticeListLength,
          source: '0',
          sourceExtends: '',
          sourceId: '',
          title: '',
          updateTime: '',
          views: 0,
          attachments: []
        }
      } else {
        this.$request.get('/api/admin/mp/notice/detail', {params: {id: this.editCreatedNoticeId}}).then(res => {
          this.createdNoticeDetail = {
            ...res.data,
            attachments: res.data.attachments?JSON.parse(res.data.attachments):[]
          }
        })
      }
    },
    saveNotice() {
      if (!this.createdNoticeDetail.title) {
        this.$message.warning('请输入公告标题')
        return
      }
      if (!this.createdNoticeDetail.createTime) {
        this.$message.warning('请选择发布时间')
        return;
      }
      let params = {
        ...this.createdNoticeDetail,
        attachments:JSON.stringify(this.createdNoticeDetail.attachments)
      }
      const loading = this.$loading({lock: true, fullscreen: true})
      if (this.editCreatedNoticeId) {
        this.$request.put('/api/admin/mp/notice', params).then(() => {
          loading.close()
          this.$message.success('修改公告成功')
          this.$emit('close')
          this.$emit('refreshList')
        })
      } else {
        this.$request.post('/api/admin/mp/notice', params).then(() => {
          loading.close()
          this.$message.success('添加公告成功')
          this.$emit('close')
          this.$emit('refreshList')
        })
      }
    }
  },
  created() {
    this.getCreatedNoticeDetail()
  }
}
</script>
