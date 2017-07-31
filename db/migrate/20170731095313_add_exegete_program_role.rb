class AddExegeteProgramRole < ActiveRecord::Migration[5.0]
  def up
    ProgramRole.create!(name: 'Exegete')
  end

  def down
    ProgramRole.find_by(name: 'Exegete').destroy
  end
end
