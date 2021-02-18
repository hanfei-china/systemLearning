<template>
  <div :style="style">
    <div v-show="showMore || showTitle"
         ref="title"
         :style="titleContainerStyle"
         class="website-pro-flex website-pro-article-list-header">
      <div class="flex-fill-in-the-remaining-space website-pro-article-list-title website-pro-flex column center">
        <span :style="titleStyle"
              v-show="showTitle">{{title}}</span>
      </div>
      <a v-show="showMore"
         :href="moreHref"
         :target="moreTarget"
         :style="moreStyle"
         class="website-pro-article-list-more website-flex column center">{{moreContent}}</a>
    </div>
    <div @mouseover="swiper.autoplay.stop()"
         @mouseleave="swiper.autoplay.start()">
      <swiper :options="swiperOptions"
              :style="containerStyle"
              ref="mySwiper">
        <swiper-slide v-for="item in listData"
                      :key="item.id"
                      class="swiper-no-swiping">
          <scroll-item :item="item"
                       :height="lineHeight"
                       :leftFormatArray="leftFormatArray"
                       :rightFormatArray="rightFormatArray"></scroll-item>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
import ScrollItem from "./ScrollItem";
// import listData from "./listdata"
import {commonLink, moreLink} from "../../../../js/util/util";
export default {
  components: { ScrollItem },
  props: {
    module: Object,
    design: Boolean
  },
  data() {
    return {
      formId: "",
      swiperSize: 9,
      totalSize: 20,
      itemMargin: 10,
      lineHeight: 24,
      listData: [],
      leftFormatArray: ["donationTime", "groupName|donationName", "title"],
      rightFormatArray: ["donationAmount"]
    };
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    },
    style ()  {
      let style = {}
      style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
      style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
      style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
      style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
      style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
      style.position = 'absolute';
      return style
    },
    classId() {
      let {dataSrc, classId} = this.module.attributes.dataSrcGroup.attributes.dataSrc.value;

      if (dataSrc === 1) {
        return classId;
      }

      if (dataSrc === 2) {
        return this.$route.query.classId;
      }

      return '';
    },
    labelId() {
      let {dataSrc, labelId} = this.module.attributes.dataSrcGroup.attributes.dataSrc.value;
      if (dataSrc === 1) {
        return labelId;
      }

      if (dataSrc === 2) {
        return this.$route.query.labelId;
      }

      return '';
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
    swiperOptions() {
      return {
        width: this.module.attributes.layoutGroup.attributes.layout.value.width,
        height: (this.lineHeight + this.itemMargin) * this.swiperSize || 340,
        direction: "vertical",
        loop: true,
        loopAdditionalSlides: 2,
        loopedSlides: this.swiperSize + 2 || 12,
        autoplay: {
          delay: 1000,
          disableOnInteraction: false
        },
        slidesPerView: this.swiperSize || 10,
        spaceBetween: this.itemMargin || 10
      };
    },
    containerStyle() {
      return {
        height:
          ((this.lineHeight + this.itemMargin) * this.swiperSize || 340) + "px",
        overflowY: "hidden"
      };
    }
  },
  created() {
    let attributes = this.module.attributes;
    let formDataSrc = attributes.formDataGroup.attributes.formDataSrc;
    this.formId = formDataSrc.value.formId;
    this.getData();
  },
  methods: {
    getData() {
      let params = {
        id: this.formId,
        limit: this.totalSize,
        offset: 0
      };
      // this.listData = listData;
      // this.listData.forEach(item => item.title = '捐赠项目')
      this.$request
        .get("/api/admin/onlineForm/anon/submitHistory/list", {
          params: params
        })
        .then(res => {
          if (res.success) {
            let list = res.data.list;
            this.listData = list;
          }
        });
    },
    itemFormatter(item, type) {
      let str = "";
      let formatArr =
        type == "right" ? this.rightFormatArray : this.leftFormatArray;
      formatArr.forEach(prop => {
        let propStr = item[prop];
        str += `<span>${propStr}</span>`;
      });
      return str;
    }
  }
};
</script>

