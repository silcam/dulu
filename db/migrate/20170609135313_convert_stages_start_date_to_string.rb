class ConvertStagesStartDateToString < ActiveRecord::Migration[5.0]
  def up
    rename_column :stages, :start_date, :start_date_old
    add_column :stages, :start_date, :string

    Stage.all.each{ |s| s.update start_date: s.start_date_old }

    remove_column :stages, :start_date_old
  end

  def down
    rename_column :stages, :start_date, :start_date_old
    add_column :stages, :start_date, :date

    Stage.all.each{ |s| s.update start_date: s.start_date_old }

    remove_column :stages, :start_date_old
  end
end
