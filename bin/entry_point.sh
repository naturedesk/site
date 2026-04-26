#!/bin/bash
set -euo pipefail

echo "Entry point script running"

CONFIG_FILE=_config.yml

# Keep Gemfile.lock intact. This repo's Docker build depends on it even though
# the file may be git-ignored locally.
manage_gemfile_lock() {
    if [ -f Gemfile.lock ]; then
        echo "Gemfile.lock present; keeping it intact"
    fi
}

start_jekyll() {
    manage_gemfile_lock
    bundle check >/dev/null 2>&1 || bundle install
    bundle exec jekyll serve --watch --port=8080 --host=0.0.0.0 --livereload --verbose --trace --force_polling &
}

start_jekyll

while true; do
    inotifywait -q -e modify,move,create,delete $CONFIG_FILE
    if [ $? -eq 0 ]; then
        echo "Change detected to $CONFIG_FILE, restarting Jekyll"
        jekyll_pid=$(pgrep -f jekyll)
        kill -KILL $jekyll_pid
        start_jekyll
    fi
done
