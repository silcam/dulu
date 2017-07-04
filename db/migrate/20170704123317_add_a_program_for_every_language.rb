class AddAProgramForEveryLanguage < ActiveRecord::Migration[5.0]
  def up
    Language.all.each do |language|
      language.program = Program.create if language.program.nil?
    end
  end

  def down
    Program.all.each do |program|
      program.destroy if program.translation_activities.empty?
    end
  end
end
