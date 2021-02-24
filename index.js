"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Functor = /** @class */ (function () {
    function Functor() {
    }
    // fmap() {}
    Functor.prototype.getValue = function (r) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    return Functor;
}());
var Monad = /** @class */ (function (_super) {
    __extends(Monad, _super);
    function Monad() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Monad;
}(Functor));
var Function$ = /** @class */ (function (_super) {
    __extends(Function$, _super);
    function Function$(func) {
        var _this = _super.call(this) || this;
        _this.func = func;
        return _this;
    }
    Function$.return = function (n) {
        return new Function$(function () { return n; });
    };
    Function$.prototype.fmap = function (f) {
        var _this = this;
        return new Function$(function (r) { return f(_this.func(r)); });
    };
    Function$.prototype.bind = function (f) {
        var _this = this;
        return new Function$(function (r) { return f(_this.func(r)).func(r); });
    };
    Function$.prototype.getValue = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, getValue(r)(this.func(r))];
            });
        });
    };
    return Function$;
}(Monad));
var Array$ = /** @class */ (function (_super) {
    __extends(Array$, _super);
    function Array$(array) {
        var _this = _super.call(this) || this;
        _this.array = array;
        return _this;
    }
    Array$.return = function (n) {
        return new Array$([n]);
    };
    Array$.returnMultiple = function (ns) {
        return new Array$(ns);
    };
    Array$.prototype.fmap = function (f) {
        return new Array$(this.array.map(f));
    };
    Array$.prototype.join = function () {
        return new Array$(this.array.map(function (a$) { return (a$ instanceof Array$ ? a$.array : [a$]); }).flat());
    };
    Array$.prototype.bind = function (f) {
        return new Array$(this.array.flatMap(function (x) { return f(x).array; }));
    };
    Array$.prototype.getValue = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(this.array.map(getValue(r)))];
            });
        });
    };
    return Array$;
}(Monad));
var Promise$ = /** @class */ (function (_super) {
    __extends(Promise$, _super);
    function Promise$(promise) {
        var _this = _super.call(this) || this;
        _this.promise = promise;
        return _this;
    }
    Promise$.return = function (n) {
        return new Promise$(Promise.resolve(n));
    };
    Promise$.sequence = function (array$) {
        return new Promise$(Promise.all(array$.array.map(function (promise$) { return promise$.promise; }))).fmap(function (p) { return new Array$(p); });
    };
    Promise$.prototype.fmap = function (f) {
        return new Promise$(this.promise.then(f));
    };
    Promise$.prototype.bind = function (f) {
        var g = new Function$(f).fmap(function (p) { return p.promise; }).func;
        return new Promise$(this.promise.then(g));
    };
    Promise$.prototype.getValue = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fmap(getValue(r)).promise];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Promise$;
}(Monad));
var PromiseArray$ = /** @class */ (function (_super) {
    __extends(PromiseArray$, _super);
    function PromiseArray$(promise$array$) {
        var _this = _super.call(this) || this;
        _this.promise$array$ = promise$array$;
        return _this;
    }
    PromiseArray$.return = function (n) {
        return new PromiseArray$(Promise$.return(Array$.return(n)));
    };
    PromiseArray$.returnMultiple = function (ns) {
        return new PromiseArray$(Promise$.return(new Array$(ns)));
    };
    PromiseArray$.prototype.fmap = function (f) {
        return new PromiseArray$(this.promise$array$.fmap(function (array$) { return array$.fmap(f); }));
    };
    PromiseArray$.prototype.bind = function (f) {
        return new PromiseArray$(this.promise$array$.bind(function (array$) {
            return Promise$.sequence(array$.fmap(function (m) { return f(m).promise$array$; })).fmap(function (array$) { return array$.join(); });
        }));
    };
    PromiseArray$.prototype.getValue = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.promise$array$.getValue(r)];
            });
        });
    };
    return PromiseArray$;
}(Monad));
var Record$ = /** @class */ (function (_super) {
    __extends(Record$, _super);
    function Record$(recordP) {
        var _this = _super.call(this) || this;
        _this.recordP = recordP;
        return _this;
    }
    Record$.return = function (r) {
        return new Record$(Promise.resolve(r));
    };
    Record$.prototype._mapAsync = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            var newRecord, oldRecord, _i, _a, key, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        newRecord = {};
                        return [4 /*yield*/, this.recordP];
                    case 1:
                        oldRecord = _d.sent();
                        _i = 0, _a = Object.keys(oldRecord);
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        key = _a[_i];
                        _b = newRecord;
                        _c = key;
                        return [4 /*yield*/, f(oldRecord[key])];
                    case 3:
                        _b[_c] = _d.sent();
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, newRecord];
                }
            });
        });
    };
    Record$.prototype.fmapAsync = function (f) {
        return new Record$(this._mapAsync(f));
    };
    return Record$;
}(Monad));
var Query$ = /** @class */ (function (_super) {
    __extends(Query$, _super);
    function Query$(query$) {
        var _this = _super.call(this) || this;
        _this.query$ = query$;
        return _this;
    }
    Query$.return = function (n) {
        return new Query$(Function$.return(PromiseArray$.return(n)));
    };
    Query$.returnMultiple = function (ns) {
        return new Query$(Function$.return(PromiseArray$.returnMultiple(ns)));
    };
    Query$.prototype.fmap = function (f) {
        return new Query$(this.query$.fmap(function (promise$array$) { return promise$array$.fmap(f); }));
    };
    Query$.prototype.bind = function (f) {
        var _this = this;
        return new Query$(new Function$(function (r) { return _this.query$.func(r).bind(function (m) { return f(m).query$.func(r); }); }));
    };
    Query$.prototype.extend = function (subqueries) {
        var _this = this;
        var resolveItem = function (m) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = [__assign({}, m)];
                        return [4 /*yield*/, Record$.return(subqueries).fmapAsync(function (q$) { return q$.query$.func(m).promise$array$.promise; }).recordP];
                    case 1: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.sent())])))];
                }
            });
        }); };
        return new Query$(new Function$(function (r) {
            return new PromiseArray$(_this.query$
                .func(r)
                .promise$array$.bind(function (array$) {
                return Promise$.sequence(array$.fmap(resolveItem).fmap(function (p) { return new Promise$(p); }));
            }));
        }));
    };
    Query$.prototype.getValue = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query$.getValue(r)];
            });
        });
    };
    return Query$;
}(Monad));
var data1 = [
    {
        name: "a",
        age: 23,
    },
    {
        name: "b",
        age: 25,
    },
    {
        name: "c",
        age: 24,
    },
];
var data2 = [
    {
        name: "a",
        test: "asdf;laksdfj;al",
        other: "ha",
    },
    {
        name: "b",
        age: 25,
        other: "hey",
    },
    {
        name: "c",
        age: 24,
        other: "ho",
    },
];
var data3 = [
    {
        age: 24,
        other: "twenty four",
    },
    {
        age: 25,
        other: "二十五",
    },
    {
        age: 23,
        other: "23232",
    },
];
var getValue = function (r) { return function (m) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, m instanceof Functor
                ? m.getValue(r)
                : typeof m === "object"
                    ? Record$.return(m).fmapAsync(getValue(r))
                        .recordP
                    : m];
    });
}); }; };
var makeQuery = function (f) {
    return new Query$(new Function$(function (root) {
        var res = f(root);
        return res instanceof Promise
            ? new PromiseArray$(new Promise$(res).fmap(Array$.returnMultiple))
            : PromiseArray$.returnMultiple(res);
    }));
};
var q = Query$.returnMultiple(data1).extend({
    pathA: makeQuery(function (root) {
        return data2.filter(function (item) { return item.name === root.name; });
    }),
    pathB: makeQuery(function (root) {
        return data3.filter(function (item) { return item.age === root.age; });
    }),
});
getValue(0)(q)
    .then(function (x) { return JSON.stringify(x, null, 2); })
    .then(console.log);
