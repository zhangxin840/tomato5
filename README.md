![logo](http://tomato5.io/static/icons/logo.png)

Tomato5 is a real-time collaboration tool.
It combines Pomodoro Technique with a team status share board.

Homepage: [http://tomato5.io](http://tomato5.io)

## Updates

### 1.3.0

- New feature: Show speech bubble in team board.

### 1.2.0

- New feature: Give thumbs up to team members.
- New feature: Headline for team board.

## Features

- Adapt to all kinds of screen sizes.
- Real-time data sync.
- Serverless architecture, powered by GCP and AWS.

## Responsive web design

![responsive](http://tomato5.io/static/promotions/responsive.gif)

## Serverless

We build Tomato5 as the 'Serverless' architecture.
All services run on the cloud, without any server of its own.
 
Front-end part of this system is just static files hosted on Google's CDN.
The web app talks directly to the Realtime Database of Firebase.

The whole account system, including login UI, is also provided by Firebase.

With the full support of cloud services, we can build real-world products at lowest development costs, and get free from most of the maintaining works.

## Tech Stack

- Responsive web design
- ES6
- Vue
- Webpack
- Firebase
- AWS Lambda

## The name Tomato5

- 5 minutes break after 25 minutes concentration
- 5 tomatoes a day
- 5 team members

## Real-time collaboration

We believe that it is important for the team to share everyone's status.

Traditional collaboration tools only told the team what to achieve, without concern about individual's actual status.

By showing what we are doing and thinking in real-time, we can express ourselves more adequately, be more connected to the team, and get more feedbacks on time.

Real-time collaboration means to share the team status in real-time.

Key points:
- Concern about individuals
- Expressional
- Instant Feedbacks

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
