<template>
    <div style="background-color: #FFFFFF;">
        <function-title :title="title" :color="titleColor" :icon="titleIcon" style="padding: 8px 16px;"
                        :icon-position="titleIconPosition" v-if="isShowTitle"/>
        <el-carousel v-if="pageable" arrow="never" :autoplay="false"
                     :indicator-position="indicatorPosition" :height="height" class="image-container">
            <el-carousel-item v-for="(item,index) in children_2d" :key="index">
                <home-btn-page :data="item" :row-btn-count="rowBtnCount"></home-btn-page>
            </el-carousel-item>
        </el-carousel>
        <div style="padding-bottom: 21px;" v-else>
            <home-btn-page :data="children_2d" :row-btn-count="rowBtnCount"></home-btn-page>
        </div>
    </div>
</template>

<script>
    import homeBtnPage from './homeBtnPage';
    import FunctionTitle from '../../../common/FunctionTitle';

    export default {
        name: "homeBtnContainer",
        components: {FunctionTitle, homeBtnPage},
        props: {
            module: Object,
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            isShowTitle() {
                return this.attributes.isShowTitle.value;
            },
            title() {
                return this.attributes.title.value;
            },
            titleColor() {
                return this.attributes.titleColor.value;
            },
            titleIcon() {
                return this.attributes.titleIcon.value;
            },
            titleIconPosition() {
                return this.attributes.titleIconPosition.value;
            },
            pageable() {
                return this.attributes.pageable.value;
            },
            onePageRow() {
                return this.attributes.onePageRow.value;
            },
            rowBtnCount() {
                return this.attributes.rowBtnCount.value;
            },
            children() {
                return this.module.children;
            },
            pageCount() {
                if (this.pageable) {
                    let pageSize = this.rowBtnCount * this.onePageRow;

                    return Math.ceil(this.children.length / pageSize);
                }

                return 1;
            },
            children_2d() {
                if (this.pageable) {
                    //开启分页
                    let pageSize = this.rowBtnCount * this.onePageRow;
                    let array_2d = [];
                    for (let index = 0; index < this.children.length; index += pageSize) {
                        let temp = this.children.slice(index, index + pageSize);
                        array_2d.push(JSON.parse(JSON.stringify(temp)));
                    }
                    return array_2d;
                } else {
                    return this.children;
                }
            },
            indicatorPosition() {
                if (this.pageCount > 1) {
                    return 'outside';
                } else {
                    return 'none';
                }
            },
            height() {
                if (this.pageable) {
                    //用户开启了分页
                    let length = this.children.length;

                    if (this.pageCount > 1) {
                        //已经分页
                        return 16 + this.onePageRow * 72 + 'px';
                    } else {
                        if (length <= this.rowBtnCount) {
                            //不够一行
                            return '109px';
                        } else {
                            //多行
                            let row = Math.ceil(length / this.rowBtnCount);

                            return 16 + row * 72 + 21 + 'px';
                        }
                    }

                } else {
                    return '109px';
                }
            }
        }
    }
</script>
