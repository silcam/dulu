#!/bin/bash

rm db/test.sqlite3
rails db:schema:load RAILS_ENV=test
