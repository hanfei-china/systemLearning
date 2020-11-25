/*
    1. 在vue内部操作dom可以使用$refs
    2. 在mounted阶段，DOM结构准备就绪，但是这里的准备就绪需要特别说明一下：

虽然DOM结构已经出来了，但是如果在DOM结构中的某个DOM节点使用了v-if、v-show或者v-for(*即根据 获得的后台数据 或 父组件/路由传递过来的参数来动态操作DOM，即响应式）， 那么这些DOM是不会再mounted阶段找到的。

如果想要真正地在DOM加载完成后拿到数据，就需要调用VUE的全局api ： this.$nextTick(() => {})

如果说mounted阶段是加载阶段，那么updated阶段则是完成了数据更新到DOM的阶段(对加载回来的数据进行处理)，此时，ref、数据等等全部都挂载到DOM结构上去，在**update阶段使用this.$refs.xxx，**就100%能找到该DOM节点.

updated与mounted不同的是，在每一次的DOM结构更新，vue都会调用一次updated(){}钩子函数！而mounted仅仅只执行一次而已
*/