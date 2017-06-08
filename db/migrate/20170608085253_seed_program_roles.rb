class SeedProgramRoles < ActiveRecord::Migration[5.0]

  def rolenames
    %w[Translator TranslationConsultant TranslationConsultantTraining
    LinguisticConsultant LinguisticConsultantTraining LanguageProgramCommittee
    LanguageProgramFacilitator]
  end

  def up
    rolenames.each do |rolename|
      ProgramRole.create(name: rolename)
    end
  end

  def down
    rolenames.each do |rolename|
      ProgramRole.find_by(name: rolename).try(:destroy)
    end
  end
end
