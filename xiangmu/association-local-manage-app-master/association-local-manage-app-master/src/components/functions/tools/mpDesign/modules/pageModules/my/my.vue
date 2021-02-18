<template>
    <div class="my-wrapper" :style="myWrapperStyle">
        <div class="user-info">
            <div class="user-avatar" :style="userAvatarStyle"></div>
            <div class="user-name-identity">
                <div class="user-name">{{nickname}}</div>
                <div class="user-identity">管理员</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "my",
        props: {
            module: Object
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            title() {
                return this.attributes.title.value;
            },
            color() {
                return this.attributes.color.value;
            },
            backgroundStyle() {
                return this.attributes.backgroundStyle.value;
            },
            backgroundColor() {
                return this.attributes.backgroundColor.value;
            },
            backgroundImage() {
                return this.attributes.backgroundImage.value;
            },
            myWrapperStyle() {
                let style = {
                    color: this.color
                };
                if (this.backgroundStyle == 1) {
                    style.backgroundColor = this.backgroundColor;
                } else {
                    style.backgroundImage = 'url("' + this.backgroundImage + '")';
                }
                return style;
            },
            nickname() {
                return '昵称';
            },
            avatar() {
                return '';
            },
            userAvatarStyle() {
                if (this.avatar && this.avatar != '') {
                    return {
                        backgroundImage: 'url("' + this.avatar + '")'
                    }
                } else {
                    return {
                        backgroundImage: 'url("https://wxstore.blob.core.chinacloudapi.cn/huiyixing-event-container/8273da8f07524476b0a2079b8a9bb5a5.png")'
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .my-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 150px;
        padding: 0 17px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .user-info {
        display: flex;
    }

    .user-avatar {
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 46px;
        height: 46px;
        border-radius: 50%;
    }

    .user-name-identity {
        flex: 1;
        padding-left: 15px;
    }

    .user-name {
        font-size: 16px;
        letter-spacing: 0;
    }

    .user-identity {
        padding-top: 4px;
        font-size: 12px;
        letter-spacing: 0;
    }
</style>
