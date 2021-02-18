<template>
    <div class="club-container">
        <div class="club-info" :style="clubInfoStyle">
            <div class="club-name-switch">
                <div class="club-name">北京校友会</div>
                <div class="club-switch" :style="clubSwitch">{{attributes.buttonName.value}}</div>
            </div>
            <div class="club-introduce">
                12年的学妹，现在北京，本人外向活泼，喜好结识各路大神，各位校友们，在北京的有时间可以约一起出去玩啊
            </div>
        </div>
        <div class="club-member-activity">
            <div class="club-member">成员（20）</div>
            <div class="club-activity">活动（20）</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "alumniClubs",
        props: {
            module: Object
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            clubInfoStyle() {
                let style = {
                    color: this.attributes.color.value
                };
                if (this.attributes.backgroundStyle.value == 1) {
                    style.backgroundColor = this.attributes.backgroundColor.value;
                } else {
                    style.backgroundImage = 'url("' + this.attributes.backgroundImage.value + '")';
                }
                return style;
            },
            clubSwitch() {
                return {
                    borderColor: this.attributes.color.value
                }
            }
        }
    }
</script>

<style scoped>
    .club-container {
        position: relative;
        padding-bottom: 20px;
    }

    .club-info {
        padding: 16px 0;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }

    .club-name-switch {
        line-height: 1;
        padding: 0 14px;
    }

    .club-name {
        max-width: 260px;
        font-size: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 16px;
        display: inline-block;
        vertical-align: middle;
    }

    .club-switch {
        font-size: 12px;
        border: 1px solid #FFFFFF;
        border-radius: 15px;
        padding: 3px 9px;
        display: inline-block;
        vertical-align: middle;
    }

    .club-introduce {
        margin: 10px 16px 26px;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 24px;
        height: 48px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .club-member-activity {
        position: absolute;
        bottom: 0;
        right: 18px;
        left: 18px;
        background: #FFFFFF;
        box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.09);
        border-radius: 8px;
        display: flex;
        padding: 3px 0;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
    }

    .club-member {
        flex: 1;
        height: 35px;
        line-height: 35px;
        border-right: 1px solid #EBEBEB;
    }

    .club-activity {
        flex: 1;
        height: 35px;
        line-height: 35px;
    }
</style>
