FROM python:3.11-alpine3.19

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./proxy.py .

EXPOSE 5000

CMD [ "python", "./proxy.py" ]