#!/usr/bin/env bash
#
# The bumbailiff allows the team to take up a small amount of technical debt
# (TODOs in the code) for a limited period. After that period the script fails.
#
# Originally written by Aslak Hellesoy
#
set -ef -o pipefail
IFS=$'\n' # make newlines the only separator

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'
TODO_PATTERN="\(\/\/\|\#\)\s*TODO"

YOUNG=7
OLD=30

now_seconds_since_epoch_utc=$(date +%s)
todo_age_days_total=0
todo_count=0
exitCode=0
oldest=0

leftpad() {
  printf "%+3s\n" $1
}

for bumbai_file in $(git grep -i --files-with-matches "${TODO_PATTERN}"); do
  for todo_line in $(git blame "${bumbai_file}" -s -l -f | grep -i "${TODO_PATTERN}"); do
    sha=$(echo "${todo_line}" | cut -c1-40)
    commit_seconds_since_epoch_utc=$(git show -s --format="%at" "${sha}")

    todo_age_days=$(( (now_seconds_since_epoch_utc - commit_seconds_since_epoch_utc) / 86400 ))
    todo_age_days_total=$(( $todo_age_days_total + todo_age_days ))
    todo_count=$(( todo_count + 1 ))

    if ((${todo_age_days}>${oldest})); then
      oldest=${todo_age_days}
    fi

    # Formatting
    if ((${todo_age_days}<=${YOUNG})); then
      color="${GREEN}"
    elif ((${todo_age_days}<=${OLD})); then
      color="${ORANGE}"
      if ((${exitCode}==0)); then
        exitCode=0
      fi
    else
      color="${RED}"
      exitCode=2
    fi

    path_length=${#bumbai_file}
    cutoff=$((40 + 2 + path_length + 1))
    todo_line_stripped=$(echo "${todo_line}" | cut -c${cutoff}-)

    prefix="${color}$(leftpad ${todo_age_days}) days:${NC}"
    echo -e "${prefix} (${bumbai_file}:${todo_line_stripped}"
  done
done
echo
echo -e "Tech debt: ${BOLD}${todo_count}${NC} TODOs. The oldest is ${BOLD}${oldest}${NC} days old."
exit ${exitCode}
