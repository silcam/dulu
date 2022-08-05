class ErrorMailer < ApplicationMailer
  def error_report(content)
    @content = content
    mail to: admin_email, from: admin_email, subject: "Dulu Javascript Error"
  end

  private

  def admin_email
    Rails.application.secrets.admin_email
  end
end
