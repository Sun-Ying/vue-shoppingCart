var vm = new Vue({
    el: "#app",
    data: {
        items: [], //商品列表数据
        totalMoney: 0, //总金额
        checkAll: false, //全选
        delFlag: false,//删除弹窗是否显示
        curProduct: "", //当前产品
        url: "javascript:;" //结算链接
    },
    // 局部过滤器：金额格式化
    filters: {
        formatMoney: function (value) {
            return "￥" + value.toFixed(2);
        }
    },
    mounted() {
        // demo元素加载完成执行
        this.$nextTick(function () {
            // vm为当前实例名称也可用this
            vm.cartView();
        })
    },
    methods: {
        // 遍历ajax购物车数据显示在页面中
        cartView: function () {
            // vm = this
            vm.$http.get("data/cartData.json").then(function (cartdata) {
                if (cartdata.data.status == 1) {
                    vm.items = cartdata.data.result.list;
                }
                // vm.totalMoney = cartdata.data.result.totalMoney;
            })
        },
        // 商品数量加减操作
        changeMoney: function (item, way) {
            // way是加减方式，加=+1，减=-1，最少数量为1
            item.productQuantity = (item.productQuantity == 1) && (way < 0) ? 1 : item.productQuantity + way;
            // 重新计算总金额
            this.calculateTotalMoney();
        },
        //选择商品单选
        chooseProduct: function (item) {
            // 判断数组里是否有ischecked属性
            if (typeof item.ischecked == "undefined") {
                // 全局注册
                // Vue.set(item, "ischecked", true);
                // 当前示例注册
                this.$set(item, "ischecked", true);
            } else {
                item.ischecked = !item.ischecked;
            }
            var _this = this;
            var i = 0;
            var length = this.items.length;
            //如列表单选全部选中,那全选按钮选中,否则全选按钮不选中
            this.items.forEach(function (item, index) {
                if (item.ischecked) {
                    i++;
                    _this.checkAll = i == length ? true : false;
                }
            });
            // 重新计算总金额
            this.calculateTotalMoney();
        },
        // 全选 & 取消全选
        chooseAll: function (flag) {
            this.checkAll = flag;
            let _this = this;
            this.items.forEach(function (item, index) {
                if (typeof item.ischecked == "undefined") {
                    _this.$set(item, "ischecked", flag);
                } else {
                    item.ischecked = flag;
                }
            });
            // 重新计算总金额
            this.calculateTotalMoney();
        },
        // 计算总金额
        calculateTotalMoney: function () {
            var _this = this;
            // 清零
            this.totalMoney = 0;
            this.items.forEach(function (item, index) {
                if (item.ischecked) {
                    _this.totalMoney += item.productQuantity * item.productPrice;
                }
            });
        },
        // 显示删除弹窗
        delconfirm: function (item) {
            this.delFlag = true;
            this.curProduct = item;
        },
        // 删除商品
        delProduct: function () {
            var index = this.items.indexOf(this.curProduct);
            this.items.splice(index, 1);
            this.delFlag = false;
        },
        // 如未选择商品这无法进入下一步结算
        checkout: function (href) {
            if (this.totalMoney) {
                this.url = href;
            } else {
                alert("没选择商品就想结算，你在逗我吗");
            }
        }
    }
})
// 全局过滤器
Vue.filter('money', function (value, type) {
    return "￥" + value.toFixed(2) + type;
});