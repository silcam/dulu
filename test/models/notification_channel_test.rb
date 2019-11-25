# frozen_string_literal: true

require 'test_helper'

class NotificationChannelTest < ActiveSupport::TestCase
  demo_channels = 'Lng4 Cls12 DTra '

  test 'Basic channel codes' do
    assert_equal('Lng41 ', NotificationChannel.language_channel(41))
    assert_equal('Cls41 ', NotificationChannel.cluster_channel(41))
    assert_equal('Reg41 ', NotificationChannel.region_channel(41))
    assert_equal('DTra ', NotificationChannel.domain_channel(:Translation))
    assert_equal('DLng ', NotificationChannel.domain_channel(:Linguistics))
    assert_equal('DLit ', NotificationChannel.domain_channel(:Literacy))
    assert_equal('DScr ', NotificationChannel.domain_channel(:Scripture_use))
  end

  test 'Supported Domain' do
    assert NotificationChannel.supported_domain?(:Translation)
    assert !NotificationChannel.supported_domain?(:Basket_weaving)
  end

  test 'Add Channel' do
    assert_equal(
      'Lng4 Cls12 DTra Reg2 ', 
      NotificationChannel.add_channel(demo_channels, NotificationChannel.region_channel(2))
    )
    assert_equal(
      'Lng4 Cls12 DTra ', 
      NotificationChannel.add_channel(demo_channels, NotificationChannel.domain_channel(:Translation))
    )
  end

  test 'Remove Channel' do
    assert_equal(
      'Cls12 DTra ', 
      NotificationChannel.remove_channel(demo_channels, NotificationChannel.language_channel(4))
    )
    assert_equal(
      'Lng4 Cls12 DTra ', 
      NotificationChannel.remove_channel(demo_channels, NotificationChannel.language_channel(5))
    )
  end

  test 'Basic People for Channels' do
    assert_equal(
      [people(:Nancy)], 
      NotificationChannel.people_for_channels([NotificationChannel.domain_channel(:Translation)])
    )
  end

  test 'People for....whatever!' do
    notify_people = NotificationChannel.people_for([:Translation, languages(:Ewondo), clusters(:Ndop)])
    assert_equal(
      [people(:Nancy), people(:Kendall), people(:Olga), people(:Drew), people(:Freddie)], 
      notify_people
    )
  end

  test 'People for Domain' do
    assert_equal(
      [people(:Nancy)],
      NotificationChannel.people_for_domain(:Translation)
    )
    assert_equal(
      [],
      NotificationChannel.people_for_domain(:Unsupported_domain)
    )
  end

  test 'People for Language - Lang, Cluster & Region' do 
    notify_people = NotificationChannel.people_for_language(languages(:Bangolan))
    assert_includes(notify_people, people(:Olga))
    assert_includes(notify_people, people(:Freddie))
    assert_includes(notify_people, people(:Drew))
  end

  test 'People for Language - Lang & Region' do 
    notify_people = NotificationChannel.people_for_language(languages(:Ewondo))
    assert_includes(notify_people, people(:Kendall))
    assert_includes(notify_people, people(:Olga))
  end

  test 'People for Language - Lang Only' do 
    languages(:Ewondo).lpf = nil
    notify_people = NotificationChannel.people_for_language(languages(:Ewondo))
    assert_includes(notify_people, people(:Kendall))
  end

  test 'People for cluster' do 
    notify_people = NotificationChannel.people_for_cluster(clusters(:Ndop))
    assert_includes(notify_people, people(:Drew))
    assert_includes(notify_people, people(:Freddie))
    assert_includes(notify_people, people(:Olga))
  end

  test 'People for cluster - No Region' do 
    clusters(:Ndop).lpf = nil
    notify_people = NotificationChannel.people_for_cluster(clusters(:Ndop))
    assert_includes(notify_people, people(:Drew))
    assert_includes(notify_people, people(:Freddie))
  end
end
