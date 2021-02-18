<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="上传本地视频" name="first">
        <div class="video-upload">
          <div class="video-preview">
            <div class="video-player" v-show="copyFileId">
              <video ref="myVideo" class="video-js vjs-big-play-centered">
                <source v-show="copyVideoUrl" :src="defaultVideoUrl" type="video/mp4" />
              </video>
            </div>
            <div v-show="uploading" class="upload-progress-container">
              <div class="upload-progress-wrapper">
                <el-progress type="circle" :percentage="percentage" :status="status" :width="80"></el-progress>
              </div>
            </div>
          </div>
          <el-upload
            class="upload-demo"
            :show-file-list="false"
            action="custom"
            :http-request="uploadImage"
            accept="video/mp4"
          >
            <el-button size="small" type="primary">{{btnTitle}}</el-button>
            <div slot="tip" class="el-upload__tip">请选择MP4格式的视频进行上传，为了更好的观看体验，视频应小于{{maxVideoSize}}</div>
          </el-upload>
        </div>
      </el-tab-pane>
      <el-tab-pane label="上传腾讯视频" name="second">
        <el-input placeholder="请输入腾讯视频地址" v-model="texunVid" @blur="uploadVid">
          <template slot="prepend">Http://</template>
        </el-input>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "VideoUpload",
  props: {
    btnTitle: {
      type: String,
      default() {
        return "上传视频";
      }
    },
    videoUrl: {
      type: String,
      default() {
        return "";
      }
    },
    fileId: {
      type: String,
      default() {
        return null;
      }
    },
    maxSize: {
      type: Number,
      default() {
        return 200 * 1024 * 1024;
      }
    },
    vid:{
        type:String,
        default(){
            return ' '
        }
    }
  },
  data() {
    return {
      uploading: false,
      percentage: 0,
      copyFileId: this.fileId,
      copyVideoUrl: this.videoUrl,
      player: null,
      clock: null, //上传定时器，防止session过期
      activeName: "first",
      texunVid: ""
    };
  },
  model: {
    prop: "videoUrl",
    event: "success"
  },
  computed: {
    status() {
      if (this.percentage >= 100) {
        return "success";
      } else if (this.percentage < 0) {
        return "exception";
      } else {
        return null;
      }
    },
    maxVideoSize() {
      let _G = this.maxSize / 1024 / 1024 / 1024;
      let _M = this.maxSize / 1024 / 1024;
      let _Kb = this.maxSize / 1024 + "";

      if (_G >= 1) {
        let temp = String(_G).indexOf(".") + 1;
        if (temp > 0) {
          return _G.toFixed(2) + "G";
        } else {
          return _G + "G";
        }
      } else {
        if (_M >= 1) {
          let y = String(_M).indexOf(".") + 1;
          if (y > 0) {
            return _M.toFixed(2) + "M";
          } else {
            return _M + "M";
          }
        } else {
          return parseInt(_Kb) + "Kb";
        }
      }
    },
    vodAppId() {
      return this.$store.state.vodAppId;
    },
    defaultVideoUrl() {
      return (
        this.copyVideoUrl ||
        "http://1258290975.vod2.myqcloud.com/198a8132vodcq1258290975/2b04277b5285890794327432888/arfA4t8WkKUA.mp4"
      );
    }
  },
  methods: {
    uploadVid() {
      // this.$emit("update:fileId", ' ');
      // this.$emit("update:linkAddress", ' ');
      this.$emit("update:vid", this.texunVid);
    },
    beforeUpload(file) {
      if (!file) {
        this.$message.warning("请选择要上传的视频");
        return false;
      } else {
        if (file.size > this.maxSize) {
          this.$message.warning(
            "上传失败，上传视频大小应小于于" + this.maxVideoSize
          );
          return false;
        }
        this.uploading = true;
        this.startSendPulse();
        return true;
      }
    },
    startSendPulse() {
      if (!this.clock) {
        //每一个半小时请求一下接口
        this.clock = window.setInterval(() => {
          this.$request.get("/api/common/pulse").then(() => {});
        }, 1000 * 60 * 120);
      }
    },
    stopSendPulse() {
      if (!this.clock) {
        window.clearInterval(this.clock);
        this.clock = null;
      }
    },
    uploadImage(elUpload) {
      let qcVideo = window.qcVideo;
      let file = elUpload.file;
      if (this.beforeUpload(file)) {
        this.$request.get("/api/admin/content/vodSignature").then(res => {
          let signature = res.data;

          function getSignature(callback) {
            return callback(signature);
          }

          let that = this;

          qcVideo.ugcUploader.start({
            videoFile: file,
            getSignature: getSignature,
            error: function(result) {
              that.stopSendPulse();
              that.percentage = -1;
              that.$message.warning("上传失败：" + result.msg);
            },
            progress: function(result) {
              that.percentage = parseFloat((result.curr * 100).toFixed(2));
            },
            finish: function(result) {
              //上传成功时的回调函数
              that.copyFileId = result.fileId;
              that.copyVideoUrl = result.videoUrl;
                that.$emit("success", result.videoUrl);
              that.uploading = false;
              that.$emit("update:fileId", result.fileId);
              that.$emit("update:linkAddress", result.videoUrl);
              that.$emit("update:vid", ' ');
              that.$message.success("视频上传成功");
              that.percentage = 0;
              that.stopSendPulse();
            }
          });
        });
      }
    },
    playVideo() {
      if (this.copyVideoUrl) {
        if (!this.player) {
          //初始化视频方法
          this.player = this.$video(this.$refs.myVideo, {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: true,
            //自动播放属性,muted:静音播放
            autoplay: "muted",
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            //设置视频播放器的显示宽度（以像素为单位）
            width: 300,
            //设置视频播放器的显示高度（以像素为单位）
            height: 150
          });
          this.player.play();
        }

        this.player.off("timeupdate");
        this.player.reset();
        this.player.src({ src: this.copyVideoUrl, type: "video/mp4" });
        this.player.play();
      }
    }
  },
  watch: {
    defaultVideoUrl() {
      this.playVideo();
    },
    fileId() {
      this.copyFileId = this.fileId;
    },
    videoUrl() {
      this.copyVideoUrl = this.videoUrl;
    },
    vid(val) {
      this.texunVid=val;
      if (val&&val!=' ') {
          this.activeName="second";
      }else{
          this.activeName='first';
      }
    }
  },
  mounted() {
    this.playVideo();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
    this.stopSendPulse();
  }
};
</script>

<style scoped>
.video-upload {
  display: flex;
}

.video-preview {
  position: relative;
  flex: 0 0 300px;
  width: 300px;
  height: 150px;
  /*background-color: #333333;*/
  background: url("video.jpeg") no-repeat center;
}

.upload-demo {
  align-self: flex-end;
  padding-bottom: 20px;
  padding-left: 20px;
}

.upload-progress-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(3, 3, 3, 0.85);
  z-index: 930528;
}

.upload-progress-wrapper {
  text-align: center;
}
</style>
