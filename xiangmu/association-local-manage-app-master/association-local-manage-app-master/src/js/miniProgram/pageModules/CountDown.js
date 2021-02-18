import Module from "../Module";
import Attribute from "../Attribute";

export default class CountDown extends Module{
    constructor(config){
        super('countDown');

        let isShowTitle, title, titleColor, titleIcon, titleIconPosition, endDay, timingStyle, timeColor, timeFont, backgroundSrc, height, paddingTop;

        isShowTitle = new Attribute('checkboxAttr', true)
            .addAttributes({
                title: '标题显示设置',
                content: '显示标题'
            }).openRequired(() => {
                return true;
            });

        title = new Attribute('textAttr','倒计时')
            .addAttributes({
                title: '功能标题',
                placeholder: '请输入功能标题，15字以内',
                maxLength: 15,
            });

        titleColor = new Attribute('colorAttr', '#333333')
            .addAttributes({
                title: '标题字体颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            }).setShowMode(()=>{
                return isShowTitle.value;
            });

        titleIcon = new Attribute('imageAttr', '')
            .addAttributes({
                title: '标题图标',
                width: 30,
                height: 30,
                maxSize: 25 * 1024,
                imageStore: null,
                showClear: true,
                isContain: true
            }).setShowMode(()=>{
                return isShowTitle.value;
            });

        titleIconPosition = new Attribute('selectAttr', 'left')
            .addAttributes({
                title: '标题图标位置',
                items: [
                    {value:'left', title: '标题左侧'},
                    {value:'right', title: '标题右侧'}
                ],
            }).openRequired(() => {
                return true;
            });

        endDay = new Attribute('dateAttr', new Date()).addAttributes({
            title: '截止时间'
        }).openRequired(()=>{
            return true;
        });

        timingStyle = new Attribute('selectAttr', 'day')
            .addAttributes({
                title: '计时形式',
                items: [
                    {value:'day', title: '天'},
                    {value:'hour', title: '小时'},
                    {value:'minute', title: '分钟'},
                    {value:'second', title: '秒'}
                ],
            }).openRequired(() => {
                return true;
            });

        timeColor = new Attribute('colorAttr', '#333333')
            .addAttributes({
                title: '时间字体颜色',
                showAlpha: false,
                showClear: false,
                showPick: true,
                predefine: []
            }).setShowMode(()=>{
                return true;
            });

        timeFont = new Attribute('numberAttr',30).addAttributes({
            title: '字体大小',
            max: Infinity
        });

        backgroundSrc = new Attribute('imageAttr','')
            .addAttributes({
                title: '容器背景',
                width: 270,
                height: 80,
                maxSize: 200*1024,
                imageStore: null,
                showClear: true
            });

        height = new Attribute('numberAttr',75).addAttributes({
            title: '容器高度',
            max: Infinity
        });

        paddingTop = new Attribute('numberAttr',20).addAttributes({
            title: '文字距离容器上边高度',
            max: Infinity
        });

        let attributes = {isShowTitle, title, titleColor, titleIcon, titleIconPosition, endDay, timingStyle, timeColor, timeFont, backgroundSrc, height, paddingTop};

        this.setAttributes(attributes);
        this.syncAttributes(config);
    }
}
