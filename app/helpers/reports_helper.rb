module ReportsHelper
  def abbreviate_book(name)
    name.gsub(" ", "").slice(0, 3)
  end
end
