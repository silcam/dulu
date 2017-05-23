class UpdateStageNamesForI18n < ActiveRecord::Migration[5.0]
  def change
    StageName.find(4).update name: 'Review_committee'
    StageName.find(5).update name: 'Back_translating'
    StageName.find(6).update name: 'Ready_for_consultant_check'
    StageName.find(7).update name: 'Consultant_check'
    StageName.find(8).update name: 'Consultant_checked'

  end
end
