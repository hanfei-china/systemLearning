<template>
    <div class="layout-wrap">
        <div v-if="list.length === 1" class="layout-one flex flex-column flex-center"
             :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
            <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                <img :src="list[0].attributes.icon.value"/>
            </div>
            <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                 v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
            </div>
        </div>

        <div v-if="list.length === 2" class="layout-two text-align-center flex">
            <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                 :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
                <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                    <img :src="list[0].attributes.icon.value"/>
                </div>
                <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                     v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
                </div>
            </div>
            <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                 :style="{backgroundColor: list[1].attributes.backgroundColor.value}">
                <div class="flex flex-center" v-if="list[1].attributes.showIcon.value">
                    <img :src="list[1].attributes.icon.value"/>
                </div>
                <div class="btn-title text-align-center" :style="{color: list[1].attributes.textColor.value}"
                     v-if="list[1].attributes.showTitle.value">{{list[1].attributes.title.value}}
                </div>
            </div>
        </div>

        <div v-if="list.length === 3" class="layout-three text-align-center flex">
            <div class="btnArea1 flex-fill-in-the-remaining-space flex flex-column flex-center"
                 :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
                <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                    <img :src="list[0].attributes.icon.value"/>
                </div>
                <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                     v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
                </div>
            </div>
            <div class="flex-fill-in-the-remaining-space">
                <div class="btnArea2 flex flex-column flex-center" :style="{backgroundColor: list[1].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[1].attributes.showIcon.value">
                        <img :src="list[1].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[1].attributes.textColor.value}"
                         v-if="list[1].attributes.showTitle.value">{{list[1].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea2 flex flex-column flex-center" :style="{backgroundColor: list[2].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[2].attributes.showIcon.value">
                        <img :src="list[2].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[2].attributes.textColor.value}"
                         v-if="list[2].attributes.showTitle.value">{{list[2].attributes.title.value}}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="list.length === 4" class="layout-four text-align-center">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                        <img :src="list[0].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                         v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
                    </div>
                </div>
                <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[1].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[1].attributes.showIcon.value">
                        <img :src="list[1].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[1].attributes.textColor.value}"
                         v-if="list[1].attributes.showTitle.value">{{list[1].attributes.title.value}}
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[2].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[2].attributes.showIcon.value">
                        <img :src="list[2].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[2].attributes.textColor.value}"
                         v-if="list[2].attributes.showTitle.value">{{list[2].attributes.title.value}}
                    </div>
                </div>
                <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[3].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[3].attributes.showIcon.value">
                        <img :src="list[3].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[3].attributes.textColor.value}"
                         v-if="list[3].attributes.showTitle.value">{{list[3].attributes.title.value}}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="list.length === 5" class="layout-five text-align-center flex">
            <div class="flex-fill-in-the-remaining-space">
                <div class="btnArea1 flex flex-column flex-center"
                     :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                        <img :src="list[0].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                         v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea1 flex flex-column flex-center"
                     :style="{backgroundColor: list[1].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[1].attributes.showIcon.value">
                        <img :src="list[1].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[1].attributes.textColor.value}"
                         v-if="list[1].attributes.showTitle.value">{{list[1].attributes.title.value}}
                    </div>
                </div>
            </div>
            <div class="flex-fill-in-the-remaining-space">
                <div class="btnArea2 flex flex-column flex-center"
                     :style="{backgroundColor: list[2].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[2].attributes.showIcon.value">
                        <img :src="list[2].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[2].attributes.textColor.value}"
                         v-if="list[2].attributes.showTitle.value">{{list[2].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea2 flex flex-column flex-center"
                     :style="{backgroundColor: list[3].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[3].attributes.showIcon.value">
                        <img :src="list[3].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[3].attributes.textColor.value}"
                         v-if="list[3].attributes.showTitle.value">{{list[3].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea2 flex flex-column flex-center"
                     :style="{backgroundColor: list[4].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[4].attributes.showIcon.value">
                        <img :src="list[4].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[4].attributes.textColor.value}"
                         v-if="list[4].attributes.showTitle.value">{{list[4].attributes.title.value}}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="list.length === 6" class="layout-six text-align-center flex">
            <div class="flex-fill-in-the-remaining-space">
                <div class="btnArea1 flex flex-column flex-center"
                     :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                        <img :src="list[0].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                         v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
                    </div>
                </div>
                <div class="flex">
                    <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                         :style="{backgroundColor: list[1].attributes.backgroundColor.value}">
                        <div class="flex flex-center" v-if="list[1].attributes.showIcon.value">
                            <img :src="list[1].attributes.icon.value"/>
                        </div>
                        <div class="btn-title text-align-center" :style="{color: list[1].attributes.textColor.value}"
                             v-if="list[1].attributes.showTitle.value">{{list[1].attributes.title.value}}
                        </div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                         :style="{backgroundColor: list[2].attributes.backgroundColor.value}">
                        <div class="flex flex-center" v-if="list[2].attributes.showIcon.value">
                            <img :src="list[2].attributes.icon.value"/>
                        </div>
                        <div class="btn-title text-align-center" :style="{color: list[2].attributes.textColor.value}"
                             v-if="list[2].attributes.showTitle.value">{{list[2].attributes.title.value}}
                        </div>
                    </div>
                </div>
            </div>
            <div style="width: 110px;">
                <div class="btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[3].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[3].attributes.showIcon.value">
                        <img :src="list[3].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[3].attributes.textColor.value}"
                         v-if="list[3].attributes.showTitle.value">{{list[3].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[4].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[4].attributes.showIcon.value">
                        <img :src="list[4].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[4].attributes.textColor.value}"
                         v-if="list[4].attributes.showTitle.value">{{list[4].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[5].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[5].attributes.showIcon.value">
                        <img :src="list[5].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[5].attributes.textColor.value}"
                         v-if="list[5].attributes.showTitle.value">{{list[5].attributes.title.value}}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="list.length === 7" class="layout-seven text-align-center flex">
            <div class="flex-fill-in-the-remaining-space">
                <div class="btnArea1 flex flex-column flex-center"
                     :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                        <img :src="list[0].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                         v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea1 flex flex-column flex-center"
                     :style="{backgroundColor: list[2].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[2].attributes.showIcon.value">
                        <img :src="list[2].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[2].attributes.textColor.value}"
                         v-if="list[2].attributes.showTitle.value">{{list[2].attributes.title.value}}
                    </div>
                </div>
            </div>
            <div class="flex-fill-in-the-remaining-space">
                <div class="btnArea1 flex flex-column flex-center"
                     :style="{backgroundColor: list[1].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[1].attributes.showIcon.value">
                        <img :src="list[1].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[1].attributes.textColor.value}"
                         v-if="list[1].attributes.showTitle.value">{{list[1].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea1 flex flex-column flex-center"
                     :style="{backgroundColor: list[3].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[3].attributes.showIcon.value">
                        <img :src="list[3].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[3].attributes.textColor.value}"
                         v-if="list[3].attributes.showTitle.value">{{list[3].attributes.title.value}}
                    </div>
                </div>
            </div>
            <div class="flex-fill-in-the-remaining-space">
                <div class="btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[4].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[4].attributes.showIcon.value">
                        <img :src="list[4].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[4].attributes.textColor.value}"
                         v-if="list[4].attributes.showTitle.value">{{list[4].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[5].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[5].attributes.showIcon.value">
                        <img :src="list[5].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[5].attributes.textColor.value}"
                         v-if="list[5].attributes.showTitle.value">{{list[5].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[6].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[6].attributes.showIcon.value">
                        <img :src="list[6].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[6].attributes.textColor.value}"
                         v-if="list[6].attributes.showTitle.value">{{list[6].attributes.title.value}}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="list.length === 8" class="layout-eight text-align-center">
            <div class="flex">
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                        <img :src="list[0].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                         v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[1].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[1].attributes.showIcon.value">
                        <img :src="list[1].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[1].attributes.textColor.value}"
                         v-if="list[1].attributes.showTitle.value">{{list[1].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[2].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[2].attributes.showIcon.value">
                        <img :src="list[2].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[2].attributes.textColor.value}"
                         v-if="list[2].attributes.showTitle.value">{{list[2].attributes.title.value}}
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[3].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[3].attributes.showIcon.value">
                        <img :src="list[3].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[3].attributes.textColor.value}"
                         v-if="list[3].attributes.showTitle.value">{{list[3].attributes.title.value}}
                    </div>
                </div>
                <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[4].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[4].attributes.showIcon.value">
                        <img :src="list[4].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[4].attributes.textColor.value}"
                         v-if="list[4].attributes.showTitle.value">{{list[4].attributes.title.value}}
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[5].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[5].attributes.showIcon.value">
                        <img :src="list[5].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[5].attributes.textColor.value}"
                         v-if="list[5].attributes.showTitle.value">{{list[5].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[6].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[6].attributes.showIcon.value">
                        <img :src="list[6].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[6].attributes.textColor.value}"
                         v-if="list[6].attributes.showTitle.value">{{list[6].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[7].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[7].attributes.showIcon.value">
                        <img :src="list[7].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[7].attributes.textColor.value}"
                         v-if="list[7].attributes.showTitle.value">{{list[7].attributes.title.value}}
                    </div>
                </div>
            </div>
        </div>

        <div v-if="list.length === 9" class="layout-nine text-align-center">
            <div class="flex">
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[0].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[0].attributes.showIcon.value">
                        <img :src="list[0].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[0].attributes.textColor.value}"
                         v-if="list[0].attributes.showTitle.value">{{list[0].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[1].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[1].attributes.showIcon.value">
                        <img :src="list[1].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[1].attributes.textColor.value}"
                         v-if="list[1].attributes.showTitle.value">{{list[1].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[2].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[2].attributes.showIcon.value">
                        <img :src="list[2].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[2].attributes.textColor.value}"
                         v-if="list[2].attributes.showTitle.value">{{list[2].attributes.title.value}}
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[3].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[3].attributes.showIcon.value">
                        <img :src="list[3].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[3].attributes.textColor.value}"
                         v-if="list[3].attributes.showTitle.value">{{list[3].attributes.title.value}}
                    </div>
                </div>
                <div class="flex-fill-in-the-remaining-space btnArea flex flex-column flex-center"
                     :style="{backgroundColor: list[4].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[4].attributes.showIcon.value">
                        <img :src="list[4].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[4].attributes.textColor.value}"
                         v-if="list[4].attributes.showTitle.value">{{list[4].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[5].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[5].attributes.showIcon.value">
                        <img :src="list[5].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[5].attributes.textColor.value}"
                         v-if="list[5].attributes.showTitle.value">{{list[5].attributes.title.value}}
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[6].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[6].attributes.showIcon.value">
                        <img :src="list[6].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[6].attributes.textColor.value}"
                         v-if="list[6].attributes.showTitle.value">{{list[6].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[7].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[7].attributes.showIcon.value">
                        <img :src="list[7].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[7].attributes.textColor.value}"
                         v-if="list[7].attributes.showTitle.value">{{list[7].attributes.title.value}}
                    </div>
                </div>
                <div class="btnArea flex-fill-in-the-remaining-space flex flex-column flex-center"
                     :style="{backgroundColor: list[8].attributes.backgroundColor.value}">
                    <div class="flex flex-center" v-if="list[8].attributes.showIcon.value">
                        <img :src="list[8].attributes.icon.value"/>
                    </div>
                    <div class="btn-title text-align-center" :style="{color: list[8].attributes.textColor.value}"
                         v-if="list[8].attributes.showTitle.value">{{list[8].attributes.title.value}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "homeAreaBtn",
        props: {
            list: Array
        },
    }
</script>

<style scoped lang="less">
    .layout-wrap {
        padding: 10px 15px;

        .btnArea {
            width: auto;
            height: 100px;
        }

        img {
            display: inline-block;
            width: 40px;
            height: 40px;
        }

        .btn-title {
            font-size: 13px;
            color: #ffffff;
            margin-top: 5px;
        }
    }

    .layout-one {
        width: 100%;
        height: 150px;
    }

    .layout-two {
        .btnArea{
            width: auto;
            height: 150px;
        }
    }

    .layout-three {
        .btnArea1 {
            width: auto;
            height: 300px;
        }

        .btnArea2 {
            width: auto;
            height: 150px;
        }
    }

    .layout-four {
        .btnArea {
            width: auto;
            height: 150px;
        }
    }

    .layout-five {
        .btnArea1 {
            width: auto;
            height: 150px;
        }

        .btnArea2 {
            width: auto;
            height: 100px;
        }
    }

    .layout-six {
        .btnArea1 {
            width: auto;
            height: 200px;
        }
    }

    .layout-seven {
        .btnArea1 {
            width: auto;
            height: 150px;
        }
    }
</style>