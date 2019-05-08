Component({
    properties: {
        phonenum: {
            type: String,
            value: ""
        },
        callphone: {
            type: Boolean,
            value: !1
        }
    },
    data: {},
    methods: {
        _call: function(t) {
            this.triggerEvent("call");
        },
        _quitcall: function() {
            this.triggerEvent("quitcall");
        }
    }
});