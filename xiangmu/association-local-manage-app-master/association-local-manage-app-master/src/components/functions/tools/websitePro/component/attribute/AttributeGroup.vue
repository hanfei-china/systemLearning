<template>
    <div class="website-pro-attr-group">
        <component class="website-pro-attr" style="padding: 0 16px;" v-for="(attribute,key) of attributeGroup.attributes" :key="key"
                   :ref="key" :index="key" :is="attribute.type + 'Attr'" :attribute="attribute"/>
    </div>
</template>

<script>
    import TextAttr from "./TextAttr";
    import ColorAttr from "./ColorAttr";
    import FontAttr from "./FontAttr";
    import LayoutAttr from "./LayoutAttr";
    import RadiusAttr from "./RadiusAttr";
    import LinkAttr from "./LinkAttr";
    import BorderAttr from "./BorderAttr";
    import ImageAttr from "./ImageAttr";
    import BoxShadowAttr from "./BoxShadowAttr";
    import BackgroundAttr from "./BackgroundAttr";
    import BackgroundLayoutAttr from "./BackgroundLayoutAttr";
    import CheckboxAttr from "./CheckboxAttr";
    import ListStyleAttr from "./ListStyleAttr";
    import PageAttr from "./PageAttr";
    import ArticleListDataSrcAttr from "./ArticleListDataSrcAttr";
    import ArticleDataSrcAttr from "./ArticleDataSrcAttr";
    import FormDataSrcAttr from "./FormDataSrcAttr";
    import NumberAttr from "./NumberAttr";
    import UnifiedBorderAttr from "./UnifiedBorderAttr";
    import GroupAttr from "./GroupAttr";
    import PageHeader2Attr from "./PageHeader2Attr";
    import BreadcrumbDataSrcAttr from "./BreadcrumbDataSrcAttr";
    import PaddingAttr from "./PaddingAttr";
    import SelectAttr from "./SelectAttr";
    import OnlineFormAttr from "./OnlineFormAttr";
    import ContentAttr from "./ContentAttr";
    import ContentClassAttr from "./ContentClassAttr";
    import MpCommonGroupAttr from "./forActivity/MpCommonGroupAttr";
    import MpContentAttr from "./forActivity/MpContentAttr";
    import MpContentClassAttr from "./forActivity/MpContentClassAttr";
    import MpCounselClassAttr from "./forActivity/MpCounselClassAttr";
    import MpFuncTypeAttr from "./forActivity/MpFuncTypeAttr";
    import MpMemberQueryBuilderAttr from "./forActivity/MpMemberQueryBuilderAttr";
    import MpOnlineFormAttr from "./forActivity/MpOnlineFormAttr";
    import MpPageChooseAttr from "./forActivity/MpPageChooseAttr";
    import MpPrivilegeAttr from "./forActivity/MpPrivilegeAttr";
    import MenuAttr from "./MenuAttr";
    import MemberInfoStatisticsAttr from "./MemberInfoStatisticsAttr";
    import RichTextAttr from "./RichTextAttr";
    import CertificateFieldAttr from "./CertificateFieldAttr";
    export default {
        name: "AttributeGroup",
        components: {
            CertificateFieldAttr,
            RichTextAttr,
            MemberInfoStatisticsAttr,
            MenuAttr,
            MpPrivilegeAttr,
            MpPageChooseAttr,
            MpOnlineFormAttr,
            MpMemberQueryBuilderAttr,
            MpFuncTypeAttr,
            MpCounselClassAttr,
            MpContentClassAttr,
            MpContentAttr,
            MpCommonGroupAttr,
            ContentClassAttr,
            ContentAttr,
            OnlineFormAttr,
            SelectAttr,
            PaddingAttr,
            BreadcrumbDataSrcAttr,
            PageHeader2Attr,
            GroupAttr,
            UnifiedBorderAttr,
            NumberAttr,
            ArticleDataSrcAttr,
            FormDataSrcAttr,
            ArticleListDataSrcAttr,
            PageAttr,
            ListStyleAttr,
            CheckboxAttr,
            BackgroundAttr, BackgroundLayoutAttr,
            BoxShadowAttr, ImageAttr, BorderAttr, LinkAttr, RadiusAttr, LayoutAttr, FontAttr, ColorAttr, TextAttr},
        props:{
            attributeGroup: Object,
            panel: {
                type: String,
                default: 'tab'
            },
        },
        methods:{
            isChildren(e){
                for(let key in this.attributeGroup.attributes){
                    if(this.$refs.hasOwnProperty(key)){
                        let attributeGroup = this.$refs[key][0];
                        if(attributeGroup.isChildren(e)){
                            return true;
                        }
                    }
                }
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target);
            }
        }
    }
</script>
