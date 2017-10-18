class CreateClusters < ActiveRecord::Migration[5.0]
  def change
    create_table :clusters do |t|
      t.string :name

      t.timestamps
    end

    add_reference :languages, :cluster
  end
end
