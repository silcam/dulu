class SetRegionChannelForLpfs < ActiveRecord::Migration[5.1]
  def up
    Region.all.each do |region|
      region.lpf.add_notification_channel(
        NotificationChannel.region_channel(region.id)
      )
    end
  end

  def down
    # No worries :)
  end
end
