require 'test_helper'

class TranslationKeyTest < ActiveSupport::TestCase
  test 'All en keys are in fr' do
    en = YAML.load_file('config/locales/en.yml')['en']
    fr = YAML.load_file('config/locales/fr.yml')['fr']

    check_keys(en, fr, '')
  end

  def check_keys(standard, check, key_prefix)
    standard.each_key do |key|
      assert check[key], "#{key_prefix}.#{key} key should exist in fr translations."
      if standard[key].respond_to? :each_key
        check_keys(standard[key], check[key], "#{key_prefix}.#{key}")
      end
    end
  end
end