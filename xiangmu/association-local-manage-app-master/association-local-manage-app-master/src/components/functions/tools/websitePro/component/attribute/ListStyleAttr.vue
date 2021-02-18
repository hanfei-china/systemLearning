<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex" style="padding-top: 10px;">
                <div class="website-pro-layout-attr-title text-align-right" style="padding-right: 6px;width: 58px;">
                    列表样式
                </div>
                <div class="flex-fill-in-the-remaining-space">
                    <el-select style="width: 100%;" ref="style" v-model="attribute.value.style" size="mini">
                        <el-option value="style1" label="样式1"/>
                        <el-option value="style3" label="样式3"/>
                        <el-option value="style4" label="样式4"/>
                        <el-option value="style6" label="样式6"/>
                        <el-option value="style7" label="样式7"/>
                        <el-option value="style8" label="样式8"/>
                    </el-select>
                </div>
            </div>
            <div class="website-pro-flex" style="padding-top: 10px;" v-if="module">
                <attribute-setting accordion hidden-module-title :module="module"/>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    import AttributeGroup from "../../js/base/attributeGroup";
    import Attribute from "../../js/base/attribute";
    import {deepObjectMerge} from "../../js/base/attribute";

    export default {
        name: "ListStyleAttr",
        components: {
            AttributeSetting: () => import("./AttributeSetting"),
            AttributeTitle
        },
        props: {
            attribute: Object
        },
        data() {
            return {
                module: null,
            }
        },
        computed: {
            showTitle() {
                return this.attribute.showTitle;
            },
            title() {
                return this.attribute.title;
            },
            attributes() {
                return this.attribute.attributes || {};
            },
            show() {
                if (this.attribute.show) {
                    return this.attribute.show();
                } else {
                    return true;
                }
            },
            style() {
                return this.attribute.value.style;
            },
            attributeGroups() {
                return this.attribute.value[this.style]
            },

        },
        methods: {
            isChildren(e) {
                let target = e.target || e.srcElement;
                return target === this.$el || this.$el.contains(target)
                    || this.$refs.style.$refs.popper.$el.contains(target);
            },
            builderModule() {
                let style = this.style;
                let attributeGroups = this.attributeGroups;

                if (style === 'style1') {

                    let {container, date, title, abstract} = attributeGroups;

                    let containerPadding = new Attribute('内边距', 'padding', container.padding.value);
                    let containerBorder = new Attribute('下边框', 'unifiedBorder', container.border.value);

                    let containerGroup = new AttributeGroup('containerGroup', '容器设置')
                        .setAttributes({containerPadding, containerBorder});

                    let dateStyle = new Attribute('日期格式', 'select', date.style.value)
                        .addAttributes({
                            options: [
                                {id: 'style1', label: '样式1'},
                                {id: 'style2', label: '样式2'},
                                {id: 'style3', label: '样式3'},
                            ],
                            titleStyle: {
                                textAlign: 'right',
                                width: '52px',
                                paddingRight: '6px'
                            }
                        }).setValueWatcher((val) => {
                            date.style.value = val;
                        });

                    let datePosition = new Attribute('纵向布局', 'select', date.position.value)
                        .addAttributes({
                            options: [
                                {id: 'flex-start', label: '居上'},
                                {id: 'center', label: '居中'},
                                {id: 'flex-end', label: '居下'},
                            ],
                            titleStyle: {
                                textAlign: 'right',
                                width: '52px',
                                paddingRight: '6px'
                            }
                        }).setValueWatcher((val) => {
                            date.position.value = val;
                        });

                    let dateBackgroundColor = new Attribute('背景色', 'color', date.backgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        date.backgroundColor.value = val;
                    });

                    let dateWidth = new Attribute('日期宽度', 'number', date.width.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        date.width.value = val;
                    });


                    let yearFont = new Attribute('【年】字体设置', 'font', date.yearFont.value).addAttributes({
                        textAlign: {show: true}
                    });

                    let yearPadding = new Attribute('【年】内边距', 'padding', date.yearPadding.value);

                    let monthFont = new Attribute('【月】字体设置', 'font', date.monthFont.value)
                        .addAttributes({
                            textAlign: {show: true}
                        })
                        .setShowMode(() => {
                            return dateStyle.value === 'style3';
                        });

                    let monthPadding = new Attribute('【月】内边距', 'padding', date.monthPadding.value)
                        .setShowMode(() => {
                            return dateStyle.value === 'style3';
                        });

                    let dayFont = new Attribute('【日】字体设置', 'font', date.dayFont.value).addAttributes({
                        textAlign: {show: true}
                    });

                    let dayPadding = new Attribute('【日】内边距', 'padding', date.dayPadding.value);

                    let dayDividingLine = new Attribute('日期分割线', 'unifiedBorder', date.dayDividingLine.value)
                        .setShowMode(() => {
                            return dateStyle.value === 'style2';
                        });

                    let dateBorderRadius = new Attribute('日期容器圆角', 'radius', date.borderRadius.value);

                    let dateBorder = new Attribute('日期容器边框', 'border', date.border.value);

                    let datePadding = new Attribute('日期容器内边距', 'padding', date.padding.value);

                    let dateOuterPadding = new Attribute('日期容器外边距', 'padding', date.outerPadding.value);

                    let dateGroup = new AttributeGroup('dateGroup', '日期设置')
                        .setAttributes({
                            dateStyle,
                            datePosition,
                            dateWidth,
                            dateBackgroundColor,
                            dateBorderRadius,
                            dateBorder,
                            datePadding,
                            dateOuterPadding,
                            yearFont,
                            yearPadding,
                            monthFont,
                            monthPadding,
                            dayFont,
                            dayPadding,
                            dayDividingLine
                        });

                    let titleFont = new Attribute('标题字体设置', 'font', title.font.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let titleMaxLength = new Attribute('标题最大长度', 'number', title.maxLength.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '78',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        title.maxLength.value = val;
                    });

                    let titlePadding = new Attribute('内边距', 'padding', title.padding.value);

                    let titleGroup = new AttributeGroup('titleGroup', '标题设置')
                        .setAttributes({titleMaxLength, titleFont, titlePadding});

                    let abstractFont = new Attribute('摘要字体设置', 'font', abstract.font.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let abstractMaxLength = new Attribute('摘要最大长度', 'number', abstract.maxLength.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '78',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        abstract.maxLength.value = val;
                    });

                    let abstractPadding = new Attribute('内边距', 'padding', abstract.padding.value);

                    let abstractGroup = new AttributeGroup('abstractGroup', '摘要设置')
                        .setAttributes({abstractMaxLength, abstractFont, abstractPadding});


                    return {
                        id: 'listStyle',
                        attributes: {
                            containerGroup, dateGroup, titleGroup, abstractGroup
                        }
                    };
                }

                if (style === 'style3') {
                    let {container, title, abstract} = attributeGroups;

                    let containerPadding = new Attribute('内边距', 'padding', container.padding.value);
                    let containerBorder = new Attribute('下边框', 'unifiedBorder', container.border.value);

                    let containerGroup = new AttributeGroup('containerGroup', '容器设置')
                        .setAttributes({containerPadding, containerBorder});

                    let showTime = new Attribute('显示日期', 'checkbox', title.showTime.value).addAttributes({
                        content: '显示日期'
                    }).hiddenTitle()
                        .setValueWatcher((val) => {
                            title.showTime.value = val;
                        });

                    let titleFont = new Attribute('标题字体设置', 'font', title.titleFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let timeFont = new Attribute('日期字体设置', 'font', title.timeFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let titlePadding = new Attribute('标题容器内边距', 'padding', title.padding.value);

                    let titleGroup = new AttributeGroup('titleGroup', '标题设置')
                        .setAttributes({showTime, titleFont, timeFont, titlePadding});

                    let showAbstract = new Attribute('显示摘要', 'checkbox', abstract.showAbstract.value).addAttributes({
                        content: '显示摘要'
                    }).hiddenTitle()
                        .setValueWatcher((val) => {
                            abstract.showAbstract.value = val;
                        });

                    let abstractFont = new Attribute('摘要字体设置', 'font', abstract.font.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let abstractMaxLength = new Attribute('摘要最大长度', 'number', abstract.maxLength.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '78',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        abstract.maxLength.value = val;
                    });

                    let abstractPadding = new Attribute('内边距', 'padding', abstract.padding.value);

                    let abstractGroup = new AttributeGroup('abstractGroup', '摘要设置')
                        .setAttributes({showAbstract, abstractMaxLength, abstractFont, abstractPadding});

                    return {
                        id: 'listStyle',
                        attributes: {
                            containerGroup, titleGroup, abstractGroup
                        }
                    };
                }

                if (style === 'style4') {
                    let {container, poster, label, title} = attributeGroups;

                    let containerPadding = new Attribute('容器内边距', 'padding', container.padding.value);
                    let containerOuterPadding = new Attribute('容器外边距', 'padding', container.outerPadding.value);
                    let containerBorder = new Attribute('容器边框', 'border', container.border.value);
                    let containerBoxShadow = new Attribute('容器阴影', 'boxShadow', container.shadow.value);
                    let containerHeight = new Attribute('容器高度', 'number', container.height.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        container.height.value = val;
                    });
                    let containerWidth = new Attribute('容器宽度', 'number', container.width.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        container.width.value = val;
                    });

                    let containerBackgroundColor = new Attribute('容器背景色', 'color', container.backgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        container.backgroundColor.value = val;
                    });

                    let containerGroup = new AttributeGroup('containerGroup', '容器设置')
                        .setAttributes({
                            containerHeight, containerWidth, containerBackgroundColor,
                            containerPadding, containerOuterPadding, containerBorder, containerBoxShadow
                        });


                    let posterHeight = new Attribute('海报高度', 'number', poster.height.value).addAttributes({
                        titleStyle: {
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        poster.height.value = val;
                    });

                    let posterGroup = new AttributeGroup('posterGroup', '海报设置')
                        .setAttributes({posterHeight});

                    let labelContainerPadding = new Attribute('标签容器内边距', 'padding', label.padding.value);
                    let labelBackgroundColor = new Attribute('标签背景色', 'color', label.itemBackgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        label.itemBackgroundColor.value = val;
                    });
                    let labelFont = new Attribute('标签字体设置', 'font', label.itemFont.value).addAttributes({
                        textAlign: {show: false}
                    });
                    let labelPadding = new Attribute('标签内边距', 'padding', label.itemPadding.value);
                    let labelOuterPadding = new Attribute('标签外边距', 'padding', label.itemOuterPadding.value);
                    let labelBorder = new Attribute('标签边框', 'border', label.itemBorder.value);
                    let labelBorderRadius = new Attribute('标签圆角', 'radius', label.itemBorderRadius.value);

                    let labelGroup = new AttributeGroup('labelGroup', '标签设置')
                        .setAttributes({
                            labelBackgroundColor,
                            labelContainerPadding,
                            labelFont,
                            labelPadding,
                            labelOuterPadding,
                            labelBorder,
                            labelBorderRadius
                        });

                    let titleFont = new Attribute('标题字体设置', 'font', title.font.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let titleMaxLength = new Attribute('标题最大长度', 'number', title.maxLength.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '78',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        title.maxLength.value = val;
                    });

                    let titlePadding = new Attribute('内边距', 'padding', title.padding.value);

                    let titleGroup = new AttributeGroup('titleGroup', '标题设置')
                        .setAttributes({titleMaxLength, titleFont, titlePadding});

                    return {
                        id: 'listStyle',
                        attributes: {
                            containerGroup, posterGroup, labelGroup, titleGroup
                        }
                    };
                }

                if (style === 'style6') {
                    let {container, textContainer, triangle, label, title, abstract} = attributeGroups;


                    let rowCount = new Attribute('单行数量', 'number', container.rowCount.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        },
                        min: 1
                    }).setValueWatcher((val) => {
                        container.rowCount.value = val;
                    });

                    let containerHeight = new Attribute('容器高度', 'number', container.height.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        container.height.value = val;
                    });
                    let containerWidth = new Attribute('容器宽度', 'number', container.width.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        container.width.value = val;
                    });

                    let containerGroup = new AttributeGroup('containerGroup', '容器设置')
                        .setAttributes({
                            rowCount, containerHeight, containerWidth
                        });

                    let textContainerPadding = new Attribute('文本容器内边距', 'padding', textContainer.padding.value);

                    let textContainerGroup = new AttributeGroup('textContainerGroup', '文本容器设置')
                        .setAttributes({
                            textContainerPadding
                        });

                    let triangleTop = new Attribute('向上偏移', 'number', triangle.top.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        triangle.top.value = val;
                    });

                    let triangleHeight = new Attribute('三角高度', 'number', triangle.height.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        triangle.height.value = val;
                    });

                    let triangleWidth = new Attribute('三角宽度', 'number', triangle.width.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        triangle.width.value = val;
                    });

                    let triangleBackgroundColor = new Attribute('三角背景色', 'color', triangle.backgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        triangle.backgroundColor.value = val;
                    });


                    let triangleGroup = new AttributeGroup('triangleGroup', '三角设置')
                        .setAttributes({
                            triangleTop, triangleWidth, triangleHeight, triangleBackgroundColor
                        });

                    let labelContainerPadding = new Attribute('标签容器内边距', 'padding', label.padding.value);
                    let labelBackgroundColor = new Attribute('标签背景色', 'color', label.itemBackgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            textAlign: 'right',
                            width: '65px',
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        label.itemBackgroundColor.value = val;
                    });
                    let labelFont = new Attribute('标签字体设置', 'font', label.itemFont.value).addAttributes({
                        textAlign: {show: false}
                    });
                    let labelPadding = new Attribute('标签内边距', 'padding', label.itemPadding.value);
                    let labelOuterPadding = new Attribute('标签外边距', 'padding', label.itemOuterPadding.value);
                    let labelBorder = new Attribute('标签边框', 'border', label.itemBorder.value);
                    let labelBorderRadius = new Attribute('标签圆角', 'radius', label.itemBorderRadius.value);

                    let labelGroup = new AttributeGroup('labelGroup', '标签设置')
                        .setAttributes({
                            labelBackgroundColor,
                            labelContainerPadding,
                            labelFont,
                            labelPadding,
                            labelOuterPadding,
                            labelBorder,
                            labelBorderRadius
                        });

                    let titleFont = new Attribute('标题字体设置', 'font', title.font.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let titleMaxLength = new Attribute('标题最大长度', 'number', title.maxLength.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '78',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        title.maxLength.value = val;
                    });

                    let titlePadding = new Attribute('内边距', 'padding', title.padding.value);

                    let titleGroup = new AttributeGroup('titleGroup', '标题设置')
                        .setAttributes({titleMaxLength, titleFont, titlePadding});

                    let abstractFont = new Attribute('摘要字体', 'font', abstract.font.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let abstractMaxLength = new Attribute('摘要最大长度', 'number', abstract.maxLength.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '78',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        abstract.maxLength.value = val;
                    });

                    let abstractPadding = new Attribute('内边距', 'padding', abstract.padding.value);

                    let abstractGroup = new AttributeGroup('abstractGroup', '标题设置')
                        .setAttributes({abstractMaxLength, abstractFont, abstractPadding});

                    return {
                        id: 'listStyle',
                        attributes: {
                            containerGroup, textContainerGroup, triangleGroup, labelGroup, titleGroup, abstractGroup
                        }
                    };

                }

                if (style === 'style7') {
                    let {container, serialNumber, content} = attributeGroups;

                    let containerPadding = new Attribute('内边距', 'padding', container.padding.value);
                    let containerBorder = new Attribute('下边框', 'unifiedBorder', container.border.value);

                    let containerGroup = new AttributeGroup('containerGroup', '容器设置')
                        .setAttributes({containerPadding, containerBorder});

                    let serialNumberPosition = new Attribute('纵向布局', 'select', serialNumber.position.value)
                        .addAttributes({
                            options: [
                                {id: 'flex-start', label: '居上'},
                                {id: 'center', label: '居中'},
                                {id: 'flex-end', label: '居下'},
                            ],
                            titleStyle: {
                                textAlign: 'right',
                                width: '52px',
                                paddingRight: '6px'
                            }
                        }).setValueWatcher((val) => {
                            serialNumber.position.value = val;
                        });


                    let serialNumberWidth = new Attribute('序号宽度', 'number', serialNumber.width.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        serialNumber.width.value = val;
                    });

                    let serialNumberHeight = new Attribute('序号高度', 'number', serialNumber.height.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        serialNumber.height.value = val;
                    });

                    let serialNumberContainerPadding = new Attribute('内边距', 'padding', serialNumber.padding.value);

                    let borderRadius = new Attribute('序号圆角', 'radius', serialNumber.borderRadius.value);


                    let firstBorder = new Attribute('边框', 'border', serialNumber.firstBorder.value);

                    let firstFont = new Attribute('字体设置', 'font', serialNumber.firstFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let firstBackgroundColor = new Attribute('背景色', 'color', serialNumber.firstBackgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        serialNumber.firstBackgroundColor.value = val;
                    });



                    let secondBorder = new Attribute('边框', 'border', serialNumber.secondBorder.value);


                    let secondFont = new Attribute('字体设置', 'font', serialNumber.secondFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let secondBackgroundColor = new Attribute('背景色', 'color', serialNumber.secondBackgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        serialNumber.secondBackgroundColor.value = val;
                    });


                    let thirdBorder = new Attribute('边框', 'border', serialNumber.thirdBorder.value);


                    let thirdFont = new Attribute('字体设置', 'font', serialNumber.thirdFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let thirdBackgroundColor = new Attribute('背景色', 'color', serialNumber.thirdBackgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        serialNumber.thirdBackgroundColor.value = val;
                    });


                    let otherBorder = new Attribute('边框', 'border', serialNumber.otherBorder.value);



                    let otherFont = new Attribute('字体设置', 'font', serialNumber.otherFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let otherBackgroundColor = new Attribute('背景色', 'color', serialNumber.otherBackgroundColor.value).addAttributes({
                        showAlpha: true,
                        titleStyle: {
                            paddingRight: '6px'
                        }
                    }).setValueWatcher((val) => {
                        serialNumber.otherBackgroundColor.value = val;
                    });

                    let serialNumberGroup = new AttributeGroup('serialNumberGroup', '序号通用设置')
                        .setAttributes({serialNumberPosition, serialNumberWidth, serialNumberHeight, borderRadius, serialNumberContainerPadding});

                    let serialNumberFirstGroup = new AttributeGroup('serialNumberFirstGroup', '序号【1】设置')
                        .setAttributes({firstFont, firstBorder, firstBackgroundColor});

                    let serialNumberSecondGroup = new AttributeGroup('serialNumberSecondGroup', '序号【2】设置')
                        .setAttributes({secondFont, secondBorder, secondBackgroundColor});

                    let serialNumberThirdGroup = new AttributeGroup('serialNumberThirdGroup', '序号【3】设置')
                        .setAttributes({thirdFont, thirdBorder, thirdBackgroundColor});

                    let serialNumberOtherGroup = new AttributeGroup('serialNumberOtherGroup', '其他序号设置')
                        .setAttributes({ otherFont, otherBorder, otherBackgroundColor});


                    let contentContainerPadding = new Attribute('内边距', 'padding', content.containerPadding.value);

                    let titleFont = new Attribute('标题字体设置', 'font', content.titleFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let timeFont = new Attribute('日期字体设置', 'font', content.timeFont.value).addAttributes({
                        textAlign: {show: false}
                    });


                    let timePaddingLeft = new Attribute('日期左边距', 'number', content.timePaddingLeft.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '78',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        content.timePaddingLeft.value = val;
                    });

                    let contentGroup = new AttributeGroup('contentGroup', '内容设置')
                        .setAttributes({timePaddingLeft, contentContainerPadding, titleFont, timeFont});

                    return {
                        id: 'listStyle',
                        attributes: {
                            containerGroup, serialNumberGroup, serialNumberFirstGroup, serialNumberSecondGroup, serialNumberThirdGroup, serialNumberOtherGroup, contentGroup,
                        }
                    };
                }

                if (style === 'style8') {
                    let {container, poster, title, date, abstract} = attributeGroups;

                    let containerPadding = new Attribute('内边距', 'padding', container.padding.value);
                    let containerBorder = new Attribute('下边框', 'unifiedBorder', container.border.value);

                    let containerGroup = new AttributeGroup('containerGroup', '容器设置')
                        .setAttributes({containerPadding, containerBorder});

                    let posterHeight = new Attribute('海报高度', 'number', poster.height.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        poster.height.value = val;
                    });
                    let posterWidth = new Attribute('海报宽度', 'number', poster.width.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '52px',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        poster.width.value = val;
                    });

                    let posterMargin = new Attribute('海报外边距', 'padding', poster.margin.value);

                    let posterLayout = new Attribute('海报布局', 'backgroundLayout', poster.layout.value);

                    let posterGroup = new AttributeGroup('posterGroup', '海报设置')
                        .setAttributes({posterHeight, posterWidth, posterMargin,posterLayout});

                    let titleFont = new Attribute('标题字体设置', 'font', title.titleFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let titlePadding = new Attribute('标题容器内边距', 'padding', title.padding.value);

                    let titleGroup = new AttributeGroup('titleGroup', '标题设置')
                        .setAttributes({titleFont, titlePadding});

                    let showTime = new Attribute('显示日期', 'checkbox', date.showTime.value).addAttributes({
                        content: '显示日期'
                    }).hiddenTitle()
                        .setValueWatcher((val) => {
                            date.showTime.value = val;
                        });

                    let timePadding = new Attribute('标题容器内边距', 'padding', date.padding.value);

                    let timeFont = new Attribute('日期字体设置', 'font', date.timeFont.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let dateGroup = new AttributeGroup('dateGroup', '日期设置')
                        .setAttributes({showTime, timePadding, timeFont});

                    let showAbstract = new Attribute('显示摘要', 'checkbox', abstract.showAbstract.value).addAttributes({
                        content: '显示摘要'
                    }).hiddenTitle()
                        .setValueWatcher((val) => {
                            abstract.showAbstract.value = val;
                        });

                    let abstractFont = new Attribute('摘要字体设置', 'font', abstract.font.value).addAttributes({
                        textAlign: {show: false}
                    });

                    let abstractMaxLength = new Attribute('摘要最大长度', 'number', abstract.maxLength.value).addAttributes({
                        titleStyle: {
                            textAlign: 'right',
                            width: '78',
                            paddingRight: '6px'
                        },
                        min: 0
                    }).setValueWatcher((val) => {
                        abstract.maxLength.value = val;
                    });

                    let abstractPadding = new Attribute('内边距', 'padding', abstract.padding.value);

                    let abstractGroup = new AttributeGroup('abstractGroup', '摘要设置')
                        .setAttributes({showAbstract, abstractMaxLength, abstractFont, abstractPadding});

                    return {
                        id: 'listStyle',
                        attributes: {
                            containerGroup, posterGroup, titleGroup, dateGroup, abstractGroup
                        }
                    };
                }

                return null;
            }
        },
        created() {
            this.module = this.builderModule();
        },
        watch: {
            style() {
                this.module = this.builderModule();
            },
            attribute: {
                deep: true,
                handler() {
                    let result = this.builderModule();
                    if (result && this.module) {
                        deepObjectMerge(this.module, this.builderModule());
                    } else {
                        this.module = result;
                    }
                }
            },
        }
    }
</script>
