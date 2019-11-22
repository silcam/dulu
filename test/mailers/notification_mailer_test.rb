require "test_helper"

class NotificationMailerTest < ActionMailer::TestCase
  def setup
    @rick = people(:Rick)
    @drew = people(:Drew)
  end

  def generate_notification
    Notification.updated_person(@rick, @drew)
  end

  def un_ws(text)
    text.gsub(/\s+/, ' ')
  end

  test 'Welcome Email' do
    email = NotificationMailer.welcome(@drew, @rick)
    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['drew_mambo@sil.org'], email.to
    assert_equal 'Welcome to Dulu!', email.subject
    assert_includes(
      un_ws(email.html_part.body.to_s), 
      un_ws(read_fixture('styles').join)
    )
    assert_includes(
      un_ws(email.html_part.body.to_s),
      un_ws(read_fixture('welcome').join)
    )
  end

  test 'Notification Email' do
    generate_notification

    email = NotificationMailer.notify(@drew.person_notifications.last)
    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['drew_mambo@sil.org'], email.to
    assert_equal 'New Dulu Notification', email.subject
    assert_includes(
      un_ws(email.html_part.body.to_s), 
      un_ws(read_fixture('styles').join)
    )
    assert_includes(
      un_ws(email.html_part.body.to_s),
      un_ws(read_fixture('update_drew').join)
    )
  end

  test 'Notification Summary Email' do
    3.times do
      generate_notification
    end
    @drew.person_notifications.update(emailed: false)

    email = NotificationMailer.notification_summary(@drew)
    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['drew_mambo@sil.org'], email.to
    assert_equal 'New Dulu Notifications', email.subject
    assert_includes(
      un_ws(email.html_part.body.to_s), 
      un_ws(read_fixture('styles').join)
    )
    assert_includes(
      un_ws(email.html_part.body.to_s),
      un_ws(read_fixture('summary').join)
    )

    @drew.reload
    assert @drew.person_notifications.all(&:emailed)
  end
end
