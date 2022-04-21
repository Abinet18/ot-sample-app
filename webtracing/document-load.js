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