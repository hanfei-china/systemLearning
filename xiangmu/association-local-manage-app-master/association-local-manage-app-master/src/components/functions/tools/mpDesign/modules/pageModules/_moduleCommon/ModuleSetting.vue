<template>
    <div style="padding: 16px;">
        <attribute v-for="(item,key) of attributes" :key="key" v-model="item.value"
                   :attributes="item.attributes" :type="item.type" :show="item.show" :educationList="educationList"  :collegeList="collegeList" :majorList="majorList"></attribute>
    </div>
</template>

<script>
    import Attribute from '../../../attributes/Attribute';
    export default {
        name: "ModuleSetting",
        components: {Attribute},
        props: {
            attributes: Object,
            educationList:Array,
            collegeList:Array,
            majorList:Array
        }
    }
</script>