#!/bin/sh
# This script is run from the maintainer/ directory of the project

maintainerdir="$(cd ${0%/*}; pwd)"
projectdir="${maintainerdir%/*}"
target="www8"
ronin="/home/ronin"
service_src="${maintainerdir}/www-host/ronin.service"
service_dest="/etc/systemd/system/"
start_src="${maintainerdir}/www-host/start.sh"
start_dest="${ronin}/"

[ ! -f "${projectdir}/mobile-config.js" ] &&
    echo "This script must be run from project root dir" 1>&2 &&
    exit 1

execcmd(){
    _cmd="${*}"
    echo "$(date '+%Y%m%d-%H%M%S') ${_cmd}"
    ${_cmd}
}

execssh(){
    _cmd="${*}"
    execcmd ssh ${target} ${_cmd}
}

next_version(){
    _line="$(execssh "ls -l ${ronin}/bundle")"
    _last="$(echo ${_line} | awk '{ print $NF }' | sed -e 's|bundle-||')"
	_last_date="$(echo ${_last:0:8})"
    _today="$(date +'%y.%m.%d')"
    _count=0
    if [ "${_last_date}" == "${_today}" ]; then
    	_count="$(echo ${_last} | awk -F. '{ print $NF }')"
    fi
    _count=$(( _count+1 ))
    echo "${_today}.${_count}"
}

# compute the current version and update the mobile configuration accordingly
# pwi 2020- 2-23 also update the private/config/public/version.json configuration file
version="$(next_version)"
sed -i -e "s|^\(\s*version\s*:\s*\).*$|\1'$version',|" "${projectdir}/mobile-config.js"
sed -i -e "s|[0-9\.]\+|$version|" "${projectdir}/private/config/public/version.json"
echo "Deploying v ${version}..."

# build server+mobile versions
execcmd "meteor build /tmp --server ronin.trychlos.org"
_ret=$?

# server deployement
[ $_ret -eq 0 ] &&
    execcmd "scp /tmp/ronin.tar.gz ${target}:/tmp" &&
    execssh "systemctl stop ronin" &&
    execssh "cd ${ronin} && rm -f bundle" &&
    execssh "cd ${ronin} && tar -xzf /tmp/ronin.tar.gz" &&
    execssh "cd ${ronin} && chown -R ronin:ronin bundle" &&
    execssh "cd ${ronin} && mv bundle bundle-${version}" &&
    execssh "cd ${ronin} && ln -s bundle-${version} bundle" &&
    execcmd "scp ${service_src} ${target}:${service_dest}" &&
    execssh "systemctl daemon-reload" &&
    execcmd "scp ${start_src} ${target}:${start_dest}" &&
    execssh "systemctl start ronin" &&
    echo "Server deployed as v ${version}"
_ret=$?

# mobile apk preparation
[ $_ret -eq 0 ] &&
    apk="/tmp/ronin-v${version}.apk" &&
    execcmd "rm -f ${apk}" &&
    execcmd "jarsigner -storepass abcdef -keystore ${projectdir}/.keystore -verbose -sigalg SHA1withRSA -digestalg SHA1 /tmp/android/project/app/build/outputs/apk/release/app-release-unsigned.apk ronin.trychlos.org" &&
    execcmd "${HOME}/data/Android/Sdk/build-tools/29.0.2/zipalign 4 /tmp/android/project/app/build/outputs/apk/release/app-release-unsigned.apk ${apk}" &&
    execcmd "git rm ${projectdir}/public/res/apk/*.apk" &&
    execcmd "mkdir -p ${projectdir}/public/res/apk" &&
    execcmd "cp ${apk} ${projectdir}/public/res/apk/" &&
    echo "APK prepared as ${apk}"
_ret=$?

# on successful release, commit the new mobile configuration
[ $_ret -eq 0 ] &&
	execcmd "git add ${projectdir}/mobile-config.js ${projectdir}/private/config/public/version.json ${projectdir}/public/res/apk/*.apk" &&
	echo "$(date '+%Y%m%d-%H%M%S') git commit -m 'Deploy v${version} to integration platforms'" &&
	git commit -m "Deploy v${version} to integration platforms" &&
	echo "$(date '+%Y%m%d-%H%M%S') git tag -am 'Releasing v${version}' ${version}" &&
	git tag -am "Releasing v${version}" ${version}
_ret=$?

exit ${_ret}

