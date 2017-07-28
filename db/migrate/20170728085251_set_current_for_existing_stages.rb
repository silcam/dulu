class SetCurrentForExistingStages < ActiveRecord::Migration[5.0]
  def change
    Activity.all.each do |activity|
      activity.stages.order('start_date DESC').first.update!(current: true)
    end
  end
end
