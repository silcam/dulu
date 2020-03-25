# frozen_string_literal: true

require 'test_helper'

class DomainStatusItemTest < ActiveSupport::TestCase
  test 'Name for Notification' do
    test_cases = [
      { params: { category: 'PublishedScripture', subcategory: 'Bible' }, english: 'Published Bible', french: 'Bible publiée' },
      { params: { category: 'PublishedScripture', subcategory: 'New_testament' }, english: 'Published New Testament', french: 'Nouveau Testament publié' },
      { params: { category: 'PublishedScripture', subcategory: 'Portions' }, english: 'Published Scripture Portions', french: 'Portions des Saintes Écritures publiées' },
      { params: { category: 'AudioScripture', subcategory: 'Bible' }, english: 'Audio Bible', french: 'Bible en audio' },
      { params: { category: 'AudioScripture', subcategory: 'New_testament' }, english: 'Audio New Testament', french: 'Nouveau Testament en audio' },
      { params: { category: 'AudioScripture', subcategory: 'Portions' }, english: 'Audio Scripture Portions', french: 'Portions des Saintes Écritures en audio' },
      { params: { category: 'Film', subcategory: 'LumoMatthew' }, english: 'Lumo Matthew', french: 'Lumo Matthieu' },
      { params: { category: 'ScriptureApp' }, english: 'Scripture App', french: 'Appli de Saintes Écritures' },
      { params: { category: 'Research', subcategory: 'Phonology' }, english: 'Phonology', french: 'Phonologie' },
      { params: { category: 'DataCollection', subcategory: 'Lexicon' }, english: 'Updated Lexicon', french: 'Lexique mis à jour' },
      { params: { category: 'DataCollection', subcategory: 'Texts' }, english: 'Updated Text Collection', french: 'Collection de textes mise à jour' },
      { params: { category: 'LiteracyMaterial', subcategory: 'AlphabetChart' }, english: 'Alphabet Chart', french: 'Tableau alphabétique' }
    ]
    test_cases.each do |test_case|
      dsi = DomainStatusItem.new(test_case[:params])
      assert_equal test_case[:english], I18n.t(dsi.name_for_notification, locale: :en)
      assert_equal test_case[:french], I18n.t(dsi.name_for_notification, locale: :fr)
    end
  end
end
