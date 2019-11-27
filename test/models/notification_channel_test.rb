# frozen_string_literal: true

require 'test_helper'

class NotificationChannelTest < ActiveSupport::TestCase
  demo_channels = 'Lng4 Cls12 DTra '

  def setup
    @bangolan = languages(:Bangolan)
    @ewondo = languages(:Ewondo)
    @south = lpfs(:SouthRegion)
    @ndop = clusters(:Ndop)
  end

  test 'Basic channel codes' do
    assert_equal('Lng41 ', NotificationChannel.language_channel(41))
    assert_equal('Cls41 ', NotificationChannel.cluster_channel(41))
    assert_equal('Reg41 ', NotificationChannel.region_channel(41))
    assert_equal('DTra ', NotificationChannel.domain_channel(:Translation))
    assert_equal('DLin ', NotificationChannel.domain_channel(:Linguistics))
    assert_equal('DLit ', NotificationChannel.domain_channel(:Literacy))
    assert_equal('DScr ', NotificationChannel.domain_channel(:Scripture_use))
  end

  test 'Add Channel' do
    assert_equal(
      'Lng4 Cls12 DTra Reg2 ', 
      NotificationChannel.add_channel(demo_channels, 'Reg2 ')
    )
    assert_equal(
      'Lng4 Cls12 DTra ', 
      NotificationChannel.add_channel(demo_channels, 'DTra ')
    )
  end

  test 'Remove Channel' do
    assert_equal(
      'Cls12 DTra ', 
      NotificationChannel.remove_channel(demo_channels, 'Lng4 ')
    )
    assert_equal(
      'Lng4 Cls12 DTra ', 
      NotificationChannel.remove_channel(demo_channels, 'Lng5 ')
    )
  end

  test 'Unsupported object throw in channels_for' do
    assert_raises "NotificationChannel.channels_for doesn't know how to handle Yoohoo!" do
      NotificationChannel.channels_for('Yoohoo')
    end
  end

  test 'Empty channels_for' do
    assert_empty NotificationChannel.channels_for([])
  end

  test 'Channels for Domain' do
    assert_equal(
      'DTra ',
      NotificationChannel.channels_for(:Translation)
    )
  end

  test 'Channels for Language - Lang, Cluster & Region' do 
    assert_equal(
      "Lng#{@bangolan.id} Cls#{@ndop.id} Reg#{@south.id} ",
      NotificationChannel.channels_for(@bangolan)
    )
  end

  test 'Channels for Language - Lang & Region' do 
    assert_equal(
      "Lng#{@ewondo.id} Reg#{@south.id} ",
      NotificationChannel.channels_for(@ewondo)
    )
  end

  test 'Channels for Language - Lang Only' do 
    @ewondo.update(lpf: nil)
    assert_equal(
      "Lng#{@ewondo.id} ",
      NotificationChannel.channels_for(@ewondo)
    )
  end

  test 'Channels for cluster' do 
    assert_equal(
      "Cls#{@ndop.id} Lng#{languages(:Bambalang).id} Lng#{@bangolan.id} Reg#{@south.id} ",
      NotificationChannel.channels_for(@ndop)
    )
  end

  test 'Channels for cluster - No Region' do 
    @ndop.update(lpf: nil)
    assert_equal(
      "Cls#{@ndop.id} Lng#{languages(:Bambalang).id} Lng#{@bangolan.id} ",
      NotificationChannel.channels_for(@ndop)
    )
  end

  test 'People for Channels' do
    assert_equal(
      [people(:Kendall), people(:Nancy)], 
      NotificationChannel.people_for_channels("DTra Lng#{@ewondo.id} ")
    )
  end

  test 'People for empty channels' do
    assert_empty NotificationChannel.people_for_channels('')
  end

  test 'Integrate channels_for with people_for_channels' do
    notify_people = NotificationChannel.people_for_channels(
      NotificationChannel.channels_for(:Translation, languages(:Ewondo), clusters(:Ndop))
    )
    assert_equal(
      [people(:Kendall), people(:Drew), people(:Nancy), people(:Olga), people(:Freddie)], 
      notify_people
    )
  end
end
