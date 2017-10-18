class AddOrderToStatusParameters < ActiveRecord::Migration[5.0]
  def change
    add_column :status_parameters, :order, :integer
  end
end
