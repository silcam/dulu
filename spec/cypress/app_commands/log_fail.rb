# This file is called when a cypress spec fails and allows for extra logging to be captured
filename = command_options.fetch('runnable_full_title', 'no title').gsub(/[^[:print:]]/, '')

# Grab the last lines of the Rails log back to the "APPCLEANED" marker that clean.rb
# writes -- i.e. just the log for the test that failed.
#
# This used `tail -n 10000 -r`, but -r (reverse) is BSD/macOS only. On Linux it fails with
# "tail: invalid option -- 'r'" and the capture file is written empty, so every failing
# test silently produced no server-side log at all -- exactly when you most want one.
# `tac` is the GNU way to reverse, and the second `sed` incantation was doing the same job
# a second time. Reverse, cut at the marker, reverse back.
system "tail -n 10000 log/#{Rails.env}.log | tac | sed \"/APPCLEANED/ q\" | tac > 'log/#{filename}.log'"

# create a json debug file for server debugging
json_result = {}
json_result['error'] = command_options.fetch('error_message', 'no error message')

# What the browser saw when the command timed out -- the page's URL, the icons actually
# present, the visible text, and any uncaught exception the support file swallowed. The
# Rails log alone cannot show any of this: the server is typically finished and idle long
# before the failure. Collected in the Cypress `fail` hook; see support/commands.js.
json_result['diagnostics'] = command_options['diagnostics'] if command_options['diagnostics']

if defined?(ActiveRecord::Base)
  json_result['records'] =
    ActiveRecord::Base.descendants.each_with_object({}) do |record_class, records|
      begin
        records[record_class.to_s] = record_class.limit(100).map(&:attributes)
      rescue
      end
    end
end

filename = command_options.fetch('runnable_full_title', 'no title').gsub(/[^[:print:]]/, '')
File.open("#{Rails.root}/log/#{filename}.json", "w+") do |file|
  file << JSON.pretty_generate(json_result)
end
