export default {
    install(Vue){
        Vue.directive('hyperlink',{
            inserted(el,{value:{className,target,innerHtml}}){
                let str = innerHtml;
                if(!str){
                    el.innerHTML = '';
                    return;
                }
                if(!className){
                    className = 'cursor-pointer lrd-a underline';
                }

                if(!target){
                    target = '_blank';
                }

                class Match{
                    constructor(str, index, lastIndex) {
                        this.str = str; //匹配到的url
                        this.index = index; //匹配到的字符串在原字符串中的起始位置
                        this.lastIndex = lastIndex; //匹配到的字符串在原字符串中的终止位置
                    }
                }

                /**
                 * 匹配http://|https://
                 */
                let regexp1 = new RegExp('(http://|https://)', 'g');
                let matchArray = [];
                let matchStr;
                while ((matchStr = regexp1.exec(str)) != null) {
                    matchArray.push(new Match(matchStr[0], matchStr.index, regexp1.lastIndex));
                }

                // eslint-disable-next-line no-control-regex
                let regexp2 = /\s|[^\u0000-\u00FF]|[,;`·"|']/g;
                for (let i = 0; i < matchArray.length; i++) {
                    //考虑内容结束但没有分隔符的情况
                    let endIndex = matchArray[i + 1] ? matchArray[i + 1].index : str.length;
                    let substr = str.substring(matchArray[i].lastIndex, endIndex);
                    if ((matchStr = regexp2.exec(substr)) != null) { //匹配到分隔符
                        if (regexp2.lastIndex > 1) { //提取网址
                            matchArray[i].lastIndex += regexp2.lastIndex - 1;
                            matchArray[i].str = str.substring(matchArray[i].index, matchArray[i].lastIndex);
                        } else { //考虑"http:// "这样的情况
                            matchArray.splice(i, 1);
                        }
                    } else if (endIndex === str.length) { //考虑内容末尾无空白符的情况
                        if (matchArray[i].lastIndex < endIndex) { //提取网址
                            matchArray[i].lastIndex = endIndex;
                            matchArray[i].str = str.substring(matchArray[i].index, endIndex);
                        } else { //考虑内容末尾无空白符，但也没有实际网址的情况，如："http://"
                            matchArray.splice(i, 1);
                        }
                    }  else if (matchArray[i + 1] && (endIndex === matchArray[i + 1].index)) {
                        //考虑内容并未到结尾，无空白符的情况，如:http://baidu.comhttp://sina.com，这种情况识别为一个网址
                        matchArray.splice(i + 1, 1);
                        i = i - 1;
                    } else { //其他情况
                        matchArray.splice(i, 1);
                    }
                    regexp2.lastIndex = 0;
                }

                let html = "";
                for(let i=0; i <= matchArray.length; i++){
                    let match = matchArray[i];
                    let beginIndex = i===0 ? 0 : matchArray[i-1].lastIndex;
                    let endIndex = i === matchArray.length ? str.length : matchArray[i].index;
                    let stri = str.substring(beginIndex, endIndex);
                    let urli = "";
                    if(i < matchArray.length){
                        urli = `<a href="${matchArray[i].str}" class="${className}" target="${target}">${match.str}</a>`;
                    }
                    html += stri + urli;
                }
                el.innerHTML = html;
            },
            componentUpdated(el,{value:{className,target,innerHtml},oldValue:{innerHtml:innerHtmlOld}}){
                let str = innerHtml;
                if(!str){
                    el.innerHTML = '';

                }

                if(innerHtml === innerHtmlOld){
                    return;
                }
                if(!className){
                    className = 'cursor-pointer lrd-a underline';
                }

                if(!target){
                    target = '_blank';
                }

                class Match{
                    constructor(str, index, lastIndex) {
                        this.str = str; //匹配到的url
                        this.index = index; //匹配到的字符串在原字符串中的起始位置
                        this.lastIndex = lastIndex; //匹配到的字符串在原字符串中的终止位置
                    }
                }

                /**
                 * 匹配http://|https://
                 */
                let regexp1 = new RegExp('(http://|https://)', 'g');
                let matchArray = [];
                let matchStr;
                while ((matchStr = regexp1.exec(str)) != null) {
                    matchArray.push(new Match(matchStr[0], matchStr.index, regexp1.lastIndex));
                }

                // eslint-disable-next-line no-control-regex
                let regexp2 = /\s|[^\u0000-\u00FF]|[,;`·"|']/g;
                for (let i = 0; i < matchArray.length; i++) {
                    //考虑内容结束但没有分隔符的情况
                    let endIndex = matchArray[i + 1] ? matchArray[i + 1].index : str.length;
                    let substr = str.substring(matchArray[i].lastIndex, endIndex);
                    if ((matchStr = regexp2.exec(substr)) != null) { //匹配到分隔符
                        if (regexp2.lastIndex > 1) { //提取网址
                            matchArray[i].lastIndex += regexp2.lastIndex - 1;
                            matchArray[i].str = str.substring(matchArray[i].index, matchArray[i].lastIndex);
                        } else { //考虑"http:// "这样的情况
                            matchArray.splice(i, 1);
                        }
                    } else if (endIndex === str.length) { //考虑内容末尾无空白符的情况
                        if (matchArray[i].lastIndex < endIndex) { //提取网址
                            matchArray[i].lastIndex = endIndex;
                            matchArray[i].str = str.substring(matchArray[i].index, endIndex);
                        } else { //考虑内容末尾无空白符，但也没有实际网址的情况，如："http://"
                            matchArray.splice(i, 1);
                        }
                    }  else if (matchArray[i + 1] && (endIndex === matchArray[i + 1].index)) {
                        //考虑内容并未到结尾，无空白符的情况，如:http://baidu.comhttp://sina.com，这种情况识别为一个网址
                        matchArray.splice(i + 1, 1);
                        i = i - 1;
                    } else { //其他情况
                        matchArray.splice(i, 1);
                    }
                    regexp2.lastIndex = 0;
                }

                let html = "";
                for(let i=0; i <= matchArray.length; i++){
                    let match = matchArray[i];
                    let beginIndex = i===0 ? 0 : matchArray[i-1].lastIndex;
                    let endIndex = i === matchArray.length ? str.length : matchArray[i].index;
                    let stri = str.substring(beginIndex, endIndex);
                    let urli = "";
                    if(i < matchArray.length){
                        urli = `<a href="${matchArray[i].str}" class="${className}" target="${target}">${match.str}</a>`;
                    }
                    html += stri + urli;
                }

                el.innerHTML = html;
            },
        });
    }
}
