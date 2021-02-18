import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';

export const dateStyleConfig = {
    dateStyle1: {
        outerPadding: {
            value: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 16,
            }
        },
        width: {
            value: 84
        },
        yearFont: {
            value: {
                fontSize: '14px',
                color: '#666666',
                italic: false,
                bold: false,
                textDecoration: false,
                fontFamily: '微软雅黑',
                textAlign: 'center',
            }
        },
        yearPadding: {
            value: {
                top: 8,
                bottom: 0,
                left: 0,
                right: 0,
            }
        },
        dayFont: {
            value: {
                fontSize: '25px',
                color: '#666666',
                italic: false,
                bold: false,
                textDecoration: false,
                fontFamily: '微软雅黑',
                textAlign: 'center',
            }
        },
        dayPadding: {
            value: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }
        },
        backgroundColor: {
            value: '#f2f2f2'
        },
        borderRadius: {
            value: {
                leftTop: 0,
                rightTop: 0,
                leftBottom: 0,
                rightBottom: 0,
            }
        },
        border: {
            value: {
                top: {
                    borderColor: 'rgba(64, 158, 255, 1)',
                    borderWidth: 0,
                    borderStyle: 'solid'
                },
                bottom: {
                    borderColor: 'rgba(64, 158, 255, 1)',
                    borderWidth: 0,
                    borderStyle: 'solid'
                },
                left: {
                    borderColor: 'rgba(64, 158, 255, 1)',
                    borderWidth: 0,
                    borderStyle: 'solid'
                },
                right: {
                    borderColor: 'rgba(64, 158, 255, 1)',
                    borderWidth: 0,
                    borderStyle: 'solid'
                }
            }
        },
        padding: {
            value: {
                top: 20,
                bottom: 20,
                left: 0,
                right: 0,
            }
        }
    },
    dateStyle2: {

        outerPadding: {
            value: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 20,
            }
        },
        width: {
            value: 53
        },
        yearFont: {
            value: {
                fontSize: '14px',
                color: '#adadad',
                italic: false,
                bold: false,
                textDecoration: false,
                fontFamily: '微软雅黑',
                textAlign: 'left',
            }
        },
        yearPadding: {
            value: {
                top: 4,
                bottom: 0,
                left: 0,
                right: 0,
            }
        },
        dayFont: {
            value: {
                fontSize: '34px',
                color: '#333333',
                italic: false,
                bold: false,
                textDecoration: false,
                fontFamily: '微软雅黑',
                textAlign: 'left',
            }
        },
        dayPadding: {
            value: {
                top: 0,
                bottom: 4,
                left: 0,
                right: 0,
            }
        },
        dayDividingLine: {
            value: {
                borderColor: '#adadad',
                borderWidth: 1,
                borderStyle: 'solid'
            }
        },
        backgroundColor: {
            value: 'rgba(255,255,255,0)'
        },
        borderRadius: {
            value: {
                leftTop: 0,
                rightTop: 0,
                leftBottom: 0,
                rightBottom: 0,
            }
        },
        border: {
            value: {
                top: {
                    borderColor: 'rgba(64, 158, 255, 1)',
                    borderWidth: 0,
                    borderStyle: 'solid'
                },
                bottom: {
                    borderColor: 'rgba(64, 158, 255, 1)',
                    borderWidth: 0,
                    borderStyle: 'solid'
                },
                left: {
                    borderColor: 'rgba(64, 158, 255, 1)',
                    borderWidth: 0,
                    borderStyle: 'solid'
                },
                right: {
                    borderColor: 'rgba(64, 158, 255, 1)',
                    borderWidth: 0,
                    borderStyle: 'solid'
                }
            }
        },
        padding: {
            value: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }
        }
    },
    dateStyle3: {

        outerPadding: {
            value: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 25,
            }
        },
        width: {
            value: 31
        },
        yearFont: {
            value: {
                fontSize: '12px',
                color: '#ed6d51',
                italic: false,
                bold: false,
                textDecoration: false,
                fontFamily: '微软雅黑',
                textAlign: 'left',
            }
        },
        yearPadding: {
            value: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }
        },
        monthFont: {
            value: {
                fontSize: '12px',
                color: '#ed6d51',
                italic: false,
                bold: false,
                textDecoration: false,
                fontFamily: '微软雅黑',
                textAlign: 'left',
            }
        },
        monthPadding: {
            value: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }
        },
        dayFont: {
            value: {
                fontSize: '26px',
                color: '#ed6d51',
                italic: false,
                bold: false,
                textDecoration: false,
                fontFamily: '微软雅黑',
                textAlign: 'left',
            }
        },
        dayPadding: {
            value: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }
        },
        backgroundColor: {
            value: 'rgba(255,255,255,0)'
        },
        borderRadius: {
            value: {
                leftTop: 15,
                rightTop: 15,
                leftBottom: 15,
                rightBottom: 15,
            }
        },
        border: {
            value: {
                top: {
                    borderColor: '#ed6d51',
                    borderWidth: 1,
                    borderStyle: 'solid'
                },
                bottom: {
                    borderColor: '#ed6d51',
                    borderWidth: 1,
                    borderStyle: 'solid'
                },
                left: {
                    borderColor: '#ed6d51',
                    borderWidth: 1,
                    borderStyle: 'solid'
                },
                right: {
                    borderColor: '#ed6d51',
                    borderWidth: 1,
                    borderStyle: 'solid'
                }
            }
        },
        padding: {
            value: {
                top: 15,
                bottom: 15,
                left: 11,
                right: 11,
            }
        }
    }
};

export default class WsArticleList extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '文章列表';
        super('wsArticleList', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute() {
        let titleGroup = new AttributeGroup('titleGroup', '标题设置');

        let showTitle = new Attribute('显示标题', 'checkbox', true).addAttributes({
            content: '显示标题'
        }).hiddenTitle();

        let showMore = new Attribute('显示更多', 'checkbox', true).addAttributes({
            content: '显示更多'
        }).hiddenTitle();

        let title = new Attribute('标题内容', 'text', '文章列表').addAttributes({
            placeholder: '请输入标题内容',
            titleStyle: {
                textAlign: 'right',
                width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let moreContent = new Attribute('更多内容', 'text', ' +更多').addAttributes({
            placeholder: '请输入更多内容',
            titleStyle: {
                textAlign: 'right',
                width: '65px',
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showMore.value === true;
        });

        let font = new Attribute('标题字体设置', 'font', {
            fontSize: '14px',
            color: '#333333',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'center',
        }).addAttributes({
            textAlign: {show: false}
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let moreFont = new Attribute('更多字体设置', 'font', {
            fontSize: '12px',
            color: '#333333',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'center',
        }).addAttributes({
            textAlign: {show: false}
        }).setShowMode(() => {
            return showMore.value === true;
        });

        let titleBackground = new Attribute('标题容器背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        }).setShowMode(() => {
            return showTitle.value === true || showMore.value === true;
        });

        let titleBorderRadius = new Attribute('标题容器圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        }).setShowMode(() => {
            return showTitle.value === true || showMore.value === true;
        });

        let titlePadding = new Attribute('标题容器内边距', 'padding', {
            top: 8,
            bottom: 8,
            left: 16,
            right: 16,
        }).setShowMode(() => {
            return showTitle.value === true || showMore.value === true;
        });

        let titleBorder = new Attribute('标题容器边框', 'border', {
            top: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        }).addAttributes({
            borderStyleHidden: true
        }).setShowMode(() => {
            return showTitle.value === true || showMore.value === true;
        });

        titleGroup.setAttributes({
            showTitle, showMore, title, moreContent, font,
            moreFont, titleBackground, titlePadding, titleBorder, titleBorderRadius
        });

        let listContainerBackground = new Attribute('列表容器背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let listContainerBorderRadius = new Attribute('列表容器圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let listContainerPadding = new Attribute('列表容器内边距', 'padding', {
            top: 0,
            bottom: 0,
            left: 20,
            right: 20,
        });

        let listContainerBorder = new Attribute('列表容器边框', 'border', {
            top: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        }).addAttributes({
            borderStyleHidden: true
        });

        let listContainerGroup = new AttributeGroup('listContainerGroup', '列表容器设置')
            .setAttributes({
                listContainerBackground,
                listContainerBorderRadius,
                listContainerPadding,
                listContainerBorder
            });

        let layoutGroup = new AttributeGroup('layoutGroup', '布局设置');

        let layout = new Attribute('布局设置', 'layout', {
            width: 400,
            height: 300,
            left: 509,
            top: 183,
            zIndex: 1
        }).hiddenTitle().addAttributes({
            position: {show: false},
            height: {show: false}
        });

        layoutGroup.setAttributes({layout});

        let viewGroup = new AttributeGroup('viewGroup', '列表风格设置');


        let listStyle = new Attribute('列表样式', 'listStyle', {
            style: 'style1',
            style1: {
                container: {
                    padding: {
                        value: {
                            top: 36,
                            bottom: 36,
                            left: 0,
                            right: 0,
                        }
                    },
                    border: {
                        value: {
                            borderColor: '#e5e5e5',
                            borderWidth: 1,
                            borderStyle: 'dashed'
                        }
                    }
                },
                date: {
                    style: {
                        value: 'style1'
                    },
                    position: {
                        value: 'center'
                    },
                    width: {
                        value: 84
                    },
                    outerPadding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 16,
                        }
                    },
                    yearFont: {
                        value: {
                            fontSize: '14px',
                            color: '#666666',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    yearPadding: {
                        value: {
                            top: 8,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    monthFont: {
                        value: {
                            fontSize: '14px',
                            color: '#666666',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    monthPadding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    dayFont: {
                        value: {
                            fontSize: '25px',
                            color: '#666666',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    dayPadding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    dayDividingLine: {
                        value: {
                            borderColor: '#adadad',
                            borderWidth: 1,
                            borderStyle: 'solid'
                        }
                    },
                    backgroundColor: {
                        value: '#f2f2f2'
                    },
                    borderRadius: {
                        value: {
                            leftTop: 0,
                            rightTop: 0,
                            leftBottom: 0,
                            rightBottom: 0,
                        }
                    },
                    border: {
                        value: {
                            top: {
                                borderColor: 'rgba(64, 158, 255, 1)',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            bottom: {
                                borderColor: 'rgba(64, 158, 255, 1)',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            left: {
                                borderColor: 'rgba(64, 158, 255, 1)',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            right: {
                                borderColor: 'rgba(64, 158, 255, 1)',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            }
                        }
                    },
                    padding: {
                        value: {
                            top: 20,
                            bottom: 20,
                            left: 0,
                            right: 0,
                        }
                    }
                },
                image: {},
                title: {
                    font: {
                        value: {
                            fontSize: '16px',
                            color: '#666666',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    maxLength: {
                        value: 100
                    },
                    padding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                },
                abstract: {
                    font: {
                        value: {
                            fontSize: '14px',
                            color: '#808080',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    maxLength: {
                        value: 200
                    },
                    padding: {
                        value: {
                            top: 4,
                            bottom: 6,
                            left: 0,
                            right: 0,
                        }
                    },
                }
            },
            style3: {
                container: {
                    padding: {
                        value: {
                            top: 10,
                            bottom: 10,
                            left: 0,
                            right: 0,
                        }
                    },
                    border: {
                        value: {
                            borderColor: '#e5e5e5',
                            borderWidth: 1,
                            borderStyle: 'dashed'
                        }
                    }
                },
                title: {
                    padding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    titleFont: {
                        value: {
                            fontSize: '14px',
                            color: '#666666',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    showTime: {
                        value: true
                    },
                    timeFont: {
                        value: {
                            fontSize: '14px',
                            color: '#666666',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                },
                abstract: {
                    showAbstract: {
                        value: false
                    },
                    padding: {
                        value: {
                            top: 10,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    font: {
                        value: {
                            fontSize: '14px',
                            color: '#000000',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    maxLength: {
                        value: 200
                    },
                }
            },
            style4: {
                container: {
                    padding: {
                        value: {
                            top: 5,
                            bottom: 5,
                            left: 5,
                            right: 5,
                        }
                    },
                    outerPadding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    border: {
                        value: {
                            top: {
                                borderColor: 'rgba(64, 158, 255, 1)',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            bottom: {
                                borderColor: 'rgba(64, 158, 255, 1)',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            left: {
                                borderColor: 'rgba(64, 158, 255, 1)',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            right: {
                                borderColor: 'rgba(64, 158, 255, 1)',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            }
                        }
                    },
                    shadow: {
                        value: {
                            hShadow: 0,
                            vShadow: 0,
                            blur: 0,
                            spread: 0,
                            color: '#888888',
                            inset: false
                        }
                    },
                    height: {
                        value: 250
                    },
                    width: {
                        value: 300
                    },
                    backgroundColor: {
                        value: ''
                    }
                },
                poster: {
                    height: {
                        value: 168
                    }
                },
                label: {
                    padding: {
                        value: {
                            top: 27,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    itemBackgroundColor: {
                        value: '#826694'
                    },
                    itemFont: {
                        value: {
                            fontSize: '14px',
                            color: '#FFFFFF',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    itemPadding: {
                        value: {
                            top: 8,
                            bottom: 8,
                            left: 13,
                            right: 13,
                        }
                    },
                    itemOuterPadding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 13,
                        }
                    },
                    itemBorder: {
                        value: {
                            top: {
                                borderColor: '#826694',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            bottom: {
                                borderColor: '#826694',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            left: {
                                borderColor: '#826694',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            right: {
                                borderColor: '#826694',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            }
                        }
                    },
                    itemBorderRadius: {
                        value: {
                            leftTop: 15,
                            rightTop: 15,
                            leftBottom: 15,
                            rightBottom: 15,
                        }
                    }
                },
                title: {
                    padding: {
                        value: {
                            top: 10,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    font: {
                        value: {
                            fontSize: '14px',
                            color: '#826694',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    maxLength: {
                        value: 100
                    },
                }
            },
            style6: {
                container: {
                    rowCount:{
                        value: 2
                    },
                    height: {
                        value: 300
                    },
                    width: {
                        value: 600
                    },
                },
                textContainer: {
                    padding: {
                        value: {
                            top: 37,
                            bottom: 49,
                            left: 40,
                            right: 40
                        }
                    }
                },
                triangle: {
                    backgroundColor: {
                        value: '#FFFFFF'
                    },
                    height: {
                        value: 32
                    },
                    width: {
                        value: 17
                    },
                    top: {
                        value: 134
                    }
                },
                label: {
                    padding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    itemBackgroundColor: {
                        value: '#FFFFFF'
                    },
                    itemFont: {
                        value: {
                            fontSize: '14px',
                            color: '#ED6D51',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    itemPadding: {
                        value: {
                            top: 8,
                            bottom: 8,
                            left: 13,
                            right: 13,
                        }
                    },
                    itemOuterPadding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 13,
                        }
                    },
                    itemBorder: {
                        value: {
                            top: {
                                borderColor: '#ED6D51',
                                borderWidth: 1,
                                borderStyle: 'solid'
                            },
                            bottom: {
                                borderColor: '#ED6D51',
                                borderWidth: 1,
                                borderStyle: 'solid'
                            },
                            left: {
                                borderColor: '#ED6D51',
                                borderWidth: 1,
                                borderStyle: 'solid'
                            },
                            right: {
                                borderColor: '#ED6D51',
                                borderWidth: 1,
                                borderStyle: 'solid'
                            }
                        }
                    },
                    itemBorderRadius: {
                        value: {
                            leftTop: 15,
                            rightTop: 15,
                            leftBottom: 15,
                            rightBottom: 15,
                        }
                    }
                },
                title: {
                    padding: {
                        value: {
                            top: 16,
                            bottom: 16,
                            left: 0,
                            right: 0,
                        }
                    },
                    font: {
                        value: {
                            fontSize: '18px',
                            color: '#826694',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    maxLength: {
                        value: 100
                    },
                },
                abstract: {
                    padding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    font: {
                        value: {
                            fontSize: '12px',
                            color: '#818181',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    maxLength: {
                        value: 200
                    },
                }

            },
            style7: {
                container: {
                    padding: {
                        value: {
                            top: 20,
                            bottom: 20,
                            left: 0,
                            right: 0,
                        }
                    },
                    border: {
                        value: {
                            borderColor: '#e5e5e5',
                            borderWidth: 1,
                            borderStyle: 'dashed'
                        }
                    }
                },
                serialNumber: {
                    position: {
                        value: 'flex-start'
                    },
                    width: {
                        value: 18
                    },
                    height: {
                        value: 18
                    },
                    borderRadius: {
                        value: {
                            leftTop: 9,
                            rightTop: 9,
                            leftBottom: 9,
                            rightBottom: 9,
                        }
                    },
                    firstFont: {
                        value: {
                            fontSize: '12px',
                            color: '#FFFFFF',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    firstBackgroundColor: {
                        value: '#F41550'
                    },
                    firstBorder: {
                        value: {
                            top: {
                                borderColor: '#F41550',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            bottom: {
                                borderColor: '#F41550',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            left: {
                                borderColor: '#F41550',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            right: {
                                borderColor: '#F41550',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            }
                        }
                    },
                    secondFont: {
                        value: {
                            fontSize: '12px',
                            color: '#FFFFFF',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    secondBackgroundColor: {
                        value: '#E6D12D'
                    },
                    secondBorder: {
                        value: {
                            top: {
                                borderColor: '#E6D12D',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            bottom: {
                                borderColor: '#E6D12D',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            left: {
                                borderColor: '#E6D12D',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            right: {
                                borderColor: '#E6D12D',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            }
                        }
                    },
                    thirdFont: {
                        value: {
                            fontSize: '12px',
                            color: '#FFFFFF',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    thirdBackgroundColor: {
                        value: '#3FA2F1'
                    },
                    thirdBorder: {
                        value: {
                            top: {
                                borderColor: '#3FA2F1',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            bottom: {
                                borderColor: '#3FA2F1',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            left: {
                                borderColor: '#3FA2F1',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            right: {
                                borderColor: '#3FA2F1',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            }
                        }
                    },

                    otherFont: {
                        value: {
                            fontSize: '12px',
                            color: '#333333',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'center',
                        }
                    },
                    otherBackgroundColor: {
                        value: '#EDEDED'
                    },
                    otherBorder: {
                        value: {
                            top: {
                                borderColor: '#EDEDED',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            bottom: {
                                borderColor: '#EDEDED',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            left: {
                                borderColor: '#EDEDED',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            },
                            right: {
                                borderColor: '#EDEDED',
                                borderWidth: 0,
                                borderStyle: 'solid'
                            }
                        }
                    },

                    padding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 9,
                        }
                    }
                },
                content: {
                    containerPadding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    titleFont: {
                        value: {
                            fontSize: '14px',
                            color: '#333333',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    timePaddingLeft:{
                        value: 2
                    },
                    timeFont: {
                        value: {
                            fontSize: '14px',
                            color: '#999999',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                },
            },
            style8: {
                container: {
                    padding: {
                        value: {
                            top: 10,
                            bottom: 10,
                            left: 0,
                            right: 0,
                        }
                    },
                    border: {
                        value: {
                            borderColor: '#e5e5e5',
                            borderWidth: 1,
                            borderStyle: 'dashed'
                        }
                    }
                },
                poster:{
                    height: {
                        value: 90
                    },
                    width: {
                        value: 160
                    },
                    margin: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 16,
                        }
                    },
                    layout:{
                        value :{
                            backgroundPositionX:'center',
                            backgroundPositionY:'center',
                            backgroundSize:'cover',
                            backgroundRepeatX: false,
                            backgroundRepeatY: false,
                        }
                    }
                },
                title: {
                    padding: {
                        value: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    titleFont: {
                        value: {
                            fontSize: '14px',
                            color: '#666666',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                },
                date: {
                    showTime: {
                        value: true
                    },
                    padding: {
                        value: {
                            top: 7,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    timeFont: {
                        value: {
                            fontSize: '12px',
                            color: '#666666',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                },
                abstract: {
                    showAbstract: {
                        value: true
                    },
                    padding: {
                        value: {
                            top: 10,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }
                    },
                    font: {
                        value: {
                            fontSize: '14px',
                            color: '#000000',
                            italic: false,
                            bold: false,
                            textDecoration: false,
                            fontFamily: '微软雅黑',
                            textAlign: 'left',
                        }
                    },
                    maxLength: {
                        value: 200
                    },
                }
            }
        });

        let page = new Attribute('分页设置', 'page', {
            pageable: true,
            pageSize: 10
        });


        viewGroup.setAttributes({listStyle, page});


        let styleGroup = new AttributeGroup('styleGroup', '样式设置');

        let background = new Attribute('背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let borderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let padding = new Attribute('内边距', 'padding', {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        });

        let border = new Attribute('边框', 'border', {
            top: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right: {
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        }).addAttributes({
            borderStyleHidden: true
        });

        let boxShadow = new Attribute('阴影', 'boxShadow', {
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        });


        styleGroup.setAttributes({background, border, borderRadius, padding, boxShadow});

        let moreConfig = new Attribute('更多/标签链接设置', 'link', {
            target: '_blank', //_blank 新窗口打开 _self 当前窗口打开
            linkType: 2, //1 外部链接，2其它页面
            linkUrl: '',
            pagePath: '',
            pageParamType: 0, //0，无参数，1，指定内容 2，指定内容分类
            contentId: '',
            classId: '',
            labelId: '',
        }).addAttributes({
            hiddenParam: true,
            hiddenLinkType: true
        });

        let itemClickConfig = new Attribute('单个图文链接设置', 'link', {
            target: '_blank', //_blank 新窗口打开 _self 当前窗口打开
            linkType: 2, //1 外部链接，2其它页面
            linkUrl: '',
            pagePath: '',
            pageParamType: 0, //0，无参数，1，指定内容 2，指定内容分类
            contentId: '',
            classId: '',
            labelId: '',
        }).addAttributes({
            hiddenParam: true,
            hiddenLinkType: true
        });

        let linkGroup = new AttributeGroup('linkGroup', '链接设置').setAttributes({
            moreConfig, itemClickConfig
        });


        let otherGroup = new AttributeGroup('otherGroup', '其他设置');

        let customClasses = new Attribute('class', 'text', '').addAttributes({
            placeholder: '自定义class',
            titleStyle: {
                width: '58px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });

        let carryRouter = new Attribute('携带路由', 'checkbox', true).addAttributes({
            content: '携带路由'
        }).hiddenTitle();

        let routerType = new Attribute('路由类型', 'select','1').addAttributes({
            options: [
                {id: '1',label:'当前页面'},
                {id: '2',label:'自定义'},
            ],
            titleStyle: {
                textAlign: 'right',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return carryRouter.value;
        });

        let pageHeader = new Attribute('页头选择','pageHeader2','').addAttributes({
            titleStyle: {
                textAlign: 'right',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return carryRouter.value && routerType.value === '1';
        });

        let menuId = new Attribute('路由id', 'text', '').addAttributes({
            placeholder: '请输入自定义路由id',
            titleStyle: {
                width: '54px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        }).setShowMode(()=>{
            return carryRouter.value && routerType.value === '2';
        });

        otherGroup.setAttributes({customClasses,carryRouter,routerType,pageHeader,menuId});

        let dataSrc = new Attribute('数据源设置', 'articleListDataSrc', {
            dataSrc: 1, //数据来源，1：模块设置 2：页面参数
            classId: '',
            labelId: '',
            hot: false
        }).hiddenTitle();

        let dataSrcGroup = new AttributeGroup('dataSrcGroup', '数据源设置').setAttributes({dataSrc});


        let attributes = {
            dataSrcGroup,
            linkGroup,
            titleGroup,
            listContainerGroup,
            viewGroup,
            layoutGroup,
            styleGroup,
            otherGroup
        };

        this.setAttributes(attributes);
    }

    setPosition(position: { left: number, top: number }) {
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;

        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        let {version} = moduleConfig;
        let attributes = {};
        if (!version) {
            attributes = {
                dataSrcGroup: {
                    dataSrc: {
                        dataSrc: moduleConfig.attributes.dataSrc,
                        classId: moduleConfig.attributes.classId,
                        labelId: moduleConfig.attributes.labelId,
                    }
                },
                linkGroup: {
                    moreConfig: {
                        target: moduleConfig.attributes.moreConfig.target,
                        linkType: 2,
                        linkUrl: moduleConfig.attributes.moreConfig.linkUrl,
                        pagePath: moduleConfig.attributes.moreConfig.pagePath,
                        pageParamType: 0,
                        contentId: '',
                        classId: '',
                        labelId: '',
                    },
                    itemClickConfig: {
                        target: moduleConfig.attributes.itemClickConfig.target,
                        linkType: 2,
                        linkUrl: moduleConfig.attributes.itemClickConfig.linkUrl,
                        pagePath: moduleConfig.attributes.itemClickConfig.pagePath,
                        pageParamType: 0,
                        contentId: '',
                        classId: '',
                        labelId: '',
                    }
                },
                titleGroup: {
                    showTitle: moduleConfig.attributes.showTitle,
                    title: moduleConfig.attributes.titleConfig.title,
                    font: {
                        fontSize: moduleConfig.attributes.titleConfig.fontSize,
                        color: moduleConfig.attributes.titleConfig.color,
                        italic: moduleConfig.attributes.titleConfig.fontStyle,
                        bold: moduleConfig.attributes.titleConfig.fontWeight,
                        textDecoration: false,
                        fontFamily: moduleConfig.attributes.titleConfig.fontFamily,
                        textAlign: 'center',
                    },
                    showMore: moduleConfig.attributes.showMore,
                },
                viewGroup: {
                    listStyle: {
                        style: moduleConfig.attributes.listStyle
                    },
                    page: {
                        pageable: moduleConfig.attributes.pageable,
                        pageSize: moduleConfig.attributes.pageSize
                    }
                },
                layoutGroup: {
                    layout: {
                        width: moduleConfig.attributes.width,
                        height: moduleConfig.attributes.height,
                        left: moduleConfig.attributes.left,
                        top: moduleConfig.attributes.top,
                        zIndex: moduleConfig.attributes.zIndex
                    }
                },
                otherGroup: {
                    customClasses: moduleConfig.attributes.customClasses
                }
            }

        } else {
            if (moduleConfig.attributes) {
                let listStyle = moduleConfig.attributes.viewGroup.listStyle;
                if (listStyle.style === 'style2' || listStyle.style === 'style5') {
                    listStyle.style = 'style3';
                }
            }
            attributes = moduleConfig.attributes;
        }

        this.syncAttributes(attributes);
    }

}
