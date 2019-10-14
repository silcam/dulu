require "test_helper"

class DomainUpdateTest < ActiveSupport::TestCase
  def setup
    @hdi = languages :Hdi
  end

  test "Required fields Validation" do
    params = some_valid_params
    model_validation_hack_test DomainUpdate, params
  end

  test "Valid Number" do
    domain_update = DomainUpdate.new some_valid_params
    assert domain_update.valid?
    domain_update.number = "frogs"
    refute domain_update.valid?
    domain_update.number = 50.4
    assert domain_update.valid?
  end

  test "Valid Domain" do
    domain_update = DomainUpdate.new some_valid_params
    assert domain_update.valid?
    domain_update.domain = "mmmm Donut!"
    refute domain_update.valid?
  end

  private

  def some_valid_params(other_params = {})
    { language: @hdi, status: "Going good", date: "2017", domain: "Literacy", author: people(:Drew) }.merge other_params
  end
end
