FROM node:12 AS builder

WORKDIR /app
ADD src src
COPY gulpfile.js package.json package-lock.json ./

ENV NODE_ENV=production 
RUN npm ci --also=dev && npm run build

WORKDIR /app/dist
RUN cp our_work.html about && \
    for i in `find . -name \*.html | cut -d/ -f2`; do name=`echo $i | cut -d'.' -f1`; cp $i $name; done

FROM 887044485231.dkr.ecr.eu-west-1.amazonaws.com/rfcx/nginx/base:latest

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
