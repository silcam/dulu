class SeedProgramRolesStageNames < ActiveRecord::Migration[5.0]
  def up
    StageName.where(kind: 'Translation', level: (2..5)).each{|stage| stage.program_roles << ProgramRole.find_by(name: 'Translator') }
    StageName.where(kind: 'Translation', level: (6..8)).each{|stage| stage.program_roles << ProgramRole.find_by(name: 'TranslationConsultant') }
    StageName.where(kind: 'Translation', level: (6..8)).each{|stage| stage.program_roles << ProgramRole.find_by(name: 'TranslationConsultantTraining') }
  end

  def down
    # Do nothing
  end
end
