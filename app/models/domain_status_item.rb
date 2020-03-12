# frozen_string_literal: true

class DomainStatusItem < ApplicationRecord
  belongs_to :language
  belongs_to :creator, required: false, class_name: 'Person'
  belongs_to :dsi_location, required: false
  has_and_belongs_to_many :people
  has_and_belongs_to_many :organizations
  has_and_belongs_to_many :bible_books

  def self.categories_for(domain)
    case domain
    when 'Translation'
      %w[PublishedScripture AudioScripture ScriptureApp]
    when 'Linguistics'
      %w[DataCollection Research]
    else
      []
    end 
  end
end
