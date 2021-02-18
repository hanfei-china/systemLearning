<template>
  <el-container class="background-color-white absolute-fill-parent">
    <el-header class="border-bottom flex flex-space-between flex-align-center">
      <p class="title">首页轮播图</p>
      <div>
        <el-button size="small" type="primary" icon="el-icon-circle-plus-outlin" @click="editRow('')">增加轮播图</el-button>
        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteRow('')">删除</el-button>
      </div>
    </el-header>
    <el-main class="position-relative padding">
      <div class="padding-vertical">
        <el-checkbox v-if="bannerList.length" v-model="allChecked" @change="checkAll">全选</el-checkbox>
      </div>
      <draggable @update="datadragEnd" :options="{animation:500}">
        <div
            class="flex padding-vertical flex-align-center"
            v-for="item of bannerList" :key="item.id"
        >
          <!--          checkbox-->
          <div class="flex flex-align-center">
            <el-checkbox v-model="item.checked" style="margin-right: 14px"/>
            <img style="width:16px;object-fit:contain;cursor: move;margin-right: 14px;display: block;"
                 src="../../../../assets/drag.png"/>
          </div>
          <!--          右侧内容区-->
          <template>
            <!--            编辑模块-->
            <EditCarouse @refresh="refresh" :editId="editId" @close="item.editing=false" v-if="item.editing"/>
            <!--            展示模块-->
            <div v-else class="flex flex-fill-in-the-remaining-space">
              <!--            图片-->
              <div class="border" style="width: 185px;height: 100px;box-sizing: border-box">
                <img style="width:100%;height:100px;object-fit: cover" :src='item.picture' alt="">
              </div>
              <!--            内容-->
              <div style="margin-left: 23px;padding-right: 30px;" class="flex-fill-in-the-remaining-space">
                <!--              标题-->
                <div class="flex">
                  <h1 style="font-size: 16px;font-weight: 500;color:#555555" class="flex-fill-in-the-remaining-space"
                      v-html="item.title"></h1>
                  <div style="width: 150px" class="flex flex-end">
                    <span>{{ item.enable ? '启用' : '未启用' }}</span>
                    <el-switch style="margin-left: 10px;" @change="changeEffect(item.id,item.enable)"
                               v-model="item.enable"/>
                  </div>
                </div>
                <!--              描述-->
                <div class="flex flex-align-center border-top border-bottom" style="padding: 6px 0;margin-top: 14px">
                  <span style="white-space: nowrap;color: #888888">跳转链接</span>
                  <span style="width: 1px;height: 20px;background: #E8E8E8;margin: 0 14px"></span>
                  <div
                      style="margin-right: 13px;border-radius: 2px;border: 1px solid;color:#008CF8;font-size: 14px;padding:2px 6px"
                      :style="{color:getLinkTypeText(item.linkType).color,borderColor:getLinkTypeText(item.linkType).color }"
                      v-if="item.linkType"
                  >
                    {{ getLinkTypeText(item.linkType).title }}
                  </div>
                  <div class="flex-fill-in-the-remaining-space" style="color: #555555">
                    {{ item.link }}
                  </div>
                  <div style="width: 150px" class="flex flex-end">
                    <el-button @click="editRow(item.id)" type="text">修改</el-button>
                    <el-button type="text" class="custom-el-button danger" @click="deleteRow(item.id)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </template>

        </div>
      </draggable>
      <!--      新建-->
      <div v-if="editVisibility" class="flex padding-vertical flex-align-center">
        <!--          右侧内容区-->
        <EditCarouse :total="total" @refresh="refresh" @close="editVisibility=false" style="margin-left: 51px"/>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import draggable from 'vuedraggable'
import EditCarouse from "./EditCarouse";

export default {
  name: "carouselPicture",
  components: {
    draggable,
    EditCarouse
  },
  data() {
    return {
      queryParams: {
        offset: 0,
        limit: 1000
      },
      total: 0,
      // 是否全选
      allChecked: false,
      // 列表
      bannerList: [],
      // 新建
      editVisibility: false,
      // 编辑项
      editId: ''
    };
  },
  watch: {
    bannerList: {
      handler() {
        let num = 0
        this.bannerList.forEach(item => {
          num += item.checked
        })
        if (num === this.bannerList.length) {
          this.allChecked = true
        } else {
          this.allChecked = false
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取linkType匹配文字
    getLinkTypeText(type) {
      switch (type) {
        case '0':
          return {color: '#409EFF', title: '不跳转'}
        case '1':
          return {color: '#47C8E4', title: '图文'}
        case '2':
          return {color: '#EF7A7A', title: '活动'}
        case '3':
          return {color: '#008CF8', title: '商城宝贝'}
        case '6':
          return {color: '#409EFF', title: '外部链接'}
      }
    },
    getLinkText(type, val) {
      return new Promise(resolve => {
        if (type === '0') {
          resolve('')
        } else if (type === '1') {
          let str = ''
          new Promise(resolve => {
            this.$request.get('/api/admin/contentClass/list',).then(res => {
              res.data.forEach(item => {
                if (item.id === val[0]) {
                  str = str + item.title + ' / '
                  resolve()
                }
              })
            })
          }).then(() => {
            this.$request.get('/api/common/content/anon/list', {
              params: {
                classId: val[0],
                title: '',
                limit: 1000,
                offset: 0,
                topModel: true,
                isAdmin: true
              }
            }).then(res => {
              res.data.list.forEach(item => {
                if (item.id === val[1]) {
                  str += item.title
                  resolve(str)
                }
              })
            })
          })
        } else if (type === '2') {
          this.$request.get('/api/admin/activityInfo/getActivityInfosOfMyBranch', {
            params: {
              activityCategoryId: "",
              activityTitle: "",
              condition: 0,
              limit: 1000,
              offset: 0,
              branchId: "",
              activityStatus: "",
              isPublic: ""
            }
          }).then(res => {
            res.data.list.forEach(item => {
              if (item.id === val[0]) {
                resolve(item.theme)
              }
            })
          })
        } else if (type === '3') {
          let str = ''
          new Promise(resolve => {
            this.$request.get('api/admin/goods/category/getGoodsCategory',).then(res => {
              res.data.forEach(item => {

                if (item.id === val[0]) {
                  str = str + item.title + '/'
                  resolve()
                }
              })
            })
          }).then(() => {
            this.$request.get('/api/admin/goods/listGoodsInfoForAdmin', {
              params: {
                categoryId: val[0],
                limit: 1000,
                offset: 0,
                searchContent: ''
              }
            }).then(res => {

              res.data.list.forEach(item => {
                if (item.id === val[1]) {
                  str += item.goodsName
                  resolve(str)
                }
              })
            })
          })
        } else if (type === '6') {
          resolve(val)
        }
      })

    },
    // 全选及反选
    checkAll() {
      if (this.allChecked) {
        this.bannerList.forEach(item => {
          item.checked = true
        })
      } else {
        this.bannerList.forEach(item => {
          item.checked = false
        })
      }
    },
    // 拖拽
    datadragEnd(evt) {
      evt.preventDefault();
      let sortIdArr = []
      sortIdArr = this.bannerList.map(item => {
        return item.id
      })
      let temp = sortIdArr.splice(evt.oldIndex, 1)
      sortIdArr.splice(evt.newIndex, 0, temp[0])
      let params = {}
      for (let i = 0; i < sortIdArr.length; i++) {
        params[sortIdArr[i]] = i
      }
      this.$request.put('/api/admin/mp/banner/sort', {
        sorts: params
      }).then(() => {
        this.$message.success('排序成功')
      })
    },
    // 新建编辑
    editRow(id) {
      if (!id.length) {
        this.editVisibility = true
        return
      }
      this.editId = id
      this.bannerList.forEach(item => {
        if (item.id == id) {
          item.editing = true
        }
      })
    },
    // 更改启用状态
    changeEffect(id, val) {
      this.$request.put('/api/admin/mp/banner', {id: id, enable: val})
          .then(() => {
            this.$message.success('修改成功')
          })
    },
    // 删除row
    deleteRow(id) {
      let ids = []
      if (id.length) {
        ids.push(id)
      } else {
        this.bannerList.forEach(item => {
          if (item.checked) {
            ids.push(item.id)
          }
        })
      }
      if (ids.length === 0) {
        this.$message.warning('请选择要删除的元素')
      }
      this.$confirm('删除操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delete('/api/admin/mp/banner', {params: {ids: ids}}).then(() => {
          this.refresh()
          this.$message.success('删除成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    // 刷新
    refresh() {
      this.getList()
    },
    // 获取list
    getList() {
      const loading = this.$loading({
        look: true,
        fullscreen: true
      })
      this.$request.get('/api/admin/mp/banner', {params: this.queryParams}).then(res => {
        loading.close()
        if (Array.isArray(res.data.list)) {
          let arr = res.data.list;
          this.total = res.data.total
          if (arr.length === 0) {
            this.bannerList = []
            return
          }
          arr.forEach(item => {
            item.checked = false;
            item.editing = false
            let linkId = null
            if(['1','2','3'].includes(item.linkType)){
              linkId = JSON.parse(item.link)
            }else {
              linkId=item.link
            }
            this.getLinkText(item.linkType, linkId).then(res => {
              item.link = res
              this.bannerList = arr
            })
          })
        }
      })
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style scoped lang="less">
.flex-align-center {
  align-items: center;
}

.title {
  font-size: 16px;
  color: #222222;
  font-weight: 400;
  display: flex;
  align-items: center;
  line-height: 60px;
  position: relative;
  padding-left: 10px;
  box-sizing: border-box;

  &:after {
    display: block;
    content: "";
    clear: both;
    width: 3px;
    height: 15px;
    background: #3FA1B6;
    position: absolute;
    left: 0;
  }
}
</style>