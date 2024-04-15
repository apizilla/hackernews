FROM apizilla/apizilla:v0.5.11

#COPY . /etc/apizilla
EXPOSE 8080
ENTRYPOINT [ "apizilla" ]
# arguments that can be overridden
CMD [ "-path", "/etc/apizilla", "dev" ]