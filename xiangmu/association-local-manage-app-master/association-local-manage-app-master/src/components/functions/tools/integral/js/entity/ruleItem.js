import DailyCheckRule from './dailyCheckRule';
import ReadArticleRule from './readArticleRule';
import WatchVideoRule from './watchVideoRule';
import PublishTradeRule from './publishTradeRule';
import PublishInformationExchangeRule from './publishInformationExchangeRule';
import ExchangeBusinessCardsRule from './exchangeBusinessCardsRule';
import CollectingBusinessCardsRule from './collectingBusinessCardsRule';
import OnlineCounselingsRule from './onlineCounselingsRule';
import PublishCommentRule from './publishCommentRule';
import ListenToMusicRule from './listenToMusicRule';
import ShareRule from './shareRule';
import CollectingContentRule from './collectingContentRule';
import LightRule from './lightRule';
import IdentityRule from './IdentityRule'
import InviteAlumniRule from './InviteAlumniRule'
import ActivityRule from './activityRule'
import perfectInformationRule from './perfectInformationRule'

/**
 * 规则类型
 */
export const RulesItemType = {
    DAILY_CHECK: { value: 1, name: '每日签到' },
    READ_ARTICLE: { value: 3, name: '读文章' },
    WATCH_VIDEO: { value: 4, name: '看视频' },
    PUBLISH_TRADE: { value: 5, name: '发布动态' },
    PUBLISH_INFORMATION_EXCHANGE: { value: 6, name: '发布信息交换' },
    EXCHANGE_BUSINESS_CARDS: { value: 7, name: '交换名片' },
    COLLECTING_BUSINESS_CARDS: { value: 8, name: '收藏名片' },
    ONLINE_COUNSELINGS: { value: 10, name: '心理咨询' },
    /** 发表评论*/
    PUBLISH_COMMENT: { value: 11, name: '发表评论' },
    /** 听音频 */
    LISTEN_TO_MUSIC: { value: 12, name: '听音频' },
    /** 分享 */
    SHARE: { value: 13, name: '分享' },
    /** 身份认证 */
    VERIFY_IDENTITY: { value: 14, name: '身份认证' },
    /** 收藏内容 */
    COLLECTING_CONTENT: { value: 15, name: '收藏内容' },
    /** 点亮图书 */
    LIGHT: { value: 16, name: '点亮图书' },
    /** 邀请校友 */
    INVITE_ALUMNI: { value: 17, name: '邀请校友' },
    /** 活动 */
    ACTIVITY: { value: 18, name: '活动' },
    /** 完善信息 */
    PERFECT_INFORMATION: { value: 19, name: '完善信息' }

};
const ruleClassArray = {
    DAILY_CHECK: DailyCheckRule,
    READ_ARTICLE: ReadArticleRule,
    WATCH_VIDEO: WatchVideoRule,
    PUBLISH_TRADE: PublishTradeRule,
    PUBLISH_INFORMATION_EXCHANGE: PublishInformationExchangeRule,
    EXCHANGE_BUSINESS_CARDS: ExchangeBusinessCardsRule,
    COLLECTING_BUSINESS_CARDS: CollectingBusinessCardsRule,
    ONLINE_COUNSELINGS: OnlineCounselingsRule,
    /** 发表评论*/
    PUBLISH_COMMENT: PublishCommentRule,
    /** 听音频 */
    LISTEN_TO_MUSIC: ListenToMusicRule,
    /** 分享 */
    SHARE: ShareRule,
    /** 身份认证 */
    VERIFY_IDENTITY: IdentityRule,
    /** 收藏内容 */
    COLLECTING_CONTENT: CollectingContentRule,
    /** 点亮图书 */
    LIGHT: LightRule,
    /** 邀请校友 */
    INVITE_ALUMNI: InviteAlumniRule,
    /** 活动 **/
    ACTIVITY: ActivityRule,
    /** 完善信息 */
    PERFECT_INFORMATION: perfectInformationRule
}

/**
 * 所有已支持的规则
 * @type {*[]}
 */
export const AllRules = [
    { value: 1, name: '签到' },
    { value: 3, name: '读文章' },
    { value: 4, name: '看视频' },
    { value: 5, name: '发布动态' },
    { value: 6, name: '发布信息交换' },
    { value: 8, name: '收藏名片' },
    { value: 10, name: '心理咨询' },
    { value: 11, name: '发表评论' },
    { value: 12, name: '听音频' },
    { value: 13, name: '分享' },
    { value: 14, name: '身份认证' },
    { value: 15, name: '收藏内容' },
    { value: 16, name: '点亮图书' },
    { value: 17, name: '邀请校友' },
    { value: 18, name: '活动' },
    { value: 19, name: '完善信息' }
];

export function isNullValue(value) {
    return value === null || value === undefined;
}



/**
 * 获取封装后的规则项
 * @param rulesItemType
 * @param config
 * @returns
 */
export function getRuleItem(rulesItemType, config) {
    for (const key in RulesItemType) {
        if (RulesItemType.hasOwnProperty(key)) {
            const ruleObj = RulesItemType[key];
            if (ruleObj.value === rulesItemType) {
                return new ruleClassArray[key](config);
            }
        }
    }
    console.log('不支持的规则类型: ' + rulesItemType)

    // switch (rulesItemType) {
    //     case RulesItemType.DAILY_CHECK.value:
    //         return new DailyCheckRule(config);
    //     case RulesItemType.READ_ARTICLE.value:
    //         return new ReadArticleRule(config);
    //     case RulesItemType.WATCH_VIDEO.value:
    //         return new WatchVideoRule(config);
    //     case RulesItemType.PUBLISH_TRADE.value:
    //         return new PublishTradeRule(config);
    //     case RulesItemType.PUBLISH_INFORMATION_EXCHANGE.value:
    //         return new PublishInformationExchangeRule(config);
    //     case RulesItemType.EXCHANGE_BUSINESS_CARDS.value:
    //         return new ExchangeBusinessCardsRule(config);
    //     case RulesItemType.COLLECTING_BUSINESS_CARDS.value:
    //         return new CollectingBusinessCardsRule(config);
    //     case RulesItemType.ONLINE_COUNSELINGS.value:
    //         return new OnlineCounselingsRule(config);
    //     default:
    //         throw new Error('不支持的规则类型：' + rulesItemType);
    // }

}