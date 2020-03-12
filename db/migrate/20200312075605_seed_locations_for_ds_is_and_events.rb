# frozen_string_literal: true

class SeedLocationsForDsIsAndEvents < ActiveRecord::Migration[5.1]
  def up
    ['CMB Library', 'Language & Culture Archives', 'REAP', 'CMB LangData Drive'].each do |name|
      DsiLocation.create(name: name)
    end

    EventLocation.create(name: 'Yaoundé, Cameroon')
  end
end
