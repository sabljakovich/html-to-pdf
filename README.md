
# How to consume the API

The examples bellow cover one of the most common use cases, returning the generated pdf back via http.

### NodeJS

Express Web API using axios http client to communicate with the renderer service and sending the pdf back to the consumer.

```javascript

const express = require('express');
const app = express();
const axios = require('axios').default;

app.use(express.text());

app.get('/invoices', async (req, res) => {

    const invoiceHTML = `<h1> Hello from renderer! </h1>`;

    const pdf = await axios.post('YOUR_URL_HERE/renderer/html-to-pdf',
        invoiceHTML,{
            headers: {
                'Content-Type': 'text/html',
            },
            responseType: "arraybuffer"
        })
        .then(x => x.data)

    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdf));
});

app.listen(3000);

```


### .NET core


.NET core 3.1 example controller.

```csharp
    [Route("api/[controller]")]
    public class InvoicesController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("YOUR_URL_HERE");

            var invoiceHTML = "<h1> Hello from renderer! </h1>";

            var response = await client.PostAsync("/renderer/html-to-pdf",
                new StringContent(invoiceHTML, Encoding.UTF8, "text/html")
            );

            response.EnsureSuccessStatusCode();

            return File(await response.Content.ReadAsByteArrayAsync(),
                "application/pdf",
                "Invoice.pdf"
            );
        }
    }
```

# How to deploy

## Heroku deploy with single click

Deploy by clicking on the heroku button below.


[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## Heroku deploy from source code

1. Clone the source code to your machine

```sh
git clone git@github.com:sabljakovich/html-to-pdf.git
cd html-to-pdf

```

2. Create a new heroku up

```sh
heroku create
```

3. Let the heroku now the app is a docker container

```sh
heroku stack:set container
```

## Docker

Build image from source

```
docker build -t html-to-pdf -f Dockerfile .
```

Run container with the previously created image

```
docker run --rm -p 5555:1234 html-to-pdf
```

* `--rf` - remove the container once stopped
* `-p 5555:1234` - map port `5555` on host to port `1234` in docker
