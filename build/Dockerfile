FROM node:12 AS builder

WORKDIR /home/node/app

ADD . .

RUN npm install && \
    npm run build

WORKDIR /home/node/app/dist
RUN rm -f *.dev.html && \
    cp our_work.html about && \
    cp press.html media && \
    for i in `find . -name \*.html | cut -d/ -f2`; do name=`echo $i | cut -d'.' -f1`; cp $i $name; done

FROM 887044485231.dkr.ecr.eu-west-1.amazonaws.com/rfcx/nginx/base:latest

COPY --from=builder /home/node/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
