class AddLpfToProgramsAndClusters < ActiveRecord::Migration[5.0]
  def change
    add_reference :clusters, :lpf
    add_reference :programs, :lpf
  end
end
