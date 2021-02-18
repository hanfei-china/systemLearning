//反序列化参数
export default {
  functional: true,
  render: (h, ctx) => {
    let props = {};
    for(let key in ctx.props){
      let value = ctx.props[key];
      props[key] = JSON.parse(value || '{}');
    }
    return ctx.scopedSlots.default && ctx.scopedSlots.default(props);
  }
};
