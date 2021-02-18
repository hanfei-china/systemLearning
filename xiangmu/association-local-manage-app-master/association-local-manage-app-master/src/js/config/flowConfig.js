export const flowConfig = {
    entityStatus: [
        {"name": "不更改", "value": 0},
        {"name": "评审", "value": 1},
        {"name": "补充材料", "value": 2},
        {"name": "终审", "value": 3}
    ],
    actionList: [
        {
            "actionId": "8a8294d46a1fc3a4016a1fc8cf250000",
            "name": "提交结果",
            "info": null
        }, {
            "actionId": "8a8294d46a1fc3a4016a1fc9041a0001",
            "name": "驳回",
            "info": null
        }, {
            "actionId": "8a8294d46a1fc3a4016a1fc9bbb90002",
            "name": "补充材料",
            "info": "点击该按钮后，推送给高校的补充材料待办中，高校<span style=\"font-weight: bold\">只能看到</span>专家在该表单中填写的<span style=\"font-weight: bold\">补充材料要求</span>和<span style=\"font-weight: bold\">专家附件</span>字段的内容，<span style=\"font-weight: bold\">其他字段内容均不可见。</span>"
        }],
    entities: [
        {
            designData: '{"nodes":[{"id":"ID_707B2E67","title":"普通节点","component":"ordinaryActivity","type":"activity","x":575,"y":119,"conventional":{"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"],"writeFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{"splitType":"XOR"},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"]],"writeFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]]},{"id":"ID_11A0EC04","title":"普通节点","component":"ordinaryActivity","type":"activity","x":270,"y":114,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},{"id":"ID_E0E263A1","title":"普通节点","component":"ordinaryActivity","type":"activity","x":534,"y":234,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},{"id":"dn-5f14895a-db4a-4451-b12e-7a86b40fa1a4","title":"E","component":"endComponent","type":"end","x":511,"y":366},{"id":"ID_6EC04F12","title":"S","component":"startComponent","type":"start","x":97,"y":116,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null}],"edges":[{"edgeId":"ID_9795DE20","postCondition":{"transitionEventType":"transitionClass","assigneeRelation":"1"},"source":{"id":"ID_707B2E67","title":"普通节点","component":"ordinaryActivity","type":"activity","x":575,"y":119,"conventional":{"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"],"writeFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{"splitType":"XOR"},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"]],"writeFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]]},"target":{"id":"ID_E0E263A1","title":"普通节点","component":"ordinaryActivity","type":"activity","x":534,"y":234,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"drawLine":"NOROUTING"},{"edgeId":"ID_4C697528","postCondition":{"transitionEventType":"transitionClass","assigneeRelation":"1","actionId":"8a8294d46a1fc3a4016a1fc8cf250000"},"source":{"id":"ID_11A0EC04","title":"普通节点","component":"ordinaryActivity","type":"activity","x":270,"y":114,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"target":{"id":"ID_707B2E67","title":"普通节点","component":"ordinaryActivity","type":"activity","x":575,"y":119,"conventional":{"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"],"writeFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{"splitType":"XOR"},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"]],"writeFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]]},"drawLine":"NOROUTING"},{"edgeId":"ID_277A61E1","postCondition":{"transitionEventType":"transitionClass","assigneeRelation":"1","actionId":"8a8294d46a1fc3a4016a1fc8cf250000"},"source":{"id":"ID_E0E263A1","title":"普通节点","component":"ordinaryActivity","type":"activity","x":534,"y":234,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"target":{"id":"dn-5f14895a-db4a-4451-b12e-7a86b40fa1a4","title":"E","component":"endComponent","type":"end","x":511,"y":366},"drawLine":"NOROUTING"},{"edgeId":"ID_F375FB46","postCondition":{"transitionEventType":"transitionClass","assigneeRelation":"1","actionId":"8a8294d46a1fc3a4016a1fc8cf250000"},"source":{"id":"ID_6EC04F12","title":"S","component":"startComponent","type":"start","x":97,"y":116,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null},"target":{"id":"ID_11A0EC04","title":"普通节点","component":"ordinaryActivity","type":"activity","x":270,"y":114,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"drawLine":"NOROUTING"}]}',
            name: "审批项目1",
            defId: '88000d88d8d8d8d88d1',
            icon: 'icon-message',
            backgroundColor: '#F25643',
        },
        {
            designData:'{"nodes":[{"id":"ID_CDF42702","title":"普通节点","component":"ordinaryActivity","type":"activity","x":339,"y":122,"conventional":{"assignType":"2","ID":"ID_CDF42702","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc9041a0001","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[],"writeFieldIdLists":[]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_CDF42702","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc9041a0001","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[[]],"writeFieldIdLists":[[]]},{"id":"ID_0A7E1AFC","title":"普通节点","component":"ordinaryActivity","type":"activity","x":137,"y":253,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},{"id":"ID_3C00BE9A","title":"普通节点","component":"ordinaryActivity","type":"activity","x":450,"y":311,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"}],"edges":[{"edgeId":"ID_990D1329","postCondition":{"transitionRuleType":"Script_Rule","edgeId":"ID_990D1329","sourceTitle":"普通节点","targetTitle":"普通节点","assigneeRelation":"2","undefined":"","actionId":"8a8294d46a1fc3a4016a1fc9041a0001","extendedAttrs":[],"conditype":"","transitionEventType":"","transitionEvent":""},"source":{"id":"ID_CDF42702","title":"普通节点","component":"ordinaryActivity","type":"activity","x":339,"y":122,"conventional":{"assignType":"2","ID":"ID_CDF42702","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc9041a0001","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[],"writeFieldIdLists":[]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_CDF42702","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc9041a0001","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[[]],"writeFieldIdLists":[[]]},"target":{"id":"ID_0A7E1AFC","title":"普通节点","component":"ordinaryActivity","type":"activity","x":137,"y":253,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"drawLine":"NOROUTING"},{"edgeId":"ID_63ACA9BC","postCondition":{"transitionRuleType":"Script_Rule","edgeId":"ID_63ACA9BC","sourceTitle":"普通节点","targetTitle":"普通节点","assigneeRelation":"2","undefined":"","actionId":"8a8294d46a1fc3a4016a1fc9bbb90002","extendedAttrs":[],"conditype":"","transitionEventType":"","transitionEvent":""},"source":{"id":"ID_CDF42702","title":"普通节点","component":"ordinaryActivity","type":"activity","x":339,"y":122,"conventional":{"assignType":"2","ID":"ID_CDF42702","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc9041a0001","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[],"writeFieldIdLists":[]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_CDF42702","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc9041a0001","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[[]],"writeFieldIdLists":[[]]},"target":{"id":"ID_3C00BE9A","title":"普通节点","component":"ordinaryActivity","type":"activity","x":450,"y":311,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"drawLine":"NOROUTING"}]}',
            name: "审批项目2",
            defId: '88000d88d8d8d8d88d2',
            icon: 'icon-password',
            backgroundColor: '#409EFF',
        },
        {
            designData: '{"nodes":[{"id":"ID_707B2E67","title":"普通节点","component":"ordinaryActivity","type":"activity","x":253,"y":182,"conventional":{"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"],"writeFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{"splitType":"XOR"},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"]],"writeFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]]},{"id":"ID_11A0EC04","title":"普通节点","component":"ordinaryActivity","type":"activity","x":281,"y":328,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},{"id":"ID_E0E263A1","title":"普通节点","component":"ordinaryActivity","type":"activity","x":534,"y":234,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},{"id":"dn-5f14895a-db4a-4451-b12e-7a86b40fa1a4","title":"E","component":"endComponent","type":"end","x":511,"y":366}],"edges":[{"edgeId":"ID_9795DE20","postCondition":{"transitionEventType":"transitionClass","assigneeRelation":"1"},"source":{"id":"ID_707B2E67","title":"普通节点","component":"ordinaryActivity","type":"activity","x":253,"y":182,"conventional":{"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"],"writeFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{"splitType":"XOR"},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"]],"writeFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]]},"target":{"id":"ID_E0E263A1","title":"普通节点","component":"ordinaryActivity","type":"activity","x":534,"y":234,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"drawLine":"NOROUTING"},{"edgeId":"ID_4C697528","postCondition":{"transitionEventType":"transitionClass","assigneeRelation":"1","actionId":"8a8294d46a1fc3a4016a1fc8cf250000"},"source":{"id":"ID_11A0EC04","title":"普通节点","component":"ordinaryActivity","type":"activity","x":281,"y":328,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"target":{"id":"ID_707B2E67","title":"普通节点","component":"ordinaryActivity","type":"activity","x":253,"y":182,"conventional":{"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"],"writeFieldIdLists":["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]},"frontCondition":{"convergeType":"","syncType":"","voteText":"","isCreateNew":""},"postCondition":{"splitType":"XOR"},"extendAttr":[],"highLevel":{"finishRule":"","activityCreateEvent":"","activityEndEvent":""},"timeoutLimit":{"limitTime":"","limitAgentClassName":"","warnTime":"","warnAgentClassName":"","deadline":[]},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","ID":"ID_707B2E67","name":"普通节点","ruleType":"2","entityChangeStatus":"0","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000","8a8294d46a1fc3a4016a1fc9bbb90002"],"readFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000o","8a8294d46a1fab12016a1fb0b71d000s"]],"writeFieldIdLists":[["8a8294d46a1fab12016a1fb0b71d000i","8a8294d46a1fab12016a1fb0b71d000t"]]},"drawLine":"NOROUTING"},{"edgeId":"ID_277A61E1","postCondition":{"transitionEventType":"transitionClass","assigneeRelation":"1","actionId":"8a8294d46a1fc3a4016a1fc8cf250000"},"source":{"id":"ID_E0E263A1","title":"普通节点","component":"ordinaryActivity","type":"activity","x":534,"y":234,"conventional":{"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"frontCondition":{},"postCondition":{},"extendAttr":[],"highLevel":{},"timeoutLimit":{},"monitorinf":{"isResponsibleTem":true},"eventTypeId":null,"assignType":"2","actionIdList":["8a8294d46a1fc3a4016a1fc8cf250000"],"entityChangeStatus":"0","ruleType":"2"},"target":{"id":"dn-5f14895a-db4a-4451-b12e-7a86b40fa1a4","title":"E","component":"endComponent","type":"end","x":511,"y":366},"drawLine":"NOROUTING"}]}',
            name: "审批项目3",
            defId: '88000d88d8d8d8d88d3',
            icon: 'icon-dingwei',
            backgroundColor: '#E6A23C',
        }
    ]
}
