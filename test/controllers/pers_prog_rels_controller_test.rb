require 'test_helper'

class PersProgRelsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get pers_prog_rels_new_url
    assert_response :success
  end

  test "should get create" do
    get pers_prog_rels_create_url
    assert_response :success
  end

end
