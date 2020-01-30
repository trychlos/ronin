#!/bin/sh
# This script is run from the maintainer/ directory of the project

maintainerdir="$(cd ${0%/*}; pwd)"
projectdir="${maintainerdir%/*}"
target="www8"
ronin="/home/ronin"

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
    _today="$(date +'%y.%m.%d')"
    _count=0
    if [ ${#_last} -gt 6 ]; then
        _prev=${_last:0:6}
        if [ "${_prev}" == "${_today}" ]; then
            _count=${_last:6:1}
        fi
    fi
    _count=$(( _count+1 ))
    echo "${_today}.${_count}"
}

# compute the current version and update the mobile configuration accordingly
version="$(next_version)"
sed -i -e "s|^\(\s*version\s*:\s*\).*$|\1'$version',|" "${projectdir}/mobile-config.js"
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
    execssh "systemctl start ronin" &&
    echo "Server deployed as v ${version}"
_ret=$?

# mobile apk preparation
[ $_ret -eq 0 ] &&
    apk="/tmp/ronin-v${version}.apk" &&
    execcmd "rm -f ${apk}" &&
    execcmd "jarsigner -storepass abcdef -keystore ${projectdir}/.keystore -verbose -sigalg SHA1withRSA -digestalg SHA1 /tmp/android/project/app/build/outputs/apk/release/app-release-unsigned.apk ronin.trychlos.org" &&
    execcmd "${HOME}/data/Android/Sdk/build-tools/29.0.2/zipalign 4 /tmp/android/project/app/build/outputs/apk/release/app-release-unsigned.apk ${apk}" &&
    echo "APK prepared as ${apk}"
