new Vue({
    el: ".address",
    data: {
        addressList: [],  //地址数组
        limitNum: 3,   //默认展示几条数据
        curIndex: 0,  //当前选中地址
        shippingMethod: 1,  //配送方式
        addEditConfirmFlag: false,  //新增修改地址弹窗显示判断
        delConfirmFlag: false,   //删除弹窗显示判断
        curAddress: "",   //当前地址
        newItem: {},  //新地址对象
        newName: "",  //新地址姓名
        newAddress: "",  //新地址
        newTel: "",  //新地址电话
        flag: "add"  //标志是新增窗口还是修改窗口
    },
    mounted() {
        this.$nextTick(function () {
            this.addressView();
        });
    },
    computed: {
        filteraddress: function () {
            return this.addressList.slice(0, this.limitNum);
        }
    },
    methods: {
        addressView: function () {
            var _this = this;
            this.$http.get("data/address.json").then(function (respons) {
                var res = respons.data;
                if (res.status == "0") {
                    _this.addressList = res.result;
                }
            })
        },
        setDefault: function (addressId) {
            this.addressList.forEach(function (item, index) {
                if (item.addressId == addressId) {
                    item.isDefault = true;
                } else {
                    item.isDefault = false;
                }
            })
        },
        delConfirm: function (item) {
            this.delConfirmFlag = true;
            this.curAddress = item;
        },
        delAddress: function () {
            var index = this.addressList.indexOf(this.curAddress);
            this.addressList.splice(index, 1);
            this.delConfirmFlag = false;
        },
        addConfirm: function () {
            this.newName = "";
            this.newAddress = "";
            this.newTel = "";
            this.addEditConfirmFlag = true;
            this.flag = "add";
            this.newItem = {};
        },
        editConfirm: function (item) {
            this.addEditConfirmFlag = true;
            this.newName = item.userName;
            this.newAddress = item.streetName;
            this.newTel = item.tel;
            this.flag = "edit";
            this.curAddress = item;
        },
        addEditAddress: function () {
            if (this.flag == "add") {
                this.newItem.userName = this.newName;
                this.newItem.streetName = this.newAddress;
                this.newItem.tel = this.newTel;
                this.addressList.unshift(this.newItem);
                this.curIndex = 0;
            } else if (this.flag == "edit") {
                var _this = this;
                var index = this.addressList.indexOf(this.curAddress);
                this.addressList[index].userName = _this.newName;
                this.addressList[index].streetName = _this.newAddress;
                this.addressList[index].tel = _this.newTel;
            }
            this.addEditConfirmFlag = false;
        }
    }
})