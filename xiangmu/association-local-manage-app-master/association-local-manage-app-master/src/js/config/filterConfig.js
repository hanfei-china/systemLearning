import { formatDate, currency, encryptedPhone, cascadeArrayToString } from "../util/utilFunction";
import {
    memberUserStatus,
    memberRegisterMode,
    memberInfoUpdateType,
    memberInfoUpdateStatus,
    memberApplyBranchStatus,
    duesPaymentType,
    contentType,
    adminType,
    activitySignUpExamineStatus,
    activitySignInStatus,
    logType,
    activitySignUpType,
    activitySignInType
} from "../util/constantStore";

export default {
    install(Vue) {

        Vue.filter('timeToDate', (value) => {
            if (value && value.length > 10) {
                return value.substring(0, 10);
            }
        });

        Vue.filter('encryptedPhone', (value) => {
            return encryptedPhone(value);
        });

        Vue.filter('currency', (value) => {
            return currency(value);
        });

        Vue.filter('yyyy', (value) => {
            if (!value) {
                return '';
            }
            return formatDate(new Date(value), 'yyyy');
        });

        Vue.filter('yyyyMMdd', (value) => {
            if (!value) {
                return '';
            }
            return formatDate(new Date(value), 'yyyy-MM-dd');
        });

        Vue.filter('yyyyMMddHHmm', (value) => {
            if (!value) {
                return '';
            }
            return formatDate(new Date(value), 'yyyy-MM-dd HH:mm');
        });

        Vue.filter('yyyyMMddHHmmZh', (value) => {
            if (!value) {
                return '';
            }
            return formatDate(new Date(value), 'yyyy年MM月dd日 HH:mm');
        });

        Vue.filter('yyyyMMddHHmmss', (value) => {
            if (!value) {
                return '';
            }
            return formatDate(new Date(value), 'yyyy-MM-dd HH:mm:ss');
        });
        Vue.filter('friendlyTime', (value) => {
            if (!value) {
                return '';
            }
            //当前时间
            var date1 = new Date();
            var y1 = date1.getFullYear();
            var m1 = date1.getMonth() + 1;
            var day1 = date1.getDate();
            //传入时间
            var date2 = new Date(value);
            var y2 = date2.getFullYear();
            var m2 = date2.getMonth() + 1;
            var day2 = date2.getDate();

            if (day1 == day2 && m1 == m2 && y1 == y2) {
                return '今天'
            } else if (day1 - day2 === 1 && m1 == m2 && y1 == y2) {
                return '昨天'
            } else if (day1 != day2 && m1 == m2 && y1 == y2) {
                var day = day1 - day2;
                return day + '天前'
            } else if (day1 - day2 <= 0 && m1 - m2 == 1 && y1 == y2) {
                var day = day1 - day2 + 30;
                return day + '天前'
            } else if (day1 - day2 > 0 && m1 - m2 == 1 && y1 == y2) {
                var m = m1 - m2;
                return m + '个月前'
            } else if (m1 - m2 > 1 && y1 == y2) {
                var m = m1 - m2;
                return m + '个月前'
            } else if (m1 - m2 < 0 && y1 - y2 == 1) {
                var m = m1 - m2 + 12;
                return m + '个月前'
            } else {
                var y = y1 - y2;
                return y + '年前'
            }
        });

        Vue.filter('MMddHHmm', (value) => {
            if (!value) {
                return '';
            }
            return formatDate(new Date(value), 'MM-dd HH:mm');
        });
        Vue.filter('HHmmss', (value) => {
            if (!value) {
                return '';
            }
            return formatDate(new Date(value), 'HH:mm:ss');
        });
        Vue.filter('MMddHHmmss', (value) => {
            if (!value) {
                return '';
            }
            return formatDate(new Date(value), 'MM-dd HH:mm:ss');
        });

        Vue.filter('htmlToText', (value) => {
            if (!value) {
                return '';
            }

            value = value.replace(/<img[^>]*?>/g, '[图片]')
                .replace(/<[^>]*>|/g, "")
                .replace(/\\s*|\t|\r|\n/g, '')
                .replace(/&nbsp;/g, '');
            return value;
        });

        Vue.filter('htmlToMatch', (value, keys) => {
            if (!value) {
                return '';
            }

            value = value.replace(/<img[^>]*?>/g, '[图片]')
                .replace(/<[^>]*>|/g, "")
                .replace(/\\s*|\t|\r|\n/g, '')
                .replace(/&nbsp;/g, '');

            if (keys) {
                keys = keys.split(' ');

                for (let key of keys) {
                    value = value.replace(new RegExp(key, "gm"), `<span style="color:red;">${key}</span>`);
                }
            }

            return value;
        });

        Vue.filter('memberUserStatus', (value) => {
            return memberUserStatus[value];
        });

        Vue.filter('memberRegisterMode', (value) => {
            return memberRegisterMode[value];
        });

        Vue.filter('memberInfoUpdateType', (value) => {
            return memberInfoUpdateType[value];
        });

        Vue.filter('memberInfoUpdateStatus', (value) => {
            return memberInfoUpdateStatus[value];
        });

        Vue.filter('memberApplyBranchStatus', (value) => {
            return memberApplyBranchStatus[value];
        });

        Vue.filter('duesPaymentType', (value) => {
            return duesPaymentType[value];
        });

        Vue.filter('contentType', (value) => {
            return contentType[value];
        });

        Vue.filter('adminType', (value) => {
            return adminType[value];
        });

        Vue.filter('activitySignUpExamineStatus', (value) => {
            return activitySignUpExamineStatus[value];
        });

        Vue.filter('activitySignInStatus', (value) => {
            return activitySignInStatus[value];
        });

        Vue.filter('cascadeArray', (value, split) => {
            return cascadeArrayToString(value, split);
        });

        Vue.filter('logType', (value) => {
            return logType[value];
        });

        Vue.filter('activitySignUpType', (value) => {
            if (!value) {
                value = '0';
            }
            return activitySignUpType[value];
        });

        Vue.filter('activitySignInType', (value) => {
            if (!value) {
                value = '0';
            }
            return activitySignInType[value];
        });
        // 小数位保留两位有效数字的百分比
        Vue.filter('persent', (val) => {
            var num1 = ((val - 0) * 100).toFixed(2);
            return num1 + '%';
        });
        Vue.filter('numFormat', (val) => {
            var str = val + '';
            var len = str.length;
            var arr = [];
            var k = 0;
            for (let i = len - 1; i >= 0; i--) {
                k++;
                if (k == 4) {
                    k = 1;
                    arr.unshift(',');
                }
                arr.unshift(str[i]);
            }
            return arr.join('')
        })

        Vue.filter('addressFilter', (value) => {
            try {
                var valueObj = JSON.parse(value);
                var str = ""
                if (valueObj.province) { str = valueObj.province };
                if (valueObj.city) { str += "-" + valueObj.city };
                if (valueObj.area) { str += "-" + valueObj.area };
                if (valueObj.detail) { str += " " + valueObj.detail };
                return str
            } catch (e) {
                return value
            }
        });
    }
};