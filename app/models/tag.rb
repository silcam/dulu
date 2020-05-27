# frozen_string_literal: true

class Tag < ApplicationRecord
  has_and_belongs_to_many :events

  # TODO: change to just `name`
  validates :tagname, presence: true

  def self.search(query)
    Tag.where('tagname ILIKE ?', "#{query}%")
  end
end
