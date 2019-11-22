module TranslationHelper
  extend ActiveSupport::Concern

  def safe_t(*args)
    begin
      I18n.t(*args)
    rescue Exception
      ""
    end
  end

  def try_t(key, options = {})
    options[:default] = key.to_s
    t(key, options)
  end

  alias tt try_t

  def t_gen(key, feminine, options = {})
    gender = feminine ? :f : :m
    new_key = "#{key}_#{gender}"
    if I18n.exists? new_key, I18n.locale
      t new_key, options
    else
      t key, options
    end
  end

  # Generate hash of translations for a key
  def t_hash(key)
    translations = {}
    [:en, :fr].each do |locale|
      translations[locale] = I18n.t(key, locale: locale, default: key.to_s.titleize)
    end
    translations
  end

  # Translate each element in the string surrounded by %{}
  def t_phrase(s)
    s.gsub(/%\{(\w+)\}/) { |m| t($1) }
  end

  def t_select_options(array, selected = nil)
    options_for_select(array.collect { |item| [t(item), item] }, selected)
  end

  def t_params(key, subs = {})
    { key: key, subs: subs }
  end

  # params type { key: string/sym, subs?: { [key]: string/sym/params } }
  def t_nested(params, locale, &extra_transform)
    subs = params[:subs] || {}
    subs.transform_values! { |v| v.is_a?(Hash) ? t_nested(v, locale) : v }
    subs = extra_transform.call(subs) if block_given?
    subs.merge!(locale: locale)
    I18n.t(params[:key], subs)
  end
end
