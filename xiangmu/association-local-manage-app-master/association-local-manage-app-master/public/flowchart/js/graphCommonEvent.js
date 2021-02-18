/**
 * 工具栏-导入/导出功能
 */
function handleImportOrExport(e) {
  // var isImport = e.target.className.indexOf('in'),
  //   textarea = $('.json_data textarea');
  // $('.ui.modal.json_data').modal({
  //   onApprove: function () {
  //     if (isImport !== -1) { // 导入
  //
  //     }
  //   },
  //   onHidden: function () {
  //     textarea.val('');
  //   }
  // })
  // .modal('setting', 'transition', 'scale')
  // .modal('show');
  //
  // var element_header = $('div.json_data .header');
  // if (isImport !== -1) {
  //   element_header.text('导入数据');
  // } else {
  //   console.log("output");
  //   console.log();
  //   element_header.text('导出数据');
  //
  //
  //   textarea.val(JSON.stringify(data));
  // }
}

/**
 * 工具栏-清空
 */
function clearGraph() {
  layer.confirm('确认清空？', {
    icon: 0,
    btn: ['确定', '取消'],
    offset: '180px'
  }, function () {
    var pools = graphPool.pools;
    for (var i = 0; i < pools.length; i++) {
      var id = pools[i].containerId;
      switch (id) {
        case 'tab_main':
          pools[i].deleteGraph();
          break;
        default:
          $('.full-right [data-tab=' + id + ']').remove();
          pools.splice(i, 1);
          break;
      }
    }
    layer.msg('删除成功', {icon: 1, offset: '180px', time: 600});
  }, function () {

  });

}

/**
 * 工具栏-删除节点
 */
function handleDeleteNode() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedNode = graph_active.state.selectedNode,
    selectedEdge = graph_active.state.selectedEdge;
  if (!selectedNode && !selectedEdge) {
    layer.msg('请选中元素！', {time: 2000, icon: 0, offset: '180px'});
    return;
  } else {
    layer.confirm('确定要删除选择元素吗？', {
      icon: 0,
      btn: ['确定', '取消'],
      offset: '180px'
    }, function () {
      if (selectedNode) {
        var nodes = graph_active.nodes;
        nodes.splice(nodes.indexOf(selectedNode), 1);
        graph_active.spliceLinksForNode(selectedNode);
        if (selectedNode.component === 'blockActivity') {
          var containerId = 'tab_' + selectedNode.id;
          $('.full-right [data-tab=' + containerId + ']').remove();
          graphPool.removeGraphFromPools(containerId);
        }
        selectedNode = null;
        graph_active.updateGraph();
      } else if (selectedEdge) {
        var edges = graph_active.edges;
        edges.splice(edges.indexOf(selectedEdge), 1);
        selectedEdge = null;
        graph_active.updateGraph();
      }
      layer.msg('删除成功', {icon: 1, offset: '180px', time: 600});
    }, function () {

    });
  }
}

/**
 * 工具栏-放大/缩小按钮 scale(0.3-2)
 */
function handleClickZoom() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var translate = graph_active.dragSvg.translate(),
    scale = graph_active.dragSvg.scale(),
    extent = graph_active.dragSvg.scaleExtent(),
    direction = 1,
    factor = 0.1;
  direction = (this.id === 'zoom-enlarge') ? 1 : -1;
  if ((scale <= extent[0] && direction < 0) || (scale >= extent[1] && direction > 0)) {
    return;
  } else {
    scale = parseFloat(scale) + factor * direction;
  }
  graph_active.dragSvg.scale(scale)
  .translate(translate);
  graph_active.zoomed();
}

/**
 * 工具栏-还原缩放及归位
 */
function resetZoom() {
  var graph_active = graphPool.getGraphByActiveEdit();
  graph_active.svgG.transition() // start a transition
  .duration(1000) // make it last 1 second
  .attr('transform', 'translate(0,0) scale(1)');
  graph_active.dragSvg.scale(1);
  graph_active.dragSvg.translate([0, 0]);
}

/**
 * 工具栏-帮助
 */
function handleHelp() {
  if ($('.layer_notice').length) {
    return;
  }
  layer.open({
    type: 1,
    shade: false,
    title: false, // 不显示标题
    offset: ['91px', '394px'],
    content: '<ul class="layer_notice">' +
    '  <li><a href="javascript:;">1. 将左侧活动拖至编辑区</a></li>' +
    '  <li><a href="javascript:;">2. 选中"直线"或"折线"，编辑区活动之间连线</a></li>' +
    '  <li><a href="javascript:;">3. 右击活动和线都有自己的属性 </a></li>' +
    '</ul>',
    cancel: function () {
      // console.log('helper closed!');
    }
  });
}

/**
 * 左侧组件
 */
function handleComponentsBtn() {
  $(this).siblings().removeClass('active').end().addClass('active');
  var graph_active = graphPool.getGraphByActiveEdit(),
    state = graph_active.state,
    nodeName = $(this).attr('name'),
    container = $('.svg-container');
  if (nodeName === 'NOROUTING' || nodeName === 'SIMPLEROUTING') {
    state.drawLine = nodeName;
    container.on('mouseover mouseout', '.conceptG', function (e) {
      if (e.type === 'mouseover') {
        this.style.cursor = 'crosshair';
      } else if (e.type == 'mouseout') {
        this.style.cursor = 'default';
      }
    });
  } else {
    container.off('mouseover mouseout', '.conceptG');
    state.drawLine = null;
  }
}

/**
 * 自动插入开始结束节点
 */
function handleAddStartEnd() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var edges = graph_active.edges;
  var nodes = graph_active.filterActivities();
  nodes.forEach(function (node) {
    if (!graph_active.hasLinked(node, false, -1)) {
      var start = {
        id: generateUUID(),
        title: 'S',
        component: 'startComponent',
        type: 'start',
        x: node.x - 120,
        y: node.y
      };
      graph_active.nodes.push(start);
      var edge_start = {
        edgeId: generateUUID(),
        drawLine: 'NOROUTING',
        source: start,
        target: node
      };
      graph_active.edges.push(edge_start);
      graph_active.updateGraph();
    }
    if (!graph_active.hasLinked(node, false, 1)) {
      var end = {
        id: generateUUID(),
        title: 'E',
        component: 'endComponent',
        type: 'end',
        x: node.x + 120,
        y: node.y
      };
      graph_active.nodes.push(end);
      var edge_end = {
        edgeId: generateUUID(),
        drawLine: 'NOROUTING',
        source: node,
        target: end
      };
      graph_active.edges.push(edge_end);
      graph_active.updateGraph();
    }
  });
}

/**
 * 视图显示Tab（图标视图、Xpdl视图、Xml视图）
 */
function handleViews() {
  var dataTab = $(this).attr('data-tab');
  var element = $('.full-right>.tab.active .content-div');
  var activitysetid = $('.full-right>.menu>.item.active').attr('activitysetid');
  switch (dataTab) {
    case 'second':
      var xpdlContent = graph_main.emergeAllxpdlContent();
      $('#xpdlContainer xmp').empty().text(xpdlContent);
      element.mCustomScrollbar("update");
      break;
    case 'third':
      var XmlContent = graph_main.emergeAllXmlContent();
      $('#xmlContainer xmp').empty().text(XmlContent);
      break;
  }
  var isSubGraphXpdlView = /Package_(.+)_second/.test(dataTab);
  if (isSubGraphXpdlView) {
    var blockActivity = graph_main.findActByActSetId(activitysetid);
    var subGraph = blockActivity.activitySet.graphCreator;
    var activitySet = graph_main.emergeActivitySet.call(subGraph, activitysetid);
    activitySet = vkbeautify.xml('<ActivitySet>' + activitySet + '</ActivitySet>');
    element.find('xmp').empty().text(activitySet);
    element.mCustomScrollbar("update");
  }
}

function handleSave() {
  var data = {
    nodes: graph_main.nodes,
    edges: graph_main.edges
  };
  for (var i = 0; i < data.nodes.length; i++) {
    if(data.nodes[i].component=="ordinaryActivity"){
      for (let key in data.nodes[i].conventional) {
        if (data.nodes[i].conventional[key]) {
          if(key=="readFieldIdLists"||key=="writeFieldIdLists"){
            data.nodes[i][key]=[ data.nodes[i].conventional[key] ]
          }else{
            data.nodes[i][key]=data.nodes[i].conventional[key]
          }
        }
      }
    }
  }
  // console.log(data)
  // return
  if (window.parent && (typeof window.parent.saveDesignData === 'function')) {
    window.parent.saveDesignData(data);
  } else {
    console.log("No saveDesignData callback function is defined!");
  }
}

function handleUpload() {
  var data = {
    nodes: graph_main.nodes,
    edges: graph_main.edges
  };
  for (var i = 0; i < data.nodes.length; i++) {
    if(data.nodes[i].component=="ordinaryActivity"){
      for (let key in data.nodes[i].conventional) {
        if (data.nodes[i].conventional[key]) {
          if(key=="readFieldIdLists"||key=="writeFieldIdLists"){
            data.nodes[i][key]=[ data.nodes[i].conventional[key] ]
          }else{
            data.nodes[i][key]=data.nodes[i].conventional[key]
          }
        }
      }
    }
  }
  if (window.parent && (typeof window.parent.loadFlowDesign === 'function')) {
    window.parent.loadFlowDesign(data);
  } else {
    console.log("No loadFlowDesign callback function is defined!");
  }
}

/**
 * 右击菜单编辑
 */
function handleMenuEdit() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedNode = graph_active.state.selectedNode;
  var data = {
    id: selectedNode.id,
    activitySetId: selectedNode.activitySet.activitySetId
  };
  var full_right = $('.full-right'),
    menu = full_right.children('.menu'),
    tab = full_right.find('.tab.active'),
    curr_tab = menu.find('[data-tab="tab_' + data.id + '"]');
  if (curr_tab.length) {
    full_right.find('[data-tab=tab_' + data.id + ']').show();
    curr_tab.trigger('click');
  } else { // 创建标签页及graph对象
    menu.append(juicer($('#blockActiEdi_item_tpl').html(), data));
    full_right.append(juicer($('#blockActiEdi_tab_tpl').html(), data));
    menu.find('.item').tab();
    menu.find('[data-tab="tab_' + data.id + '"]').trigger('click');
    tab.find('.full-right-btn .item').tab();
    tab.find('.content-div').mCustomScrollbar();
    graph_active.createSubGraph();
  }
}

function handleNodeMenuProp() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedNode = graph_active.state.selectedNode;
  // console.log(selectedNode)
  // 防止点击线条属性，切换后样式错乱
  $(".prop_node .ui.tab").removeClass("active").first().addClass("active");
  
  $('.ui.modal.prop_node').modal({
    autofocus: false,
    closable: false,
    onApprove: function () {
      //更新-扩展属性
      selectedNode.extendAttr = [];
      $('.extended_attr tbody tr').each(function () {
        var jsonstr = $(this).attr('jsonstr');
        selectedNode.extendAttr.push(jsonstr);
      });
      //更新-高级 属性
      selectedNode.highLevel = {};
      var highLevel = {};
      $('.prop_node .highLevel').find('input').each(function () {
        highLevel[$(this).attr('name')] = $(this).val();
      });
      selectedNode.highLevel = highLevel;
      //更新-超时限制
      $('.timeout_limit').find('input[name], select[name]').each(function () {
        selectedNode.timeoutLimit[$(this).attr('name')] = $(this).val();
      });
      selectedNode.timeoutLimit.deadline = [];
      $('.timeout_limit tbody tr').each(function () {
        var jsonstr = $(this).attr('jsonstr');
        selectedNode.timeoutLimit.deadline.push(jsonstr);
      });
      //更新-后置条件
      // graph_active.updatePostCondi('.post_condition');
      //更新-前置条件
      selectedNode.frontCondition = {};
      $('.front_condition > div:not(".hideDiv")').find('input:not(:radio)[name], select').each(function () {
        selectedNode.frontCondition[$(this).attr('name')] = $(this).val();
      });
      //更新-工具

      //更新-常规
      selectedNode.conventional = {};
      var conventional = {};
      conventional.assignType="2";
      $('.prop_node .conventional').find('input[name], textarea, select').each(function () {
        conventional[$(this).attr('name')] = $(this).val();
      });
      if (conventional.ID != selectedNode.id) {
        selectedNode.id = conventional.ID;
      }
      if (conventional.name != selectedNode.title) {
        selectedNode.title = conventional.name;
      }
      // $('.conventional .definition_field_check_type').find('.checkbox').each(function () {
      //   if ($(this).hasClass('checked')) {
      //     var value = $(this).find('input').attr('data-value');
      //     conventional[$(this).find('input').attr('name')] = value;
      //     // 指定角色
      //     if (value === '1') {
      //       var $role = $('.conventional select[name="definition_role"]').parent();
      //       conventional.performer = $role.children('.text').attr('definition_id') || '';
      //       var role_txt = $role.dropdown('get text'); //Semantic存在bug，重构dropdown不能取value
      //       if (role_txt != '请选择' && role_txt != '(空)') {
      //         conventional.participantID = $role.dropdown('get text');
      //       }

      //       $('.conventional .validateType').find('.checkbox').each(function () {
      //         if ($(this).hasClass('checked')) {
      //           var value = $(this).find('input').attr('id');
      //           conventional.validateMethod = value;
      //         }
      //       })
      //     }
      //   }
      // });
      conventional.actionIdList=[];
      var items = document.getElementsByName("actionIdList");  
      for (i = 0; i < items.length; i++) {                    
        if (items[i].checked) {  conventional.actionIdList.push(items[i].value);    }                
      } 
      conventional.readFieldIdLists=[];
      var items1 = document.getElementsByName("readFieldIdLists");  
      for (i = 0; i < items1.length; i++) {                    
        if (items1[i].checked) {  conventional.readFieldIdLists.push(items1[i].value);    }                
      }
      conventional.writeFieldIdLists=[];
      var items2 = document.getElementsByName("writeFieldIdLists");  
      for (i = 0; i < items2.length; i++) {                    
        if (items2[i].checked) {  conventional.writeFieldIdLists.push(items2[i].value);    }                
      }  

      // if (!conventional.ruleType) {
      //   layer.msg('请选择处理规则！', {time: 2000, icon: 2});
      //   return false;
      // }
      // if (!conventional.entityChangeStatus) {
      //   layer.msg('请选择实体状态！', {time: 2000, icon: 2});
      //   return false;
      // }
      if (conventional.actionIdList.length==0) {
        layer.msg('请至少选择一个动作！', {time: 2000, icon: 2});
        return false;
      }
      selectedNode.conventional = conventional;
      graph_active.updateGraph();
    },
    onShow: function () { // @wt 弹框展示
      var node = selectedNode;
      //展示-监控信息
      $('.monitorinf select[name="isResponsibleTem"]').dropdown('set selected', node.monitorinf.isResponsibleTem);
      var responsible = node.monitorinf.responsible;
      if (responsible && responsible.length) {
        var tr = '';
        responsible.forEach(function (resp) {
          graph_active.participants.forEach(function (participant) {
            if (resp == participant.conventional_definition_id) {
              tr += participant.conventional_definition_name ? '<tr definition_id="' + resp + '"><td>'
                + (participant.conventional_definition_name + '-rol') + '</td></tr>' : '<tr  definition_id="' + resp
                + '"><td>' + (resp + '-rol') + '</td></tr>';
            }
          });
        });
        $('.monitorinf tbody').append(tr);
      }
      //展示-高级
      $('.highLevel').find('input').each(function () {
        for (var i in node.highLevel) {
          if ($(this).attr('name') == i) {
            $(this).val(node.highLevel[i]);
          }
        }
      });
      //展示-超时限制
      $('.timeout_limit').find('input').each(function () {
        for (var i in node.timeoutLimit) {
          if ($(this).attr('name') == i) {
            $(this).val(node.timeoutLimit[i]);
          }
        }
      });
      $('.timeout_limit').find('select').each(function () {
        for (var i in node.timeoutLimit) {
          if ($(this).attr('name') == i) {
            $(this).dropdown('set selected', node.timeoutLimit[i]);
          }
        }
      });
      var deadline_strs = node.timeoutLimit.deadline;
      if (deadline_strs && deadline_strs.length) {
        var d_tr = '';
        deadline_strs.forEach(function (deadline_str) {
          var deadline_obj = JSON.parse(deadline_str);
          d_tr += '<tr jsonstr= ' + deadline_str + '><td>' + deadline_obj.deadlineCondition + '</td></tr>';
        });
        $('.timeout_limit tbody').append(d_tr);
      }
      //展示-扩展属性集
      var extendAttr_strs = node.extendAttr;
      if (extendAttr_strs && extendAttr_strs.length) {
        var e_tr = '';
        extendAttr_strs.forEach(function (extendAttr_str) {
          var extendAttr_obj = JSON.parse(extendAttr_str);
          var data = {
            data: extendAttr_obj,
            jsonstr: extendAttr_str
          };
          e_tr += juicer($('#extended_attr_tpl').html(), data);
        });
        $('.extended_attr tbody').append(e_tr).find('.ui.checkbox').checkbox();
      }
      //展示-后置条件
      $('.post_condition .targetActivity').html($('#transition_tpl').html());
      $('.post_condition .targetActivity .menu .item').tab();
      $(".targetActivity .transferInf_extended_attr .postCondi_extendedAttr").mCustomScrollbar();
      $('.targetActivity .conditionList,.conditionList2').mCustomScrollbar();
      var postCondition = {targetActivities: []};
      var edges_act = graph_active.edgesLinkAcivity();
      edges_act.forEach(function (edge) {
        if (edge.source == node) {
          postCondition.targetActivities.push({'activity': edge.target, 'transition': edge});
        }
      });
      if (postCondition.targetActivities.length > 0) {
        $('.post_condition .targetActivity').removeClass('invisible');
        $('.post_condition select[name="splitType"]').parent().removeClass('disabled');
        if (postCondition.targetActivities.length > 1) {
          var splitType = graph_active.state.selectedNode.postCondition.splitType || 'XOR';
          $('.post_condition select[name="splitType"]').parent().dropdown('set selected', splitType);
        } else {
          $('.post_condition select[name="splitType"]').parent().addClass('disabled');
        }
        postCondition.targetActivities.forEach(function (targetActivity) {// 目标活动展示
          $('.post_condition .list').append('<div class="item" acivityId="' + targetActivity.activity.id + '" jsonstr='
            + JSON.stringify(targetActivity.transition) + '>' +
            '    <div class="content">' +
            '        <div class="">' + targetActivity.activity.title + '</div>' +
            '    </div>' +
            '</div>');
        });
        $('.post_condition .list').on('click', '.item', function () {// 点击目标活动
          $(this).addClass('active').siblings().removeClass('active');
          var transition = JSON.parse($(this).attr('jsonstr'));
          graph_active.showTransition('.post_condition', transition);
        });
        $('.post_condition .list .item').eq(0).trigger('click');
      } else {
        $('.post_condition .targetActivity').addClass('invisible');
        $('.post_condition select[name="splitType"]').parent().addClass('disabled');
      }
      //展示-前置条件
      var frontCondition = node.frontCondition;
      if (frontCondition.convergeType) {
        $('.front_condition .dropdown.convergeType').dropdown('set selected', frontCondition.convergeType);
        $('.front_condition select[name=syncType]').dropdown('set selected', frontCondition.syncType || "");
        $('.front_condition input[name=voteText]').val(frontCondition.voteText || "");
        if (frontCondition.isCreateNew == "true") {
          $('.front_condition input[tabindex="true"]').parent().checkbox('check');
        } else if (frontCondition.isCreateNew == "false") {
          $('.front_condition input[tabindex="false"]').parent().checkbox('check');
        }
      }
      //展示-工具

      //展示-常规
      var conventional = node.conventional;
      console.log(conventional)
      // 动作列表
      var actionList=window.parent.actionList;
      var str = '<label>选择动作:</label>';
      actionList.forEach(function (item) {
        str += '<input type="checkbox" name="actionIdList" value="'+item.actionId+'" id="'+item.actionId+'"><label for="'+item.actionId+'">'+item.name+'</label>';
      });
      $(".actionlist").empty().append(str);
      // 读字段
      var fieldList=window.parent.fieldList;
      var str1 = '<label>读字段集合:</label>';
      fieldList.forEach(function (item) {
        str1 += '<input type="checkbox" name="readFieldIdLists" value="'+item.fieldId+'" id="'+item.fieldId+'"><label for="'+item.fieldId+'">'+item.fieldName+'</label>';
      });
      $(".readfieldlist").empty().append(str1);
      // 写字段
      var str2 = '<label>写字段集合:</label>';
      fieldList.forEach(function (item) {
        str2 += '<input type="checkbox" name="writeFieldIdLists" value="'+item.fieldId+'" id="'+item.fieldId+'"><label>'+item.fieldName+'</label>';
      });
      $(".writefieldlist").empty().append(str2);

      
      $('.conventional').find('input[name], textarea').each(function () {
        for (var key in conventional) {
          if (key == $(this).attr('name')) {
            $(this).val(conventional[key]);
          }
        }
      });

      var edgs=graph_active.edges;
      var childAction=[];
      for (var i = 0; i < edgs.length; i++) {
	    	if(node.id==edgs[i].source.id&&(!childAction.includes(edgs[i].postCondition.actionId))){
          childAction.push(edgs[i].postCondition.actionId)
        }
      }
      $(".actionlist input").click(function(){
        if(!$(this).is(':checked')&&childAction.includes($(this).val())){
          layer.msg('该节点的子线条属性上含有该动作，无法取消选中！', {time: 2000, icon: 0});
          return false;
        }
      })

      $('.conventional').find('select').not($('input[name="definition_role"]')).each(function () {
        for (var key in conventional) {
          if (key == $(this).attr('name')) {
            $(this).dropdown('set selected', conventional[key]);
          }
        }
      });
      if (!window.parent.flowConfigs.showProjectManager) {
        $('#projectManager_wrapper').hide();
      }

      $('.conventional input[name=ID]').val(node.id);
      $('.conventional input[name=name]').val(node.title);
      var ruleTypeText="";
      $('.conventional select[name="ruleType"] option').each(function(index,item){
        if(item.value==conventional.ruleType){ ruleTypeText=item.text }
      })
      var entityChangeStatusText="";
      $('.conventional select[name="entityChangeStatus"] option').each(function(index,item){
        if(item.value==conventional.entityChangeStatus){ entityChangeStatusText=item.text }
      })
      $('.conventional select[name="ruleType"]').dropdown('set text', ruleTypeText);
      $('.conventional select[name="entityChangeStatus"]').dropdown('set text', entityChangeStatusText);
      
      // $(".readfieldlist input").click(function(){
      //   if($(this).is(':checked')&&$("input[name='writefieldlist'][value='"+$(this).val()+"']").is(':checked')){
      //     return false;
      //   }
      // })
      // $(".writefieldlist input").click(function(){
      //   if($(this).is(':checked')){
      //     $("input[name='readFieldIdLists'][value='"+$(this).val()+"']").prop("checked", "checked")
      //     $("input[name='readFieldIdLists'][value='"+$(this).val()+"']").attr("disabled","disabled"); 
      //   }else{
      //     $("input[name='readFieldIdLists'][value='"+$(this).val()+"']").removeAttr("disabled","disabled"); 
      //   }
      // })
      
      // if (conventional.validatorType === 'user' && conventional.definition_user_id) {
      //   $('.conventional select[name="definition_user"]').dropdown('set text', conventional.definition_user_name || '');
      //   $('.conventional .dropdown .text').attr('definition_id', conventional.definition_user_id);
      // }
      // if (conventional.validatorType === 'role' && conventional.performer) {
      //   $('.conventional select[name="definition_role"]').dropdown('set text', conventional.participantID || '');
      //   $('.conventional .dropdown .text').attr('definition_id', conventional.performer);
      // }
      //监控信息-是否为临时监控
      $('.monitorinf select[name="isResponsibleTem"]').on('change', function () {
        var node = graph_active.state.selectedNode;
        node.monitorinf.isResponsibleTem = $(this).val();
      });
      // $('.conventional .definition_field_check_type .checkbox').on('change', function (value) {
      //   if (value.target.id === 'user') {
      //     $('.ruletypebox').show();
      //     $('.definition_field_role_wrapper').hide();
      //   } else if (value.target.id === 'role') {
      //     $('.ruletypebox').hide();
      //     $('.definition_field_role_wrapper').show();
      //   }
      // });
      //常规-参与者集
      // $('.conventional .definition_field_user').on('click', function () {
      //   var participants = graph_active.participants;
      //   var userOptions = '<option value="">请选择</option>';
      //   participants.users.forEach(function (participant) {
      //     var rol = participant.conventional_definition_name ? participant.conventional_definition_name
      //       : participant.conventional_definition_id;
      //     userOptions += '<option value="' + participant.conventional_definition_id + '">' + rol + '</option>';
      //   });
      //   $('.conventional select[name="definition_user"]').empty().append(userOptions);
      // });
      $('.conventional .definition_field_role').on('click', function () {
        var participants = graph_active.participants;
        var roleOptions = '<option value="">请选择</option>';
        participants.roles.forEach(function (participant) {
          var rol = participant.conventional_definition_name ? participant.conventional_definition_name
            : participant.conventional_definition_id;
          roleOptions += '<option value="' + participant.conventional_definition_id + '">' + rol + '</option>';
        });
        $('.conventional select[name="definition_role"]').empty().append(roleOptions);
      });
      //常规-参与者集-下拉菜单
      $('.conventional .definition_field_user').on('click', '.item', function () {
        var definition_id = $(this).attr('data-value') != "0" ? $(this).attr('data-value') : '';
        $('.conventional select[name="definition_user"]').siblings('.text').attr('definition_id', definition_id);
      });
      $('.conventional .definition_field_role').on('click', '.item', function () {
        var definition_id = $(this).attr('data-value') != "0" ? $(this).attr('data-value') : '';
        $('.conventional select[name="definition_role"]').siblings('.text').attr('definition_id', definition_id);
      });
    },
    onHidden: function () {
      $('.prop_node .menu .item[data-tab="one"]').trigger('click');
      $('.monitorinf select[name="isResponsibleTem"]').off('change'); // 弹窗关闭，避免清空表单时触发事件
      $(this).find('input, textarea').val('');
      $(this).find('.ui.dropdown').dropdown('clear');
      $(this).find('.ui.checkbox').checkbox('uncheck');
      $('.monitorinf tbody').empty(); // 清空监控信息
      $('.timeout_limit tbody').empty(); // 清空监控信息
      $('.extended_attr tbody').empty(); // 清空扩展属性集
      $('.post_condition .list').empty(); // 清空后置条件
      $('.post_condition .targetActivity').html('');
      $('.conventional select[name="definition_role"]').siblings('.text').removeAttr('definition_id');
    }
  }).modal('show');
  $('.prop_node>.menu a[data-tab*="two"]').addClass('hideitem');
  if (selectedNode.title == '提交申请') {
    $('.prop_node>.menu a[data-tab="two_1"]').removeClass('hideitem');
  }
  if (selectedNode.title == '块活动') {
    $('.prop_node>.menu a[data-tab="two_2"]').removeClass('hideitem');
  }
  if (selectedNode.title == '审核申请') {
    $('.prop_node>.menu a[data-tab="two_3"]').removeClass('hideitem');
  }
}

function handleEdgeMenuProp() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var selectedEdge = graph_active.state.selectedEdge;
  $('.prop_edge .targetActivity').html($('#transition_tpl').html());
  $('.prop_edge .targetActivity .menu .item').tab();
  $(".targetActivity .transferInf_extended_attr .postCondi_extendedAttr").mCustomScrollbar();
  $('.targetActivity .conditionList,.conditionList2').mCustomScrollbar();
  $('.ui.modal.prop_edge').modal({
    autofocus: false,
    closable: false,
    onApprove: function () {
      //更新-转移属性
      graph_active.updatePostCondi('.prop_edge');
    },
    onShow: function () {
      var edge = graph_active.state.selectedEdge;
      console.log(edge)
      //展示-后置条件
      graph_active.showTransition('.prop_edge', edge);
    },
    onHidden: function () {
      $('.prop_edge .targetActivity').html('');
    }
  }).modal('show');
}

function handleRightMenu() {
  var graph_active = graphPool.getGraphByActiveEdit();
  var item = $(this).attr('name');
  var selectedNode = graph_active.state.selectedNode,
    selectedEdge = graph_active.state.selectedEdge;
  switch (item) {
    case 'removeMenu':
      handleDeleteNode();
      break;
    case 'toFront':
      alert('前置');
      break;
    case 'editMenu':
      handleMenuEdit();
      break;
    case 'propMenu':
      if (selectedNode) {
        handleNodeMenuProp();
      } else if (selectedEdge) {
        handleEdgeMenuProp();
      }
      break;
  }
  $('#rMenu').hide();
}

/**
 * edge关联连接的node对象
 * @param  {Object} jsonObj 数据对象
 * @return {Object}         关联node以后的数据对象
 */
function edgeAssociateNode(jsonObj) {
  if (jsonObj.edges !== null && jsonObj.nodes !== null) {
    jsonObj.edges.map(function (edge) { // 根据edge.source.id重新关联node对象
      var source = jsonObj.nodes.find(function (node) {
        return node.id === edge.source.id;
      });
      var target = jsonObj.nodes.find(function (node) {
        return node.id === edge.target.id;
      });
      edge.source = source;
      edge.target = target;
      return edge;
    });
  }
  return jsonObj;
}


