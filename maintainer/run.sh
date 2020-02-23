#!/bin/sh
thisdir="$(cd ${0%/*}; pwd)"
projectdir="${thisdir%/*}"

# seems that Meteor forces this variable to 'development'
#export NODE_ENV="dev"
export MAIL_URL="smtps://ronin%40trychlos.pwi:Cj6GYj7srEoWxVOqLlEZ@mail.trychlos.org:465?tls.rejectUnauthorized=false"

#meteor run --settings config/settings.json
meteor run
