class ViewedReport < ApplicationRecord
  belongs_to :person, required: true
  belongs_to :report, required: true

  default_scope { order(updated_at: :desc) }

  def self.mark_viewed(report, person)
    viewed_report = report.viewed_reports.find_by(person: person)
    if viewed_report
      viewed_report.touch
    else
      ViewedReport.create(report: report, person: person)
    end
  end
end
