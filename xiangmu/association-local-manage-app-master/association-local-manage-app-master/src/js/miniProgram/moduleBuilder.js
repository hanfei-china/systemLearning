import AlumniClubs from './pageModules/AlumniClubs';
import AlumniClubsActivities from './pageModules/AlumniClubsActivities';
import AlumniClubsTrends from './pageModules/AlumniClubsTrends';

import Entry from './pageModules/Entry';
import EntryGroup from './pageModules/EntryGroup';

import HomeBanner from './pageModules/HomeBanner';

import HomeBtnContainer from './pageModules/HomeBtnContainer';
import HomeBtn from './pageModules/HomeBtn';

import HomeBtnArea from './pageModules/HomeBtnArea';
import HomeAreaBtn from './pageModules/homeAreaBtn';

import HomeImageRankList from './pageModules/HomeImageRankList';
import HomeImageScrollList from './pageModules/HomeImageScrollList';
import HomeImageTextList from './pageModules/HomeImageTextList';

import HomeRowImageBtn from './pageModules/HomeRowImageBtn';

import HomeSimpleTextBanner from './pageModules/HomeSimpleTextBanner';

import Logout from './pageModules/Logout';
import My from './pageModules/My';


import OnlineDonationList from './pageModules/OnlineDonationList';

import SideStopButton from './pageModules/SideStopButton';

import TopLogoArea from './pageModules/TopLogoArea';

import PublicArticleList from './pageModules/PublicArticleList';

import Page from './page/Page';
import TabBar from './tabBar/TabBar';
import Tab from './tabBar/Tab';

import Album from './pageModules/Album';
import CountDown from './pageModules/CountDown';

export default function moduleBuilder(moduleName, moduleConfig) {

    switch (moduleName) {
        case 'alumniClubs':
            return new AlumniClubs(moduleConfig);
        case 'alumniClubsActivities':
            return new AlumniClubsActivities(moduleConfig);
        case 'alumniClubsTrends':
            return new AlumniClubsTrends(moduleConfig);
        case 'entry':
            return new Entry(moduleConfig);
        case 'entryGroup':
            return new EntryGroup(moduleConfig);
        case 'homeBanner':
            return new HomeBanner(moduleConfig);
        case 'homeBtnContainer':
            return new HomeBtnContainer(moduleConfig);
        case 'homeBtnArea':
            return new HomeBtnArea(moduleConfig);
        case 'homeBtn':
            return new HomeBtn(moduleConfig);
        case 'homeAreaBtn':
            return new HomeAreaBtn(moduleConfig);
        case 'homeImageRankList':
            return new HomeImageRankList(moduleConfig);
        case 'homeImageScrollList':
            return new HomeImageScrollList(moduleConfig);
        case 'homeImageTextList':
            return new HomeImageTextList(moduleConfig);
        case 'homeRowImageBtn':
            return new HomeRowImageBtn(moduleConfig);
        case 'homeSimpleTextBanner':
            return new HomeSimpleTextBanner(moduleConfig);
        case 'logout':
            return new Logout(moduleConfig);
        case 'my':
            return new My(moduleConfig);
        case 'onlineDonationList':
            return new OnlineDonationList(moduleConfig);
        case 'sideStopButton':
            return new SideStopButton(moduleConfig);
        case 'topLogoArea':
            return new TopLogoArea(moduleConfig);
        case 'page':
            return new Page(moduleConfig);
        case 'tabBar':
            return new TabBar(moduleConfig);
        case 'tab':
            return new Tab(moduleConfig);
        case 'publicArticleList':
            return new PublicArticleList(moduleConfig);
        case 'album':
            return new Album(moduleConfig);
        case 'countDown':
            return new CountDown(moduleConfig);
        default:
            throw new Error('未注册的模块：'+moduleName);

    }

}
