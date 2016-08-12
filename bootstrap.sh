#!/bin/sh
set -e

### define functions
set_defaults() {
  ENV=development
}

gather_options() {
  while getopts "3:" OPT; do
    case $OPT in
      e)
        ENV=$OPTARG
      ;;
    esac
  done
}

clear_out_containers() {
  local environment=$1

  case $environment in
    'development')
      docker-compose stop
      docker-compose rm --force
    ;;
  esac
}

setup_containers() {
  local environment=$1

  case $environment in
    'development')
      docker-compose build
    ;;
  esac
}
### define functions:end

set_defaults
gather_options $@

case $ENV in
  'development')
    echo "Clearing out old containers"
    clear_out_containers $ENV
    echo "Setting up $ENV containers"
    setup_containers $ENV
  ;;
esac

