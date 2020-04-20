#!/bin/sh
# This script is run from the maintainer/ directory of the project
# pwi 2020- 3-29 do not git add/git commit if not on the deployment branch

maintainerdir="$(cd ${0%/*}; pwd)"
projectdir="${maintainerdir%/*}"
prod_host="www8"
prod_home="/home/ronin"
prod_arch="os.linux.x86_64"
service_src="${maintainerdir}/www-host/ronin.service"
service_dest="/etc/systemd/system/"
start_src="${maintainerdir}/www-host/start.sh"
start_dest="${prod_home}/"
target_url="https://ronin.trychlos.org"

# we are deploying from the master branch
deploy_branch="master"

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
    execcmd ssh ${prod_host} ${_cmd}
}

next_version(){
    _line="$(execssh "ls -l ${prod_home}/bundle")"
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

check_space(){
	_last="$(ssh ${prod_host} "du -sm ${prod_home}/bundle/" | awk '{ print $1 }')"
	_needed=$(( _last*2 ))
    _avail="$(ssh ${prod_host} "df -BM" | grep ${prod_home} | awk '{ print $4 }' | sed 's/.$//')"
	#echo "last=${_last} needed=${_needed} available=${_avail} MB"
	if [ ${_avail} -gt ${_needed} ]; then
		echo "Available space=${_avail} MB, needed=${_needed} MB: OK"
	else
		echo "Available space=${_avail} MB, needed=${_needed} MB: have to free up some space"
		_count="$(ssh ${prod_host} "ls -1dt ${prod_home}/bundle-*" | wc -l)"
		_keep=$(( _count/3 ))
		_delete=$(( _count-_keep ))
		echo "  ${_count} versions found, ${_delete} to be removed"
		_i=0
		for dir in $(ssh ${prod_host} "ls -1dt ${prod_home}/bundle-*"); do
			_i=$(( _i+1 ))
			if [ ${_i} -le ${_keep} ]; then
				echo "  keeping ${dir}"
			else
				echo "  $(execssh "rm -fr ${dir}")"
				#echo "@ rm -fr ${dir}"
			fi
		done
	fi
	return 0
}

# compute the current version and update the mobile configuration accordingly
# pwi 2020- 2-23 also update the private/config/public/version.json configuration file
version="$(next_version)"
sed -i -e "s|^\(\s*version\s*:\s*\).*$|\1'$version',|" "${projectdir}/mobile-config.js"
sed -i -e "s|[0-9\.]\+|$version|" "${projectdir}/private/config/public/version.json"
echo "Deploying v ${version}..."

# build server+mobile versions
execcmd "meteor build /tmp --server ${target_url} --architecture ${prod_arch}"
_ret=$?

# make sure the target url is up to date in the server startup script
sed -i -e "s|^\(\s*export\s\+ROOT_URL=\).*$|\1'$target_url'|" "${start_src}"

# server deployement
[ $_ret -eq 0 ] &&
	check_space &&
    execcmd "scp /tmp/ronin.tar.gz ${prod_host}:/tmp" &&
    execssh "systemctl stop ronin" &&
    execssh "cd ${prod_home} && rm -f bundle" &&
    execssh "cd ${prod_home} && tar -xzf /tmp/ronin.tar.gz" &&
    execssh "cd ${prod_home} && chown -R ronin:ronin bundle" &&
    execssh "cd ${prod_home} && mv bundle bundle-${version}" &&
    execssh "cd ${prod_home} && ln -s bundle-${version} bundle" &&
    execcmd "scp ${service_src} ${prod_host}:${service_dest}" &&
    execssh "systemctl daemon-reload" &&
    execcmd "scp ${start_src} ${prod_host}:${start_dest}" &&
    execssh "systemctl start ronin" &&
    echo "Server deployed as v ${version}"
_ret=$?

# mobile apk preparation
[ $_ret -eq 0 ] &&
    apk="/tmp/ronin-v${version}.apk" &&
    execcmd "rm -f ${apk}" &&
    execcmd "jarsigner -storepass abcdef -keystore ${projectdir}/.keystore -verbose -sigalg SHA1withRSA -digestalg SHA1 /tmp/android/project/app/build/outputs/apk/release/app-release-unsigned.apk ronin.trychlos.org" &&
    execcmd "${HOME}/data/Android/Sdk/build-tools/29.0.2/zipalign 4 /tmp/android/project/app/build/outputs/apk/release/app-release-unsigned.apk ${apk}" &&
    execcmd "rm -fr ${projectdir}/public/res/apk" &&
    execcmd "mkdir -p ${projectdir}/public/res/apk" &&
    execcmd "cp ${apk} ${projectdir}/public/res/apk/" &&
    echo "APK prepared as ${apk}"
_ret=$?

# on successful release, commit the new mobile configuration + github push
if [ $_ret -eq 0 ]; then
	_branch="$(git branch | awk '/^\* / { print $2 }')"
	if [ "${_branch}" == "${deploy_branch}" ]; then
		execcmd "git add ${projectdir}/mobile-config.js ${projectdir}/private/config/public/version.json" &&
		echo "$(date '+%Y%m%d-%H%M%S') git commit -m 'Deploy v${version} to production platforms'" &&
		git commit -m "Deploy v${version} to production platforms" &&
		echo "$(date '+%Y%m%d-%H%M%S') git tag -am 'Releasing v${version}' ${version}" &&
		git tag -am "Releasing v${version}" ${version} &&
		execcmd "git push" &&
		execcmd "git push --tags"
		_ret=$?
	fi
fi

exit ${_ret}

