class Activity < ApplicationRecord

  belongs_to :program, touch: true
  belongs_to :bible_book, required: false
  has_many :stages
  has_and_belongs_to_many :participants
  has_many :people, through: :participants

  validates :type, presence: true

  after_touch :update_current_stage

  def current_stage
    self.stages.find_by(current: true) or
        stages.new(stage_name: StageName.first_stage(kind))
  end

  def update_current_stage
    my_stages = stages.order(start_date: :desc, id: :desc)
    unless my_stages.empty?
      my_stages.update(current: false)
      my_stages.first.update(current: true)
    end
  end

  def kind
    type.gsub('Activity', '').downcase
  end

  def progress
    self.current_stage.progress
  end

  def stage_name
    self.current_stage.name
  end

  def participants_for_my_stage
    current_participants.where(program_role: current_stage.program_roles)
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

  def build(params)
    # Type specific implementation runs first
    save!
    if params[:stage_name_id]
      add_a_stage params
    end

    return if params[:participant_ids].nil?
    params[:participant_ids].each do |participant_id|
      participants << Participant.find(participant_id)
    end
  end

  def self.types_for_select
    [[I18n.t(:Bible_translation), 'TranslationActivity']
    ]
  end

  def self.search(query)
    TranslationActivity.search(query)
  end

  private

  def add_a_stage(params)
    stage_one = Stage.new(activity: self,
                          stage_name_id: params[:stage_name_id],
                          start_date: params[:stage_start_date],
                          current: true)
    if stage_one.valid?
      stage_one.save
    else
      destroy
      raise ActiveRecord::RecordInvalid.new(stage_one)
    end
  end
end
