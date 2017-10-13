require 'test_helper'

class PublicationTest < ActiveSupport::TestCase
  def setup
    @ewondo_nt = publications :EwondoNT
    I18n.locale = :en
  end

  test 'Relations' do
    assert_equal programs(:EwondoProgram), @ewondo_nt.program
  end

  test 'Validations' do
    wrong_kind = Publication.new(kind: 'Wrong', english_name: 'Wrong')
    refute wrong_kind.save, "Shouldn't save without kind"
    no_name = Publication.new(kind: 'Scripture')
    refute no_name.save, "Shouldn't save without name"
    good_pub = Publication.new(kind: 'Scripture', english_name: 'Bible')
    assert good_pub.save, "Should save valid pub"
  end

  test "Name" do
    assert_equal "Ewondo New Testament", @ewondo_nt.name
    french_only = Publication.new(kind: 'Scripture', french_name: 'french name')
    nl_only = Publication.new(kind: 'Scripture', nl_name: 'nl name')
    assert_equal 'french name', french_only.name
    assert_equal 'nl name', nl_only.name
  end

  test "NL Name or Name" do
    assert_equal 'Abc Abcd', @ewondo_nt.nl_name_or_name
    @ewondo_nt.nl_name = nil
    assert_equal 'Ewondo New Testament', @ewondo_nt.nl_name_or_name
  end
end
