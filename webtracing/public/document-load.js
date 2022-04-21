(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const { WebTracerProvider } = require('@opentelemetry/sdk-trace-web');
const { DocumentLoadInstrumentation } = require('@opentelemetry/instrumentation-document-load');
const { XMLHttpRequestInstrumentation } = require('@opentelemetry/instrumentation-xml-http-request');
const { UserInteractionInstrumentation } = require('@opentelemetry/instrumentation-user-interaction');
const { ZoneContextManager } = require('@opentelemetry/context-zone');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { Resource } = require('@opentelemetry/resources');
const  { SemanticResourceAttributes } =require('@opentelemetry/semantic-conventions');


const provider = new WebTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "Web-tracing"
    }),
});

provider.addSpanProcessor(new SimpleSpanProcessor(new ZipkinExporter({headers:{}})));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register({
    // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
    contextManager: new ZoneContextManager(),
});

const tracer = provider.getTracer('browser','1.0.0');

// Registering instrumentations
registerInstrumentations({
    instrumentations: [
        new DocumentLoadInstrumentation(),
        new UserInteractionInstrumentation(),
        new XMLHttpRequestInstrumentation()
    ],
});

const listEl = document.querySelector('ul');
let btn = document.getElementById('btn');

const showProducts = (products) => {
    listEl.innerHTML = '';
    for (let i = 0; i < products.length; i++) {
        const li = document.createElement('li');
        li.className = "item";
        li.appendChild(document.createTextNode(`${products[i].name}`));
        listEl.appendChild(li);
    }
}



const fetchData = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5002/products', true);
    xhr.onload = () => {
        if (xhr.status == 200) {
            const span = tracer.startSpan('fetching data successful');
            span.setAttribute('service.name','Browser_Service')
            const products = JSON.parse(xhr.responseText);
            showProducts(products);
           span.end();
        }
    };
    xhr.onerror = () => {
//        const span = tracer.startSpan('fetching data failed');
//        span.end();
    }
    xhr.send();
};

btn.addEventListener('click', () => {
    console.log('Fetching data');
    fetchData();
})
},{"@opentelemetry/context-zone":66,"@opentelemetry/exporter-zipkin":67,"@opentelemetry/instrumentation":235,"@opentelemetry/instrumentation-document-load":112,"@opentelemetry/instrumentation-user-interaction":153,"@opentelemetry/instrumentation-xml-http-request":194,"@opentelemetry/resources":244,"@opentelemetry/sdk-trace-base":300,"@opentelemetry/sdk-trace-web":344,"@opentelemetry/semantic-conventions":383}],2:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = exports.NOOP_OBSERVABLE_GAUGE_METRIC = exports.NOOP_OBSERVABLE_COUNTER_METRIC = exports.NOOP_UP_DOWN_COUNTER_METRIC = exports.NOOP_HISTOGRAM_METRIC = exports.NOOP_COUNTER_METRIC = exports.NOOP_METER = exports.NoopObservableBaseMetric = exports.NoopHistogramMetric = exports.NoopUpDownCounterMetric = exports.NoopCounterMetric = exports.NoopMetric = exports.NoopMeter = void 0;
/**
 * NoopMeter is a noop implementation of the {@link Meter} interface. It reuses
 * constant NoopMetrics for all of its methods.
 */
var NoopMeter = /** @class */ (function () {
    function NoopMeter() {
    }
    /**
     * Returns a constant noop histogram.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    NoopMeter.prototype.createHistogram = function (_name, _options) {
        return exports.NOOP_HISTOGRAM_METRIC;
    };
    /**
     * Returns a constant noop counter.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    NoopMeter.prototype.createCounter = function (_name, _options) {
        return exports.NOOP_COUNTER_METRIC;
    };
    /**
     * Returns a constant noop UpDownCounter.
     * @param name the name of the metric.
     * @param [options] the metric options.
     */
    NoopMeter.prototype.createUpDownCounter = function (_name, _options) {
        return exports.NOOP_UP_DOWN_COUNTER_METRIC;
    };
    /**
     * Returns a constant noop observable gauge.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the observable gauge callback
     */
    NoopMeter.prototype.createObservableGauge = function (_name, _options, _callback) {
        return exports.NOOP_OBSERVABLE_GAUGE_METRIC;
    };
    /**
     * Returns a constant noop observable counter.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the observable counter callback
     */
    NoopMeter.prototype.createObservableCounter = function (_name, _options, _callback) {
        return exports.NOOP_OBSERVABLE_COUNTER_METRIC;
    };
    /**
     * Returns a constant noop up down observable counter.
     * @param name the name of the metric.
     * @param [options] the metric options.
     * @param [callback] the up down observable counter callback
     */
    NoopMeter.prototype.createObservableUpDownCounter = function (_name, _options, _callback) {
        return exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
    };
    return NoopMeter;
}());
exports.NoopMeter = NoopMeter;
var NoopMetric = /** @class */ (function () {
    function NoopMetric() {
    }
    return NoopMetric;
}());
exports.NoopMetric = NoopMetric;
var NoopCounterMetric = /** @class */ (function (_super) {
    __extends(NoopCounterMetric, _super);
    function NoopCounterMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopCounterMetric.prototype.add = function (_value, _attributes) { };
    return NoopCounterMetric;
}(NoopMetric));
exports.NoopCounterMetric = NoopCounterMetric;
var NoopUpDownCounterMetric = /** @class */ (function (_super) {
    __extends(NoopUpDownCounterMetric, _super);
    function NoopUpDownCounterMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopUpDownCounterMetric.prototype.add = function (_value, _attributes) { };
    return NoopUpDownCounterMetric;
}(NoopMetric));
exports.NoopUpDownCounterMetric = NoopUpDownCounterMetric;
var NoopHistogramMetric = /** @class */ (function (_super) {
    __extends(NoopHistogramMetric, _super);
    function NoopHistogramMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopHistogramMetric.prototype.record = function (_value, _attributes) { };
    return NoopHistogramMetric;
}(NoopMetric));
exports.NoopHistogramMetric = NoopHistogramMetric;
var NoopObservableBaseMetric = /** @class */ (function (_super) {
    __extends(NoopObservableBaseMetric, _super);
    function NoopObservableBaseMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopObservableBaseMetric.prototype.observation = function () {
        return {
            observable: this,
            value: 0,
        };
    };
    return NoopObservableBaseMetric;
}(NoopMetric));
exports.NoopObservableBaseMetric = NoopObservableBaseMetric;
exports.NOOP_METER = new NoopMeter();
// Synchronous instruments
exports.NOOP_COUNTER_METRIC = new NoopCounterMetric();
exports.NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
exports.NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
// Asynchronous instruments
exports.NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableBaseMetric();
exports.NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableBaseMetric();
exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableBaseMetric();

},{}],3:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOOP_METER_PROVIDER = exports.NoopMeterProvider = void 0;
var NoopMeter_1 = require("./NoopMeter");
/**
 * An implementation of the {@link MeterProvider} which returns an impotent Meter
 * for all calls to `getMeter`
 */
var NoopMeterProvider = /** @class */ (function () {
    function NoopMeterProvider() {
    }
    NoopMeterProvider.prototype.getMeter = function (_name, _version, _options) {
        return NoopMeter_1.NOOP_METER;
    };
    return NoopMeterProvider;
}());
exports.NoopMeterProvider = NoopMeterProvider;
exports.NOOP_METER_PROVIDER = new NoopMeterProvider();

},{"./NoopMeter":2}],4:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BACKWARDS_COMPATIBILITY_VERSION = exports.makeGetter = exports._global = exports.GLOBAL_METRICS_API_KEY = void 0;
var platform_1 = require("../platform");
exports.GLOBAL_METRICS_API_KEY = Symbol.for('io.opentelemetry.js.api.metrics');
exports._global = platform_1._globalThis;
/**
 * Make a function which accepts a version integer and returns the instance of an API if the version
 * is compatible, or a fallback version (usually NOOP) if it is not.
 *
 * @param requiredVersion Backwards compatibility version which is required to return the instance
 * @param instance Instance which should be returned if the required version is compatible
 * @param fallback Fallback instance, usually NOOP, which will be returned if the required version is not compatible
 */
function makeGetter(requiredVersion, instance, fallback) {
    return function (version) {
        return version === requiredVersion ? instance : fallback;
    };
}
exports.makeGetter = makeGetter;
/**
 * A number which should be incremented each time a backwards incompatible
 * change is made to the API. This number is used when an API package
 * attempts to access the global API to ensure it is getting a compatible
 * version. If the global API is not compatible with the API package
 * attempting to get it, a NOOP API implementation will be returned.
 */
exports.API_BACKWARDS_COMPATIBILITY_VERSION = 4;

},{"../platform":8}],5:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsAPI = void 0;
var NoopMeterProvider_1 = require("../NoopMeterProvider");
var global_utils_1 = require("./global-utils");
/**
 * Singleton object which represents the entry point to the OpenTelemetry Metrics API
 */
var MetricsAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function MetricsAPI() {
    }
    /** Get the singleton instance of the Metrics API */
    MetricsAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new MetricsAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global meter. Returns the initialized global meter provider.
     */
    MetricsAPI.prototype.setGlobalMeterProvider = function (provider) {
        if (global_utils_1._global[global_utils_1.GLOBAL_METRICS_API_KEY]) {
            // global meter provider has already been set
            return this.getMeterProvider();
        }
        global_utils_1._global[global_utils_1.GLOBAL_METRICS_API_KEY] = global_utils_1.makeGetter(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, provider, NoopMeterProvider_1.NOOP_METER_PROVIDER);
        return provider;
    };
    /**
     * Returns the global meter provider.
     */
    MetricsAPI.prototype.getMeterProvider = function () {
        var _a, _b;
        return ((_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_METRICS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : NoopMeterProvider_1.NOOP_METER_PROVIDER);
    };
    /**
     * Returns a meter from the global meter provider.
     */
    MetricsAPI.prototype.getMeter = function (name, version, options) {
        return this.getMeterProvider().getMeter(name, version, options);
    };
    /** Remove the global meter provider */
    MetricsAPI.prototype.disable = function () {
        delete global_utils_1._global[global_utils_1.GLOBAL_METRICS_API_KEY];
    };
    return MetricsAPI;
}());
exports.MetricsAPI = MetricsAPI;

},{"../NoopMeterProvider":3,"./global-utils":4}],6:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
__exportStar(require("./NoopMeter"), exports);
__exportStar(require("./NoopMeterProvider"), exports);
__exportStar(require("./types/Meter"), exports);
__exportStar(require("./types/MeterProvider"), exports);
__exportStar(require("./types/Metric"), exports);
__exportStar(require("./types/Observation"), exports);
__exportStar(require("./types/ObservableResult"), exports);
var metrics_1 = require("./api/metrics");
/** Entrypoint for metrics API */
exports.metrics = metrics_1.MetricsAPI.getInstance();

},{"./NoopMeter":2,"./NoopMeterProvider":3,"./api/metrics":5,"./types/Meter":9,"./types/MeterProvider":10,"./types/Metric":11,"./types/ObservableResult":12,"./types/Observation":13}],7:[function(require,module,exports){
(function (global){(function (){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._globalThis = void 0;
// Updates to this file should also be replicated to @opentelemetry/api and
// @opentelemetry/core too.
/**
 * - globalThis (New standard)
 * - self (Will return the current window instance for supported browsers)
 * - window (fallback for older browser implementations)
 * - global (NodeJS implementation)
 * - <object> (When all else fails)
 */
/** only globals that common to node and browsers are allowed */
// eslint-disable-next-line node/no-unsupported-features/es-builtins, no-undef
exports._globalThis = typeof globalThis === 'object' ? globalThis :
    typeof self === 'object' ? self :
        typeof window === 'object' ? window :
            typeof global === 'object' ? global :
                {};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./globalThis"), exports);

},{"./globalThis":7}],9:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationTemporality = exports.ValueType = void 0;
/** The Type of value. It describes how the data is reported. */
var ValueType;
(function (ValueType) {
    ValueType[ValueType["INT"] = 0] = "INT";
    ValueType[ValueType["DOUBLE"] = 1] = "DOUBLE";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
/** The kind of aggregator. */
var AggregationTemporality;
(function (AggregationTemporality) {
    AggregationTemporality[AggregationTemporality["AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED";
    AggregationTemporality[AggregationTemporality["AGGREGATION_TEMPORALITY_DELTA"] = 1] = "AGGREGATION_TEMPORALITY_DELTA";
    AggregationTemporality[AggregationTemporality["AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2] = "AGGREGATION_TEMPORALITY_CUMULATIVE";
})(AggregationTemporality = exports.AggregationTemporality || (exports.AggregationTemporality = {}));

},{}],12:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAPI = void 0;
var NoopContextManager_1 = require("../context/NoopContextManager");
var global_utils_1 = require("../internal/global-utils");
var diag_1 = require("./diag");
var API_NAME = 'context';
var NOOP_CONTEXT_MANAGER = new NoopContextManager_1.NoopContextManager();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Context API
 */
var ContextAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function ContextAPI() {
    }
    /** Get the singleton instance of the Context API */
    ContextAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new ContextAPI();
        }
        return this._instance;
    };
    /**
     * Set the current context manager.
     *
     * @returns true if the context manager was successfully registered, else false
     */
    ContextAPI.prototype.setGlobalContextManager = function (contextManager) {
        return global_utils_1.registerGlobal(API_NAME, contextManager, diag_1.DiagAPI.instance());
    };
    /**
     * Get the currently active context
     */
    ContextAPI.prototype.active = function () {
        return this._getContextManager().active();
    };
    /**
     * Execute a function with an active context
     *
     * @param context context to be active during function execution
     * @param fn function to execute in a context
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    ContextAPI.prototype.with = function (context, fn, thisArg) {
        var _a;
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return (_a = this._getContextManager()).with.apply(_a, __spreadArray([context, fn, thisArg], args));
    };
    /**
     * Bind a context to a target function or event emitter
     *
     * @param context context to bind to the event emitter or function. Defaults to the currently active context
     * @param target function or event emitter to bind
     */
    ContextAPI.prototype.bind = function (context, target) {
        return this._getContextManager().bind(context, target);
    };
    ContextAPI.prototype._getContextManager = function () {
        return global_utils_1.getGlobal(API_NAME) || NOOP_CONTEXT_MANAGER;
    };
    /** Disable and remove the global context manager */
    ContextAPI.prototype.disable = function () {
        this._getContextManager().disable();
        global_utils_1.unregisterGlobal(API_NAME, diag_1.DiagAPI.instance());
    };
    return ContextAPI;
}());
exports.ContextAPI = ContextAPI;

},{"../context/NoopContextManager":25,"../internal/global-utils":34,"./diag":15}],15:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagAPI = void 0;
var ComponentLogger_1 = require("../diag/ComponentLogger");
var logLevelLogger_1 = require("../diag/internal/logLevelLogger");
var types_1 = require("../diag/types");
var global_utils_1 = require("../internal/global-utils");
var API_NAME = 'diag';
/**
 * Singleton object which represents the entry point to the OpenTelemetry internal
 * diagnostic API
 */
var DiagAPI = /** @class */ (function () {
    /**
     * Private internal constructor
     * @private
     */
    function DiagAPI() {
        function _logProxy(funcName) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var logger = global_utils_1.getGlobal('diag');
                // shortcut if logger not set
                if (!logger)
                    return;
                return logger[funcName].apply(logger, args);
            };
        }
        // Using self local variable for minification purposes as 'this' cannot be minified
        var self = this;
        // DiagAPI specific functions
        self.setLogger = function (logger, logLevel) {
            var _a, _b;
            if (logLevel === void 0) { logLevel = types_1.DiagLogLevel.INFO; }
            if (logger === self) {
                // There isn't much we can do here.
                // Logging to the console might break the user application.
                // Try to log to self. If a logger was previously registered it will receive the log.
                var err = new Error('Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation');
                self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
                return false;
            }
            var oldLogger = global_utils_1.getGlobal('diag');
            var newLogger = logLevelLogger_1.createLogLevelDiagLogger(logLevel, logger);
            // There already is an logger registered. We'll let it know before overwriting it.
            if (oldLogger) {
                var stack = (_b = new Error().stack) !== null && _b !== void 0 ? _b : '<failed to generate stacktrace>';
                oldLogger.warn("Current logger will be overwritten from " + stack);
                newLogger.warn("Current logger will overwrite one already registered from " + stack);
            }
            return global_utils_1.registerGlobal('diag', newLogger, self, true);
        };
        self.disable = function () {
            global_utils_1.unregisterGlobal(API_NAME, self);
        };
        self.createComponentLogger = function (options) {
            return new ComponentLogger_1.DiagComponentLogger(options);
        };
        self.verbose = _logProxy('verbose');
        self.debug = _logProxy('debug');
        self.info = _logProxy('info');
        self.warn = _logProxy('warn');
        self.error = _logProxy('error');
    }
    /** Get the singleton instance of the DiagAPI API */
    DiagAPI.instance = function () {
        if (!this._instance) {
            this._instance = new DiagAPI();
        }
        return this._instance;
    };
    return DiagAPI;
}());
exports.DiagAPI = DiagAPI;

},{"../diag/ComponentLogger":28,"../diag/internal/logLevelLogger":31,"../diag/types":32,"../internal/global-utils":34}],16:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropagationAPI = void 0;
var global_utils_1 = require("../internal/global-utils");
var NoopTextMapPropagator_1 = require("../propagation/NoopTextMapPropagator");
var TextMapPropagator_1 = require("../propagation/TextMapPropagator");
var context_helpers_1 = require("../baggage/context-helpers");
var utils_1 = require("../baggage/utils");
var diag_1 = require("./diag");
var API_NAME = 'propagation';
var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator_1.NoopTextMapPropagator();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
 */
var PropagationAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function PropagationAPI() {
        this.createBaggage = utils_1.createBaggage;
        this.getBaggage = context_helpers_1.getBaggage;
        this.setBaggage = context_helpers_1.setBaggage;
        this.deleteBaggage = context_helpers_1.deleteBaggage;
    }
    /** Get the singleton instance of the Propagator API */
    PropagationAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new PropagationAPI();
        }
        return this._instance;
    };
    /**
     * Set the current propagator.
     *
     * @returns true if the propagator was successfully registered, else false
     */
    PropagationAPI.prototype.setGlobalPropagator = function (propagator) {
        return global_utils_1.registerGlobal(API_NAME, propagator, diag_1.DiagAPI.instance());
    };
    /**
     * Inject context into a carrier to be propagated inter-process
     *
     * @param context Context carrying tracing data to inject
     * @param carrier carrier to inject context into
     * @param setter Function used to set values on the carrier
     */
    PropagationAPI.prototype.inject = function (context, carrier, setter) {
        if (setter === void 0) { setter = TextMapPropagator_1.defaultTextMapSetter; }
        return this._getGlobalPropagator().inject(context, carrier, setter);
    };
    /**
     * Extract context from a carrier
     *
     * @param context Context which the newly created context will inherit from
     * @param carrier Carrier to extract context from
     * @param getter Function used to extract keys from a carrier
     */
    PropagationAPI.prototype.extract = function (context, carrier, getter) {
        if (getter === void 0) { getter = TextMapPropagator_1.defaultTextMapGetter; }
        return this._getGlobalPropagator().extract(context, carrier, getter);
    };
    /**
     * Return a list of all fields which may be used by the propagator.
     */
    PropagationAPI.prototype.fields = function () {
        return this._getGlobalPropagator().fields();
    };
    /** Remove the global propagator */
    PropagationAPI.prototype.disable = function () {
        global_utils_1.unregisterGlobal(API_NAME, diag_1.DiagAPI.instance());
    };
    PropagationAPI.prototype._getGlobalPropagator = function () {
        return global_utils_1.getGlobal(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
    };
    return PropagationAPI;
}());
exports.PropagationAPI = PropagationAPI;

},{"../baggage/context-helpers":18,"../baggage/utils":22,"../internal/global-utils":34,"../propagation/NoopTextMapPropagator":38,"../propagation/TextMapPropagator":39,"./diag":15}],17:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceAPI = void 0;
var global_utils_1 = require("../internal/global-utils");
var ProxyTracerProvider_1 = require("../trace/ProxyTracerProvider");
var spancontext_utils_1 = require("../trace/spancontext-utils");
var context_utils_1 = require("../trace/context-utils");
var diag_1 = require("./diag");
var API_NAME = 'trace';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Tracing API
 */
var TraceAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function TraceAPI() {
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
        this.wrapSpanContext = spancontext_utils_1.wrapSpanContext;
        this.isSpanContextValid = spancontext_utils_1.isSpanContextValid;
        this.deleteSpan = context_utils_1.deleteSpan;
        this.getSpan = context_utils_1.getSpan;
        this.getSpanContext = context_utils_1.getSpanContext;
        this.setSpan = context_utils_1.setSpan;
        this.setSpanContext = context_utils_1.setSpanContext;
    }
    /** Get the singleton instance of the Trace API */
    TraceAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new TraceAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global tracer.
     *
     * @returns true if the tracer provider was successfully registered, else false
     */
    TraceAPI.prototype.setGlobalTracerProvider = function (provider) {
        var success = global_utils_1.registerGlobal(API_NAME, this._proxyTracerProvider, diag_1.DiagAPI.instance());
        if (success) {
            this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
    };
    /**
     * Returns the global tracer provider.
     */
    TraceAPI.prototype.getTracerProvider = function () {
        return global_utils_1.getGlobal(API_NAME) || this._proxyTracerProvider;
    };
    /**
     * Returns a tracer from the global tracer provider.
     */
    TraceAPI.prototype.getTracer = function (name, version) {
        return this.getTracerProvider().getTracer(name, version);
    };
    /** Remove the global tracer provider */
    TraceAPI.prototype.disable = function () {
        global_utils_1.unregisterGlobal(API_NAME, diag_1.DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
    };
    return TraceAPI;
}());
exports.TraceAPI = TraceAPI;

},{"../internal/global-utils":34,"../trace/ProxyTracerProvider":44,"../trace/context-utils":49,"../trace/spancontext-utils":55,"./diag":15}],18:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBaggage = exports.setBaggage = exports.getBaggage = void 0;
var context_1 = require("../context/context");
/**
 * Baggage key
 */
var BAGGAGE_KEY = context_1.createContextKey('OpenTelemetry Baggage Key');
/**
 * Retrieve the current baggage from the given context
 *
 * @param {Context} Context that manage all context values
 * @returns {Baggage} Extracted baggage from the context
 */
function getBaggage(context) {
    return context.getValue(BAGGAGE_KEY) || undefined;
}
exports.getBaggage = getBaggage;
/**
 * Store a baggage in the given context
 *
 * @param {Context} Context that manage all context values
 * @param {Baggage} baggage that will be set in the actual context
 */
function setBaggage(context, baggage) {
    return context.setValue(BAGGAGE_KEY, baggage);
}
exports.setBaggage = setBaggage;
/**
 * Delete the baggage stored in the given context
 *
 * @param {Context} Context that manage all context values
 */
function deleteBaggage(context) {
    return context.deleteValue(BAGGAGE_KEY);
}
exports.deleteBaggage = deleteBaggage;

},{"../context/context":26}],19:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaggageImpl = void 0;
var BaggageImpl = /** @class */ (function () {
    function BaggageImpl(entries) {
        this._entries = entries ? new Map(entries) : new Map();
    }
    BaggageImpl.prototype.getEntry = function (key) {
        var entry = this._entries.get(key);
        if (!entry) {
            return undefined;
        }
        return Object.assign({}, entry);
    };
    BaggageImpl.prototype.getAllEntries = function () {
        return Array.from(this._entries.entries()).map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, v];
        });
    };
    BaggageImpl.prototype.setEntry = function (key, entry) {
        var newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
    };
    BaggageImpl.prototype.removeEntry = function (key) {
        var newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
    };
    BaggageImpl.prototype.removeEntries = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var newBaggage = new BaggageImpl(this._entries);
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var key = keys_1[_a];
            newBaggage._entries.delete(key);
        }
        return newBaggage;
    };
    BaggageImpl.prototype.clear = function () {
        return new BaggageImpl();
    };
    return BaggageImpl;
}());
exports.BaggageImpl = BaggageImpl;

},{}],20:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.baggageEntryMetadataSymbol = void 0;
/**
 * Symbol used to make BaggageEntryMetadata an opaque type
 */
exports.baggageEntryMetadataSymbol = Symbol('BaggageEntryMetadata');

},{}],21:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.baggageEntryMetadataFromString = exports.createBaggage = void 0;
var diag_1 = require("../api/diag");
var baggage_impl_1 = require("./internal/baggage-impl");
var symbol_1 = require("./internal/symbol");
var diag = diag_1.DiagAPI.instance();
/**
 * Create a new Baggage with optional entries
 *
 * @param entries An array of baggage entries the new baggage should contain
 */
function createBaggage(entries) {
    if (entries === void 0) { entries = {}; }
    return new baggage_impl_1.BaggageImpl(new Map(Object.entries(entries)));
}
exports.createBaggage = createBaggage;
/**
 * Create a serializable BaggageEntryMetadata object from a string.
 *
 * @param str string metadata. Format is currently not defined by the spec and has no special meaning.
 *
 */
function baggageEntryMetadataFromString(str) {
    if (typeof str !== 'string') {
        diag.error("Cannot create baggage metadata from unknown type: " + typeof str);
        str = '';
    }
    return {
        __TYPE__: symbol_1.baggageEntryMetadataSymbol,
        toString: function () {
            return str;
        },
    };
}
exports.baggageEntryMetadataFromString = baggageEntryMetadataFromString;

},{"../api/diag":15,"./internal/baggage-impl":19,"./internal/symbol":20}],23:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],25:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopContextManager = void 0;
var context_1 = require("./context");
var NoopContextManager = /** @class */ (function () {
    function NoopContextManager() {
    }
    NoopContextManager.prototype.active = function () {
        return context_1.ROOT_CONTEXT;
    };
    NoopContextManager.prototype.with = function (_context, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return fn.call.apply(fn, __spreadArray([thisArg], args));
    };
    NoopContextManager.prototype.bind = function (_context, target) {
        return target;
    };
    NoopContextManager.prototype.enable = function () {
        return this;
    };
    NoopContextManager.prototype.disable = function () {
        return this;
    };
    return NoopContextManager;
}());
exports.NoopContextManager = NoopContextManager;

},{"./context":26}],26:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROOT_CONTEXT = exports.createContextKey = void 0;
/** Get a key to uniquely identify a context value */
function createContextKey(description) {
    // The specification states that for the same input, multiple calls should
    // return different keys. Due to the nature of the JS dependency management
    // system, this creates problems where multiple versions of some package
    // could hold different keys for the same property.
    //
    // Therefore, we use Symbol.for which returns the same key for the same input.
    return Symbol.for(description);
}
exports.createContextKey = createContextKey;
var BaseContext = /** @class */ (function () {
    /**
     * Construct a new context which inherits values from an optional parent context.
     *
     * @param parentContext a context from which to inherit values
     */
    function BaseContext(parentContext) {
        // for minification
        var self = this;
        self._currentContext = parentContext ? new Map(parentContext) : new Map();
        self.getValue = function (key) { return self._currentContext.get(key); };
        self.setValue = function (key, value) {
            var context = new BaseContext(self._currentContext);
            context._currentContext.set(key, value);
            return context;
        };
        self.deleteValue = function (key) {
            var context = new BaseContext(self._currentContext);
            context._currentContext.delete(key);
            return context;
        };
    }
    return BaseContext;
}());
/** The root context is used as the default parent context when there is no active context */
exports.ROOT_CONTEXT = new BaseContext();

},{}],27:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],28:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagComponentLogger = void 0;
var global_utils_1 = require("../internal/global-utils");
/**
 * Component Logger which is meant to be used as part of any component which
 * will add automatically additional namespace in front of the log message.
 * It will then forward all message to global diag logger
 * @example
 * const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
 * cLogger.debug('test');
 * // @opentelemetry/instrumentation-http test
 */
var DiagComponentLogger = /** @class */ (function () {
    function DiagComponentLogger(props) {
        this._namespace = props.namespace || 'DiagComponentLogger';
    }
    DiagComponentLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('debug', this._namespace, args);
    };
    DiagComponentLogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('error', this._namespace, args);
    };
    DiagComponentLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('info', this._namespace, args);
    };
    DiagComponentLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('warn', this._namespace, args);
    };
    DiagComponentLogger.prototype.verbose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('verbose', this._namespace, args);
    };
    return DiagComponentLogger;
}());
exports.DiagComponentLogger = DiagComponentLogger;
function logProxy(funcName, namespace, args) {
    var logger = global_utils_1.getGlobal('diag');
    // shortcut if logger not set
    if (!logger) {
        return;
    }
    args.unshift(namespace);
    return logger[funcName].apply(logger, args);
}

},{"../internal/global-utils":34}],29:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagConsoleLogger = void 0;
var consoleMap = [
    { n: 'error', c: 'error' },
    { n: 'warn', c: 'warn' },
    { n: 'info', c: 'info' },
    { n: 'debug', c: 'debug' },
    { n: 'verbose', c: 'trace' },
];
/**
 * A simple Immutable Console based diagnostic logger which will output any messages to the Console.
 * If you want to limit the amount of logging to a specific level or lower use the
 * {@link createLogLevelDiagLogger}
 */
var DiagConsoleLogger = /** @class */ (function () {
    function DiagConsoleLogger() {
        function _consoleFunc(funcName) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (console) {
                    // Some environments only expose the console when the F12 developer console is open
                    // eslint-disable-next-line no-console
                    var theFunc = console[funcName];
                    if (typeof theFunc !== 'function') {
                        // Not all environments support all functions
                        // eslint-disable-next-line no-console
                        theFunc = console.log;
                    }
                    // One last final check
                    if (typeof theFunc === 'function') {
                        return theFunc.apply(console, args);
                    }
                }
            };
        }
        for (var i = 0; i < consoleMap.length; i++) {
            this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
        }
    }
    return DiagConsoleLogger;
}());
exports.DiagConsoleLogger = DiagConsoleLogger;

},{}],30:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./consoleLogger"), exports);
__exportStar(require("./types"), exports);

},{"./consoleLogger":29,"./types":32}],31:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogLevelDiagLogger = void 0;
var types_1 = require("../types");
function createLogLevelDiagLogger(maxLevel, logger) {
    if (maxLevel < types_1.DiagLogLevel.NONE) {
        maxLevel = types_1.DiagLogLevel.NONE;
    }
    else if (maxLevel > types_1.DiagLogLevel.ALL) {
        maxLevel = types_1.DiagLogLevel.ALL;
    }
    // In case the logger is null or undefined
    logger = logger || {};
    function _filterFunc(funcName, theLevel) {
        var theFunc = logger[funcName];
        if (typeof theFunc === 'function' && maxLevel >= theLevel) {
            return theFunc.bind(logger);
        }
        return function () { };
    }
    return {
        error: _filterFunc('error', types_1.DiagLogLevel.ERROR),
        warn: _filterFunc('warn', types_1.DiagLogLevel.WARN),
        info: _filterFunc('info', types_1.DiagLogLevel.INFO),
        debug: _filterFunc('debug', types_1.DiagLogLevel.DEBUG),
        verbose: _filterFunc('verbose', types_1.DiagLogLevel.VERBOSE),
    };
}
exports.createLogLevelDiagLogger = createLogLevelDiagLogger;

},{"../types":32}],32:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagLogLevel = void 0;
/**
 * Defines the available internal logging levels for the diagnostic logger, the numeric values
 * of the levels are defined to match the original values from the initial LogLevel to avoid
 * compatibility/migration issues for any implementation that assume the numeric ordering.
 */
var DiagLogLevel;
(function (DiagLogLevel) {
    /** Diagnostic Logging level setting to disable all logging (except and forced logs) */
    DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
    /** Identifies an error scenario */
    DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
    /** Identifies a warning scenario */
    DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
    /** General informational log message */
    DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
    /** General debug log message */
    DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
    /**
     * Detailed trace level logging should only be used for development, should only be set
     * in a development environment.
     */
    DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
    /** Used to set the logging level to include all logging */
    DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
})(DiagLogLevel = exports.DiagLogLevel || (exports.DiagLogLevel = {}));

},{}],33:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diag = exports.propagation = exports.trace = exports.context = exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = exports.isValidSpanId = exports.isValidTraceId = exports.isSpanContextValid = exports.baggageEntryMetadataFromString = void 0;
__exportStar(require("./baggage/types"), exports);
var utils_1 = require("./baggage/utils");
Object.defineProperty(exports, "baggageEntryMetadataFromString", { enumerable: true, get: function () { return utils_1.baggageEntryMetadataFromString; } });
__exportStar(require("./common/Exception"), exports);
__exportStar(require("./common/Time"), exports);
__exportStar(require("./diag"), exports);
__exportStar(require("./propagation/TextMapPropagator"), exports);
__exportStar(require("./trace/attributes"), exports);
__exportStar(require("./trace/link"), exports);
__exportStar(require("./trace/ProxyTracer"), exports);
__exportStar(require("./trace/ProxyTracerProvider"), exports);
__exportStar(require("./trace/Sampler"), exports);
__exportStar(require("./trace/SamplingResult"), exports);
__exportStar(require("./trace/span_context"), exports);
__exportStar(require("./trace/span_kind"), exports);
__exportStar(require("./trace/span"), exports);
__exportStar(require("./trace/SpanOptions"), exports);
__exportStar(require("./trace/status"), exports);
__exportStar(require("./trace/trace_flags"), exports);
__exportStar(require("./trace/trace_state"), exports);
__exportStar(require("./trace/tracer_provider"), exports);
__exportStar(require("./trace/tracer"), exports);
var spancontext_utils_1 = require("./trace/spancontext-utils");
Object.defineProperty(exports, "isSpanContextValid", { enumerable: true, get: function () { return spancontext_utils_1.isSpanContextValid; } });
Object.defineProperty(exports, "isValidTraceId", { enumerable: true, get: function () { return spancontext_utils_1.isValidTraceId; } });
Object.defineProperty(exports, "isValidSpanId", { enumerable: true, get: function () { return spancontext_utils_1.isValidSpanId; } });
var invalid_span_constants_1 = require("./trace/invalid-span-constants");
Object.defineProperty(exports, "INVALID_SPANID", { enumerable: true, get: function () { return invalid_span_constants_1.INVALID_SPANID; } });
Object.defineProperty(exports, "INVALID_TRACEID", { enumerable: true, get: function () { return invalid_span_constants_1.INVALID_TRACEID; } });
Object.defineProperty(exports, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function () { return invalid_span_constants_1.INVALID_SPAN_CONTEXT; } });
__exportStar(require("./context/context"), exports);
__exportStar(require("./context/types"), exports);
var context_1 = require("./api/context");
/** Entrypoint for context API */
exports.context = context_1.ContextAPI.getInstance();
var trace_1 = require("./api/trace");
/** Entrypoint for trace API */
exports.trace = trace_1.TraceAPI.getInstance();
var propagation_1 = require("./api/propagation");
/** Entrypoint for propagation API */
exports.propagation = propagation_1.PropagationAPI.getInstance();
var diag_1 = require("./api/diag");
/**
 * Entrypoint for Diag API.
 * Defines Diagnostic handler used for internal diagnostic logging operations.
 * The default provides a Noop DiagLogger implementation which may be changed via the
 * diag.setLogger(logger: DiagLogger) function.
 */
exports.diag = diag_1.DiagAPI.instance();
exports.default = {
    trace: exports.trace,
    context: exports.context,
    propagation: exports.propagation,
    diag: exports.diag,
};

},{"./api/context":14,"./api/diag":15,"./api/propagation":16,"./api/trace":17,"./baggage/types":21,"./baggage/utils":22,"./common/Exception":23,"./common/Time":24,"./context/context":26,"./context/types":27,"./diag":30,"./propagation/TextMapPropagator":39,"./trace/ProxyTracer":43,"./trace/ProxyTracerProvider":44,"./trace/Sampler":45,"./trace/SamplingResult":46,"./trace/SpanOptions":47,"./trace/attributes":48,"./trace/invalid-span-constants":50,"./trace/link":51,"./trace/span":52,"./trace/span_context":53,"./trace/span_kind":54,"./trace/spancontext-utils":55,"./trace/status":56,"./trace/trace_flags":57,"./trace/trace_state":58,"./trace/tracer":59,"./trace/tracer_provider":60}],34:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterGlobal = exports.getGlobal = exports.registerGlobal = void 0;
var platform_1 = require("../platform");
var version_1 = require("../version");
var semver_1 = require("./semver");
var major = version_1.VERSION.split('.')[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = platform_1._globalThis;
function registerGlobal(type, instance, diag, allowOverride) {
    var _a;
    if (allowOverride === void 0) { allowOverride = false; }
    var api = (_global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
        version: version_1.VERSION,
    });
    if (!allowOverride && api[type]) {
        // already registered an API of this type
        var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
        diag.error(err.stack || err.message);
        return false;
    }
    if (api.version !== version_1.VERSION) {
        // All registered APIs must be of the same version exactly
        var err = new Error('@opentelemetry/api: All API registration versions must match');
        diag.error(err.stack || err.message);
        return false;
    }
    api[type] = instance;
    diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + version_1.VERSION + ".");
    return true;
}
exports.registerGlobal = registerGlobal;
function getGlobal(type) {
    var _a, _b;
    var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
    if (!globalVersion || !semver_1.isCompatible(globalVersion)) {
        return;
    }
    return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
exports.getGlobal = getGlobal;
function unregisterGlobal(type, diag) {
    diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + version_1.VERSION + ".");
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api) {
        delete api[type];
    }
}
exports.unregisterGlobal = unregisterGlobal;

},{"../platform":37,"../version":61,"./semver":35}],35:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompatible = exports._makeCompatibilityCheck = void 0;
var version_1 = require("../version");
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
/**
 * Create a function to test an API version to see if it is compatible with the provided ownVersion.
 *
 * The returned function has the following semantics:
 * - Exact match is always compatible
 * - Major versions must match exactly
 *    - 1.x package cannot use global 2.x package
 *    - 2.x package cannot use global 1.x package
 * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
 *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
 *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
 * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
 * - Patch and build tag differences are not considered at this time
 *
 * @param ownVersion version which should be checked against
 */
function _makeCompatibilityCheck(ownVersion) {
    var acceptedVersions = new Set([ownVersion]);
    var rejectedVersions = new Set();
    var myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch) {
        // we cannot guarantee compatibility so we always return noop
        return function () { return false; };
    }
    var ownVersionParsed = {
        major: +myVersionMatch[1],
        minor: +myVersionMatch[2],
        patch: +myVersionMatch[3],
        prerelease: myVersionMatch[4],
    };
    // if ownVersion has a prerelease tag, versions must match exactly
    if (ownVersionParsed.prerelease != null) {
        return function isExactmatch(globalVersion) {
            return globalVersion === ownVersion;
        };
    }
    function _reject(v) {
        rejectedVersions.add(v);
        return false;
    }
    function _accept(v) {
        acceptedVersions.add(v);
        return true;
    }
    return function isCompatible(globalVersion) {
        if (acceptedVersions.has(globalVersion)) {
            return true;
        }
        if (rejectedVersions.has(globalVersion)) {
            return false;
        }
        var globalVersionMatch = globalVersion.match(re);
        if (!globalVersionMatch) {
            // cannot parse other version
            // we cannot guarantee compatibility so we always noop
            return _reject(globalVersion);
        }
        var globalVersionParsed = {
            major: +globalVersionMatch[1],
            minor: +globalVersionMatch[2],
            patch: +globalVersionMatch[3],
            prerelease: globalVersionMatch[4],
        };
        // if globalVersion has a prerelease tag, versions must match exactly
        if (globalVersionParsed.prerelease != null) {
            return _reject(globalVersion);
        }
        // major versions must match
        if (ownVersionParsed.major !== globalVersionParsed.major) {
            return _reject(globalVersion);
        }
        if (ownVersionParsed.major === 0) {
            if (ownVersionParsed.minor === globalVersionParsed.minor &&
                ownVersionParsed.patch <= globalVersionParsed.patch) {
                return _accept(globalVersion);
            }
            return _reject(globalVersion);
        }
        if (ownVersionParsed.minor <= globalVersionParsed.minor) {
            return _accept(globalVersion);
        }
        return _reject(globalVersion);
    };
}
exports._makeCompatibilityCheck = _makeCompatibilityCheck;
/**
 * Test an API version to see if it is compatible with this API.
 *
 * - Exact match is always compatible
 * - Major versions must match exactly
 *    - 1.x package cannot use global 2.x package
 *    - 2.x package cannot use global 1.x package
 * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
 *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
 *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
 * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
 * - Patch and build tag differences are not considered at this time
 *
 * @param version version of the API requesting an instance of the global API
 */
exports.isCompatible = _makeCompatibilityCheck(version_1.VERSION);

},{"../version":61}],36:[function(require,module,exports){
(function (global){(function (){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._globalThis = void 0;
// Updates to this file should also be replicated to @opentelemetry/api-metrics and
// @opentelemetry/core too.
/**
 * - globalThis (New standard)
 * - self (Will return the current window instance for supported browsers)
 * - window (fallback for older browser implementations)
 * - global (NodeJS implementation)
 * - <object> (When all else fails)
 */
/** only globals that common to node and browsers are allowed */
// eslint-disable-next-line node/no-unsupported-features/es-builtins, no-undef
exports._globalThis = typeof globalThis === 'object' ? globalThis :
    typeof self === 'object' ? self :
        typeof window === 'object' ? window :
            typeof global === 'object' ? global :
                {};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],37:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./globalThis":36,"dup":8}],38:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopTextMapPropagator = void 0;
/**
 * No-op implementations of {@link TextMapPropagator}.
 */
var NoopTextMapPropagator = /** @class */ (function () {
    function NoopTextMapPropagator() {
    }
    /** Noop inject function does nothing */
    NoopTextMapPropagator.prototype.inject = function (_context, _carrier) { };
    /** Noop extract function does nothing and returns the input context */
    NoopTextMapPropagator.prototype.extract = function (context, _carrier) {
        return context;
    };
    NoopTextMapPropagator.prototype.fields = function () {
        return [];
    };
    return NoopTextMapPropagator;
}());
exports.NoopTextMapPropagator = NoopTextMapPropagator;

},{}],39:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTextMapSetter = exports.defaultTextMapGetter = void 0;
exports.defaultTextMapGetter = {
    get: function (carrier, key) {
        if (carrier == null) {
            return undefined;
        }
        return carrier[key];
    },
    keys: function (carrier) {
        if (carrier == null) {
            return [];
        }
        return Object.keys(carrier);
    },
};
exports.defaultTextMapSetter = {
    set: function (carrier, key, value) {
        if (carrier == null) {
            return;
        }
        carrier[key] = value;
    },
};

},{}],40:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonRecordingSpan = void 0;
var invalid_span_constants_1 = require("./invalid-span-constants");
/**
 * The NonRecordingSpan is the default {@link Span} that is used when no Span
 * implementation is available. All operations are no-op including context
 * propagation.
 */
var NonRecordingSpan = /** @class */ (function () {
    function NonRecordingSpan(_spanContext) {
        if (_spanContext === void 0) { _spanContext = invalid_span_constants_1.INVALID_SPAN_CONTEXT; }
        this._spanContext = _spanContext;
    }
    // Returns a SpanContext.
    NonRecordingSpan.prototype.spanContext = function () {
        return this._spanContext;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setAttribute = function (_key, _value) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setAttributes = function (_attributes) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.addEvent = function (_name, _attributes) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setStatus = function (_status) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.updateName = function (_name) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.end = function (_endTime) { };
    // isRecording always returns false for NonRecordingSpan.
    NonRecordingSpan.prototype.isRecording = function () {
        return false;
    };
    // By default does nothing
    NonRecordingSpan.prototype.recordException = function (_exception, _time) { };
    return NonRecordingSpan;
}());
exports.NonRecordingSpan = NonRecordingSpan;

},{"./invalid-span-constants":50}],41:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopTracer = void 0;
var context_1 = require("../api/context");
var context_utils_1 = require("../trace/context-utils");
var NonRecordingSpan_1 = require("./NonRecordingSpan");
var spancontext_utils_1 = require("./spancontext-utils");
var context = context_1.ContextAPI.getInstance();
/**
 * No-op implementations of {@link Tracer}.
 */
var NoopTracer = /** @class */ (function () {
    function NoopTracer() {
    }
    // startSpan starts a noop span.
    NoopTracer.prototype.startSpan = function (name, options, context) {
        var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
            return new NonRecordingSpan_1.NonRecordingSpan();
        }
        var parentFromContext = context && context_utils_1.getSpanContext(context);
        if (isSpanContext(parentFromContext) &&
            spancontext_utils_1.isSpanContextValid(parentFromContext)) {
            return new NonRecordingSpan_1.NonRecordingSpan(parentFromContext);
        }
        else {
            return new NonRecordingSpan_1.NonRecordingSpan();
        }
    };
    NoopTracer.prototype.startActiveSpan = function (name, arg2, arg3, arg4) {
        var opts;
        var ctx;
        var fn;
        if (arguments.length < 2) {
            return;
        }
        else if (arguments.length === 2) {
            fn = arg2;
        }
        else if (arguments.length === 3) {
            opts = arg2;
            fn = arg3;
        }
        else {
            opts = arg2;
            ctx = arg3;
            fn = arg4;
        }
        var parentContext = ctx !== null && ctx !== void 0 ? ctx : context.active();
        var span = this.startSpan(name, opts, parentContext);
        var contextWithSpanSet = context_utils_1.setSpan(parentContext, span);
        return context.with(contextWithSpanSet, fn, undefined, span);
    };
    return NoopTracer;
}());
exports.NoopTracer = NoopTracer;
function isSpanContext(spanContext) {
    return (typeof spanContext === 'object' &&
        typeof spanContext['spanId'] === 'string' &&
        typeof spanContext['traceId'] === 'string' &&
        typeof spanContext['traceFlags'] === 'number');
}

},{"../api/context":14,"../trace/context-utils":49,"./NonRecordingSpan":40,"./spancontext-utils":55}],42:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopTracerProvider = void 0;
var NoopTracer_1 = require("./NoopTracer");
/**
 * An implementation of the {@link TracerProvider} which returns an impotent
 * Tracer for all calls to `getTracer`.
 *
 * All operations are no-op.
 */
var NoopTracerProvider = /** @class */ (function () {
    function NoopTracerProvider() {
    }
    NoopTracerProvider.prototype.getTracer = function (_name, _version) {
        return new NoopTracer_1.NoopTracer();
    };
    return NoopTracerProvider;
}());
exports.NoopTracerProvider = NoopTracerProvider;

},{"./NoopTracer":41}],43:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyTracer = void 0;
var NoopTracer_1 = require("./NoopTracer");
var NOOP_TRACER = new NoopTracer_1.NoopTracer();
/**
 * Proxy tracer provided by the proxy tracer provider
 */
var ProxyTracer = /** @class */ (function () {
    function ProxyTracer(_provider, name, version) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
    }
    ProxyTracer.prototype.startSpan = function (name, options, context) {
        return this._getTracer().startSpan(name, options, context);
    };
    ProxyTracer.prototype.startActiveSpan = function (_name, _options, _context, _fn) {
        var tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
    };
    /**
     * Try to get a tracer from the proxy tracer provider.
     * If the proxy tracer provider has no delegate, return a noop tracer.
     */
    ProxyTracer.prototype._getTracer = function () {
        if (this._delegate) {
            return this._delegate;
        }
        var tracer = this._provider.getDelegateTracer(this.name, this.version);
        if (!tracer) {
            return NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
    };
    return ProxyTracer;
}());
exports.ProxyTracer = ProxyTracer;

},{"./NoopTracer":41}],44:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyTracerProvider = void 0;
var ProxyTracer_1 = require("./ProxyTracer");
var NoopTracerProvider_1 = require("./NoopTracerProvider");
var NOOP_TRACER_PROVIDER = new NoopTracerProvider_1.NoopTracerProvider();
/**
 * Tracer provider which provides {@link ProxyTracer}s.
 *
 * Before a delegate is set, tracers provided are NoOp.
 *   When a delegate is set, traces are provided from the delegate.
 *   When a delegate is set after tracers have already been provided,
 *   all tracers already provided will use the provided delegate implementation.
 */
var ProxyTracerProvider = /** @class */ (function () {
    function ProxyTracerProvider() {
    }
    /**
     * Get a {@link ProxyTracer}
     */
    ProxyTracerProvider.prototype.getTracer = function (name, version) {
        var _a;
        return ((_a = this.getDelegateTracer(name, version)) !== null && _a !== void 0 ? _a : new ProxyTracer_1.ProxyTracer(this, name, version));
    };
    ProxyTracerProvider.prototype.getDelegate = function () {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
    };
    /**
     * Set the delegate tracer provider
     */
    ProxyTracerProvider.prototype.setDelegate = function (delegate) {
        this._delegate = delegate;
    };
    ProxyTracerProvider.prototype.getDelegateTracer = function (name, version) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version);
    };
    return ProxyTracerProvider;
}());
exports.ProxyTracerProvider = ProxyTracerProvider;

},{"./NoopTracerProvider":42,"./ProxyTracer":43}],45:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamplingDecision = void 0;
/**
 * A sampling decision that determines how a {@link Span} will be recorded
 * and collected.
 */
var SamplingDecision;
(function (SamplingDecision) {
    /**
     * `Span.isRecording() === false`, span will not be recorded and all events
     * and attributes will be dropped.
     */
    SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
    /**
     * `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
     * MUST NOT be set.
     */
    SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
    /**
     * `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
     * MUST be set.
     */
    SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
})(SamplingDecision = exports.SamplingDecision || (exports.SamplingDecision = {}));

},{}],47:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],48:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],49:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpanContext = exports.setSpanContext = exports.deleteSpan = exports.setSpan = exports.getSpan = void 0;
var context_1 = require("../context/context");
var NonRecordingSpan_1 = require("./NonRecordingSpan");
/**
 * span key
 */
var SPAN_KEY = context_1.createContextKey('OpenTelemetry Context Key SPAN');
/**
 * Return the span if one exists
 *
 * @param context context to get span from
 */
function getSpan(context) {
    return context.getValue(SPAN_KEY) || undefined;
}
exports.getSpan = getSpan;
/**
 * Set the span on a context
 *
 * @param context context to use as parent
 * @param span span to set active
 */
function setSpan(context, span) {
    return context.setValue(SPAN_KEY, span);
}
exports.setSpan = setSpan;
/**
 * Remove current span stored in the context
 *
 * @param context context to delete span from
 */
function deleteSpan(context) {
    return context.deleteValue(SPAN_KEY);
}
exports.deleteSpan = deleteSpan;
/**
 * Wrap span context in a NoopSpan and set as span in a new
 * context
 *
 * @param context context to set active span on
 * @param spanContext span context to be wrapped
 */
function setSpanContext(context, spanContext) {
    return setSpan(context, new NonRecordingSpan_1.NonRecordingSpan(spanContext));
}
exports.setSpanContext = setSpanContext;
/**
 * Get the span context of the span if it exists.
 *
 * @param context context to get values from
 */
function getSpanContext(context) {
    var _a;
    return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
}
exports.getSpanContext = getSpanContext;

},{"../context/context":26,"./NonRecordingSpan":40}],50:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = void 0;
var trace_flags_1 = require("./trace_flags");
exports.INVALID_SPANID = '0000000000000000';
exports.INVALID_TRACEID = '00000000000000000000000000000000';
exports.INVALID_SPAN_CONTEXT = {
    traceId: exports.INVALID_TRACEID,
    spanId: exports.INVALID_SPANID,
    traceFlags: trace_flags_1.TraceFlags.NONE,
};

},{"./trace_flags":57}],51:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],52:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],53:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanKind = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var SpanKind;
(function (SpanKind) {
    /** Default value. Indicates that the span is used internally. */
    SpanKind[SpanKind["INTERNAL"] = 0] = "INTERNAL";
    /**
     * Indicates that the span covers server-side handling of an RPC or other
     * remote request.
     */
    SpanKind[SpanKind["SERVER"] = 1] = "SERVER";
    /**
     * Indicates that the span covers the client-side wrapper around an RPC or
     * other remote request.
     */
    SpanKind[SpanKind["CLIENT"] = 2] = "CLIENT";
    /**
     * Indicates that the span describes producer sending a message to a
     * broker. Unlike client and server, there is no direct critical path latency
     * relationship between producer and consumer spans.
     */
    SpanKind[SpanKind["PRODUCER"] = 3] = "PRODUCER";
    /**
     * Indicates that the span describes consumer receiving a message from a
     * broker. Unlike client and server, there is no direct critical path latency
     * relationship between producer and consumer spans.
     */
    SpanKind[SpanKind["CONSUMER"] = 4] = "CONSUMER";
})(SpanKind = exports.SpanKind || (exports.SpanKind = {}));

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapSpanContext = exports.isSpanContextValid = exports.isValidSpanId = exports.isValidTraceId = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var invalid_span_constants_1 = require("./invalid-span-constants");
var NonRecordingSpan_1 = require("./NonRecordingSpan");
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
    return VALID_TRACEID_REGEX.test(traceId) && traceId !== invalid_span_constants_1.INVALID_TRACEID;
}
exports.isValidTraceId = isValidTraceId;
function isValidSpanId(spanId) {
    return VALID_SPANID_REGEX.test(spanId) && spanId !== invalid_span_constants_1.INVALID_SPANID;
}
exports.isValidSpanId = isValidSpanId;
/**
 * Returns true if this {@link SpanContext} is valid.
 * @return true if this {@link SpanContext} is valid.
 */
function isSpanContextValid(spanContext) {
    return (isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId));
}
exports.isSpanContextValid = isSpanContextValid;
/**
 * Wrap the given {@link SpanContext} in a new non-recording {@link Span}
 *
 * @param spanContext span context to be wrapped
 * @returns a new non-recording {@link Span} with the provided context
 */
function wrapSpanContext(spanContext) {
    return new NonRecordingSpan_1.NonRecordingSpan(spanContext);
}
exports.wrapSpanContext = wrapSpanContext;

},{"./NonRecordingSpan":40,"./invalid-span-constants":50}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanStatusCode = void 0;
/**
 * An enumeration of status codes.
 */
var SpanStatusCode;
(function (SpanStatusCode) {
    /**
     * The default status.
     */
    SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
    /**
     * The operation has been validated by an Application developer or
     * Operator to have completed successfully.
     */
    SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
    /**
     * The operation contains an error.
     */
    SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
})(SpanStatusCode = exports.SpanStatusCode || (exports.SpanStatusCode = {}));

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceFlags = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TraceFlags;
(function (TraceFlags) {
    /** Represents no flag set. */
    TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
    /** Bit to represent whether trace is sampled in trace flags. */
    TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags = exports.TraceFlags || (exports.TraceFlags = {}));

},{}],58:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],59:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],60:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],61:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
// this is autogenerated file, see scripts/version-update.js
exports.VERSION = '1.0.4';

},{}],62:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneContextManager = void 0;
const api_1 = require("@opentelemetry/api");
const util_1 = require("./util");
/* Key name to be used to save a context reference in Zone */
const ZONE_CONTEXT_KEY = 'OT_ZONE_CONTEXT';
/**
 * ZoneContextManager
 * This module provides an easy functionality for tracing action between asynchronous operations in web.
 * It was not possible with standard [StackContextManager]{@link https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-sdk-trace-web/src/StackContextManager.ts}.
 * It heavily depends on [zone.js]{@link https://www.npmjs.com/package/zone.js}.
 * It stores the information about context in zone. Each Context will have always new Zone;
 * It also supports binding a certain Span to a target that has "addEventListener" and "removeEventListener".
 * When this happens a new zone is being created and the provided Span is being assigned to this zone.
 */
class ZoneContextManager {
    constructor() {
        /**
         * whether the context manager is enabled or not
         */
        this._enabled = false;
        /**
         * Helps to create a unique name for the zones - part of zone name
         */
        this._zoneCounter = 0;
    }
    /**
     * Returns the active context from certain zone name
     * @param activeZone
     */
    _activeContextFromZone(activeZone) {
        return (activeZone && activeZone.get(ZONE_CONTEXT_KEY)) || api_1.ROOT_CONTEXT;
    }
    /**
     * @param context A context (span) to be executed within target function
     * @param target Function to be executed within the context
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    _bindFunction(context, target) {
        const manager = this;
        const contextWrapper = function (...args) {
            return manager.with(context, () => target.apply(this, args));
        };
        Object.defineProperty(contextWrapper, 'length', {
            enumerable: false,
            configurable: true,
            writable: false,
            value: target.length,
        });
        return contextWrapper;
    }
    /**
     * @param context A context (span) to be bind to target
     * @param obj target object on which the listeners will be patched
     */
    _bindListener(context, obj) {
        const target = obj;
        if (target.__ot_listeners !== undefined) {
            return obj;
        }
        target.__ot_listeners = {};
        if (typeof target.addEventListener === 'function') {
            target.addEventListener = this._patchAddEventListener(target, target.addEventListener, context);
        }
        if (typeof target.removeEventListener === 'function') {
            target.removeEventListener = this._patchRemoveEventListener(target, target.removeEventListener);
        }
        return obj;
    }
    /**
     * Creates a new unique zone name
     */
    _createZoneName() {
        this._zoneCounter++;
        const random = Math.random();
        return `${this._zoneCounter}-${random}`;
    }
    /**
     * Creates a new zone
     * @param zoneName zone name
     * @param context A context (span) to be bind with Zone
     */
    _createZone(zoneName, context) {
        return Zone.current.fork({
            name: zoneName,
            properties: {
                [ZONE_CONTEXT_KEY]: context,
            },
        });
    }
    /**
     * Returns the active zone
     */
    _getActiveZone() {
        return Zone.current;
    }
    /**
     * Patches addEventListener method
     * @param target any target that has "addEventListener" method
     * @param original reference to the patched method
     * @param [context] context to be bind to the listener
     */
    _patchAddEventListener(target, original, context) {
        const contextManager = this;
        return function (event, listener, opts) {
            if (target.__ot_listeners === undefined) {
                target.__ot_listeners = {};
            }
            let listeners = target.__ot_listeners[event];
            if (listeners === undefined) {
                listeners = new WeakMap();
                target.__ot_listeners[event] = listeners;
            }
            const patchedListener = contextManager.bind(context, listener);
            // store a weak reference of the user listener to ours
            listeners.set(listener, patchedListener);
            return original.call(this, event, patchedListener, opts);
        };
    }
    /**
     * Patches removeEventListener method
     * @param target any target that has "removeEventListener" method
     * @param original reference to the patched method
     */
    _patchRemoveEventListener(target, original) {
        return function (event, listener) {
            if (target.__ot_listeners === undefined ||
                target.__ot_listeners[event] === undefined) {
                return original.call(this, event, listener);
            }
            const events = target.__ot_listeners[event];
            const patchedListener = events.get(listener);
            events.delete(listener);
            return original.call(this, event, patchedListener || listener);
        };
    }
    /**
     * Returns the active context
     */
    active() {
        if (!this._enabled) {
            return api_1.ROOT_CONTEXT;
        }
        const activeZone = this._getActiveZone();
        const active = this._activeContextFromZone(activeZone);
        if (active) {
            return active;
        }
        return api_1.ROOT_CONTEXT;
    }
    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */
    bind(context, target) {
        // if no specific context to propagate is given, we use the current one
        if (context === undefined) {
            context = this.active();
        }
        if (typeof target === 'function') {
            return this._bindFunction(context, target);
        }
        else if (util_1.isListenerObject(target)) {
            this._bindListener(context, target);
        }
        return target;
    }
    /**
     * Disable the context manager (clears all the contexts)
     */
    disable() {
        this._enabled = false;
        return this;
    }
    /**
     * Enables the context manager and creates a default(root) context
     */
    enable() {
        this._enabled = true;
        return this;
    }
    /**
     * Calls the callback function [fn] with the provided [context].
     *     If [context] is undefined then it will use the active context.
     *     The context will be set as active
     * @param context A context (span) to be called with provided callback
     * @param fn Callback function
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    with(context, fn, thisArg, ...args) {
        const zoneName = this._createZoneName();
        const newZone = this._createZone(zoneName, context);
        return newZone.run(fn, thisArg, args);
    }
}
exports.ZoneContextManager = ZoneContextManager;

},{"./util":65,"@opentelemetry/api":33}],63:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ZoneContextManager"), exports);
__exportStar(require("./types"), exports);

},{"./ZoneContextManager":62,"./types":64}],64:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],65:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isListenerObject = void 0;
/**
 * check if an object has addEventListener and removeEventListener functions then it will return true
 * @param obj
 */
function isListenerObject(obj = {}) {
    return (typeof obj.addEventListener === 'function' &&
        typeof obj.removeEventListener === 'function');
}
exports.isListenerObject = isListenerObject;

},{}],66:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("@opentelemetry/context-zone-peer-dep"), exports);
require("zone.js");

},{"@opentelemetry/context-zone-peer-dep":63,"zone.js":389}],67:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./platform"), exports);
__exportStar(require("./zipkin"), exports);

},{"./platform":68,"./zipkin":73}],68:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./util"), exports);

},{"./util":69}],69:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareSend = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
/**
 * Prepares send function that will send spans to the remote Zipkin service.
 * @param urlStr - url to send spans
 * @param headers - headers
 * send
 */
function prepareSend(urlStr, headers) {
    let xhrHeaders;
    const useBeacon = typeof navigator.sendBeacon === 'function' && !headers;
    if (headers) {
        xhrHeaders = Object.assign({ Accept: 'application/json', 'Content-Type': 'application/json' }, headers);
    }
    /**
     * Send spans to the remote Zipkin service.
     */
    return function send(zipkinSpans, done) {
        if (zipkinSpans.length === 0) {
            api_1.diag.debug('Zipkin send with empty spans');
            return done({ code: core_1.ExportResultCode.SUCCESS });
        }
        const payload = JSON.stringify(zipkinSpans);
        if (useBeacon) {
            sendWithBeacon(payload, done, urlStr);
        }
        else {
            sendWithXhr(payload, done, urlStr, xhrHeaders);
        }
    };
}
exports.prepareSend = prepareSend;
/**
 * Sends data using beacon
 * @param data
 * @param done
 * @param urlStr
 */
function sendWithBeacon(data, done, urlStr) {
    if (navigator.sendBeacon(urlStr, data)) {
        api_1.diag.debug('sendBeacon - can send', data);
        done({ code: core_1.ExportResultCode.SUCCESS });
    }
    else {
        done({
            code: core_1.ExportResultCode.FAILED,
            error: new Error(`sendBeacon - cannot send ${data}`),
        });
    }
}
/**
 * Sends data using XMLHttpRequest
 * @param data
 * @param done
 * @param urlStr
 * @param xhrHeaders
 */
function sendWithXhr(data, done, urlStr, xhrHeaders = {}) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('POST', urlStr);
    Object.entries(xhrHeaders).forEach(([k, v]) => {
        xhr.setRequestHeader(k, v);
    });
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const statusCode = xhr.status || 0;
            api_1.diag.debug(`Zipkin response status code: ${statusCode}, body: ${data}`);
            if (xhr.status >= 200 && xhr.status < 400) {
                return done({ code: core_1.ExportResultCode.SUCCESS });
            }
            else {
                return done({
                    code: core_1.ExportResultCode.FAILED,
                    error: new Error(`Got unexpected status code from zipkin: ${xhr.status}`),
                });
            }
        }
    };
    xhr.onerror = msg => {
        core_1.globalErrorHandler(new Error(`Zipkin request error: ${msg}`));
        return done({ code: core_1.ExportResultCode.FAILED });
    };
    // Issue request to remote service
    api_1.diag.debug(`Zipkin request payload: ${data}`);
    xhr.send(data);
}

},{"@opentelemetry/api":33,"@opentelemetry/core":83}],70:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._toZipkinAnnotations = exports._toZipkinTags = exports.toZipkinSpan = exports.defaultStatusErrorTagName = exports.defaultStatusCodeTagName = void 0;
const api = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const zipkinTypes = require("./types");
const ZIPKIN_SPAN_KIND_MAPPING = {
    [api.SpanKind.CLIENT]: zipkinTypes.SpanKind.CLIENT,
    [api.SpanKind.SERVER]: zipkinTypes.SpanKind.SERVER,
    [api.SpanKind.CONSUMER]: zipkinTypes.SpanKind.CONSUMER,
    [api.SpanKind.PRODUCER]: zipkinTypes.SpanKind.PRODUCER,
    // When absent, the span is local.
    [api.SpanKind.INTERNAL]: undefined,
};
exports.defaultStatusCodeTagName = 'otel.status_code';
exports.defaultStatusErrorTagName = 'error';
/**
 * Translate OpenTelemetry ReadableSpan to ZipkinSpan format
 * @param span Span to be translated
 */
function toZipkinSpan(span, serviceName, statusCodeTagName, statusErrorTagName) {
    const zipkinSpan = {
        traceId: span.spanContext().traceId,
        parentId: span.parentSpanId,
        name: span.name,
        id: span.spanContext().spanId,
        kind: ZIPKIN_SPAN_KIND_MAPPING[span.kind],
        timestamp: core_1.hrTimeToMicroseconds(span.startTime),
        duration: core_1.hrTimeToMicroseconds(span.duration),
        localEndpoint: { serviceName },
        tags: _toZipkinTags(span.attributes, span.status, statusCodeTagName, statusErrorTagName, span.resource),
        annotations: span.events.length
            ? _toZipkinAnnotations(span.events)
            : undefined,
    };
    return zipkinSpan;
}
exports.toZipkinSpan = toZipkinSpan;
/** Converts OpenTelemetry SpanAttributes and SpanStatus to Zipkin Tags format. */
function _toZipkinTags(attributes, status, statusCodeTagName, statusErrorTagName, resource) {
    const tags = {};
    for (const key of Object.keys(attributes)) {
        tags[key] = String(attributes[key]);
    }
    if (status.code !== api.SpanStatusCode.UNSET) {
        tags[statusCodeTagName] = String(api.SpanStatusCode[status.code]);
    }
    if (status.code === api.SpanStatusCode.ERROR && status.message) {
        tags[statusErrorTagName] = status.message;
    }
    Object.keys(resource.attributes).forEach(name => (tags[name] = String(resource.attributes[name])));
    return tags;
}
exports._toZipkinTags = _toZipkinTags;
/**
 * Converts OpenTelemetry Events to Zipkin Annotations format.
 */
function _toZipkinAnnotations(events) {
    return events.map(event => ({
        timestamp: core_1.hrTimeToMicroseconds(event.time),
        value: event.name,
    }));
}
exports._toZipkinAnnotations = _toZipkinAnnotations;

},{"./types":71,"@opentelemetry/api":33,"@opentelemetry/core":83}],71:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanKind = void 0;
/**
 * When present, kind clarifies timestamp, duration and remoteEndpoint. When
 * absent, the span is local or incomplete. Unlike client and server, there
 * is no direct critical path latency relationship between producer and
 * consumer spans.
 * `CLIENT`
 *   timestamp is the moment a request was sent to the server.
 *   duration is the delay until a response or an error was received.
 *   remoteEndpoint is the server.
 * `SERVER`
 *   timestamp is the moment a client request was received.
 *   duration is the delay until a response was sent or an error.
 *   remoteEndpoint is the client.
 * `PRODUCER`
 *   timestamp is the moment a message was sent to a destination.
 *   duration is the delay sending the message, such as batching.
 *   remoteEndpoint is the broker.
 * `CONSUMER`
 *   timestamp is the moment a message was received from an origin.
 *   duration is the delay consuming the message, such as from backlog.
 *   remoteEndpoint - Represents the broker. Leave serviceName absent if unknown.
 */
var SpanKind;
(function (SpanKind) {
    SpanKind["CLIENT"] = "CLIENT";
    SpanKind["SERVER"] = "SERVER";
    SpanKind["CONSUMER"] = "CONSUMER";
    SpanKind["PRODUCER"] = "PRODUCER";
})(SpanKind = exports.SpanKind || (exports.SpanKind = {}));

},{}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareGetHeaders = void 0;
function prepareGetHeaders(getExportRequestHeaders) {
    return function () {
        return getExportRequestHeaders();
    };
}
exports.prepareGetHeaders = prepareGetHeaders;

},{}],73:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipkinExporter = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const index_1 = require("./platform/index");
const transform_1 = require("./transform");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const utils_1 = require("./utils");
/**
 * Zipkin Exporter
 */
class ZipkinExporter {
    constructor(config = {}) {
        this.DEFAULT_SERVICE_NAME = 'OpenTelemetry Service';
        this._sendingPromises = [];
        this._urlStr = config.url || core_1.getEnv().OTEL_EXPORTER_ZIPKIN_ENDPOINT;
        this._send = index_1.prepareSend(this._urlStr, config.headers);
        this._serviceName = config.serviceName;
        this._statusCodeTagName = config.statusCodeTagName || transform_1.defaultStatusCodeTagName;
        this._statusDescriptionTagName =
            config.statusDescriptionTagName || transform_1.defaultStatusErrorTagName;
        this._isShutdown = false;
        if (typeof config.getExportRequestHeaders === 'function') {
            this._getHeaders = utils_1.prepareGetHeaders(config.getExportRequestHeaders);
        }
        else {
            // noop
            this._beforeSend = function () { };
        }
    }
    /**
     * Export spans.
     */
    export(spans, resultCallback) {
        const serviceName = String(this._serviceName ||
            spans[0].resource.attributes[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] ||
            this.DEFAULT_SERVICE_NAME);
        api_1.diag.debug('Zipkin exporter export');
        if (this._isShutdown) {
            setTimeout(() => resultCallback({
                code: core_1.ExportResultCode.FAILED,
                error: new Error('Exporter has been shutdown'),
            }));
            return;
        }
        const promise = new Promise(resolve => {
            this._sendSpans(spans, serviceName, result => {
                resolve();
                resultCallback(result);
            });
        });
        this._sendingPromises.push(promise);
        const popPromise = () => {
            const index = this._sendingPromises.indexOf(promise);
            this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
    }
    /**
     * Shutdown exporter. Noop operation in this exporter.
     */
    shutdown() {
        api_1.diag.debug('Zipkin exporter shutdown');
        this._isShutdown = true;
        return new Promise((resolve, reject) => {
            Promise.all(this._sendingPromises).then(() => {
                resolve();
            }, reject);
        });
    }
    /**
     * if user defines getExportRequestHeaders in config then this will be called
     * everytime before send, otherwise it will be replaced with noop in
     * constructor
     * @default noop
     */
    _beforeSend() {
        if (this._getHeaders) {
            this._send = index_1.prepareSend(this._urlStr, this._getHeaders());
        }
    }
    /**
     * Transform spans and sends to Zipkin service.
     */
    _sendSpans(spans, serviceName, done) {
        const zipkinSpans = spans.map(span => transform_1.toZipkinSpan(span, String(span.attributes[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] ||
            span.resource.attributes[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] ||
            serviceName), this._statusCodeTagName, this._statusDescriptionTagName));
        this._beforeSend();
        return this._send(zipkinSpans, (result) => {
            if (done) {
                return done(result);
            }
        });
    }
}
exports.ZipkinExporter = ZipkinExporter;

},{"./platform/index":68,"./transform":70,"./utils":72,"@opentelemetry/api":33,"@opentelemetry/core":83,"@opentelemetry/semantic-conventions":383}],74:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportResultCode = void 0;
var ExportResultCode;
(function (ExportResultCode) {
    ExportResultCode[ExportResultCode["SUCCESS"] = 0] = "SUCCESS";
    ExportResultCode[ExportResultCode["FAILED"] = 1] = "FAILED";
})(ExportResultCode = exports.ExportResultCode || (exports.ExportResultCode = {}));

},{}],75:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BAGGAGE_MAX_TOTAL_LENGTH = exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = exports.BAGGAGE_MAX_NAME_VALUE_PAIRS = exports.BAGGAGE_HEADER = exports.BAGGAGE_ITEMS_SEPARATOR = exports.BAGGAGE_PROPERTIES_SEPARATOR = exports.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
exports.BAGGAGE_KEY_PAIR_SEPARATOR = '=';
exports.BAGGAGE_PROPERTIES_SEPARATOR = ';';
exports.BAGGAGE_ITEMS_SEPARATOR = ',';
// Name of the http header used to propagate the baggage
exports.BAGGAGE_HEADER = 'baggage';
// Maximum number of name-value pairs allowed by w3c spec
exports.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
// Maximum number of bytes per a single name-value pair allowed by w3c spec
exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
// Maximum total length of all name-value pairs allowed by w3c spec
exports.BAGGAGE_MAX_TOTAL_LENGTH = 8192;

},{}],76:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3CBaggagePropagator = void 0;
const api_1 = require("@opentelemetry/api");
const suppress_tracing_1 = require("../../trace/suppress-tracing");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
/**
 * Propagates {@link Baggage} through Context format propagation.
 *
 * Based on the Baggage specification:
 * https://w3c.github.io/baggage/
 */
class W3CBaggagePropagator {
    inject(context, carrier, setter) {
        const baggage = api_1.propagation.getBaggage(context);
        if (!baggage || suppress_tracing_1.isTracingSuppressed(context))
            return;
        const keyPairs = utils_1.getKeyPairs(baggage)
            .filter((pair) => {
            return pair.length <= constants_1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
        })
            .slice(0, constants_1.BAGGAGE_MAX_NAME_VALUE_PAIRS);
        const headerValue = utils_1.serializeKeyPairs(keyPairs);
        if (headerValue.length > 0) {
            setter.set(carrier, constants_1.BAGGAGE_HEADER, headerValue);
        }
    }
    extract(context, carrier, getter) {
        const headerValue = getter.get(carrier, constants_1.BAGGAGE_HEADER);
        if (!headerValue)
            return context;
        const baggage = {};
        if (headerValue.length === 0) {
            return context;
        }
        const pairs = headerValue.split(constants_1.BAGGAGE_ITEMS_SEPARATOR);
        pairs.forEach(entry => {
            const keyPair = utils_1.parsePairKeyValue(entry);
            if (keyPair) {
                const baggageEntry = { value: keyPair.value };
                if (keyPair.metadata) {
                    baggageEntry.metadata = keyPair.metadata;
                }
                baggage[keyPair.key] = baggageEntry;
            }
        });
        if (Object.entries(baggage).length === 0) {
            return context;
        }
        return api_1.propagation.setBaggage(context, api_1.propagation.createBaggage(baggage));
    }
    fields() {
        return [constants_1.BAGGAGE_HEADER];
    }
}
exports.W3CBaggagePropagator = W3CBaggagePropagator;

},{"../../trace/suppress-tracing":102,"../constants":75,"../utils":77,"@opentelemetry/api":33}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeyPairsIntoRecord = exports.parsePairKeyValue = exports.getKeyPairs = exports.serializeKeyPairs = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const api_1 = require("@opentelemetry/api");
const constants_1 = require("./constants");
function serializeKeyPairs(keyPairs) {
    return keyPairs.reduce((hValue, current) => {
        const value = `${hValue}${hValue !== '' ? constants_1.BAGGAGE_ITEMS_SEPARATOR : ''}${current}`;
        return value.length > constants_1.BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
    }, '');
}
exports.serializeKeyPairs = serializeKeyPairs;
function getKeyPairs(baggage) {
    return baggage
        .getAllEntries()
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`);
}
exports.getKeyPairs = getKeyPairs;
function parsePairKeyValue(entry) {
    const valueProps = entry.split(constants_1.BAGGAGE_PROPERTIES_SEPARATOR);
    if (valueProps.length <= 0)
        return;
    const keyPairPart = valueProps.shift();
    if (!keyPairPart)
        return;
    const keyPair = keyPairPart.split(constants_1.BAGGAGE_KEY_PAIR_SEPARATOR);
    if (keyPair.length !== 2)
        return;
    const key = decodeURIComponent(keyPair[0].trim());
    const value = decodeURIComponent(keyPair[1].trim());
    let metadata;
    if (valueProps.length > 0) {
        metadata = api_1.baggageEntryMetadataFromString(valueProps.join(constants_1.BAGGAGE_PROPERTIES_SEPARATOR));
    }
    return { key, value, metadata };
}
exports.parsePairKeyValue = parsePairKeyValue;
/**
 * Parse a string serialized in the baggage HTTP Format (without metadata):
 * https://github.com/w3c/baggage/blob/master/baggage/HTTP_HEADER_FORMAT.md
 */
function parseKeyPairsIntoRecord(value) {
    if (typeof value !== 'string' || value.length === 0)
        return {};
    return value
        .split(constants_1.BAGGAGE_ITEMS_SEPARATOR)
        .map(entry => {
        return parsePairKeyValue(entry);
    })
        .filter(keyPair => keyPair !== undefined && keyPair.value.length > 0)
        .reduce((headers, keyPair) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        headers[keyPair.key] = keyPair.value;
        return headers;
    }, {});
}
exports.parseKeyPairsIntoRecord = parseKeyPairsIntoRecord;

},{"./constants":75,"@opentelemetry/api":33}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAttributeValue = exports.sanitizeAttributes = void 0;
function sanitizeAttributes(attributes) {
    const out = {};
    if (attributes == null || typeof attributes !== 'object') {
        return out;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    for (const [k, v] of Object.entries(attributes)) {
        if (isAttributeValue(v)) {
            if (Array.isArray(v)) {
                out[k] = v.slice();
            }
            else {
                out[k] = v;
            }
        }
    }
    return out;
}
exports.sanitizeAttributes = sanitizeAttributes;
function isAttributeValue(val) {
    if (val == null) {
        return true;
    }
    if (Array.isArray(val)) {
        return isHomogeneousAttributeValueArray(val);
    }
    return isValidPrimitiveAttributeValue(val);
}
exports.isAttributeValue = isAttributeValue;
function isHomogeneousAttributeValueArray(arr) {
    let type;
    for (const element of arr) {
        // null/undefined elements are allowed
        if (element == null)
            continue;
        if (!type) {
            if (isValidPrimitiveAttributeValue(element)) {
                type = typeof element;
                continue;
            }
            // encountered an invalid primitive
            return false;
        }
        if (typeof element === type) {
            continue;
        }
        return false;
    }
    return true;
}
function isValidPrimitiveAttributeValue(val) {
    switch (typeof val) {
        case 'number':
            return true;
        case 'boolean':
            return true;
        case 'string':
            return true;
    }
    return false;
}

},{}],79:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.setGlobalErrorHandler = void 0;
const logging_error_handler_1 = require("./logging-error-handler");
/** The global error handler delegate */
let delegateHandler = logging_error_handler_1.loggingErrorHandler();
/**
 * Set the global error handler
 * @param {ErrorHandler} handler
 */
function setGlobalErrorHandler(handler) {
    delegateHandler = handler;
}
exports.setGlobalErrorHandler = setGlobalErrorHandler;
/**
 * Return the global error handler
 * @param {Exception} ex
 */
function globalErrorHandler(ex) {
    try {
        delegateHandler(ex);
    }
    catch (_a) { } // eslint-disable-line no-empty
}
exports.globalErrorHandler = globalErrorHandler;

},{"./logging-error-handler":80}],80:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingErrorHandler = void 0;
const api_1 = require("@opentelemetry/api");
/**
 * Returns a function that logs an error using the provided logger, or a
 * console logger if one was not provided.
 */
function loggingErrorHandler() {
    return (ex) => {
        api_1.diag.error(stringifyException(ex));
    };
}
exports.loggingErrorHandler = loggingErrorHandler;
/**
 * Converts an exception into a string representation
 * @param {Exception} ex
 */
function stringifyException(ex) {
    if (typeof ex === 'string') {
        return ex;
    }
    else {
        return JSON.stringify(flattenException(ex));
    }
}
/**
 * Flattens an exception into key-value pairs by traversing the prototype chain
 * and coercing values to strings. Duplicate properties will not be overwritten;
 * the first insert wins.
 */
function flattenException(ex) {
    const result = {};
    let current = ex;
    while (current !== null) {
        Object.getOwnPropertyNames(current).forEach(propertyName => {
            if (result[propertyName])
                return;
            const value = current[propertyName];
            if (value) {
                result[propertyName] = String(value);
            }
        });
        current = Object.getPrototypeOf(current);
    }
    return result;
}

},{"@opentelemetry/api":33}],81:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTimeInput = exports.isTimeInputHrTime = exports.hrTimeToMicroseconds = exports.hrTimeToMilliseconds = exports.hrTimeToNanoseconds = exports.hrTimeToTimeStamp = exports.hrTimeDuration = exports.timeInputToHrTime = exports.hrTime = void 0;
const platform_1 = require("../platform");
const NANOSECOND_DIGITS = 9;
const SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
/**
 * Converts a number to HrTime, HrTime = [number, number].
 * The first number is UNIX Epoch time in seconds since 00:00:00 UTC on 1 January 1970.
 * The second number represents the partial second elapsed since Unix Epoch time represented by first number in nanoseconds.
 * For example, 2021-01-01T12:30:10.150Z in UNIX Epoch time in milliseconds is represented as 1609504210150.
 * numberToHrtime calculates the first number by converting and truncating the Epoch time in milliseconds to seconds:
 * HrTime[0] = Math.trunc(1609504210150 / 1000) = 1609504210.
 * numberToHrtime calculates the second number by converting the digits after the decimal point of the subtraction, (1609504210150 / 1000) - HrTime[0], to nanoseconds:
 * HrTime[1] = Number((1609504210.150 - HrTime[0]).toFixed(9)) * SECOND_TO_NANOSECONDS = 150000000.
 * This is represented in HrTime format as [1609504210, 150000000].
 * @param epochMillis
 */
function numberToHrtime(epochMillis) {
    const epochSeconds = epochMillis / 1000;
    // Decimals only.
    const seconds = Math.trunc(epochSeconds);
    // Round sub-nanosecond accuracy to nanosecond.
    const nanos = Number((epochSeconds - seconds).toFixed(NANOSECOND_DIGITS)) *
        SECOND_TO_NANOSECONDS;
    return [seconds, nanos];
}
function getTimeOrigin() {
    let timeOrigin = platform_1.otperformance.timeOrigin;
    if (typeof timeOrigin !== 'number') {
        const perf = platform_1.otperformance;
        timeOrigin = perf.timing && perf.timing.fetchStart;
    }
    return timeOrigin;
}
/**
 * Returns an hrtime calculated via performance component.
 * @param performanceNow
 */
function hrTime(performanceNow) {
    const timeOrigin = numberToHrtime(getTimeOrigin());
    const now = numberToHrtime(typeof performanceNow === 'number' ? performanceNow : platform_1.otperformance.now());
    let seconds = timeOrigin[0] + now[0];
    let nanos = timeOrigin[1] + now[1];
    // Nanoseconds
    if (nanos > SECOND_TO_NANOSECONDS) {
        nanos -= SECOND_TO_NANOSECONDS;
        seconds += 1;
    }
    return [seconds, nanos];
}
exports.hrTime = hrTime;
/**
 *
 * Converts a TimeInput to an HrTime, defaults to _hrtime().
 * @param time
 */
function timeInputToHrTime(time) {
    // process.hrtime
    if (isTimeInputHrTime(time)) {
        return time;
    }
    else if (typeof time === 'number') {
        // Must be a performance.now() if it's smaller than process start time.
        if (time < getTimeOrigin()) {
            return hrTime(time);
        }
        else {
            // epoch milliseconds or performance.timeOrigin
            return numberToHrtime(time);
        }
    }
    else if (time instanceof Date) {
        return numberToHrtime(time.getTime());
    }
    else {
        throw TypeError('Invalid input type');
    }
}
exports.timeInputToHrTime = timeInputToHrTime;
/**
 * Returns a duration of two hrTime.
 * @param startTime
 * @param endTime
 */
function hrTimeDuration(startTime, endTime) {
    let seconds = endTime[0] - startTime[0];
    let nanos = endTime[1] - startTime[1];
    // overflow
    if (nanos < 0) {
        seconds -= 1;
        // negate
        nanos += SECOND_TO_NANOSECONDS;
    }
    return [seconds, nanos];
}
exports.hrTimeDuration = hrTimeDuration;
/**
 * Convert hrTime to timestamp, for example "2019-05-14T17:00:00.000123456Z"
 * @param time
 */
function hrTimeToTimeStamp(time) {
    const precision = NANOSECOND_DIGITS;
    const tmp = `${'0'.repeat(precision)}${time[1]}Z`;
    const nanoString = tmp.substr(tmp.length - precision - 1);
    const date = new Date(time[0] * 1000).toISOString();
    return date.replace('000Z', nanoString);
}
exports.hrTimeToTimeStamp = hrTimeToTimeStamp;
/**
 * Convert hrTime to nanoseconds.
 * @param time
 */
function hrTimeToNanoseconds(time) {
    return time[0] * SECOND_TO_NANOSECONDS + time[1];
}
exports.hrTimeToNanoseconds = hrTimeToNanoseconds;
/**
 * Convert hrTime to milliseconds.
 * @param time
 */
function hrTimeToMilliseconds(time) {
    return Math.round(time[0] * 1e3 + time[1] / 1e6);
}
exports.hrTimeToMilliseconds = hrTimeToMilliseconds;
/**
 * Convert hrTime to microseconds.
 * @param time
 */
function hrTimeToMicroseconds(time) {
    return Math.round(time[0] * 1e6 + time[1] / 1e3);
}
exports.hrTimeToMicroseconds = hrTimeToMicroseconds;
/**
 * check if time is HrTime
 * @param value
 */
function isTimeInputHrTime(value) {
    return (Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === 'number' &&
        typeof value[1] === 'number');
}
exports.isTimeInputHrTime = isTimeInputHrTime;
/**
 * check if input value is a correct types.TimeInput
 * @param value
 */
function isTimeInput(value) {
    return (isTimeInputHrTime(value) ||
        typeof value === 'number' ||
        value instanceof Date);
}
exports.isTimeInput = isTimeInput;

},{"../platform":89}],82:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],83:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baggageUtils = void 0;
__exportStar(require("./baggage/propagation/W3CBaggagePropagator"), exports);
__exportStar(require("./common/attributes"), exports);
__exportStar(require("./common/global-error-handler"), exports);
__exportStar(require("./common/logging-error-handler"), exports);
__exportStar(require("./common/time"), exports);
__exportStar(require("./common/types"), exports);
__exportStar(require("./ExportResult"), exports);
__exportStar(require("./version"), exports);
exports.baggageUtils = require("./baggage/utils");
__exportStar(require("./platform"), exports);
__exportStar(require("./propagation/composite"), exports);
__exportStar(require("./trace/W3CTraceContextPropagator"), exports);
__exportStar(require("./trace/IdGenerator"), exports);
__exportStar(require("./trace/rpc-metadata"), exports);
__exportStar(require("./trace/sampler/AlwaysOffSampler"), exports);
__exportStar(require("./trace/sampler/AlwaysOnSampler"), exports);
__exportStar(require("./trace/sampler/ParentBasedSampler"), exports);
__exportStar(require("./trace/sampler/TraceIdRatioBasedSampler"), exports);
__exportStar(require("./trace/suppress-tracing"), exports);
__exportStar(require("./trace/TraceState"), exports);
__exportStar(require("./utils/environment"), exports);
__exportStar(require("./utils/merge"), exports);
__exportStar(require("./utils/sampling"), exports);
__exportStar(require("./utils/url"), exports);
__exportStar(require("./utils/wrap"), exports);
__exportStar(require("./version"), exports);

},{"./ExportResult":74,"./baggage/propagation/W3CBaggagePropagator":76,"./baggage/utils":77,"./common/attributes":78,"./common/global-error-handler":79,"./common/logging-error-handler":80,"./common/time":81,"./common/types":82,"./platform":89,"./propagation/composite":93,"./trace/IdGenerator":94,"./trace/TraceState":95,"./trace/W3CTraceContextPropagator":96,"./trace/rpc-metadata":97,"./trace/sampler/AlwaysOffSampler":98,"./trace/sampler/AlwaysOnSampler":99,"./trace/sampler/ParentBasedSampler":100,"./trace/sampler/TraceIdRatioBasedSampler":101,"./trace/suppress-tracing":102,"./utils/environment":103,"./utils/merge":105,"./utils/sampling":106,"./utils/url":107,"./utils/wrap":108,"./version":109}],84:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateValue = exports.validateKey = void 0;
const VALID_KEY_CHAR_RANGE = '[_0-9a-z-*/]';
const VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
const VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
const VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
const VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
const INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
/**
 * Key is opaque string up to 256 characters printable. It MUST begin with a
 * lowercase letter, and can only contain lowercase letters a-z, digits 0-9,
 * underscores _, dashes -, asterisks *, and forward slashes /.
 * For multi-tenant vendor scenarios, an at sign (@) can be used to prefix the
 * vendor name. Vendors SHOULD set the tenant ID at the beginning of the key.
 * see https://www.w3.org/TR/trace-context/#key
 */
function validateKey(key) {
    return VALID_KEY_REGEX.test(key);
}
exports.validateKey = validateKey;
/**
 * Value is opaque string up to 256 characters printable ASCII RFC0020
 * characters (i.e., the range 0x20 to 0x7E) except comma , and =.
 */
function validateValue(value) {
    return (VALID_VALUE_BASE_REGEX.test(value) &&
        !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value));
}
exports.validateValue = validateValue;

},{}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomIdGenerator = void 0;
const SPAN_ID_BYTES = 8;
const TRACE_ID_BYTES = 16;
class RandomIdGenerator {
    constructor() {
        /**
         * Returns a random 16-byte trace ID formatted/encoded as a 32 lowercase hex
         * characters corresponding to 128 bits.
         */
        this.generateTraceId = getIdGenerator(TRACE_ID_BYTES);
        /**
         * Returns a random 8-byte span ID formatted/encoded as a 16 lowercase hex
         * characters corresponding to 64 bits.
         */
        this.generateSpanId = getIdGenerator(SPAN_ID_BYTES);
    }
}
exports.RandomIdGenerator = RandomIdGenerator;
const SHARED_CHAR_CODES_ARRAY = Array(32);
function getIdGenerator(bytes) {
    return function generateId() {
        for (let i = 0; i < bytes * 2; i++) {
            SHARED_CHAR_CODES_ARRAY[i] = Math.floor(Math.random() * 16) + 48;
            // valid hex characters in the range 48-57 and 97-102
            if (SHARED_CHAR_CODES_ARRAY[i] >= 58) {
                SHARED_CHAR_CODES_ARRAY[i] += 39;
            }
        }
        return String.fromCharCode.apply(null, SHARED_CHAR_CODES_ARRAY.slice(0, bytes * 2));
    };
}

},{}],86:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const environment_1 = require("../../utils/environment");
const globalThis_1 = require("./globalThis");
/**
 * Gets the environment variables
 */
function getEnv() {
    const globalEnv = environment_1.parseEnvironment(globalThis_1._globalThis);
    return Object.assign({}, environment_1.DEFAULT_ENVIRONMENT, globalEnv);
}
exports.getEnv = getEnv;

},{"../../utils/environment":103,"./globalThis":87}],87:[function(require,module,exports){
(function (global){(function (){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._globalThis = void 0;
// Updates to this file should also be replicated to @opentelemetry/api and
// @opentelemetry/api-metrics too.
/**
 * - globalThis (New standard)
 * - self (Will return the current window instance for supported browsers)
 * - window (fallback for older browser implementations)
 * - global (NodeJS implementation)
 * - <object> (When all else fails)
 */
/** only globals that common to node and browsers are allowed */
// eslint-disable-next-line node/no-unsupported-features/es-builtins, no-undef
exports._globalThis = typeof globalThis === 'object' ? globalThis :
    typeof self === 'object' ? self :
        typeof window === 'object' ? window :
            typeof global === 'object' ? global :
                {};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBase64 = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function hexToBase64(hexStr) {
    const hexStrLen = hexStr.length;
    let hexAsciiCharsStr = '';
    for (let i = 0; i < hexStrLen; i += 2) {
        const hexPair = hexStr.substring(i, i + 2);
        const hexVal = parseInt(hexPair, 16);
        hexAsciiCharsStr += String.fromCharCode(hexVal);
    }
    return btoa(hexAsciiCharsStr);
}
exports.hexToBase64 = hexToBase64;

},{}],89:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./environment"), exports);
__exportStar(require("./globalThis"), exports);
__exportStar(require("./hex-to-base64"), exports);
__exportStar(require("./RandomIdGenerator"), exports);
__exportStar(require("./performance"), exports);
__exportStar(require("./sdk-info"), exports);
__exportStar(require("./timer-util"), exports);

},{"./RandomIdGenerator":85,"./environment":86,"./globalThis":87,"./hex-to-base64":88,"./performance":90,"./sdk-info":91,"./timer-util":92}],90:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.otperformance = void 0;
exports.otperformance = performance;

},{}],91:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDK_INFO = void 0;
const version_1 = require("../../version");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
/** Constants describing the SDK in use */
exports.SDK_INFO = {
    [semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_NAME]: 'opentelemetry',
    [semantic_conventions_1.SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'browser',
    [semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]: semantic_conventions_1.TelemetrySdkLanguageValues.WEBJS,
    [semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_VERSION]: version_1.VERSION,
};

},{"../../version":109,"@opentelemetry/semantic-conventions":383}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unrefTimer = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function unrefTimer(_timer) { }
exports.unrefTimer = unrefTimer;

},{}],93:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositePropagator = void 0;
const api_1 = require("@opentelemetry/api");
/** Combines multiple propagators into a single propagator. */
class CompositePropagator {
    /**
     * Construct a composite propagator from a list of propagators.
     *
     * @param [config] Configuration object for composite propagator
     */
    constructor(config = {}) {
        var _a;
        this._propagators = (_a = config.propagators) !== null && _a !== void 0 ? _a : [];
        this._fields = Array.from(new Set(this._propagators
            // older propagators may not have fields function, null check to be sure
            .map(p => (typeof p.fields === 'function' ? p.fields() : []))
            .reduce((x, y) => x.concat(y), [])));
    }
    /**
     * Run each of the configured propagators with the given context and carrier.
     * Propagators are run in the order they are configured, so if multiple
     * propagators write the same carrier key, the propagator later in the list
     * will "win".
     *
     * @param context Context to inject
     * @param carrier Carrier into which context will be injected
     */
    inject(context, carrier, setter) {
        for (const propagator of this._propagators) {
            try {
                propagator.inject(context, carrier, setter);
            }
            catch (err) {
                api_1.diag.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
            }
        }
    }
    /**
     * Run each of the configured propagators with the given context and carrier.
     * Propagators are run in the order they are configured, so if multiple
     * propagators write the same context key, the propagator later in the list
     * will "win".
     *
     * @param context Context to add values to
     * @param carrier Carrier from which to extract context
     */
    extract(context, carrier, getter) {
        return this._propagators.reduce((ctx, propagator) => {
            try {
                return propagator.extract(ctx, carrier, getter);
            }
            catch (err) {
                api_1.diag.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
            }
            return ctx;
        }, context);
    }
    fields() {
        // return a new array so our fields cannot be modified
        return this._fields.slice();
    }
}
exports.CompositePropagator = CompositePropagator;

},{"@opentelemetry/api":33}],94:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],95:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceState = void 0;
const validators_1 = require("../internal/validators");
const MAX_TRACE_STATE_ITEMS = 32;
const MAX_TRACE_STATE_LEN = 512;
const LIST_MEMBERS_SEPARATOR = ',';
const LIST_MEMBER_KEY_VALUE_SPLITTER = '=';
/**
 * TraceState must be a class and not a simple object type because of the spec
 * requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
 *
 * Here is the list of allowed mutations:
 * - New key-value pair should be added into the beginning of the list
 * - The value of any key can be updated. Modified keys MUST be moved to the
 * beginning of the list.
 */
class TraceState {
    constructor(rawTraceState) {
        this._internalState = new Map();
        if (rawTraceState)
            this._parse(rawTraceState);
    }
    set(key, value) {
        // TODO: Benchmark the different approaches(map vs list) and
        // use the faster one.
        const traceState = this._clone();
        if (traceState._internalState.has(key)) {
            traceState._internalState.delete(key);
        }
        traceState._internalState.set(key, value);
        return traceState;
    }
    unset(key) {
        const traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
    }
    get(key) {
        return this._internalState.get(key);
    }
    serialize() {
        return this._keys()
            .reduce((agg, key) => {
            agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
            return agg;
        }, [])
            .join(LIST_MEMBERS_SEPARATOR);
    }
    _parse(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN)
            return;
        this._internalState = rawTraceState
            .split(LIST_MEMBERS_SEPARATOR)
            .reverse() // Store in reverse so new keys (.set(...)) will be placed at the beginning
            .reduce((agg, part) => {
            const listMember = part.trim(); // Optional Whitespace (OWS) handling
            const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
            if (i !== -1) {
                const key = listMember.slice(0, i);
                const value = listMember.slice(i + 1, part.length);
                if (validators_1.validateKey(key) && validators_1.validateValue(value)) {
                    agg.set(key, value);
                }
                else {
                    // TODO: Consider to add warning log
                }
            }
            return agg;
        }, new Map());
        // Because of the reverse() requirement, trunc must be done after map is created
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
            this._internalState = new Map(Array.from(this._internalState.entries())
                .reverse() // Use reverse same as original tracestate parse chain
                .slice(0, MAX_TRACE_STATE_ITEMS));
        }
    }
    _keys() {
        return Array.from(this._internalState.keys()).reverse();
    }
    _clone() {
        const traceState = new TraceState();
        traceState._internalState = new Map(this._internalState);
        return traceState;
    }
}
exports.TraceState = TraceState;

},{"../internal/validators":84}],96:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3CTraceContextPropagator = exports.parseTraceParent = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = void 0;
const api_1 = require("@opentelemetry/api");
const suppress_tracing_1 = require("./suppress-tracing");
const TraceState_1 = require("./TraceState");
exports.TRACE_PARENT_HEADER = 'traceparent';
exports.TRACE_STATE_HEADER = 'tracestate';
const VERSION = '00';
const VERSION_PART = '(?!ff)[\\da-f]{2}';
const TRACE_ID_PART = '(?![0]{32})[\\da-f]{32}';
const PARENT_ID_PART = '(?![0]{16})[\\da-f]{16}';
const FLAGS_PART = '[\\da-f]{2}';
const TRACE_PARENT_REGEX = new RegExp(`^\\s?(${VERSION_PART})-(${TRACE_ID_PART})-(${PARENT_ID_PART})-(${FLAGS_PART})(-.*)?\\s?$`);
/**
 * Parses information from the [traceparent] span tag and converts it into {@link SpanContext}
 * @param traceParent - A meta property that comes from server.
 *     It should be dynamically generated server side to have the server's request trace Id,
 *     a parent span Id that was set on the server's request span,
 *     and the trace flags to indicate the server's sampling decision
 *     (01 = sampled, 00 = not sampled).
 *     for example: '{version}-{traceId}-{spanId}-{sampleDecision}'
 *     For more information see {@link https://www.w3.org/TR/trace-context/}
 */
function parseTraceParent(traceParent) {
    const match = TRACE_PARENT_REGEX.exec(traceParent);
    if (!match)
        return null;
    // According to the specification the implementation should be compatible
    // with future versions. If there are more parts, we only reject it if it's using version 00
    // See https://www.w3.org/TR/trace-context/#versioning-of-traceparent
    if (match[1] === '00' && match[5])
        return null;
    return {
        traceId: match[2],
        spanId: match[3],
        traceFlags: parseInt(match[4], 16),
    };
}
exports.parseTraceParent = parseTraceParent;
/**
 * Propagates {@link SpanContext} through Trace Context format propagation.
 *
 * Based on the Trace Context specification:
 * https://www.w3.org/TR/trace-context/
 */
class W3CTraceContextPropagator {
    inject(context, carrier, setter) {
        const spanContext = api_1.trace.getSpanContext(context);
        if (!spanContext ||
            suppress_tracing_1.isTracingSuppressed(context) ||
            !api_1.isSpanContextValid(spanContext))
            return;
        const traceParent = `${VERSION}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || api_1.TraceFlags.NONE).toString(16)}`;
        setter.set(carrier, exports.TRACE_PARENT_HEADER, traceParent);
        if (spanContext.traceState) {
            setter.set(carrier, exports.TRACE_STATE_HEADER, spanContext.traceState.serialize());
        }
    }
    extract(context, carrier, getter) {
        const traceParentHeader = getter.get(carrier, exports.TRACE_PARENT_HEADER);
        if (!traceParentHeader)
            return context;
        const traceParent = Array.isArray(traceParentHeader)
            ? traceParentHeader[0]
            : traceParentHeader;
        if (typeof traceParent !== 'string')
            return context;
        const spanContext = parseTraceParent(traceParent);
        if (!spanContext)
            return context;
        spanContext.isRemote = true;
        const traceStateHeader = getter.get(carrier, exports.TRACE_STATE_HEADER);
        if (traceStateHeader) {
            // If more than one `tracestate` header is found, we merge them into a
            // single header.
            const state = Array.isArray(traceStateHeader)
                ? traceStateHeader.join(',')
                : traceStateHeader;
            spanContext.traceState = new TraceState_1.TraceState(typeof state === 'string' ? state : undefined);
        }
        return api_1.trace.setSpanContext(context, spanContext);
    }
    fields() {
        return [exports.TRACE_PARENT_HEADER, exports.TRACE_STATE_HEADER];
    }
}
exports.W3CTraceContextPropagator = W3CTraceContextPropagator;

},{"./TraceState":95,"./suppress-tracing":102,"@opentelemetry/api":33}],97:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRPCMetadata = exports.deleteRPCMetadata = exports.setRPCMetadata = exports.RPCType = void 0;
const api_1 = require("@opentelemetry/api");
const RPC_METADATA_KEY = api_1.createContextKey('OpenTelemetry SDK Context Key RPC_METADATA');
var RPCType;
(function (RPCType) {
    RPCType["HTTP"] = "http";
})(RPCType = exports.RPCType || (exports.RPCType = {}));
function setRPCMetadata(context, meta) {
    return context.setValue(RPC_METADATA_KEY, meta);
}
exports.setRPCMetadata = setRPCMetadata;
function deleteRPCMetadata(context) {
    return context.deleteValue(RPC_METADATA_KEY);
}
exports.deleteRPCMetadata = deleteRPCMetadata;
function getRPCMetadata(context) {
    return context.getValue(RPC_METADATA_KEY);
}
exports.getRPCMetadata = getRPCMetadata;

},{"@opentelemetry/api":33}],98:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlwaysOffSampler = void 0;
const api_1 = require("@opentelemetry/api");
/** Sampler that samples no traces. */
class AlwaysOffSampler {
    shouldSample() {
        return {
            decision: api_1.SamplingDecision.NOT_RECORD,
        };
    }
    toString() {
        return 'AlwaysOffSampler';
    }
}
exports.AlwaysOffSampler = AlwaysOffSampler;

},{"@opentelemetry/api":33}],99:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlwaysOnSampler = void 0;
const api_1 = require("@opentelemetry/api");
/** Sampler that samples all traces. */
class AlwaysOnSampler {
    shouldSample() {
        return {
            decision: api_1.SamplingDecision.RECORD_AND_SAMPLED,
        };
    }
    toString() {
        return 'AlwaysOnSampler';
    }
}
exports.AlwaysOnSampler = AlwaysOnSampler;

},{"@opentelemetry/api":33}],100:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentBasedSampler = void 0;
const api_1 = require("@opentelemetry/api");
const global_error_handler_1 = require("../../common/global-error-handler");
const AlwaysOffSampler_1 = require("./AlwaysOffSampler");
const AlwaysOnSampler_1 = require("./AlwaysOnSampler");
/**
 * A composite sampler that either respects the parent span's sampling decision
 * or delegates to `delegateSampler` for root spans.
 */
class ParentBasedSampler {
    constructor(config) {
        var _a, _b, _c, _d;
        this._root = config.root;
        if (!this._root) {
            global_error_handler_1.globalErrorHandler(new Error('ParentBasedSampler must have a root sampler configured'));
            this._root = new AlwaysOnSampler_1.AlwaysOnSampler();
        }
        this._remoteParentSampled =
            (_a = config.remoteParentSampled) !== null && _a !== void 0 ? _a : new AlwaysOnSampler_1.AlwaysOnSampler();
        this._remoteParentNotSampled =
            (_b = config.remoteParentNotSampled) !== null && _b !== void 0 ? _b : new AlwaysOffSampler_1.AlwaysOffSampler();
        this._localParentSampled =
            (_c = config.localParentSampled) !== null && _c !== void 0 ? _c : new AlwaysOnSampler_1.AlwaysOnSampler();
        this._localParentNotSampled =
            (_d = config.localParentNotSampled) !== null && _d !== void 0 ? _d : new AlwaysOffSampler_1.AlwaysOffSampler();
    }
    shouldSample(context, traceId, spanName, spanKind, attributes, links) {
        const parentContext = api_1.trace.getSpanContext(context);
        if (!parentContext || !api_1.isSpanContextValid(parentContext)) {
            return this._root.shouldSample(context, traceId, spanName, spanKind, attributes, links);
        }
        if (parentContext.isRemote) {
            if (parentContext.traceFlags & api_1.TraceFlags.SAMPLED) {
                return this._remoteParentSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
            }
            return this._remoteParentNotSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
        }
        if (parentContext.traceFlags & api_1.TraceFlags.SAMPLED) {
            return this._localParentSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
        }
        return this._localParentNotSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
    }
    toString() {
        return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
    }
}
exports.ParentBasedSampler = ParentBasedSampler;

},{"../../common/global-error-handler":79,"./AlwaysOffSampler":98,"./AlwaysOnSampler":99,"@opentelemetry/api":33}],101:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceIdRatioBasedSampler = void 0;
const api_1 = require("@opentelemetry/api");
/** Sampler that samples a given fraction of traces based of trace id deterministically. */
class TraceIdRatioBasedSampler {
    constructor(_ratio = 0) {
        this._ratio = _ratio;
        this._ratio = this._normalize(_ratio);
        this._upperBound = Math.floor(this._ratio * 0xffffffff);
    }
    shouldSample(context, traceId) {
        return {
            decision: api_1.isValidTraceId(traceId) && this._accumulate(traceId) < this._upperBound
                ? api_1.SamplingDecision.RECORD_AND_SAMPLED
                : api_1.SamplingDecision.NOT_RECORD,
        };
    }
    toString() {
        return `TraceIdRatioBased{${this._ratio}}`;
    }
    _normalize(ratio) {
        if (typeof ratio !== 'number' || isNaN(ratio))
            return 0;
        return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
    }
    _accumulate(traceId) {
        let accumulation = 0;
        for (let i = 0; i < traceId.length / 8; i++) {
            const pos = i * 8;
            const part = parseInt(traceId.slice(pos, pos + 8), 16);
            accumulation = (accumulation ^ part) >>> 0;
        }
        return accumulation;
    }
}
exports.TraceIdRatioBasedSampler = TraceIdRatioBasedSampler;

},{"@opentelemetry/api":33}],102:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTracingSuppressed = exports.unsuppressTracing = exports.suppressTracing = void 0;
const api_1 = require("@opentelemetry/api");
const SUPPRESS_TRACING_KEY = api_1.createContextKey('OpenTelemetry SDK Context Key SUPPRESS_TRACING');
function suppressTracing(context) {
    return context.setValue(SUPPRESS_TRACING_KEY, true);
}
exports.suppressTracing = suppressTracing;
function unsuppressTracing(context) {
    return context.deleteValue(SUPPRESS_TRACING_KEY);
}
exports.unsuppressTracing = unsuppressTracing;
function isTracingSuppressed(context) {
    return context.getValue(SUPPRESS_TRACING_KEY) === true;
}
exports.isTracingSuppressed = isTracingSuppressed;

},{"@opentelemetry/api":33}],103:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEnvironment = exports.DEFAULT_ENVIRONMENT = exports.DEFAULT_ATTRIBUTE_COUNT_LIMIT = exports.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = void 0;
const api_1 = require("@opentelemetry/api");
const sampling_1 = require("./sampling");
const DEFAULT_LIST_SEPARATOR = ',';
/**
 * Environment interface to define all names
 */
const ENVIRONMENT_NUMBERS_KEYS = [
    'OTEL_BSP_EXPORT_TIMEOUT',
    'OTEL_BSP_MAX_EXPORT_BATCH_SIZE',
    'OTEL_BSP_MAX_QUEUE_SIZE',
    'OTEL_BSP_SCHEDULE_DELAY',
    'OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT',
    'OTEL_ATTRIBUTE_COUNT_LIMIT',
    'OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT',
    'OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT',
    'OTEL_SPAN_EVENT_COUNT_LIMIT',
    'OTEL_SPAN_LINK_COUNT_LIMIT',
];
function isEnvVarANumber(key) {
    return (ENVIRONMENT_NUMBERS_KEYS.indexOf(key) > -1);
}
const ENVIRONMENT_LISTS_KEYS = [
    'OTEL_NO_PATCH_MODULES',
    'OTEL_PROPAGATORS',
];
function isEnvVarAList(key) {
    return ENVIRONMENT_LISTS_KEYS.indexOf(key) > -1;
}
exports.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = Infinity;
exports.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
/**
 * Default environment variables
 */
exports.DEFAULT_ENVIRONMENT = {
    CONTAINER_NAME: '',
    ECS_CONTAINER_METADATA_URI_V4: '',
    ECS_CONTAINER_METADATA_URI: '',
    HOSTNAME: '',
    KUBERNETES_SERVICE_HOST: '',
    NAMESPACE: '',
    OTEL_BSP_EXPORT_TIMEOUT: 30000,
    OTEL_BSP_MAX_EXPORT_BATCH_SIZE: 512,
    OTEL_BSP_MAX_QUEUE_SIZE: 2048,
    OTEL_BSP_SCHEDULE_DELAY: 5000,
    OTEL_EXPORTER_JAEGER_AGENT_HOST: '',
    OTEL_EXPORTER_JAEGER_ENDPOINT: '',
    OTEL_EXPORTER_JAEGER_PASSWORD: '',
    OTEL_EXPORTER_JAEGER_USER: '',
    OTEL_EXPORTER_OTLP_ENDPOINT: '',
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: '',
    OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: '',
    OTEL_EXPORTER_OTLP_HEADERS: '',
    OTEL_EXPORTER_OTLP_TRACES_HEADERS: '',
    OTEL_EXPORTER_OTLP_METRICS_HEADERS: '',
    OTEL_EXPORTER_ZIPKIN_ENDPOINT: 'http://localhost:9411/api/v2/spans',
    OTEL_LOG_LEVEL: api_1.DiagLogLevel.INFO,
    OTEL_NO_PATCH_MODULES: [],
    OTEL_PROPAGATORS: ['tracecontext', 'baggage'],
    OTEL_RESOURCE_ATTRIBUTES: '',
    OTEL_SERVICE_NAME: '',
    OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT: exports.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
    OTEL_ATTRIBUTE_COUNT_LIMIT: exports.DEFAULT_ATTRIBUTE_COUNT_LIMIT,
    OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT: exports.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
    OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT: exports.DEFAULT_ATTRIBUTE_COUNT_LIMIT,
    OTEL_SPAN_EVENT_COUNT_LIMIT: 128,
    OTEL_SPAN_LINK_COUNT_LIMIT: 128,
    OTEL_TRACES_EXPORTER: 'none',
    OTEL_TRACES_SAMPLER: sampling_1.TracesSamplerValues.ParentBasedAlwaysOn,
    OTEL_TRACES_SAMPLER_ARG: '',
};
/**
 * Parses a variable as number with number validation
 * @param name
 * @param environment
 * @param values
 * @param min
 * @param max
 */
function parseNumber(name, environment, values, min = -Infinity, max = Infinity) {
    if (typeof values[name] !== 'undefined') {
        const value = Number(values[name]);
        if (!isNaN(value)) {
            if (value < min) {
                environment[name] = min;
            }
            else if (value > max) {
                environment[name] = max;
            }
            else {
                environment[name] = value;
            }
        }
    }
}
/**
 * Parses list-like strings from input into output.
 * @param name
 * @param environment
 * @param values
 * @param separator
 */
function parseStringList(name, output, input, separator = DEFAULT_LIST_SEPARATOR) {
    const givenValue = input[name];
    if (typeof givenValue === 'string') {
        output[name] = givenValue.split(separator).map(v => v.trim());
    }
}
// The support string -> DiagLogLevel mappings
const logLevelMap = {
    ALL: api_1.DiagLogLevel.ALL,
    VERBOSE: api_1.DiagLogLevel.VERBOSE,
    DEBUG: api_1.DiagLogLevel.DEBUG,
    INFO: api_1.DiagLogLevel.INFO,
    WARN: api_1.DiagLogLevel.WARN,
    ERROR: api_1.DiagLogLevel.ERROR,
    NONE: api_1.DiagLogLevel.NONE,
};
/**
 * Environmentally sets log level if valid log level string is provided
 * @param key
 * @param environment
 * @param values
 */
function setLogLevelFromEnv(key, environment, values) {
    const value = values[key];
    if (typeof value === 'string') {
        const theLevel = logLevelMap[value.toUpperCase()];
        if (theLevel != null) {
            environment[key] = theLevel;
        }
    }
}
/**
 * Parses environment values
 * @param values
 */
function parseEnvironment(values) {
    const environment = {};
    for (const env in exports.DEFAULT_ENVIRONMENT) {
        const key = env;
        switch (key) {
            case 'OTEL_LOG_LEVEL':
                setLogLevelFromEnv(key, environment, values);
                break;
            default:
                if (isEnvVarANumber(key)) {
                    parseNumber(key, environment, values);
                }
                else if (isEnvVarAList(key)) {
                    parseStringList(key, environment, values);
                }
                else {
                    const value = values[key];
                    if (typeof value !== 'undefined' && value !== null) {
                        environment[key] = String(value);
                    }
                }
        }
    }
    return environment;
}
exports.parseEnvironment = parseEnvironment;

},{"./sampling":106,"@opentelemetry/api":33}],104:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * based on lodash in order to support esm builds without esModuleInterop.
 * lodash is using MIT License.
 **/
const objectTag = '[object Object]';
const nullTag = '[object Null]';
const undefinedTag = '[object Undefined]';
const funcProto = Function.prototype;
const funcToString = funcProto.toString;
const objectCtorString = funcToString.call(Object);
const getPrototype = overArg(Object.getPrototypeOf, Object);
const objectProto = Object.prototype;
const hasOwnProperty = objectProto.hasOwnProperty;
const symToStringTag = Symbol ? Symbol.toStringTag : undefined;
const nativeObjectToString = objectProto.toString;
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
    return function (arg) {
        return func(transform(arg));
    };
}
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
        return false;
    }
    const proto = getPrototype(value);
    if (proto === null) {
        return true;
    }
    const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) === objectCtorString;
}
exports.isPlainObject = isPlainObject;
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
    return value != null && typeof value == 'object';
}
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
    if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
}
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
    const isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    let unmasked = false;
    try {
        value[symToStringTag] = undefined;
        unmasked = true;
    }
    catch (e) {
        // silence
    }
    const result = nativeObjectToString.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag] = tag;
        }
        else {
            delete value[symToStringTag];
        }
    }
    return result;
}
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
    return nativeObjectToString.call(value);
}

},{}],105:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const lodash_merge_1 = require("./lodash.merge");
const MAX_LEVEL = 20;
/**
 * Merges objects together
 * @param args - objects / values to be merged
 */
function merge(...args) {
    let result = args.shift();
    const objects = new WeakMap();
    while (args.length > 0) {
        result = mergeTwoObjects(result, args.shift(), 0, objects);
    }
    return result;
}
exports.merge = merge;
function takeValue(value) {
    if (isArray(value)) {
        return value.slice();
    }
    return value;
}
/**
 * Merges two objects
 * @param one - first object
 * @param two - second object
 * @param level - current deep level
 * @param objects - objects holder that has been already referenced - to prevent
 * cyclic dependency
 */
function mergeTwoObjects(one, two, level = 0, objects) {
    let result;
    if (level > MAX_LEVEL) {
        return undefined;
    }
    level++;
    if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
        result = takeValue(two);
    }
    else if (isArray(one)) {
        result = one.slice();
        if (isArray(two)) {
            for (let i = 0, j = two.length; i < j; i++) {
                result.push(takeValue(two[i]));
            }
        }
        else if (isObject(two)) {
            const keys = Object.keys(two);
            for (let i = 0, j = keys.length; i < j; i++) {
                const key = keys[i];
                result[key] = takeValue(two[key]);
            }
        }
    }
    else if (isObject(one)) {
        if (isObject(two)) {
            if (!shouldMerge(one, two)) {
                return two;
            }
            result = Object.assign({}, one);
            const keys = Object.keys(two);
            for (let i = 0, j = keys.length; i < j; i++) {
                const key = keys[i];
                const twoValue = two[key];
                if (isPrimitive(twoValue)) {
                    if (typeof twoValue === 'undefined') {
                        delete result[key];
                    }
                    else {
                        // result[key] = takeValue(twoValue);
                        result[key] = twoValue;
                    }
                }
                else {
                    const obj1 = result[key];
                    const obj2 = twoValue;
                    if (wasObjectReferenced(one, key, objects) ||
                        wasObjectReferenced(two, key, objects)) {
                        delete result[key];
                    }
                    else {
                        if (isObject(obj1) && isObject(obj2)) {
                            const arr1 = objects.get(obj1) || [];
                            const arr2 = objects.get(obj2) || [];
                            arr1.push({ obj: one, key });
                            arr2.push({ obj: two, key });
                            objects.set(obj1, arr1);
                            objects.set(obj2, arr2);
                        }
                        result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
                    }
                }
            }
        }
        else {
            result = two;
        }
    }
    return result;
}
/**
 * Function to check if object has been already reference
 * @param obj
 * @param key
 * @param objects
 */
function wasObjectReferenced(obj, key, objects) {
    const arr = objects.get(obj[key]) || [];
    for (let i = 0, j = arr.length; i < j; i++) {
        const info = arr[i];
        if (info.key === key && info.obj === obj) {
            return true;
        }
    }
    return false;
}
function isArray(value) {
    return Array.isArray(value);
}
function isFunction(value) {
    return typeof value === 'function';
}
function isObject(value) {
    return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === 'object';
}
function isPrimitive(value) {
    return typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined' ||
        value instanceof Date ||
        value instanceof RegExp ||
        value === null;
}
function shouldMerge(one, two) {
    if (!lodash_merge_1.isPlainObject(one) || !lodash_merge_1.isPlainObject(two)) {
        return false;
    }
    return true;
}

},{"./lodash.merge":104}],106:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracesSamplerValues = void 0;
var TracesSamplerValues;
(function (TracesSamplerValues) {
    TracesSamplerValues["AlwaysOff"] = "always_off";
    TracesSamplerValues["AlwaysOn"] = "always_on";
    TracesSamplerValues["ParentBasedAlwaysOff"] = "parentbased_always_off";
    TracesSamplerValues["ParentBasedAlwaysOn"] = "parentbased_always_on";
    TracesSamplerValues["ParentBasedTraceIdRatio"] = "parentbased_traceidratio";
    TracesSamplerValues["TraceIdRatio"] = "traceidratio";
})(TracesSamplerValues = exports.TracesSamplerValues || (exports.TracesSamplerValues = {}));

},{}],107:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrlIgnored = exports.urlMatches = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function urlMatches(url, urlToMatch) {
    if (typeof urlToMatch === 'string') {
        return url === urlToMatch;
    }
    else {
        return !!url.match(urlToMatch);
    }
}
exports.urlMatches = urlMatches;
/**
 * Check if {@param url} should be ignored when comparing against {@param ignoredUrls}
 * @param url
 * @param ignoredUrls
 */
function isUrlIgnored(url, ignoredUrls) {
    if (!ignoredUrls) {
        return false;
    }
    for (const ignoreUrl of ignoredUrls) {
        if (urlMatches(url, ignoreUrl)) {
            return true;
        }
    }
    return false;
}
exports.isUrlIgnored = isUrlIgnored;

},{}],108:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWrapped = void 0;
/**
 * Checks if certain function has been already wrapped
 * @param func
 */
function isWrapped(func) {
    return (typeof func === 'function' &&
        typeof func.__original === 'function' &&
        typeof func.__unwrap === 'function' &&
        func.__wrapped === true);
}
exports.isWrapped = isWrapped;

},{}],109:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
// this is autogenerated file, see scripts/version-update.js
exports.VERSION = '1.0.1';

},{}],110:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeNames = void 0;
var AttributeNames;
(function (AttributeNames) {
    AttributeNames["COMPONENT"] = "component";
    AttributeNames["DOCUMENT_LOAD"] = "documentLoad";
    AttributeNames["DOCUMENT_FETCH"] = "documentFetch";
    AttributeNames["RESOURCE_FETCH"] = "resourceFetch";
})(AttributeNames = exports.AttributeNames || (exports.AttributeNames = {}));

},{}],111:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNames = void 0;
var EventNames;
(function (EventNames) {
    EventNames["FIRST_PAINT"] = "firstPaint";
    EventNames["FIRST_CONTENTFUL_PAINT"] = "firstContentfulPaint";
})(EventNames = exports.EventNames || (exports.EventNames = {}));

},{}],112:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./instrumentation"), exports);

},{"./instrumentation":113}],113:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentLoadInstrumentation = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const AttributeNames_1 = require("./enums/AttributeNames");
const version_1 = require("./version");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const utils_1 = require("./utils");
/**
 * This class represents a document load plugin
 */
class DocumentLoadInstrumentation extends instrumentation_1.InstrumentationBase {
    /**
     *
     * @param config
     */
    constructor(config = {}) {
        super('@opentelemetry/instrumentation-document-load', version_1.VERSION, config);
        this.component = 'document-load';
        this.version = '1';
        this.moduleName = this.component;
    }
    init() { }
    /**
     * callback to be executed when page is loaded
     */
    _onDocumentLoaded() {
        // Timeout is needed as load event doesn't have yet the performance metrics for loadEnd.
        // Support for event "loadend" is very limited and cannot be used
        window.setTimeout(() => {
            this._collectPerformance();
        });
    }
    /**
     * Adds spans for all resources
     * @param rootSpan
     */
    _addResourcesSpans(rootSpan) {
        var _a, _b;
        const resources = (_b = (_a = core_1.otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a, 'resource');
        if (resources) {
            resources.forEach(resource => {
                this._initResourceSpan(resource, rootSpan);
            });
        }
    }
    /**
     * Collects information about performance and creates appropriate spans
     */
    _collectPerformance() {
        const metaElement = Array.from(document.getElementsByTagName('meta')).find(e => e.getAttribute('name') === core_1.TRACE_PARENT_HEADER);
        const entries = utils_1.getPerformanceNavigationEntries();
        const traceparent = (metaElement && metaElement.content) || '';
        api_1.context.with(api_1.propagation.extract(api_1.ROOT_CONTEXT, { traceparent }), () => {
            const rootSpan = this._startSpan(AttributeNames_1.AttributeNames.DOCUMENT_LOAD, sdk_trace_web_1.PerformanceTimingNames.FETCH_START, entries);
            if (!rootSpan) {
                return;
            }
            api_1.context.with(api_1.trace.setSpan(api_1.context.active(), rootSpan), () => {
                const fetchSpan = this._startSpan(AttributeNames_1.AttributeNames.DOCUMENT_FETCH, sdk_trace_web_1.PerformanceTimingNames.FETCH_START, entries);
                if (fetchSpan) {
                    api_1.context.with(api_1.trace.setSpan(api_1.context.active(), fetchSpan), () => {
                        sdk_trace_web_1.addSpanNetworkEvents(fetchSpan, entries);
                        this._endSpan(fetchSpan, sdk_trace_web_1.PerformanceTimingNames.RESPONSE_END, entries);
                    });
                }
            });
            rootSpan.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_URL, location.href);
            rootSpan.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_USER_AGENT, navigator.userAgent);
            this._addResourcesSpans(rootSpan);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.FETCH_START, entries);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.UNLOAD_EVENT_START, entries);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.UNLOAD_EVENT_END, entries);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.DOM_INTERACTIVE, entries);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.DOM_CONTENT_LOADED_EVENT_START, entries);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.DOM_CONTENT_LOADED_EVENT_END, entries);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.DOM_COMPLETE, entries);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.LOAD_EVENT_START, entries);
            sdk_trace_web_1.addSpanNetworkEvent(rootSpan, sdk_trace_web_1.PerformanceTimingNames.LOAD_EVENT_END, entries);
            utils_1.addSpanPerformancePaintEvents(rootSpan);
            this._endSpan(rootSpan, sdk_trace_web_1.PerformanceTimingNames.LOAD_EVENT_END, entries);
        });
    }
    /**
     * Helper function for ending span
     * @param span
     * @param performanceName name of performance entry for time end
     * @param entries
     */
    _endSpan(span, performanceName, entries) {
        // span can be undefined when entries are missing the certain performance - the span will not be created
        if (span) {
            if (sdk_trace_web_1.hasKey(entries, performanceName)) {
                span.end(entries[performanceName]);
            }
            else {
                // just end span
                span.end();
            }
        }
    }
    /**
     * Creates and ends a span with network information about resource added as timed events
     * @param resource
     * @param parentSpan
     */
    _initResourceSpan(resource, parentSpan) {
        const span = this._startSpan(AttributeNames_1.AttributeNames.RESOURCE_FETCH, sdk_trace_web_1.PerformanceTimingNames.FETCH_START, resource, parentSpan);
        if (span) {
            span.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_URL, resource.name);
            sdk_trace_web_1.addSpanNetworkEvents(span, resource);
            this._endSpan(span, sdk_trace_web_1.PerformanceTimingNames.RESPONSE_END, resource);
        }
    }
    /**
     * Helper function for starting a span
     * @param spanName name of span
     * @param performanceName name of performance entry for time start
     * @param entries
     * @param parentSpan
     */
    _startSpan(spanName, performanceName, entries, parentSpan) {
        if (sdk_trace_web_1.hasKey(entries, performanceName) &&
            typeof entries[performanceName] === 'number') {
            const span = this.tracer.startSpan(spanName, {
                startTime: entries[performanceName],
            }, parentSpan ? api_1.trace.setSpan(api_1.context.active(), parentSpan) : undefined);
            span.setAttribute(AttributeNames_1.AttributeNames.COMPONENT, this.component);
            return span;
        }
        return undefined;
    }
    /**
     * executes callback {_onDocumentLoaded} when the page is loaded
     */
    _waitForPageLoad() {
        if (window.document.readyState === 'complete') {
            this._onDocumentLoaded();
        }
        else {
            this._onDocumentLoaded = this._onDocumentLoaded.bind(this);
            window.addEventListener('load', this._onDocumentLoaded);
        }
    }
    /**
     * implements enable function
     */
    enable() {
        // remove previously attached load to avoid adding the same event twice
        // in case of multiple enable calling.
        window.removeEventListener('load', this._onDocumentLoaded);
        this._waitForPageLoad();
    }
    /**
     * implements disable function
     */
    disable() {
        window.removeEventListener('load', this._onDocumentLoaded);
    }
}
exports.DocumentLoadInstrumentation = DocumentLoadInstrumentation;

},{"./enums/AttributeNames":110,"./utils":114,"./version":115,"@opentelemetry/api":33,"@opentelemetry/core":125,"@opentelemetry/instrumentation":235,"@opentelemetry/sdk-trace-web":344,"@opentelemetry/semantic-conventions":383}],114:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSpanPerformancePaintEvents = exports.getPerformanceNavigationEntries = void 0;
const core_1 = require("@opentelemetry/core");
const sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
const EventNames_1 = require("./enums/EventNames");
const getPerformanceNavigationEntries = () => {
    var _a, _b;
    const entries = {};
    const performanceNavigationTiming = (_b = (_a = core_1.otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a, 'navigation')[0];
    if (performanceNavigationTiming) {
        const keys = Object.values(sdk_trace_web_1.PerformanceTimingNames);
        keys.forEach((key) => {
            if (sdk_trace_web_1.hasKey(performanceNavigationTiming, key)) {
                const value = performanceNavigationTiming[key];
                if (typeof value === 'number') {
                    entries[key] = value;
                }
            }
        });
    }
    else {
        // // fallback to previous version
        const perf = core_1.otperformance;
        const performanceTiming = perf.timing;
        if (performanceTiming) {
            const keys = Object.values(sdk_trace_web_1.PerformanceTimingNames);
            keys.forEach((key) => {
                if (sdk_trace_web_1.hasKey(performanceTiming, key)) {
                    const value = performanceTiming[key];
                    if (typeof value === 'number') {
                        entries[key] = value;
                    }
                }
            });
        }
    }
    return entries;
};
exports.getPerformanceNavigationEntries = getPerformanceNavigationEntries;
const performancePaintNames = {
    'first-paint': EventNames_1.EventNames.FIRST_PAINT,
    'first-contentful-paint': EventNames_1.EventNames.FIRST_CONTENTFUL_PAINT,
};
const addSpanPerformancePaintEvents = (span) => {
    var _a, _b;
    const performancePaintTiming = (_b = (_a = core_1.otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a, 'paint');
    if (performancePaintTiming) {
        performancePaintTiming.forEach(({ name, startTime }) => {
            if (sdk_trace_web_1.hasKey(performancePaintNames, name)) {
                span.addEvent(performancePaintNames[name], startTime);
            }
        });
    }
};
exports.addSpanPerformancePaintEvents = addSpanPerformancePaintEvents;

},{"./enums/EventNames":111,"@opentelemetry/core":125,"@opentelemetry/sdk-trace-web":344}],115:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
// this is autogenerated file, see scripts/version-update.js
exports.VERSION = '0.27.1';

},{}],116:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],117:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],118:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"../../trace/suppress-tracing":144,"../constants":117,"../utils":119,"@opentelemetry/api":33,"dup":76}],119:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./constants":117,"@opentelemetry/api":33,"dup":77}],120:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],121:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"./logging-error-handler":122,"dup":79}],122:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":80}],123:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"../platform":131,"dup":81}],124:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],125:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./ExportResult":116,"./baggage/propagation/W3CBaggagePropagator":118,"./baggage/utils":119,"./common/attributes":120,"./common/global-error-handler":121,"./common/logging-error-handler":122,"./common/time":123,"./common/types":124,"./platform":131,"./propagation/composite":135,"./trace/IdGenerator":136,"./trace/TraceState":137,"./trace/W3CTraceContextPropagator":138,"./trace/rpc-metadata":139,"./trace/sampler/AlwaysOffSampler":140,"./trace/sampler/AlwaysOnSampler":141,"./trace/sampler/ParentBasedSampler":142,"./trace/sampler/TraceIdRatioBasedSampler":143,"./trace/suppress-tracing":144,"./utils/environment":145,"./utils/merge":147,"./utils/sampling":148,"./utils/url":149,"./utils/wrap":150,"./version":151,"dup":83}],126:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],127:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"dup":85}],128:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"../../utils/environment":145,"./globalThis":129,"dup":86}],129:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],130:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"dup":88}],131:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./RandomIdGenerator":127,"./environment":128,"./globalThis":129,"./hex-to-base64":130,"./performance":132,"./sdk-info":133,"./timer-util":134,"dup":89}],132:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"dup":90}],133:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"../../version":151,"@opentelemetry/semantic-conventions":383,"dup":91}],134:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"dup":92}],135:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":93}],136:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"dup":94}],137:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"../internal/validators":126,"dup":95}],138:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./TraceState":137,"./suppress-tracing":144,"@opentelemetry/api":33,"dup":96}],139:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":97}],140:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":98}],141:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":99}],142:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"../../common/global-error-handler":121,"./AlwaysOffSampler":140,"./AlwaysOnSampler":141,"@opentelemetry/api":33,"dup":100}],143:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":101}],144:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":102}],145:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"./sampling":148,"@opentelemetry/api":33,"dup":103}],146:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104}],147:[function(require,module,exports){
arguments[4][105][0].apply(exports,arguments)
},{"./lodash.merge":146,"dup":105}],148:[function(require,module,exports){
arguments[4][106][0].apply(exports,arguments)
},{"dup":106}],149:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"dup":107}],150:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108}],151:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"dup":109}],152:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeNames = void 0;
var AttributeNames;
(function (AttributeNames) {
    AttributeNames["COMPONENT"] = "component";
    AttributeNames["EVENT_TYPE"] = "event_type";
    AttributeNames["TARGET_ELEMENT"] = "target_element";
    AttributeNames["TARGET_XPATH"] = "target_xpath";
    AttributeNames["HTTP_URL"] = "http.url";
    // NOT ON OFFICIAL SPEC
    AttributeNames["HTTP_USER_AGENT"] = "http.user_agent";
})(AttributeNames = exports.AttributeNames || (exports.AttributeNames = {}));

},{}],153:[function(require,module,exports){
arguments[4][112][0].apply(exports,arguments)
},{"./instrumentation":154,"dup":112}],154:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInteractionInstrumentation = void 0;
const instrumentation_1 = require("@opentelemetry/instrumentation");
const api = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
const AttributeNames_1 = require("./enums/AttributeNames");
const version_1 = require("./version");
const ZONE_CONTEXT_KEY = 'OT_ZONE_CONTEXT';
const EVENT_NAVIGATION_NAME = 'Navigation:';
const DEFAULT_EVENT_NAMES = ['click'];
function defaultShouldPreventSpanCreation() {
    return false;
}
/**
 * This class represents a UserInteraction plugin for auto instrumentation.
 * If zone.js is available then it patches the zone otherwise it patches
 * addEventListener of HTMLElement
 */
class UserInteractionInstrumentation extends instrumentation_1.InstrumentationBase {
    constructor(config) {
        var _a;
        super('@opentelemetry/instrumentation-user-interaction', version_1.VERSION, config);
        this.component = 'user-interaction';
        this.version = version_1.VERSION;
        this.moduleName = this.component;
        this._spansData = new WeakMap();
        // for addEventListener/removeEventListener state
        this._wrappedListeners = new WeakMap();
        // for event bubbling
        this._eventsSpanMap = new WeakMap();
        this._eventNames = new Set((_a = config === null || config === void 0 ? void 0 : config.eventNames) !== null && _a !== void 0 ? _a : DEFAULT_EVENT_NAMES);
        this._shouldPreventSpanCreation =
            typeof (config === null || config === void 0 ? void 0 : config.shouldPreventSpanCreation) === 'function'
                ? config.shouldPreventSpanCreation
                : defaultShouldPreventSpanCreation;
    }
    init() { }
    /**
     * This will check if last task was timeout and will save the time to
     * fix the user interaction when nothing happens
     * This timeout comes from xhr plugin which is needed to collect information
     * about last xhr main request from observer
     * @param task
     * @param span
     */
    _checkForTimeout(task, span) {
        const spanData = this._spansData.get(span);
        if (spanData) {
            if (task.source === 'setTimeout') {
                spanData.hrTimeLastTimeout = core_1.hrTime();
            }
            else if (task.source !== 'Promise.then' &&
                task.source !== 'setTimeout') {
                spanData.hrTimeLastTimeout = undefined;
            }
        }
    }
    /**
     * Controls whether or not to create a span, based on the event type.
     */
    _allowEventName(eventName) {
        return this._eventNames.has(eventName);
    }
    /**
     * Creates a new span
     * @param element
     * @param eventName
     */
    _createSpan(element, eventName, parentSpan) {
        if (!(element instanceof HTMLElement)) {
            return undefined;
        }
        if (!element.getAttribute) {
            return undefined;
        }
        if (element.hasAttribute('disabled')) {
            return undefined;
        }
        if (!this._allowEventName(eventName)) {
            return undefined;
        }
        const xpath = sdk_trace_web_1.getElementXPath(element, true);
        try {
            const span = this.tracer.startSpan(eventName, {
                attributes: {
                    [AttributeNames_1.AttributeNames.COMPONENT]: this.component,
                    [AttributeNames_1.AttributeNames.EVENT_TYPE]: eventName,
                    [AttributeNames_1.AttributeNames.TARGET_ELEMENT]: element.tagName,
                    [AttributeNames_1.AttributeNames.TARGET_XPATH]: xpath,
                    [AttributeNames_1.AttributeNames.HTTP_URL]: window.location.href,
                    [AttributeNames_1.AttributeNames.HTTP_USER_AGENT]: navigator.userAgent,
                },
            }, parentSpan
                ? api.trace.setSpan(api.context.active(), parentSpan)
                : undefined);
            if (this._shouldPreventSpanCreation(eventName, element, span) === true) {
                return undefined;
            }
            this._spansData.set(span, {
                taskCount: 0,
            });
            return span;
        }
        catch (e) {
            api.diag.error(this.component, e);
        }
        return undefined;
    }
    /**
     * Decrement number of tasks that left in zone,
     * This is needed to be able to end span when no more tasks left
     * @param span
     */
    _decrementTask(span) {
        const spanData = this._spansData.get(span);
        if (spanData) {
            spanData.taskCount--;
            if (spanData.taskCount === 0) {
                this._tryToEndSpan(span, spanData.hrTimeLastTimeout);
            }
        }
    }
    /**
     * Return the current span
     * @param zone
     * @private
     */
    _getCurrentSpan(zone) {
        const context = zone.get(ZONE_CONTEXT_KEY);
        if (context) {
            return api.trace.getSpan(context);
        }
        return context;
    }
    /**
     * Increment number of tasks that are run within the same zone.
     *     This is needed to be able to end span when no more tasks left
     * @param span
     */
    _incrementTask(span) {
        const spanData = this._spansData.get(span);
        if (spanData) {
            spanData.taskCount++;
        }
    }
    /**
     * Returns true iff we should use the patched callback; false if it's already been patched
     */
    addPatchedListener(on, type, listener, wrappedListener) {
        let listener2Type = this._wrappedListeners.get(listener);
        if (!listener2Type) {
            listener2Type = new Map();
            this._wrappedListeners.set(listener, listener2Type);
        }
        let element2patched = listener2Type.get(type);
        if (!element2patched) {
            element2patched = new Map();
            listener2Type.set(type, element2patched);
        }
        if (element2patched.has(on)) {
            return false;
        }
        element2patched.set(on, wrappedListener);
        return true;
    }
    /**
     * Returns the patched version of the callback (or undefined)
     */
    removePatchedListener(on, type, listener) {
        const listener2Type = this._wrappedListeners.get(listener);
        if (!listener2Type) {
            return undefined;
        }
        const element2patched = listener2Type.get(type);
        if (!element2patched) {
            return undefined;
        }
        const patched = element2patched.get(on);
        if (patched) {
            element2patched.delete(on);
            if (element2patched.size === 0) {
                listener2Type.delete(type);
                if (listener2Type.size === 0) {
                    this._wrappedListeners.delete(listener);
                }
            }
        }
        return patched;
    }
    // utility method to deal with the Function|EventListener nature of addEventListener
    _invokeListener(listener, target, args) {
        if (typeof listener === 'function') {
            return listener.apply(target, args);
        }
        else {
            return listener.handleEvent(args[0]);
        }
    }
    /**
     * This patches the addEventListener of HTMLElement to be able to
     * auto instrument the click events
     * This is done when zone is not available
     */
    _patchAddEventListener() {
        const plugin = this;
        return (original) => {
            return function addEventListenerPatched(type, listener, useCapture) {
                // Forward calls with listener = null
                if (!listener) {
                    return original.call(this, type, listener, useCapture);
                }
                const once = typeof useCapture === 'object' && useCapture.once;
                const patchedListener = function (...args) {
                    let parentSpan;
                    const event = args[0];
                    const target = event === null || event === void 0 ? void 0 : event.target;
                    if (event) {
                        parentSpan = plugin._eventsSpanMap.get(event);
                    }
                    if (once) {
                        plugin.removePatchedListener(this, type, listener);
                    }
                    const span = plugin._createSpan(target, type, parentSpan);
                    if (span) {
                        if (event) {
                            plugin._eventsSpanMap.set(event, span);
                        }
                        return api.context.with(api.trace.setSpan(api.context.active(), span), () => {
                            const result = plugin._invokeListener(listener, this, args);
                            // no zone so end span immediately
                            span.end();
                            return result;
                        });
                    }
                    else {
                        return plugin._invokeListener(listener, this, args);
                    }
                };
                if (plugin.addPatchedListener(this, type, listener, patchedListener)) {
                    return original.call(this, type, patchedListener, useCapture);
                }
            };
        };
    }
    /**
     * This patches the removeEventListener of HTMLElement to handle the fact that
     * we patched the original callbacks
     * This is done when zone is not available
     */
    _patchRemoveEventListener() {
        const plugin = this;
        return (original) => {
            return function removeEventListenerPatched(type, listener, useCapture) {
                const wrappedListener = plugin.removePatchedListener(this, type, listener);
                if (wrappedListener) {
                    return original.call(this, type, wrappedListener, useCapture);
                }
                else {
                    return original.call(this, type, listener, useCapture);
                }
            };
        };
    }
    /**
     * Most browser provide event listener api via EventTarget in prototype chain.
     * Exception to this is IE 11 which has it on the prototypes closest to EventTarget:
     *
     * * - has addEventListener in IE
     * ** - has addEventListener in all other browsers
     * ! - missing in IE
     *
     * HTMLElement -> Element -> Node * -> EventTarget **! -> Object
     * Document -> Node * -> EventTarget **! -> Object
     * Window * -> WindowProperties ! -> EventTarget **! -> Object
     */
    _getPatchableEventTargets() {
        return window.EventTarget
            ? [EventTarget.prototype]
            : [Node.prototype, Window.prototype];
    }
    /**
     * Patches the history api
     */
    _patchHistoryApi() {
        this._unpatchHistoryApi();
        this._wrap(history, 'replaceState', this._patchHistoryMethod());
        this._wrap(history, 'pushState', this._patchHistoryMethod());
        this._wrap(history, 'back', this._patchHistoryMethod());
        this._wrap(history, 'forward', this._patchHistoryMethod());
        this._wrap(history, 'go', this._patchHistoryMethod());
    }
    /**
     * Patches the certain history api method
     */
    _patchHistoryMethod() {
        const plugin = this;
        return (original) => {
            return function patchHistoryMethod(...args) {
                const url = `${location.pathname}${location.hash}${location.search}`;
                const result = original.apply(this, args);
                const urlAfter = `${location.pathname}${location.hash}${location.search}`;
                if (url !== urlAfter) {
                    plugin._updateInteractionName(urlAfter);
                }
                return result;
            };
        };
    }
    /**
     * unpatch the history api methods
     */
    _unpatchHistoryApi() {
        if (instrumentation_1.isWrapped(history.replaceState))
            this._unwrap(history, 'replaceState');
        if (instrumentation_1.isWrapped(history.pushState))
            this._unwrap(history, 'pushState');
        if (instrumentation_1.isWrapped(history.back))
            this._unwrap(history, 'back');
        if (instrumentation_1.isWrapped(history.forward))
            this._unwrap(history, 'forward');
        if (instrumentation_1.isWrapped(history.go))
            this._unwrap(history, 'go');
    }
    /**
     * Updates interaction span name
     * @param url
     */
    _updateInteractionName(url) {
        const span = api.trace.getSpan(api.context.active());
        if (span && typeof span.updateName === 'function') {
            span.updateName(`${EVENT_NAVIGATION_NAME} ${url}`);
        }
    }
    /**
     * Patches zone cancel task - this is done to be able to correctly
     * decrement the number of remaining tasks
     */
    _patchZoneCancelTask() {
        const plugin = this;
        return (original) => {
            return function patchCancelTask(task) {
                const currentZone = Zone.current;
                const currentSpan = plugin._getCurrentSpan(currentZone);
                if (currentSpan && plugin._shouldCountTask(task, currentZone)) {
                    plugin._decrementTask(currentSpan);
                }
                return original.call(this, task);
            };
        };
    }
    /**
     * Patches zone schedule task - this is done to be able to correctly
     * increment the number of tasks running within current zone but also to
     * save time in case of timeout running from xhr plugin when waiting for
     * main request from PerformanceResourceTiming
     */
    _patchZoneScheduleTask() {
        const plugin = this;
        return (original) => {
            return function patchScheduleTask(task) {
                const currentZone = Zone.current;
                const currentSpan = plugin._getCurrentSpan(currentZone);
                if (currentSpan && plugin._shouldCountTask(task, currentZone)) {
                    plugin._incrementTask(currentSpan);
                    plugin._checkForTimeout(task, currentSpan);
                }
                return original.call(this, task);
            };
        };
    }
    /**
     * Patches zone run task - this is done to be able to create a span when
     * user interaction starts
     * @private
     */
    _patchZoneRunTask() {
        const plugin = this;
        return (original) => {
            return function patchRunTask(task, applyThis, applyArgs) {
                const event = Array.isArray(applyArgs) && applyArgs[0] instanceof Event
                    ? applyArgs[0]
                    : undefined;
                const target = event === null || event === void 0 ? void 0 : event.target;
                let span;
                const activeZone = this;
                if (target) {
                    span = plugin._createSpan(target, task.eventName);
                    if (span) {
                        plugin._incrementTask(span);
                        return activeZone.run(() => {
                            try {
                                return api.context.with(api.trace.setSpan(api.context.active(), span), () => {
                                    const currentZone = Zone.current;
                                    task._zone = currentZone;
                                    return original.call(currentZone, task, applyThis, applyArgs);
                                });
                            }
                            finally {
                                plugin._decrementTask(span);
                            }
                        });
                    }
                }
                else {
                    span = plugin._getCurrentSpan(activeZone);
                }
                try {
                    return original.call(activeZone, task, applyThis, applyArgs);
                }
                finally {
                    if (span && plugin._shouldCountTask(task, activeZone)) {
                        plugin._decrementTask(span);
                    }
                }
            };
        };
    }
    /**
     * Decides if task should be counted.
     * @param task
     * @param currentZone
     * @private
     */
    _shouldCountTask(task, currentZone) {
        if (task._zone) {
            currentZone = task._zone;
        }
        if (!currentZone || !task.data || task.data.isPeriodic) {
            return false;
        }
        const currentSpan = this._getCurrentSpan(currentZone);
        if (!currentSpan) {
            return false;
        }
        if (!this._spansData.get(currentSpan)) {
            return false;
        }
        return task.type === 'macroTask' || task.type === 'microTask';
    }
    /**
     * Will try to end span when such span still exists.
     * @param span
     * @param endTime
     * @private
     */
    _tryToEndSpan(span, endTime) {
        if (span) {
            const spanData = this._spansData.get(span);
            if (spanData) {
                span.end(endTime);
                this._spansData.delete(span);
            }
        }
    }
    /**
     * implements enable function
     */
    enable() {
        const ZoneWithPrototype = this.getZoneWithPrototype();
        api.diag.debug('applying patch to', this.moduleName, this.version, 'zone:', !!ZoneWithPrototype);
        if (ZoneWithPrototype) {
            if (instrumentation_1.isWrapped(ZoneWithPrototype.prototype.runTask)) {
                this._unwrap(ZoneWithPrototype.prototype, 'runTask');
                api.diag.debug('removing previous patch from method runTask');
            }
            if (instrumentation_1.isWrapped(ZoneWithPrototype.prototype.scheduleTask)) {
                this._unwrap(ZoneWithPrototype.prototype, 'scheduleTask');
                api.diag.debug('removing previous patch from method scheduleTask');
            }
            if (instrumentation_1.isWrapped(ZoneWithPrototype.prototype.cancelTask)) {
                this._unwrap(ZoneWithPrototype.prototype, 'cancelTask');
                api.diag.debug('removing previous patch from method cancelTask');
            }
            this._zonePatched = true;
            this._wrap(ZoneWithPrototype.prototype, 'runTask', this._patchZoneRunTask());
            this._wrap(ZoneWithPrototype.prototype, 'scheduleTask', this._patchZoneScheduleTask());
            this._wrap(ZoneWithPrototype.prototype, 'cancelTask', this._patchZoneCancelTask());
        }
        else {
            this._zonePatched = false;
            const targets = this._getPatchableEventTargets();
            targets.forEach(target => {
                if (instrumentation_1.isWrapped(target.addEventListener)) {
                    this._unwrap(target, 'addEventListener');
                    api.diag.debug('removing previous patch from method addEventListener');
                }
                if (instrumentation_1.isWrapped(target.removeEventListener)) {
                    this._unwrap(target, 'removeEventListener');
                    api.diag.debug('removing previous patch from method removeEventListener');
                }
                this._wrap(target, 'addEventListener', this._patchAddEventListener());
                this._wrap(target, 'removeEventListener', this._patchRemoveEventListener());
            });
        }
        this._patchHistoryApi();
    }
    /**
     * implements unpatch function
     */
    disable() {
        const ZoneWithPrototype = this.getZoneWithPrototype();
        api.diag.debug('removing patch from', this.moduleName, this.version, 'zone:', !!ZoneWithPrototype);
        if (ZoneWithPrototype && this._zonePatched) {
            if (instrumentation_1.isWrapped(ZoneWithPrototype.prototype.runTask)) {
                this._unwrap(ZoneWithPrototype.prototype, 'runTask');
            }
            if (instrumentation_1.isWrapped(ZoneWithPrototype.prototype.scheduleTask)) {
                this._unwrap(ZoneWithPrototype.prototype, 'scheduleTask');
            }
            if (instrumentation_1.isWrapped(ZoneWithPrototype.prototype.cancelTask)) {
                this._unwrap(ZoneWithPrototype.prototype, 'cancelTask');
            }
        }
        else {
            const targets = this._getPatchableEventTargets();
            targets.forEach(target => {
                if (instrumentation_1.isWrapped(target.addEventListener)) {
                    this._unwrap(target, 'addEventListener');
                }
                if (instrumentation_1.isWrapped(target.removeEventListener)) {
                    this._unwrap(target, 'removeEventListener');
                }
            });
        }
        this._unpatchHistoryApi();
    }
    /**
     * returns Zone
     */
    getZoneWithPrototype() {
        const _window = window;
        return _window.Zone;
    }
}
exports.UserInteractionInstrumentation = UserInteractionInstrumentation;

},{"./enums/AttributeNames":152,"./version":155,"@opentelemetry/api":33,"@opentelemetry/core":165,"@opentelemetry/instrumentation":235,"@opentelemetry/sdk-trace-web":344}],155:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
// this is autogenerated file, see scripts/version-update.js
exports.VERSION = '0.28.1';

},{}],156:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],157:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],158:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"../../trace/suppress-tracing":184,"../constants":157,"../utils":159,"@opentelemetry/api":33,"dup":76}],159:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./constants":157,"@opentelemetry/api":33,"dup":77}],160:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],161:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"./logging-error-handler":162,"dup":79}],162:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":80}],163:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"../platform":171,"dup":81}],164:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],165:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./ExportResult":156,"./baggage/propagation/W3CBaggagePropagator":158,"./baggage/utils":159,"./common/attributes":160,"./common/global-error-handler":161,"./common/logging-error-handler":162,"./common/time":163,"./common/types":164,"./platform":171,"./propagation/composite":175,"./trace/IdGenerator":176,"./trace/TraceState":177,"./trace/W3CTraceContextPropagator":178,"./trace/rpc-metadata":179,"./trace/sampler/AlwaysOffSampler":180,"./trace/sampler/AlwaysOnSampler":181,"./trace/sampler/ParentBasedSampler":182,"./trace/sampler/TraceIdRatioBasedSampler":183,"./trace/suppress-tracing":184,"./utils/environment":185,"./utils/merge":187,"./utils/sampling":188,"./utils/url":189,"./utils/wrap":190,"./version":191,"dup":83}],166:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],167:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"dup":85}],168:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"../../utils/environment":185,"./globalThis":169,"dup":86}],169:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],170:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"dup":88}],171:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./RandomIdGenerator":167,"./environment":168,"./globalThis":169,"./hex-to-base64":170,"./performance":172,"./sdk-info":173,"./timer-util":174,"dup":89}],172:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"dup":90}],173:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"../../version":191,"@opentelemetry/semantic-conventions":383,"dup":91}],174:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"dup":92}],175:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":93}],176:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"dup":94}],177:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"../internal/validators":166,"dup":95}],178:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./TraceState":177,"./suppress-tracing":184,"@opentelemetry/api":33,"dup":96}],179:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":97}],180:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":98}],181:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":99}],182:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"../../common/global-error-handler":161,"./AlwaysOffSampler":180,"./AlwaysOnSampler":181,"@opentelemetry/api":33,"dup":100}],183:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":101}],184:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":102}],185:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"./sampling":188,"@opentelemetry/api":33,"dup":103}],186:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104}],187:[function(require,module,exports){
arguments[4][105][0].apply(exports,arguments)
},{"./lodash.merge":186,"dup":105}],188:[function(require,module,exports){
arguments[4][106][0].apply(exports,arguments)
},{"dup":106}],189:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"dup":107}],190:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108}],191:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"dup":109}],192:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeNames = void 0;
/**
 * https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/semantic_conventions/http.md
 */
var AttributeNames;
(function (AttributeNames) {
    AttributeNames["HTTP_STATUS_TEXT"] = "http.status_text";
})(AttributeNames = exports.AttributeNames || (exports.AttributeNames = {}));

},{}],193:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNames = void 0;
var EventNames;
(function (EventNames) {
    EventNames["METHOD_OPEN"] = "open";
    EventNames["METHOD_SEND"] = "send";
    EventNames["EVENT_ABORT"] = "abort";
    EventNames["EVENT_ERROR"] = "error";
    EventNames["EVENT_LOAD"] = "loaded";
    EventNames["EVENT_TIMEOUT"] = "timeout";
})(EventNames = exports.EventNames || (exports.EventNames = {}));

},{}],194:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./xhr"), exports);

},{"./xhr":196}],195:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
// this is autogenerated file, see scripts/version-update.js
exports.VERSION = '0.27.0';

},{}],196:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLHttpRequestInstrumentation = void 0;
const api = require("@opentelemetry/api");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const core_1 = require("@opentelemetry/core");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
const EventNames_1 = require("./enums/EventNames");
const version_1 = require("./version");
const AttributeNames_1 = require("./enums/AttributeNames");
// how long to wait for observer to collect information about resources
// this is needed as event "load" is called before observer
// hard to say how long it should really wait, seems like 300ms is
// safe enough
const OBSERVER_WAIT_TIME_MS = 300;
/**
 * This class represents a XMLHttpRequest plugin for auto instrumentation
 */
class XMLHttpRequestInstrumentation extends instrumentation_1.InstrumentationBase {
    constructor(config) {
        super('@opentelemetry/instrumentation-xml-http-request', version_1.VERSION, config);
        this.component = 'xml-http-request';
        this.version = version_1.VERSION;
        this.moduleName = this.component;
        this._tasksCount = 0;
        this._xhrMem = new WeakMap();
        this._usedResources = new WeakSet();
    }
    init() { }
    _getConfig() {
        return this._config;
    }
    /**
     * Adds custom headers to XMLHttpRequest
     * @param xhr
     * @param span
     * @private
     */
    _addHeaders(xhr, spanUrl) {
        if (!sdk_trace_web_1.shouldPropagateTraceHeaders(spanUrl, this._getConfig().propagateTraceHeaderCorsUrls)) {
            const headers = {};
            api.propagation.inject(api.context.active(), headers);
            if (Object.keys(headers).length > 0) {
                this._diag.debug('headers inject skipped due to CORS policy');
            }
            return;
        }
        const headers = {};
        api.propagation.inject(api.context.active(), headers);
        Object.keys(headers).forEach(key => {
            xhr.setRequestHeader(key, String(headers[key]));
        });
    }
    /**
     * Add cors pre flight child span
     * @param span
     * @param corsPreFlightRequest
     * @private
     */
    _addChildSpan(span, corsPreFlightRequest) {
        api.context.with(api.trace.setSpan(api.context.active(), span), () => {
            const childSpan = this.tracer.startSpan('CORS Preflight', {
                startTime: corsPreFlightRequest[sdk_trace_web_1.PerformanceTimingNames.FETCH_START],
            });
            sdk_trace_web_1.addSpanNetworkEvents(childSpan, corsPreFlightRequest);
            childSpan.end(corsPreFlightRequest[sdk_trace_web_1.PerformanceTimingNames.RESPONSE_END]);
        });
    }
    /**
     * Add attributes when span is going to end
     * @param span
     * @param xhr
     * @param spanUrl
     * @private
     */
    _addFinalSpanAttributes(span, xhrMem, spanUrl) {
        if (typeof spanUrl === 'string') {
            const parsedUrl = sdk_trace_web_1.parseUrl(spanUrl);
            if (xhrMem.status !== undefined) {
                span.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_STATUS_CODE, xhrMem.status);
            }
            if (xhrMem.statusText !== undefined) {
                span.setAttribute(AttributeNames_1.AttributeNames.HTTP_STATUS_TEXT, xhrMem.statusText);
            }
            span.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_HOST, parsedUrl.host);
            span.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_SCHEME, parsedUrl.protocol.replace(':', ''));
            // @TODO do we want to collect this or it will be collected earlier once only or
            //    maybe when parent span is not available ?
            span.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_USER_AGENT, navigator.userAgent);
        }
    }
    _applyAttributesAfterXHR(span, xhr) {
        const applyCustomAttributesOnSpan = this._getConfig()
            .applyCustomAttributesOnSpan;
        if (typeof applyCustomAttributesOnSpan === 'function') {
            instrumentation_1.safeExecuteInTheMiddle(() => applyCustomAttributesOnSpan(span, xhr), error => {
                if (!error) {
                    return;
                }
                this._diag.error('applyCustomAttributesOnSpan', error);
            }, true);
        }
    }
    /**
     * will collect information about all resources created
     * between "send" and "end" with additional waiting for main resource
     * @param xhr
     * @param spanUrl
     * @private
     */
    _addResourceObserver(xhr, spanUrl) {
        const xhrMem = this._xhrMem.get(xhr);
        if (!xhrMem ||
            typeof window.PerformanceObserver === 'undefined' ||
            typeof window.PerformanceResourceTiming === 'undefined') {
            return;
        }
        xhrMem.createdResources = {
            observer: new PerformanceObserver(list => {
                const entries = list.getEntries();
                const urlNormalizingAnchor = sdk_trace_web_1.getUrlNormalizingAnchor();
                urlNormalizingAnchor.href = spanUrl;
                entries.forEach(entry => {
                    if (entry.initiatorType === 'xmlhttprequest' &&
                        entry.name === urlNormalizingAnchor.href) {
                        if (xhrMem.createdResources) {
                            xhrMem.createdResources.entries.push(entry);
                        }
                    }
                });
            }),
            entries: [],
        };
        xhrMem.createdResources.observer.observe({
            entryTypes: ['resource'],
        });
    }
    /**
     * Clears the resource timings and all resources assigned with spans
     *     when {@link XMLHttpRequestInstrumentationConfig.clearTimingResources} is
     *     set to true (default false)
     * @private
     */
    _clearResources() {
        if (this._tasksCount === 0 && this._getConfig().clearTimingResources) {
            core_1.otperformance.clearResourceTimings();
            this._xhrMem = new WeakMap();
            this._usedResources = new WeakSet();
        }
    }
    /**
     * Finds appropriate resource and add network events to the span
     * @param span
     */
    _findResourceAndAddNetworkEvents(xhrMem, span, spanUrl, startTime, endTime) {
        if (!spanUrl || !startTime || !endTime || !xhrMem.createdResources) {
            return;
        }
        let resources = xhrMem.createdResources.entries;
        if (!resources || !resources.length) {
            // fallback - either Observer is not available or it took longer
            // then OBSERVER_WAIT_TIME_MS and observer didn't collect enough
            // information
            // ts thinks this is the perf_hooks module, but it is the browser performance api
            resources = core_1.otperformance.getEntriesByType('resource');
        }
        const resource = sdk_trace_web_1.getResource(spanUrl, startTime, endTime, resources, this._usedResources);
        if (resource.mainRequest) {
            const mainRequest = resource.mainRequest;
            this._markResourceAsUsed(mainRequest);
            const corsPreFlightRequest = resource.corsPreFlightRequest;
            if (corsPreFlightRequest) {
                this._addChildSpan(span, corsPreFlightRequest);
                this._markResourceAsUsed(corsPreFlightRequest);
            }
            sdk_trace_web_1.addSpanNetworkEvents(span, mainRequest);
        }
    }
    /**
     * Removes the previous information about span.
     * This might happened when the same xhr is used again.
     * @param xhr
     * @private
     */
    _cleanPreviousSpanInformation(xhr) {
        const xhrMem = this._xhrMem.get(xhr);
        if (xhrMem) {
            const callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
            if (callbackToRemoveEvents) {
                callbackToRemoveEvents();
            }
            this._xhrMem.delete(xhr);
        }
    }
    /**
     * Creates a new span when method "open" is called
     * @param xhr
     * @param url
     * @param method
     * @private
     */
    _createSpan(xhr, url, method) {
        if (core_1.isUrlIgnored(url, this._getConfig().ignoreUrls)) {
            this._diag.debug('ignoring span as url matches ignored url');
            return;
        }
        const spanName = `HTTP ${method.toUpperCase()}`;
        const currentSpan = this.tracer.startSpan(spanName, {
            kind: api.SpanKind.CLIENT,
            attributes: {
                [semantic_conventions_1.SemanticAttributes.HTTP_METHOD]: method,
                [semantic_conventions_1.SemanticAttributes.HTTP_URL]: url,
            },
        });
        currentSpan.addEvent(EventNames_1.EventNames.METHOD_OPEN);
        this._cleanPreviousSpanInformation(xhr);
        this._xhrMem.set(xhr, {
            span: currentSpan,
            spanUrl: url,
        });
        return currentSpan;
    }
    /**
     * Marks certain [resource]{@link PerformanceResourceTiming} when information
     * from this is used to add events to span.
     * This is done to avoid reusing the same resource again for next span
     * @param resource
     * @private
     */
    _markResourceAsUsed(resource) {
        this._usedResources.add(resource);
    }
    /**
     * Patches the method open
     * @private
     */
    _patchOpen() {
        return (original) => {
            const plugin = this;
            return function patchOpen(...args) {
                const method = args[0];
                const url = args[1];
                plugin._createSpan(this, url, method);
                return original.apply(this, args);
            };
        };
    }
    /**
     * Patches the method send
     * @private
     */
    _patchSend() {
        const plugin = this;
        function endSpanTimeout(eventName, xhrMem, endTime) {
            const callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
            if (typeof callbackToRemoveEvents === 'function') {
                callbackToRemoveEvents();
            }
            const { span, spanUrl, sendStartTime } = xhrMem;
            if (span) {
                plugin._findResourceAndAddNetworkEvents(xhrMem, span, spanUrl, sendStartTime, endTime);
                span.addEvent(eventName, endTime);
                plugin._addFinalSpanAttributes(span, xhrMem, spanUrl);
                span.end(endTime);
                plugin._tasksCount--;
            }
            plugin._clearResources();
        }
        function endSpan(eventName, xhr) {
            const xhrMem = plugin._xhrMem.get(xhr);
            if (!xhrMem) {
                return;
            }
            xhrMem.status = xhr.status;
            xhrMem.statusText = xhr.statusText;
            plugin._xhrMem.delete(xhr);
            if (xhrMem.span) {
                plugin._applyAttributesAfterXHR(xhrMem.span, xhr);
            }
            const endTime = core_1.hrTime();
            // the timeout is needed as observer doesn't have yet information
            // when event "load" is called. Also the time may differ depends on
            // browser and speed of computer
            setTimeout(() => {
                endSpanTimeout(eventName, xhrMem, endTime);
            }, OBSERVER_WAIT_TIME_MS);
        }
        function onError() {
            endSpan(EventNames_1.EventNames.EVENT_ERROR, this);
        }
        function onAbort() {
            endSpan(EventNames_1.EventNames.EVENT_ABORT, this);
        }
        function onTimeout() {
            endSpan(EventNames_1.EventNames.EVENT_TIMEOUT, this);
        }
        function onLoad() {
            if (this.status < 299) {
                endSpan(EventNames_1.EventNames.EVENT_LOAD, this);
            }
            else {
                endSpan(EventNames_1.EventNames.EVENT_ERROR, this);
            }
        }
        function unregister(xhr) {
            xhr.removeEventListener('abort', onAbort);
            xhr.removeEventListener('error', onError);
            xhr.removeEventListener('load', onLoad);
            xhr.removeEventListener('timeout', onTimeout);
            const xhrMem = plugin._xhrMem.get(xhr);
            if (xhrMem) {
                xhrMem.callbackToRemoveEvents = undefined;
            }
        }
        return (original) => {
            return function patchSend(...args) {
                const xhrMem = plugin._xhrMem.get(this);
                if (!xhrMem) {
                    return original.apply(this, args);
                }
                const currentSpan = xhrMem.span;
                const spanUrl = xhrMem.spanUrl;
                if (currentSpan && spanUrl) {
                    api.context.with(api.trace.setSpan(api.context.active(), currentSpan), () => {
                        plugin._tasksCount++;
                        xhrMem.sendStartTime = core_1.hrTime();
                        currentSpan.addEvent(EventNames_1.EventNames.METHOD_SEND);
                        this.addEventListener('abort', onAbort);
                        this.addEventListener('error', onError);
                        this.addEventListener('load', onLoad);
                        this.addEventListener('timeout', onTimeout);
                        xhrMem.callbackToRemoveEvents = () => {
                            unregister(this);
                            if (xhrMem.createdResources) {
                                xhrMem.createdResources.observer.disconnect();
                            }
                        };
                        plugin._addHeaders(this, spanUrl);
                        plugin._addResourceObserver(this, spanUrl);
                    });
                }
                return original.apply(this, args);
            };
        };
    }
    /**
     * implements enable function
     */
    enable() {
        this._diag.debug('applying patch to', this.moduleName, this.version);
        if (instrumentation_1.isWrapped(XMLHttpRequest.prototype.open)) {
            this._unwrap(XMLHttpRequest.prototype, 'open');
            this._diag.debug('removing previous patch from method open');
        }
        if (instrumentation_1.isWrapped(XMLHttpRequest.prototype.send)) {
            this._unwrap(XMLHttpRequest.prototype, 'send');
            this._diag.debug('removing previous patch from method send');
        }
        this._wrap(XMLHttpRequest.prototype, 'open', this._patchOpen());
        this._wrap(XMLHttpRequest.prototype, 'send', this._patchSend());
    }
    /**
     * implements disable function
     */
    disable() {
        this._diag.debug('removing patch from', this.moduleName, this.version);
        this._unwrap(XMLHttpRequest.prototype, 'open');
        this._unwrap(XMLHttpRequest.prototype, 'send');
        this._tasksCount = 0;
        this._xhrMem = new WeakMap();
        this._usedResources = new WeakSet();
    }
}
exports.XMLHttpRequestInstrumentation = XMLHttpRequestInstrumentation;

},{"./enums/AttributeNames":192,"./enums/EventNames":193,"./version":195,"@opentelemetry/api":33,"@opentelemetry/core":206,"@opentelemetry/instrumentation":235,"@opentelemetry/sdk-trace-web":344,"@opentelemetry/semantic-conventions":383}],197:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],198:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],199:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"../../trace/suppress-tracing":225,"../constants":198,"../utils":200,"@opentelemetry/api":33,"dup":76}],200:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./constants":198,"@opentelemetry/api":33,"dup":77}],201:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],202:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"./logging-error-handler":203,"dup":79}],203:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":80}],204:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"../platform":212,"dup":81}],205:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],206:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./ExportResult":197,"./baggage/propagation/W3CBaggagePropagator":199,"./baggage/utils":200,"./common/attributes":201,"./common/global-error-handler":202,"./common/logging-error-handler":203,"./common/time":204,"./common/types":205,"./platform":212,"./propagation/composite":216,"./trace/IdGenerator":217,"./trace/TraceState":218,"./trace/W3CTraceContextPropagator":219,"./trace/rpc-metadata":220,"./trace/sampler/AlwaysOffSampler":221,"./trace/sampler/AlwaysOnSampler":222,"./trace/sampler/ParentBasedSampler":223,"./trace/sampler/TraceIdRatioBasedSampler":224,"./trace/suppress-tracing":225,"./utils/environment":226,"./utils/merge":228,"./utils/sampling":229,"./utils/url":230,"./utils/wrap":231,"./version":232,"dup":83}],207:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],208:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"dup":85}],209:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"../../utils/environment":226,"./globalThis":210,"dup":86}],210:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],211:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"dup":88}],212:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./RandomIdGenerator":208,"./environment":209,"./globalThis":210,"./hex-to-base64":211,"./performance":213,"./sdk-info":214,"./timer-util":215,"dup":89}],213:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"dup":90}],214:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"../../version":232,"@opentelemetry/semantic-conventions":383,"dup":91}],215:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"dup":92}],216:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":93}],217:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"dup":94}],218:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"../internal/validators":207,"dup":95}],219:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./TraceState":218,"./suppress-tracing":225,"@opentelemetry/api":33,"dup":96}],220:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":97}],221:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":98}],222:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":99}],223:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"../../common/global-error-handler":202,"./AlwaysOffSampler":221,"./AlwaysOnSampler":222,"@opentelemetry/api":33,"dup":100}],224:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":101}],225:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":102}],226:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"./sampling":229,"@opentelemetry/api":33,"dup":103}],227:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104}],228:[function(require,module,exports){
arguments[4][105][0].apply(exports,arguments)
},{"./lodash.merge":227,"dup":105}],229:[function(require,module,exports){
arguments[4][106][0].apply(exports,arguments)
},{"dup":106}],230:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"dup":107}],231:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108}],232:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"dup":109}],233:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInstrumentations = void 0;
const api_1 = require("@opentelemetry/api");
const api_metrics_1 = require("@opentelemetry/api-metrics");
const autoLoaderUtils_1 = require("./autoLoaderUtils");
/**
 * It will register instrumentations and plugins
 * @param options
 * @return returns function to unload instrumentation and plugins that were
 *   registered
 */
function registerInstrumentations(options) {
    const { instrumentations } = autoLoaderUtils_1.parseInstrumentationOptions(options.instrumentations);
    const tracerProvider = options.tracerProvider || api_1.trace.getTracerProvider();
    const meterProvider = options.meterProvider || api_metrics_1.metrics.getMeterProvider();
    autoLoaderUtils_1.enableInstrumentations(instrumentations, tracerProvider, meterProvider);
    return () => {
        autoLoaderUtils_1.disableInstrumentations(instrumentations);
    };
}
exports.registerInstrumentations = registerInstrumentations;

},{"./autoLoaderUtils":234,"@opentelemetry/api":33,"@opentelemetry/api-metrics":6}],234:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableInstrumentations = exports.enableInstrumentations = exports.parseInstrumentationOptions = void 0;
/**
 * Parses the options and returns instrumentations, node plugins and
 *   web plugins
 * @param options
 */
function parseInstrumentationOptions(options = []) {
    let instrumentations = [];
    for (let i = 0, j = options.length; i < j; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const option = options[i];
        if (Array.isArray(option)) {
            const results = parseInstrumentationOptions(option);
            instrumentations = instrumentations.concat(results.instrumentations);
        }
        else if (typeof option === 'function') {
            instrumentations.push(new option());
        }
        else if (option.instrumentationName) {
            instrumentations.push(option);
        }
    }
    return { instrumentations };
}
exports.parseInstrumentationOptions = parseInstrumentationOptions;
/**
 * Enable instrumentations
 * @param instrumentations
 * @param tracerProvider
 * @param meterProvider
 */
function enableInstrumentations(instrumentations, tracerProvider, meterProvider) {
    for (let i = 0, j = instrumentations.length; i < j; i++) {
        const instrumentation = instrumentations[i];
        if (tracerProvider) {
            instrumentation.setTracerProvider(tracerProvider);
        }
        if (meterProvider) {
            instrumentation.setMeterProvider(meterProvider);
        }
        // instrumentations have been already enabled during creation
        // so enable only if user prevented that by setting enabled to false
        // this is to prevent double enabling but when calling register all
        // instrumentations should be now enabled
        if (!instrumentation.getConfig().enabled) {
            instrumentation.enable();
        }
    }
}
exports.enableInstrumentations = enableInstrumentations;
/**
 * Disable instrumentations
 * @param instrumentations
 */
function disableInstrumentations(instrumentations) {
    instrumentations.forEach(instrumentation => instrumentation.disable());
}
exports.disableInstrumentations = disableInstrumentations;

},{}],235:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./autoLoader"), exports);
__exportStar(require("./platform/index"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./types_internal"), exports);
__exportStar(require("./utils"), exports);

},{"./autoLoader":233,"./platform/index":237,"./types":239,"./types_internal":240,"./utils":241}],236:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentationAbstract = void 0;
const api_1 = require("@opentelemetry/api");
const api_metrics_1 = require("@opentelemetry/api-metrics");
const shimmer = require("shimmer");
/**
 * Base abstract internal class for instrumenting node and web plugins
 */
class InstrumentationAbstract {
    constructor(instrumentationName, instrumentationVersion, config = {}) {
        this.instrumentationName = instrumentationName;
        this.instrumentationVersion = instrumentationVersion;
        /* Api to wrap instrumented method */
        this._wrap = shimmer.wrap;
        /* Api to unwrap instrumented methods */
        this._unwrap = shimmer.unwrap;
        /* Api to mass wrap instrumented method */
        this._massWrap = shimmer.massWrap;
        /* Api to mass unwrap instrumented methods */
        this._massUnwrap = shimmer.massUnwrap;
        this._config = Object.assign({ enabled: true }, config);
        this._diag = api_1.diag.createComponentLogger({
            namespace: instrumentationName,
        });
        this._tracer = api_1.trace.getTracer(instrumentationName, instrumentationVersion);
        this._meter = api_metrics_1.metrics.getMeter(instrumentationName, instrumentationVersion);
    }
    /* Returns meter */
    get meter() {
        return this._meter;
    }
    /**
     * Sets MeterProvider to this plugin
     * @param meterProvider
     */
    setMeterProvider(meterProvider) {
        this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
    }
    /* Returns InstrumentationConfig */
    getConfig() {
        return this._config;
    }
    /**
     * Sets InstrumentationConfig to this plugin
     * @param InstrumentationConfig
     */
    setConfig(config = {}) {
        this._config = Object.assign({}, config);
    }
    /**
     * Sets TraceProvider to this plugin
     * @param tracerProvider
     */
    setTracerProvider(tracerProvider) {
        this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
    }
    /* Returns tracer */
    get tracer() {
        return this._tracer;
    }
}
exports.InstrumentationAbstract = InstrumentationAbstract;

},{"@opentelemetry/api":33,"@opentelemetry/api-metrics":6,"shimmer":388}],237:[function(require,module,exports){
arguments[4][112][0].apply(exports,arguments)
},{"./instrumentation":238,"dup":112}],238:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentationBase = void 0;
const instrumentation_1 = require("../../instrumentation");
/**
 * Base abstract class for instrumenting web plugins
 */
class InstrumentationBase extends instrumentation_1.InstrumentationAbstract {
    constructor(instrumentationName, instrumentationVersion, config = {}) {
        super(instrumentationName, instrumentationVersion, config);
        if (this._config.enabled) {
            this.enable();
        }
    }
}
exports.InstrumentationBase = InstrumentationBase;

},{"../../instrumentation":236}],239:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],240:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],241:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWrapped = exports.safeExecuteInTheMiddleAsync = exports.safeExecuteInTheMiddle = void 0;
/**
 * function to execute patched function and being able to catch errors
 * @param execute - function to be executed
 * @param onFinish - callback to run when execute finishes
 */
function safeExecuteInTheMiddle(execute, onFinish, preventThrowingError) {
    let error;
    let result;
    try {
        result = execute();
    }
    catch (e) {
        error = e;
    }
    finally {
        onFinish(error, result);
        if (error && !preventThrowingError) {
            // eslint-disable-next-line no-unsafe-finally
            throw error;
        }
        // eslint-disable-next-line no-unsafe-finally
        return result;
    }
}
exports.safeExecuteInTheMiddle = safeExecuteInTheMiddle;
/**
 * Async function to execute patched function and being able to catch errors
 * @param execute - function to be executed
 * @param onFinish - callback to run when execute finishes
 */
async function safeExecuteInTheMiddleAsync(execute, onFinish, preventThrowingError) {
    let error;
    let result;
    try {
        result = await execute();
    }
    catch (e) {
        error = e;
    }
    finally {
        onFinish(error, result);
        if (error && !preventThrowingError) {
            // eslint-disable-next-line no-unsafe-finally
            throw error;
        }
        // eslint-disable-next-line no-unsafe-finally
        return result;
    }
}
exports.safeExecuteInTheMiddleAsync = safeExecuteInTheMiddleAsync;
/**
 * Checks if certain function has been already wrapped
 * @param func
 */
function isWrapped(func) {
    return (typeof func === 'function' &&
        typeof func.__original === 'function' &&
        typeof func.__unwrap === 'function' &&
        func.__wrapped === true);
}
exports.isWrapped = isWrapped;

},{}],242:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const core_1 = require("@opentelemetry/core");
const platform_1 = require("./platform");
/**
 * A Resource describes the entity for which a signals (metrics or trace) are
 * collected.
 */
class Resource {
    constructor(
    /**
     * A dictionary of attributes with string keys and values that provide
     * information about the entity as numbers, strings or booleans
     * TODO: Consider to add check/validation on attributes.
     */
    attributes) {
        this.attributes = attributes;
    }
    /**
     * Returns an empty Resource
     */
    static empty() {
        return Resource.EMPTY;
    }
    /**
     * Returns a Resource that indentifies the SDK in use.
     */
    static default() {
        return new Resource({
            [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: platform_1.defaultServiceName(),
            [semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]: core_1.SDK_INFO[semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE],
            [semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_NAME]: core_1.SDK_INFO[semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_NAME],
            [semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_VERSION]: core_1.SDK_INFO[semantic_conventions_1.SemanticResourceAttributes.TELEMETRY_SDK_VERSION],
        });
    }
    /**
     * Returns a new, merged {@link Resource} by merging the current Resource
     * with the other Resource. In case of a collision, other Resource takes
     * precedence.
     *
     * @param other the Resource that will be merged with this.
     * @returns the newly merged Resource.
     */
    merge(other) {
        if (!other || !Object.keys(other.attributes).length)
            return this;
        // SpanAttributes from resource overwrite attributes from other resource.
        const mergedAttributes = Object.assign({}, this.attributes, other.attributes);
        return new Resource(mergedAttributes);
    }
}
exports.Resource = Resource;
Resource.EMPTY = new Resource({});

},{"./platform":247,"@opentelemetry/core":258,"@opentelemetry/semantic-conventions":383}],243:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],244:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Resource"), exports);
__exportStar(require("./platform"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./config"), exports);

},{"./Resource":242,"./config":243,"./platform":247,"./types":248}],245:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultServiceName = void 0;
function defaultServiceName() {
    return 'unknown_service';
}
exports.defaultServiceName = defaultServiceName;

},{}],246:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectResources = void 0;
const Resource_1 = require("../../Resource");
/**
 * Detects resources for the browser platform, which is currently only the
 * telemetry SDK resource. More could be added in the future. This method
 * is async to match the signature of corresponding method for node.
 */
const detectResources = async () => {
    return Resource_1.Resource.empty();
};
exports.detectResources = detectResources;

},{"../../Resource":242}],247:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./default-service-name"), exports);
__exportStar(require("./detect-resources"), exports);

},{"./default-service-name":245,"./detect-resources":246}],248:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],249:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],250:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],251:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"../../trace/suppress-tracing":277,"../constants":250,"../utils":252,"@opentelemetry/api":33,"dup":76}],252:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./constants":250,"@opentelemetry/api":33,"dup":77}],253:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],254:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"./logging-error-handler":255,"dup":79}],255:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":80}],256:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"../platform":264,"dup":81}],257:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],258:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./ExportResult":249,"./baggage/propagation/W3CBaggagePropagator":251,"./baggage/utils":252,"./common/attributes":253,"./common/global-error-handler":254,"./common/logging-error-handler":255,"./common/time":256,"./common/types":257,"./platform":264,"./propagation/composite":268,"./trace/IdGenerator":269,"./trace/TraceState":270,"./trace/W3CTraceContextPropagator":271,"./trace/rpc-metadata":272,"./trace/sampler/AlwaysOffSampler":273,"./trace/sampler/AlwaysOnSampler":274,"./trace/sampler/ParentBasedSampler":275,"./trace/sampler/TraceIdRatioBasedSampler":276,"./trace/suppress-tracing":277,"./utils/environment":278,"./utils/merge":280,"./utils/sampling":281,"./utils/url":282,"./utils/wrap":283,"./version":284,"dup":83}],259:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],260:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"dup":85}],261:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"../../utils/environment":278,"./globalThis":262,"dup":86}],262:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],263:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"dup":88}],264:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./RandomIdGenerator":260,"./environment":261,"./globalThis":262,"./hex-to-base64":263,"./performance":265,"./sdk-info":266,"./timer-util":267,"dup":89}],265:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"dup":90}],266:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"../../version":284,"@opentelemetry/semantic-conventions":383,"dup":91}],267:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"dup":92}],268:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":93}],269:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"dup":94}],270:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"../internal/validators":259,"dup":95}],271:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./TraceState":270,"./suppress-tracing":277,"@opentelemetry/api":33,"dup":96}],272:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":97}],273:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":98}],274:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":99}],275:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"../../common/global-error-handler":254,"./AlwaysOffSampler":273,"./AlwaysOnSampler":274,"@opentelemetry/api":33,"dup":100}],276:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":101}],277:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":102}],278:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"./sampling":281,"@opentelemetry/api":33,"dup":103}],279:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104}],280:[function(require,module,exports){
arguments[4][105][0].apply(exports,arguments)
},{"./lodash.merge":279,"dup":105}],281:[function(require,module,exports){
arguments[4][106][0].apply(exports,arguments)
},{"dup":106}],282:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"dup":107}],283:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108}],284:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"dup":109}],285:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicTracerProvider = exports.ForceFlushState = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const resources_1 = require("@opentelemetry/resources");
const _1 = require(".");
const config_1 = require("./config");
const MultiSpanProcessor_1 = require("./MultiSpanProcessor");
const NoopSpanProcessor_1 = require("./export/NoopSpanProcessor");
const platform_1 = require("./platform");
var ForceFlushState;
(function (ForceFlushState) {
    ForceFlushState[ForceFlushState["resolved"] = 0] = "resolved";
    ForceFlushState[ForceFlushState["timeout"] = 1] = "timeout";
    ForceFlushState[ForceFlushState["error"] = 2] = "error";
    ForceFlushState[ForceFlushState["unresolved"] = 3] = "unresolved";
})(ForceFlushState = exports.ForceFlushState || (exports.ForceFlushState = {}));
/**
 * This class represents a basic tracer provider which platform libraries can extend
 */
class BasicTracerProvider {
    constructor(config = {}) {
        var _a;
        this._registeredSpanProcessors = [];
        this._tracers = new Map();
        const mergedConfig = core_1.merge({}, config_1.DEFAULT_CONFIG, config);
        this.resource = (_a = mergedConfig.resource) !== null && _a !== void 0 ? _a : resources_1.Resource.empty();
        this.resource = resources_1.Resource.default().merge(this.resource);
        this._config = Object.assign({}, mergedConfig, {
            resource: this.resource,
        });
        const defaultExporter = this._buildExporterFromEnv();
        if (defaultExporter !== undefined) {
            const batchProcessor = new platform_1.BatchSpanProcessor(defaultExporter);
            this.activeSpanProcessor = batchProcessor;
        }
        else {
            this.activeSpanProcessor = new NoopSpanProcessor_1.NoopSpanProcessor();
        }
    }
    getTracer(name, version) {
        const key = `${name}@${version || ''}`;
        if (!this._tracers.has(key)) {
            this._tracers.set(key, new _1.Tracer({ name, version }, this._config, this));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._tracers.get(key);
    }
    /**
     * Adds a new {@link SpanProcessor} to this tracer.
     * @param spanProcessor the new SpanProcessor to be added.
     */
    addSpanProcessor(spanProcessor) {
        if (this._registeredSpanProcessors.length === 0) {
            // since we might have enabled by default a batchProcessor, we disable it
            // before adding the new one
            this.activeSpanProcessor
                .shutdown()
                .catch(err => api_1.diag.error('Error while trying to shutdown current span processor', err));
        }
        this._registeredSpanProcessors.push(spanProcessor);
        this.activeSpanProcessor = new MultiSpanProcessor_1.MultiSpanProcessor(this._registeredSpanProcessors);
    }
    getActiveSpanProcessor() {
        return this.activeSpanProcessor;
    }
    /**
     * Register this TracerProvider for use with the OpenTelemetry API.
     * Undefined values may be replaced with defaults, and
     * null values will be skipped.
     *
     * @param config Configuration object for SDK registration
     */
    register(config = {}) {
        api_1.trace.setGlobalTracerProvider(this);
        if (config.propagator === undefined) {
            config.propagator = this._buildPropagatorFromEnv();
        }
        if (config.contextManager) {
            api_1.context.setGlobalContextManager(config.contextManager);
        }
        if (config.propagator) {
            api_1.propagation.setGlobalPropagator(config.propagator);
        }
    }
    forceFlush() {
        const timeout = this._config.forceFlushTimeoutMillis;
        const promises = this._registeredSpanProcessors.map((spanProcessor) => {
            return new Promise(resolve => {
                let state;
                const timeoutInterval = setTimeout(() => {
                    resolve(new Error(`Span processor did not completed within timeout period of ${timeout} ms`));
                    state = ForceFlushState.timeout;
                }, timeout);
                spanProcessor
                    .forceFlush()
                    .then(() => {
                    clearTimeout(timeoutInterval);
                    if (state !== ForceFlushState.timeout) {
                        state = ForceFlushState.resolved;
                        resolve(state);
                    }
                })
                    .catch(error => {
                    clearTimeout(timeoutInterval);
                    state = ForceFlushState.error;
                    resolve(error);
                });
            });
        });
        return new Promise((resolve, reject) => {
            Promise.all(promises)
                .then(results => {
                const errors = results.filter(result => result !== ForceFlushState.resolved);
                if (errors.length > 0) {
                    reject(errors);
                }
                else {
                    resolve();
                }
            })
                .catch(error => reject([error]));
        });
    }
    shutdown() {
        return this.activeSpanProcessor.shutdown();
    }
    _getPropagator(name) {
        var _a;
        return (_a = BasicTracerProvider._registeredPropagators.get(name)) === null || _a === void 0 ? void 0 : _a();
    }
    _getSpanExporter(name) {
        var _a;
        return (_a = BasicTracerProvider._registeredExporters.get(name)) === null || _a === void 0 ? void 0 : _a();
    }
    _buildPropagatorFromEnv() {
        // per spec, propagators from env must be deduplicated
        const uniquePropagatorNames = Array.from(new Set(core_1.getEnv().OTEL_PROPAGATORS));
        const propagators = uniquePropagatorNames.map(name => {
            const propagator = this._getPropagator(name);
            if (!propagator) {
                api_1.diag.warn(`Propagator "${name}" requested through environment variable is unavailable.`);
            }
            return propagator;
        });
        const validPropagators = propagators.reduce((list, item) => {
            if (item) {
                list.push(item);
            }
            return list;
        }, []);
        if (validPropagators.length === 0) {
            return;
        }
        else if (uniquePropagatorNames.length === 1) {
            return validPropagators[0];
        }
        else {
            return new core_1.CompositePropagator({
                propagators: validPropagators,
            });
        }
    }
    _buildExporterFromEnv() {
        const exporterName = core_1.getEnv().OTEL_TRACES_EXPORTER;
        if (exporterName === 'none')
            return;
        const exporter = this._getSpanExporter(exporterName);
        if (!exporter) {
            api_1.diag.error(`Exporter "${exporterName}" requested through environment variable is unavailable.`);
        }
        return exporter;
    }
}
exports.BasicTracerProvider = BasicTracerProvider;
BasicTracerProvider._registeredPropagators = new Map([
    ['tracecontext', () => new core_1.W3CTraceContextPropagator()],
    ['baggage', () => new core_1.W3CBaggagePropagator()],
]);
BasicTracerProvider._registeredExporters = new Map();

},{".":300,"./MultiSpanProcessor":286,"./config":291,"./export/NoopSpanProcessor":296,"./platform":302,"@opentelemetry/api":33,"@opentelemetry/core":314,"@opentelemetry/resources":244}],286:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiSpanProcessor = void 0;
const core_1 = require("@opentelemetry/core");
/**
 * Implementation of the {@link SpanProcessor} that simply forwards all
 * received events to a list of {@link SpanProcessor}s.
 */
class MultiSpanProcessor {
    constructor(_spanProcessors) {
        this._spanProcessors = _spanProcessors;
    }
    forceFlush() {
        const promises = [];
        for (const spanProcessor of this._spanProcessors) {
            promises.push(spanProcessor.forceFlush());
        }
        return new Promise(resolve => {
            Promise.all(promises)
                .then(() => {
                resolve();
            })
                .catch(error => {
                core_1.globalErrorHandler(error || new Error('MultiSpanProcessor: forceFlush failed'));
                resolve();
            });
        });
    }
    onStart(span, context) {
        for (const spanProcessor of this._spanProcessors) {
            spanProcessor.onStart(span, context);
        }
    }
    onEnd(span) {
        for (const spanProcessor of this._spanProcessors) {
            spanProcessor.onEnd(span);
        }
    }
    shutdown() {
        const promises = [];
        for (const spanProcessor of this._spanProcessors) {
            promises.push(spanProcessor.shutdown());
        }
        return new Promise((resolve, reject) => {
            Promise.all(promises).then(() => {
                resolve();
            }, reject);
        });
    }
}
exports.MultiSpanProcessor = MultiSpanProcessor;

},{"@opentelemetry/core":314}],287:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Span = void 0;
const api = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const enums_1 = require("./enums");
/**
 * This class represents a span.
 */
class Span {
    /** Constructs a new Span instance. */
    constructor(parentTracer, context, spanName, spanContext, kind, parentSpanId, links = [], startTime = core_1.hrTime()) {
        this.attributes = {};
        this.links = [];
        this.events = [];
        this.status = {
            code: api.SpanStatusCode.UNSET,
        };
        this.endTime = [0, 0];
        this._ended = false;
        this._duration = [-1, -1];
        this.name = spanName;
        this._spanContext = spanContext;
        this.parentSpanId = parentSpanId;
        this.kind = kind;
        this.links = links;
        this.startTime = core_1.timeInputToHrTime(startTime);
        this.resource = parentTracer.resource;
        this.instrumentationLibrary = parentTracer.instrumentationLibrary;
        this._spanLimits = parentTracer.getSpanLimits();
        this._spanProcessor = parentTracer.getActiveSpanProcessor();
        this._spanProcessor.onStart(this, context);
        this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0;
    }
    spanContext() {
        return this._spanContext;
    }
    setAttribute(key, value) {
        if (value == null || this._isSpanEnded())
            return this;
        if (key.length === 0) {
            api.diag.warn(`Invalid attribute key: ${key}`);
            return this;
        }
        if (!core_1.isAttributeValue(value)) {
            api.diag.warn(`Invalid attribute value set for key: ${key}`);
            return this;
        }
        if (Object.keys(this.attributes).length >=
            this._spanLimits.attributeCountLimit &&
            !Object.prototype.hasOwnProperty.call(this.attributes, key)) {
            return this;
        }
        this.attributes[key] = this._truncateToSize(value);
        return this;
    }
    setAttributes(attributes) {
        for (const [k, v] of Object.entries(attributes)) {
            this.setAttribute(k, v);
        }
        return this;
    }
    /**
     *
     * @param name Span Name
     * @param [attributesOrStartTime] Span attributes or start time
     *     if type is {@type TimeInput} and 3rd param is undefined
     * @param [startTime] Specified start time for the event
     */
    addEvent(name, attributesOrStartTime, startTime) {
        if (this._isSpanEnded())
            return this;
        if (this.events.length >= this._spanLimits.eventCountLimit) {
            api.diag.warn('Dropping extra events.');
            this.events.shift();
        }
        if (core_1.isTimeInput(attributesOrStartTime)) {
            if (typeof startTime === 'undefined') {
                startTime = attributesOrStartTime;
            }
            attributesOrStartTime = undefined;
        }
        if (typeof startTime === 'undefined') {
            startTime = core_1.hrTime();
        }
        this.events.push({
            name,
            attributes: attributesOrStartTime,
            time: core_1.timeInputToHrTime(startTime),
        });
        return this;
    }
    setStatus(status) {
        if (this._isSpanEnded())
            return this;
        this.status = status;
        return this;
    }
    updateName(name) {
        if (this._isSpanEnded())
            return this;
        this.name = name;
        return this;
    }
    end(endTime = core_1.hrTime()) {
        if (this._isSpanEnded()) {
            api.diag.error('You can only call end() on a span once.');
            return;
        }
        this._ended = true;
        this.endTime = core_1.timeInputToHrTime(endTime);
        this._duration = core_1.hrTimeDuration(this.startTime, this.endTime);
        if (this._duration[0] < 0) {
            api.diag.warn('Inconsistent start and end time, startTime > endTime', this.startTime, this.endTime);
        }
        this._spanProcessor.onEnd(this);
    }
    isRecording() {
        return this._ended === false;
    }
    recordException(exception, time = core_1.hrTime()) {
        const attributes = {};
        if (typeof exception === 'string') {
            attributes[semantic_conventions_1.SemanticAttributes.EXCEPTION_MESSAGE] = exception;
        }
        else if (exception) {
            if (exception.code) {
                attributes[semantic_conventions_1.SemanticAttributes.EXCEPTION_TYPE] = exception.code.toString();
            }
            else if (exception.name) {
                attributes[semantic_conventions_1.SemanticAttributes.EXCEPTION_TYPE] = exception.name;
            }
            if (exception.message) {
                attributes[semantic_conventions_1.SemanticAttributes.EXCEPTION_MESSAGE] = exception.message;
            }
            if (exception.stack) {
                attributes[semantic_conventions_1.SemanticAttributes.EXCEPTION_STACKTRACE] = exception.stack;
            }
        }
        // these are minimum requirements from spec
        if (attributes[semantic_conventions_1.SemanticAttributes.EXCEPTION_TYPE] ||
            attributes[semantic_conventions_1.SemanticAttributes.EXCEPTION_MESSAGE]) {
            this.addEvent(enums_1.ExceptionEventName, attributes, time);
        }
        else {
            api.diag.warn(`Failed to record an exception ${exception}`);
        }
    }
    get duration() {
        return this._duration;
    }
    get ended() {
        return this._ended;
    }
    _isSpanEnded() {
        if (this._ended) {
            api.diag.warn(`Can not execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
        }
        return this._ended;
    }
    // Utility function to truncate given value within size
    // for value type of string, will truncate to given limit
    // for type of non-string, will return same value
    _truncateToLimitUtil(value, limit) {
        if (value.length <= limit) {
            return value;
        }
        return value.substr(0, limit);
    }
    /**
     * If the given attribute value is of type string and has more characters than given {@code attributeValueLengthLimit} then
     * return string with trucated to {@code attributeValueLengthLimit} characters
     *
     * If the given attribute value is array of strings then
     * return new array of strings with each element truncated to {@code attributeValueLengthLimit} characters
     *
     * Otherwise return same Attribute {@code value}
     *
     * @param value Attribute value
     * @returns truncated attribute value if required, otherwise same value
     */
    _truncateToSize(value) {
        const limit = this._attributeValueLengthLimit;
        // Check limit
        if (limit <= 0) {
            // Negative values are invalid, so do not truncate
            api.diag.warn(`Attribute value limit must be positive, got ${limit}`);
            return value;
        }
        // String
        if (typeof value === 'string') {
            return this._truncateToLimitUtil(value, limit);
        }
        // Array of strings
        if (Array.isArray(value)) {
            return value.map(val => typeof val === 'string' ? this._truncateToLimitUtil(val, limit) : val);
        }
        // Other types, no need to apply value length limit
        return value;
    }
}
exports.Span = Span;

},{"./enums":292,"@opentelemetry/api":33,"@opentelemetry/core":314,"@opentelemetry/semantic-conventions":383}],288:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],289:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],290:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracer = void 0;
const api = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const Span_1 = require("./Span");
const utility_1 = require("./utility");
/**
 * This class represents a basic tracer.
 */
class Tracer {
    /**
     * Constructs a new Tracer instance.
     */
    constructor(instrumentationLibrary, config, _tracerProvider) {
        this._tracerProvider = _tracerProvider;
        const localConfig = utility_1.mergeConfig(config);
        this._sampler = localConfig.sampler;
        this._generalLimits = localConfig.generalLimits;
        this._spanLimits = localConfig.spanLimits;
        this._idGenerator = config.idGenerator || new core_1.RandomIdGenerator();
        this.resource = _tracerProvider.resource;
        this.instrumentationLibrary = instrumentationLibrary;
    }
    /**
     * Starts a new Span or returns the default NoopSpan based on the sampling
     * decision.
     */
    startSpan(name, options = {}, context = api.context.active()) {
        var _a, _b;
        if (core_1.isTracingSuppressed(context)) {
            api.diag.debug('Instrumentation suppressed, returning Noop Span');
            return api.trace.wrapSpanContext(api.INVALID_SPAN_CONTEXT);
        }
        const parentContext = getParent(options, context);
        const spanId = this._idGenerator.generateSpanId();
        let traceId;
        let traceState;
        let parentSpanId;
        if (!parentContext || !api.trace.isSpanContextValid(parentContext)) {
            // New root span.
            traceId = this._idGenerator.generateTraceId();
        }
        else {
            // New child span.
            traceId = parentContext.traceId;
            traceState = parentContext.traceState;
            parentSpanId = parentContext.spanId;
        }
        const spanKind = (_a = options.kind) !== null && _a !== void 0 ? _a : api.SpanKind.INTERNAL;
        const links = (_b = options.links) !== null && _b !== void 0 ? _b : [];
        const attributes = core_1.sanitizeAttributes(options.attributes);
        // make sampling decision
        const samplingResult = this._sampler.shouldSample(options.root
            ? api.trace.setSpanContext(context, api.INVALID_SPAN_CONTEXT)
            : context, traceId, name, spanKind, attributes, links);
        const traceFlags = samplingResult.decision === api.SamplingDecision.RECORD_AND_SAMPLED
            ? api.TraceFlags.SAMPLED
            : api.TraceFlags.NONE;
        const spanContext = { traceId, spanId, traceFlags, traceState };
        if (samplingResult.decision === api.SamplingDecision.NOT_RECORD) {
            api.diag.debug('Recording is off, propagating context in a non-recording span');
            return api.trace.wrapSpanContext(spanContext);
        }
        const span = new Span_1.Span(this, context, name, spanContext, spanKind, parentSpanId, links, options.startTime);
        // Set default attributes
        span.setAttributes(Object.assign(attributes, samplingResult.attributes));
        return span;
    }
    startActiveSpan(name, arg2, arg3, arg4) {
        let opts;
        let ctx;
        let fn;
        if (arguments.length < 2) {
            return;
        }
        else if (arguments.length === 2) {
            fn = arg2;
        }
        else if (arguments.length === 3) {
            opts = arg2;
            fn = arg3;
        }
        else {
            opts = arg2;
            ctx = arg3;
            fn = arg4;
        }
        const parentContext = ctx !== null && ctx !== void 0 ? ctx : api.context.active();
        const span = this.startSpan(name, opts, parentContext);
        const contextWithSpanSet = api.trace.setSpan(parentContext, span);
        return api.context.with(contextWithSpanSet, fn, undefined, span);
    }
    /** Returns the active {@link GeneralLimits}. */
    getGeneralLimits() {
        return this._generalLimits;
    }
    /** Returns the active {@link SpanLimits}. */
    getSpanLimits() {
        return this._spanLimits;
    }
    getActiveSpanProcessor() {
        return this._tracerProvider.getActiveSpanProcessor();
    }
}
exports.Tracer = Tracer;
/**
 * Get the parent to assign to a started span. If options.parent is null,
 * do not assign a parent.
 *
 * @param options span options
 * @param context context to check for parent
 */
function getParent(options, context) {
    if (options.root)
        return undefined;
    return api.trace.getSpanContext(context);
}

},{"./Span":287,"./utility":304,"@opentelemetry/api":33,"@opentelemetry/core":314}],291:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSamplerFromEnv = exports.DEFAULT_CONFIG = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const env = core_1.getEnv();
const FALLBACK_OTEL_TRACES_SAMPLER = core_1.TracesSamplerValues.AlwaysOn;
const DEFAULT_RATIO = 1;
/**
 * Default configuration. For fields with primitive values, any user-provided
 * value will override the corresponding default value. For fields with
 * non-primitive values (like `spanLimits`), the user-provided value will be
 * used to extend the default value.
 */
exports.DEFAULT_CONFIG = {
    sampler: buildSamplerFromEnv(env),
    forceFlushTimeoutMillis: 30000,
    generalLimits: {
        attributeValueLengthLimit: core_1.getEnv().OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT,
        attributeCountLimit: core_1.getEnv().OTEL_ATTRIBUTE_COUNT_LIMIT,
    },
    spanLimits: {
        attributeValueLengthLimit: core_1.getEnv().OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT,
        attributeCountLimit: core_1.getEnv().OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT,
        linkCountLimit: core_1.getEnv().OTEL_SPAN_LINK_COUNT_LIMIT,
        eventCountLimit: core_1.getEnv().OTEL_SPAN_EVENT_COUNT_LIMIT,
    },
};
/**
 * Based on environment, builds a sampler, complies with specification.
 * @param environment optional, by default uses getEnv(), but allows passing a value to reuse parsed environment
 */
function buildSamplerFromEnv(environment = core_1.getEnv()) {
    switch (environment.OTEL_TRACES_SAMPLER) {
        case core_1.TracesSamplerValues.AlwaysOn:
            return new core_1.AlwaysOnSampler();
        case core_1.TracesSamplerValues.AlwaysOff:
            return new core_1.AlwaysOffSampler();
        case core_1.TracesSamplerValues.ParentBasedAlwaysOn:
            return new core_1.ParentBasedSampler({
                root: new core_1.AlwaysOnSampler(),
            });
        case core_1.TracesSamplerValues.ParentBasedAlwaysOff:
            return new core_1.ParentBasedSampler({
                root: new core_1.AlwaysOffSampler(),
            });
        case core_1.TracesSamplerValues.TraceIdRatio:
            return new core_1.TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment));
        case core_1.TracesSamplerValues.ParentBasedTraceIdRatio:
            return new core_1.ParentBasedSampler({
                root: new core_1.TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment)),
            });
        default:
            api_1.diag.error(`OTEL_TRACES_SAMPLER value "${environment.OTEL_TRACES_SAMPLER} invalid, defaulting to ${FALLBACK_OTEL_TRACES_SAMPLER}".`);
            return new core_1.AlwaysOnSampler();
    }
}
exports.buildSamplerFromEnv = buildSamplerFromEnv;
function getSamplerProbabilityFromEnv(environment) {
    if (environment.OTEL_TRACES_SAMPLER_ARG === undefined ||
        environment.OTEL_TRACES_SAMPLER_ARG === '') {
        api_1.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${DEFAULT_RATIO}.`);
        return DEFAULT_RATIO;
    }
    const probability = Number(environment.OTEL_TRACES_SAMPLER_ARG);
    if (isNaN(probability)) {
        api_1.diag.error(`OTEL_TRACES_SAMPLER_ARG=${environment.OTEL_TRACES_SAMPLER_ARG} was given, but it is invalid, defaulting to ${DEFAULT_RATIO}.`);
        return DEFAULT_RATIO;
    }
    if (probability < 0 || probability > 1) {
        api_1.diag.error(`OTEL_TRACES_SAMPLER_ARG=${environment.OTEL_TRACES_SAMPLER_ARG} was given, but it is out of range ([0..1]), defaulting to ${DEFAULT_RATIO}.`);
        return DEFAULT_RATIO;
    }
    return probability;
}

},{"@opentelemetry/api":33,"@opentelemetry/core":314}],292:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionEventName = void 0;
// Event name definitions
exports.ExceptionEventName = 'exception';

},{}],293:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchSpanProcessorBase = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
/**
 * Implementation of the {@link SpanProcessor} that batches spans exported by
 * the SDK then pushes them to the exporter pipeline.
 */
class BatchSpanProcessorBase {
    constructor(_exporter, config) {
        this._exporter = _exporter;
        this._finishedSpans = [];
        this._isShutdown = false;
        this._shuttingDownPromise = Promise.resolve();
        const env = core_1.getEnv();
        this._maxExportBatchSize =
            typeof (config === null || config === void 0 ? void 0 : config.maxExportBatchSize) === 'number'
                ? config.maxExportBatchSize
                : env.OTEL_BSP_MAX_EXPORT_BATCH_SIZE;
        this._maxQueueSize =
            typeof (config === null || config === void 0 ? void 0 : config.maxQueueSize) === 'number'
                ? config.maxQueueSize
                : env.OTEL_BSP_MAX_QUEUE_SIZE;
        this._scheduledDelayMillis =
            typeof (config === null || config === void 0 ? void 0 : config.scheduledDelayMillis) === 'number'
                ? config.scheduledDelayMillis
                : env.OTEL_BSP_SCHEDULE_DELAY;
        this._exportTimeoutMillis =
            typeof (config === null || config === void 0 ? void 0 : config.exportTimeoutMillis) === 'number'
                ? config.exportTimeoutMillis
                : env.OTEL_BSP_EXPORT_TIMEOUT;
    }
    forceFlush() {
        if (this._isShutdown) {
            return this._shuttingDownPromise;
        }
        return this._flushAll();
    }
    // does nothing.
    onStart(_span) { }
    onEnd(span) {
        if (this._isShutdown) {
            return;
        }
        if ((span.spanContext().traceFlags & api_1.TraceFlags.SAMPLED) === 0) {
            return;
        }
        this._addToBuffer(span);
    }
    shutdown() {
        if (this._isShutdown) {
            return this._shuttingDownPromise;
        }
        this._isShutdown = true;
        this._shuttingDownPromise = new Promise((resolve, reject) => {
            Promise.resolve()
                .then(() => {
                return this.onShutdown();
            })
                .then(() => {
                return this._flushAll();
            })
                .then(() => {
                return this._exporter.shutdown();
            })
                .then(resolve)
                .catch(e => {
                reject(e);
            });
        });
        return this._shuttingDownPromise;
    }
    /** Add a span in the buffer. */
    _addToBuffer(span) {
        if (this._finishedSpans.length >= this._maxQueueSize) {
            // limit reached, drop span
            return;
        }
        this._finishedSpans.push(span);
        this._maybeStartTimer();
    }
    /**
     * Send all spans to the exporter respecting the batch size limit
     * This function is used only on forceFlush or shutdown,
     * for all other cases _flush should be used
     * */
    _flushAll() {
        return new Promise((resolve, reject) => {
            const promises = [];
            // calculate number of batches
            const count = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
            for (let i = 0, j = count; i < j; i++) {
                promises.push(this._flushOneBatch());
            }
            Promise.all(promises)
                .then(() => {
                resolve();
            })
                .catch(reject);
        });
    }
    _flushOneBatch() {
        this._clearTimer();
        if (this._finishedSpans.length === 0) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                // don't wait anymore for export, this way the next batch can start
                reject(new Error('Timeout'));
            }, this._exportTimeoutMillis);
            // prevent downstream exporter calls from generating spans
            api_1.context.with(core_1.suppressTracing(api_1.context.active()), () => {
                // Reset the finished spans buffer here because the next invocations of the _flush method
                // could pass the same finished spans to the exporter if the buffer is cleared
                // outside of the execution of this callback.
                this._exporter.export(this._finishedSpans.splice(0, this._maxExportBatchSize), result => {
                    var _a;
                    clearTimeout(timer);
                    if (result.code === core_1.ExportResultCode.SUCCESS) {
                        resolve();
                    }
                    else {
                        reject((_a = result.error) !== null && _a !== void 0 ? _a : new Error('BatchSpanProcessor: span export failed'));
                    }
                });
            });
        });
    }
    _maybeStartTimer() {
        if (this._timer !== undefined)
            return;
        this._timer = setTimeout(() => {
            this._flushOneBatch()
                .then(() => {
                if (this._finishedSpans.length > 0) {
                    this._clearTimer();
                    this._maybeStartTimer();
                }
            })
                .catch(e => {
                core_1.globalErrorHandler(e);
            });
        }, this._scheduledDelayMillis);
        core_1.unrefTimer(this._timer);
    }
    _clearTimer() {
        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }
    }
}
exports.BatchSpanProcessorBase = BatchSpanProcessorBase;

},{"@opentelemetry/api":33,"@opentelemetry/core":314}],294:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleSpanExporter = void 0;
const core_1 = require("@opentelemetry/core");
/**
 * This is implementation of {@link SpanExporter} that prints spans to the
 * console. This class can be used for diagnostic purposes.
 */
/* eslint-disable no-console */
class ConsoleSpanExporter {
    /**
     * Export spans.
     * @param spans
     * @param resultCallback
     */
    export(spans, resultCallback) {
        return this._sendSpans(spans, resultCallback);
    }
    /**
     * Shutdown the exporter.
     */
    shutdown() {
        this._sendSpans([]);
        return Promise.resolve();
    }
    /**
     * converts span info into more readable format
     * @param span
     */
    _exportInfo(span) {
        return {
            traceId: span.spanContext().traceId,
            parentId: span.parentSpanId,
            name: span.name,
            id: span.spanContext().spanId,
            kind: span.kind,
            timestamp: core_1.hrTimeToMicroseconds(span.startTime),
            duration: core_1.hrTimeToMicroseconds(span.duration),
            attributes: span.attributes,
            status: span.status,
            events: span.events,
        };
    }
    /**
     * Showing spans in console
     * @param spans
     * @param done
     */
    _sendSpans(spans, done) {
        for (const span of spans) {
            console.log(this._exportInfo(span));
        }
        if (done) {
            return done({ code: core_1.ExportResultCode.SUCCESS });
        }
    }
}
exports.ConsoleSpanExporter = ConsoleSpanExporter;

},{"@opentelemetry/core":314}],295:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorySpanExporter = void 0;
const core_1 = require("@opentelemetry/core");
/**
 * This class can be used for testing purposes. It stores the exported spans
 * in a list in memory that can be retrieved using the `getFinishedSpans()`
 * method.
 */
class InMemorySpanExporter {
    constructor() {
        this._finishedSpans = [];
        /**
         * Indicates if the exporter has been "shutdown."
         * When false, exported spans will not be stored in-memory.
         */
        this._stopped = false;
    }
    export(spans, resultCallback) {
        if (this._stopped)
            return resultCallback({
                code: core_1.ExportResultCode.FAILED,
                error: new Error('Exporter has been stopped'),
            });
        this._finishedSpans.push(...spans);
        setTimeout(() => resultCallback({ code: core_1.ExportResultCode.SUCCESS }), 0);
    }
    shutdown() {
        this._stopped = true;
        this._finishedSpans = [];
        return Promise.resolve();
    }
    reset() {
        this._finishedSpans = [];
    }
    getFinishedSpans() {
        return this._finishedSpans;
    }
}
exports.InMemorySpanExporter = InMemorySpanExporter;

},{"@opentelemetry/core":314}],296:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopSpanProcessor = void 0;
/** No-op implementation of SpanProcessor */
class NoopSpanProcessor {
    onStart(_span, _context) { }
    onEnd(_span) { }
    shutdown() {
        return Promise.resolve();
    }
    forceFlush() {
        return Promise.resolve();
    }
}
exports.NoopSpanProcessor = NoopSpanProcessor;

},{}],297:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],298:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSpanProcessor = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
/**
 * An implementation of the {@link SpanProcessor} that converts the {@link Span}
 * to {@link ReadableSpan} and passes it to the configured exporter.
 *
 * Only spans that are sampled are converted.
 */
class SimpleSpanProcessor {
    constructor(_exporter) {
        this._exporter = _exporter;
        this._isShutdown = false;
        this._shuttingDownPromise = Promise.resolve();
    }
    forceFlush() {
        // do nothing as all spans are being exported without waiting
        return Promise.resolve();
    }
    // does nothing.
    onStart(_span) { }
    onEnd(span) {
        if (this._isShutdown) {
            return;
        }
        if ((span.spanContext().traceFlags & api_1.TraceFlags.SAMPLED) === 0) {
            return;
        }
        // prevent downstream exporter calls from generating spans
        api_1.context.with(core_1.suppressTracing(api_1.context.active()), () => {
            this._exporter.export([span], result => {
                var _a;
                if (result.code !== core_1.ExportResultCode.SUCCESS) {
                    core_1.globalErrorHandler((_a = result.error) !== null && _a !== void 0 ? _a : new Error(`SimpleSpanProcessor: span export failed (status ${result})`));
                }
            });
        });
    }
    shutdown() {
        if (this._isShutdown) {
            return this._shuttingDownPromise;
        }
        this._isShutdown = true;
        this._shuttingDownPromise = new Promise((resolve, reject) => {
            Promise.resolve()
                .then(() => {
                return this._exporter.shutdown();
            })
                .then(resolve)
                .catch(e => {
                reject(e);
            });
        });
        return this._shuttingDownPromise;
    }
}
exports.SimpleSpanProcessor = SimpleSpanProcessor;

},{"@opentelemetry/api":33,"@opentelemetry/core":314}],299:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });

},{}],300:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Tracer"), exports);
__exportStar(require("./BasicTracerProvider"), exports);
__exportStar(require("./platform"), exports);
__exportStar(require("./export/ConsoleSpanExporter"), exports);
__exportStar(require("./export/InMemorySpanExporter"), exports);
__exportStar(require("./export/ReadableSpan"), exports);
__exportStar(require("./export/SimpleSpanProcessor"), exports);
__exportStar(require("./export/SpanExporter"), exports);
__exportStar(require("./export/NoopSpanProcessor"), exports);
__exportStar(require("./Span"), exports);
__exportStar(require("./SpanProcessor"), exports);
__exportStar(require("./TimedEvent"), exports);
__exportStar(require("./types"), exports);

},{"./BasicTracerProvider":285,"./Span":287,"./SpanProcessor":288,"./TimedEvent":289,"./Tracer":290,"./export/ConsoleSpanExporter":294,"./export/InMemorySpanExporter":295,"./export/NoopSpanProcessor":296,"./export/ReadableSpan":297,"./export/SimpleSpanProcessor":298,"./export/SpanExporter":299,"./platform":302,"./types":303}],301:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchSpanProcessor = void 0;
const BatchSpanProcessorBase_1 = require("../../../export/BatchSpanProcessorBase");
class BatchSpanProcessor extends BatchSpanProcessorBase_1.BatchSpanProcessorBase {
    constructor(_exporter, config) {
        super(_exporter, config);
        this.onInit(config);
    }
    onInit(config) {
        if ((config === null || config === void 0 ? void 0 : config.disableAutoFlushOnDocumentHide) !== true && document != null) {
            this._visibilityChangeListener = () => {
                if (document.visibilityState === 'hidden') {
                    void this.forceFlush();
                }
            };
            this._pageHideListener = () => {
                void this.forceFlush();
            };
            document.addEventListener('visibilitychange', this._visibilityChangeListener);
            // use 'pagehide' event as a fallback for Safari; see https://bugs.webkit.org/show_bug.cgi?id=116769
            document.addEventListener('pagehide', this._pageHideListener);
        }
    }
    onShutdown() {
        if (this._visibilityChangeListener) {
            document.removeEventListener('visibilitychange', this._visibilityChangeListener);
        }
        if (this._pageHideListener) {
            document.removeEventListener('pagehide', this._pageHideListener);
        }
    }
}
exports.BatchSpanProcessor = BatchSpanProcessor;

},{"../../../export/BatchSpanProcessorBase":293}],302:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./export/BatchSpanProcessor"), exports);

},{"./export/BatchSpanProcessor":301}],303:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],304:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeConfig = void 0;
const core_1 = require("@opentelemetry/core");
const config_1 = require("./config");
/**
 * Function to merge Default configuration (as specified in './config') with
 * user provided configurations.
 */
function mergeConfig(userConfig) {
    const perInstanceDefaults = {
        sampler: config_1.buildSamplerFromEnv(),
    };
    const target = Object.assign({}, config_1.DEFAULT_CONFIG, perInstanceDefaults, userConfig);
    target.generalLimits = Object.assign({}, config_1.DEFAULT_CONFIG.generalLimits, userConfig.generalLimits || {});
    target.spanLimits = Object.assign({}, config_1.DEFAULT_CONFIG.spanLimits, userConfig.spanLimits || {});
    /**
     * When span attribute count limit is not defined, but general attribute count limit is defined
     * Then, span attribute count limit will be same as general one
     */
    if (target.spanLimits.attributeCountLimit === core_1.DEFAULT_ATTRIBUTE_COUNT_LIMIT && target.generalLimits.attributeCountLimit !== core_1.DEFAULT_ATTRIBUTE_COUNT_LIMIT) {
        target.spanLimits.attributeCountLimit = target.generalLimits.attributeCountLimit;
    }
    /**
     * When span attribute value length limit is not defined, but general attribute value length limit is defined
     * Then, span attribute value length limit will be same as general one
     */
    if (target.spanLimits.attributeValueLengthLimit === core_1.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT && target.generalLimits.attributeValueLengthLimit !== core_1.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT) {
        target.spanLimits.attributeValueLengthLimit = target.generalLimits.attributeValueLengthLimit;
    }
    return target;
}
exports.mergeConfig = mergeConfig;

},{"./config":291,"@opentelemetry/core":314}],305:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],306:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],307:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"../../trace/suppress-tracing":333,"../constants":306,"../utils":308,"@opentelemetry/api":33,"dup":76}],308:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./constants":306,"@opentelemetry/api":33,"dup":77}],309:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],310:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"./logging-error-handler":311,"dup":79}],311:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":80}],312:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"../platform":320,"dup":81}],313:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],314:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./ExportResult":305,"./baggage/propagation/W3CBaggagePropagator":307,"./baggage/utils":308,"./common/attributes":309,"./common/global-error-handler":310,"./common/logging-error-handler":311,"./common/time":312,"./common/types":313,"./platform":320,"./propagation/composite":324,"./trace/IdGenerator":325,"./trace/TraceState":326,"./trace/W3CTraceContextPropagator":327,"./trace/rpc-metadata":328,"./trace/sampler/AlwaysOffSampler":329,"./trace/sampler/AlwaysOnSampler":330,"./trace/sampler/ParentBasedSampler":331,"./trace/sampler/TraceIdRatioBasedSampler":332,"./trace/suppress-tracing":333,"./utils/environment":334,"./utils/merge":336,"./utils/sampling":337,"./utils/url":338,"./utils/wrap":339,"./version":340,"dup":83}],315:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],316:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"dup":85}],317:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"../../utils/environment":334,"./globalThis":318,"dup":86}],318:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],319:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"dup":88}],320:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./RandomIdGenerator":316,"./environment":317,"./globalThis":318,"./hex-to-base64":319,"./performance":321,"./sdk-info":322,"./timer-util":323,"dup":89}],321:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"dup":90}],322:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"../../version":340,"@opentelemetry/semantic-conventions":383,"dup":91}],323:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"dup":92}],324:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":93}],325:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"dup":94}],326:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"../internal/validators":315,"dup":95}],327:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./TraceState":326,"./suppress-tracing":333,"@opentelemetry/api":33,"dup":96}],328:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":97}],329:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":98}],330:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":99}],331:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"../../common/global-error-handler":310,"./AlwaysOffSampler":329,"./AlwaysOnSampler":330,"@opentelemetry/api":33,"dup":100}],332:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":101}],333:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":102}],334:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"./sampling":337,"@opentelemetry/api":33,"dup":103}],335:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104}],336:[function(require,module,exports){
arguments[4][105][0].apply(exports,arguments)
},{"./lodash.merge":335,"dup":105}],337:[function(require,module,exports){
arguments[4][106][0].apply(exports,arguments)
},{"dup":106}],338:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"dup":107}],339:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108}],340:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"dup":109}],341:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackContextManager = void 0;
const api_1 = require("@opentelemetry/api");
/**
 * Stack Context Manager for managing the state in web
 * it doesn't fully support the async calls though
 */
class StackContextManager {
    constructor() {
        /**
         * whether the context manager is enabled or not
         */
        this._enabled = false;
        /**
         * Keeps the reference to current context
         */
        this._currentContext = api_1.ROOT_CONTEXT;
    }
    /**
     *
     * @param context
     * @param target Function to be executed within the context
     */
    _bindFunction(context = api_1.ROOT_CONTEXT, target) {
        const manager = this;
        const contextWrapper = function (...args) {
            return manager.with(context, () => target.apply(this, args));
        };
        Object.defineProperty(contextWrapper, 'length', {
            enumerable: false,
            configurable: true,
            writable: false,
            value: target.length,
        });
        return contextWrapper;
    }
    /**
     * Returns the active context
     */
    active() {
        return this._currentContext;
    }
    /**
     * Binds a the certain context or the active one to the target function and then returns the target
     * @param context A context (span) to be bind to target
     * @param target a function or event emitter. When target or one of its callbacks is called,
     *  the provided context will be used as the active context for the duration of the call.
     */
    bind(context, target) {
        // if no specific context to propagate is given, we use the current one
        if (context === undefined) {
            context = this.active();
        }
        if (typeof target === 'function') {
            return this._bindFunction(context, target);
        }
        return target;
    }
    /**
     * Disable the context manager (clears the current context)
     */
    disable() {
        this._currentContext = api_1.ROOT_CONTEXT;
        this._enabled = false;
        return this;
    }
    /**
     * Enables the context manager and creates a default(root) context
     */
    enable() {
        if (this._enabled) {
            return this;
        }
        this._enabled = true;
        this._currentContext = api_1.ROOT_CONTEXT;
        return this;
    }
    /**
     * Calls the callback function [fn] with the provided [context]. If [context] is undefined then it will use the window.
     * The context will be set as active
     * @param context
     * @param fn Callback function
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    with(context, fn, thisArg, ...args) {
        const previousContext = this._currentContext;
        this._currentContext = context || api_1.ROOT_CONTEXT;
        try {
            return fn.call(thisArg, ...args);
        }
        finally {
            this._currentContext = previousContext;
        }
    }
}
exports.StackContextManager = StackContextManager;

},{"@opentelemetry/api":33}],342:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebTracerProvider = void 0;
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const StackContextManager_1 = require("./StackContextManager");
/**
 * This class represents a web tracer with {@link StackContextManager}
 */
class WebTracerProvider extends sdk_trace_base_1.BasicTracerProvider {
    /**
     * Constructs a new Tracer instance.
     * @param config Web Tracer config
     */
    constructor(config = {}) {
        super(config);
        if (config.contextManager) {
            throw ('contextManager should be defined in register method not in' +
                ' constructor');
        }
        if (config.propagator) {
            throw 'propagator should be defined in register method not in constructor';
        }
    }
    /**
     * Register this TracerProvider for use with the OpenTelemetry API.
     * Undefined values may be replaced with defaults, and
     * null values will be skipped.
     *
     * @param config Configuration object for SDK registration
     */
    register(config = {}) {
        if (config.contextManager === undefined) {
            config.contextManager = new StackContextManager_1.StackContextManager();
        }
        if (config.contextManager) {
            config.contextManager.enable();
        }
        super.register(config);
    }
}
exports.WebTracerProvider = WebTracerProvider;

},{"./StackContextManager":341,"@opentelemetry/sdk-trace-base":300}],343:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTimingNames = void 0;
var PerformanceTimingNames;
(function (PerformanceTimingNames) {
    PerformanceTimingNames["CONNECT_END"] = "connectEnd";
    PerformanceTimingNames["CONNECT_START"] = "connectStart";
    PerformanceTimingNames["DECODED_BODY_SIZE"] = "decodedBodySize";
    PerformanceTimingNames["DOM_COMPLETE"] = "domComplete";
    PerformanceTimingNames["DOM_CONTENT_LOADED_EVENT_END"] = "domContentLoadedEventEnd";
    PerformanceTimingNames["DOM_CONTENT_LOADED_EVENT_START"] = "domContentLoadedEventStart";
    PerformanceTimingNames["DOM_INTERACTIVE"] = "domInteractive";
    PerformanceTimingNames["DOMAIN_LOOKUP_END"] = "domainLookupEnd";
    PerformanceTimingNames["DOMAIN_LOOKUP_START"] = "domainLookupStart";
    PerformanceTimingNames["ENCODED_BODY_SIZE"] = "encodedBodySize";
    PerformanceTimingNames["FETCH_START"] = "fetchStart";
    PerformanceTimingNames["LOAD_EVENT_END"] = "loadEventEnd";
    PerformanceTimingNames["LOAD_EVENT_START"] = "loadEventStart";
    PerformanceTimingNames["NAVIGATION_START"] = "navigationStart";
    PerformanceTimingNames["REDIRECT_END"] = "redirectEnd";
    PerformanceTimingNames["REDIRECT_START"] = "redirectStart";
    PerformanceTimingNames["REQUEST_START"] = "requestStart";
    PerformanceTimingNames["RESPONSE_END"] = "responseEnd";
    PerformanceTimingNames["RESPONSE_START"] = "responseStart";
    PerformanceTimingNames["SECURE_CONNECTION_START"] = "secureConnectionStart";
    PerformanceTimingNames["UNLOAD_EVENT_END"] = "unloadEventEnd";
    PerformanceTimingNames["UNLOAD_EVENT_START"] = "unloadEventStart";
})(PerformanceTimingNames = exports.PerformanceTimingNames || (exports.PerformanceTimingNames = {}));

},{}],344:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./WebTracerProvider"), exports);
__exportStar(require("./StackContextManager"), exports);
__exportStar(require("./enums/PerformanceTimingNames"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);

},{"./StackContextManager":341,"./WebTracerProvider":342,"./enums/PerformanceTimingNames":343,"./types":345,"./utils":346}],345:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const PerformanceTimingNames_1 = require("./enums/PerformanceTimingNames");

},{"./enums/PerformanceTimingNames":343}],346:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldPropagateTraceHeaders = exports.getElementXPath = exports.parseUrl = exports.getResource = exports.sortResources = exports.addSpanNetworkEvents = exports.addSpanNetworkEvent = exports.hasKey = exports.getUrlNormalizingAnchor = void 0;
const PerformanceTimingNames_1 = require("./enums/PerformanceTimingNames");
const core_1 = require("@opentelemetry/core");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
// Used to normalize relative URLs
let a;
function getUrlNormalizingAnchor() {
    if (!a) {
        a = document.createElement('a');
    }
    return a;
}
exports.getUrlNormalizingAnchor = getUrlNormalizingAnchor;
/**
 * Helper function to be able to use enum as typed key in type and in interface when using forEach
 * @param obj
 * @param key
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasKey(obj, key) {
    return key in obj;
}
exports.hasKey = hasKey;
/**
 * Helper function for starting an event on span based on {@link PerformanceEntries}
 * @param span
 * @param performanceName name of performance entry for time start
 * @param entries
 */
function addSpanNetworkEvent(span, performanceName, entries) {
    if (hasKey(entries, performanceName) &&
        typeof entries[performanceName] === 'number') {
        span.addEvent(performanceName, entries[performanceName]);
        return span;
    }
    return undefined;
}
exports.addSpanNetworkEvent = addSpanNetworkEvent;
/**
 * Helper function for adding network events
 * @param span
 * @param resource
 */
function addSpanNetworkEvents(span, resource) {
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.FETCH_START, resource);
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.DOMAIN_LOOKUP_START, resource);
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.DOMAIN_LOOKUP_END, resource);
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.CONNECT_START, resource);
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.SECURE_CONNECTION_START, resource);
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.CONNECT_END, resource);
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.REQUEST_START, resource);
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.RESPONSE_START, resource);
    addSpanNetworkEvent(span, PerformanceTimingNames_1.PerformanceTimingNames.RESPONSE_END, resource);
    const encodedLength = resource[PerformanceTimingNames_1.PerformanceTimingNames.ENCODED_BODY_SIZE];
    if (encodedLength !== undefined) {
        span.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_RESPONSE_CONTENT_LENGTH, encodedLength);
    }
    const decodedLength = resource[PerformanceTimingNames_1.PerformanceTimingNames.DECODED_BODY_SIZE];
    // Spec: Not set if transport encoding not used (in which case encoded and decoded sizes match)
    if (decodedLength !== undefined && encodedLength !== decodedLength) {
        span.setAttribute(semantic_conventions_1.SemanticAttributes.HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, decodedLength);
    }
}
exports.addSpanNetworkEvents = addSpanNetworkEvents;
/**
 * sort resources by startTime
 * @param filteredResources
 */
function sortResources(filteredResources) {
    return filteredResources.slice().sort((a, b) => {
        const valueA = a[PerformanceTimingNames_1.PerformanceTimingNames.FETCH_START];
        const valueB = b[PerformanceTimingNames_1.PerformanceTimingNames.FETCH_START];
        if (valueA > valueB) {
            return 1;
        }
        else if (valueA < valueB) {
            return -1;
        }
        return 0;
    });
}
exports.sortResources = sortResources;
/**
 * Get closest performance resource ignoring the resources that have been
 * already used.
 * @param spanUrl
 * @param startTimeHR
 * @param endTimeHR
 * @param resources
 * @param ignoredResources
 * @param initiatorType
 */
function getResource(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources = new WeakSet(), initiatorType) {
    // de-relativize the URL before usage (does no harm to absolute URLs)
    const urlNormalizingAnchor = getUrlNormalizingAnchor();
    urlNormalizingAnchor.href = spanUrl;
    spanUrl = urlNormalizingAnchor.href;
    const filteredResources = filterResourcesForSpan(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType);
    if (filteredResources.length === 0) {
        return {
            mainRequest: undefined,
        };
    }
    if (filteredResources.length === 1) {
        return {
            mainRequest: filteredResources[0],
        };
    }
    const sorted = sortResources(filteredResources);
    const parsedSpanUrl = parseUrl(spanUrl);
    if (parsedSpanUrl.origin !== window.location.origin && sorted.length > 1) {
        let corsPreFlightRequest = sorted[0];
        let mainRequest = findMainRequest(sorted, corsPreFlightRequest[PerformanceTimingNames_1.PerformanceTimingNames.RESPONSE_END], endTimeHR);
        const responseEnd = corsPreFlightRequest[PerformanceTimingNames_1.PerformanceTimingNames.RESPONSE_END];
        const fetchStart = mainRequest[PerformanceTimingNames_1.PerformanceTimingNames.FETCH_START];
        // no corsPreFlightRequest
        if (fetchStart < responseEnd) {
            mainRequest = corsPreFlightRequest;
            corsPreFlightRequest = undefined;
        }
        return {
            corsPreFlightRequest,
            mainRequest,
        };
    }
    else {
        return {
            mainRequest: filteredResources[0],
        };
    }
}
exports.getResource = getResource;
/**
 * Will find the main request skipping the cors pre flight requests
 * @param resources
 * @param corsPreFlightRequestEndTime
 * @param spanEndTimeHR
 */
function findMainRequest(resources, corsPreFlightRequestEndTime, spanEndTimeHR) {
    const spanEndTime = core_1.hrTimeToNanoseconds(spanEndTimeHR);
    const minTime = core_1.hrTimeToNanoseconds(core_1.timeInputToHrTime(corsPreFlightRequestEndTime));
    let mainRequest = resources[1];
    let bestGap;
    const length = resources.length;
    for (let i = 1; i < length; i++) {
        const resource = resources[i];
        const resourceStartTime = core_1.hrTimeToNanoseconds(core_1.timeInputToHrTime(resource[PerformanceTimingNames_1.PerformanceTimingNames.FETCH_START]));
        const resourceEndTime = core_1.hrTimeToNanoseconds(core_1.timeInputToHrTime(resource[PerformanceTimingNames_1.PerformanceTimingNames.RESPONSE_END]));
        const currentGap = spanEndTime - resourceEndTime;
        if (resourceStartTime >= minTime && (!bestGap || currentGap < bestGap)) {
            bestGap = currentGap;
            mainRequest = resource;
        }
    }
    return mainRequest;
}
/**
 * Filter all resources that has started and finished according to span start time and end time.
 *     It will return the closest resource to a start time
 * @param spanUrl
 * @param startTimeHR
 * @param endTimeHR
 * @param resources
 * @param ignoredResources
 */
function filterResourcesForSpan(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    const startTime = core_1.hrTimeToNanoseconds(startTimeHR);
    const endTime = core_1.hrTimeToNanoseconds(endTimeHR);
    let filteredResources = resources.filter(resource => {
        const resourceStartTime = core_1.hrTimeToNanoseconds(core_1.timeInputToHrTime(resource[PerformanceTimingNames_1.PerformanceTimingNames.FETCH_START]));
        const resourceEndTime = core_1.hrTimeToNanoseconds(core_1.timeInputToHrTime(resource[PerformanceTimingNames_1.PerformanceTimingNames.RESPONSE_END]));
        return (resource.initiatorType.toLowerCase() ===
            (initiatorType || 'xmlhttprequest') &&
            resource.name === spanUrl &&
            resourceStartTime >= startTime &&
            resourceEndTime <= endTime);
    });
    if (filteredResources.length > 0) {
        filteredResources = filteredResources.filter(resource => {
            return !ignoredResources.has(resource);
        });
    }
    return filteredResources;
}
/**
 * Parses url using anchor element
 * @param url
 */
function parseUrl(url) {
    const a = document.createElement('a');
    a.href = url;
    return a;
}
exports.parseUrl = parseUrl;
/**
 * Get element XPath
 * @param target - target element
 * @param optimised - when id attribute of element is present the xpath can be
 * simplified to contain id
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getElementXPath(target, optimised) {
    if (target.nodeType === Node.DOCUMENT_NODE) {
        return '/';
    }
    const targetValue = getNodeValue(target, optimised);
    if (optimised && targetValue.indexOf('@id') > 0) {
        return targetValue;
    }
    let xpath = '';
    if (target.parentNode) {
        xpath += getElementXPath(target.parentNode, false);
    }
    xpath += targetValue;
    return xpath;
}
exports.getElementXPath = getElementXPath;
/**
 * get node index within the siblings
 * @param target
 */
function getNodeIndex(target) {
    if (!target.parentNode) {
        return 0;
    }
    const allowedTypes = [target.nodeType];
    if (target.nodeType === Node.CDATA_SECTION_NODE) {
        allowedTypes.push(Node.TEXT_NODE);
    }
    let elements = Array.from(target.parentNode.childNodes);
    elements = elements.filter((element) => {
        const localName = element.localName;
        return (allowedTypes.indexOf(element.nodeType) >= 0 &&
            localName === target.localName);
    });
    if (elements.length >= 1) {
        return elements.indexOf(target) + 1; // xpath starts from 1
    }
    // if there are no other similar child xpath doesn't need index
    return 0;
}
/**
 * get node value for xpath
 * @param target
 * @param optimised
 */
function getNodeValue(target, optimised) {
    const nodeType = target.nodeType;
    const index = getNodeIndex(target);
    let nodeValue = '';
    if (nodeType === Node.ELEMENT_NODE) {
        const id = target.getAttribute('id');
        if (optimised && id) {
            return `//*[@id="${id}"]`;
        }
        nodeValue = target.localName;
    }
    else if (nodeType === Node.TEXT_NODE ||
        nodeType === Node.CDATA_SECTION_NODE) {
        nodeValue = 'text()';
    }
    else if (nodeType === Node.COMMENT_NODE) {
        nodeValue = 'comment()';
    }
    else {
        return '';
    }
    // if index is 1 it can be omitted in xpath
    if (nodeValue && index > 1) {
        return `/${nodeValue}[${index}]`;
    }
    return `/${nodeValue}`;
}
/**
 * Checks if trace headers should be propagated
 * @param spanUrl
 * @private
 */
function shouldPropagateTraceHeaders(spanUrl, propagateTraceHeaderCorsUrls) {
    let propagateTraceHeaderUrls = propagateTraceHeaderCorsUrls || [];
    if (typeof propagateTraceHeaderUrls === 'string' ||
        propagateTraceHeaderUrls instanceof RegExp) {
        propagateTraceHeaderUrls = [propagateTraceHeaderUrls];
    }
    const parsedSpanUrl = parseUrl(spanUrl);
    if (parsedSpanUrl.origin === window.location.origin) {
        return true;
    }
    else {
        return propagateTraceHeaderUrls.some(propagateTraceHeaderUrl => core_1.urlMatches(spanUrl, propagateTraceHeaderUrl));
    }
}
exports.shouldPropagateTraceHeaders = shouldPropagateTraceHeaders;

},{"./enums/PerformanceTimingNames":343,"@opentelemetry/core":356,"@opentelemetry/semantic-conventions":383}],347:[function(require,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"dup":74}],348:[function(require,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"dup":75}],349:[function(require,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"../../trace/suppress-tracing":375,"../constants":348,"../utils":350,"@opentelemetry/api":33,"dup":76}],350:[function(require,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./constants":348,"@opentelemetry/api":33,"dup":77}],351:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],352:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"./logging-error-handler":353,"dup":79}],353:[function(require,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":80}],354:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"../platform":362,"dup":81}],355:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],356:[function(require,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./ExportResult":347,"./baggage/propagation/W3CBaggagePropagator":349,"./baggage/utils":350,"./common/attributes":351,"./common/global-error-handler":352,"./common/logging-error-handler":353,"./common/time":354,"./common/types":355,"./platform":362,"./propagation/composite":366,"./trace/IdGenerator":367,"./trace/TraceState":368,"./trace/W3CTraceContextPropagator":369,"./trace/rpc-metadata":370,"./trace/sampler/AlwaysOffSampler":371,"./trace/sampler/AlwaysOnSampler":372,"./trace/sampler/ParentBasedSampler":373,"./trace/sampler/TraceIdRatioBasedSampler":374,"./trace/suppress-tracing":375,"./utils/environment":376,"./utils/merge":378,"./utils/sampling":379,"./utils/url":380,"./utils/wrap":381,"./version":382,"dup":83}],357:[function(require,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],358:[function(require,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"dup":85}],359:[function(require,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"../../utils/environment":376,"./globalThis":360,"dup":86}],360:[function(require,module,exports){
arguments[4][87][0].apply(exports,arguments)
},{"dup":87}],361:[function(require,module,exports){
arguments[4][88][0].apply(exports,arguments)
},{"dup":88}],362:[function(require,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./RandomIdGenerator":358,"./environment":359,"./globalThis":360,"./hex-to-base64":361,"./performance":363,"./sdk-info":364,"./timer-util":365,"dup":89}],363:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"dup":90}],364:[function(require,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"../../version":382,"@opentelemetry/semantic-conventions":383,"dup":91}],365:[function(require,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"dup":92}],366:[function(require,module,exports){
arguments[4][93][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":93}],367:[function(require,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"dup":94}],368:[function(require,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"../internal/validators":357,"dup":95}],369:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./TraceState":368,"./suppress-tracing":375,"@opentelemetry/api":33,"dup":96}],370:[function(require,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":97}],371:[function(require,module,exports){
arguments[4][98][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":98}],372:[function(require,module,exports){
arguments[4][99][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":99}],373:[function(require,module,exports){
arguments[4][100][0].apply(exports,arguments)
},{"../../common/global-error-handler":352,"./AlwaysOffSampler":371,"./AlwaysOnSampler":372,"@opentelemetry/api":33,"dup":100}],374:[function(require,module,exports){
arguments[4][101][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":101}],375:[function(require,module,exports){
arguments[4][102][0].apply(exports,arguments)
},{"@opentelemetry/api":33,"dup":102}],376:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"./sampling":379,"@opentelemetry/api":33,"dup":103}],377:[function(require,module,exports){
arguments[4][104][0].apply(exports,arguments)
},{"dup":104}],378:[function(require,module,exports){
arguments[4][105][0].apply(exports,arguments)
},{"./lodash.merge":377,"dup":105}],379:[function(require,module,exports){
arguments[4][106][0].apply(exports,arguments)
},{"dup":106}],380:[function(require,module,exports){
arguments[4][107][0].apply(exports,arguments)
},{"dup":107}],381:[function(require,module,exports){
arguments[4][108][0].apply(exports,arguments)
},{"dup":108}],382:[function(require,module,exports){
arguments[4][109][0].apply(exports,arguments)
},{"dup":109}],383:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./trace"), exports);
__exportStar(require("./resource"), exports);

},{"./resource":385,"./trace":387}],384:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetrySdkLanguageValues = exports.OsTypeValues = exports.HostArchValues = exports.AwsEcsLaunchtypeValues = exports.CloudPlatformValues = exports.CloudProviderValues = exports.SemanticResourceAttributes = void 0;
// DO NOT EDIT, this is an Auto-generated file from scripts/semconv/templates//templates/SemanticAttributes.ts.j2
exports.SemanticResourceAttributes = {
    /**
    * Name of the cloud provider.
    */
    CLOUD_PROVIDER: 'cloud.provider',
    /**
    * The cloud account ID the resource is assigned to.
    */
    CLOUD_ACCOUNT_ID: 'cloud.account.id',
    /**
    * The geographical region the resource is running. Refer to your provider&#39;s docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/geographies/), or [Google Cloud regions](https://cloud.google.com/about/locations).
    */
    CLOUD_REGION: 'cloud.region',
    /**
    * Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
    *
    * Note: Availability zones are called &#34;zones&#34; on Alibaba Cloud and Google Cloud.
    */
    CLOUD_AVAILABILITY_ZONE: 'cloud.availability_zone',
    /**
    * The cloud platform in use.
    *
    * Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
    */
    CLOUD_PLATFORM: 'cloud.platform',
    /**
    * The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
    */
    AWS_ECS_CONTAINER_ARN: 'aws.ecs.container.arn',
    /**
    * The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
    */
    AWS_ECS_CLUSTER_ARN: 'aws.ecs.cluster.arn',
    /**
    * The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
    */
    AWS_ECS_LAUNCHTYPE: 'aws.ecs.launchtype',
    /**
    * The ARN of an [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html).
    */
    AWS_ECS_TASK_ARN: 'aws.ecs.task.arn',
    /**
    * The task definition family this task definition is a member of.
    */
    AWS_ECS_TASK_FAMILY: 'aws.ecs.task.family',
    /**
    * The revision for this task definition.
    */
    AWS_ECS_TASK_REVISION: 'aws.ecs.task.revision',
    /**
    * The ARN of an EKS cluster.
    */
    AWS_EKS_CLUSTER_ARN: 'aws.eks.cluster.arn',
    /**
    * The name(s) of the AWS log group(s) an application is writing to.
    *
    * Note: Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
    */
    AWS_LOG_GROUP_NAMES: 'aws.log.group.names',
    /**
    * The Amazon Resource Name(s) (ARN) of the AWS log group(s).
    *
    * Note: See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
    */
    AWS_LOG_GROUP_ARNS: 'aws.log.group.arns',
    /**
    * The name(s) of the AWS log stream(s) an application is writing to.
    */
    AWS_LOG_STREAM_NAMES: 'aws.log.stream.names',
    /**
    * The ARN(s) of the AWS log stream(s).
    *
    * Note: See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
    */
    AWS_LOG_STREAM_ARNS: 'aws.log.stream.arns',
    /**
    * Container name.
    */
    CONTAINER_NAME: 'container.name',
    /**
    * Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/reference/run/#container-identification). The UUID might be abbreviated.
    */
    CONTAINER_ID: 'container.id',
    /**
    * The container runtime managing this container.
    */
    CONTAINER_RUNTIME: 'container.runtime',
    /**
    * Name of the image the container was built on.
    */
    CONTAINER_IMAGE_NAME: 'container.image.name',
    /**
    * Container image tag.
    */
    CONTAINER_IMAGE_TAG: 'container.image.tag',
    /**
    * Name of the [deployment environment](https://en.wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
    */
    DEPLOYMENT_ENVIRONMENT: 'deployment.environment',
    /**
    * A unique identifier representing the device.
    *
    * Note: The device identifier MUST only be defined using the values outlined below. This value is not an advertising identifier and MUST NOT be used as such. On iOS (Swift or Objective-C), this value MUST be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value MUST be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
    */
    DEVICE_ID: 'device.id',
    /**
    * The model identifier for the device.
    *
    * Note: It&#39;s recommended this value represents a machine readable version of the model identifier rather than the market or consumer-friendly name of the device.
    */
    DEVICE_MODEL_IDENTIFIER: 'device.model.identifier',
    /**
    * The marketing name for the device model.
    *
    * Note: It&#39;s recommended this value represents a human readable version of the device model rather than a machine readable alternative.
    */
    DEVICE_MODEL_NAME: 'device.model.name',
    /**
    * The name of the single function that this runtime instance executes.
    *
    * Note: This is the name of the function as configured/deployed on the FaaS platform and is usually different from the name of the callback function (which may be stored in the [`code.namespace`/`code.function`](../../trace/semantic_conventions/span-general.md#source-code-attributes) span attributes).
    */
    FAAS_NAME: 'faas.name',
    /**
    * The unique ID of the single function that this runtime instance executes.
    *
    * Note: Depending on the cloud provider, use:
  
  * **AWS Lambda:** The function [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html).
  Take care not to use the &#34;invoked ARN&#34; directly but replace any
  [alias suffix](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html) with the resolved function version, as the same runtime instance may be invokable with multiple
  different aliases.
  * **GCP:** The [URI of the resource](https://cloud.google.com/iam/docs/full-resource-names)
  * **Azure:** The [Fully Qualified Resource ID](https://docs.microsoft.com/en-us/rest/api/resources/resources/get-by-id).
  
  On some providers, it may not be possible to determine the full ID at startup,
  which is why this field cannot be made required. For example, on AWS the account ID
  part of the ARN is not available without calling another AWS API
  which may be deemed too slow for a short-running lambda function.
  As an alternative, consider setting `faas.id` as a span attribute instead.
    */
    FAAS_ID: 'faas.id',
    /**
    * The immutable version of the function being executed.
    *
    * Note: Depending on the cloud provider and platform, use:
  
  * **AWS Lambda:** The [function version](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
    (an integer represented as a decimal string).
  * **Google Cloud Run:** The [revision](https://cloud.google.com/run/docs/managing/revisions)
    (i.e., the function name plus the revision suffix).
  * **Google Cloud Functions:** The value of the
    [`K_REVISION` environment variable](https://cloud.google.com/functions/docs/env-var#runtime_environment_variables_set_automatically).
  * **Azure Functions:** Not applicable. Do not set this attribute.
    */
    FAAS_VERSION: 'faas.version',
    /**
    * The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
    *
    * Note: * **AWS Lambda:** Use the (full) log stream name.
    */
    FAAS_INSTANCE: 'faas.instance',
    /**
    * The amount of memory available to the serverless function in MiB.
    *
    * Note: It&#39;s recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information.
    */
    FAAS_MAX_MEMORY: 'faas.max_memory',
    /**
    * Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider.
    */
    HOST_ID: 'host.id',
    /**
    * Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
    */
    HOST_NAME: 'host.name',
    /**
    * Type of host. For Cloud, this must be the machine type.
    */
    HOST_TYPE: 'host.type',
    /**
    * The CPU architecture the host system is running on.
    */
    HOST_ARCH: 'host.arch',
    /**
    * Name of the VM image or OS install the host was instantiated from.
    */
    HOST_IMAGE_NAME: 'host.image.name',
    /**
    * VM image ID. For Cloud, this value is from the provider.
    */
    HOST_IMAGE_ID: 'host.image.id',
    /**
    * The version string of the VM image as defined in [Version Attributes](README.md#version-attributes).
    */
    HOST_IMAGE_VERSION: 'host.image.version',
    /**
    * The name of the cluster.
    */
    K8S_CLUSTER_NAME: 'k8s.cluster.name',
    /**
    * The name of the Node.
    */
    K8S_NODE_NAME: 'k8s.node.name',
    /**
    * The UID of the Node.
    */
    K8S_NODE_UID: 'k8s.node.uid',
    /**
    * The name of the namespace that the pod is running in.
    */
    K8S_NAMESPACE_NAME: 'k8s.namespace.name',
    /**
    * The UID of the Pod.
    */
    K8S_POD_UID: 'k8s.pod.uid',
    /**
    * The name of the Pod.
    */
    K8S_POD_NAME: 'k8s.pod.name',
    /**
    * The name of the Container in a Pod template.
    */
    K8S_CONTAINER_NAME: 'k8s.container.name',
    /**
    * The UID of the ReplicaSet.
    */
    K8S_REPLICASET_UID: 'k8s.replicaset.uid',
    /**
    * The name of the ReplicaSet.
    */
    K8S_REPLICASET_NAME: 'k8s.replicaset.name',
    /**
    * The UID of the Deployment.
    */
    K8S_DEPLOYMENT_UID: 'k8s.deployment.uid',
    /**
    * The name of the Deployment.
    */
    K8S_DEPLOYMENT_NAME: 'k8s.deployment.name',
    /**
    * The UID of the StatefulSet.
    */
    K8S_STATEFULSET_UID: 'k8s.statefulset.uid',
    /**
    * The name of the StatefulSet.
    */
    K8S_STATEFULSET_NAME: 'k8s.statefulset.name',
    /**
    * The UID of the DaemonSet.
    */
    K8S_DAEMONSET_UID: 'k8s.daemonset.uid',
    /**
    * The name of the DaemonSet.
    */
    K8S_DAEMONSET_NAME: 'k8s.daemonset.name',
    /**
    * The UID of the Job.
    */
    K8S_JOB_UID: 'k8s.job.uid',
    /**
    * The name of the Job.
    */
    K8S_JOB_NAME: 'k8s.job.name',
    /**
    * The UID of the CronJob.
    */
    K8S_CRONJOB_UID: 'k8s.cronjob.uid',
    /**
    * The name of the CronJob.
    */
    K8S_CRONJOB_NAME: 'k8s.cronjob.name',
    /**
    * The operating system type.
    */
    OS_TYPE: 'os.type',
    /**
    * Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
    */
    OS_DESCRIPTION: 'os.description',
    /**
    * Human readable operating system name.
    */
    OS_NAME: 'os.name',
    /**
    * The version string of the operating system as defined in [Version Attributes](../../resource/semantic_conventions/README.md#version-attributes).
    */
    OS_VERSION: 'os.version',
    /**
    * Process identifier (PID).
    */
    PROCESS_PID: 'process.pid',
    /**
    * The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
    */
    PROCESS_EXECUTABLE_NAME: 'process.executable.name',
    /**
    * The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
    */
    PROCESS_EXECUTABLE_PATH: 'process.executable.path',
    /**
    * The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
    */
    PROCESS_COMMAND: 'process.command',
    /**
    * The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
    */
    PROCESS_COMMAND_LINE: 'process.command_line',
    /**
    * All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
    */
    PROCESS_COMMAND_ARGS: 'process.command_args',
    /**
    * The username of the user that owns the process.
    */
    PROCESS_OWNER: 'process.owner',
    /**
    * The name of the runtime of this process. For compiled native binaries, this SHOULD be the name of the compiler.
    */
    PROCESS_RUNTIME_NAME: 'process.runtime.name',
    /**
    * The version of the runtime of this process, as returned by the runtime without modification.
    */
    PROCESS_RUNTIME_VERSION: 'process.runtime.version',
    /**
    * An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
    */
    PROCESS_RUNTIME_DESCRIPTION: 'process.runtime.description',
    /**
    * Logical name of the service.
    *
    * Note: MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs MUST fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md#process), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value MUST be set to `unknown_service`.
    */
    SERVICE_NAME: 'service.name',
    /**
    * A namespace for `service.name`.
    *
    * Note: A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
    */
    SERVICE_NAMESPACE: 'service.namespace',
    /**
    * The string ID of the service instance.
    *
    * Note: MUST be unique for each instance of the same `service.namespace,service.name` pair (in other words `service.namespace,service.name,service.instance.id` triplet MUST be globally unique). The ID helps to distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled service). It is preferable for the ID to be persistent and stay the same for the lifetime of the service instance, however it is acceptable that the ID is ephemeral and changes during important lifetime events for the service (e.g. service restarts). If the service has no inherent unique ID that can be used as the value of this attribute it is recommended to generate a random Version 1 or Version 4 RFC 4122 UUID (services aiming for reproducible UUIDs may also use Version 5, see RFC 4122 for more recommendations).
    */
    SERVICE_INSTANCE_ID: 'service.instance.id',
    /**
    * The version string of the service API or implementation.
    */
    SERVICE_VERSION: 'service.version',
    /**
    * The name of the telemetry SDK as defined above.
    */
    TELEMETRY_SDK_NAME: 'telemetry.sdk.name',
    /**
    * The language of the telemetry SDK.
    */
    TELEMETRY_SDK_LANGUAGE: 'telemetry.sdk.language',
    /**
    * The version string of the telemetry SDK.
    */
    TELEMETRY_SDK_VERSION: 'telemetry.sdk.version',
    /**
    * The version string of the auto instrumentation agent, if used.
    */
    TELEMETRY_AUTO_VERSION: 'telemetry.auto.version',
    /**
    * The name of the web engine.
    */
    WEBENGINE_NAME: 'webengine.name',
    /**
    * The version of the web engine.
    */
    WEBENGINE_VERSION: 'webengine.version',
    /**
    * Additional description of the web engine (e.g. detailed version and edition information).
    */
    WEBENGINE_DESCRIPTION: 'webengine.description',
};
exports.CloudProviderValues = {
    /** Alibaba Cloud. */
    ALIBABA_CLOUD: 'alibaba_cloud',
    /** Amazon Web Services. */
    AWS: 'aws',
    /** Microsoft Azure. */
    AZURE: 'azure',
    /** Google Cloud Platform. */
    GCP: 'gcp',
};
exports.CloudPlatformValues = {
    /** Alibaba Cloud Elastic Compute Service. */
    ALIBABA_CLOUD_ECS: 'alibaba_cloud_ecs',
    /** Alibaba Cloud Function Compute. */
    ALIBABA_CLOUD_FC: 'alibaba_cloud_fc',
    /** AWS Elastic Compute Cloud. */
    AWS_EC2: 'aws_ec2',
    /** AWS Elastic Container Service. */
    AWS_ECS: 'aws_ecs',
    /** AWS Elastic Kubernetes Service. */
    AWS_EKS: 'aws_eks',
    /** AWS Lambda. */
    AWS_LAMBDA: 'aws_lambda',
    /** AWS Elastic Beanstalk. */
    AWS_ELASTIC_BEANSTALK: 'aws_elastic_beanstalk',
    /** Azure Virtual Machines. */
    AZURE_VM: 'azure_vm',
    /** Azure Container Instances. */
    AZURE_CONTAINER_INSTANCES: 'azure_container_instances',
    /** Azure Kubernetes Service. */
    AZURE_AKS: 'azure_aks',
    /** Azure Functions. */
    AZURE_FUNCTIONS: 'azure_functions',
    /** Azure App Service. */
    AZURE_APP_SERVICE: 'azure_app_service',
    /** Google Cloud Compute Engine (GCE). */
    GCP_COMPUTE_ENGINE: 'gcp_compute_engine',
    /** Google Cloud Run. */
    GCP_CLOUD_RUN: 'gcp_cloud_run',
    /** Google Cloud Kubernetes Engine (GKE). */
    GCP_KUBERNETES_ENGINE: 'gcp_kubernetes_engine',
    /** Google Cloud Functions (GCF). */
    GCP_CLOUD_FUNCTIONS: 'gcp_cloud_functions',
    /** Google Cloud App Engine (GAE). */
    GCP_APP_ENGINE: 'gcp_app_engine',
};
exports.AwsEcsLaunchtypeValues = {
    /** ec2. */
    EC2: 'ec2',
    /** fargate. */
    FARGATE: 'fargate',
};
exports.HostArchValues = {
    /** AMD64. */
    AMD64: 'amd64',
    /** ARM32. */
    ARM32: 'arm32',
    /** ARM64. */
    ARM64: 'arm64',
    /** Itanium. */
    IA64: 'ia64',
    /** 32-bit PowerPC. */
    PPC32: 'ppc32',
    /** 64-bit PowerPC. */
    PPC64: 'ppc64',
    /** 32-bit x86. */
    X86: 'x86',
};
exports.OsTypeValues = {
    /** Microsoft Windows. */
    WINDOWS: 'windows',
    /** Linux. */
    LINUX: 'linux',
    /** Apple Darwin. */
    DARWIN: 'darwin',
    /** FreeBSD. */
    FREEBSD: 'freebsd',
    /** NetBSD. */
    NETBSD: 'netbsd',
    /** OpenBSD. */
    OPENBSD: 'openbsd',
    /** DragonFly BSD. */
    DRAGONFLYBSD: 'dragonflybsd',
    /** HP-UX (Hewlett Packard Unix). */
    HPUX: 'hpux',
    /** AIX (Advanced Interactive eXecutive). */
    AIX: 'aix',
    /** Oracle Solaris. */
    SOLARIS: 'solaris',
    /** IBM z/OS. */
    Z_OS: 'z_os',
};
exports.TelemetrySdkLanguageValues = {
    /** cpp. */
    CPP: 'cpp',
    /** dotnet. */
    DOTNET: 'dotnet',
    /** erlang. */
    ERLANG: 'erlang',
    /** go. */
    GO: 'go',
    /** java. */
    JAVA: 'java',
    /** nodejs. */
    NODEJS: 'nodejs',
    /** php. */
    PHP: 'php',
    /** python. */
    PYTHON: 'python',
    /** ruby. */
    RUBY: 'ruby',
    /** webjs. */
    WEBJS: 'webjs',
};

},{}],385:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
__exportStar(require("./SemanticResourceAttributes"), exports);

},{"./SemanticResourceAttributes":384}],386:[function(require,module,exports){
"use strict";
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageTypeValues = exports.RpcGrpcStatusCodeValues = exports.MessagingOperationValues = exports.MessagingDestinationKindValues = exports.HttpFlavorValues = exports.NetHostConnectionSubtypeValues = exports.NetHostConnectionTypeValues = exports.NetTransportValues = exports.FaasInvokedProviderValues = exports.FaasDocumentOperationValues = exports.FaasTriggerValues = exports.DbCassandraConsistencyLevelValues = exports.DbSystemValues = exports.SemanticAttributes = void 0;
// DO NOT EDIT, this is an Auto-generated file from scripts/semconv/templates//templates/SemanticAttributes.ts.j2
exports.SemanticAttributes = {
    /**
    * The full invoked ARN as provided on the `Context` passed to the function (`Lambda-Runtime-Invoked-Function-Arn` header on the `/runtime/invocation/next` applicable).
    *
    * Note: This may be different from `faas.id` if an alias is involved.
    */
    AWS_LAMBDA_INVOKED_ARN: 'aws.lambda.invoked_arn',
    /**
    * An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
    */
    DB_SYSTEM: 'db.system',
    /**
    * The connection string used to connect to the database. It is recommended to remove embedded credentials.
    */
    DB_CONNECTION_STRING: 'db.connection_string',
    /**
    * Username for accessing the database.
    */
    DB_USER: 'db.user',
    /**
    * The fully-qualified class name of the [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) driver used to connect.
    */
    DB_JDBC_DRIVER_CLASSNAME: 'db.jdbc.driver_classname',
    /**
    * If no [tech-specific attribute](#call-level-attributes-for-specific-technologies) is defined, this attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).
    *
    * Note: In some SQL databases, the database name to be used is called &#34;schema name&#34;.
    */
    DB_NAME: 'db.name',
    /**
    * The database statement being executed.
    *
    * Note: The value may be sanitized to exclude sensitive information.
    */
    DB_STATEMENT: 'db.statement',
    /**
    * The name of the operation being executed, e.g. the [MongoDB command name](https://docs.mongodb.com/manual/reference/command/#database-operations) such as `findAndModify`, or the SQL keyword.
    *
    * Note: When setting this to an SQL keyword, it is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if the operation name is provided by the library being instrumented. If the SQL statement has an ambiguous operation, or performs more than one operation, this value may be omitted.
    */
    DB_OPERATION: 'db.operation',
    /**
    * The Microsoft SQL Server [instance name](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) connecting to. This name is used to determine the port of a named instance.
    *
    * Note: If setting a `db.mssql.instance_name`, `net.peer.port` is no longer required (but still recommended if non-standard).
    */
    DB_MSSQL_INSTANCE_NAME: 'db.mssql.instance_name',
    /**
    * The name of the keyspace being accessed. To be used instead of the generic `db.name` attribute.
    */
    DB_CASSANDRA_KEYSPACE: 'db.cassandra.keyspace',
    /**
    * The fetch size used for paging, i.e. how many rows will be returned at once.
    */
    DB_CASSANDRA_PAGE_SIZE: 'db.cassandra.page_size',
    /**
    * The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
    */
    DB_CASSANDRA_CONSISTENCY_LEVEL: 'db.cassandra.consistency_level',
    /**
    * The name of the primary table that the operation is acting upon, including the schema name (if applicable).
    *
    * Note: This mirrors the db.sql.table attribute but references cassandra rather than sql. It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
    */
    DB_CASSANDRA_TABLE: 'db.cassandra.table',
    /**
    * Whether or not the query is idempotent.
    */
    DB_CASSANDRA_IDEMPOTENCE: 'db.cassandra.idempotence',
    /**
    * The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
    */
    DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT: 'db.cassandra.speculative_execution_count',
    /**
    * The ID of the coordinating node for a query.
    */
    DB_CASSANDRA_COORDINATOR_ID: 'db.cassandra.coordinator.id',
    /**
    * The data center of the coordinating node for a query.
    */
    DB_CASSANDRA_COORDINATOR_DC: 'db.cassandra.coordinator.dc',
    /**
    * The [HBase namespace](https://hbase.apache.org/book.html#_namespace) being accessed. To be used instead of the generic `db.name` attribute.
    */
    DB_HBASE_NAMESPACE: 'db.hbase.namespace',
    /**
    * The index of the database being accessed as used in the [`SELECT` command](https://redis.io/commands/select), provided as an integer. To be used instead of the generic `db.name` attribute.
    */
    DB_REDIS_DATABASE_INDEX: 'db.redis.database_index',
    /**
    * The collection being accessed within the database stated in `db.name`.
    */
    DB_MONGODB_COLLECTION: 'db.mongodb.collection',
    /**
    * The name of the primary table that the operation is acting upon, including the schema name (if applicable).
    *
    * Note: It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
    */
    DB_SQL_TABLE: 'db.sql.table',
    /**
    * The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
    */
    EXCEPTION_TYPE: 'exception.type',
    /**
    * The exception message.
    */
    EXCEPTION_MESSAGE: 'exception.message',
    /**
    * A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
    */
    EXCEPTION_STACKTRACE: 'exception.stacktrace',
    /**
    * SHOULD be set to true if the exception event is recorded at a point where it is known that the exception is escaping the scope of the span.
    *
    * Note: An exception is considered to have escaped (or left) the scope of a span,
  if that span is ended while the exception is still logically &#34;in flight&#34;.
  This may be actually &#34;in flight&#34; in some languages (e.g. if the exception
  is passed to a Context manager&#39;s `__exit__` method in Python) but will
  usually be caught at the point of recording the exception in most languages.
  
  It is usually not possible to determine at the point where an exception is thrown
  whether it will escape the scope of a span.
  However, it is trivial to know that an exception
  will escape, if one checks for an active exception just before ending the span,
  as done in the [example above](#exception-end-example).
  
  It follows that an exception may still escape the scope of the span
  even if the `exception.escaped` attribute was not set or set to false,
  since the event might have been recorded at a time where it was not
  clear whether the exception will escape.
    */
    EXCEPTION_ESCAPED: 'exception.escaped',
    /**
    * Type of the trigger on which the function is executed.
    */
    FAAS_TRIGGER: 'faas.trigger',
    /**
    * The execution ID of the current function execution.
    */
    FAAS_EXECUTION: 'faas.execution',
    /**
    * The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
    */
    FAAS_DOCUMENT_COLLECTION: 'faas.document.collection',
    /**
    * Describes the type of the operation that was performed on the data.
    */
    FAAS_DOCUMENT_OPERATION: 'faas.document.operation',
    /**
    * A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
    */
    FAAS_DOCUMENT_TIME: 'faas.document.time',
    /**
    * The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
    */
    FAAS_DOCUMENT_NAME: 'faas.document.name',
    /**
    * A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
    */
    FAAS_TIME: 'faas.time',
    /**
    * A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
    */
    FAAS_CRON: 'faas.cron',
    /**
    * A boolean that is true if the serverless function is executed for the first time (aka cold-start).
    */
    FAAS_COLDSTART: 'faas.coldstart',
    /**
    * The name of the invoked function.
    *
    * Note: SHOULD be equal to the `faas.name` resource attribute of the invoked function.
    */
    FAAS_INVOKED_NAME: 'faas.invoked_name',
    /**
    * The cloud provider of the invoked function.
    *
    * Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
    */
    FAAS_INVOKED_PROVIDER: 'faas.invoked_provider',
    /**
    * The cloud region of the invoked function.
    *
    * Note: SHOULD be equal to the `cloud.region` resource attribute of the invoked function.
    */
    FAAS_INVOKED_REGION: 'faas.invoked_region',
    /**
    * Transport protocol used. See note below.
    */
    NET_TRANSPORT: 'net.transport',
    /**
    * Remote address of the peer (dotted decimal for IPv4 or [RFC5952](https://tools.ietf.org/html/rfc5952) for IPv6).
    */
    NET_PEER_IP: 'net.peer.ip',
    /**
    * Remote port number.
    */
    NET_PEER_PORT: 'net.peer.port',
    /**
    * Remote hostname or similar, see note below.
    */
    NET_PEER_NAME: 'net.peer.name',
    /**
    * Like `net.peer.ip` but for the host IP. Useful in case of a multi-IP host.
    */
    NET_HOST_IP: 'net.host.ip',
    /**
    * Like `net.peer.port` but for the host port.
    */
    NET_HOST_PORT: 'net.host.port',
    /**
    * Local hostname or similar, see note below.
    */
    NET_HOST_NAME: 'net.host.name',
    /**
    * The internet connection type currently being used by the host.
    */
    NET_HOST_CONNECTION_TYPE: 'net.host.connection.type',
    /**
    * This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
    */
    NET_HOST_CONNECTION_SUBTYPE: 'net.host.connection.subtype',
    /**
    * The name of the mobile carrier.
    */
    NET_HOST_CARRIER_NAME: 'net.host.carrier.name',
    /**
    * The mobile carrier country code.
    */
    NET_HOST_CARRIER_MCC: 'net.host.carrier.mcc',
    /**
    * The mobile carrier network code.
    */
    NET_HOST_CARRIER_MNC: 'net.host.carrier.mnc',
    /**
    * The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
    */
    NET_HOST_CARRIER_ICC: 'net.host.carrier.icc',
    /**
    * The [`service.name`](../../resource/semantic_conventions/README.md#service) of the remote service. SHOULD be equal to the actual `service.name` resource attribute of the remote service if any.
    */
    PEER_SERVICE: 'peer.service',
    /**
    * Username or client_id extracted from the access token or [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) header in the inbound request from outside the system.
    */
    ENDUSER_ID: 'enduser.id',
    /**
    * Actual/assumed role the client is making the request under extracted from token or application security context.
    */
    ENDUSER_ROLE: 'enduser.role',
    /**
    * Scopes or granted authorities the client currently possesses extracted from token or application security context. The value would come from the scope associated with an [OAuth 2.0 Access Token](https://tools.ietf.org/html/rfc6749#section-3.3) or an attribute value in a [SAML 2.0 Assertion](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).
    */
    ENDUSER_SCOPE: 'enduser.scope',
    /**
    * Current &#34;managed&#34; thread ID (as opposed to OS thread ID).
    */
    THREAD_ID: 'thread.id',
    /**
    * Current thread name.
    */
    THREAD_NAME: 'thread.name',
    /**
    * The method or function name, or equivalent (usually rightmost part of the code unit&#39;s name).
    */
    CODE_FUNCTION: 'code.function',
    /**
    * The &#34;namespace&#34; within which `code.function` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function` form a unique identifier for the code unit.
    */
    CODE_NAMESPACE: 'code.namespace',
    /**
    * The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
    */
    CODE_FILEPATH: 'code.filepath',
    /**
    * The line number in `code.filepath` best representing the operation. It SHOULD point within the code unit named in `code.function`.
    */
    CODE_LINENO: 'code.lineno',
    /**
    * HTTP request method.
    */
    HTTP_METHOD: 'http.method',
    /**
    * Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.
    *
    * Note: `http.url` MUST NOT contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case the attribute&#39;s value should be `https://www.example.com/`.
    */
    HTTP_URL: 'http.url',
    /**
    * The full request target as passed in a HTTP request line or equivalent.
    */
    HTTP_TARGET: 'http.target',
    /**
    * The value of the [HTTP host header](https://tools.ietf.org/html/rfc7230#section-5.4). An empty Host header should also be reported, see note.
    *
    * Note: When the header is present but empty the attribute SHOULD be set to the empty string. Note that this is a valid situation that is expected in certain cases, according the aforementioned [section of RFC 7230](https://tools.ietf.org/html/rfc7230#section-5.4). When the header is not set the attribute MUST NOT be set.
    */
    HTTP_HOST: 'http.host',
    /**
    * The URI scheme identifying the used protocol.
    */
    HTTP_SCHEME: 'http.scheme',
    /**
    * [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
    */
    HTTP_STATUS_CODE: 'http.status_code',
    /**
    * Kind of HTTP protocol used.
    *
    * Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
    */
    HTTP_FLAVOR: 'http.flavor',
    /**
    * Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client.
    */
    HTTP_USER_AGENT: 'http.user_agent',
    /**
    * The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
    */
    HTTP_REQUEST_CONTENT_LENGTH: 'http.request_content_length',
    /**
    * The size of the uncompressed request payload body after transport decoding. Not set if transport encoding not used.
    */
    HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED: 'http.request_content_length_uncompressed',
    /**
    * The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
    */
    HTTP_RESPONSE_CONTENT_LENGTH: 'http.response_content_length',
    /**
    * The size of the uncompressed response payload body after transport decoding. Not set if transport encoding not used.
    */
    HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED: 'http.response_content_length_uncompressed',
    /**
    * The primary server name of the matched virtual host. This should be obtained via configuration. If no such configuration can be obtained, this attribute MUST NOT be set ( `net.host.name` should be used instead).
    *
    * Note: `http.url` is usually not readily available on the server side but would have to be assembled in a cumbersome and sometimes lossy process from other information (see e.g. open-telemetry/opentelemetry-python/pull/148). It is thus preferred to supply the raw data that is available.
    */
    HTTP_SERVER_NAME: 'http.server_name',
    /**
    * The matched route (path template).
    */
    HTTP_ROUTE: 'http.route',
    /**
    * The IP address of the original client behind all proxies, if known (e.g. from [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)).
    *
    * Note: This is not necessarily the same as `net.peer.ip`, which would
  identify the network-level peer, which may be a proxy.
  
  This attribute should be set when a source of information different
  from the one used for `net.peer.ip`, is available even if that other
  source just confirms the same value as `net.peer.ip`.
  Rationale: For `net.peer.ip`, one typically does not know if it
  comes from a proxy, reverse proxy, or the actual client. Setting
  `http.client_ip` when it&#39;s the same as `net.peer.ip` means that
  one is at least somewhat confident that the address is not that of
  the closest proxy.
    */
    HTTP_CLIENT_IP: 'http.client_ip',
    /**
    * The keys in the `RequestItems` object field.
    */
    AWS_DYNAMODB_TABLE_NAMES: 'aws.dynamodb.table_names',
    /**
    * The JSON-serialized value of each item in the `ConsumedCapacity` response field.
    */
    AWS_DYNAMODB_CONSUMED_CAPACITY: 'aws.dynamodb.consumed_capacity',
    /**
    * The JSON-serialized value of the `ItemCollectionMetrics` response field.
    */
    AWS_DYNAMODB_ITEM_COLLECTION_METRICS: 'aws.dynamodb.item_collection_metrics',
    /**
    * The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
    */
    AWS_DYNAMODB_PROVISIONED_READ_CAPACITY: 'aws.dynamodb.provisioned_read_capacity',
    /**
    * The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
    */
    AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY: 'aws.dynamodb.provisioned_write_capacity',
    /**
    * The value of the `ConsistentRead` request parameter.
    */
    AWS_DYNAMODB_CONSISTENT_READ: 'aws.dynamodb.consistent_read',
    /**
    * The value of the `ProjectionExpression` request parameter.
    */
    AWS_DYNAMODB_PROJECTION: 'aws.dynamodb.projection',
    /**
    * The value of the `Limit` request parameter.
    */
    AWS_DYNAMODB_LIMIT: 'aws.dynamodb.limit',
    /**
    * The value of the `AttributesToGet` request parameter.
    */
    AWS_DYNAMODB_ATTRIBUTES_TO_GET: 'aws.dynamodb.attributes_to_get',
    /**
    * The value of the `IndexName` request parameter.
    */
    AWS_DYNAMODB_INDEX_NAME: 'aws.dynamodb.index_name',
    /**
    * The value of the `Select` request parameter.
    */
    AWS_DYNAMODB_SELECT: 'aws.dynamodb.select',
    /**
    * The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field.
    */
    AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES: 'aws.dynamodb.global_secondary_indexes',
    /**
    * The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
    */
    AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES: 'aws.dynamodb.local_secondary_indexes',
    /**
    * The value of the `ExclusiveStartTableName` request parameter.
    */
    AWS_DYNAMODB_EXCLUSIVE_START_TABLE: 'aws.dynamodb.exclusive_start_table',
    /**
    * The the number of items in the `TableNames` response parameter.
    */
    AWS_DYNAMODB_TABLE_COUNT: 'aws.dynamodb.table_count',
    /**
    * The value of the `ScanIndexForward` request parameter.
    */
    AWS_DYNAMODB_SCAN_FORWARD: 'aws.dynamodb.scan_forward',
    /**
    * The value of the `Segment` request parameter.
    */
    AWS_DYNAMODB_SEGMENT: 'aws.dynamodb.segment',
    /**
    * The value of the `TotalSegments` request parameter.
    */
    AWS_DYNAMODB_TOTAL_SEGMENTS: 'aws.dynamodb.total_segments',
    /**
    * The value of the `Count` response parameter.
    */
    AWS_DYNAMODB_COUNT: 'aws.dynamodb.count',
    /**
    * The value of the `ScannedCount` response parameter.
    */
    AWS_DYNAMODB_SCANNED_COUNT: 'aws.dynamodb.scanned_count',
    /**
    * The JSON-serialized value of each item in the `AttributeDefinitions` request field.
    */
    AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS: 'aws.dynamodb.attribute_definitions',
    /**
    * The JSON-serialized value of each item in the the `GlobalSecondaryIndexUpdates` request field.
    */
    AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES: 'aws.dynamodb.global_secondary_index_updates',
    /**
    * A string identifying the messaging system.
    */
    MESSAGING_SYSTEM: 'messaging.system',
    /**
    * The message destination name. This might be equal to the span name but is required nevertheless.
    */
    MESSAGING_DESTINATION: 'messaging.destination',
    /**
    * The kind of message destination.
    */
    MESSAGING_DESTINATION_KIND: 'messaging.destination_kind',
    /**
    * A boolean that is true if the message destination is temporary.
    */
    MESSAGING_TEMP_DESTINATION: 'messaging.temp_destination',
    /**
    * The name of the transport protocol.
    */
    MESSAGING_PROTOCOL: 'messaging.protocol',
    /**
    * The version of the transport protocol.
    */
    MESSAGING_PROTOCOL_VERSION: 'messaging.protocol_version',
    /**
    * Connection string.
    */
    MESSAGING_URL: 'messaging.url',
    /**
    * A value used by the messaging system as an identifier for the message, represented as a string.
    */
    MESSAGING_MESSAGE_ID: 'messaging.message_id',
    /**
    * The [conversation ID](#conversations) identifying the conversation to which the message belongs, represented as a string. Sometimes called &#34;Correlation ID&#34;.
    */
    MESSAGING_CONVERSATION_ID: 'messaging.conversation_id',
    /**
    * The (uncompressed) size of the message payload in bytes. Also use this attribute if it is unknown whether the compressed or uncompressed payload size is reported.
    */
    MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES: 'messaging.message_payload_size_bytes',
    /**
    * The compressed size of the message payload in bytes.
    */
    MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES: 'messaging.message_payload_compressed_size_bytes',
    /**
    * A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
    */
    MESSAGING_OPERATION: 'messaging.operation',
    /**
    * The identifier for the consumer receiving a message. For Kafka, set it to `{messaging.kafka.consumer_group} - {messaging.kafka.client_id}`, if both are present, or only `messaging.kafka.consumer_group`. For brokers, such as RabbitMQ and Artemis, set it to the `client_id` of the client consuming the message.
    */
    MESSAGING_CONSUMER_ID: 'messaging.consumer_id',
    /**
    * RabbitMQ message routing key.
    */
    MESSAGING_RABBITMQ_ROUTING_KEY: 'messaging.rabbitmq.routing_key',
    /**
    * Message keys in Kafka are used for grouping alike messages to ensure they&#39;re processed on the same partition. They differ from `messaging.message_id` in that they&#39;re not unique. If the key is `null`, the attribute MUST NOT be set.
    *
    * Note: If the key type is not string, it&#39;s string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don&#39;t include its value.
    */
    MESSAGING_KAFKA_MESSAGE_KEY: 'messaging.kafka.message_key',
    /**
    * Name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.
    */
    MESSAGING_KAFKA_CONSUMER_GROUP: 'messaging.kafka.consumer_group',
    /**
    * Client Id for the Consumer or Producer that is handling the message.
    */
    MESSAGING_KAFKA_CLIENT_ID: 'messaging.kafka.client_id',
    /**
    * Partition the message is sent to.
    */
    MESSAGING_KAFKA_PARTITION: 'messaging.kafka.partition',
    /**
    * A boolean that is true if the message is a tombstone.
    */
    MESSAGING_KAFKA_TOMBSTONE: 'messaging.kafka.tombstone',
    /**
    * A string identifying the remoting system.
    */
    RPC_SYSTEM: 'rpc.system',
    /**
    * The full (logical) name of the service being called, including its package name, if applicable.
    *
    * Note: This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
    */
    RPC_SERVICE: 'rpc.service',
    /**
    * The name of the (logical) method being called, must be equal to the $method part in the span name.
    *
    * Note: This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
    */
    RPC_METHOD: 'rpc.method',
    /**
    * The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
    */
    RPC_GRPC_STATUS_CODE: 'rpc.grpc.status_code',
    /**
    * Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 does not specify this, the value can be omitted.
    */
    RPC_JSONRPC_VERSION: 'rpc.jsonrpc.version',
    /**
    * `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
    */
    RPC_JSONRPC_REQUEST_ID: 'rpc.jsonrpc.request_id',
    /**
    * `error.code` property of response if it is an error response.
    */
    RPC_JSONRPC_ERROR_CODE: 'rpc.jsonrpc.error_code',
    /**
    * `error.message` property of response if it is an error response.
    */
    RPC_JSONRPC_ERROR_MESSAGE: 'rpc.jsonrpc.error_message',
    /**
    * Whether this is a received or sent message.
    */
    MESSAGE_TYPE: 'message.type',
    /**
    * MUST be calculated as two different counters starting from `1` one for sent messages and one for received message.
    *
    * Note: This way we guarantee that the values will be consistent between different implementations.
    */
    MESSAGE_ID: 'message.id',
    /**
    * Compressed size of the message in bytes.
    */
    MESSAGE_COMPRESSED_SIZE: 'message.compressed_size',
    /**
    * Uncompressed size of the message in bytes.
    */
    MESSAGE_UNCOMPRESSED_SIZE: 'message.uncompressed_size',
};
exports.DbSystemValues = {
    /** Some other SQL database. Fallback only. See notes. */
    OTHER_SQL: 'other_sql',
    /** Microsoft SQL Server. */
    MSSQL: 'mssql',
    /** MySQL. */
    MYSQL: 'mysql',
    /** Oracle Database. */
    ORACLE: 'oracle',
    /** IBM Db2. */
    DB2: 'db2',
    /** PostgreSQL. */
    POSTGRESQL: 'postgresql',
    /** Amazon Redshift. */
    REDSHIFT: 'redshift',
    /** Apache Hive. */
    HIVE: 'hive',
    /** Cloudscape. */
    CLOUDSCAPE: 'cloudscape',
    /** HyperSQL DataBase. */
    HSQLDB: 'hsqldb',
    /** Progress Database. */
    PROGRESS: 'progress',
    /** SAP MaxDB. */
    MAXDB: 'maxdb',
    /** SAP HANA. */
    HANADB: 'hanadb',
    /** Ingres. */
    INGRES: 'ingres',
    /** FirstSQL. */
    FIRSTSQL: 'firstsql',
    /** EnterpriseDB. */
    EDB: 'edb',
    /** InterSystems Caché. */
    CACHE: 'cache',
    /** Adabas (Adaptable Database System). */
    ADABAS: 'adabas',
    /** Firebird. */
    FIREBIRD: 'firebird',
    /** Apache Derby. */
    DERBY: 'derby',
    /** FileMaker. */
    FILEMAKER: 'filemaker',
    /** Informix. */
    INFORMIX: 'informix',
    /** InstantDB. */
    INSTANTDB: 'instantdb',
    /** InterBase. */
    INTERBASE: 'interbase',
    /** MariaDB. */
    MARIADB: 'mariadb',
    /** Netezza. */
    NETEZZA: 'netezza',
    /** Pervasive PSQL. */
    PERVASIVE: 'pervasive',
    /** PointBase. */
    POINTBASE: 'pointbase',
    /** SQLite. */
    SQLITE: 'sqlite',
    /** Sybase. */
    SYBASE: 'sybase',
    /** Teradata. */
    TERADATA: 'teradata',
    /** Vertica. */
    VERTICA: 'vertica',
    /** H2. */
    H2: 'h2',
    /** ColdFusion IMQ. */
    COLDFUSION: 'coldfusion',
    /** Apache Cassandra. */
    CASSANDRA: 'cassandra',
    /** Apache HBase. */
    HBASE: 'hbase',
    /** MongoDB. */
    MONGODB: 'mongodb',
    /** Redis. */
    REDIS: 'redis',
    /** Couchbase. */
    COUCHBASE: 'couchbase',
    /** CouchDB. */
    COUCHDB: 'couchdb',
    /** Microsoft Azure Cosmos DB. */
    COSMOSDB: 'cosmosdb',
    /** Amazon DynamoDB. */
    DYNAMODB: 'dynamodb',
    /** Neo4j. */
    NEO4J: 'neo4j',
    /** Apache Geode. */
    GEODE: 'geode',
    /** Elasticsearch. */
    ELASTICSEARCH: 'elasticsearch',
    /** Memcached. */
    MEMCACHED: 'memcached',
    /** CockroachDB. */
    COCKROACHDB: 'cockroachdb',
};
exports.DbCassandraConsistencyLevelValues = {
    /** all. */
    ALL: 'all',
    /** each_quorum. */
    EACH_QUORUM: 'each_quorum',
    /** quorum. */
    QUORUM: 'quorum',
    /** local_quorum. */
    LOCAL_QUORUM: 'local_quorum',
    /** one. */
    ONE: 'one',
    /** two. */
    TWO: 'two',
    /** three. */
    THREE: 'three',
    /** local_one. */
    LOCAL_ONE: 'local_one',
    /** any. */
    ANY: 'any',
    /** serial. */
    SERIAL: 'serial',
    /** local_serial. */
    LOCAL_SERIAL: 'local_serial',
};
exports.FaasTriggerValues = {
    /** A response to some data source operation such as a database or filesystem read/write. */
    DATASOURCE: 'datasource',
    /** To provide an answer to an inbound HTTP request. */
    HTTP: 'http',
    /** A function is set to be executed when messages are sent to a messaging system. */
    PUBSUB: 'pubsub',
    /** A function is scheduled to be executed regularly. */
    TIMER: 'timer',
    /** If none of the others apply. */
    OTHER: 'other',
};
exports.FaasDocumentOperationValues = {
    /** When a new object is created. */
    INSERT: 'insert',
    /** When an object is modified. */
    EDIT: 'edit',
    /** When an object is deleted. */
    DELETE: 'delete',
};
exports.FaasInvokedProviderValues = {
    /** Alibaba Cloud. */
    ALIBABA_CLOUD: 'alibaba_cloud',
    /** Amazon Web Services. */
    AWS: 'aws',
    /** Microsoft Azure. */
    AZURE: 'azure',
    /** Google Cloud Platform. */
    GCP: 'gcp',
};
exports.NetTransportValues = {
    /** ip_tcp. */
    IP_TCP: 'ip_tcp',
    /** ip_udp. */
    IP_UDP: 'ip_udp',
    /** Another IP-based protocol. */
    IP: 'ip',
    /** Unix Domain socket. See below. */
    UNIX: 'unix',
    /** Named or anonymous pipe. See note below. */
    PIPE: 'pipe',
    /** In-process communication. */
    INPROC: 'inproc',
    /** Something else (non IP-based). */
    OTHER: 'other',
};
exports.NetHostConnectionTypeValues = {
    /** wifi. */
    WIFI: 'wifi',
    /** wired. */
    WIRED: 'wired',
    /** cell. */
    CELL: 'cell',
    /** unavailable. */
    UNAVAILABLE: 'unavailable',
    /** unknown. */
    UNKNOWN: 'unknown',
};
exports.NetHostConnectionSubtypeValues = {
    /** GPRS. */
    GPRS: 'gprs',
    /** EDGE. */
    EDGE: 'edge',
    /** UMTS. */
    UMTS: 'umts',
    /** CDMA. */
    CDMA: 'cdma',
    /** EVDO Rel. 0. */
    EVDO_0: 'evdo_0',
    /** EVDO Rev. A. */
    EVDO_A: 'evdo_a',
    /** CDMA2000 1XRTT. */
    CDMA2000_1XRTT: 'cdma2000_1xrtt',
    /** HSDPA. */
    HSDPA: 'hsdpa',
    /** HSUPA. */
    HSUPA: 'hsupa',
    /** HSPA. */
    HSPA: 'hspa',
    /** IDEN. */
    IDEN: 'iden',
    /** EVDO Rev. B. */
    EVDO_B: 'evdo_b',
    /** LTE. */
    LTE: 'lte',
    /** EHRPD. */
    EHRPD: 'ehrpd',
    /** HSPAP. */
    HSPAP: 'hspap',
    /** GSM. */
    GSM: 'gsm',
    /** TD-SCDMA. */
    TD_SCDMA: 'td_scdma',
    /** IWLAN. */
    IWLAN: 'iwlan',
    /** 5G NR (New Radio). */
    NR: 'nr',
    /** 5G NRNSA (New Radio Non-Standalone). */
    NRNSA: 'nrnsa',
    /** LTE CA. */
    LTE_CA: 'lte_ca',
};
exports.HttpFlavorValues = {
    /** HTTP 1.0. */
    HTTP_1_0: '1.0',
    /** HTTP 1.1. */
    HTTP_1_1: '1.1',
    /** HTTP 2. */
    HTTP_2_0: '2.0',
    /** SPDY protocol. */
    SPDY: 'SPDY',
    /** QUIC protocol. */
    QUIC: 'QUIC',
};
exports.MessagingDestinationKindValues = {
    /** A message sent to a queue. */
    QUEUE: 'queue',
    /** A message sent to a topic. */
    TOPIC: 'topic',
};
exports.MessagingOperationValues = {
    /** receive. */
    RECEIVE: 'receive',
    /** process. */
    PROCESS: 'process',
};
exports.RpcGrpcStatusCodeValues = {
    /** OK. */
    OK: 0,
    /** CANCELLED. */
    CANCELLED: 1,
    /** UNKNOWN. */
    UNKNOWN: 2,
    /** INVALID_ARGUMENT. */
    INVALID_ARGUMENT: 3,
    /** DEADLINE_EXCEEDED. */
    DEADLINE_EXCEEDED: 4,
    /** NOT_FOUND. */
    NOT_FOUND: 5,
    /** ALREADY_EXISTS. */
    ALREADY_EXISTS: 6,
    /** PERMISSION_DENIED. */
    PERMISSION_DENIED: 7,
    /** RESOURCE_EXHAUSTED. */
    RESOURCE_EXHAUSTED: 8,
    /** FAILED_PRECONDITION. */
    FAILED_PRECONDITION: 9,
    /** ABORTED. */
    ABORTED: 10,
    /** OUT_OF_RANGE. */
    OUT_OF_RANGE: 11,
    /** UNIMPLEMENTED. */
    UNIMPLEMENTED: 12,
    /** INTERNAL. */
    INTERNAL: 13,
    /** UNAVAILABLE. */
    UNAVAILABLE: 14,
    /** DATA_LOSS. */
    DATA_LOSS: 15,
    /** UNAUTHENTICATED. */
    UNAUTHENTICATED: 16,
};
exports.MessageTypeValues = {
    /** sent. */
    SENT: 'SENT',
    /** received. */
    RECEIVED: 'RECEIVED',
};

},{}],387:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
__exportStar(require("./SemanticAttributes"), exports);

},{"./SemanticAttributes":386}],388:[function(require,module,exports){
'use strict'

function isFunction (funktion) {
  return typeof funktion === 'function'
}

// Default to complaining loudly when things don't go according to plan.
var logger = console.error.bind(console)

// Sets a property on an object, preserving its enumerability.
// This function assumes that the property is already writable.
function defineProperty (obj, name, value) {
  var enumerable = !!obj[name] && obj.propertyIsEnumerable(name)
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: enumerable,
    writable: true,
    value: value
  })
}

// Keep initialization idempotent.
function shimmer (options) {
  if (options && options.logger) {
    if (!isFunction(options.logger)) logger("new logger isn't a function, not replacing")
    else logger = options.logger
  }
}

function wrap (nodule, name, wrapper) {
  if (!nodule || !nodule[name]) {
    logger('no original function ' + name + ' to wrap')
    return
  }

  if (!wrapper) {
    logger('no wrapper function')
    logger((new Error()).stack)
    return
  }

  if (!isFunction(nodule[name]) || !isFunction(wrapper)) {
    logger('original object and wrapper must be functions')
    return
  }

  var original = nodule[name]
  var wrapped = wrapper(original, name)

  defineProperty(wrapped, '__original', original)
  defineProperty(wrapped, '__unwrap', function () {
    if (nodule[name] === wrapped) defineProperty(nodule, name, original)
  })
  defineProperty(wrapped, '__wrapped', true)

  defineProperty(nodule, name, wrapped)
  return wrapped
}

function massWrap (nodules, names, wrapper) {
  if (!nodules) {
    logger('must provide one or more modules to patch')
    logger((new Error()).stack)
    return
  } else if (!Array.isArray(nodules)) {
    nodules = [nodules]
  }

  if (!(names && Array.isArray(names))) {
    logger('must provide one or more functions to wrap on modules')
    return
  }

  nodules.forEach(function (nodule) {
    names.forEach(function (name) {
      wrap(nodule, name, wrapper)
    })
  })
}

function unwrap (nodule, name) {
  if (!nodule || !nodule[name]) {
    logger('no function to unwrap.')
    logger((new Error()).stack)
    return
  }

  if (!nodule[name].__unwrap) {
    logger('no original to unwrap to -- has ' + name + ' already been unwrapped?')
  } else {
    return nodule[name].__unwrap()
  }
}

function massUnwrap (nodules, names) {
  if (!nodules) {
    logger('must provide one or more modules to patch')
    logger((new Error()).stack)
    return
  } else if (!Array.isArray(nodules)) {
    nodules = [nodules]
  }

  if (!(names && Array.isArray(names))) {
    logger('must provide one or more functions to unwrap on modules')
    return
  }

  nodules.forEach(function (nodule) {
    names.forEach(function (name) {
      unwrap(nodule, name)
    })
  })
}

shimmer.wrap = wrap
shimmer.massWrap = massWrap
shimmer.unwrap = unwrap
shimmer.massUnwrap = massUnwrap

module.exports = shimmer

},{}],389:[function(require,module,exports){
(function (global){(function (){
'use strict';
/**
 * @license Angular v12.0.0-next.0
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */
(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
        factory();
}((function () {
    'use strict';
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var Zone$1 = (function (global) {
        var performance = global['performance'];
        function mark(name) {
            performance && performance['mark'] && performance['mark'](name);
        }
        function performanceMeasure(name, label) {
            performance && performance['measure'] && performance['measure'](name, label);
        }
        mark('Zone');
        // Initialize before it's accessed below.
        // __Zone_symbol_prefix global can be used to override the default zone
        // symbol prefix with a custom one if needed.
        var symbolPrefix = global['__Zone_symbol_prefix'] || '__zone_symbol__';
        function __symbol__(name) {
            return symbolPrefix + name;
        }
        var checkDuplicate = global[__symbol__('forceDuplicateZoneCheck')] === true;
        if (global['Zone']) {
            // if global['Zone'] already exists (maybe zone.js was already loaded or
            // some other lib also registered a global object named Zone), we may need
            // to throw an error, but sometimes user may not want this error.
            // For example,
            // we have two web pages, page1 includes zone.js, page2 doesn't.
            // and the 1st time user load page1 and page2, everything work fine,
            // but when user load page2 again, error occurs because global['Zone'] already exists.
            // so we add a flag to let user choose whether to throw this error or not.
            // By default, if existing Zone is from zone.js, we will not throw the error.
            if (checkDuplicate || typeof global['Zone'].__symbol__ !== 'function') {
                throw new Error('Zone already loaded.');
            }
            else {
                return global['Zone'];
            }
        }
        var Zone = /** @class */ (function () {
            function Zone(parent, zoneSpec) {
                this._parent = parent;
                this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
                this._properties = zoneSpec && zoneSpec.properties || {};
                this._zoneDelegate =
                    new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
            }
            Zone.assertZonePatched = function () {
                if (global['Promise'] !== patches['ZoneAwarePromise']) {
                    throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                        'has been overwritten.\n' +
                        'Most likely cause is that a Promise polyfill has been loaded ' +
                        'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                        'If you must load one, do so before loading zone.js.)');
                }
            };
            Object.defineProperty(Zone, "root", {
                get: function () {
                    var zone = Zone.current;
                    while (zone.parent) {
                        zone = zone.parent;
                    }
                    return zone;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Zone, "current", {
                get: function () {
                    return _currentZoneFrame.zone;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Zone, "currentTask", {
                get: function () {
                    return _currentTask;
                },
                enumerable: false,
                configurable: true
            });
            // tslint:disable-next-line:require-internal-with-underscore
            Zone.__load_patch = function (name, fn, ignoreDuplicate) {
                if (ignoreDuplicate === void 0) { ignoreDuplicate = false; }
                if (patches.hasOwnProperty(name)) {
                    // `checkDuplicate` option is defined from global variable
                    // so it works for all modules.
                    // `ignoreDuplicate` can work for the specified module
                    if (!ignoreDuplicate && checkDuplicate) {
                        throw Error('Already loaded patch: ' + name);
                    }
                }
                else if (!global['__Zone_disable_' + name]) {
                    var perfName = 'Zone:' + name;
                    mark(perfName);
                    patches[name] = fn(global, Zone, _api);
                    performanceMeasure(perfName, perfName);
                }
            };
            Object.defineProperty(Zone.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Zone.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: false,
                configurable: true
            });
            Zone.prototype.get = function (key) {
                var zone = this.getZoneWith(key);
                if (zone)
                    return zone._properties[key];
            };
            Zone.prototype.getZoneWith = function (key) {
                var current = this;
                while (current) {
                    if (current._properties.hasOwnProperty(key)) {
                        return current;
                    }
                    current = current._parent;
                }
                return null;
            };
            Zone.prototype.fork = function (zoneSpec) {
                if (!zoneSpec)
                    throw new Error('ZoneSpec required!');
                return this._zoneDelegate.fork(this, zoneSpec);
            };
            Zone.prototype.wrap = function (callback, source) {
                if (typeof callback !== 'function') {
                    throw new Error('Expecting function got: ' + callback);
                }
                var _callback = this._zoneDelegate.intercept(this, callback, source);
                var zone = this;
                return function () {
                    return zone.runGuarded(_callback, this, arguments, source);
                };
            };
            Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
                _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                finally {
                    _currentZoneFrame = _currentZoneFrame.parent;
                }
            };
            Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
                if (applyThis === void 0) { applyThis = null; }
                _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
                try {
                    try {
                        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                    }
                    catch (error) {
                        if (this._zoneDelegate.handleError(this, error)) {
                            throw error;
                        }
                    }
                }
                finally {
                    _currentZoneFrame = _currentZoneFrame.parent;
                }
            };
            Zone.prototype.runTask = function (task, applyThis, applyArgs) {
                if (task.zone != this) {
                    throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                        (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
                }
                // https://github.com/angular/zone.js/issues/778, sometimes eventTask
                // will run in notScheduled(canceled) state, we should not try to
                // run such kind of task but just return
                if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
                    return;
                }
                var reEntryGuard = task.state != running;
                reEntryGuard && task._transitionTo(running, scheduled);
                task.runCount++;
                var previousTask = _currentTask;
                _currentTask = task;
                _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
                try {
                    if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                        task.cancelFn = undefined;
                    }
                    try {
                        return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                    }
                    catch (error) {
                        if (this._zoneDelegate.handleError(this, error)) {
                            throw error;
                        }
                    }
                }
                finally {
                    // if the task's state is notScheduled or unknown, then it has already been cancelled
                    // we should not reset the state to scheduled
                    if (task.state !== notScheduled && task.state !== unknown) {
                        if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                            reEntryGuard && task._transitionTo(scheduled, running);
                        }
                        else {
                            task.runCount = 0;
                            this._updateTaskCount(task, -1);
                            reEntryGuard &&
                                task._transitionTo(notScheduled, running, notScheduled);
                        }
                    }
                    _currentZoneFrame = _currentZoneFrame.parent;
                    _currentTask = previousTask;
                }
            };
            Zone.prototype.scheduleTask = function (task) {
                if (task.zone && task.zone !== this) {
                    // check if the task was rescheduled, the newZone
                    // should not be the children of the original zone
                    var newZone = this;
                    while (newZone) {
                        if (newZone === task.zone) {
                            throw Error("can not reschedule task to " + this.name + " which is descendants of the original zone " + task.zone.name);
                        }
                        newZone = newZone.parent;
                    }
                }
                task._transitionTo(scheduling, notScheduled);
                var zoneDelegates = [];
                task._zoneDelegates = zoneDelegates;
                task._zone = this;
                try {
                    task = this._zoneDelegate.scheduleTask(this, task);
                }
                catch (err) {
                    // should set task's state to unknown when scheduleTask throw error
                    // because the err may from reschedule, so the fromState maybe notScheduled
                    task._transitionTo(unknown, scheduling, notScheduled);
                    // TODO: @JiaLiPassion, should we check the result from handleError?
                    this._zoneDelegate.handleError(this, err);
                    throw err;
                }
                if (task._zoneDelegates === zoneDelegates) {
                    // we have to check because internally the delegate can reschedule the task.
                    this._updateTaskCount(task, 1);
                }
                if (task.state == scheduling) {
                    task._transitionTo(scheduled, scheduling);
                }
                return task;
            };
            Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
                return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, undefined));
            };
            Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
                return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
            };
            Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
                return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
            };
            Zone.prototype.cancelTask = function (task) {
                if (task.zone != this)
                    throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                        (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
                task._transitionTo(canceling, scheduled, running);
                try {
                    this._zoneDelegate.cancelTask(this, task);
                }
                catch (err) {
                    // if error occurs when cancelTask, transit the state to unknown
                    task._transitionTo(unknown, canceling);
                    this._zoneDelegate.handleError(this, err);
                    throw err;
                }
                this._updateTaskCount(task, -1);
                task._transitionTo(notScheduled, canceling);
                task.runCount = 0;
                return task;
            };
            Zone.prototype._updateTaskCount = function (task, count) {
                var zoneDelegates = task._zoneDelegates;
                if (count == -1) {
                    task._zoneDelegates = null;
                }
                for (var i = 0; i < zoneDelegates.length; i++) {
                    zoneDelegates[i]._updateTaskCount(task.type, count);
                }
            };
            return Zone;
        }());
        // tslint:disable-next-line:require-internal-with-underscore
        Zone.__symbol__ = __symbol__;
        var DELEGATE_ZS = {
            name: '',
            onHasTask: function (delegate, _, target, hasTaskState) { return delegate.hasTask(target, hasTaskState); },
            onScheduleTask: function (delegate, _, target, task) { return delegate.scheduleTask(target, task); },
            onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) { return delegate.invokeTask(target, task, applyThis, applyArgs); },
            onCancelTask: function (delegate, _, target, task) { return delegate.cancelTask(target, task); }
        };
        var ZoneDelegate = /** @class */ (function () {
            function ZoneDelegate(zone, parentDelegate, zoneSpec) {
                this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
                this.zone = zone;
                this._parentDelegate = parentDelegate;
                this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
                this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
                this._forkCurrZone =
                    zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate._forkCurrZone);
                this._interceptZS =
                    zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
                this._interceptDlgt =
                    zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
                this._interceptCurrZone =
                    zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate._interceptCurrZone);
                this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
                this._invokeDlgt =
                    zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
                this._invokeCurrZone =
                    zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate._invokeCurrZone);
                this._handleErrorZS =
                    zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
                this._handleErrorDlgt =
                    zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
                this._handleErrorCurrZone =
                    zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate._handleErrorCurrZone);
                this._scheduleTaskZS =
                    zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
                this._scheduleTaskDlgt = zoneSpec &&
                    (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
                this._scheduleTaskCurrZone =
                    zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate._scheduleTaskCurrZone);
                this._invokeTaskZS =
                    zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
                this._invokeTaskDlgt =
                    zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
                this._invokeTaskCurrZone =
                    zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate._invokeTaskCurrZone);
                this._cancelTaskZS =
                    zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
                this._cancelTaskDlgt =
                    zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
                this._cancelTaskCurrZone =
                    zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate._cancelTaskCurrZone);
                this._hasTaskZS = null;
                this._hasTaskDlgt = null;
                this._hasTaskDlgtOwner = null;
                this._hasTaskCurrZone = null;
                var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
                var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
                if (zoneSpecHasTask || parentHasTask) {
                    // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                    // a case all task related interceptors must go through this ZD. We can't short circuit it.
                    this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                    this._hasTaskDlgt = parentDelegate;
                    this._hasTaskDlgtOwner = this;
                    this._hasTaskCurrZone = zone;
                    if (!zoneSpec.onScheduleTask) {
                        this._scheduleTaskZS = DELEGATE_ZS;
                        this._scheduleTaskDlgt = parentDelegate;
                        this._scheduleTaskCurrZone = this.zone;
                    }
                    if (!zoneSpec.onInvokeTask) {
                        this._invokeTaskZS = DELEGATE_ZS;
                        this._invokeTaskDlgt = parentDelegate;
                        this._invokeTaskCurrZone = this.zone;
                    }
                    if (!zoneSpec.onCancelTask) {
                        this._cancelTaskZS = DELEGATE_ZS;
                        this._cancelTaskDlgt = parentDelegate;
                        this._cancelTaskCurrZone = this.zone;
                    }
                }
            }
            ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
                return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                    new Zone(targetZone, zoneSpec);
            };
            ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
                return this._interceptZS ?
                    this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                    callback;
            };
            ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
                return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                    callback.apply(applyThis, applyArgs);
            };
            ZoneDelegate.prototype.handleError = function (targetZone, error) {
                return this._handleErrorZS ?
                    this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                    true;
            };
            ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
                var returnTask = task;
                if (this._scheduleTaskZS) {
                    if (this._hasTaskZS) {
                        returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                    }
                    // clang-format off
                    returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                    // clang-format on
                    if (!returnTask)
                        returnTask = task;
                }
                else {
                    if (task.scheduleFn) {
                        task.scheduleFn(task);
                    }
                    else if (task.type == microTask) {
                        scheduleMicroTask(task);
                    }
                    else {
                        throw new Error('Task is missing scheduleFn.');
                    }
                }
                return returnTask;
            };
            ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
                return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                    task.callback.apply(applyThis, applyArgs);
            };
            ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
                var value;
                if (this._cancelTaskZS) {
                    value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
                }
                else {
                    if (!task.cancelFn) {
                        throw Error('Task is not cancelable');
                    }
                    value = task.cancelFn(task);
                }
                return value;
            };
            ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
                // hasTask should not throw error so other ZoneDelegate
                // can still trigger hasTask callback
                try {
                    this._hasTaskZS &&
                        this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
                }
                catch (err) {
                    this.handleError(targetZone, err);
                }
            };
            // tslint:disable-next-line:require-internal-with-underscore
            ZoneDelegate.prototype._updateTaskCount = function (type, count) {
                var counts = this._taskCounts;
                var prev = counts[type];
                var next = counts[type] = prev + count;
                if (next < 0) {
                    throw new Error('More tasks executed then were scheduled.');
                }
                if (prev == 0 || next == 0) {
                    var isEmpty = {
                        microTask: counts['microTask'] > 0,
                        macroTask: counts['macroTask'] > 0,
                        eventTask: counts['eventTask'] > 0,
                        change: type
                    };
                    this.hasTask(this.zone, isEmpty);
                }
            };
            return ZoneDelegate;
        }());
        var ZoneTask = /** @class */ (function () {
            function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
                // tslint:disable-next-line:require-internal-with-underscore
                this._zone = null;
                this.runCount = 0;
                // tslint:disable-next-line:require-internal-with-underscore
                this._zoneDelegates = null;
                // tslint:disable-next-line:require-internal-with-underscore
                this._state = 'notScheduled';
                this.type = type;
                this.source = source;
                this.data = options;
                this.scheduleFn = scheduleFn;
                this.cancelFn = cancelFn;
                if (!callback) {
                    throw new Error('callback is not defined');
                }
                this.callback = callback;
                var self = this;
                // TODO: @JiaLiPassion options should have interface
                if (type === eventTask && options && options.useG) {
                    this.invoke = ZoneTask.invokeTask;
                }
                else {
                    this.invoke = function () {
                        return ZoneTask.invokeTask.call(global, self, this, arguments);
                    };
                }
            }
            ZoneTask.invokeTask = function (task, target, args) {
                if (!task) {
                    task = this;
                }
                _numberOfNestedTaskFrames++;
                try {
                    task.runCount++;
                    return task.zone.runTask(task, target, args);
                }
                finally {
                    if (_numberOfNestedTaskFrames == 1) {
                        drainMicroTaskQueue();
                    }
                    _numberOfNestedTaskFrames--;
                }
            };
            Object.defineProperty(ZoneTask.prototype, "zone", {
                get: function () {
                    return this._zone;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ZoneTask.prototype, "state", {
                get: function () {
                    return this._state;
                },
                enumerable: false,
                configurable: true
            });
            ZoneTask.prototype.cancelScheduleRequest = function () {
                this._transitionTo(notScheduled, scheduling);
            };
            // tslint:disable-next-line:require-internal-with-underscore
            ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
                if (this._state === fromState1 || this._state === fromState2) {
                    this._state = toState;
                    if (toState == notScheduled) {
                        this._zoneDelegates = null;
                    }
                }
                else {
                    throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ? ' or \'' + fromState2 + '\'' : '') + ", was '" + this._state + "'.");
                }
            };
            ZoneTask.prototype.toString = function () {
                if (this.data && typeof this.data.handleId !== 'undefined') {
                    return this.data.handleId.toString();
                }
                else {
                    return Object.prototype.toString.call(this);
                }
            };
            // add toJSON method to prevent cyclic error when
            // call JSON.stringify(zoneTask)
            ZoneTask.prototype.toJSON = function () {
                return {
                    type: this.type,
                    state: this.state,
                    source: this.source,
                    zone: this.zone.name,
                    runCount: this.runCount
                };
            };
            return ZoneTask;
        }());
        //////////////////////////////////////////////////////
        //////////////////////////////////////////////////////
        ///  MICROTASK QUEUE
        //////////////////////////////////////////////////////
        //////////////////////////////////////////////////////
        var symbolSetTimeout = __symbol__('setTimeout');
        var symbolPromise = __symbol__('Promise');
        var symbolThen = __symbol__('then');
        var _microTaskQueue = [];
        var _isDrainingMicrotaskQueue = false;
        var nativeMicroTaskQueuePromise;
        function scheduleMicroTask(task) {
            // if we are not running in any task, and there has not been anything scheduled
            // we must bootstrap the initial task creation by manually scheduling the drain
            if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
                // We are not running in Task, so we need to kickstart the microtask queue.
                if (!nativeMicroTaskQueuePromise) {
                    if (global[symbolPromise]) {
                        nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                    }
                }
                if (nativeMicroTaskQueuePromise) {
                    var nativeThen = nativeMicroTaskQueuePromise[symbolThen];
                    if (!nativeThen) {
                        // native Promise is not patchable, we need to use `then` directly
                        // issue 1078
                        nativeThen = nativeMicroTaskQueuePromise['then'];
                    }
                    nativeThen.call(nativeMicroTaskQueuePromise, drainMicroTaskQueue);
                }
                else {
                    global[symbolSetTimeout](drainMicroTaskQueue, 0);
                }
            }
            task && _microTaskQueue.push(task);
        }
        function drainMicroTaskQueue() {
            if (!_isDrainingMicrotaskQueue) {
                _isDrainingMicrotaskQueue = true;
                while (_microTaskQueue.length) {
                    var queue = _microTaskQueue;
                    _microTaskQueue = [];
                    for (var i = 0; i < queue.length; i++) {
                        var task = queue[i];
                        try {
                            task.zone.runTask(task, null, null);
                        }
                        catch (error) {
                            _api.onUnhandledError(error);
                        }
                    }
                }
                _api.microtaskDrainDone();
                _isDrainingMicrotaskQueue = false;
            }
        }
        //////////////////////////////////////////////////////
        //////////////////////////////////////////////////////
        ///  BOOTSTRAP
        //////////////////////////////////////////////////////
        //////////////////////////////////////////////////////
        var NO_ZONE = { name: 'NO ZONE' };
        var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
        var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
        var patches = {};
        var _api = {
            symbol: __symbol__,
            currentZoneFrame: function () { return _currentZoneFrame; },
            onUnhandledError: noop,
            microtaskDrainDone: noop,
            scheduleMicroTask: scheduleMicroTask,
            showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
            patchEventTarget: function () { return []; },
            patchOnProperties: noop,
            patchMethod: function () { return noop; },
            bindArguments: function () { return []; },
            patchThen: function () { return noop; },
            patchMacroTask: function () { return noop; },
            patchEventPrototype: function () { return noop; },
            isIEOrEdge: function () { return false; },
            getGlobalObjects: function () { return undefined; },
            ObjectDefineProperty: function () { return noop; },
            ObjectGetOwnPropertyDescriptor: function () { return undefined; },
            ObjectCreate: function () { return undefined; },
            ArraySlice: function () { return []; },
            patchClass: function () { return noop; },
            wrapWithCurrentZone: function () { return noop; },
            filterProperties: function () { return []; },
            attachOriginToPatched: function () { return noop; },
            _redefineProperty: function () { return noop; },
            patchCallbacks: function () { return noop; }
        };
        var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
        var _currentTask = null;
        var _numberOfNestedTaskFrames = 0;
        function noop() { }
        performanceMeasure('Zone', 'Zone');
        return global['Zone'] = Zone;
    })(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Suppress closure compiler errors about unknown 'Zone' variable
     * @fileoverview
     * @suppress {undefinedVars,globalThis,missingRequire}
     */
    /// <reference types="node"/>
    // issue #989, to reduce bundle size, use short name
    /** Object.getOwnPropertyDescriptor */
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    /** Object.defineProperty */
    var ObjectDefineProperty = Object.defineProperty;
    /** Object.getPrototypeOf */
    var ObjectGetPrototypeOf = Object.getPrototypeOf;
    /** Object.create */
    var ObjectCreate = Object.create;
    /** Array.prototype.slice */
    var ArraySlice = Array.prototype.slice;
    /** addEventListener string const */
    var ADD_EVENT_LISTENER_STR = 'addEventListener';
    /** removeEventListener string const */
    var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
    /** zoneSymbol addEventListener */
    var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
    /** zoneSymbol removeEventListener */
    var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
    /** true string const */
    var TRUE_STR = 'true';
    /** false string const */
    var FALSE_STR = 'false';
    /** Zone symbol prefix string const. */
    var ZONE_SYMBOL_PREFIX = Zone.__symbol__('');
    function wrapWithCurrentZone(callback, source) {
        return Zone.current.wrap(callback, source);
    }
    function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
        return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
    }
    var zoneSymbol = Zone.__symbol__;
    var isWindowExists = typeof window !== 'undefined';
    var internalWindow = isWindowExists ? window : undefined;
    var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
    var REMOVE_ATTRIBUTE = 'removeAttribute';
    var NULL_ON_PROP_VALUE = [null];
    function bindArguments(args, source) {
        for (var i = args.length - 1; i >= 0; i--) {
            if (typeof args[i] === 'function') {
                args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
            }
        }
        return args;
    }
    function patchPrototype(prototype, fnNames) {
        var source = prototype.constructor['name'];
        var _loop_1 = function (i) {
            var name_1 = fnNames[i];
            var delegate = prototype[name_1];
            if (delegate) {
                var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name_1);
                if (!isPropertyWritable(prototypeDesc)) {
                    return "continue";
                }
                prototype[name_1] = (function (delegate) {
                    var patched = function () {
                        return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                    };
                    attachOriginToPatched(patched, delegate);
                    return patched;
                })(delegate);
            }
        };
        for (var i = 0; i < fnNames.length; i++) {
            _loop_1(i);
        }
    }
    function isPropertyWritable(propertyDesc) {
        if (!propertyDesc) {
            return true;
        }
        if (propertyDesc.writable === false) {
            return false;
        }
        return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
    }
    var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
    // Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
    // this code.
    var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
        {}.toString.call(_global.process) === '[object process]');
    var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
    // we are in electron of nw, so we are both browser and nodejs
    // Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
    // this code.
    var isMix = typeof _global.process !== 'undefined' &&
        {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
        !!(isWindowExists && internalWindow['HTMLElement']);
    var zoneSymbolEventNames = {};
    var wrapFn = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        var eventNameSymbol = zoneSymbolEventNames[event.type];
        if (!eventNameSymbol) {
            eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
        }
        var target = this || event.target || _global;
        var listener = target[eventNameSymbol];
        var result;
        if (isBrowser && target === internalWindow && event.type === 'error') {
            // window.onerror have different signiture
            // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#window.onerror
            // and onerror callback will prevent default when callback return true
            var errorEvent = event;
            result = listener &&
                listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
            if (result === true) {
                event.preventDefault();
            }
        }
        else {
            result = listener && listener.apply(this, arguments);
            if (result != undefined && !result) {
                event.preventDefault();
            }
        }
        return result;
    };
    function patchProperty(obj, prop, prototype) {
        var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
        if (!desc && prototype) {
            // when patch window object, use prototype to check prop exist or not
            var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
            if (prototypeDesc) {
                desc = { enumerable: true, configurable: true };
            }
        }
        // if the descriptor not exists or is not configurable
        // just return
        if (!desc || !desc.configurable) {
            return;
        }
        var onPropPatchedSymbol = zoneSymbol('on' + prop + 'patched');
        if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
            return;
        }
        // A property descriptor cannot have getter/setter and be writable
        // deleting the writable and value properties avoids this error:
        //
        // TypeError: property descriptors must not specify a value or be writable when a
        // getter or setter has been specified
        delete desc.writable;
        delete desc.value;
        var originalDescGet = desc.get;
        var originalDescSet = desc.set;
        // substr(2) cuz 'onclick' -> 'click', etc
        var eventName = prop.substr(2);
        var eventNameSymbol = zoneSymbolEventNames[eventName];
        if (!eventNameSymbol) {
            eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
        }
        desc.set = function (newValue) {
            // in some of windows's onproperty callback, this is undefined
            // so we need to check it
            var target = this;
            if (!target && obj === _global) {
                target = _global;
            }
            if (!target) {
                return;
            }
            var previousValue = target[eventNameSymbol];
            if (previousValue) {
                target.removeEventListener(eventName, wrapFn);
            }
            // issue #978, when onload handler was added before loading zone.js
            // we should remove it with originalDescSet
            if (originalDescSet) {
                originalDescSet.apply(target, NULL_ON_PROP_VALUE);
            }
            if (typeof newValue === 'function') {
                target[eventNameSymbol] = newValue;
                target.addEventListener(eventName, wrapFn, false);
            }
            else {
                target[eventNameSymbol] = null;
            }
        };
        // The getter would return undefined for unassigned properties but the default value of an
        // unassigned property is null
        desc.get = function () {
            // in some of windows's onproperty callback, this is undefined
            // so we need to check it
            var target = this;
            if (!target && obj === _global) {
                target = _global;
            }
            if (!target) {
                return null;
            }
            var listener = target[eventNameSymbol];
            if (listener) {
                return listener;
            }
            else if (originalDescGet) {
                // result will be null when use inline event attribute,
                // such as <button onclick="func();">OK</button>
                // because the onclick function is internal raw uncompiled handler
                // the onclick will be evaluated when first time event was triggered or
                // the property is accessed, https://github.com/angular/zone.js/issues/525
                // so we should use original native get to retrieve the handler
                var value = originalDescGet && originalDescGet.call(this);
                if (value) {
                    desc.set.call(this, value);
                    if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                        target.removeAttribute(prop);
                    }
                    return value;
                }
            }
            return null;
        };
        ObjectDefineProperty(obj, prop, desc);
        obj[onPropPatchedSymbol] = true;
    }
    function patchOnProperties(obj, properties, prototype) {
        if (properties) {
            for (var i = 0; i < properties.length; i++) {
                patchProperty(obj, 'on' + properties[i], prototype);
            }
        }
        else {
            var onProperties = [];
            for (var prop in obj) {
                if (prop.substr(0, 2) == 'on') {
                    onProperties.push(prop);
                }
            }
            for (var j = 0; j < onProperties.length; j++) {
                patchProperty(obj, onProperties[j], prototype);
            }
        }
    }
    var originalInstanceKey = zoneSymbol('originalInstance');
    // wrap some native API on `window`
    function patchClass(className) {
        var OriginalClass = _global[className];
        if (!OriginalClass)
            return;
        // keep original class in global
        _global[zoneSymbol(className)] = OriginalClass;
        _global[className] = function () {
            var a = bindArguments(arguments, className);
            switch (a.length) {
                case 0:
                    this[originalInstanceKey] = new OriginalClass();
                    break;
                case 1:
                    this[originalInstanceKey] = new OriginalClass(a[0]);
                    break;
                case 2:
                    this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                    break;
                case 3:
                    this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                    break;
                case 4:
                    this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                    break;
                default:
                    throw new Error('Arg list too long.');
            }
        };
        // attach original delegate to patched function
        attachOriginToPatched(_global[className], OriginalClass);
        var instance = new OriginalClass(function () { });
        var prop;
        for (prop in instance) {
            // https://bugs.webkit.org/show_bug.cgi?id=44721
            if (className === 'XMLHttpRequest' && prop === 'responseBlob')
                continue;
            (function (prop) {
                if (typeof instance[prop] === 'function') {
                    _global[className].prototype[prop] = function () {
                        return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                    };
                }
                else {
                    ObjectDefineProperty(_global[className].prototype, prop, {
                        set: function (fn) {
                            if (typeof fn === 'function') {
                                this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                                // keep callback in wrapped function so we can
                                // use it in Function.prototype.toString to return
                                // the native one.
                                attachOriginToPatched(this[originalInstanceKey][prop], fn);
                            }
                            else {
                                this[originalInstanceKey][prop] = fn;
                            }
                        },
                        get: function () {
                            return this[originalInstanceKey][prop];
                        }
                    });
                }
            }(prop));
        }
        for (prop in OriginalClass) {
            if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
                _global[className][prop] = OriginalClass[prop];
            }
        }
    }
    function patchMethod(target, name, patchFn) {
        var proto = target;
        while (proto && !proto.hasOwnProperty(name)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && target[name]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = target;
        }
        var delegateName = zoneSymbol(name);
        var delegate = null;
        if (proto && (!(delegate = proto[delegateName]) || !proto.hasOwnProperty(delegateName))) {
            delegate = proto[delegateName] = proto[name];
            // check whether proto[name] is writable
            // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
            var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
            if (isPropertyWritable(desc)) {
                var patchDelegate_1 = patchFn(delegate, delegateName, name);
                proto[name] = function () {
                    return patchDelegate_1(this, arguments);
                };
                attachOriginToPatched(proto[name], delegate);
            }
        }
        return delegate;
    }
    // TODO: @JiaLiPassion, support cancel task later if necessary
    function patchMacroTask(obj, funcName, metaCreator) {
        var setNative = null;
        function scheduleTask(task) {
            var data = task.data;
            data.args[data.cbIdx] = function () {
                task.invoke.apply(this, arguments);
            };
            setNative.apply(data.target, data.args);
            return task;
        }
        setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
            var meta = metaCreator(self, args);
            if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
                return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(self, args);
            }
        }; });
    }
    function attachOriginToPatched(patched, original) {
        patched[zoneSymbol('OriginalDelegate')] = original;
    }
    var isDetectedIEOrEdge = false;
    var ieOrEdge = false;
    function isIE() {
        try {
            var ua = internalWindow.navigator.userAgent;
            if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1) {
                return true;
            }
        }
        catch (error) {
        }
        return false;
    }
    function isIEOrEdge() {
        if (isDetectedIEOrEdge) {
            return ieOrEdge;
        }
        isDetectedIEOrEdge = true;
        try {
            var ua = internalWindow.navigator.userAgent;
            if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
                ieOrEdge = true;
            }
        }
        catch (error) {
        }
        return ieOrEdge;
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
        var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        var ObjectDefineProperty = Object.defineProperty;
        function readableObjectToString(obj) {
            if (obj && obj.toString === Object.prototype.toString) {
                var className = obj.constructor && obj.constructor.name;
                return (className ? className : '') + ': ' + JSON.stringify(obj);
            }
            return obj ? obj.toString() : Object.prototype.toString.call(obj);
        }
        var __symbol__ = api.symbol;
        var _uncaughtPromiseErrors = [];
        var isDisableWrappingUncaughtPromiseRejection = global[__symbol__('DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION')] === true;
        var symbolPromise = __symbol__('Promise');
        var symbolThen = __symbol__('then');
        var creationTrace = '__creationTrace__';
        api.onUnhandledError = function (e) {
            if (api.showUncaughtError()) {
                var rejection = e && e.rejection;
                if (rejection) {
                    console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
                }
                else {
                    console.error(e);
                }
            }
        };
        api.microtaskDrainDone = function () {
            var _loop_2 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        if (uncaughtPromiseError.throwOriginal) {
                            throw uncaughtPromiseError.rejection;
                        }
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_2();
            }
        };
        var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
        function handleUnhandledRejection(e) {
            api.onUnhandledError(e);
            try {
                var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
                if (typeof handler === 'function') {
                    handler.call(this, e);
                }
            }
            catch (err) {
            }
        }
        function isThenable(value) {
            return value && value.then;
        }
        function forwardResolution(value) {
            return value;
        }
        function forwardRejection(rejection) {
            return ZoneAwarePromise.reject(rejection);
        }
        var symbolState = __symbol__('state');
        var symbolValue = __symbol__('value');
        var symbolFinally = __symbol__('finally');
        var symbolParentPromiseValue = __symbol__('parentPromiseValue');
        var symbolParentPromiseState = __symbol__('parentPromiseState');
        var source = 'Promise.then';
        var UNRESOLVED = null;
        var RESOLVED = true;
        var REJECTED = false;
        var REJECTED_NO_CATCH = 0;
        function makeResolver(promise, state) {
            return function (v) {
                try {
                    resolvePromise(promise, state, v);
                }
                catch (err) {
                    resolvePromise(promise, false, err);
                }
                // Do not return value or you will break the Promise spec.
            };
        }
        var once = function () {
            var wasCalled = false;
            return function wrapper(wrappedFunction) {
                return function () {
                    if (wasCalled) {
                        return;
                    }
                    wasCalled = true;
                    wrappedFunction.apply(null, arguments);
                };
            };
        };
        var TYPE_ERROR = 'Promise resolved with itself';
        var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
        // Promise Resolution
        function resolvePromise(promise, state, value) {
            var onceWrapper = once();
            if (promise === value) {
                throw new TypeError(TYPE_ERROR);
            }
            if (promise[symbolState] === UNRESOLVED) {
                // should only get value.then once based on promise spec.
                var then = null;
                try {
                    if (typeof value === 'object' || typeof value === 'function') {
                        then = value && value.then;
                    }
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                    return promise;
                }
                // if (value instanceof ZoneAwarePromise) {
                if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                    value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                    value[symbolState] !== UNRESOLVED) {
                    clearRejectedNoCatch(value);
                    resolvePromise(promise, value[symbolState], value[symbolValue]);
                }
                else if (state !== REJECTED && typeof then === 'function') {
                    try {
                        then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                    }
                    catch (err) {
                        onceWrapper(function () {
                            resolvePromise(promise, false, err);
                        })();
                    }
                }
                else {
                    promise[symbolState] = state;
                    var queue = promise[symbolValue];
                    promise[symbolValue] = value;
                    if (promise[symbolFinally] === symbolFinally) {
                        // the promise is generated by Promise.prototype.finally
                        if (state === RESOLVED) {
                            // the state is resolved, should ignore the value
                            // and use parent promise value
                            promise[symbolState] = promise[symbolParentPromiseState];
                            promise[symbolValue] = promise[symbolParentPromiseValue];
                        }
                    }
                    // record task information in value when error occurs, so we can
                    // do some additional work such as render longStackTrace
                    if (state === REJECTED && value instanceof Error) {
                        // check if longStackTraceZone is here
                        var trace = Zone.currentTask && Zone.currentTask.data &&
                            Zone.currentTask.data[creationTrace];
                        if (trace) {
                            // only keep the long stack trace into error when in longStackTraceZone
                            ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                        }
                    }
                    for (var i = 0; i < queue.length;) {
                        scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                    }
                    if (queue.length == 0 && state == REJECTED) {
                        promise[symbolState] = REJECTED_NO_CATCH;
                        var uncaughtPromiseError = value;
                        try {
                            // Here we throws a new Error to print more readable error log
                            // and if the value is not an error, zone.js builds an `Error`
                            // Object here to attach the stack information.
                            throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                                (value && value.stack ? '\n' + value.stack : ''));
                        }
                        catch (err) {
                            uncaughtPromiseError = err;
                        }
                        if (isDisableWrappingUncaughtPromiseRejection) {
                            // If disable wrapping uncaught promise reject
                            // use the value instead of wrapping it.
                            uncaughtPromiseError.throwOriginal = true;
                        }
                        uncaughtPromiseError.rejection = value;
                        uncaughtPromiseError.promise = promise;
                        uncaughtPromiseError.zone = Zone.current;
                        uncaughtPromiseError.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(uncaughtPromiseError);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
            // Resolving an already resolved promise is a noop.
            return promise;
        }
        var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
        function clearRejectedNoCatch(promise) {
            if (promise[symbolState] === REJECTED_NO_CATCH) {
                // if the promise is rejected no catch status
                // and queue.length > 0, means there is a error handler
                // here to handle the rejected promise, we should trigger
                // windows.rejectionhandled eventHandler or nodejs rejectionHandled
                // eventHandler
                try {
                    var handler = Zone[REJECTION_HANDLED_HANDLER];
                    if (handler && typeof handler === 'function') {
                        handler.call(this, { rejection: promise[symbolValue], promise: promise });
                    }
                }
                catch (err) {
                }
                promise[symbolState] = REJECTED;
                for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                    if (promise === _uncaughtPromiseErrors[i].promise) {
                        _uncaughtPromiseErrors.splice(i, 1);
                    }
                }
            }
        }
        function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
            clearRejectedNoCatch(promise);
            var promiseState = promise[symbolState];
            var delegate = promiseState ?
                (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
                (typeof onRejected === 'function') ? onRejected : forwardRejection;
            zone.scheduleMicroTask(source, function () {
                try {
                    var parentPromiseValue = promise[symbolValue];
                    var isFinallyPromise = !!chainPromise && symbolFinally === chainPromise[symbolFinally];
                    if (isFinallyPromise) {
                        // if the promise is generated from finally call, keep parent promise's state and value
                        chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                        chainPromise[symbolParentPromiseState] = promiseState;
                    }
                    // should not pass value to finally callback
                    var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ?
                        [] :
                        [parentPromiseValue]);
                    resolvePromise(chainPromise, true, value);
                }
                catch (error) {
                    // if error occurs, should always return this error
                    resolvePromise(chainPromise, false, error);
                }
            }, chainPromise);
        }
        var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
        var noop = function () { };
        var ZoneAwarePromise = /** @class */ (function () {
            function ZoneAwarePromise(executor) {
                var promise = this;
                if (!(promise instanceof ZoneAwarePromise)) {
                    throw new Error('Must be an instanceof Promise.');
                }
                promise[symbolState] = UNRESOLVED;
                promise[symbolValue] = []; // queue;
                try {
                    executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
                }
                catch (error) {
                    resolvePromise(promise, false, error);
                }
            }
            ZoneAwarePromise.toString = function () {
                return ZONE_AWARE_PROMISE_TO_STRING;
            };
            ZoneAwarePromise.resolve = function (value) {
                return resolvePromise(new this(null), RESOLVED, value);
            };
            ZoneAwarePromise.reject = function (error) {
                return resolvePromise(new this(null), REJECTED, error);
            };
            ZoneAwarePromise.race = function (values) {
                var resolve;
                var reject;
                var promise = new this(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                function onResolve(value) {
                    resolve(value);
                }
                function onReject(error) {
                    reject(error);
                }
                for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                    var value = values_1[_i];
                    if (!isThenable(value)) {
                        value = this.resolve(value);
                    }
                    value.then(onResolve, onReject);
                }
                return promise;
            };
            ZoneAwarePromise.all = function (values) {
                return ZoneAwarePromise.allWithCallback(values);
            };
            ZoneAwarePromise.allSettled = function (values) {
                var P = this && this.prototype instanceof ZoneAwarePromise ? this : ZoneAwarePromise;
                return P.allWithCallback(values, {
                    thenCallback: function (value) { return ({ status: 'fulfilled', value: value }); },
                    errorCallback: function (err) { return ({ status: 'rejected', reason: err }); }
                });
            };
            ZoneAwarePromise.allWithCallback = function (values, callback) {
                var resolve;
                var reject;
                var promise = new this(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                // Start at 2 to prevent prematurely resolving if .then is called immediately.
                var unresolvedCount = 2;
                var valueIndex = 0;
                var resolvedValues = [];
                var _loop_3 = function (value) {
                    if (!isThenable(value)) {
                        value = this_1.resolve(value);
                    }
                    var curValueIndex = valueIndex;
                    try {
                        value.then(function (value) {
                            resolvedValues[curValueIndex] = callback ? callback.thenCallback(value) : value;
                            unresolvedCount--;
                            if (unresolvedCount === 0) {
                                resolve(resolvedValues);
                            }
                        }, function (err) {
                            if (!callback) {
                                reject(err);
                            }
                            else {
                                resolvedValues[curValueIndex] = callback.errorCallback(err);
                                unresolvedCount--;
                                if (unresolvedCount === 0) {
                                    resolve(resolvedValues);
                                }
                            }
                        });
                    }
                    catch (thenErr) {
                        reject(thenErr);
                    }
                    unresolvedCount++;
                    valueIndex++;
                };
                var this_1 = this;
                for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                    var value = values_2[_i];
                    _loop_3(value);
                }
                // Make the unresolvedCount zero-based again.
                unresolvedCount -= 2;
                if (unresolvedCount === 0) {
                    resolve(resolvedValues);
                }
                return promise;
            };
            Object.defineProperty(ZoneAwarePromise.prototype, Symbol.toStringTag, {
                get: function () {
                    return 'Promise';
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ZoneAwarePromise.prototype, Symbol.species, {
                get: function () {
                    return ZoneAwarePromise;
                },
                enumerable: false,
                configurable: true
            });
            ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
                var C = this.constructor[Symbol.species];
                if (!C || typeof C !== 'function') {
                    C = this.constructor || ZoneAwarePromise;
                }
                var chainPromise = new C(noop);
                var zone = Zone.current;
                if (this[symbolState] == UNRESOLVED) {
                    this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
                }
                else {
                    scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
                }
                return chainPromise;
            };
            ZoneAwarePromise.prototype.catch = function (onRejected) {
                return this.then(null, onRejected);
            };
            ZoneAwarePromise.prototype.finally = function (onFinally) {
                var C = this.constructor[Symbol.species];
                if (!C || typeof C !== 'function') {
                    C = ZoneAwarePromise;
                }
                var chainPromise = new C(noop);
                chainPromise[symbolFinally] = symbolFinally;
                var zone = Zone.current;
                if (this[symbolState] == UNRESOLVED) {
                    this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
                }
                else {
                    scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
                }
                return chainPromise;
            };
            return ZoneAwarePromise;
        }());
        // Protect against aggressive optimizers dropping seemingly unused properties.
        // E.g. Closure Compiler in advanced mode.
        ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
        ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
        ZoneAwarePromise['race'] = ZoneAwarePromise.race;
        ZoneAwarePromise['all'] = ZoneAwarePromise.all;
        var NativePromise = global[symbolPromise] = global['Promise'];
        global['Promise'] = ZoneAwarePromise;
        var symbolThenPatched = __symbol__('thenPatched');
        function patchThen(Ctor) {
            var proto = Ctor.prototype;
            var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
            if (prop && (prop.writable === false || !prop.configurable)) {
                // check Ctor.prototype.then propertyDescriptor is writable or not
                // in meteor env, writable is false, we should ignore such case
                return;
            }
            var originalThen = proto.then;
            // Keep a reference to the original method.
            proto[symbolThen] = originalThen;
            Ctor.prototype.then = function (onResolve, onReject) {
                var _this = this;
                var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                    originalThen.call(_this, resolve, reject);
                });
                return wrapped.then(onResolve, onReject);
            };
            Ctor[symbolThenPatched] = true;
        }
        api.patchThen = patchThen;
        function zoneify(fn) {
            return function (self, args) {
                var resultPromise = fn.apply(self, args);
                if (resultPromise instanceof ZoneAwarePromise) {
                    return resultPromise;
                }
                var ctor = resultPromise.constructor;
                if (!ctor[symbolThenPatched]) {
                    patchThen(ctor);
                }
                return resultPromise;
            };
        }
        if (NativePromise) {
            patchThen(NativePromise);
            patchMethod(global, 'fetch', function (delegate) { return zoneify(delegate); });
        }
        // This is not part of public API, but it is useful for tests, so we expose it.
        Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
        return ZoneAwarePromise;
    });
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // override Function.prototype.toString to make zone.js patched function
    // look like native function
    Zone.__load_patch('toString', function (global) {
        // patch Func.prototype.toString to let them look like native
        var originalFunctionToString = Function.prototype.toString;
        var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
        var PROMISE_SYMBOL = zoneSymbol('Promise');
        var ERROR_SYMBOL = zoneSymbol('Error');
        var newFunctionToString = function toString() {
            if (typeof this === 'function') {
                var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
                if (originalDelegate) {
                    if (typeof originalDelegate === 'function') {
                        return originalFunctionToString.call(originalDelegate);
                    }
                    else {
                        return Object.prototype.toString.call(originalDelegate);
                    }
                }
                if (this === Promise) {
                    var nativePromise = global[PROMISE_SYMBOL];
                    if (nativePromise) {
                        return originalFunctionToString.call(nativePromise);
                    }
                }
                if (this === Error) {
                    var nativeError = global[ERROR_SYMBOL];
                    if (nativeError) {
                        return originalFunctionToString.call(nativeError);
                    }
                }
            }
            return originalFunctionToString.call(this);
        };
        newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
        Function.prototype.toString = newFunctionToString;
        // patch Object.prototype.toString to let them look like native
        var originalObjectToString = Object.prototype.toString;
        var PROMISE_OBJECT_TO_STRING = '[object Promise]';
        Object.prototype.toString = function () {
            if (typeof Promise === 'function' && this instanceof Promise) {
                return PROMISE_OBJECT_TO_STRING;
            }
            return originalObjectToString.call(this);
        };
    });
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var passiveSupported = false;
    if (typeof window !== 'undefined') {
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function () {
                    passiveSupported = true;
                }
            });
            window.addEventListener('test', options, options);
            window.removeEventListener('test', options, options);
        }
        catch (err) {
            passiveSupported = false;
        }
    }
    // an identifier to tell ZoneTask do not create a new invoke closure
    var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
        useG: true
    };
    var zoneSymbolEventNames$1 = {};
    var globalSources = {};
    var EVENT_NAME_SYMBOL_REGX = new RegExp('^' + ZONE_SYMBOL_PREFIX + '(\\w+)(true|false)$');
    var IMMEDIATE_PROPAGATION_SYMBOL = zoneSymbol('propagationStopped');
    function prepareEventNames(eventName, eventNameToString) {
        var falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
        var trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    function patchEventTarget(_global, apis, patchOptions) {
        var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
        var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
        var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
        var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
        var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
        var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
        var PREPEND_EVENT_LISTENER = 'prependListener';
        var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
        var invokeTask = function (task, target, event) {
            // for better performance, check isRemoved which is set
            // by removeEventListener
            if (task.isRemoved) {
                return;
            }
            var delegate = task.callback;
            if (typeof delegate === 'object' && delegate.handleEvent) {
                // create the bind version of handleEvent when invoke
                task.callback = function (event) { return delegate.handleEvent(event); };
                task.originalDelegate = delegate;
            }
            // invoke static task.invoke
            task.invoke(task, target, [event]);
            var options = task.options;
            if (options && typeof options === 'object' && options.once) {
                // if options.once is true, after invoke once remove listener here
                // only browser need to do this, nodejs eventEmitter will cal removeListener
                // inside EventEmitter.once
                var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
                target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
            }
        };
        // global shared zoneAwareCallback to handle all event callback with capture = false
        var globalZoneAwareCallback = function (event) {
            // https://github.com/angular/zone.js/issues/911, in IE, sometimes
            // event will be undefined, so we need to use window.event
            event = event || _global.event;
            if (!event) {
                return;
            }
            // event.target is needed for Samsung TV and SourceBuffer
            // || global is needed https://github.com/angular/zone.js/issues/190
            var target = this || event.target || _global;
            var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
            if (tasks) {
                // invoke all tasks which attached to current target with given event.type and capture = false
                // for performance concern, if task.length === 1, just invoke
                if (tasks.length === 1) {
                    invokeTask(tasks[0], target, event);
                }
                else {
                    // https://github.com/angular/zone.js/issues/836
                    // copy the tasks array before invoke, to avoid
                    // the callback will remove itself or other listener
                    var copyTasks = tasks.slice();
                    for (var i = 0; i < copyTasks.length; i++) {
                        if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                            break;
                        }
                        invokeTask(copyTasks[i], target, event);
                    }
                }
            }
        };
        // global shared zoneAwareCallback to handle all event callback with capture = true
        var globalZoneAwareCaptureCallback = function (event) {
            // https://github.com/angular/zone.js/issues/911, in IE, sometimes
            // event will be undefined, so we need to use window.event
            event = event || _global.event;
            if (!event) {
                return;
            }
            // event.target is needed for Samsung TV and SourceBuffer
            // || global is needed https://github.com/angular/zone.js/issues/190
            var target = this || event.target || _global;
            var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
            if (tasks) {
                // invoke all tasks which attached to current target with given event.type and capture = false
                // for performance concern, if task.length === 1, just invoke
                if (tasks.length === 1) {
                    invokeTask(tasks[0], target, event);
                }
                else {
                    // https://github.com/angular/zone.js/issues/836
                    // copy the tasks array before invoke, to avoid
                    // the callback will remove itself or other listener
                    var copyTasks = tasks.slice();
                    for (var i = 0; i < copyTasks.length; i++) {
                        if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                            break;
                        }
                        invokeTask(copyTasks[i], target, event);
                    }
                }
            }
        };
        function patchEventTargetMethods(obj, patchOptions) {
            if (!obj) {
                return false;
            }
            var useGlobalCallback = true;
            if (patchOptions && patchOptions.useG !== undefined) {
                useGlobalCallback = patchOptions.useG;
            }
            var validateHandler = patchOptions && patchOptions.vh;
            var checkDuplicate = true;
            if (patchOptions && patchOptions.chkDup !== undefined) {
                checkDuplicate = patchOptions.chkDup;
            }
            var returnTarget = false;
            if (patchOptions && patchOptions.rt !== undefined) {
                returnTarget = patchOptions.rt;
            }
            var proto = obj;
            while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
                proto = ObjectGetPrototypeOf(proto);
            }
            if (!proto && obj[ADD_EVENT_LISTENER]) {
                // somehow we did not find it, but we can see it. This happens on IE for Window properties.
                proto = obj;
            }
            if (!proto) {
                return false;
            }
            if (proto[zoneSymbolAddEventListener]) {
                return false;
            }
            var eventNameToString = patchOptions && patchOptions.eventNameToString;
            // a shared global taskData to pass data for scheduleEventTask
            // so we do not need to create a new object just for pass some data
            var taskData = {};
            var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
            var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
                proto[REMOVE_EVENT_LISTENER];
            var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
                proto[LISTENERS_EVENT_LISTENER];
            var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
                proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
            var nativePrependEventListener;
            if (patchOptions && patchOptions.prepend) {
                nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
                    proto[patchOptions.prepend];
            }
            /**
             * This util function will build an option object with passive option
             * to handle all possible input from the user.
             */
            function buildEventListenerOptions(options, passive) {
                if (!passiveSupported && typeof options === 'object' && options) {
                    // doesn't support passive but user want to pass an object as options.
                    // this will not work on some old browser, so we just pass a boolean
                    // as useCapture parameter
                    return !!options.capture;
                }
                if (!passiveSupported || !passive) {
                    return options;
                }
                if (typeof options === 'boolean') {
                    return { capture: options, passive: true };
                }
                if (!options) {
                    return { passive: true };
                }
                if (typeof options === 'object' && options.passive !== false) {
                    return Object.assign(Object.assign({}, options), { passive: true });
                }
                return options;
            }
            var customScheduleGlobal = function (task) {
                // if there is already a task for the eventName + capture,
                // just return, because we use the shared globalZoneAwareCallback here.
                if (taskData.isExisting) {
                    return;
                }
                return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
            };
            var customCancelGlobal = function (task) {
                // if task is not marked as isRemoved, this call is directly
                // from Zone.prototype.cancelTask, we should remove the task
                // from tasksList of target first
                if (!task.isRemoved) {
                    var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                    var symbolEventName = void 0;
                    if (symbolEventNames) {
                        symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                    }
                    var existingTasks = symbolEventName && task.target[symbolEventName];
                    if (existingTasks) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            var existingTask = existingTasks[i];
                            if (existingTask === task) {
                                existingTasks.splice(i, 1);
                                // set isRemoved to data for faster invokeTask check
                                task.isRemoved = true;
                                if (existingTasks.length === 0) {
                                    // all tasks for the eventName + capture have gone,
                                    // remove globalZoneAwareCallback and remove the task cache from target
                                    task.allRemoved = true;
                                    task.target[symbolEventName] = null;
                                }
                                break;
                            }
                        }
                    }
                }
                // if all tasks for the eventName + capture have gone,
                // we will really remove the global event callback,
                // if not, return
                if (!task.allRemoved) {
                    return;
                }
                return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
            };
            var customScheduleNonGlobal = function (task) {
                return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
            };
            var customSchedulePrepend = function (task) {
                return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
            };
            var customCancelNonGlobal = function (task) {
                return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
            };
            var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
            var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
            var compareTaskCallbackVsDelegate = function (task, delegate) {
                var typeOfDelegate = typeof delegate;
                return (typeOfDelegate === 'function' && task.callback === delegate) ||
                    (typeOfDelegate === 'object' && task.originalDelegate === delegate);
            };
            var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
            var unpatchedEvents = Zone[zoneSymbol('UNPATCHED_EVENTS')];
            var passiveEvents = _global[zoneSymbol('PASSIVE_EVENTS')];
            var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
                if (returnTarget === void 0) { returnTarget = false; }
                if (prepend === void 0) { prepend = false; }
                return function () {
                    var target = this || _global;
                    var eventName = arguments[0];
                    if (patchOptions && patchOptions.transferEventName) {
                        eventName = patchOptions.transferEventName(eventName);
                    }
                    var delegate = arguments[1];
                    if (!delegate) {
                        return nativeListener.apply(this, arguments);
                    }
                    if (isNode && eventName === 'uncaughtException') {
                        // don't patch uncaughtException of nodejs to prevent endless loop
                        return nativeListener.apply(this, arguments);
                    }
                    // don't create the bind delegate function for handleEvent
                    // case here to improve addEventListener performance
                    // we will create the bind delegate when invoke
                    var isHandleEvent = false;
                    if (typeof delegate !== 'function') {
                        if (!delegate.handleEvent) {
                            return nativeListener.apply(this, arguments);
                        }
                        isHandleEvent = true;
                    }
                    if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                        return;
                    }
                    var passive = passiveSupported && !!passiveEvents && passiveEvents.indexOf(eventName) !== -1;
                    var options = buildEventListenerOptions(arguments[2], passive);
                    if (unpatchedEvents) {
                        // check upatched list
                        for (var i = 0; i < unpatchedEvents.length; i++) {
                            if (eventName === unpatchedEvents[i]) {
                                if (passive) {
                                    return nativeListener.call(target, eventName, delegate, options);
                                }
                                else {
                                    return nativeListener.apply(this, arguments);
                                }
                            }
                        }
                    }
                    var capture = !options ? false : typeof options === 'boolean' ? true : options.capture;
                    var once = options && typeof options === 'object' ? options.once : false;
                    var zone = Zone.current;
                    var symbolEventNames = zoneSymbolEventNames$1[eventName];
                    if (!symbolEventNames) {
                        prepareEventNames(eventName, eventNameToString);
                        symbolEventNames = zoneSymbolEventNames$1[eventName];
                    }
                    var symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                    var existingTasks = target[symbolEventName];
                    var isExisting = false;
                    if (existingTasks) {
                        // already have task registered
                        isExisting = true;
                        if (checkDuplicate) {
                            for (var i = 0; i < existingTasks.length; i++) {
                                if (compare(existingTasks[i], delegate)) {
                                    // same callback, same capture, same event name, just return
                                    return;
                                }
                            }
                        }
                    }
                    else {
                        existingTasks = target[symbolEventName] = [];
                    }
                    var source;
                    var constructorName = target.constructor['name'];
                    var targetSource = globalSources[constructorName];
                    if (targetSource) {
                        source = targetSource[eventName];
                    }
                    if (!source) {
                        source = constructorName + addSource +
                            (eventNameToString ? eventNameToString(eventName) : eventName);
                    }
                    // do not create a new object as task.data to pass those things
                    // just use the global shared one
                    taskData.options = options;
                    if (once) {
                        // if addEventListener with once options, we don't pass it to
                        // native addEventListener, instead we keep the once setting
                        // and handle ourselves.
                        taskData.options.once = false;
                    }
                    taskData.target = target;
                    taskData.capture = capture;
                    taskData.eventName = eventName;
                    taskData.isExisting = isExisting;
                    var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : undefined;
                    // keep taskData into data to allow onScheduleEventTask to access the task information
                    if (data) {
                        data.taskData = taskData;
                    }
                    var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                    // should clear taskData.target to avoid memory leak
                    // issue, https://github.com/angular/angular/issues/20442
                    taskData.target = null;
                    // need to clear up taskData because it is a global object
                    if (data) {
                        data.taskData = null;
                    }
                    // have to save those information to task in case
                    // application may call task.zone.cancelTask() directly
                    if (once) {
                        options.once = true;
                    }
                    if (!(!passiveSupported && typeof task.options === 'boolean')) {
                        // if not support passive, and we pass an option object
                        // to addEventListener, we should save the options to task
                        task.options = options;
                    }
                    task.target = target;
                    task.capture = capture;
                    task.eventName = eventName;
                    if (isHandleEvent) {
                        // save original delegate for compare to check duplicate
                        task.originalDelegate = delegate;
                    }
                    if (!prepend) {
                        existingTasks.push(task);
                    }
                    else {
                        existingTasks.unshift(task);
                    }
                    if (returnTarget) {
                        return target;
                    }
                };
            };
            proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
            if (nativePrependEventListener) {
                proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
            }
            proto[REMOVE_EVENT_LISTENER] = function () {
                var target = this || _global;
                var eventName = arguments[0];
                if (patchOptions && patchOptions.transferEventName) {
                    eventName = patchOptions.transferEventName(eventName);
                }
                var options = arguments[2];
                var capture = !options ? false : typeof options === 'boolean' ? true : options.capture;
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeRemoveEventListener.apply(this, arguments);
                }
                if (validateHandler &&
                    !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                    return;
                }
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (compare(existingTask, delegate)) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            existingTask.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                existingTask.allRemoved = true;
                                target[symbolEventName] = null;
                                // in the target, we have an event listener which is added by on_property
                                // such as target.onclick = function() {}, so we need to clear this internal
                                // property too if all delegates all removed
                                if (typeof eventName === 'string') {
                                    var onPropertySymbol = ZONE_SYMBOL_PREFIX + 'ON_PROPERTY' + eventName;
                                    target[onPropertySymbol] = null;
                                }
                            }
                            existingTask.zone.cancelTask(existingTask);
                            if (returnTarget) {
                                return target;
                            }
                            return;
                        }
                    }
                }
                // issue 930, didn't find the event name or callback
                // from zone kept existingTasks, the callback maybe
                // added outside of zone, we need to call native removeEventListener
                // to try to remove it.
                return nativeRemoveEventListener.apply(this, arguments);
            };
            proto[LISTENERS_EVENT_LISTENER] = function () {
                var target = this || _global;
                var eventName = arguments[0];
                if (patchOptions && patchOptions.transferEventName) {
                    eventName = patchOptions.transferEventName(eventName);
                }
                var listeners = [];
                var tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
                for (var i = 0; i < tasks.length; i++) {
                    var task = tasks[i];
                    var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                    listeners.push(delegate);
                }
                return listeners;
            };
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
                var target = this || _global;
                var eventName = arguments[0];
                if (!eventName) {
                    var keys = Object.keys(target);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                        var evtName = match && match[1];
                        // in nodejs EventEmitter, removeListener event is
                        // used for monitoring the removeListener call,
                        // so just keep removeListener eventListener until
                        // all other eventListeners are removed
                        if (evtName && evtName !== 'removeListener') {
                            this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                        }
                    }
                    // remove removeListener listener finally
                    this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
                }
                else {
                    if (patchOptions && patchOptions.transferEventName) {
                        eventName = patchOptions.transferEventName(eventName);
                    }
                    var symbolEventNames = zoneSymbolEventNames$1[eventName];
                    if (symbolEventNames) {
                        var symbolEventName = symbolEventNames[FALSE_STR];
                        var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                        var tasks = target[symbolEventName];
                        var captureTasks = target[symbolCaptureEventName];
                        if (tasks) {
                            var removeTasks = tasks.slice();
                            for (var i = 0; i < removeTasks.length; i++) {
                                var task = removeTasks[i];
                                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                                this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                            }
                        }
                        if (captureTasks) {
                            var removeTasks = captureTasks.slice();
                            for (var i = 0; i < removeTasks.length; i++) {
                                var task = removeTasks[i];
                                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                                this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                            }
                        }
                    }
                }
                if (returnTarget) {
                    return this;
                }
            };
            // for native toString patch
            attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
            attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
            if (nativeRemoveAllListeners) {
                attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
            }
            if (nativeListeners) {
                attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
            }
            return true;
        }
        var results = [];
        for (var i = 0; i < apis.length; i++) {
            results[i] = patchEventTargetMethods(apis[i], patchOptions);
        }
        return results;
    }
    function findEventTasks(target, eventName) {
        if (!eventName) {
            var foundTasks = [];
            for (var prop in target) {
                var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                var evtName = match && match[1];
                if (evtName && (!eventName || evtName === eventName)) {
                    var tasks = target[prop];
                    if (tasks) {
                        for (var i = 0; i < tasks.length; i++) {
                            foundTasks.push(tasks[i]);
                        }
                    }
                }
            }
            return foundTasks;
        }
        var symbolEventName = zoneSymbolEventNames$1[eventName];
        if (!symbolEventName) {
            prepareEventNames(eventName);
            symbolEventName = zoneSymbolEventNames$1[eventName];
        }
        var captureFalseTasks = target[symbolEventName[FALSE_STR]];
        var captureTrueTasks = target[symbolEventName[TRUE_STR]];
        if (!captureFalseTasks) {
            return captureTrueTasks ? captureTrueTasks.slice() : [];
        }
        else {
            return captureTrueTasks ? captureFalseTasks.concat(captureTrueTasks) :
                captureFalseTasks.slice();
        }
    }
    function patchEventPrototype(global, api) {
        var Event = global['Event'];
        if (Event && Event.prototype) {
            api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
                self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
                // we need to call the native stopImmediatePropagation
                // in case in some hybrid application, some part of
                // application will be controlled by zone, some are not
                delegate && delegate.apply(self, args);
            }; });
        }
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function patchCallbacks(api, target, targetName, method, callbacks) {
        var symbol = Zone.__symbol__(method);
        if (target[symbol]) {
            return;
        }
        var nativeDelegate = target[symbol] = target[method];
        target[method] = function (name, opts, options) {
            if (opts && opts.prototype) {
                callbacks.forEach(function (callback) {
                    var source = targetName + "." + method + "::" + callback;
                    var prototype = opts.prototype;
                    if (prototype.hasOwnProperty(callback)) {
                        var descriptor = api.ObjectGetOwnPropertyDescriptor(prototype, callback);
                        if (descriptor && descriptor.value) {
                            descriptor.value = api.wrapWithCurrentZone(descriptor.value, source);
                            api._redefineProperty(opts.prototype, callback, descriptor);
                        }
                        else if (prototype[callback]) {
                            prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
                        }
                    }
                    else if (prototype[callback]) {
                        prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
                    }
                });
            }
            return nativeDelegate.call(target, name, opts, options);
        };
        api.attachOriginToPatched(target[method], nativeDelegate);
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var globalEventHandlersEventNames = [
        'abort',
        'animationcancel',
        'animationend',
        'animationiteration',
        'auxclick',
        'beforeinput',
        'blur',
        'cancel',
        'canplay',
        'canplaythrough',
        'change',
        'compositionstart',
        'compositionupdate',
        'compositionend',
        'cuechange',
        'click',
        'close',
        'contextmenu',
        'curechange',
        'dblclick',
        'drag',
        'dragend',
        'dragenter',
        'dragexit',
        'dragleave',
        'dragover',
        'drop',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'focus',
        'focusin',
        'focusout',
        'gotpointercapture',
        'input',
        'invalid',
        'keydown',
        'keypress',
        'keyup',
        'load',
        'loadstart',
        'loadeddata',
        'loadedmetadata',
        'lostpointercapture',
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'mousewheel',
        'orientationchange',
        'pause',
        'play',
        'playing',
        'pointercancel',
        'pointerdown',
        'pointerenter',
        'pointerleave',
        'pointerlockchange',
        'mozpointerlockchange',
        'webkitpointerlockerchange',
        'pointerlockerror',
        'mozpointerlockerror',
        'webkitpointerlockerror',
        'pointermove',
        'pointout',
        'pointerover',
        'pointerup',
        'progress',
        'ratechange',
        'reset',
        'resize',
        'scroll',
        'seeked',
        'seeking',
        'select',
        'selectionchange',
        'selectstart',
        'show',
        'sort',
        'stalled',
        'submit',
        'suspend',
        'timeupdate',
        'volumechange',
        'touchcancel',
        'touchmove',
        'touchstart',
        'touchend',
        'transitioncancel',
        'transitionend',
        'waiting',
        'wheel'
    ];
    var documentEventNames = [
        'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
        'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
        'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
        'visibilitychange', 'resume'
    ];
    var windowEventNames = [
        'absolutedeviceorientation',
        'afterinput',
        'afterprint',
        'appinstalled',
        'beforeinstallprompt',
        'beforeprint',
        'beforeunload',
        'devicelight',
        'devicemotion',
        'deviceorientation',
        'deviceorientationabsolute',
        'deviceproximity',
        'hashchange',
        'languagechange',
        'message',
        'mozbeforepaint',
        'offline',
        'online',
        'paint',
        'pageshow',
        'pagehide',
        'popstate',
        'rejectionhandled',
        'storage',
        'unhandledrejection',
        'unload',
        'userproximity',
        'vrdisplayconnected',
        'vrdisplaydisconnected',
        'vrdisplaypresentchange'
    ];
    var htmlElementEventNames = [
        'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
        'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
        'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
    ];
    var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
    var ieElementEventNames = [
        'activate',
        'afterupdate',
        'ariarequest',
        'beforeactivate',
        'beforedeactivate',
        'beforeeditfocus',
        'beforeupdate',
        'cellchange',
        'controlselect',
        'dataavailable',
        'datasetchanged',
        'datasetcomplete',
        'errorupdate',
        'filterchange',
        'layoutcomplete',
        'losecapture',
        'move',
        'moveend',
        'movestart',
        'propertychange',
        'resizeend',
        'resizestart',
        'rowenter',
        'rowexit',
        'rowsdelete',
        'rowsinserted',
        'command',
        'compassneedscalibration',
        'deactivate',
        'help',
        'mscontentzoom',
        'msmanipulationstatechanged',
        'msgesturechange',
        'msgesturedoubletap',
        'msgestureend',
        'msgesturehold',
        'msgesturestart',
        'msgesturetap',
        'msgotpointercapture',
        'msinertiastart',
        'mslostpointercapture',
        'mspointercancel',
        'mspointerdown',
        'mspointerenter',
        'mspointerhover',
        'mspointerleave',
        'mspointermove',
        'mspointerout',
        'mspointerover',
        'mspointerup',
        'pointerout',
        'mssitemodejumplistitemremoved',
        'msthumbnailclick',
        'stop',
        'storagecommit'
    ];
    var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
    var formEventNames = ['autocomplete', 'autocompleteerror'];
    var detailEventNames = ['toggle'];
    var frameEventNames = ['load'];
    var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
    var marqueeEventNames = ['bounce', 'finish', 'start'];
    var XMLHttpRequestEventNames = [
        'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
        'readystatechange'
    ];
    var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
    var websocketEventNames = ['close', 'error', 'open', 'message'];
    var workerEventNames = ['error', 'message'];
    var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
    function filterProperties(target, onProperties, ignoreProperties) {
        if (!ignoreProperties || ignoreProperties.length === 0) {
            return onProperties;
        }
        var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
        if (!tip || tip.length === 0) {
            return onProperties;
        }
        var targetIgnoreProperties = tip[0].ignoreProperties;
        return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
    }
    function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
        // check whether target is available, sometimes target will be undefined
        // because different browser or some 3rd party plugin.
        if (!target) {
            return;
        }
        var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
        patchOnProperties(target, filteredProperties, prototype);
    }
    function propertyDescriptorPatch(api, _global) {
        if (isNode && !isMix) {
            return;
        }
        if (Zone[api.symbol('patchEvents')]) {
            // events are already been patched by legacy patch.
            return;
        }
        var supportsWebSocket = typeof WebSocket !== 'undefined';
        var ignoreProperties = _global['__Zone_ignore_on_properties'];
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            var internalWindow_1 = window;
            var ignoreErrorProperties = isIE() ? [{ target: internalWindow_1, ignoreProperties: ['error'] }] : [];
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow_1, eventNames.concat(['messageerror']), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow_1));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow_1['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow_1['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow_1['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow_1['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        var XMLHttpRequest = _global['XMLHttpRequest'];
        if (XMLHttpRequest) {
            // XMLHttpRequest is not available in ServiceWorker, so we need to check here
            patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        var XMLHttpRequestEventTarget = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget) {
            patchFilteredProperties(XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    Zone.__load_patch('util', function (global, Zone, api) {
        api.patchOnProperties = patchOnProperties;
        api.patchMethod = patchMethod;
        api.bindArguments = bindArguments;
        api.patchMacroTask = patchMacroTask;
        // In earlier version of zone.js (<0.9.0), we use env name `__zone_symbol__BLACK_LISTED_EVENTS` to
        // define which events will not be patched by `Zone.js`.
        // In newer version (>=0.9.0), we change the env name to `__zone_symbol__UNPATCHED_EVENTS` to keep
        // the name consistent with angular repo.
        // The  `__zone_symbol__BLACK_LISTED_EVENTS` is deprecated, but it is still be supported for
        // backwards compatibility.
        var SYMBOL_BLACK_LISTED_EVENTS = Zone.__symbol__('BLACK_LISTED_EVENTS');
        var SYMBOL_UNPATCHED_EVENTS = Zone.__symbol__('UNPATCHED_EVENTS');
        if (global[SYMBOL_UNPATCHED_EVENTS]) {
            global[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_UNPATCHED_EVENTS];
        }
        if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
            Zone[SYMBOL_BLACK_LISTED_EVENTS] = Zone[SYMBOL_UNPATCHED_EVENTS] =
                global[SYMBOL_BLACK_LISTED_EVENTS];
        }
        api.patchEventPrototype = patchEventPrototype;
        api.patchEventTarget = patchEventTarget;
        api.isIEOrEdge = isIEOrEdge;
        api.ObjectDefineProperty = ObjectDefineProperty;
        api.ObjectGetOwnPropertyDescriptor = ObjectGetOwnPropertyDescriptor;
        api.ObjectCreate = ObjectCreate;
        api.ArraySlice = ArraySlice;
        api.patchClass = patchClass;
        api.wrapWithCurrentZone = wrapWithCurrentZone;
        api.filterProperties = filterProperties;
        api.attachOriginToPatched = attachOriginToPatched;
        api._redefineProperty = Object.defineProperty;
        api.patchCallbacks = patchCallbacks;
        api.getGlobalObjects = function () { return ({
            globalSources: globalSources,
            zoneSymbolEventNames: zoneSymbolEventNames$1,
            eventNames: eventNames,
            isBrowser: isBrowser,
            isMix: isMix,
            isNode: isNode,
            TRUE_STR: TRUE_STR,
            FALSE_STR: FALSE_STR,
            ZONE_SYMBOL_PREFIX: ZONE_SYMBOL_PREFIX,
            ADD_EVENT_LISTENER_STR: ADD_EVENT_LISTENER_STR,
            REMOVE_EVENT_LISTENER_STR: REMOVE_EVENT_LISTENER_STR
        }); };
    });
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /*
     * This is necessary for Chrome and Chrome mobile, to enable
     * things like redefining `createdCallback` on an element.
     */
    var zoneSymbol$1;
    var _defineProperty;
    var _getOwnPropertyDescriptor;
    var _create;
    var unconfigurablesKey;
    function propertyPatch() {
        zoneSymbol$1 = Zone.__symbol__;
        _defineProperty = Object[zoneSymbol$1('defineProperty')] = Object.defineProperty;
        _getOwnPropertyDescriptor = Object[zoneSymbol$1('getOwnPropertyDescriptor')] =
            Object.getOwnPropertyDescriptor;
        _create = Object.create;
        unconfigurablesKey = zoneSymbol$1('unconfigurables');
        Object.defineProperty = function (obj, prop, desc) {
            if (isUnconfigurable(obj, prop)) {
                throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
            }
            var originalConfigurableFlag = desc.configurable;
            if (prop !== 'prototype') {
                desc = rewriteDescriptor(obj, prop, desc);
            }
            return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
        };
        Object.defineProperties = function (obj, props) {
            Object.keys(props).forEach(function (prop) {
                Object.defineProperty(obj, prop, props[prop]);
            });
            return obj;
        };
        Object.create = function (obj, proto) {
            if (typeof proto === 'object' && !Object.isFrozen(proto)) {
                Object.keys(proto).forEach(function (prop) {
                    proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
                });
            }
            return _create(obj, proto);
        };
        Object.getOwnPropertyDescriptor = function (obj, prop) {
            var desc = _getOwnPropertyDescriptor(obj, prop);
            if (desc && isUnconfigurable(obj, prop)) {
                desc.configurable = false;
            }
            return desc;
        };
    }
    function _redefineProperty(obj, prop, desc) {
        var originalConfigurableFlag = desc.configurable;
        desc = rewriteDescriptor(obj, prop, desc);
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    }
    function isUnconfigurable(obj, prop) {
        return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
    }
    function rewriteDescriptor(obj, prop, desc) {
        // issue-927, if the desc is frozen, don't try to change the desc
        if (!Object.isFrozen(desc)) {
            desc.configurable = true;
        }
        if (!desc.configurable) {
            // issue-927, if the obj is frozen, don't try to set the desc to obj
            if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
                _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
            }
            if (obj[unconfigurablesKey]) {
                obj[unconfigurablesKey][prop] = true;
            }
        }
        return desc;
    }
    function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
        try {
            return _defineProperty(obj, prop, desc);
        }
        catch (error) {
            if (desc.configurable) {
                // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
                // retry with the original flag value
                if (typeof originalConfigurableFlag == 'undefined') {
                    delete desc.configurable;
                }
                else {
                    desc.configurable = originalConfigurableFlag;
                }
                try {
                    return _defineProperty(obj, prop, desc);
                }
                catch (error) {
                    var swallowError = false;
                    if (prop === 'createdCallback' || prop === 'attachedCallback' ||
                        prop === 'detachedCallback' || prop === 'attributeChangedCallback') {
                        // We only swallow the error in registerElement patch
                        // this is the work around since some applications
                        // fail if we throw the error
                        swallowError = true;
                    }
                    if (!swallowError) {
                        throw error;
                    }
                    // TODO: @JiaLiPassion, Some application such as `registerElement` patch
                    // still need to swallow the error, in the future after these applications
                    // are updated, the following logic can be removed.
                    var descJson = null;
                    try {
                        descJson = JSON.stringify(desc);
                    }
                    catch (error) {
                        descJson = desc.toString();
                    }
                    console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
                }
            }
            else {
                throw error;
            }
        }
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function eventTargetLegacyPatch(_global, api) {
        var _a = api.getGlobalObjects(), eventNames = _a.eventNames, globalSources = _a.globalSources, zoneSymbolEventNames = _a.zoneSymbolEventNames, TRUE_STR = _a.TRUE_STR, FALSE_STR = _a.FALSE_STR, ZONE_SYMBOL_PREFIX = _a.ZONE_SYMBOL_PREFIX;
        var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
        var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
            .split(',');
        var EVENT_TARGET = 'EventTarget';
        var apis = [];
        var isWtf = _global['wtf'];
        var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
        if (isWtf) {
            // Workaround for: https://github.com/google/tracing-framework/issues/555
            apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
        }
        else if (_global[EVENT_TARGET]) {
            apis.push(EVENT_TARGET);
        }
        else {
            // Note: EventTarget is not available in all browsers,
            // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
            apis = NO_EVENT_TARGET;
        }
        var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
        var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
        var ieOrEdge = api.isIEOrEdge();
        var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
        var FUNCTION_WRAPPER = '[object FunctionWrapper]';
        var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
        var pointerEventsMap = {
            'MSPointerCancel': 'pointercancel',
            'MSPointerDown': 'pointerdown',
            'MSPointerEnter': 'pointerenter',
            'MSPointerHover': 'pointerhover',
            'MSPointerLeave': 'pointerleave',
            'MSPointerMove': 'pointermove',
            'MSPointerOut': 'pointerout',
            'MSPointerOver': 'pointerover',
            'MSPointerUp': 'pointerup'
        };
        //  predefine all __zone_symbol__ + eventName + true/false string
        for (var i = 0; i < eventNames.length; i++) {
            var eventName = eventNames[i];
            var falseEventName = eventName + FALSE_STR;
            var trueEventName = eventName + TRUE_STR;
            var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
            var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
            zoneSymbolEventNames[eventName] = {};
            zoneSymbolEventNames[eventName][FALSE_STR] = symbol;
            zoneSymbolEventNames[eventName][TRUE_STR] = symbolCapture;
        }
        //  predefine all task.source string
        for (var i = 0; i < WTF_ISSUE_555_ARRAY.length; i++) {
            var target = WTF_ISSUE_555_ARRAY[i];
            var targets = globalSources[target] = {};
            for (var j = 0; j < eventNames.length; j++) {
                var eventName = eventNames[j];
                targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
            }
        }
        var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
            if (!isDisableIECheck && ieOrEdge) {
                if (isEnableCrossContextCheck) {
                    try {
                        var testString = delegate.toString();
                        if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                            nativeDelegate.apply(target, args);
                            return false;
                        }
                    }
                    catch (error) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                else {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
            }
            else if (isEnableCrossContextCheck) {
                try {
                    delegate.toString();
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            return true;
        };
        var apiTypes = [];
        for (var i = 0; i < apis.length; i++) {
            var type = _global[apis[i]];
            apiTypes.push(type && type.prototype);
        }
        // vh is validateHandler to check event handler
        // is valid or not(for security check)
        api.patchEventTarget(_global, apiTypes, {
            vh: checkIEAndCrossContext,
            transferEventName: function (eventName) {
                var pointerEventName = pointerEventsMap[eventName];
                return pointerEventName || eventName;
            }
        });
        Zone[api.symbol('patchEventTarget')] = !!_global[EVENT_TARGET];
        return true;
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // we have to patch the instance since the proto is non-configurable
    function apply(api, _global) {
        var _a = api.getGlobalObjects(), ADD_EVENT_LISTENER_STR = _a.ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR = _a.REMOVE_EVENT_LISTENER_STR;
        var WS = _global.WebSocket;
        // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
        // On older Chrome, no need since EventTarget was already patched
        if (!_global.EventTarget) {
            api.patchEventTarget(_global, [WS.prototype]);
        }
        _global.WebSocket = function (x, y) {
            var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
            var proxySocket;
            var proxySocketProto;
            // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
            var onmessageDesc = api.ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
            if (onmessageDesc && onmessageDesc.configurable === false) {
                proxySocket = api.ObjectCreate(socket);
                // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
                // but proxySocket not, so we will keep socket as prototype and pass it to
                // patchOnProperties method
                proxySocketProto = socket;
                [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                    proxySocket[propName] = function () {
                        var args = api.ArraySlice.call(arguments);
                        if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                            var eventName = args.length > 0 ? args[0] : undefined;
                            if (eventName) {
                                var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                                socket[propertySymbol] = proxySocket[propertySymbol];
                            }
                        }
                        return socket[propName].apply(socket, args);
                    };
                });
            }
            else {
                // we can patch the real socket
                proxySocket = socket;
            }
            api.patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
            return proxySocket;
        };
        var globalWebSocket = _global['WebSocket'];
        for (var prop in WS) {
            globalWebSocket[prop] = WS[prop];
        }
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function propertyDescriptorLegacyPatch(api, _global) {
        var _a = api.getGlobalObjects(), isNode = _a.isNode, isMix = _a.isMix;
        if (isNode && !isMix) {
            return;
        }
        if (!canPatchViaPropertyDescriptor(api, _global)) {
            var supportsWebSocket = typeof WebSocket !== 'undefined';
            // Safari, Android browsers (Jelly Bean)
            patchViaCapturingAllTheEvents(api);
            api.patchClass('XMLHttpRequest');
            if (supportsWebSocket) {
                apply(api, _global);
            }
            Zone[api.symbol('patchEvents')] = true;
        }
    }
    function canPatchViaPropertyDescriptor(api, _global) {
        var _a = api.getGlobalObjects(), isBrowser = _a.isBrowser, isMix = _a.isMix;
        if ((isBrowser || isMix) &&
            !api.ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
            typeof Element !== 'undefined') {
            // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
            // IDL interface attributes are not configurable
            var desc = api.ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
            if (desc && !desc.configurable)
                return false;
            // try to use onclick to detect whether we can patch via propertyDescriptor
            // because XMLHttpRequest is not available in service worker
            if (desc) {
                api.ObjectDefineProperty(Element.prototype, 'onclick', {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return true;
                    }
                });
                var div = document.createElement('div');
                var result = !!div.onclick;
                api.ObjectDefineProperty(Element.prototype, 'onclick', desc);
                return result;
            }
        }
        var XMLHttpRequest = _global['XMLHttpRequest'];
        if (!XMLHttpRequest) {
            // XMLHttpRequest is not available in service worker
            return false;
        }
        var ON_READY_STATE_CHANGE = 'onreadystatechange';
        var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
        var xhrDesc = api.ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
        // add enumerable and configurable here because in opera
        // by default XMLHttpRequest.prototype.onreadystatechange is undefined
        // without adding enumerable and configurable will cause onreadystatechange
        // non-configurable
        // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
        // we should set a real desc instead a fake one
        if (xhrDesc) {
            api.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
                enumerable: true,
                configurable: true,
                get: function () {
                    return true;
                }
            });
            var req = new XMLHttpRequest();
            var result = !!req.onreadystatechange;
            // restore original desc
            api.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
            return result;
        }
        else {
            var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = api.symbol('fake');
            api.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
                },
                set: function (value) {
                    this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
                }
            });
            var req = new XMLHttpRequest();
            var detectFunc = function () { };
            req.onreadystatechange = detectFunc;
            var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
            req.onreadystatechange = null;
            return result;
        }
    }
    // Whenever any eventListener fires, we check the eventListener target and all parents
    // for `onwhatever` properties and replace them with zone-bound functions
    // - Chrome (for now)
    function patchViaCapturingAllTheEvents(api) {
        var eventNames = api.getGlobalObjects().eventNames;
        var unboundKey = api.symbol('unbound');
        var _loop_4 = function (i) {
            var property = eventNames[i];
            var onproperty = 'on' + property;
            self.addEventListener(property, function (event) {
                var elt = event.target, bound, source;
                if (elt) {
                    source = elt.constructor['name'] + '.' + onproperty;
                }
                else {
                    source = 'unknown.' + onproperty;
                }
                while (elt) {
                    if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                        bound = api.wrapWithCurrentZone(elt[onproperty], source);
                        bound[unboundKey] = elt[onproperty];
                        elt[onproperty] = bound;
                    }
                    elt = elt.parentElement;
                }
            }, true);
        };
        for (var i = 0; i < eventNames.length; i++) {
            _loop_4(i);
        }
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function registerElementPatch(_global, api) {
        var _a = api.getGlobalObjects(), isBrowser = _a.isBrowser, isMix = _a.isMix;
        if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
            return;
        }
        var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
        api.patchCallbacks(api, document, 'Document', 'registerElement', callbacks);
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    (function (_global) {
        var symbolPrefix = _global['__Zone_symbol_prefix'] || '__zone_symbol__';
        function __symbol__(name) {
            return symbolPrefix + name;
        }
        _global[__symbol__('legacyPatch')] = function () {
            var Zone = _global['Zone'];
            Zone.__load_patch('defineProperty', function (global, Zone, api) {
                api._redefineProperty = _redefineProperty;
                propertyPatch();
            });
            Zone.__load_patch('registerElement', function (global, Zone, api) {
                registerElementPatch(global, api);
            });
            Zone.__load_patch('EventTargetLegacy', function (global, Zone, api) {
                eventTargetLegacyPatch(global, api);
                propertyDescriptorLegacyPatch(api, global);
            });
        };
    })(typeof window !== 'undefined' ?
        window :
        typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var taskSymbol = zoneSymbol('zoneTask');
    function patchTimer(window, setName, cancelName, nameSuffix) {
        var setNative = null;
        var clearNative = null;
        setName += nameSuffix;
        cancelName += nameSuffix;
        var tasksByHandleId = {};
        function scheduleTask(task) {
            var data = task.data;
            data.args[0] = function () {
                return task.invoke.apply(this, arguments);
            };
            data.handleId = setNative.apply(window, data.args);
            return task;
        }
        function clearTask(task) {
            return clearNative.call(window, task.data.handleId);
        }
        setNative =
            patchMethod(window, setName, function (delegate) { return function (self, args) {
                if (typeof args[0] === 'function') {
                    var options_1 = {
                        isPeriodic: nameSuffix === 'Interval',
                        delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 :
                            undefined,
                        args: args
                    };
                    var callback_1 = args[0];
                    args[0] = function timer() {
                        try {
                            return callback_1.apply(this, arguments);
                        }
                        finally {
                            // issue-934, task will be cancelled
                            // even it is a periodic task such as
                            // setInterval
                            // https://github.com/angular/angular/issues/40387
                            // Cleanup tasksByHandleId should be handled before scheduleTask
                            // Since some zoneSpec may intercept and doesn't trigger
                            // scheduleFn(scheduleTask) provided here.
                            if (!(options_1.isPeriodic)) {
                                if (typeof options_1.handleId === 'number') {
                                    // in non-nodejs env, we remove timerId
                                    // from local cache
                                    delete tasksByHandleId[options_1.handleId];
                                }
                                else if (options_1.handleId) {
                                    // Node returns complex objects as handleIds
                                    // we remove task reference from timer object
                                    options_1.handleId[taskSymbol] = null;
                                }
                            }
                        }
                    };
                    var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options_1, scheduleTask, clearTask);
                    if (!task) {
                        return task;
                    }
                    // Node.js must additionally support the ref and unref functions.
                    var handle = task.data.handleId;
                    if (typeof handle === 'number') {
                        // for non nodejs env, we save handleId: task
                        // mapping in local cache for clearTimeout
                        tasksByHandleId[handle] = task;
                    }
                    else if (handle) {
                        // for nodejs env, we save task
                        // reference in timerId Object for clearTimeout
                        handle[taskSymbol] = task;
                    }
                    // check whether handle is null, because some polyfill or browser
                    // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                    if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                        typeof handle.unref === 'function') {
                        task.ref = handle.ref.bind(handle);
                        task.unref = handle.unref.bind(handle);
                    }
                    if (typeof handle === 'number' || handle) {
                        return handle;
                    }
                    return task;
                }
                else {
                    // cause an error by calling it directly.
                    return delegate.apply(window, args);
                }
            }; });
        clearNative =
            patchMethod(window, cancelName, function (delegate) { return function (self, args) {
                var id = args[0];
                var task;
                if (typeof id === 'number') {
                    // non nodejs env.
                    task = tasksByHandleId[id];
                }
                else {
                    // nodejs env.
                    task = id && id[taskSymbol];
                    // other environments.
                    if (!task) {
                        task = id;
                    }
                }
                if (task && typeof task.type === 'string') {
                    if (task.state !== 'notScheduled' &&
                        (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                        if (typeof id === 'number') {
                            delete tasksByHandleId[id];
                        }
                        else if (id) {
                            id[taskSymbol] = null;
                        }
                        // Do not cancel already canceled functions
                        task.zone.cancelTask(task);
                    }
                }
                else {
                    // cause an error by calling it directly.
                    delegate.apply(window, args);
                }
            }; });
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function patchCustomElements(_global, api) {
        var _a = api.getGlobalObjects(), isBrowser = _a.isBrowser, isMix = _a.isMix;
        if ((!isBrowser && !isMix) || !_global['customElements'] || !('customElements' in _global)) {
            return;
        }
        var callbacks = ['connectedCallback', 'disconnectedCallback', 'adoptedCallback', 'attributeChangedCallback'];
        api.patchCallbacks(api, _global.customElements, 'customElements', 'define', callbacks);
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function eventTargetPatch(_global, api) {
        if (Zone[api.symbol('patchEventTarget')]) {
            // EventTarget is already patched.
            return;
        }
        var _a = api.getGlobalObjects(), eventNames = _a.eventNames, zoneSymbolEventNames = _a.zoneSymbolEventNames, TRUE_STR = _a.TRUE_STR, FALSE_STR = _a.FALSE_STR, ZONE_SYMBOL_PREFIX = _a.ZONE_SYMBOL_PREFIX;
        //  predefine all __zone_symbol__ + eventName + true/false string
        for (var i = 0; i < eventNames.length; i++) {
            var eventName = eventNames[i];
            var falseEventName = eventName + FALSE_STR;
            var trueEventName = eventName + TRUE_STR;
            var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
            var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
            zoneSymbolEventNames[eventName] = {};
            zoneSymbolEventNames[eventName][FALSE_STR] = symbol;
            zoneSymbolEventNames[eventName][TRUE_STR] = symbolCapture;
        }
        var EVENT_TARGET = _global['EventTarget'];
        if (!EVENT_TARGET || !EVENT_TARGET.prototype) {
            return;
        }
        api.patchEventTarget(_global, [EVENT_TARGET && EVENT_TARGET.prototype]);
        return true;
    }
    function patchEvent(global, api) {
        api.patchEventPrototype(global, api);
    }
    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    Zone.__load_patch('legacy', function (global) {
        var legacyPatch = global[Zone.__symbol__('legacyPatch')];
        if (legacyPatch) {
            legacyPatch();
        }
    });
    Zone.__load_patch('queueMicrotask', function (global, Zone, api) {
        api.patchMethod(global, 'queueMicrotask', function (delegate) {
            return function (self, args) {
                Zone.current.scheduleMicroTask('queueMicrotask', args[0]);
            };
        });
    });
    Zone.__load_patch('timers', function (global) {
        var set = 'set';
        var clear = 'clear';
        patchTimer(global, set, clear, 'Timeout');
        patchTimer(global, set, clear, 'Interval');
        patchTimer(global, set, clear, 'Immediate');
    });
    Zone.__load_patch('requestAnimationFrame', function (global) {
        patchTimer(global, 'request', 'cancel', 'AnimationFrame');
        patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
        patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
    });
    Zone.__load_patch('blocking', function (global, Zone) {
        var blockingMethods = ['alert', 'prompt', 'confirm'];
        for (var i = 0; i < blockingMethods.length; i++) {
            var name_2 = blockingMethods[i];
            patchMethod(global, name_2, function (delegate, symbol, name) {
                return function (s, args) {
                    return Zone.current.run(delegate, global, args, name);
                };
            });
        }
    });
    Zone.__load_patch('EventTarget', function (global, Zone, api) {
        patchEvent(global, api);
        eventTargetPatch(global, api);
        // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
        var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
            api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
        }
    });
    Zone.__load_patch('MutationObserver', function (global, Zone, api) {
        patchClass('MutationObserver');
        patchClass('WebKitMutationObserver');
    });
    Zone.__load_patch('IntersectionObserver', function (global, Zone, api) {
        patchClass('IntersectionObserver');
    });
    Zone.__load_patch('FileReader', function (global, Zone, api) {
        patchClass('FileReader');
    });
    Zone.__load_patch('on_property', function (global, Zone, api) {
        propertyDescriptorPatch(api, global);
    });
    Zone.__load_patch('customElements', function (global, Zone, api) {
        patchCustomElements(global, api);
    });
    Zone.__load_patch('XHR', function (global, Zone) {
        // Treat XMLHttpRequest as a macrotask.
        patchXHR(global);
        var XHR_TASK = zoneSymbol('xhrTask');
        var XHR_SYNC = zoneSymbol('xhrSync');
        var XHR_LISTENER = zoneSymbol('xhrListener');
        var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
        var XHR_URL = zoneSymbol('xhrURL');
        var XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol('xhrErrorBeforeScheduled');
        function patchXHR(window) {
            var XMLHttpRequest = window['XMLHttpRequest'];
            if (!XMLHttpRequest) {
                // XMLHttpRequest is not available in service worker
                return;
            }
            var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
            function findPendingTask(target) {
                return target[XHR_TASK];
            }
            var oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
            var oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            if (!oriAddListener) {
                var XMLHttpRequestEventTarget_1 = window['XMLHttpRequestEventTarget'];
                if (XMLHttpRequestEventTarget_1) {
                    var XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget_1.prototype;
                    oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                    oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
                }
            }
            var READY_STATE_CHANGE = 'readystatechange';
            var SCHEDULED = 'scheduled';
            function scheduleTask(task) {
                var data = task.data;
                var target = data.target;
                target[XHR_SCHEDULED] = false;
                target[XHR_ERROR_BEFORE_SCHEDULED] = false;
                // remove existing event listener
                var listener = target[XHR_LISTENER];
                if (!oriAddListener) {
                    oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                    oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
                }
                if (listener) {
                    oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
                }
                var newListener = target[XHR_LISTENER] = function () {
                    if (target.readyState === target.DONE) {
                        // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                        // readyState=4 multiple times, so we need to check task state here
                        if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
                            // check whether the xhr has registered onload listener
                            // if that is the case, the task should invoke after all
                            // onload listeners finish.
                            // Also if the request failed without response (status = 0), the load event handler
                            // will not be triggered, in that case, we should also invoke the placeholder callback
                            // to close the XMLHttpRequest::send macroTask.
                            // https://github.com/angular/angular/issues/38795
                            var loadTasks = target[Zone.__symbol__('loadfalse')];
                            if (target.status !== 0 && loadTasks && loadTasks.length > 0) {
                                var oriInvoke_1 = task.invoke;
                                task.invoke = function () {
                                    // need to load the tasks again, because in other
                                    // load listener, they may remove themselves
                                    var loadTasks = target[Zone.__symbol__('loadfalse')];
                                    for (var i = 0; i < loadTasks.length; i++) {
                                        if (loadTasks[i] === task) {
                                            loadTasks.splice(i, 1);
                                        }
                                    }
                                    if (!data.aborted && task.state === SCHEDULED) {
                                        oriInvoke_1.call(task);
                                    }
                                };
                                loadTasks.push(task);
                            }
                            else {
                                task.invoke();
                            }
                        }
                        else if (!data.aborted && target[XHR_SCHEDULED] === false) {
                            // error occurs when xhr.send()
                            target[XHR_ERROR_BEFORE_SCHEDULED] = true;
                        }
                    }
                };
                oriAddListener.call(target, READY_STATE_CHANGE, newListener);
                var storedTask = target[XHR_TASK];
                if (!storedTask) {
                    target[XHR_TASK] = task;
                }
                sendNative.apply(target, data.args);
                target[XHR_SCHEDULED] = true;
                return task;
            }
            function placeholderCallback() { }
            function clearTask(task) {
                var data = task.data;
                // Note - ideally, we would call data.target.removeEventListener here, but it's too late
                // to prevent it from firing. So instead, we store info for the event listener.
                data.aborted = true;
                return abortNative.apply(data.target, data.args);
            }
            var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () { return function (self, args) {
                self[XHR_SYNC] = args[2] == false;
                self[XHR_URL] = args[1];
                return openNative.apply(self, args);
            }; });
            var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
            var fetchTaskAborting = zoneSymbol('fetchTaskAborting');
            var fetchTaskScheduling = zoneSymbol('fetchTaskScheduling');
            var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () { return function (self, args) {
                if (Zone.current[fetchTaskScheduling] === true) {
                    // a fetch is scheduling, so we are using xhr to polyfill fetch
                    // and because we already schedule macroTask for fetch, we should
                    // not schedule a macroTask for xhr again
                    return sendNative.apply(self, args);
                }
                if (self[XHR_SYNC]) {
                    // if the XHR is sync there is no task to schedule, just execute the code.
                    return sendNative.apply(self, args);
                }
                else {
                    var options = { target: self, url: self[XHR_URL], isPeriodic: false, args: args, aborted: false };
                    var task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
                    if (self && self[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted &&
                        task.state === SCHEDULED) {
                        // xhr request throw error when send
                        // we should invoke task instead of leaving a scheduled
                        // pending macroTask
                        task.invoke();
                    }
                }
            }; });
            var abortNative = patchMethod(XMLHttpRequestPrototype, 'abort', function () { return function (self, args) {
                var task = findPendingTask(self);
                if (task && typeof task.type == 'string') {
                    // If the XHR has already completed, do nothing.
                    // If the XHR has already been aborted, do nothing.
                    // Fix #569, call abort multiple times before done will cause
                    // macroTask task count be negative number
                    if (task.cancelFn == null || (task.data && task.data.aborted)) {
                        return;
                    }
                    task.zone.cancelTask(task);
                }
                else if (Zone.current[fetchTaskAborting] === true) {
                    // the abort is called from fetch polyfill, we need to call native abort of XHR.
                    return abortNative.apply(self, args);
                }
                // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
                // task
                // to cancel. Do nothing.
            }; });
        }
    });
    Zone.__load_patch('geolocation', function (global) {
        /// GEO_LOCATION
        if (global['navigator'] && global['navigator'].geolocation) {
            patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
        }
    });
    Zone.__load_patch('PromiseRejectionEvent', function (global, Zone) {
        // handle unhandled promise rejection
        function findPromiseRejectionHandler(evtName) {
            return function (e) {
                var eventTasks = findEventTasks(global, evtName);
                eventTasks.forEach(function (eventTask) {
                    // windows has added unhandledrejection event listener
                    // trigger the event listener
                    var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                    if (PromiseRejectionEvent) {
                        var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                        eventTask.invoke(evt);
                    }
                });
            };
        }
        if (global['PromiseRejectionEvent']) {
            Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
                findPromiseRejectionHandler('unhandledrejection');
            Zone[zoneSymbol('rejectionHandledHandler')] =
                findPromiseRejectionHandler('rejectionhandled');
        }
    });
})));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
