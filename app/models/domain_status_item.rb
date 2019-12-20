class DomainStatusItem < ApplicationRecord
  belongs_to :language
  belongs_to :creator, required: false, class_name: "Person"
  has_and_belongs_to_many :people
  has_and_belongs_to_many :organizations
  has_and_belongs_to_many :bible_books

  def self.categories_for(domain)
    return case domain
           when "Translation"
             ["PublishedScripture", "AudioScripture", "ScriptureApp"]
           when "Linguistics"
             ["DataCollection", "Research"]
           else
             []
           end
  end
end
