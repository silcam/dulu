class Activity < ApplicationRecord

  belongs_to :program, required: true, touch: true
  # belongs_to :bible_book, required: false
  has_many :stages
  has_and_belongs_to_many :participants
  has_many :people, through: :participants

  audited associated_with: :program

  validates :type, presence: true

  after_touch :update_current_stage

  def current_stage
    self.stages.find_by(current: true) or
        stages.new(name: Stage.first_stage(kind), kind: kind)
  end

  def kind
    type.gsub('Activity', '').to_sym
  end

  def progress
    self.current_stage.progress
  end

  def stage_name
    self.current_stage.name
  end

  def participants_for_my_stage
    roles = current_stage.roles
    current_participants.where_has_role_among roles
  end

  def current_participants
    participants.where(end_date: nil)
  end

  def stages_ordered_desc
    stages.order('start_date DESC, id DESC')
  end

  def stages_ordered_asc
    stages.order 'start_date ASC, id ASC'
  end

  def self.types_for_select
    [
        [I18n.t(:Bible_translation), 'TranslationActivity'],
        [I18n.t(:Linguistic), 'LinguisticActivity'],
        [I18n.t(:Media), 'MediaActivity']
    ]
  end

  def self.subclass_from_text(str)
    case str
      when 'TranslationActivity'
        TranslationActivity
      when 'MediaActivity'
        MediaActivity
      when 'LinguisticActivity'
        LinguisticActivity
    end
  end

  def self.search(query)
    TranslationActivity.search(query) +
        MediaActivity.search(query) +
        LinguisticActivity.search(query)
  end

  private

  def update_current_stage
    my_stages = stages.order(start_date: :desc, id: :desc)
    unless my_stages.empty?
      my_stages.update(current: false)
      my_stages.first.update(current: true)
    end
  end
end
