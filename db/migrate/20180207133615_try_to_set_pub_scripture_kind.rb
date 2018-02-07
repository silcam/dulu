class TryToSetPubScriptureKind < ActiveRecord::Migration[5.0]
  def up
    Publication.where(kind: 'Scripture', scripture_kind: nil).each do |pub|
      if pub.english_name.include?('Bible') || pub.french_name.include?('Bible')
        pub.update(scripture_kind: 'Bible')
      elsif pub.english_name.include?('New Testament') || pub.french_name.include?('Nouveau Testament')
        pub.update(scripture_kind: 'New_testament')
      elsif pub.english_name.include?('Old Testament') || pub.french_name.include?('Ancien Testament')
        pub.update(scripture_kind: 'Old_testament')
      else
        pub.update(scripture_kind: 'Portions')
      end
    end
  end
end
