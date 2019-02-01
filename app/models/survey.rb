class Survey < ApplicationRecord
  include ApplicationHelper

  has_and_belongs_to_many :status_parameters
  has_many :survey_completions, dependent: :destroy

  def display_name
    name + ' Survey'
  end

  def self.generate_end_a
    status_parameters = StatusParameter.where.not(id: [12, 13, 14])

    Survey.find_by(name: '2017 End A').try(:destroy)
    survey = Survey.create!(name: '2017 End A', open: true)
    survey.status_parameters = status_parameters
    survey
  end

  def report(which_report)
    case which_report
      when 'publications'
        pubs = Publication.where(year: (2015..2017)).order("language_id, year DESC")
        data = [['Language', 'Name', 'English Name', 'French Name', 'Year',
                   'Type', 'Media Type']]
        pubs.each do |pub|
          data << [pub.language.name, pub.nl_name, pub.english_name, pub.french_name,
                   pub.year, I18n.t(pub.kind), safe_t(pub.media_kind)]
        end
        return data

      when 'events'
        events = Event.where("start_date BETWEEN '2015' AND '2017-12-31' OR
                              end_date BETWEEN '2015' AND '2017-12-31'")
        data = [['Languages', 'Name', 'Domain', 'Start', 'End', 'Notes']]
        events.each do |event|
          clusters = event.clusters.collect{|c| c.display_name}.join(', ')
          languages = event.languages.collect{|p| p.name}.join(', ')
          clusters_and_languages = clusters +
              ((clusters.blank? || languages.blank?)? '' : ', ') +
              languages
          data << [clusters_and_languages, event.name, I18n.t(event.domain),
           event.f_start_date.pretty_print, event.f_end_date.pretty_print,
           event.note]
        end
        return data

      when 'domain_updates'
        updates = DomainUpdate.where(date: ('2015'..'2017-12-31'))
                              .unscope(:order)
                              .order("domain, status_parameter_id, date")
        data = [['Language', 'Domain', 'Item', 'Date', 'Previous Date', 'Quantity', 'Previous Quantity', 'Status', 'Previous Status', 'Description', 'Previous Description']]
        updates.each do |update|
          prev_update = update.previous
          item = update.status_parameter.nil? ? 'Other' : update.status_parameter.prompt
          data << [update.language.name, I18n.t(update.domain), item, update.f_date.pretty_print,
           prev_update.try(:f_date).try(:pretty_print), update.number, prev_update.try(:number),
           update.status, prev_update.try(:status), update.note,
           prev_update.try(:note)]
        end
        return data
    end
  end

  def get_csv_report(which_report)
    case which_report
      when 'publications'
        pubs = Publication.where(year: (2015..2017)).order("language_id, year DESC")
        headers = ['Language', 'Name', 'English Name', 'French Name', 'Year',
                    'Type', 'Media Type']
        return csv_report(pubs, headers) do |pub|
          [pub.language.name, pub.nl_name, pub.english_name, pub.french_name,
           pub.year, I18n.t(pub.kind), safe_t(pub.media_kind)]
        end

      when 'events'
        events = Event.where("start_date BETWEEN '2015' AND '2017-12-31' OR
                              end_date BETWEEN '2015' AND '2017-12-31'")
        headers = ['Languages', 'Name', 'Domain', 'Start', 'End', 'Notes']
        return csv_report(events, headers) do |event|
          clusters = event.clusters.collect{|c| c.display_name}.join(', ')
          languages = event.languages.collect{|p| p.name}.join(', ')
          clusters_and_languages = clusters +
              ((clusters.blank? || languages.blank?)? '' : ', ') +
              languages
          [clusters_and_languages, event.name, I18n.t(event.domain),
           event.f_start_date.pretty_print, event.f_end_date.pretty_print,
           sanitize(event.note)]
        end

      when 'domain_updates'
        updates = DomainUpdate.where(date: ('2015'..'2017-12-31')).order("domain, status_parameter_id, date")
        headers = ['Language', 'Domain', 'Item', 'Date', 'Previous Date', 'Quantity', 'Previous Quantity', 'Status', 'Previous Status', 'Description', 'Previous Description']
        return csv_report(updates, headers) do |update|
          prev_update = update.previous
          item = update.status_parameter.nil? ? 'Other' : update.status_parameter.prompt
          [update.language.name, I18n.t(update.domain), item, update.f_date.pretty_print,
            prev_update.try(:f_date).try(:pretty_print), update.number, prev_update.try(:number),
            update.status, prev_update.try(:status), sanitize(update.note),
             sanitize(prev_update.try(:note))]
        end
    end
  end

  def csv_report(objects, headers)
    # data = "\uFEFF" # BOM to get Excel to use UTF-8
    data = "\"sep=\t\"\n" # Hack to get Excel to recognize the seperator
    data += headers.join("\t") + "\n"
    objects.each do |pub|
      data += yield(pub).join("\t")
      data += "\n"
    end
    return data.encode('utf-16')
  end

  def sanitize(text)
    "\"#{text.try(:gsub, '"', "'")}\""
  end
end
