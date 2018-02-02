class CreateViewedReports < ActiveRecord::Migration[5.0]
  def change
    create_table :viewed_reports do |t|
      t.references :person
      t.references :report
      t.timestamps
    end
  end
end
