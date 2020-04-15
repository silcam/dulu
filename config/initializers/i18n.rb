# frozen_string_literal: true

module I18n
  class MissingTranslationHandler < ExceptionHandler
    def call(exception, locale, key, options)
      if exception.is_a?(MissingTranslation) && I18n.locale == :en
        prettify key.to_s
      else
        super
      end
    end

    def prettify(key)
      key
        .gsub(/([a-z])([A-Z])/, '\1 \2')
        .gsub(/_(\w)/) { |_| " #{Regexp.last_match(1).upcase}" }
    end
  end
end

Rails.application.config.after_initialize do
  I18n.exception_handler = I18n::MissingTranslationHandler.new
end
