<template>
    <div class="absolute-fill-parent background-color-white flex">
        <div style="padding: 0 0 0 16px;" class="flex-fill-in-the-remaining-space" :class="{'geo-chart': type === 'geo'}" ref="chart"/>
        <div style="padding: 0 16px 0 0;" class="flex-fill-in-the-remaining-space right-chart" :class="{'geo-chart': type === 'geo'}" ref="secondChart"/>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import 'echarts/map/js/china.js'
    import {addListener, removeListener} from 'resize-detector';
    import debounce from 'lodash/debounce';
    import {getMapData,geo} from "../../../../../js/config/echartConfigs";

    export default {
        name: "DrillingChart",
        props:{
            data: Object,
            fields: Array,
            hiddenZeroData: Boolean,
        },
        data(){
            return {
                chart: null,
                secondChart: null,
                loading: false,
                compulsiveType: null
            }
        },
        computed:{
            formatData(){
                if(this.data && this.data.data && this.data.data.length > 0){
                    let result = [];
                    let field = this.data.field;
                    let {options,topicType,code,labelItems} = field;
                    this.data.data.map(item => {
                        let data = {...item};

                        let {isOther,name,value} = data;

                        if(!this.hiddenZeroData || value){
                            if(!isOther){
                                if(topicType === 2 || topicType === 3){
                                    for(let option of options){
                                        if(option.key === name){
                                            data.name = option.title;
                                            data.code = option.key;
                                        }
                                    }
                                }

                                if(topicType === 6 || topicType === 8){
                                    if(code === 'label'){
                                        for(let label of labelItems){
                                            if(label.id === name){
                                                data.name = label.title;
                                                data.code = label.id;
                                            }
                                        }
                                    }else{
                                        data.code = data.name;
                                    }

                                }
                            }

                            result.push(data);
                        }
                    });

                    if(field.topicType === 6){
                        result = result.sort((a,b)=>{
                            return b.value-a.value;
                        });
                    }

                    return result;
                }else{
                    return [];
                }
            },
            type(){
                if(this.data.field && this.data.field.topicType === 6){
                    // return 'map';
                    return 'geo';
                }else{
                    return 'unGeo';
                }
            },
            barOption(){
                let option = {};

                let length = this.fields.length;

                if( length > 0 && this.formatData.length > 0){
                    let {name} = this.fields[length-1];

                    let xAxisData = [];
                    let seriesData = [];
                    let shadowData = [];

                    let max = 0;

                    this.formatData.map(item=>{
                        xAxisData.push(item.name);
                        seriesData.push(item);

                        if(max < item.value){
                            max = item.value;
                        }
                    });

                    let diff = 4; //修改此值
                    let quotient = Math.floor(max/diff);
                    let remainder = max%diff;
                    max = quotient*diff + (quotient > 0 ? (remainder > 0 ? diff: 0) : diff );

                    this.formatData.map(item=>{
                        shadowData.push({...item,originalValue: item.value,value:max,type:'shadow'});
                    });


                    option = {
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : ''        // 默认为直线，可选为：'line' | 'shadow'
                            },
                            padding: 6,
                            formatter:function (params){
                                return params[1].seriesName +"</br>"
                                    +"<i style='width:10px;height: 10px;display: inline-block;border-radius: 50%; background-color: rgba(24,141,240,1);margin-right: 4px;'></i>"
                                    + params[1].data.name+"&nbsp;&nbsp;" + params[1].data.value+"</br>";
                            }
                        },
                        grid: {
                            left: 16,
                            right: 16,
                            bottom: 20,
                            top: 30,
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type: 'category',
                                axisTick: {
                                    alignWithLabel: true
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: 'rgb(202,202,202)',
                                    }
                                },
                                axisLabel:{
                                    color: 'rgb(78,78,78)'
                                },
                                data : xAxisData
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                minInterval: 1,
                                splitNumber: 7, //修改此值可分割坐标
                                max,
                                axisLine: {
                                    show: false,
                                    lineStyle: {
                                        color: 'rgb(237,237,237)',
                                    }
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: 'rgb(237,237,237)',
                                        type: 'dashed'
                                    }
                                },
                                axisLabel:{
                                    color: 'rgb(78,78,78)'
                                },
                            }
                        ],
                        series : [
                            {
                                name,
                                type: 'bar',
                                barGap: '-100%',
                                barWidth: 20,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(24,141,240,.1)'
                                    }
                                },
                                z: -12,
                                data: shadowData
                            },
                            {
                                type:'bar',
                                name,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(24,141,240,.7)',
                                        borderWidth: 0,
                                    }
                                },
                                data:seriesData,
                                z: 2,
                                barWidth: 20,
                            }
                        ],
                        // dataZoom: [{
                        //     type: 'inside'
                        // }, {
                        //     type: 'slider',
                        //     backgroundColor: 'rgba(64,158,255,.1)',
                        //     fillerColor: 'rgba(64,158,255,.1)',
                        // }],
                    }

                }

                if(!option.color && this.type !== 'geo'){
                    option.color = [
                        '#c23531','#2f4554', '#61a0a8', '#d48265',
                        '#91c7ae','#749f83',  '#ca8622', '#bda29a',
                        '#6e7074', '#546570', '#c4ccd3'];

                }

                option.backgroundColor = 'rgb(255,255,255)';


                return option;
            },
            pieOption(){
                let option = {};

                let length = this.fields.length;

                if( length > 0 && this.formatData.length > 0){
                    let {name} = this.fields[length-1];
                    let legendData = [];

                    this.formatData.map(item=>{
                        legendData.push(item.name)
                    });

                    option = {
                        tooltip: {
                            trigger: 'item',
                            formatter:function (params){
                                return params.seriesName+"</br>"+
                                    params.marker+params.data.name+ "&nbsp;&nbsp;" +  params.data.value+"</br>"+
                                    "占比："+ params.percent+"%";
                            }
                        },
                        legend: {
                            type:"scroll",
                            orient: 'vertical',
                            left:'60%',
                            align:'left',
                            top:'middle',
                            textStyle: {
                                color:'#8C8C8C'
                            },
                            height:230,
                            data: legendData,
                        },
                        series : [
                            {
                                name: name,
                                type: 'pie',
                                radius: ['25%', '38%'],
                                center: ['25%', '50%'],
                                labelLine: {
                                    normal: {
                                        show: true,
                                        length: 15,
                                        length2: 70,
                                        lineStyle: {
                                            color: '#d3d3d3'
                                        },
                                        align: 'right'
                                    },
                                    color: "#000",
                                    emphasis: {
                                        show: true
                                    }
                                },
                                label: {
                                    position: 'inside',
                                    formatter:function (params){
                                        return  params.percent+"%";
                                    }
                                },
                                itemStyle: { // 此配置
                                    normal: {
                                        borderWidth: 2,
                                        borderColor: '#fff',
                                    },
                                },
                                data: this.formatData,
                            }
                        ]
                    }

                }

                if(!option.color && this.type !== 'geo'){
                    option.color = [
                        '#c23531','#2f4554', '#61a0a8', '#d48265',
                        '#91c7ae','#749f83',  '#ca8622', '#bda29a',
                        '#6e7074', '#546570', '#c4ccd3'];

                }

                option.backgroundColor = 'rgb(255,255,255)';


                return option;
            },
            barChartOption(){
                let option = {};

                let fieldLength = this.fields.length;

                if( fieldLength > 0 && this.formatData.length > 0){

                    let {name} = this.fields[fieldLength-1];

                    let yData = [];
                    let shadowData = [];

                    let length = this.formatData.length;
                    let max = this.formatData[0].value;
                    if(max <= 0){
                        max = 2;
                    }

                    for(let j =0; j< length; j++){
                        let item = this.formatData[j];
                        if(j<10){
                            yData.push('0'+j + item.name);
                        }else{
                            yData.push(j + item.name);
                        }

                        shadowData.push({...item,originalValue: item.value,value:max,type:'shadow'});
                    }

                    option = {
                        backgroundColor: 'transparent',
                        grid: {
                            right: 10,
                            top: 30,
                            bottom: 20,
                            width: 200
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: (param) => {
                                let html = '暂无数据';
                                if (param.data) {
                                    let value = param.value;
                                    if(Array.isArray(value)){
                                        value = param.value[2];
                                    }

                                    html = `${param.seriesName}<br/> ${param.name} :${value}`;
                                }
                                return html;
                            }
                        },
                        xAxis: {
                            show: false
                        },
                        yAxis: {
                            type: 'category',
                            inverse: true,
                            nameGap: 16,
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: '#ddd'
                                }
                            },
                            axisTick: {
                                show: false,
                                lineStyle: {
                                    color: '#ddd'
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                margin: 85,
                                textStyle: {
                                    color: '#333333',
                                    align: 'left',
                                    fontSize: 14
                                },
                                rich: {
                                    a: {
                                        color: '#fff',
                                        backgroundColor: '#f0515e',
                                        width: 20,
                                        height: 20,
                                        align: 'center',
                                        borderRadius: 2,
                                    },
                                    b: {
                                        color: '#fff',
                                        backgroundColor: '#24a5cd',
                                        width: 20,
                                        height: 20,
                                        align: 'center',
                                        borderRadius: 2,
                                    }
                                },
                                formatter: function(params) {
                                    if (parseInt(params.slice(0, 2)) < 5) {
                                        return [
                                            '{a|' + (parseInt(params.slice(0, 2)) + 1) + '}' + '  ' + params.slice(2)
                                        ].join('\n')
                                    } else {
                                        return [
                                            '{b|' + (parseInt(params.slice(0, 2)) + 1) + '}' + '  ' + params.slice(2)
                                        ].join('\n')
                                    }
                                }
                            },
                            data: yData
                        },
                        series:[
                            { // For shadow
                                type: 'bar',
                                roam: false,
                                visualMap: false,
                                barWidth: 18,
                                barGap: '-100%',
                                z: -10,
                                data: shadowData,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(0,0,0,0.05)',
                                        barBorderRadius: [0,15,15,0]
                                    }
                                },
                                label:{
                                    normal: {
                                        show: false,
                                        textBorderColor: '#333',
                                        textBorderWidth: 2
                                    }
                                },
                                tooltip: {
                                    show: false
                                }

                            },
                            {
                                name,
                                type: 'bar',
                                roam: false,
                                visualMap: false,
                                barWidth: 18,
                                z:2,
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            let colorList = [{
                                                colorStops: [{
                                                    offset: 0,
                                                    color: '#f0515e'
                                                }, {
                                                    offset: 1,
                                                    color: '#ef8554'
                                                }]
                                            },{
                                                colorStops: [{
                                                    offset: 0,
                                                    color: '#3c38e4'
                                                }, {
                                                    offset: 1,
                                                    color: '#24a5cd'
                                                }]
                                            }
                                            ];

                                            let {value,dataIndex} = params;

                                            if(value > 0){
                                                if (dataIndex < 5) {
                                                    return colorList[0]
                                                } else {
                                                    return colorList[1]
                                                }
                                            }else{
                                                return colorList[2]
                                            }
                                        },
                                        barBorderRadius: [0,15,15,0]
                                    }
                                },
                                label:{
                                    normal: {
                                        show: true,
                                        textBorderColor: '#333',
                                        textBorderWidth: 2,
                                        formatter(params){
                                            let {value} = params;
                                            if(value){
                                                return value;
                                            }else{
                                                return  '';
                                            }
                                        }
                                    }
                                },
                                data: this.formatData
                            }
                        ]

                    }

                }

                return option;

            },
            geoOption(){

                let option = {};

                let length = this.fields.length;

                if( length > 0 && this.formatData.length > 0){
                    let {name} = this.fields[length-1];
                    let data = getMapData(this.formatData);

                    let zeroData = [];
                    let valueData = [];

                    data.forEach(item=>{
                        let value = item.value[2];

                        if(value){
                            valueData.push(item);
                        }else{
                            zeroData.push(item);
                        }
                    });

                    let max = this.formatData[0].value;
                    if(max <= 0){
                        max = 2;
                    }

                    option = {
                        backgroundColor: 'transparent',
                        tooltip : {
                            trigger: 'item',
                            formatter: (param) => {
                                let html = '暂无数据';
                                if (param.data) {
                                    let value = param.data.value;
                                    let result;
                                    if(Array.isArray(value)){
                                        result = value[2];
                                    }else{
                                        result = value;
                                    }

                                    html = `${param.seriesName}<br/> ${param.name} :${result}`;
                                }
                                return html;
                            }
                        },
                        geo,
                        visualMap: {
                            show: true,
                            min: 0,
                            max: max,
                            left: '10%',
                            top: 'bottom',
                            calculable: true,
                            seriesIndex: [0],
                            inRange: {
                                color: ['#467bc0', '#04387b'] // 蓝绿
                            }
                        },
                        series:[
                            {
                                type: 'map',
                                name,
                                map: 'china',
                                geoIndex: 0,
                                aspectScale: .5, //长宽比
                                showLegendSymbol: false, // 存在legend时显示
                                roam: true,
                                animation: false,
                                data: data
                            },
                            {
                                name,
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                data: zeroData,
                                symbolSize: function (val) {
                                    let value = val[2];
                                    value += 80;
                                    return value / 20;
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: true
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#fff'
                                    }
                                }
                            },
                            {
                                name: `${name} 已点亮`,
                                type: 'effectScatter',
                                coordinateSystem: 'geo',
                                data: valueData,
                                symbolSize: function (val) {
                                    let value = val[2];
                                    value += 120;
                                    value=value / 20;
                                    if(value>15){
                                        value = 15;
                                    }
                                    return value;
                                },
                                showEffectOn: 'render',
                                rippleEffect: {
                                    brushType: 'stroke'
                                },
                                hoverAnimation: true,
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: true
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'yellow',
                                        shadowBlur: 10,
                                        shadowColor: '#333'
                                    }
                                },
                                zlevel: 1
                            }
                        ]

                    }
                }

                option.backgroundColor = 'rgb(255,255,255)';

                return option;
            },
            option(){
                if(this.type === 'geo'){
                    return this.geoOption;
                }
                return this.barOption;

            },
            secondOption(){
                if(this.type === 'geo'){
                    return this.barChartOption;
                }
                return this.pieOption;
            }
        },
        methods: {
            resize(){
                this.chart.resize();
                this.secondChart.resize();
            },
            reload(val){
                this.chart.clear();
                this.chart.setOption(val);
                this.$nextTick(()=>{ this.loading = false; })
            },
            reloadSecond(val){
                this.secondChart.clear();
                this.secondChart.setOption(val);
                this.$nextTick(()=>{ this.loading = false; })
            },
            renderChart(){
                let that = this;
                this.chart = echarts.init(this.$refs.chart);
                this.chart.on('click', function (params) {
                    that.click(params);
                });
                // 使用刚指定的配置项和数据显示图表。
                this.chart.setOption(this.option);

                this.secondChart = echarts.init(this.$refs.secondChart);
                this.secondChart.on('click', function (params) {
                    that.click(params);
                });
                // 使用刚指定的配置项和数据显示图表。
                this.secondChart.setOption(this.secondOption);
            },
            click(param){
                let data = param.data;

                let value = data.value;
                let type = data.type;
                if(type === 'shadow'){
                    value = data.originalValue;
                }
                if(Array.isArray(value)){
                    value = value[2];
                }

                if(value){
                    data.field = this.data.field;
                    this.$emit('drilling-down',data);
                }else{
                    this.$message.info(`所选节点数据值为0，无法下钻`);
                    this.$emit('item-change',data);
                }
            },
        },
        created(){
            this.resize = debounce(this.resize,300);
            this.$emit('type-change',this.type);
        },
        mounted() {
            this.renderChart();
            addListener(this.$refs.chart,this.resize);
            addListener(this.$refs.secondChart,this.resize);
        },
        beforeDestroy() {
            removeListener(this.$refs.chart,this.resize);
            removeListener(this.$refs.secondChart,this.resize);
            this.chart.dispose();
            this.chart = null;

            this.secondChart.dispose();
            this.secondChart = null;
        },
        watch:{
            option(val){
                this.loading = true;
                this.reload(val);
            },
            secondOption(val){
                this.loading = true;
                this.reloadSecond(val);
            },
            type(val){
                this.$emit('type-change',val);
            },
            formatData:{
                immediate: true,
                handler(val){
                    this.$emit('items-change',val);
                }
            }
        }
    }
</script>
<style lang="less">

    .geo-chart{
        padding-bottom: 16px !important;
    }

    .right-chart{

        max-width: 400px;
        /*min-height: 700px;*/


        &.geo-chart{
            max-width: 300px;
            width: 300px;
        }

    }
</style>
