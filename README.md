# README

## Warning
The Readme is still a work in progress. It actually won't get you very far, because there's a lot of seed data you need to get going, and I don't have that in a useful format right now. So if you're trying to setup Dulu for whatever reason, let me know so I can help you out.

## For Development

### Prerequisites
* [Ruby](https://www.ruby-lang.org/en/downloads/) - We're using rbenv and ruby 2.3.3.
* [PostGreSQL](https://www.postgresql.org/)

### Setup
1. Clone the repo.

    ```shell
    git clone https://github.com/silcam/dulu.git

2. Create databases dulu_dev and dulu_test. See database.yml for the username and password to use.

3. Install bundler if you don't already have it

    ```shell
    gem install bundler

4. Install the necessary gems

    ```shell
    cd dulu
    bundle install

5. Initialize the development database

    ```shell
    rails db:schema:load

6. Start the server. Access Dulu at http://localhost:3000

    ```shell
    rails s