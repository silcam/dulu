require "test_helper"

class StatusParameterTest < ActiveSupport::TestCase
  test "Presence Validation" do
    params = { prompt: "prompt", domain: "Literacy" }
    model_validation_hack_test StatusParameter, params
  end

  test "Domain Validation" do
    status_param = StatusParameter.new(prompt: "prompt", domain: "Literacy")
    assert status_param.valid?
    status_param.domain = "Pizza"
    refute status_param.valid?
  end

  test "Number Unit Validation" do
    status_param = StatusParameter.new(prompt: "prompt", domain: "Literacy")
    assert status_param.valid?
    status_param.number_field = true
    refute status_param.valid?
    status_param.number_unit = "%"
    assert status_param.valid?
  end
end
