# Tomato5

![logo](http://tomato5.io/static/icons/logo.png =250x)

Tomato5 is a real-time collaboration tool

Homepage: [http://tomato5.io](http://tomato5.io)

## Features

- 5 tomatoes daily planning.
- Track energy level for every task.
- Share status with your team.
- Track the key metrics.

## The name

- 5 minutes break after 25 minutes concentration
- 5 tomatoes a day
- 5 members

## Real-time collaboration

Traditional collaboration tools told the team about what to do today.

Real-time collaboration tools show the team about what is really going on right now.

Key points:
- Real-time
- Expressional
- Reality

## Serverless

Tomato5 is structured as the 'Serverless' architecture.
All services are based on cloud, without any server of its own.

Front-end part of this system is just static files hosted on Google's CDN.
The web app will talk directly to the Realtime Database of Firebase.

The whole account system, including login UI, is also provided by Firebase.

With the full support of cloud services, we can build real-world products at lowest development efforts, and get free from most of the operating and maintaining things.

## Tech Stack

- Responsive web design
- ES6
- Vue
- Webpack
- Firebase

## Develop

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev

# Build for production
npm run build

# Deploy to Firebase
bash deploy.sh
```
