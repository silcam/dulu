class StageName < ApplicationRecord

  has_many :stages
  has_and_belongs_to_many :program_roles

  def self.first_translation_stage
    return self.first_stage(:translation)
  end

  def self.first_stage(kind)
    return StageName.find_by(level: 1, kind: kind)
  end

  def self.last_stage(kind)
    return StageName.where(kind: kind).order(:level).last
  end


  def next_stage
    stage = StageName.find_by(kind: self.kind, level: self.level + 1)
    stage ? stage : self
  end

  def translated_name
    return I18n.translate(name)
  end

  def progress
    case kind
      when :translation
        return translation_progress
      else
        return generic_progress
    end
  end

  private

  def translation_progress
    case self.level
    when 1, 2
      return 0
    when 3
      return 20
    when 4
      return 40
    when 5
      return 60
    when 6, 7
      return 75
    when 8
      return 95
    end
    return 100
  end

  def generic_progress
    return (100 * level) / StageName.last_stage(kind).level
  end

end
