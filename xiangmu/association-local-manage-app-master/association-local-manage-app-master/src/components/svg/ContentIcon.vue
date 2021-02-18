<template>
    <div style="width: 20px;flex: 0 0 20px;"><img style="max-height: 100%;max-width: 100%;" :src="src"/></div>
</template>

<script>
    export const contentType = {
        0: '图文',
        1: '链接',
        2: '链接',
        3: '链接',
        4: '视频',
        5: '文件',
        6: '公众号文章',
        7: '网站文章',
        8: '音频'
    };
    import ContentIcon from '../../assets/contentManage/content-icon.png';
    import EnclosureIcon from '../../assets/contentManage/enclosure-icon.png';
    import ExcelIcon from '../../assets/contentManage/excel-icon.png';
    import ImageIcon from '../../assets/contentManage/image-icon.png';
    import LinkIcon from '../../assets/contentManage/link-icon.png';
    import OtherIcon from '../../assets/contentManage/other-icon.png';
    import PPTIcon from '../../assets/contentManage/ppt-icon.png';
    import TxtIcon from '../../assets/contentManage/txt-icon.png';
    import VideoIcon from '../../assets/contentManage/video-icon.png';
    import AudioIcon from '../../assets/contentManage/audio-icon.png';
    import WordIcon from '../../assets/contentManage/word-icon.png';
    import PDFIcon from '../../assets/contentManage/pdf-icon.png';

    import {isImg,isWord,isExcel,isPDF,isPPT,isTxt,isZIP,getFileExt} from "../../js/util/utilFunction";

    export default {
        name: "ContentIcon",
        props: {
            contentType: Number,
            fileName: String
        },
        computed: {
            src() {
                let contentType = this.contentType;
                let fileName = this.fileName;
                if(contentType === 0 || contentType === 6 || contentType === 7){
                    return ContentIcon;
                }else if(contentType === 1 || contentType === 2 || contentType === 3){
                    return LinkIcon;
                }else if(contentType === 4){
                    return VideoIcon;
                }else if(contentType === 1 || contentType === 2 || contentType === 3){
                    return LinkIcon;
                }else if(contentType === 5){
                    let ext = getFileExt(fileName);
                    if(isImg(ext)){
                        return ImageIcon;
                    }else if(isWord(ext)){
                        return WordIcon;
                    }else if(isExcel(ext)){
                        return ExcelIcon;
                    }else if(isPPT(ext)){
                        return PPTIcon;
                    }else if(isPDF(ext)){
                        return PDFIcon;
                    }else if(isTxt(ext)){
                        return TxtIcon;
                    }else if(isZIP(ext)){
                        return EnclosureIcon;
                    }else{
                        return OtherIcon;
                    }
                }else if(contentType === 8){
                    return AudioIcon;
                }else{
                    return OtherIcon;
                }
            }
        }
    }
</script>
