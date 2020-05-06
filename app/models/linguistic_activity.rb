# frozen_string_literal: true

class LinguisticActivity < Activity
  CATEGORIES = %i[Research Workshops].freeze

  default_scope { where(archived: false) }

  has_many :workshops
  accepts_nested_attributes_for :workshops

  validates :title, presence: true, allow_blank: false
  validates :category, inclusion: CATEGORIES

  def category
    attributes['category'].try(:to_sym)
  end

  def name
    "#{I18n.t(category)}: #{title}"
  end

  def domain
    :Linguistics
  end

  def available_stages
    category == :Workshops ?
      workshops.collect(&:name) :
      Stage.stages(:Linguistic)
  end

  # def current_workshop
  #   current_stage.workshop
  # end
  #
  # def next_workshop
  #   cw = current_workshop
  #   return workshops.first if cw.nil?
  #   workshops.find_by(number: (cw.number + 1)) || cw
  # end
  #
  # def next_stage
  #   name = (category == :Workshops) ?
  #              next_workshop.name :
  #              Stage.stage_after(current_stage.name, :Linguistic)
  #
  #   Stage.new(
  #     name: name,
  #     kind: kind,
  #     start_date: Date.today
  #   )
  # end

  def progress
    category == :Workshops ?
      workshop_progress :
      current_stage.progress
  end

  def archivable?
    category == :Workshops ?
      stages.count == workshops.count :
      super
  end

  def empty_activity?
    if category == :Workshops
      super && workshops.empty?
    else
      super
    end
  end

  # def ws_stages
  #   workshops.collect do |ws|
  #     {
  #         workshop: ws,
  #         stage: ws.stage
  #     }
  #   end
  # end

  def self.build(params, language, participants)
    activity = LinguisticActivity.new
    LinguisticActivity.transaction do
      la_params = params.permit(:category, :title).merge(language: language, participants: participants)
      activity = LinguisticActivity.create(la_params)
      if activity.category == :Workshops
        n = 1
        params[:workshops].each do |name|
          unless name.blank?
            activity.workshops.create(number: n, name: name)
            n += 1
          end
        end
      end
    end
    activity
  end

  def self.search(query)
    activities = LinguisticActivity.where('unaccent(title) ILIKE unaccent(:q) OR category ILIKE :q', q: "%#{query}%")
    results = []
    activities.each do |activity|
      results << {
        title: activity.name,
        description: "#{activity.language.name} - #{activity.current_stage.name}",
        route: "/activities/#{activity.id}"
      }
    end
    results
  end

  private

  def workshop_progress
    return 0 if workshops.count == 0 # Unlikely case

    complete = stages.count
    percent = (100 * complete) / workshops.count
    color = percent == 100 ? :purple : :yellow
    [percent, color]
  end
end
