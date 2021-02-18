export default {
    path: '/console/dataCenter',
    name: 'dataCenter',
    component: { render: h => h('router-view') },
    children: [{
        path: '/console/dataCenter/dataStatistics',
        name: 'dataStatistics',
        component: () =>
            import ('../../components/functions/organization/dataCenter/dataStatistics/dataStatistics.vue')
    }]
}