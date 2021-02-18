<template>
    <el-container class="absolute-fill-parent background-color-white" v-loading="loading" element-loading-text="数据统计中......"
                  element-loading-spinner="el-icon-loading">
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent" style="padding: 16px 0 16px 16px;overflow: hidden;" ref="chart"></div>
        </el-main>
        <el-aside class="position-relative" width="316px">
            <div class="absolute-fill-parent background-color-white" style="padding: 16px 16px 16px 0;overflow: hidden;" ref="barChart"></div>
        </el-aside>
    </el-container>
</template>

<script>
    import echarts from 'echarts';
    import 'echarts/map/js/china.js'
    import {addListener, removeListener} from 'resize-detector';
    import debounce from 'lodash/debounce';
    import {getMapData,geo} from "../../../../js/config/echartConfigs";

    export default {
        name: "MapChart",
        props:{
            field: Object
        },
        data(){
            return {
                chart: null,
                barChart: null,
                loading: false,
                data: []
            }
        },
        computed:{
            unit(){
                if(this.field.table === 'member'){
                    return '人';
                }else if(this.field.table === 'donation'){
                    return '次';
                }else{
                    return '个';
                }
            },
            type(){
                return 'geo';
            },
            barChartOption(){
                let option = {};

                if( this.field && this.data.length > 0){
                    let {title} = this.field;
                    let yData = [];
                    let shadowData = [];

                    let length = this.data.length;
                    let max = this.data[0].value;
                    if(max <= 0){
                        max = 2;
                    }

                    for(let j =0; j< length; j++){
                        let item = this.data[j];
                        if(j<10){
                            yData.push('0'+j + item.name);
                        }else{
                            yData.push(j + item.name);
                        }

                        shadowData.push(max);
                    }


                    option = {
                        backgroundColor: 'transparent',
                        title: [{
                            show: true,
                            text: title,
                            subtext: `单位（${this.unit}）`,
                            subtextStyle:{
                                color:'#333333',
                                lineHeight:20
                            },
                            textStyle: {
                                color: '#333333',
                                fontSize: 18
                            },
                            left: 'left',
                            top: 20
                        }],
                        grid: {
                            right: 10,
                            top: 80,
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

                                    html = `${param.seriesName}<br/> ${param.name} :${value}（${this.unit}）`;
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
                                name: title,
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
                                data: this.data
                            }
                        ]

                    }

                }

                return option;

            },
            option(){
                let option = {};

                if( this.field && this.data.length > 0){
                    let {title} = this.field;

                    let data = getMapData(this.data);

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

                    let max = this.data[0].value;
                    if(max <= 0){
                        max = 2;
                    }

                    option = {
                        backgroundColor: 'transparent',
                        title: [{
                            show: false,
                            text: title,
                            subtext: `单位（${this.unit}'）}`,
                            subtextStyle:{
                                color:'#333333',
                                lineHeight:20
                            },
                            textStyle: {
                                color: '#333333',
                                fontSize: 18
                            },
                            left: 'center',
                            top: 20
                        }],
                        tooltip : {
                            trigger: 'item',
                            formatter: (param) => {
                                let html = '暂无数据';
                                if (param.data) {
                                    let value = param.data.value;
                                    if(Array.isArray(value)){
                                        value = param.data.value[2];
                                    }

                                    html = `${param.seriesName}<br/> ${param.name} :${value}（${this.unit}）`;
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
                                name: title,
                                map: 'china',
                                geoIndex: 0,
                                aspectScale: .5, //长宽比
                                showLegendSymbol: false, // 存在legend时显示
                                roam: true,
                                animation: false,
                                data: this.data
                            },
                            {
                                name: title,
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                data: zeroData,
                                symbolSize: function (val) {
                                    let value = val[2];
                                    value += 80;
                                    value = value / 20;
                                    if(value>15){
                                        value = 15;
                                    }
                                    return value;
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
                                name: `${title} 已点亮`,
                                type: 'effectScatter',
                                coordinateSystem: 'geo',
                                data: valueData,
                                symbolSize: function (val) {
                                    let value = val[2];
                                    value += 120;
                                    value = value / 20;
                                    if(value>15){
                                        value = 15;
                                    }
                                    return 15;
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

                return option;
            }
        },
        methods: {
            resize(){
                this.chart.resize();
                this.barChart.resize();
            },
            reload(val){
                if(this.chart){
                    this.chart.clear();
                    this.chart.setOption(val);
                    this.$nextTick(()=>{ this.loading = false; })
                }
            },
            reloadBar(val){
                if(this.barChart){
                    this.barChart.clear();
                    this.barChart.setOption(val);
                    this.$nextTick(()=>{ this.loading = false; })
                }
            },
            renderChart(){
                let that = this;
                this.chart = echarts.init(this.$refs.chart);
                this.chart.setOption(this.option);
                this.chart.on('click', function (params) {
                    that.click(params);
                });

                this.barChart = echarts.init(this.$refs.barChart);
                this.barChart.setOption(this.barChartOption);
                this.barChart.on('click', function (params) {
                    that.click(params);
                });
            },
            getData(){
                if(this.field && this.field.code){
                    this.loading  = true;
                    this.$request.post('/api/admin/digitalMap/query',this.field).then(resp=>{
                        this.data = resp.data.sort((a,b)=>{
                            return b.value-a.value;
                        });
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }else{
                    this.loading  = false;
                }
            },
            click(param){
                let data = param.data;

                let value = data.value;
                if(Array.isArray(value)){
                    value = value[2];
                }

                if(value){
                    data.field = this.field;
                    this.$emit('drilling-down',data);
                }else{
                    this.$message.info(`所选节点数据值为0，无法下钻`);
                }
            }
        },
        created(){
            this.getData();
            this.resize = debounce(this.resize,300);
            this.reload = debounce(this.reload,1000);
            this.reloadBar = debounce(this.reloadBar,1000);
        },
        mounted() {
            this.renderChart();
            addListener(this.$refs.chart,this.resize);
            addListener(this.$refs.barChart,this.resize);
        },
        beforeDestroy() {
            removeListener(this.$refs.chart,this.resize);
            removeListener(this.$refs.barChart,this.resize);
            this.chart.dispose();
            this.chart = null;

            this.barChart.dispose();
            this.barChart = null;
        },
        watch:{
            option(val){
                this.loading = true;
                this.reload(val);
            },
            barChartOption(val){
                this.loading = true;
                this.reloadBar(val);
            },
            field:{
                deep: true,
                handler(){
                    this.getData();
                }
            }
        }
    }
</script>

<style scoped>
.absolute-fill-parent .position-relative{
    min-height: 800px;
}
</style>
