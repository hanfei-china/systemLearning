<template>
  <div :style="style"
       style="overflow: auto;"
       class="website-pro-module website-pro-absolute-fill-parent website-pro-form-list"
       :class="customClasses">
    <div class="form-tag-list">
      <div class="form-tag-item"
           :class="{active: selectedTag === ''}"
           @click="tagSelect('')">
        全部
      </div>
      <div v-for="item in contentList"
           :key="item.code"
           class="form-tag-item"
           :class="{active: selectedTag === item.code}"
           @click="tagSelect(item.code)">
        {{item.content}}
      </div>
    </div>
    <div v-if="total" class="form-data-list">
      <div v-for="(item, index) in formDataList"
           :key="index"
           class="form-data-item">
        <div class="form-data-title">
          {{item[titlePropCode]}}
        </div>
        <div class="form-data-footer">
          <div v-for="(dataTag, index) in dataPropCodes"
               :key="index"
               class="form-data-tag">
            {{dataTag.title}}：
            <span>{{item[dataTag.code]}}</span>
          </div>
          <div v-if="linkBtn" class="form-data-link-btn" @click="linkClick(item)">{{linkTitle}}</div>
          <div v-if="propDetails.length" class="form-data-more-btn" @click="item['_expand'] = !item['_expand']">
            {{item['_expand'] ? '收起>' : '更多>'}}
          </div>
        </div>
        <div v-show="item['_expand']" class="form-data-details">
          <div v-for="propDetail in propDetails"
               :key="propDetail.id"
               v-if="propDetail.type !== 7 || item[propDetail.code]"
               class="form-data-detail-item">
            <p class="form-data-detail-name">
              {{propDetail.title}}：
            </p>
            <p v-if="propDetail.type !== 7" class="form-data-detail-value">
              {{item[propDetail.code]}}
            </p>
          </div>
        </div>
      </div>
      <el-pagination :current-page="pageNumber" background :page-size="pageSize"
                      :total="total" :pager-count="5"
                      layout="total, ->, prev, pager, next, jumper"
                      @current-change="pageChange">
      </el-pagination>
    </div>
    <div v-else class="form-no-data">
      暂无数据
    </div>
  </div>
</template>
<script>
import {moreLink} from "../../../../js/util/util";

export default {
  props: {
    module: Object,
    design: Boolean
  },
  data() {
    return {
      formPropList: [],
      formDataList: [],
      contentList: [],
      selectedFormData: [],
      classId: '',
      formId: '',
      tagProp: '',
      tagPropCode: '',
      titleProp: '',
      linkBtn: false,
      linkTitle: '',
      linkUrl: '',
      linkColId: '',
      linkCode: '',
      selectedTag: '',
      dataProps: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
    }

  },
  computed: {
    propDetails () {
      if (this.formPropList ){
        let details = this.formPropList.filter(item => {
          return item.id != this.titleProp && item.id != this.tagProp && item.id != this.linkColId && !this.dataProps.includes(item.id)
        })
        return details
      } else {
        return []
      }
    },
    titlePropCode () {
      if (this.titleProp && this.formPropList) {
        let propObj = this.formPropList.find(prop => prop.id === this.titleProp);
        return propObj ? propObj.code : '';
      } else {
        return ''
      }
    },
    dataPropCodes () {
      if (this.dataProps && this.dataProps.length && this.formPropList) {
        let codes = this.dataProps.map(item => {
          let propObj = this.formPropList.find(prop => prop.id === item);
          return propObj || {};
        })
        return codes;
      } else {
        return []
      }
    },
    customClasses() {
      return this.module.attributes.otherGroup.attributes.customClasses.value;
    },
    boxShadow() {
      let boxShadow = this.module.attributes.styleGroup.attributes.boxShadow
        .value;
      return `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${
        boxShadow.blur
      }px ${boxShadow.spread}px ${boxShadow.color} ${
        boxShadow.insert ? "inset" : ""
      }`;
    },
    style() {
      let style = {
        borderTopLeftRadius:
          this.module.attributes.styleGroup.attributes.borderRadius.value
            .leftTop + "px",
        borderBottomLeftRadius:
          this.module.attributes.styleGroup.attributes.borderRadius.value
            .leftBottom + "px",
        borderTopRightRadius:
          this.module.attributes.styleGroup.attributes.borderRadius.value
            .rightTop + "px",
        borderBottomRightRadius:
          this.module.attributes.styleGroup.attributes.borderRadius.value
            .rightBottom + "px",

        borderTopColor: this.module.attributes.styleGroup.attributes.border
          .value.top.borderColor,
        borderTopStyle: this.module.attributes.styleGroup.attributes.border
          .value.top.borderStyle,
        borderTopWidth:
          this.module.attributes.styleGroup.attributes.border.value.top
            .borderWidth + "px",

        borderBottomColor: this.module.attributes.styleGroup.attributes.border
          .value.bottom.borderColor,
        borderBottomStyle: this.module.attributes.styleGroup.attributes.border
          .value.bottom.borderStyle,
        borderBottomWidth:
          this.module.attributes.styleGroup.attributes.border.value.bottom
            .borderWidth + "px",

        borderLeftColor: this.module.attributes.styleGroup.attributes.border
          .value.left.borderColor,
        borderLeftStyle: this.module.attributes.styleGroup.attributes.border
          .value.left.borderStyle,
        borderLeftWidth:
          this.module.attributes.styleGroup.attributes.border.value.left
            .borderWidth + "px",

        borderRightColor: this.module.attributes.styleGroup.attributes.border
          .value.right.borderColor,
        borderRightStyle: this.module.attributes.styleGroup.attributes.border
          .value.right.borderStyle,
        borderRightWidth:
          this.module.attributes.styleGroup.attributes.border.value.right
            .borderWidth + "px",

        boxShadow: this.boxShadow,

        paddingTop:
          this.module.attributes.styleGroup.attributes.padding.value.top + "px",
        paddingBottom:
          this.module.attributes.styleGroup.attributes.padding.value.bottom +
          "px",
        paddingLeft:
          this.module.attributes.styleGroup.attributes.padding.value.left +
          "px",
        paddingRight:
          this.module.attributes.styleGroup.attributes.padding.value.right +
          "px"
      };

      let {
        backgroundImage,
        backgroundColor,
        backgroundPositionX,
        backgroundPositionY,
        backgroundSize,
        backgroundRepeatX,
        backgroundRepeatY
      } = this.module.attributes.styleGroup.attributes.background.value;

      if (backgroundImage) {
        style.backgroundImage = `url(${backgroundImage})`;
      }

      if (backgroundColor) {
        style.backgroundColor = backgroundColor;
      }

      if (backgroundPositionX) {
        style.backgroundPositionX = backgroundPositionX;
      }

      if (backgroundPositionY) {
        style.backgroundPositionY = backgroundPositionY;
      }

      if (backgroundSize) {
        style.backgroundSize = backgroundSize;
      }

      if (backgroundRepeatX && backgroundRepeatY) {
        style.backgroundRepeat = "repeat";
      }

      if (backgroundRepeatX && !backgroundRepeatY) {
        style.backgroundRepeat = "repeat-x";
      }

      if (!backgroundRepeatX && backgroundRepeatY) {
        style.backgroundRepeat = "repeat-y";
      }

      if (!backgroundRepeatX && !backgroundRepeatY) {
        style.backgroundRepeat = "no-repeat";
      }

      if (!this.design) {
        style.width =
          this.module.attributes.layoutGroup.attributes.layout.value.width +
          "px";
        style.height =
          this.module.attributes.layoutGroup.attributes.layout.value.height +
          "px";
        style.height = 'auto';
        style.left =
          this.module.attributes.layoutGroup.attributes.layout.value.left +
          "px";
        style.top =
          this.module.attributes.layoutGroup.attributes.layout.value.top + "px";
        style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
        style.position = "absolute";
      }

      return style;
    },
    showTitle() {
      return this.module.attributes.titleGroup.attributes.showTitle.value;
    },
    showMore() {
      return this.module.attributes.titleGroup.attributes.showMore.value;
    },
    title() {
      return this.module.attributes.titleGroup.attributes.title.value;
    },
    titleContainerStyle() {
      let {
        titlePadding,
        titleBackground,
        titleBorder,
        titleBorderRadius
      } = this.module.attributes.titleGroup.attributes;

      let style = {
        borderTopLeftRadius: titleBorderRadius.value.leftTop + "px",
        borderBottomLeftRadius: titleBorderRadius.value.leftBottom + "px",
        borderTopRightRadius: titleBorderRadius.value.rightTop + "px",
        borderBottomRightRadius: titleBorderRadius.value.rightBottom + "px",

        borderTopColor: titleBorder.value.top.borderColor,
        borderTopStyle: titleBorder.value.top.borderStyle,
        borderTopWidth: titleBorder.value.top.borderWidth + "px",

        borderBottomColor: titleBorder.value.bottom.borderColor,
        borderBottomStyle: titleBorder.value.bottom.borderStyle,
        borderBottomWidth: titleBorder.value.bottom.borderWidth + "px",

        borderLeftColor: titleBorder.value.left.borderColor,
        borderLeftStyle: titleBorder.value.left.borderStyle,
        borderLeftWidth: titleBorder.value.left.borderWidth + "px",

        borderRightColor: titleBorder.value.right.borderColor,
        borderRightStyle: titleBorder.value.right.borderStyle,
        borderRightWidth: titleBorder.value.right.borderWidth + "px",

        paddingTop: titlePadding.value.top + "px",
        paddingBottom: titlePadding.value.bottom + "px",
        paddingLeft: titlePadding.value.left + "px",
        paddingRight: titlePadding.value.right + "px"
      };

      let {
        backgroundImage,
        backgroundColor,
        backgroundPositionX,
        backgroundPositionY,
        backgroundSize,
        backgroundRepeatX,
        backgroundRepeatY
      } = titleBackground.value;

      if (backgroundImage) {
        style.backgroundImage = `url(${backgroundImage})`;
      }

      if (backgroundColor) {
        style.backgroundColor = backgroundColor;
      }

      if (backgroundPositionX) {
        style.backgroundPositionX = backgroundPositionX;
      }

      if (backgroundPositionY) {
        style.backgroundPositionY = backgroundPositionY;
      }

      if (backgroundSize) {
        style.backgroundSize = backgroundSize;
      }

      if (backgroundRepeatX && backgroundRepeatY) {
        style.backgroundRepeat = "repeat";
      }

      if (backgroundRepeatX && !backgroundRepeatY) {
        style.backgroundRepeat = "repeat-x";
      }

      if (!backgroundRepeatX && backgroundRepeatY) {
        style.backgroundRepeat = "repeat-y";
      }

      if (!backgroundRepeatX && !backgroundRepeatY) {
        style.backgroundRepeat = "no-repeat";
      }

      return style;
    },
    titleStyle() {
      let style = {};

      let font = this.module.attributes.titleGroup.attributes.font.value;
      style.color = font.color;
      style.fontFamily = font.fontFamily;
      style.fontSize = font.fontSize;
      style.textDecoration = font.textDecoration ? "underline" : "none";
      style.fontStyle = font.italic ? "italic" : "normal";
      style.fontWeight = font.bold ? "bold" : "normal";

      return style;
    },
    moreContent() {
      return this.module.attributes.titleGroup.attributes.moreContent.value;
    },
    moreStyle() {
      let style = {};

      let font = this.module.attributes.titleGroup.attributes.moreFont.value;
      style.color = font.color;
      style.fontFamily = font.fontFamily;
      style.fontSize = font.fontSize;
      style.textDecoration = font.textDecoration ? "underline" : "none";
      style.fontStyle = font.italic ? "italic" : "normal";
      style.fontWeight = font.bold ? "bold" : "normal";

      return style;
    },
    listContainerStyle() {
      let {
        listContainerPadding,
        listContainerBackground,
        listContainerBorder,
        listContainerBorderRadius
      } = this.module.attributes.listContainerGroup.attributes;

      let style = {
        borderTopLeftRadius: listContainerBorderRadius.value.leftTop + "px",
        borderBottomLeftRadius:
          listContainerBorderRadius.value.leftBottom + "px",
        borderTopRightRadius: listContainerBorderRadius.value.rightTop + "px",
        borderBottomRightRadius:
          listContainerBorderRadius.value.rightBottom + "px",

        borderTopColor: listContainerBorder.value.top.borderColor,
        borderTopStyle: listContainerBorder.value.top.borderStyle,
        borderTopWidth: listContainerBorder.value.top.borderWidth + "px",

        borderBottomColor: listContainerBorder.value.bottom.borderColor,
        borderBottomStyle: listContainerBorder.value.bottom.borderStyle,
        borderBottomWidth: listContainerBorder.value.bottom.borderWidth + "px",

        borderLeftColor: listContainerBorder.value.left.borderColor,
        borderLeftStyle: listContainerBorder.value.left.borderStyle,
        borderLeftWidth: listContainerBorder.value.left.borderWidth + "px",

        borderRightColor: listContainerBorder.value.right.borderColor,
        borderRightStyle: listContainerBorder.value.right.borderStyle,
        borderRightWidth: listContainerBorder.value.right.borderWidth + "px",

        paddingTop: listContainerPadding.value.top + "px",
        paddingBottom: listContainerPadding.value.bottom + "px",
        paddingLeft: listContainerPadding.value.left + "px",
        paddingRight: listContainerPadding.value.right + "px"
      };

      let {
        backgroundImage,
        backgroundColor,
        backgroundPositionX,
        backgroundPositionY,
        backgroundSize,
        backgroundRepeatX,
        backgroundRepeatY
      } = listContainerBackground.value;

      if (backgroundImage) {
        style.backgroundImage = `url(${backgroundImage})`;
      }

      if (backgroundColor) {
        style.backgroundColor = backgroundColor;
      }

      if (backgroundPositionX) {
        style.backgroundPositionX = backgroundPositionX;
      }

      if (backgroundPositionY) {
        style.backgroundPositionY = backgroundPositionY;
      }

      if (backgroundSize) {
        style.backgroundSize = backgroundSize;
      }

      if (backgroundRepeatX && backgroundRepeatY) {
        style.backgroundRepeat = "repeat";
      }

      if (backgroundRepeatX && !backgroundRepeatY) {
        style.backgroundRepeat = "repeat-x";
      }

      if (!backgroundRepeatX && backgroundRepeatY) {
        style.backgroundRepeat = "repeat-y";
      }

      if (!backgroundRepeatX && !backgroundRepeatY) {
        style.backgroundRepeat = "no-repeat";
      }

      return style;
    },
    labelId() {
      let {
        dataSrc,
        labelId
      } = this.module.attributes.dataSrcGroup.attributes.dataSrc.value;
      if (dataSrc === 1) {
        return labelId;
      }

      if (dataSrc === 2) {
        return this.$route.query.labelId;
      }

      return "";
    },
    hot() {
      return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.hot;
    },
    moreHref() {
      return moreLink(
        this.$router,
        this.module.attributes.linkGroup.attributes.moreConfig.value,
        this.classId,
        this.labelId,
        this.design
      );
    },
    moreTarget() {
      if (this.moreHref === "javascript:;") {
        return "_self";
      }
      return this.module.attributes.linkGroup.attributes.moreConfig.value
        .target;
    },
    carryRouter() {
      return this.module.attributes.otherGroup.attributes.carryRouter.value;
    },
    pageHeader() {
      return this.module.attributes.otherGroup.attributes.pageHeader.value;
    },
    fullPath() {
      return "#" + this.$route.fullPath;
    },
    nowMenu() {
      for (let menu of this.menus) {
        for (let menuItem of menu.modules) {
          let { index, modules } = menuItem;

          if (index === this.fullPath) {
            return menuItem;
          } else {
            for (let child of modules) {
              let { index: subIndex } = child;

              if (subIndex === this.fullPath) {
                return child;
              }
            }
          }
        }
      }

      return null;
    },
    routerType() {
      return this.module.attributes.otherGroup.attributes.routerType.value;
    },
    menuId() {
      return this.module.attributes.otherGroup.attributes.menuId.value;
    },
    carryRouterMenuId() {
      if (this.carryRouter) {
        if (this.routerType === "1") {
          return this.nowMenu ? this.nowMenu.id : null;
        }

        if (this.routerType === "2") {
          return this.menuId ? this.menuId : null;
        }
      }
      return null;
    }
  },
  created () {
    let attributes = this.module.attributes;
    let formDataSrc = attributes.formDataGroup.attributes.formDataSrc;
    this.classId = formDataSrc.value.classId;
    this.formId = formDataSrc.value.formId;
    this.tagProp = formDataSrc.value.tagProp;
    this.titleProp = formDataSrc.value.titleProp;
    this.dataProps = formDataSrc.value.dataProps;
    if (formDataSrc.value.linkProp) {
      this.linkBtn = formDataSrc.value.linkProp.linkBtn;
      this.linkTitle = formDataSrc.value.linkProp.linkTitle;
      this.linkUrl = formDataSrc.value.linkProp.linkUrl;
      this.linkColId = formDataSrc.value.linkProp.linkColId;
    }
    this.getFormPropList().then(() => {
      this.getFormDataList();
    });
  },
  methods: {
    getFormPropList () {
      return this.$request.get('/api/admin/onlineForm/anon/info?id=' + this.formId).then(res => {
        if (res.success) {
          // console.log(res.data)
          this.formPropList = JSON.parse (res.data.fields);
          let tagField = this.formPropList.find(item => item.id === this.tagProp);
          let linkField = this.formPropList.find(item => item.id === this.linkColId);
          if (linkField) {
            this.linkCode = linkField.code;
          }
          if (tagField && tagField.type == 4) {
            this.tagPropCode = tagField.code;
            this.contentList = tagField.typeConfig.list;
          }
        }
      })
    },
    getFormDataList () {
      let params = {
        id: this.formId,
        limit: this.pageSize,
        offset: this.pageSize * (this.pageNumber - 1) || 0
      }
      if (this.selectedTag) {
        params['conditions[0].key'] = this.tagPropCode;
        params['conditions[0].value'] = this.selectedTag;
      }
      this.$request.get('/api/admin/onlineForm/anon/submit/list', {
        params: params
      }).then(res => {
        if (res.success) {
          this.total = res.data.total;
          let list = res.data.list;
          list.forEach(item => item['_expand'] = false)
          this.formDataList = list;
        }
      })
    },
    pageChange (pageIndex) {
      this.pageNumber = pageIndex;
      this.getFormDataList();
    },
    tagSelect (code) {
      this.selectedTag = code;
      this.pageNumber = 1;
      this.getFormDataList();
    },
    linkClick (item) {
      if (this.linkColId) {
        window.open(this.$router.resolve(item[this.linkCode]).href, '_blank')

      } else if (this.linkUrl) {
        window.open(this.linkUrl, '_blank')
      }
    }

  },
  watch: {
    module: {
      handler: function () {
        let attributes = this.module.attributes;
        let formDataSrc = attributes.formDataGroup.attributes.formDataSrc;
        this.classId = formDataSrc.value.classId;
        this.formId = formDataSrc.value.formId;
        this.tagProp = formDataSrc.value.tagProp;
        this.titleProp = formDataSrc.value.titleProp;
        this.dataProps = formDataSrc.value.dataProps;
        if (formDataSrc.value.linkProp) {
          this.linkBtn = formDataSrc.value.linkProp.linkBtn;
          this.linkTitle = formDataSrc.value.linkProp.linkTitle;
          this.linkUrl = formDataSrc.value.linkProp.linkUrl;
          this.linkColId = formDataSrc.value.linkProp.linkColId;
        }
        this.getFormPropList().then(() => {
          this.getFormDataList();
        });
      },
      deep: true
    }
  }

};
</script>
<style lang="less" scoped>
.website-pro-form-list {
  overflow: auto;
}
.form-tag-list {
  display: flex;
  padding: 10px;
  flex-wrap: wrap;
  .form-tag-item {
    flex: none;
    margin-right: 20px;
    margin-bottom: 10px;
    width: 100px;
    padding: 10px;
    border: 1px solid rgb(64, 158, 255);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    &:nth-of-type(7n+0) {
      margin-right: 0;
    }
    &:hover {
      box-shadow: 0 0 5px rgb(64, 158, 255);
    }
    &.active {
      color: #ffffff;
      background-color: rgb(64, 158, 255);
    }
  }
}
.form-no-data {
  color: #dddddd;
  text-align: center;
  line-height: 60px;
}
.form-data-list {
  .form-data-item {
    padding: 20px;
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    .form-data-title {
      font-size: 18px;
      border-left: 5px solid rgb(64, 158, 255);
      padding-left: 5px;
    }
    .form-data-footer {
      display: flex;
      position: relative;
      margin-top: 30px;
      padding-right: 100px;
      .form-data-tag {
        margin-right: 20px;
        span {
          padding: 10px;
          color: #ffffff;
          background-color: rgb(64, 158, 255);
          border-radius: 5px;
        }
      }
      .form-data-link-btn {
        position: absolute;
        color: rgb(64, 158, 255);
        right: 60px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
      .form-data-more-btn {
        position: absolute;
        width: 40px;
        color: rgb(64, 158, 255);
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
    }
    &+.form-data-item {
      border-top: none;
    }
  }
}
.form-data-details {
  margin-top: 10px;
}
.form-data-detail-item {
  padding: 5px 0;
  .form-data-detail-name {
    font-size: 16px;
    font-weight: bold;
  }
  .form-data-detail-value {
    padding: 5px 10px 5px 20px;
  }
  &+.form-data-detail-item {
    border-top: 1px solid #dddddd;
  }
}
</style>