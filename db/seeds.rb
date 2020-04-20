# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
connection = ActiveRecord::Base.connection

seed_tables = %w[
  bible_books
  clusters
  countries_languages
  countries
  languages
  language_statuses
  organizations
  regions
]

seed_tables.each do |tbl|
  puts "Reloading data for table: #{tbl}"
  connection.execute("TRUNCATE #{tbl}")

  sql = File.read("db/seeds/#{tbl}")
  statements = sql.split(/;$/)
  statements.pop # the last empty statement

  ActiveRecord::Base.transaction do
    statements.each do |statement|
      connection.execute(statement)
    end
  end
end

if Person.count == 0
  puts 'The system needs to have an admin user to login.'
  puts 'Please enter your email address you will log in with:'

  email = $stdin.gets.chomp

  puts 'Please enter your name (format: First Last)'

  name = $stdin.gets.chomp

  (first, last) = name.split

  puts "You entered first name: #{first}"
  puts "You entered last name: #{last}"

  pers = Person.create(first_name: first, last_name: last, email: email, has_login: 't')
  pers.add_role('DuluAdmin')
  pers.save
else
  puts 'Skipping admin user creation because users exist.'
end

puts 'You may now start your rails server (foreman start)'
