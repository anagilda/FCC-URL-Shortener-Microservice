# API Project: URL Shortener Microservice for freeCodeCamp

[FreeCodeCamp](https://www.freecodecamp.org/)
#### See this project live on [Glitch](https://plum-modem.glitch.me/)
### User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. 
3. When I visit the shortened URL, it will redirect me to my original link.


#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

[[this_project_url]/api/shorturl/4](https://plum-modem.glitch.me/api/shorturl/4)

#### Will redirect to:

https://www.freecodecamp.org/
