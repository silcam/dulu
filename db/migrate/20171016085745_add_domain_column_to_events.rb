class AddDomainColumnToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :domain, :string

    reversible do |dir|
      dir.up do
        Event.all.each do |event|
          event.update! domain: 'Translation'
        end
      end
    end
  end
end
