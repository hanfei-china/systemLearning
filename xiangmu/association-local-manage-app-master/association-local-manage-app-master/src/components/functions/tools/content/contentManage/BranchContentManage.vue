<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding position-relative" >
      <el-container class="absolute-fill-parent" v-show="!contentFormVisible" style="padding: 0 16px;">
        <el-header class="flex flex-column flex-center unset-padding">
          <div class="flex">
            <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">
              <div class="flex">
                <el-input style="max-width: 450px;" v-model="title" clearable placeholder="请输入内容进行搜索" size="small" />
              </div>
            </div>
            <div><el-button type="primary" size="small" @click="addContent">新增内容</el-button></div>
          </div>
        </el-header>
        <el-main class="position-relative unset-padding">
          <el-table size="small" :data="list" height="100%" class="custom-el-table header-gray" border stripe>
            <el-table-column label="序号" width="50" fixed>
              <template v-slot="{$index}">
                <div class="text-align-center">
                  {{$index+1}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="标题" show-tooltip-when-overflow>
              <template v-slot="{row}">
                <div class="flex">
                  <content-icon style="margin-right: 10px;" :content-type="row.contentType" :file-name="row.otherId" />
                  <a v-if="row.contentType === 0 || row.contentType === 6 || row.contentType === 7" :href="$router.resolve(`/contentDetail/${row.id}`).href" target="_blank"
                    class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{
                                        row.title }}</a>
                  <a v-else-if="row.contentType === 1 || row.contentType === 3" :href="row.linkAddress" target="_blank" class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{
                                        row.title }}</a>
                  <a v-else-if="row.contentType === 2" :href="$router.resolve(`/contentDetail/${row.otherId}`).href" target="_blank" class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline">{{
                                        row.title }}</a>
                  <a v-else-if="row.contentType === 5" class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline" :href="download+row.id">{{ row.title }}</a>
                  <a v-else-if="row.contentType === 4" class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline" @click.stop="videoDetail(row)">{{ row.title }}</a>
                  <a v-else-if="row.contentType === 8" class="text-overflow flex-fill-in-the-remaining-space cursor-pointer lrd-a underline" @click.stop="audioDetail(row)">{{ row.title }}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="100">
              <template v-slot="{row}">
                <span>{{row.contentType | contentType}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发布时间" width="140">
              <template v-slot="{row}">
                <span>{{ row.publishTime | yyyyMMddHHmm}}</span>
              </template>
            </el-table-column>
            <el-table-column label="已发布" width="70">
              <template v-slot="{row}">
                <div style="text-align: center;">
                  <el-switch v-model="row.isPublish" @change="switchPublishStatus(row)"></el-switch>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="更多操作" width="190" fixed="right">
              <template v-slot="{row}">
                <el-button size="mini" class="unset-padding" @click="editContent(row)" type="text">编辑
                </el-button>
                <el-button size="mini" class="custom-el-button danger" @click="deleteContent(row)" type="text">删除
                </el-button>

                <el-button size="mini" class="unset-padding" type="text" v-if="row.contentType === 4" @click="videoDetail(row)">播放
                </el-button>
                <el-button size="mini" class="unset-padding" type="text" v-if="row.contentType === 5" @click="downloadFile(row)">下载
                </el-button>

                <el-button size="mini" class="unset-padding" type="text" @click="setTop(row)" v-if="!row.isTop">置顶
                </el-button>
                <el-button size="mini" class="unset-padding" type="text" @click="cancelTop(row)" v-if="row.isTop">取消置顶
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer height="auto" class="unset-padding">
          <div style="padding-bottom: 16px;padding-top: 16px;" class="flex">
            <div class="flex-fill-in-the-remaining-space"></div>
            <div>
              <el-pagination background :total="total" :page-size="page.pageSize" :current-page="page.pageNum" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,50]" @size-change="sizeChange"
                @current-change="currentChange" />
            </div>
          </div>
        </el-footer>
      </el-container>
      <content-form @close="contentFormVisible = false" v-if="contentFormVisible" @refresh="refresh" :id="contentFormId"  :original-content-type="contentType" />
    </el-main>
    <el-dialog :visible.sync="contentTypeChooseVisible" title="内容类型选择" width="558px" append-to-body :close-on-click-modal="false">
      <div class="flex flex-wrap">
        <el-card @click.native="openContentForm(0)" class="cursor-pointer content-type-item flex flex-column flex-center" shadow="hover">
          <div class="flex">
            <div class="content-type-item-icon" :style="{backgroundImage:`url(${contentIcon})`}"></div>
            <div class="content-type-item-title">图文</div>
          </div>
        </el-card>
        <el-card @click.native="openContentForm(4)" class="cursor-pointer content-type-item flex flex-column flex-center" shadow="hover">
          <div class="flex">
            <div class="content-type-item-icon" :style="{backgroundImage:`url(${videoIcon})`}"></div>
            <div class="content-type-item-title">视频</div>
          </div>
        </el-card>
        <el-card @click.native="openContentForm(8)" class="cursor-pointer content-type-item flex flex-column flex-center" shadow="hover">
          <div class="flex">
            <div class="content-type-item-icon" :style="{backgroundImage:`url(${audioIcon})`}"></div>
            <div class="content-type-item-title">音频</div>
          </div>
        </el-card>
      </div>
      <div class="flex flex-wrap" style="margin-top: 16px;">
        <el-card @click.native="openContentForm(1)" class="cursor-pointer content-type-item flex flex-column flex-center" shadow="hover">
          <div class="flex">
            <div class="content-type-item-icon" style="background-size: 40px 40px;" :style="{backgroundImage:`url(${linkIcon})`}"></div>
            <div class="content-type-item-title">链接</div>
          </div>
        </el-card>
        <el-card @click.native="openContentForm(5)" class="cursor-pointer content-type-item flex flex-column flex-center" shadow="hover">
          <div class="flex">
            <div class="content-type-item-icon" style="background-size: 40px 40px;" :style="{backgroundImage:`url(${otherIcon})`}"></div>
            <div class="content-type-item-title">文件</div>
          </div>
        </el-card>
        <el-card @click.native="openUploadForm" class="cursor-pointer content-type-item flex flex-column flex-center" shadow="hover">
          <div class="flex">
            <div class="content-type-item-icon" style="background-size: 40px 40px;" :style="{backgroundImage:`url(${enclosureIcon})`}"></div>
            <div class="content-type-item-title">批量上传</div>
          </div>
        </el-card>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="fileUploadVisible" :title="fileUploadTitle" append-to-body width="600px">
      <el-upload v-if="fileUploadVisible" ref="upload" :action="action" :http-request="httpRequest" :on-remove="removeFile" :auto-upload="false" :file-list="fileList" :before-upload="beforeUpload" :on-change="onChange"
        multiple>
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">单个文件大小应小于20M</div>
      </el-upload>
      <template v-slot:footer>
        <el-button icon="el-icon-error" type="danger" size="small" @click="fileUploadVisible=false">取消
        </el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="uploadFile">确定上传</el-button>
      </template>
    </el-dialog>
    <el-dialog :visible.sync="videoDisplayVisible" title="视频播放" append-to-body width="600px">
      <video-display v-if="videoDisplayVisible" :content="videoContent" videoWidth="560px" videoHeight="300px"></video-display>
    </el-dialog>
    <el-dialog :visible.sync="audioDisplayVisible" title="音频播放" append-to-body width="600px">
      <audio style="width: 100%;" v-if="audioDisplayVisible" :src="audioContent.linkAddress" autoplay controls></audio>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  contentIcon,
  enclosureIcon,
  linkIcon,
  videoIcon,
  otherIcon,
  audioIcon,
} from "../../../../../js/util/assetStore";
import ContentClassMenu from "../contentClassManage/ContentClassMenu";
import ContentForm from "./BranchContentForm";
import BatchOperation from "../../../../util/BatchOperation";
import AdminContentClassResources from "../contentClassManage/AdminContentClassResources";
import ContentIcon from "../../../../svg/ContentIcon";
import { requestBaseUrl } from "../../../../../js/config/serviceConfig";
import VideoDisplay from "./util/VideoDisplay";

export default {
  name: "ContentManage",
  components: {
    VideoDisplay,
    ContentIcon,
    AdminContentClassResources,
    BatchOperation,
    ContentForm,
    ContentClassMenu,
  },
  data() {
    return {
      page: {
        pageSize: 20,
        pageNum: 1,
      },
      title: "",
      total: 0,
      list: [],

      contentTypeChooseVisible: false,
      contentIcon,
      enclosureIcon,
      linkIcon,
      videoIcon,
      otherIcon,
      audioIcon,

      contentType: 0,
      contentFormVisible: false,
      contentFormId: null,

      fileUploadVisible: false,
      fileUploadTitle: "批量上传",
      fileList: [],
      action: requestBaseUrl + "/api/common/anon/uploadFile",
      download: requestBaseUrl + "/api/common/content/anon/download/",
      videoDisplayVisible: false,
      videoContent: {},
      audioDisplayVisible: false,
      audioContent: {},
    };
  },
  computed: {
    condition() {
      return {
        title: this.title,
        limit: this.page.pageSize,
        topModel: true,
        offset: 0,
        isAdmin: true,
      };
    },
  },
  methods: {
    addContent() {
      this.contentTypeChooseVisible = true;
    },
    refresh() {
      this.page.pageNum = 1;
      this.getList();
    },
    sizeChange(size) {
      this.page.pageSize = size;
      this.refresh();
    },
    currentChange(current) {
      this.condition.offset = (current - 1) * this.page.pageSize;
      this.getList();
    },
    getList() {
      this.$request.get("/api/admin/content/list", { params: this.condition }).then((resp) => {
        let { data } = resp;
        this.list = data.list;
        this.total = data.total;
      });
    },
    openContentForm(contentType) {
      this.contentTypeChooseVisible = false;
      this.contentType = contentType;
      this.contentFormId = null;
      this.contentFormVisible = true;
    },
    openUploadForm() {
      this.contentTypeChooseVisible = false;
      this.fileUploadVisible = true;
    },
    editContent(row) {
      this.contentType = row.contentType;
      this.contentFormId = row.id;
      this.contentFormVisible = true;
    },
    deleteContent(row) {
      this.$msgbox
        .confirm("删除操作是不可逆的，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除",
        })
        .then(() => {
          this.$request
            .delete("/api/admin/content", {
              params: { id: row.id },
            })
            .then((data) => {
              if (data.success) {
                this.getList();
                this.$message.success(`【${row.title}】已成功删除`);
              }
            });
        })
        .catch(() => {});
    },
    setTop(row) {
      this.$request
        .put("/api/admin/content/topStatus", {
          id: row.id,
          isTop: true,
        })
        .then(() => {
          row.isTop = true;
          this.getList();
        });
    },
    cancelTop(row) {
      this.$request
        .put("/api/admin/content/topStatus", {
          id: row.id,
          isTop: false,
        })
        .then(() => {
          row.isTop = false;
          this.getList();
        });
    },
    switchPublishStatus(row) {
      if (!row.isPublish) {
        this.$msgbox
          .confirm("此操作将取消发布该内容, 是否继续?", "提示", {
            type: "warning",
            confirmButtonText: "确定",
          })
          .then(() => {
            this.$request
              .put("/api/admin/content/publishStatus", {
                id: row.id,
                isPublish: false,
              })
              .then(() => {
                row.isPublish = false;
                this.$message.success(`【${row.title}】已取消发布`);
              });
          })
          .catch(() => {});
      } else {
        this.$request
          .put("/api/admin/content/publishStatus", {
            id: row.id,
            isPublish: true,
          })
          .then(() => {
            row.isPublish = true;
            this.$message.success(`【${row.title}】已成功发布`);
          });
      }
    },
    uploadFile() {
      this.$refs.upload.submit();
    },
    httpRequest(elFile) {
      let { file } = elFile;
      let { uid, name } = file;
      let data = new FormData();
      let listFile = null;
      this.fileList.map((item) => {
        if (item.uid === uid) {
          listFile = item;
        }
      });
      if (listFile) {
        listFile.status = "progress";
        data.append("file", file);
        this.$request
          .post("/api/common/anon/uploadFile", data)
          .then((response) => {
            let url = response.data;

            let content = {
              contentType: 5,
              content: "",
              contentAbstract: "",
              contentLabels: null,
              isPublish: false,
              isTop: false,
              linkAddress: url,
              otherId: name,
              poster: null,
              publishTime: new Date(),
              title: name,
              classId: "7C1752662F03429B921CF47159B84F1F",
              readingNum: 0,
            };

            this.$request.post("/api/admin/content", content).then(() => {
              listFile.url = url;
              listFile.status = "success";
              this.allCreated();
            });
          });
      }
    },
    onChange(file, fileList) {
      this.fileList = fileList;
    },
    allCreated() {
      let allCreated = true;
      for (let listFile of this.fileList) {
        if (listFile.status !== "success") {
          allCreated = false;
          break;
        }
      }

      if (allCreated) {
        this.$message.success("文件已批量上传");
        this.refresh();
        this.fileUploadVisible = false;
        this.fileList = [];
      }
    },
    removeFile(file, fileList) {
      this.fileList = fileList.filter((tempFile) => {
        return tempFile.uid !== file.uid;
      });
    },
    beforeUpload(file) {
      if (file.size > 100 * 1024 * 1024) {
        this.$message.warning("上传失败，文件大小应不大于100M");
        return false;
      }
      return true;
    },

    videoDetail(row) {
      this.videoDisplayVisible = true;
      this.videoContent = row;
    },
    audioDetail(row) {
      this.audioDisplayVisible = true;
      this.audioContent = row;
    },
    downloadFile(row) {
      window.open(this.download + row.id);
    },
  },
  created() {
    this.refresh();
  },
  watch: {
    condition() {
      this.refresh();
      this.contentFormVisible = false;
    },
    title() {
      this.refresh();
    },
  },
};
</script>
