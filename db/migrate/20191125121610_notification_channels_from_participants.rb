class NotificationChannelsFromParticipants < ActiveRecord::Migration[5.1]
  def up
    Person.all.each do |person|
      person.update!(
        notification_channels: person.current_participants
          .map do |ptpt|
            ptpt.language_id ? 
              NotificationChannel.language_channel(ptpt.language_id) : 
              NotificationChannel.cluster_channel(ptpt.cluster_id)
          end
          .join('')
      )
    end
  end

  def down
    ActiveRecord::Base.connection.exec_query("UPDATE people SET notification_channels = '';")
  end
end
