# frozen_string_literal: true

require 'test_helper'

class TagTest < ActiveSupport::TestCase
  def setup
    I18n.locale = :en
  end

  test 'Events can have multiple tags' do
    @hdi_genesis = events :HdiGenesisChecking
    assert_equal(0, @hdi_genesis.tags.size, 'no tags initially')

    tag_name = Tag.create(tagname: 'tag name')
    book_tag = Tag.create(tagname: 'book name')

    @hdi_genesis.tags << tag_name
    @hdi_genesis.tags << book_tag

    assert_equal(2, @hdi_genesis.tags.size, 'added 2 tags')
  end

  test 'Can find by tag' do
    @hdi_genesis = events :HdiGenesisChecking
    assert_equal(0, @hdi_genesis.tags.size, 'no tags initially')

    tag_name = Tag.create(tagname: 'tag name')
    @hdi_genesis.tags << tag_name

    assert_equal(1, tag_name.events.size)
    assert(tag_name.events.exists?(@hdi_genesis.id))
  end
  
  # TODO: permissions check
  # TODO: bible books helper
  # TODO: tag per language per event?
end
