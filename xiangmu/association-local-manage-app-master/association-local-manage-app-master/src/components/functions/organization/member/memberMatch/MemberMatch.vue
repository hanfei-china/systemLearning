<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside class="unset-padding position-relative border-right" :width="chosenQuery ? '400px': '200px'">
            <match-query-list ref="queryList" @select="setChosenQuery" @keyword="setKeyword"/>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-column flex-center border-bottom">
                    <div>
                        <el-input size="small" style="width: 400px;" clearable prefix-icon="el-icon-search" placeholder="输入校友姓名进行搜索，使用空格可实打实打底衫查询多个校友信息" v-model="search.content"/>
                    </div>
                </el-header>
                <el-main class="position-relative unset-padding" v-loading="loading">
                    <el-container class="absolute-fill-parent">
                        <el-main class="position-relative unset-padding">
                            <vue-scroll class=" background-color-white">
                                <div v-if="baiKeInfo" class="member-baike-info" style="padding: 20px 20px 0 20px;">
                                    <div style="padding-bottom: 8px;">
                                        <a class="match-member-title" :href="iframeSrc" target="_blank" v-html="htmlToMatch(baiKeInfo.title+' — 百度百科')"/>
                                    </div>
                                    <div class="flex">
                                        <div class="flex-fill-in-the-remaining-space" v-for="(blockInfo,index) of baiKeInfo.blockInfos" v-show="index <= 1" :key="index">
                                            <div class="flex baike-base-info-item" v-for="(baseInfo,index) of blockInfo" :key="index">
                                                <div class="baike-base-info-item-name">{{baseInfo.name}}</div>
                                                <div class="baike-base-info-item-value">{{baseInfo.value}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style="padding: 20px;">
                                    <div v-for="article of list" class="match-member-article" :key="article.id">
                                        <a class="match-member-title" :href="article.url" target="_blank" v-html="htmlToMatch(article.title)"/>
                                        <div>
                                            <span class="match-member-time">{{article.time}} - </span>
                                            <span v-html="htmlToMatch(article.content)"/>
                                        </div>
                                    </div>
                                </div>
                            </vue-scroll>
                            <no-data v-show="list.length <= 0 && !baiKeInfo">
                                <div style="padding-top: 10px;text-align: center;color: #888888;">未检索到校友信息，请尝试输入校友全名进行检索</div>
                            </no-data>
                        </el-main>
                        <el-footer class="flex flex-column flex-center">
                            <div class="text-align-right">
                                <el-pagination :current-page="search.currentPage" small
                                               @current-change="handleCurrentChange"
                                               :page-size="search.limit"
                                               layout="prev, pager, next, jumper"
                                               :total="search.total">
                                </el-pagination>
                            </div>
                        </el-footer>
                    </el-container>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import NoData from "../../../../util/noData/NoData";
    import MatchQueryList from "./query/MatchQueryList";
    export default {
        name: "MemberMatch",
        components: {MatchQueryList, NoData},
        data(){
            return {
                search:{
                    limit: 20,
                    currentPage: 1,
                    content: '',
                    total: 0
                },

                list: [],
                baiKeInfo: null,
                loading: true,

                chosenQuery: null,
            }
        },
        computed:{
            iframeSrc(){
                if(this.search.content && this.search.content.indexOf(" ") === -1){
                    return `https://baike.baidu.com/item/${this.search.content}`;
                }
                return '';
            }
        },
        methods:{
            setChosenQuery(query){
                this.chosenQuery = query;
                // this.search.content = query.queryConfig.replace(/\\s*|\t|\r|\n|,|，/g,' ')
                //     .replace(/&nbsp;/g,' ').trim();
            },
            setKeyword(keyword){
                this.search.content = keyword;
            },
            htmlToMatch(value){
                if(!value){
                    return '';
                }

                value = value.replace(/<img[^>]*?>/g,'[图片]')
                    .replace(/<[^>]*>|/g,"")
                    .replace(/\\s*|\t|\r|\n/g,'')
                    .replace(/&nbsp;/g,'');

                let content =  this.search.content || '';
                if(content){
                    content = content.trim();
                }

                let maxLength = 500;
                let length = value.length;

                // if(content){
                //     let keys = content.split(' ');
                //     let indexes = [];
                //     for(let key of keys){
                //         let index = value.indexOf(key);
                //         if(index > -1){
                //             indexes.push(index);
                //         }
                //     }
                //
                //     let indexLength = indexes.length;
                //     if(length > maxLength){
                //         let space = maxLength / indexLength;
                //
                //         let values = [];
                //
                //         indexes.map((srcIndex,index)=>{
                //             if(index === 0 && srcIndex > 0){
                //                 values.push('...');
                //             }
                //
                //
                //             let endValue = srcIndex + space;
                //
                //             let nextValue = 0;
                //
                //             if(index === indexLength - 1){
                //                 if(endValue > length){
                //                     endValue = length;
                //                 }
                //                 nextValue = length;
                //             }else{
                //                 nextValue = indexes[index + 1];
                //             }
                //
                //             if(endValue < nextValue){
                //                 values.push(value.substring(srcIndex,endValue).trim() + '...');
                //             }else if(endValue === nextValue){
                //                 values.push(value.substring(srcIndex,endValue).trim());
                //             }else{
                //                 values.push(value.substring(srcIndex,nextValue).trim());
                //             }
                //         });
                //
                //         if(values.length > 0){
                //             value = '';
                //         }
                //
                //         for(let _value of values){
                //             value += _value;
                //         }
                //
                //     }
                //
                //     for(let key of keys){
                //         value = value.replace(new RegExp(key,"gm"),`<span style="color:red;">${key}</span>`);
                //     }
                //
                //     if(length > maxLength){
                //         if(indexes.length > 0){
                //             value += '...';
                //         }else{
                //             value = value.substring(0,maxLength) + '...';
                //         }
                //     }
                //
                // }else{
                //     if(length > maxLength){
                //         value = value.substring(0,maxLength) + '...';
                //     }
                // }

                if(length > maxLength){
                    value = value.substring(0,maxLength) + '...';
                }

                return value.trim();
            },
            handleCurrentChange(currentPage){
                this.search.currentPage = currentPage;
                this.getList();
            },
            getList(){
                let content =  this.search.content || '';
                if(content){
                    content = content.trim();
                }

                if(content){
                    this.loading = true;

                    let condition = {
                        limit: this.search.limit,
                        offset: (this.search.currentPage - 1) * this.search.limit,
                        content
                    };

                    this.$request.post('/api/admin/member/match',condition).then(res=>{
                        this.list = res.data.list;
                        this.baiKeInfo = res.data.baiKeInfo;
                        this.search.total = res.data.total;
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }

            },
            refreshList(){
                this.search.currentPage = 1;
                this.getList();
            }
        },
        created() {
            this.getList();
        },
        watch:{
            'search.content'(){
                this.refreshList();
            }
        }
    }
</script>

<style lang="less">

    .match-member{
        &-article{
            &:not(:last-child){
                padding-bottom: 16px;
            }
        }

        &-title{
            color: rgb(0,0,204) !important;
            font-weight: 400;
            font-size: medium;
            text-decoration: underline;
        }

        &-time{
            color: #666;
            font-size: 13px;
        }
    }

    .member-baike-info{

    }

    .baike-base-info-item{
        &:not(:last-child){
            padding-bottom: 10px;
        }

        &-name{
            width: 80px;
            padding: 0 5px 0 0px;
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            color: #999;
        }

        &-value{
            color: #333;
            width: 285px;
            position: relative;
            word-break: break-all;
        }
    }
</style>
