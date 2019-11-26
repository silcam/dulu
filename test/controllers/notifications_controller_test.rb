# frozen_string_literal: true

require 'test_helper'

class NotificationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @drew = people(:Drew)
    @now = Time.now
    api_login
    Time.stub :now, @now do
      seed_notifications
    end
  end

  def seed_notifications
    [
      ['Drew Mambo added Abanda Dunno to the Genesis Checking event.', 'Drew Mambo a ajouté Abanda Dunno à Genèse Checking.', true, 'DTra '],
      ['Lance Armstrong completed the Noun workshop.', "Lance Armstrong à terminé l'atelier Nom.", false, 'DLng '],
      ['Rick Conrad added Drew Mambo to the Hdi program.', 'Rick Conrad a ajouté Drew Mambo au programme Hdi.', false, 'DTra ']
    ].each do |params|
      ntfn = Notification.create!(english: params[0], french: params[1], creator: @drew, channels: params[3])
      PersonNotification.create!(notification: ntfn, person: @drew, read: params[2])
    end
  end

  def ntfn_path(rest = '')
    "/api/notifications#{rest}"
  end

  test 'Basic Index' do
    data = api_get ntfn_path
    assert_equal 3, data[:notifications].count
    assert_not data[:moreAvailable]
    assert data[:unreadNotifications]
    ntfn = data[:notifications].first
    assert_equal 'Rick Conrad added Drew Mambo to the Hdi program.', ntfn[:text]
    assert_equal @now.to_s.slice(0, 10), ntfn[:created_at].slice(0, 10)
    assert_not ntfn[:person_notification][:read]
  end

  test 'Basic Global' do
    data = api_get ntfn_path('/global')
    assert_equal 3, data[:notifications].count
    assert_not data[:moreAvailable]
    assert_not data[:unreadNotifications]
    ntfn = data[:notifications].first
    assert_equal 'Rick Conrad added Drew Mambo to the Hdi program.', ntfn[:text]
    assert_equal @now.to_s.slice(0, 10), ntfn[:created_at].slice(0, 10)
    assert_not ntfn[:person_notification]
  end

  test 'Index with All Read' do
    PersonNotification.update(read: true)
    data = api_get ntfn_path
    assert_not data[:unreadNotifications]
    assert_not(data[:notifications].any? { |pn| pn[:read] })
  end

  test 'Index and Global in French' do
    @drew.update(ui_language: :fr)
    data = api_get ntfn_path
    assert_equal 'Rick Conrad a ajouté Drew Mambo au programme Hdi.', data[:notifications].first[:text]
    data = api_get ntfn_path('/global')
    assert_equal 'Rick Conrad a ajouté Drew Mambo au programme Hdi.', data[:notifications].first[:text]
  end 

  test 'Index and Global - More Available & Page 2' do
    4.times do
      seed_notifications
    end
    data = api_get ntfn_path
    assert data[:moreAvailable]
    assert_equal 12, data[:notifications].count
    data = api_get ntfn_path('?page=1')
    assert_not data[:moreAvailable]
    assert_equal 3, data[:notifications].count

    data = api_get ntfn_path('/global')
    assert data[:moreAvailable]
    assert_equal 12, data[:notifications].count
    data = api_get ntfn_path('/global?page=1')
    assert_not data[:moreAvailable]
    assert_equal 3, data[:notifications].count
  end

  test 'Global by channel' do
    data = api_get ntfn_path('/global?channels=DTra%20')
    assert_equal 2, data[:notifications].count
    data = api_get ntfn_path('/global?channels=DTra%20DLng%20')
    assert_equal 3, data[:notifications].count
  end

  test 'Mark all as read' do
    data = api_get ntfn_path
    to = data[:notifications].first[:person_notification][:id]
    from = data[:notifications].last[:person_notification][:id]
    api_post(ntfn_path('/mark_read'), to: to, from: from)
    data = api_get ntfn_path
    assert_not data[:unreadNotifications]
  end

  test 'Mark one as read' do
    data = api_get ntfn_path
    assert_not data[:notifications].first[:person_notification][:read]
    id = data[:notifications].first[:person_notification][:id]
    api_post(ntfn_path('/mark_read'), to: id, from: id)
    data = api_get ntfn_path
    assert data[:unreadNotifications]
    assert data[:notifications].first[:person_notification][:read]
  end
end
