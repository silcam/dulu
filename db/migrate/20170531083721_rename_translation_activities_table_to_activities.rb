class RenameTranslationActivitiesTableToActivities < ActiveRecord::Migration[5.0]
  def change
    rename_table :translation_activities, :activities
    add_column :activities, :type, :string

    Activity.all.each { |activity| activity.update(type: 'TranslationActivity')}
  end
end
