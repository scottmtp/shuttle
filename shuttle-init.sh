#!/bin/bash
#
### BEGIN INIT INFO
# Provides:             shuttle
# Required-Start:       $syslog $remote_fs
# Required-Stop:        $syslog $remote_fs
# Should-Start:         $local_fs
# Should-Stop:          $local_fs
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
# Short-Description:    My Application
# Description:          My Application
### END INIT INFO
#
### BEGIN CHKCONFIG INFO
# chkconfig: 2345 55 25
# description: shuttle
### END CHKCONFIG INFO
#
# Based on:
# https://gist.github.com/3748766
# https://github.com/hectorcorrea/hectorcorrea.com/blob/master/etc/forever-initd-hectorcorrea.sh
# https://www.exratione.com/2011/07/running-a-nodejs-server-as-a-service-using-forever/
#
# NAME="My Application"
# The full path to the directory containing the node and forever binaries.
# NODE_BIN_DIR="/usr/local/node/bin"
# Set the NODE_PATH to the Node.js main node_modules directory.
# NODE_PATH="/usr/local/lib/node_modules"
# The application startup Javascript file path.
# APPLICATION_PATH="/home/user/my-application/start-my-application.js"
# Process ID file path.
# PIDFILE="/var/run/my-application.pid"
# Log file path.
# LOGFILE="/var/log/my-application.log"
# Forever settings to prevent the application spinning if it fails on launch.
# MIN_UPTIME="5000"
# SPIN_SLEEP_TIME="2000"

NAME="shuttle"
NODE_BIN_DIR="/usr/local/node-v4.4.7-linux-x64/bin/"
NODE_PATH="/usr/local/node-v4.4.7-linux-x64/lib/node_modules/"
APPLICATION_PATH="/usr/local/shuttle/deploy/current/server.js"
PIDFILE="/var/run/shuttle.pid"
LOGFILE="/var/log/shuttle.log"
MIN_UPTIME="5000"
SPIN_SLEEP_TIME="2000"

export NODE_ENV="production"
export WWW_DIR="/usr/local/shuttle/deploy/current/dist/"
export SSL_PREFIX="/usr/local/shuttle/ssl/"
export SSL_KEY_FILE="www.tryshuttle.com.key"
export SSL_CERT_FILE="www.tryshuttle.com.crt"
export SSL_CA_FILE="www.tryshuttle.com.chain.crt"
export JWT_TOKEN_FILE="/usr/local/shuttle/ssl/jwttoken.txt"
export EMAIL_TOKEN_FILE="/usr/local/shuttle/ssl/emailtoken.txt"

export USE_LEX=1
export LEX_SERVER="https://acme-v01.api.letsencrypt.org/directory"
export LEX_DOMAIN="tryshuttle.com"

# Add node to the path for situations in which the environment is passed.
PATH=$NODE_BIN_DIR:$PATH
# Export all environment variables that must be visible for the Node.js
# application process forked by Forever. It will not see any of the other
# variables defined in this script.
export NODE_PATH=$NODE_PATH

start() {
    echo "Starting $NAME"
    # We're calling forever directly without using start-stop-daemon for the
    # sake of simplicity when it comes to environment, and because this way
    # the script will work whether it is executed directly or via the service
    # utility.
    #
    # The minUptime and spinSleepTime settings stop Forever from thrashing if
    # the application fails immediately on launch. This is generally necessary to
    # avoid loading development servers to the point of failure every time
    # someone makes an error in application initialization code, or bringing down
    # production servers the same way if a database or other critical service
    # suddenly becomes inaccessible.
    #
    # The pidfile contains the child process pid, not the forever process pid.
    # We're only using it as a marker for whether or not the process is
    # running.
    #
    # Note that redirecting the output to /dev/null (or anywhere) is necessary
    # to make this script work if provisioning the service via Chef.
    forever \
      --pidFile $PIDFILE \
      -a \
      -l $LOGFILE \
      --minUptime $MIN_UPTIME \
      --spinSleepTime $SPIN_SLEEP_TIME \
      start $APPLICATION_PATH 2>&1 > /dev/null &
    RETVAL=$?
}

stop() {
    if [ -f $PIDFILE ]; then
        echo "Shutting down $NAME"
        # Tell Forever to stop the process.
        forever stop $APPLICATION_PATH 2>&1 > /dev/null
        # Get rid of the pidfile, since Forever won't do that.
        rm -f $PIDFILE
        RETVAL=$?
    else
        echo "$NAME is not running."
        RETVAL=0
    fi
}

restart() {
    stop
    start
}

status() {
    # On Ubuntu this isn't even necessary. To find out whether the service is
    # running, use "service my-application status" which bypasses this script
    # entirely provided you used the service utility to start the process.
    #
    # The commented line below is the obvious way of checking whether or not a
    # process is currently running via Forever, but in recent Forever versions
    # when the service is started during Chef provisioning a dead pipe is left
    # behind somewhere and that causes an EPIPE exception to be thrown.
    # forever list | grep -q "$APPLICATION_PATH"
    #
    # So instead we add an extra layer of indirection with this to bypass that
    # issue.
    echo `forever list` | grep -q "$APPLICATION_PATH"
    if [ "$?" -eq "0" ]; then
        echo "$NAME is running."
        RETVAL=0
    else
        echo "$NAME is not running."
        RETVAL=3
    fi
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        restart
        ;;
    *)
        echo "Usage: {start|stop|status|restart}"
        exit 1
        ;;
esac
exit $RETVAL
