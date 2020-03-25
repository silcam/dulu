# frozen_string_literal: true

class DomainStatusItem < ApplicationRecord
  belongs_to :language
  belongs_to :creator, required: false, class_name: 'Person'
  belongs_to :dsi_location, required: false
  has_and_belongs_to_many :people
  has_and_belongs_to_many :organizations
  has_and_belongs_to_many :bible_books

  def name_for_notification
    case category
    when 'PublishedScripture'
      "Published_#{subcategory}"
    when 'AudioScripture'
      "Audio_#{subcategory}"
    when 'Film'
      subcategory
    when 'ScriptureApp'
      'ScriptureApp'
    when 'Research'
      subcategory
    when 'DataCollection'
      "Updated_#{subcategory}"
    when 'LiteracyMaterial'
      subcategory
      # If you add a case, update domain_status_item_test.rb
    end
  end

  def primary_domain
    # Media is not actually on the list of domains...
    dom = primary_domain_or_media
    dom == 'Media' ? 'Scripture_use' : dom
  end

  def primary_domain_or_media
    case category
    when 'PublishedScripture'
      'Translation'
    when 'AudioScripture', 'Film', 'ScriptureApp'
      'Media'
    when 'Research', 'DataCollection'
      'Linguistics'
    when 'LiteracyMaterial'
      'Literacy'
    end
  end

  def self.categories_for(domain)
    case domain
    when 'Translation'
      %w[PublishedScripture AudioScripture ScriptureApp]
    when 'Linguistics'
      %w[DataCollection Research]
    when 'Literacy'
      %w[LiteracyMaterial]
    else
      []
    end 
  end
end
