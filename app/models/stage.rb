class Stage < ApplicationRecord

  belongs_to :activity, required: true, touch: true
  belongs_to :stage_name, required: false
  # has_many :program_roles, through: :stage_name

  TRANSLATION_STAGES = %i( Planned Drafting Testing Review_committee Back_translating Ready_for_consultant_check
                            Consultant_check Consultant_checked Published )
  MEDIA_STAGES = %i( Planned Application Script Recording Mastering Published )
  LINGUISTIC_STAGES = %i( Planned Research Drafting Review Published )

  TRANSLATION_STAGE_ROLES = {
                              Drafting: [:Translator],
                              Testing: [:Translator],
                              Back_translating: [:Translator],
                              Ready_for_consultant_check: [:TranslationConsultant, :TranslationConsultantTraining, :Exegete],
                              Consultant_check: [:TranslationConsultant, :TranslationConsultantTraining, :Exegete],
                              Consultant_checked: [:TranslationConsultant, :TranslationConsultantTraining, :Exegete]
                            }

  audited associated_with: :activity

  validates :start_date, presence: {message: "year can't be blank"}, allow_blank: false
  validates :start_date, fuzzy_date: true
  validates :kind, inclusion: [:Translation]
  validates :name, inclusion: TRANSLATION_STAGES

  def self.new_for activity
    existing = activity.current_stage
    Stage.new({
      name: stage_after(existing.name, existing.kind),
      kind: existing.kind,
      start_date: Date.today})
  end
  
  # def name
  #   self.stage_name.name
  # end

  def kind
    self.attributes['kind'].try(:to_sym)
  end

  def name
    self.attributes['name'].try(:to_sym)
  end

  def f_start_date
    begin
      FuzzyDate.from_string start_date
    rescue FuzzyDateException
      nil
    end
  end

  def progress
    case kind
      when :Translation
        return translation_progress
    end
  end

  def roles
    case kind
      when :Translation
        TRANSLATION_STAGE_ROLES[name] || []
    end
  end

  def self.first_stage(kind)
    stages(kind).first
  end

  def self.stage_after(stage, kind)
    stages = stages(kind)
    stage = stage.to_sym
    (stage == stages.last) ? stage : stages[stages.index(stage.to_sym) + 1]
  end

  private

  def self.stages(kind)
    case kind.to_sym
      when :Translation
        TRANSLATION_STAGES
    end
  end

  def translation_progress
    case name
      when :Planned
        return 0, :red
      when :Drafting
        return 10, :red
      when :Testing
        return 20, :orange
      when :Review_committee
        return 40, :yellow
      when :Back_translating
        return 60, :light_green
      when :Ready_for_consultant_check
        return 75, :dark_green
      when :Consultant_check
        return 75, :light_blue
      when :Consultant_checked
        return 95, :dark_blue
    end
    return 100, :purple
  end

  # def generic_progress
  #   return (100 * level) / StageName.last_stage(kind).level, :blue
  # end
end
