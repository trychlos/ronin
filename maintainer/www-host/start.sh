#!/bin/sh

[ "$(whoami)" == "ronin" ] || { echo "Must be executed as 'ronin'" 1>&2; exit 1; }

	cd ${0%/*}
	export PATH=$HOME/.node/current/bin:$PATH
	cd bundle
	(cd programs/server && npm install)
	export MONGO_URL='mongodb://ronin:vikeZE3RPROko1qrjzB3@localhost:27017/ronin'
	export ROOT_URL='http://ronin.trychlos.org'
	export PORT=10249
	export MAIL_URL="smtps://ronin%40trychlos.pwi:Cj6GYj7srEoWxVOqLlEZ@mail.trychlos.org:465?tls.rejectUnauthorized=false"
	export NODE_ENV="prod"
	node main.js &

