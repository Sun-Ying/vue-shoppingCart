new Vue({
    el: ".address",
    data: {
        addressList: [],  //地址数组
        limitNum: 3,   //限制地址展示几条数据
        curIndex: 0,  //当前选中地址
        shippingMethod: 1,  //配送方式
        addEditConfirmFlag: false,  //新增修改地址弹窗显示判断
        delConfirmFlag: false,   //删除弹窗显示判断
        curAddress: "",   //当前地址
        newAddress: "",  //新地址
        flag: "add",  //标志是新增窗口还是修改窗口
        editIndex: 0  //修改项index值
    },
    mounted() {
        // demo元素加载完成执行
        this.$nextTick(function () {
            this.addressView();
        });
    },
    computed: {
        // 过滤地址显示条数
        filteraddress: function () {
            return this.addressList.slice(0, this.limitNum);
        }
    },
    methods: {
        // 从json里获取地址数据
        addressView: function () {
            var _this = this;
            this.$http.get("data/address.json").then(function (respons) {
                var res = respons.data;
                if (res.status == "0") {
                    _this.addressList = res.result;
                }
            })
        },
        //设置默认地址
        setDefault: function (idx) {
            this.addressList.forEach(function (item, index) {
                item.isDefault = index == idx ? true : false;
            })
        },
        // 点击删除地址按钮，弹出删除弹窗,传入当前删除项
        delConfirm: function (item) {
            this.delConfirmFlag = true;
            this.curAddress = item;
        },
        // 删除地址
        delAddress: function () {
            var index = this.addressList.indexOf(this.curAddress);
            this.addressList.splice(index, 1);
            this.delConfirmFlag = false;
        },
        //点击新增地址按钮，弹窗新增地址弹窗，默认值都为空
        addConfirm: function () {
            this.newAddress = { userName: '', streetName: '', tel: "", isDefault: false };
            this.addEditConfirmFlag = true;
            this.flag = "add";
        },
        //点击修改地址按钮
        editConfirm: function (index) {
            this.addEditConfirmFlag = true;
            // 标记当前修改项index
            this.editIndex = index;
            // 当前修改项为object类型数据,直接赋值操作为浅拷贝,变量会随着数据变化而变化,弹窗输入会实时变化数据,
            // 解决方案:先转换为JSON字符串,再转换JSON对象,进行深度拷贝
            this.newAddress = JSON.parse(JSON.stringify(this.addressList[index]));
            this.flag = "edit";
        },
        // 新增修改地址操作
        addEditAddress: function () {
            if (this.flag == "add") {
                // 新增地址插入第一条数据,默认选中
                this.addressList.unshift(this.newAddress);
                this.curIndex = 0;
            } else if (this.flag == "edit") {
                // 修改地址
                this.$set(this.addressList, this.editIndex, this.newAddress);
            }
            // 关闭弹窗
            this.addEditConfirmFlag = false;
        }
    }
})