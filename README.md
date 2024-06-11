# Mercur Marketplace [Vendor Application]

Learn More about Medusa.js [here](https://docs.medusajs.com/)

## Build & Run (Locally)

### Prerequisites

Create .env file in root directory and add following values:

```dotenv
VITE_BACKEND_URL=<url>
```

- `yarn dev` to build&run project in development mode


### Build & Run (Docker)

This project is also available as a Docker container. To build and run the project as a Docker container, follow the steps below:

- `docker build -t mercur-marketplace-vendor-application .` to build docker image
- `docker run -p 7000:3000 -e VITE_BACKEND_URL=<backend_url> mercur-marketplace-vendor-application` to run docker container