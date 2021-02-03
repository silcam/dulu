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
      { params: { category: 'LiteracyMaterial', subcategory: 'AlphabetChart' }, english: 'Alphabet Chart', french: 'Abécédaire' },
      { params: { category: 'LiteracyMaterial', subcategory: 'AlphabetBook' }, english: 'Alphabet Book', french: 'Livret d\'alphabet' },
      { params: { category: 'LiteracyMaterial', subcategory: 'Primer_1' }, english: 'Primer 1', french: 'Syllabaire 1' },
      { params: { category: 'LiteracyMaterial', subcategory: 'Primer_2' }, english: 'Primer 2', french: 'Syllabaire 2' },
      { params: { category: 'LiteracyMaterial', subcategory: 'TransitionManual' }, english: 'Transition Manual', french: 'Manuel de transition' },
      { params: { category: 'LiteracyMaterial', subcategory: 'BibleStoryBook' }, english: 'Bible Story Book', french: 'Histoire biblique' },
      { params: { category: 'LiteracyMaterial', subcategory: 'StoryBook' }, english: 'Story Book', french: 'Livre de contes' },
      { params: { category: 'LiteracyMaterial', subcategory: 'InformationalBook' }, english: 'Informational Book', french: 'Livre informatif' },
      { params: { category: 'LiteracyMaterial', subcategory: 'MathBook' }, english: 'Math Book', french: 'Livre de calcul' }
    ]
    test_cases.each do |test_case|
      dsi = DomainStatusItem.new(test_case[:params])
      assert_equal test_case[:english], I18n.t(dsi.name_for_notification, locale: :en)
      assert_equal test_case[:french], I18n.t(dsi.name_for_notification, locale: :fr)
    end
  end
end
